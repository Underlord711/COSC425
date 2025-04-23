let displays = {};
let graph = {};
let version = 1;
let versionTwo = 1;
let totalGraphs = 1;
let currentGraph = 1;
let activeGraph = "cy";
let graphVersions = {}; // maps each graph ID to its current version
let isMatrixVisible = false; // track whether the matrix is visible or not
let layout = "circle"; // layout used for cytoscape
let noClass = ["weight", "Past Edges", "changes"];
const MAX_WEIGHT = 0.8;
let graphNum = 0;
let playInterval; // used for play button
let isPlaying = false;
let toleranceLevel = 4;

let nodeWeightOne; // used to fix position of node with weight 1 in graph

let graphs = {
  cy: { currentVersion: 0, data: {} },  // Main graph
  cy1: { currentVersion: 1, data: {} }, // Graph 1
  cy2: { currentVersion: 2, data: {} }, // Graph 2
  cy3: { currentVersion: 3, data: {} }  // Graph 3
};

let showOnlyGraphs = ["cy", "cy1", "cy2", "cy3"];


changeNotes = []; //Need this for Patch Notes

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("nodeColor1Input").addEventListener("change", () => drawCytoscapeGraph('cy'), false);
  document.getElementById("nodeColor2Input").addEventListener("change", () => drawCytoscapeGraph('cy'), false);
  document.getElementById("safeEdgeInput").addEventListener("change", () => drawCytoscapeGraph('cy'), false);
  document.getElementById("unsafeEdgeInput").addEventListener("change", () => drawCytoscapeGraph('cy'), false);
  // change here
  document.getElementById("lockNodePosition").addEventListener("change", () => drawCytoscapeGraph('cy'), false);
  document.getElementById("lockNodeValue").addEventListener("input", function () {
    nodeWeightOne = this.value.trim();
    drawCytoscapeGraph();
  });
});

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
  $('.modal-body ul li :text').each(function (me) {
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
  if (vertexes.length == 0) {
    for (let i = 0; i < numVertices; i++) {
      const vertex = String.fromCharCode(65 + i);
      let w = Math.random().toFixed(2);

      if (w > MAX_WEIGHT && !one) {
        w = 1;
        one = true;
        nodeWeightOne = vertex;
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
    for (let i = 0; i < vertexes.length; i++) {
      graph['version' + version][vertexes[i]] = { weight: weights[i] };
      graph['version' + version][vertexes[i]]['Past Edges'] = [];

    }
  }

  if (!one) {
    let vertex = vertexes[Math.floor(Math.random() * vertexes.length)];
    graph['version' + version][vertex]['weight'] = 1;
    nodeWeightOne = vertex;
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

function previous() {
  if (!activeGraph) return;

  if (!graphVersions[activeGraph]) {
    graphVersions[activeGraph] = 1;
  }

  if (graphVersions[activeGraph] <= 1) {
    alert("Already at earliest version.");
    return;
  }

  graphVersions[activeGraph]--;

  $('#versionDisplay2').text(graphVersions[activeGraph]);

  const originalVersion = version;
  version = graphVersions[activeGraph];
  drawCytoscapeGraph(activeGraph);
  version = originalVersion;
}


function next() {
  if (!activeGraph) return;

  if (!graphVersions[activeGraph]) {
    graphVersions[activeGraph] = 1;
  }

  graphVersions[activeGraph]++;
  const versionKey = 'version' + graphVersions[activeGraph];

  if (!graph[versionKey]) {
    graphVersions[activeGraph]--;
    alert("Already at latest version.");
    return;
  }

  $('#versionDisplay2').text(graphVersions[activeGraph]);

  const originalVersion = version;
  version = graphVersions[activeGraph];
  drawCytoscapeGraph(activeGraph);
  version = originalVersion;
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



function refresh() {
  // Refresh the main graph ('cy')
  drawCytoscapeGraph('cy');

  // Refresh all secondary graphs based on their versions in graphVersions
  let dispname = Object.keys(displays);
  dispname.forEach(function(me) {
  if (me !== 'cy') { 
    const versionNum = graphVersions[me] || version;  // Default to global version if no version is set
    drawCytoscapeGraph(me);  // Draw secondary graphs with their respective versions
    }
  });
}

function refreshTwo() {
  displayGraph();
  drawCytoscapeGraph();
  let dispname = Object.keys(displays);
  dispname.forEach(function (me) {
    drawCytoscapeGraph(me);
  });
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

function addGraph() { // Adds a new graph and increases the total num of secondary graohs
  if(totalGraphs == 4)
  {
    return;
  }
  else{
    let dispnum = Object.keys(displays).length+2;
    let dispname = 'cy'+dispnum;
    totalGraphs = dispnum;
    
    graphVersions[dispname] = version;
    
    $('#field').removeClass(`grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4`).addClass(`grid-cols-${dispnum}`);
    displays[dispname] = 1;
    let ex = `<div id="${dispname}" class="h-[600px] border border-gray-300"></div>`;
    $('#field').append(ex);
    console.log($('#field').html());
    drawCytoscapeGraph(dispname);
    $('#reset').click();
    
    if(totalGraphs == 1)
    {
      currentGraph++;
      $('#secondGraphCurrent').text(currentGraph);
    }
    
    //totalGraphs++;
    $('#TotalDisplay').text(totalGraphs);
    
    }
}

function addPerson() {
  let boxes = $("<li>").html(
    '<input type="text" class="text-box" placeholder="Enter text 1"> ' +
    '<input type="number" value="0.2" required>' +
    '<button type="button" onclick=popPerson(this) class="delbtn">Delete</button>'
  );
  $(".modal-body ul").append(boxes);
}

function popPerson(me) {
  $(me).closest("li").remove();
}
async function downloadExcel() {
  const workbook = new ExcelJS.Workbook();

  // Iterate through all keys that start with 'version'
  Object.keys(graph).forEach(versionKey => {
    if (versionKey.startsWith("version")) {
      const worksheet = workbook.addWorksheet(versionKey);

      const matrix = graph[versionKey];
      const vertices = Object.keys(matrix).filter(v => !["changes", "Past Edges", "weight"].includes(v));
      
      // Prepare headers
      const headers = [" "].concat(vertices);
      worksheet.addRow(headers);

      // Build and add rows
      vertices.forEach(source => {
        const rowData = [source];
        vertices.forEach(target => {
          rowData.push(matrix[source]?.[target] || "X");
        });
        worksheet.addRow(rowData);
      });

      // Apply right-alignment to all cells except header row
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          // Skip top-left cell and header row's first cell
          if (rowNumber > 1 || colNumber > 1) {
            cell.alignment = { horizontal: 'right' };
          }
        });
      });
    }
  });

  // Generate and download the file in browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "full_graph_data.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function removeGraph(){ //This needs to remove the dynamically added graphs.
  if (totalGraphs == 1) {
    alert("Don't.");
  } else {
    let dispnum = Object.keys(displays).length + 1; // NOT +2
    let dispname = 'cy' + dispnum;

    // Remove the DOM element
    $('#' + dispname).remove();

    // Remove from the displays object
    delete displays[dispname];

    // Update grid column class
    $('#field').removeClass(`grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4`).addClass(`grid-cols-${dispnum - 1}`);

    totalGraphs = dispnum - 1;

    // Fix the currentGraph when removing the last graph or any intermediate graph
    if (totalGraphs == currentGraph) {
      currentGraph--;
    }

    // Ensure we aren't going below 0 (main graph index)
    if (currentGraph < 0) {
      currentGraph = 0; // reset to "Main"
    }

    // Update activeGraph based on the new totalGraphs
    const graphIDs = getAllGraphIDs();
    if (currentGraph >= graphIDs.length) {
      activeGraph = graphIDs[graphIDs.length - 1]; // set activeGraph to the last available graph
    } else {
      activeGraph = graphIDs[currentGraph]; // set activeGraph to the current index
    }

    // Update the current graph label (Main if it's 0, otherwise show the index)
    $('#secondGraphCurrent').text(currentGraph === 0 ? "Main" : currentGraph);

    // Update the total display count
    $('#TotalDisplay').text(totalGraphs);

    var graphStat = document.getElementById("cy");
    if (totalGraphs == 1) {
      // Hide the navigation buttons when there’s only one graph
      let next2 = document.getElementById("next2");
      let prev2 = document.getElementById("prev2");

      if (next2) next2.style.display = "none";
      if (prev2) prev2.style.display = "none";
      if (graphStat) graphStat.style.width = "100%";

      currentGraph = 1; // Reset to "Main"
    }
    
    // Ensure the proper graph is drawn
    drawCytoscapeGraph(graphs[currentGraph], activeGraph);
    $('#versionDisplay2').text(graphVersions[activeGraph]);
  }
}

function getAllGraphIDs() {
  return ["cy", ...Object.keys(displays)];
}    

function cycleLeft(){
  const graphIDs = getAllGraphIDs(); // ["cy", "cy2", "cy3", ...]
  let index = graphIDs.indexOf(activeGraph);

  if (index === -1) {
    alert("Active graph not found.");
    return;
  }

  if (index <= 0) {
    alert("Can't go further left.");
    return;
  }

  // Move one step left
  index -= 1;
  activeGraph = graphIDs[index];

  // Update label
  $('#secondGraphCurrent').text(activeGraph === "cy" ? "Main" : index);
    
  // Set default version if not present
  if (!graphVersions[activeGraph]) {
    graphVersions[activeGraph] = 1;
  }


  $('#versionDisplay2').text(graphVersions[activeGraph]);

  // Show only the selected graph visually
  showOnlyGraph(activeGraph);

  // Draw/update the graph visually using correct data
  if (graphs[index]) {
    drawCytoscapeVersion(graphs[index], activeGraph);
  } else {
    console.warn("Graph data not found for index", index);
  }
}

function cycleRight(){
  const graphIDs = getAllGraphIDs();
  let index = graphIDs.indexOf(activeGraph);

  if (index === -1) {
    alert("Active graph not found.");
    return;
  }

  if (index >= graphIDs.length - 1) {
    alert("Can't go further right.");
    return;
  }

  index += 1;
  activeGraph = graphIDs[index];
  currentGraph = index;
  
  if (!graphVersions[activeGraph]) {
    graphVersions[activeGraph] = 1;
  }

  $('#secondGraphCurrent').text(activeGraph === "cy" ? "Main" : index);
  $('#versionDisplay2').text(graphVersions[activeGraph]);
  
  showOnlyGraph(activeGraph);
  drawCytoscapeVersion(graphs[index], activeGraph);


  $('#secondGraphCurrent').text(activeGraph === "cy" ? "Main" : index);
  $('#versionDisplay2').text(graphVersions[activeGraph]);


  showOnlyGraph(activeGraph);
  drawCytoscapeVersion(graphs[index], activeGraph);
  $('#secondGraphCurrent').text(currentGraph);
}


function updateGraphToVersion(dispname, version){
  if (graphHistory[version]) {
    drawCytoscapeGraph(dispname, graphHistory[version]);
  }
}
  
function getAllGraphIDs() {
  return ["cy", ...Object.keys(displays)];
}

function drawCytoscapeVersion(graphID) {
  const originalVersion = version;

  if (!graphVersions[graphID]) {
    graphVersions[graphID] = 1;
  }

  version = graphVersions[graphID];
  drawCytoscapeGraph(graphID);
  version = originalVersion;
}