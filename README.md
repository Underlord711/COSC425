<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weighted Undirected Graph Generator</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/cytoscape@3.24.0/dist/cytoscape.min.js"></script>
    <!-- cytoscape import -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.0/cytoscape.min.js"></script>
    <script src="https://unpkg.com/layout-base/layout-base.js"></script>
    <!-- for fcose and cise layout -->
    <script src="https://unpkg.com/avsdf-base/avsdf-base.js"></script>
    <script src="https://unpkg.com/cose-base/cose-base.js"></script>
    <script src="https://unpkg.com/cytoscape-fcose/cytoscape-fcose.js"></script>
    <script src="https://unpkg.com/cytoscape-cise/cytoscape-cise.js"></script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="css/matrix.css" />
    <link rel="stylesheet" href="css/nav.css" />
  </head>
  <body class="bg-gray-100 p-6">
    <!-- Navigation Bar -->
    <nav class="bg-maroon p-2 border-4 border-gold rounded-lg">
      <ul class="flex space-x-6">
        <li>
          <img src="photos/bury.jpeg" alt="Logo" class="navbar-logo mt-1" />
        </li>
        <li>
          <button
            onclick="generateGraph()"
            class="underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500"
          >
            Generate graph
          </button>
        </li>
            <li><button type="button" class="btn underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Character Sheet
        </button></li>
        <li>
          <button
            onclick="uploadJSON()"
            class="underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500"
          >
            Upload JSON
          </button>
        </li>
        <li>
          <button
            onclick="toggleMatrix()"
            class="updateClass underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500 hidden"
          >
            Show matrix
          </button>
        </li>
        <li>
          <button
            onclick="downloadJSON()"
            class="updateClass underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500 hidden"
          >
            Download JSON
          </button>
        </li>
      <li>
        <button type="button"
          class="updateClass underline mt-3 bg-maroon text-white px-5 py-3 text-lg rounded-md hover:bg-orange-500 hidden"
          data-bs-toggle="modal" data-bs-target="#optionsModal">
          Options
        </button>
      </li>
      </ul>
    </nav>
    <div class="slider-container">
      <input
        type="range"
        min="3"
        max="5"
        value="1"
        class="slider"
        id="mySlider"
      />
      <div class="slider-value" id="sliderValue">Tolerance Level</div>
    </div>

    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-3">
      <h1 class="text-2xl font-bold mb-4">
        Weighted Undirected Graph Generator
      </h1>

      <div class="space-y-4">
        <div>
          <label for="numVertices" class="block text-sm font-medium"
            >Number of Vertices:</label
          >
          <input
            type="number"
            id="numVertices"
            value="10"
            min="4"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div> 
          <label for="weight1" class="block text-sm font-medium"
            >Weight for Edge Type 1:</label
          >
          <input
            type="number"
            id="weight1"
            value="0.2"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div>
          <label for="weight2" class="block text-sm font-medium"
            >Weight for Edge Type 2:</label
          >
          <input
            type="number"
            id="weight2"
            value="0.9"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div class="space-x-4">
        <div class="modal fade" id="optionsModal" tabindex="-1" aria-labelledby="optionsModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="optionsModalLabel">Algorithm Options</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <label id="alertsLabel" for="runAllNodes" class="updateClass" style="display: none">Run All
                  Nodes</label>
                <input type="checkbox" id="runAllNodes" class="updateClass" style="display: none" checked />
                <!-- trying to add tooltips to options menu -->
                <!-- <div class="tooltip updateClass">
                  WORDS WORDS WORDS
                  <span class="tooltiptext updateClass">run all nodes tooltip</span>
                </div> -->
                </br>
                <label id="pastEdgesLabel" for="allowPastEdges" class="updateClass" style="display: none">Allow Past
                  Edges</label>
                <input type="checkbox" id="allowPastEdges" class="updateClass" style="display: none" checked />
                </br>
                <label id="randomizationLabel" for="randomization" class="updateClass"
                  style="display: none">Randomization</label>
                <input type="checkbox" id="randomization" class="updateClass" style="display: none" checked />
                </br>
                <label for="nodeColor1Input" class="updateClass" style="display: none">Node Color 1</label>
                <input type="color" id="nodeColor1Input" class="updateClass border px-1 py-1 rounded"
                  style="display: none" value="#DEDEDE" />
                </br>
                <label for="nodeColor2Input" class="updateClass" style="display: none">Node Color 2</label>
                <input type="color" id="nodeColor2Input" class="updateClass border px-1 py-1 rounded"
                  style="display: none" value="#000000" />
                </br>
                <label for="safeEdgeInput" class="updateClass" style="display: none">Safe Edge Color</label>
                <input type="color" id="safeEdgeInput" class="updateClass border px-1 py-1 rounded"
                  style="display: none" value="#00FF00" />
                </br>
                <label for="unsafeEdgeInput" class="updateClass" style="display: none">Unsafe Edge Color</label>
                <input type="color" id="unsafeEdgeInput" class="updateClass border px-1 py-1 rounded"
                  style="display: none" value="#FF0000" />
                </br>
                <li>
                  <label for="changeLayout" class="updateClass" style="display: none">Graph Layout</label>
                  <select id="changeLayout" class="updateClass mt-8"
                    style="display: none; background-color: transparent; color: black; border: 1px solid black;">
                    <option select="selected">Circle</option>
                    <option>CoSE</option>
                    <option>fCoSE</option>
                    <option>CiSE</option>
                  </select>
                </li>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
          <button
            onclick="patchNotes()"
            id="patchBtn"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none updateClass"
            style="display: none"
          >
            Patch Notes
          </button>
          <button
            onclick="runAlgorithm(parseInt(document.getElementById('inputValue').value))"
            style="display: none"
            id="runAlgorithm"
            class="updateClass bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none"
          >
            Run Algorithm
          </button>
          <input
            type="number"
            value="1"
            id="inputValue"
            class="updateClass border px-2 py-1 rounded max-w-10"
            style="display: none"
          />
            <button onclick="addGraph()" id="GraphTwo"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none updateClass" style="display:none;">Add Graph</button>
        </div>

        <div class="mt-4">
          <input
            type="file"
            id="fileInput"
            accept=".json"
            onchange="uploadJSON()"
            class="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
          />
          <button
            id="uploadBtn"
            style="display: none"
            onclick="uploadJSON()"
            class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Upload JSON
          </button>
        </div>
      </div>

      <h2 class="text-xl font-semibold mt-6">Generated Graph:</h2>
      <div class="flex items-start">
        <div class="flex-none mr-4">
          Version: <span id="versionDisplay">1</span>
        </div>
        <div class="flex-none mr-4">
          SecondVersion: <span id="versionDisplay2">1</span>
        </div>

        <div
          id="matrixContainer"
          class="flex-grow overflow-x-auto overflow-y-auto max-h-96 mx-4 self-center"
          style="display: none"
        >
          <table
            id="graphTable"
            class="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg text-sm"
          ></table>
        </div>

        <div class="flex-none ml-auto">
          <button
            onclick="refresh()"
            id="reset"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none"
          >
            Reset
          </button>
          <button
            onclick="previous()"
            id="prev"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none"
          >
            Prev
          </button>
          <button
            onclick="next()"
            id="next"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none"
          >
            Next
          </button>
          <button
            onclick=""
            id="play"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none"
          >
            ▶
          </button>
          <button
            onclick="previousTwo()"
            id="prev2"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none;"
            style="display: none"
          >
            Second Graph Prev
          </button>
          <button
            onclick="nextTwo()"
            id="next2"
            class="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 focus:outline-none;"
            style="display: none"
          >
            Second Graph Next
          </button>
        </div>
      </div>

        <div class="grid gap-4 grid-cols-1" id="field">
            <div id="cy" class="h-[600px] border border-gray-300" style="width: auto; height: 600px;"></div>
        </div>
    </div>

    <div
      class="offcanvas offcanvas-start !w-[200px]"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabindex="-1"
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
    >
      <div class="offcanvas-header">
        <h5
          class="offcanvas-title"
          id="offcanvasScrollingLabel"
          contenteditable="true"
        >
          Node:
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body" contenteditable="true" id="offBody">
        <p></p>
      </div>
    </div>

                        <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Character Sheet</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul></ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" onclick="addPerson()" class="btn btn-primary">Add Person</button>
          </div>
        </div>
      </div>
    </div>

    <script>
    let displays = {};
      let graph = {};
      let version = 1;
      let versionTwo = 1;
      let isMatrixVisible = false; // track whether the matrix is visible or not
      let layout = "circle"; // layout used for cytoscape
      let noClass = ["weight", "Past Edges", "changes"];
      const MAX_WEIGHT = 0.8;
      let playInterval; // used for play button
      let isPlaying = false;
      let toleranceLevel = 4;

      let nodeWeightOne; // used to fix position of node with weight 1 in graph
      

      changeNotes = []; //Need this for Patch Notes

    nodeColor1Input.addEventListener("change", drawCytoscapeGraph, false);
    nodeColor2Input.addEventListener("change", drawCytoscapeGraph, false);
      safeEdgeInput.addEventListener("change", drawCytoscapeGraph, false);
      unsafeEdgeInput.addEventListener("change", drawCytoscapeGraph, false);

      // function updateDisplay() {
      //    if (dummy == 'grid') {
      //        dummy = 'circle';
      //    }
      //    else {
      //        dummy = 'grid';
      //    }
      //    drawCytoscapeGraph();
      // }
      function Slider(callback) {
        const slider = document.getElementById("mySlider");
        const sliderValue = document.getElementById("sliderValue");

        slider.addEventListener("input", function () {
          let value = slider.value;

          if (value == 3) {
            sliderValue.textContent = "Willing to change";
            toleranceLevel = 3;
          } else if (value == 4) {
            sliderValue.textContent = "Open to change";
            toleranceLevel = 4;
          } else if (value == 5) {
            toleranceLevel = 5;
            sliderValue.textContent = "Unwilling to change";
          }

          callback(value);
        });
      }

        function generateGraph() {
            let vertexes = [];
            let weights = [];
            $('.modal-body ul li :text').each(function(me){
                vertexes.push($(this).val());
                weights.push($(this).next().val());
            });
            console.log(vertexes);
            console.log(weights);
            const numVertices = parseInt(document.getElementById('numVertices').value);
            const weight1 = parseFloat(document.getElementById('weight1').value);
            const weight2 = parseFloat(document.getElementById('weight2').value);
            if (Object.keys(graph).length != 0) {
                if (confirm('Do you want to save this json file before overwriting graph?')) {
                    downloadJSON();
                }
            }
            let one = false;
            graph = { version1: {} };
            if (vertexes.length == 0){
                for (let i = 0; i < numVertices; i++) {
                    const vertex = String.fromCharCode(65 + i);
                    let w = Math.random().toFixed(2);

                    if (w > MAX_WEIGHT && !one) {
                        w = 1;
                        one = true;
                    } else if (w > MAX_WEIGHT) {
                        w = MAX_WEIGHT;
                    }

                    vertexes.push(vertex);
                    weights.push(w);

                    graph['version' + version][vertex] = { weight: w }; //Initialing the object for each vertex.
                    graph['version' + version][vertex]['Past Edges'] = [];
                }
            }
            else {
                for (let i = 0; i < vertexes.length; i++){
                    graph['version' + version][vertexes[i]] = { weight : weights[i]};
                    graph['version' + version][vertexes[i]]['Past Edges'] = [];

                }
            }

            if (!one) {
                let vertex = vertexes[Math.floor(Math.random() * vertexes.length)];
                graph['version' + version][vertex]['weight'] = 1;
            }

            const edgesCount = Array(vertexes.length).fill(0);
            const maxEdgesPerVertex = 3;
            const totalEdgesNeeded = (vertexes.length * maxEdgesPerVertex) / 2;

            let edgesCreated = 0;

            while (edgesCreated < totalEdgesNeeded) {
                let sourceIndex = Math.floor(Math.random() * vertexes.length);
                let destinationIndex;

                let attempts = 0;
                do {
                    destinationIndex = Math.floor(Math.random() * vertexes.length);
                    attempts++;
                    if (attempts > 100) {
                        console.log('Too many attempts to find a valid edge.');
                        break;
                    }
                } while (
                    destinationIndex === sourceIndex || // Prevent self-loops
                    edgesCount[sourceIndex] >= maxEdgesPerVertex ||
                    edgesCount[destinationIndex] >= maxEdgesPerVertex ||
                    graph.version1[vertexes[sourceIndex]][vertexes[destinationIndex]]
                );

                if (edgesCount[sourceIndex] < maxEdgesPerVertex && edgesCount[destinationIndex] < maxEdgesPerVertex) {
                    const source = vertexes[sourceIndex];
                    const destination = vertexes[destinationIndex];
                    const weight = Math.random() < 0.5 ? weight1 : weight2;

                    graph['version' + version][source][destination] = weight;
                    graph['version' + version][destination][source] = weight;

                    edgesCount[sourceIndex]++;
                    edgesCount[destinationIndex]++;
                    edgesCreated++;
                }
            }

            // graph['version1']['changes'] = {};
            graph['version1']['changes'] = [];

            refresh();
            $('.updateClass').css('display', 'inline');
        }

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

      function updateWeight(source, target, newWeight) {
        // prevent updating version when no change was made
        if (
          parseFloat(graph["version" + version][source][target]) ===
          parseFloat(newWeight.trim())
        )
          return;

        const weight = parseFloat(newWeight);
        const str = String(newWeight);
        let c = [];

        // copy graph
        graph["version" + (version + 1)] = JSON.parse(
          JSON.stringify(graph["version" + version])
        );
        version++;

        // update edge
        if (weight === 0 || str.toLowerCase() === "x") {
          const edgeWeight = parseFloat(
            graph["version" + version][source][target]
          );

          // add target to source past edges
          let sourceEdges = graph["version" + version][source]["Past Edges"];
          if (!sourceEdges.includes(target)) sourceEdges.push(target);
          graph["version" + version][source]["Past Edges"] = sourceEdges;

          // add source to target past edges
          let targetEdges = graph["version" + version][target]["Past Edges"];
          if (!targetEdges.includes(source)) targetEdges.push(source);
          graph["version" + version][target]["Past Edges"] = targetEdges;

          delete graph["version" + version][source][target];
          delete graph["version" + version][target][source];

          let changesString = `${source} -${edgeWeight}- ${target} - broken`;
          c.push(changesString);
          addNotes(changesString);
          graph["version" + version]["changes"] = c;
        } else if (!isNaN(weight) && weight > 0) {
          graph["version" + version][source][target] = weight;
          graph["version" + version][target][source] = weight;

          let changesString = `${source} -${newWeight}- ${target} - updated`;
          c.push(changesString);
          addNotes(changesString);
          graph["version" + version]["changes"] = c;
        } else {
          alert("Invalid weight. Please enter a positive number or zero.");
          version--;
        }

        // update display
        refresh();
        $("#versionDisplay").text(version);
      }

      // function layoutCircle() {
      //  dummy = 'circle';
      //  drawCytoscapeGraph();
      // }

      // function layoutCose() {
      //  dummy = 'cose';
      //  drawCytoscapeGraph();
      // }
      document.getElementById("changeLayout").onchange = function () {
        if (this.value === "Circle") layout = "circle";
        else if (this.value === "CoSE") layout = "cose";
        else if (this.value === "CiSE") layout = "cise";
        else if (this.value === "fCoSE") layout = "fcose";
        drawCytoscapeGraph();
      };

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
        let cy;

        // get elements of graph
        for (const [source, edges] of Object.entries(
          graph["version" + version]
        )) {
          if (noClass.includes(source)) continue;
          elements.push({ data: { id: source, rel: edges.weight } });
          // if (source === nodeWeightOne) {
          //    elements.push({ data: { id: source, rel: edges.weight }, position: { x: 200, y: 200, locked: true } });
          // } else {
          //    elements.push({ data: { id: source, rel: edges.weight } });
          // }

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

        // graph styles based on layout
        let nodeSize, fontSize, edgeWidth;
        if (layout === "circle") {
          nodeSize = "50px";
          fontSize = "50px";
          edgeWidth = 1;
        } else if (layout === "cose") {
          nodeSize = "5px";
          fontSize = "3px";
          edgeWidth = 0.25;
        } else if (layout === "cise") {
          nodeSize = "10px";
          fontSize = "12px";
          edgeWidth = 1;
        } else if (layout === "fcose") {
          nodeSize = "5px";
          fontSize = "3px";
          edgeWidth = 0.25;
        }

        // initialize cytoscape
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

                let res = "rgb(" + r + ", " + g + ", " + b + ")";
                return res;
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
                  let s =
                    graph["version" + version][elem.data("source")]["weight"];
                  let t =
                    graph["version" + version][elem.data("target")]["weight"];
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

        // apply layout
        if (layout === "circle" || layout === "cose" || layout === "fcose") {
          cy.layout({
            name: layout,
            avoidOverlap: true,
            nodeOverlap: 0,
            spacingFactor: layout === "cose" ? 1.5 : 3,
            animate: "end", //,
            //positions: { nodeWeightOne: {x: 1000, y: 1000, locked: true}}
          }).run();
        } else if (layout === "cise") {
          let clusters;

          // get markov clusters for cise
          try {
            let options = {
              expandFactor: 2,
              inflateFactor: 2,
              multFactor: 1,
              maxIterations: 10,
            };
            clusters = cy.elements().markovClustering(options);
          } catch (error) {
            console.warn(
              "Markov Clustering not available, defaulting to manual clusters."
            );
            clusters = [];
          }

          // label clusters for layout
          clusters.forEach((cluster, i) => {
            cluster.forEach((node) => node.data("clusterID", i));
          });

          let arrayOfClusterArrays = [];
          cy.nodes().forEach(function (node) {
            let clusterID = node.data("clusterID");
            if (arrayOfClusterArrays[clusterID] === undefined) {
              arrayOfClusterArrays[clusterID] = [];
            }
            arrayOfClusterArrays[clusterID].push(node.id());
          });

          console.log(arrayOfClusterArrays);

          cy.layout({
            name: "cise",
            clusters: arrayOfClusterArrays,
            animate: "end",
            nodeSeparation: 75,
            avoidOverlap: true,
            nodeOverlap: 0,
            nodeRepulsion: (node) => 5000,
          }).run();
        }

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

      function downloadJSON() {
        const jsonStr = JSON.stringify(graph, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "graph.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      function uploadJSON() {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (!file) {
          alert("Please select a file to upload.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          try {
            const json = JSON.parse(event.target.result);
            graph = json;
            version = Object.keys(graph).length;
            document.getElementById("versionDisplay").innerText = version; // Update displayed version
            displayGraph();
            drawCytoscapeGraph();
            drawCy2Graph();
            $(".updateClass").css("display", "inline");
          } catch (e) {
            alert("Error parsing JSON: " + e.message);
          }
        };
        reader.readAsText(file);
      }

      function addNotes(message) {
        changeNotes.push(`${message}`);
        changeNotes.push(``);
      }
      function runAlgorithm(number) {
        if (!document.querySelector("#runAllNodes").checked) {
          // run single node
          runSingle(number);
        } else {
          // run all nodes
          runMultiple(number);
        }
        refresh();
      }

      function runSingle(number) {
        for (let i = 0; i < number; i++) {
          // update displayed version every iteration
          graph["version" + (version + 1)] = JSON.parse(
            JSON.stringify(graph["version" + version])
          );
          version++;
          graph["version" + version]["changes"] = [];
          document.getElementById("versionDisplay").innerText = version;

          // select a random source node
          const nodes = Object.keys(graph["version" + version]).filter(
            (node) => node !== "changes"
          );
          let source;

          do {
            source = nodes[Math.floor(Math.random() * nodes.length)];
          } while (noClass.includes(source));

          // get the edges of the selected source node
          const edges = graph["version" + version][source];

          // select a random target node that does not lead back to the source node
          let target;
          const targetNodes = Object.keys(edges);
          do {
            target =
              targetNodes[Math.floor(Math.random() * targetNodes.length)];
          } while (target === source || noClass.includes(target));

          algorithm(source, target);
        }
      }

      function runMultiple(number) {
        for (let i = 0; i < number; i++) {
          // update graph version once for all nodes
          graph["version" + (version + 1)] = JSON.parse(
            JSON.stringify(graph["version" + version])
          );
          version++;
          graph["version" + version]["changes"] = [];
          document.getElementById("versionDisplay").innerText = version;

          // get list of nodes
          const nodes = Object.keys(graph["version" + version]).filter(
            (node) => node !== "changes"
          );
          let source;

          // run algorithm on each node
          for (const node of nodes) {
            source = node;

            // get the edges of the selected source node
            const edges = graph["version" + version][source];

            // select a random target node that does not lead back to the source node
            let target;
            const targetNodes = Object.keys(edges);
            do {
              target =
                targetNodes[Math.floor(Math.random() * targetNodes.length)];
            } while (target === source || noClass.includes(target));

            algorithm(source, target);
          }
        }
      }

      // test edge from sidebar
      function testEdge(source, target) {
        graph["version" + (version + 1)] = JSON.parse(
          JSON.stringify(graph["version" + version])
        );
        version++;
        graph["version" + version]["changes"] = [];
        document.getElementById("versionDisplay").innerText = version;

        algorithm(source, target);
        refresh();
        $("#offcanvasScrolling").html($("#offcanvasScrolling").html());
        updateEdgeSidebar(source, target);
      }

      // test certain node from sidebar
      function testNode(source) {
        graph["version" + (version + 1)] = JSON.parse(
          JSON.stringify(graph["version" + version])
        );
        version++;
        graph["version" + version]["changes"] = [];
        document.getElementById("versionDisplay").innerText = version;

        // select a random target node that does not lead back to the source node
        let target;
        const edges = graph["version" + version][source];
        const targetNodes = Object.keys(edges);
        do {
          target = targetNodes[Math.floor(Math.random() * targetNodes.length)];
        } while (target === source || noClass.includes(target));

        algorithm(source, target);
        refresh();
        $("#offcanvasScrolling").html($("#offcanvasScrolling").html());
        updateNodeSidebar(source);
      }

      function algorithm(source, target) {
        // find weights of the source and target nodes, and the edge weight
        const sourceWeight = parseFloat(
          graph["version" + version][source]["weight"]
        );
        const targetWeight = parseFloat(
          graph["version" + version][target]["weight"]
        );
        const edgeWeight = parseFloat(
          graph["version" + version][target][source]
        );

        // find difference in node opinion
        let weightDiff = Math.abs(sourceWeight - targetWeight);
        weightDiff = parseFloat(weightDiff.toFixed(2));
        let c = graph["version" + version]["changes"];

        // update graph
        if (weightDiff > edgeWeight) {
          newWeight = 0;

          // delete broken edge from json
          delete graph["version" + version][source][target];
          delete graph["version" + version][target][source];

          // add change info to json
          let changesString = `${source} -${edgeWeight}- ${target} - broken`;
          c.push(changesString);
          addNotes(changesString);
          graph["version" + version]["changes"] = c;

          // make new edges from source and target
          replaceEdge(source, target);
        } else {
          // calculate new edge weight if not broken
          let min = 0.1;
          let max = 0.9;
          let chance = Math.random() * (max - min) + min;
          // Could change boolean expression to chance <= .6 at least
          if (chance <= 0.7) {
            // Bigger chance for weights to change
            // calculate new edge weight if not broken

            // check if either node has weight of 1
            if (sourceWeight === 1 || targetWeight === 1) {
              Slider();
              let avg = weightDiff / toleranceLevel;
              avg = parseFloat(avg.toFixed(2));
              console.log("Current alg value:", sliderValue);

              if (sourceWeight !== 1) {
                // update source only if it is not 1
                avg = parseFloat(avg + sourceWeight);
                avg = parseFloat(avg.toFixed(2));
                avg = avg > MAX_WEIGHT ? MAX_WEIGHT : avg;
                graph["version" + version][source]["weight"] = avg;
                let changesString = `${source} ${sourceWeight} - ${avg}, ${target} ${targetWeight} unchanged`;
                c.push(changesString);
                addNotes(changesString);
                graph["version" + version]["changes"] = c;
              } else {
                // update target only if it is not 1
                avg = parseFloat(avg + targetWeight);
                avg = parseFloat(avg.toFixed(2));
                avg = avg > MAX_WEIGHT ? MAX_WEIGHT : avg;
                graph["version" + version][target]["weight"] = avg;
                let changesString = `${source} ${sourceWeight} unchanged, ${target} ${targetWeight} - ${avg}`;
                c.push(changesString);
                addNotes(changesString);
                graph["version" + version]["changes"] = c;
              }
            } else {
              Slider();
              // if neither node weight is 1, update both
              let avg = weightDiff / toleranceLevel;
              avg = parseFloat(avg.toFixed(2));
              console.log("Current alg value:", sliderValue);

              let newS, newT;

              if (sourceWeight > targetWeight) {
                newS =
                  parseFloat(sourceWeight - avg) > 0
                    ? parseFloat(sourceWeight - avg)
                    : 0;
                newT =
                  parseFloat(targetWeight + avg) > MAX_WEIGHT
                    ? MAX_WEIGHT
                    : parseFloat(targetWeight + avg);
              } else {
                newS =
                  parseFloat(sourceWeight + avg) > MAX_WEIGHT
                    ? MAX_WEIGHT
                    : parseFloat(sourceWeight + avg);
                newT =
                  parseFloat(targetWeight - avg) > 0
                    ? parseFloat(targetWeight - avg)
                    : 0;
              }

              newS = parseFloat(newS.toFixed(2));
              newT = parseFloat(newT.toFixed(2));

              graph["version" + version][source]["weight"] = newS;
              graph["version" + version][target]["weight"] = newT;

              // add change info to json
              let changesString = `${source} ${sourceWeight} - ${newS} & ${target} ${targetWeight} - ${newT}`;
              c.push(changesString);
              addNotes(changesString);
              graph["version" + version]["changes"] = c;
            }
          } else {
            let changeString = `${source} ${sourceWeight} unchanged, ${target} ${targetWeight} unchanged`;
            c.push(changeString);
            graph["version" + version]["changes"] = c;
          }
        }
      }

      function replaceEdge(source, target) {
        // add source and target to respective past edges
        let c = graph["version" + version]["changes"];

        let sourceEdges = graph["version" + version][source]["Past Edges"];
        if (!sourceEdges.includes(target)) sourceEdges.push(target);
        graph["version" + version][source]["Past Edges"] = sourceEdges;

        let targetEdges = graph["version" + version][target]["Past Edges"];
        if (!targetEdges.includes(source)) targetEdges.push(source);
        graph["version" + version][target]["Past Edges"] = targetEdges;

        // get list of all nodes in graph
        const nodes = Object.keys(graph["version" + version]).filter(
          (node) => node !== "changes"
        );
        let sourceNode,
          changesString,
          alertString = "";

        // relationship weight
        let weightS = parseFloat(document.getElementById("weight1").value);

        // array to store valid nodes for a new edge
        const availableNodes = [];

        // build array of possible connections (preventing past edges from reforming)
        if (!document.querySelector("#allowPastEdges").checked) {
          for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i]; // convert number to char
            // if node is NOT in past edges and there is not already an edge, add it to available nodes
            if (
              !sourceEdges.includes(node) &&
              node !== source &&
              node !== target &&
              !graph["version" + version][source][node]
            )
              availableNodes.push(node);
          }
        } else {
          // build array of possible connections (allows past edges)
          for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (
              node !== source &&
              node !== target &&
              !graph["version" + version][source][node]
            )
              availableNodes.push(node);
          }
        }

        // if there are no available nodes update changes and exit
        if (availableNodes.length === 0) {
          changesString = `No available edges from ${source} possible (past edges not allowed)`;
          console.log(changesString);
          alertString += changesString + "\n";
          c.push(changesString);
          addNotes(changesString);
          graph["version" + version]["changes"] = c;
          return;
        }

        console.log(`source: ${source}\nbroken edge with: ${target}`);
        console.log(`available nodes: ${availableNodes}`);

        // select random source node from what is available
        sourceNode =
          availableNodes[Math.floor(Math.random() * availableNodes.length)];

        console.log(`new target: ${sourceNode}`);

        // update graph and changes
        graph["version" + version][source][sourceNode] = weightS;
        graph["version" + version][sourceNode][source] = weightS;

        // update changes
        changesString = `${source} -${weightS}- ${sourceNode} - made`;
        alertString += changesString + "\n";
        c.push(changesString);
        addNotes(changesString);
        graph["version" + version]["changes"] = c;
      }

      // used to reload sidebar after clicking algorithm button
      function updateNodeSidebar(nodeId) {
        $("#offBody").text("");
        $("#offcanvasScrollingLabel").html("Node: " + nodeId);

        for (const [destination, weight] of Object.entries(
          graph["version" + version][nodeId]
        )) {
          let text = destination + " : " + weight;
          $("#offBody").append("<li>" + text + "</li>");
        }

        $("#offBody").append(
          `</br><button class="underline bg-maroon px-5 py-3 text-lg rounded-md hover:bg-orange-500" onclick=\"testNode('${nodeId}')\">Test Node</button>`
        );
      }

      function updateEdgeSidebar(source, target) {
        $("#offBody").text("");
        $("#offcanvasScrollingLabel").html("Edge: " + source + "-" + target);

        $("#offBody").append("<li>Source : " + source + "</li>");
        $("#offBody").append("<li>Destination : " + target + "</li>");
        $("#offBody").append(
          "<li>Weight : " + graph["version" + version][source][target] + "</li>"
        );

        $("#offBody").append(
          `</br><button class="underline bg-maroon px-5 py-3 text-lg rounded-md hover:bg-orange-500" onclick=\"testEdge('${source}', '${target}')\">Test Edges</button>`
        );
      }

      function previous() {
        version--;
        if (version > 0) {
          $("#versionDisplay").text(version);
          refresh();
        } else {
          version++;
        }
      }

      function previousTwo() {
        console.log("Prev two");
        versionTwo--;
        if (versionTwo > 0) {
          $("#versionDisplay2").text(versionTwo);
          refreshTwo();
        } else {
          versionTwo++;
        }
      }

      function next() {
        version++;
        if (version <= Object.keys(graph).length) {
          $("#versionDisplay").text(version);
          refresh();
        } else {
          version--;
        }
      }

      $("#play").on("click", function () {
        if (!isPlaying) {
          // change button text
          $("#play").text("■");
          isPlaying = true;

          let start = version;
          let size = Object.entries(graph).length;

          // call next() every second while not at last version
          playInterval = setInterval(() => {
            if (start < size) {
              $("#next").click();
              start++;
            } else {
              clearInterval(playInterval); // stop playback at last version
              $("#play").text("▶");
              isPlaying = false;
            }
          }, 1000);
        } else {
          // stop playback if button clicked again
          clearInterval(playInterval);
          $("#play").text("▶");
          isPlaying = false;
        }
      });

      function nextTwo() {
        console.log("Next two");
        versionTwo++;
        if (versionTwo <= Object.keys(graph).length) {
          $("#versionDisplay2").text(versionTwo);
          refreshTwo();
        } else {
          versionTwo--;
        }
      }

    function refresh() {
        displayGraph();
        drawCytoscapeGraph();
        let dispname = Object.keys(displays);
        dispname.forEach(function(me){
            drawCytoscapeGraph(me);
        });
    }

      function refreshTwo() {
        displayGraph();
        drawCy2Graph();
      }

      $(".btn-close").on("click", function () {
        console.log("found");
        let stuff;
        let tempStr = $("#offBody li").text();
        console.log(tempStr);
        $("#offBody li").each(function (index, element) {
          let data = $(element).text().split(" : ");
          let curr = $("#offcanvasScrollingLabel").text().split(" ");
          if (curr[0] == "Node:") {
            if (index == 1) {
              return;
            }
            let me = curr[1];
            console.log(me);
            if (parseFloat(data[1]) == 0) {
              delete graph["version" + version][me][data[0]];
              delete graph["version" + version][data[0]][me];
            } else {
              graph["version" + version][me][data[0]] = parseFloat(data[1]);
              if (index == 0) {
                return;
              }
              graph["version" + version][data[0]][me] = parseFloat(data[1]);
            }
          } else {
            console.log("in the else");
            if (index == 0) {
              return;
            }
            let me = curr[1];
            let targets = me.split("-");
            console.log(data);
            if (parseFloat(data[1]) == 0) {
              delete graph["version" + version][targets[0]][targets[1]];
              delete graph["version" + version][targets[1]][targets[0]];
            } else {
              graph["version" + version][targets[0]][targets[1]] = parseFloat(
                data[1]
              );
              if (index == 0) {
                return;
              }
              graph["version" + version][targets[1]][targets[0]] = parseFloat(
                data[1]
              );
            }
          }
        });
        refresh();
      });

    function patchNotes() {
        if (changeNotes.length == 0) {
          alert("No changes yet.");
        } else {
          alert("Changes:\n\n" + changeNotes.join("\n"));
        }
      }

    function addGraph() { // Currently shows and hides the second graph
            let dispnum = Object.keys(displays).length+2;
            let dispname = 'cy'+dispnum
            $('#field').removeClass(`grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4`).addClass(`grid-cols-${dispnum}`);
            displays[dispname] = 1
            let ex = `<div id="${dispname}" class="h-[600px] border border-gray-300"></div>`;
            $('#field').append(ex);
            console.log($('#field').html());
            drawCytoscapeGraph(dispname);
            $('#reset').click();
        }
        
    function addPerson(){
        let boxes = $("<li>").html(
                    '<input type="text" class="text-box" placeholder="Enter text 1"> ' +
                    '<input type="number" value="0.2" required>' +
                    '<button type="button" onclick=popPerson(this) class="delbtn">Delete</button>'
            );
        $(".modal-body ul").append(boxes);
    }

    function popPerson(me){
        $(me).closest("li").remove();
    }


    </script>
  </body>
</html>