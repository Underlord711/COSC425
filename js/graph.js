function toggleMatrix() {
  const matrixContainer = document.getElementById("matrixContainer");
  isMatrixVisible = !isMatrixVisible;
  matrixContainer.style.display = isMatrixVisible ? "block" : "none";
}
function displayGraph() {
  const table = document.getElementById("graphTable");
  table.innerHTML = ""; // Clear previous content

  // Create header row (with an extra cell at the top-left)
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = '<th class="border px-4 py-2 sticky"></th>'; // Top-left empty cell
  for (
    let i = 0;
    i < Object.keys(graph["version" + version]).length - 1;
    i++
  ) {
    headerRow.innerHTML += `<th class="border px-4 py-2 text-center sticky">${String.fromCharCode(
      65 + i
    )}</th>`;
  }
  table.appendChild(headerRow);

  // Create rows for each vertex
  for (const [vertex, edges] of Object.entries(
    graph["version" + version]
  )) {
    if (noClass.includes(vertex)) continue;
    const row = document.createElement("tr");
    row.innerHTML = `<th class="border px-4 py-2 text-center row-sticky">${vertex}</th>`; // Row header with sticky class
    for (const targetVertex of Object.keys(graph["version" + version])) {
      if (noClass.includes(targetVertex)) continue;
      else if (vertex === targetVertex) {
        row.innerHTML +=
          '<td class="border px-4 py-2 text-center">x</td>'; // Self-loop indicator
      } else {
        const weight =
          edges[targetVertex] !== undefined ? edges[targetVertex] : "x";
        row.innerHTML += `<td class="editable border px-4 py-2 text-center" contenteditable="true" onblur="updateWeight('${vertex}', '${targetVertex}', this.innerText)">${weight}</td>`;
      }
    }
    table.appendChild(row);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("changeLayout").onchange = function () {
    if (this.value === "Circle") layout = "circle";
    else if (this.value === "CoSE") layout = "cose";
    else if (this.value === "CiSE") layout = "cise";
    else if (this.value === "fCoSE") layout = "fcose";
    drawCytoscapeGraph();
  };
});


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function drawCytoscapeGraph(me = 'cy') {
  const elements = [];
  let nodeColor1 = hexToRgb($("#nodeColor1Input").val());
  let nodeColor2 = hexToRgb($("#nodeColor2Input").val());
  let safeEdgeColor = $("#safeEdgeInput").val();
  let unsafeEdgeColor = $("#unsafeEdgeInput").val();
  let lockNode = document.getElementById("lockNodePosition").checked;
  let cy;

  for (const [source, edges] of Object.entries(graph["version" + version])) {
    if (noClass.includes(source)) continue;

    elements.push({ data: { id: source, rel: edges.weight } });

    for (const [destination, weight] of Object.entries(edges)) {
      if (noClass.includes(destination)) continue;
      if (source !== destination) {
        elements.push({
          data: {
            id: destination,
            rel: graph["version" + version][destination]["weight"],
          },
        });
        elements.push({
          data: {
            id: `${source}-${destination}`,
            source: source,
            target: destination,
            label: weight.toFixed(2),
          },
        });
      }
    }
  }

  // graph node and edge styles
  let nodeSize, fontSize, edgeWidth;
  if (layout === "circle") {
    nodeSize = "70%";
    fontSize = "50%";
    edgeWidth = 5;
  } else if (layout === "cose") {
    nodeSize = "5%";
    fontSize = "5%";
    edgeWidth = 1;
  } else if (layout === "cise") {
    nodeSize = "7%";
    fontSize = "7%";
    edgeWidth = 1;
  } else if (layout === "fcose") {
    nodeSize = "10%";
    fontSize = "10%";
    edgeWidth = 1;
  }

  cy = cytoscape({
    container: document.getElementById(me),
    elements: elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": function (elem) {
            let r = nodeColor1[0] + parseFloat(elem.data("rel")) * (nodeColor2[0] - nodeColor1[0]);
            let g = nodeColor1[1] + parseFloat(elem.data("rel")) * (nodeColor2[1] - nodeColor1[1]);
            let b = nodeColor1[2] + parseFloat(elem.data("rel")) * (nodeColor2[2] - nodeColor1[2]);
            return `rgb(${r}, ${g}, ${b})`;
          },
          label: function (elem) {
            return elem.data("id") + "\n" + elem.data("rel");
          },
          color: "black",
          "font-size": fontSize,
          "text-wrap": "wrap",
          height: nodeSize,
          width: nodeSize,
        },
      },
      {
        selector: "edge",
        style: {
          width: edgeWidth,
          "line-color": function (elem) {
            let s = graph["version" + version][elem.data("source")]["weight"];
            let t = graph["version" + version][elem.data("target")]["weight"];
            let w = elem.data("label");
            let weightDiff = Math.abs(s - t);
            return weightDiff > w ? unsafeEdgeColor : safeEdgeColor;
          },
          label: "data(label)",
          "font-size": fontSize,
          "text-justification": "left",
          "text-margin-x": 5,
          color: "black",
        },
      },
    ],
  });

  // layout application
  if (layout === "circle") {
    cy.layout({
      name: "circle",
      avoidOverlap: true,
      spacingFactor: 3,
      animate: true
    }).run();
  } else if (layout === "cose" || layout === "fcose") {
    cy.layout({
      name: layout,
      avoidOverlap: true,
      nodeOverlap: 0,
      spacingFactor: 1.5,
      animate: "end"
    }).run();
  } else if (layout === "cise") {
    let clusters = [];
    try {
      clusters = cy.elements().markovClustering({
        expandFactor: 2,
        inflateFactor: 2,
        multFactor: 1,
        maxIterations: 10,
      });
    } catch (error) {
      console.warn("Markov Clustering not available, using default.");
    }

    clusters.forEach((cluster, i) => {
      cluster.forEach((node) => node.data("clusterID", i));
    });

    const arrayOfClusterArrays = [];
    cy.nodes().forEach((node) => {
      const clusterID = node.data("clusterID");
      if (!arrayOfClusterArrays[clusterID]) arrayOfClusterArrays[clusterID] = [];
      arrayOfClusterArrays[clusterID].push(node.id());
    });

    cy.layout({
      name: "cise",
      clusters: arrayOfClusterArrays,
      animate: "end",
      nodeSeparation: 75,
      avoidOverlap: true,
      nodeOverlap: 0,
      nodeRepulsion: () => 5000
    }).run();
  }

  // lock node with weight one after layout finishes
  if (lockNode) {
    cy.once("layoutstop", () => {
      const node = cy.getElementById(nodeWeightOne);
      if (node) {
        const boundingBox = cy.elements().boundingBox();
        const centerX = (boundingBox.x1 + boundingBox.x2) / 2;
        const topY = boundingBox.y1 - 10; // push it a little above top edge
        node.position({ x: centerX, y: topY });
        cy.fit(cy.elements(), 20);
      }
    });
  }

  // set original value of text box in option menu
  document.getElementById("lockNodeValue").value = nodeWeightOne;

  // sidebar functionality
  cy.on("tap", "*", function (evt) {
    var offcanvasElement = document.getElementById("offcanvasScrolling");
    var bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
    bsOffcanvas.show();
  });

  cy.on("tap", "node", function (evt) {
    let text;
    var node = evt.target;
    $("#offBody").text("");
    $("#offcanvasScrollingLabel").html("Node: " + node.id());
    for (const [destination, weight] of Object.entries(
      graph["version" + version][node.id()]
    )) {
      text = destination + " : " + weight;
      $("#offBody").append("<li>" + text + "</li>");
    }
    $("#offBody").append(
      `</br><button class="underline bg-maroon px-5 py-3 text-lg rounded-md hover:bg-orange-500" onclick=\"testNode('${node.id()}')\">Test Node</button>`
    );
  });

  cy.on("tap", "edge", function (evt) {
    let text;
    var edge = evt.target;
    let source = edge.data("source");
    let target = edge.data("target");
    $("#offBody").text("");
    $("#offcanvasScrollingLabel").html("Edge: " + edge.data("id"));
    $("#offBody").append("<li>Source : " + source + "</li>");
    $("#offBody").append("<li>Destination : " + target + "</li>");
    $("#offBody").append("<li>Weight : " + edge.data("label") + "</li>");
    $("#offBody").append(
      `</br><button class="underline bg-maroon px-5 py-3 text-lg rounded-md hover:bg-orange-500" onclick=\"testEdge('${source}', '${target}')\">Test Edges</button>`
    );
  });
}