let displays = {};
let graph = {};
let version = 1;
let versionTwo = 1;
let totalGraphs = 1;
let currentGraph = 1;
let isMatrixVisible = false; // track whether the matrix is visible or not
let layout = "circle"; // layout used for cytoscape
let noClass = ["weight", "Past Edges", "changes"];
const MAX_WEIGHT = 0.8;
let playInterval; // used for play button
let isPlaying = false;
let toleranceLevel = 4;

let nodeWeightOne; // used to fix position of node with weight 1 in graph


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
  if(currentGraph > 1)
    {
      versionTwo++;
      if (versionTwo <= Object.keys(displays).length+2) {
          document.getElementById('versionDisplay2').innerText = versionTwo;
          refreshTwo();
      }
      else {
          versionTwo--;
      }
  } else {
    version--;
    if (version > 0) {
        $('#versionDisplay').text(version);
        refresh();
    }
    else {
        version++;
    }
  }
}


function next() {
  if(currentGraph > 1)
    {
      versionTwo++;
      if (versionTwo <= Object.keys(displays).length+2) {
          $('#versionDisplay').text(version);
          refreshTwo();
      }
      else {
          versionTwo--;
      }
  }             else
  {
    version++;
    if (version <= Object.keys(graph).length) {
        $('#versionDisplay').text(version);
        refresh();
    }
    else {
        version--;
    }
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



function refresh() {
  displayGraph();
  drawCytoscapeGraph();
  let dispname = Object.keys(displays);
  dispname.forEach(function (me) {
    drawCytoscapeGraph(me);
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
  let dispnum = Object.keys(displays).length+2;
  let dispname = 'cy'+dispnum;
  totalGraphs = dispnum;
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
  let keys = Object.keys(displays);
  if (keys.length === 0) return;

  // Get the last added graph
  let lastDisp = keys[keys.length - 1];
  
  // Remove the graph div from the DOM
  $(`#${lastDisp}`).remove();

  // Remove it from the tracking object
  delete displays[lastDisp];

  // Update totalGraphs count
  totalGraphs = Object.keys(displays).length + 1;

  // Update the grid columns class
  $('#field').removeClass(`grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4`)
             .addClass(`grid-cols-${totalGraphs}`);

  // Optional counter reset
  if (totalGraphs <= 1) {
      currentGraph = 0;
      $('#secondGraphCurrent').text(currentGraph);
  }

  $('#TotalDisplay').text(totalGraphs);
  }
  function cycleLeft(){
    if(currentGraph == 1 && totalGraphs >= currentGraph)
        alert("Can't.");
    else if(currentGraph == 1 && totalGraphs == 1)
        alert("Please make a new graph.");
    else
        currentGraph--;
        
    $('#secondGraphCurrent').text(currentGraph);
}

function cycleRight(){
  /*if(currentGraph == totalGraphs)
      alert("Can't.");
  else if(currentGraph == 1 && totalGraphs == 1)
      alert("Please make a new graph.");
  else
      currentGraph++;
      
  $('#secondGraphCurrent').text(currentGraph);*/
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
}