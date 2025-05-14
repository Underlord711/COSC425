function runAlgorithm(number) {
    if (!document.querySelector("#runAllNodes").checked) {
      // run single node
      runSingle(number);
    } else {
      // run all nodes
      runMultiple(number);
    }
    displays[currGraph]['version'] = version;
    refresh();
    $("#versionDisplay").text(version);
    $("#currGraphVer").text(displays[currGraph]['version']);
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
    next();
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
    next();
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
          //console.log("Current alg value:", sliderValue);
  
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
          //console.log("Current alg value:", sliderValue);
  
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
        let changeString = `${source} ${sourceWeight} unchanged, ${target} ${targetWeight} unchanged (random chance)`;
        c.push(changeString);
        graph["version" + version]["changes"] = c;
      }
    }
  }
  function addNotes(message) {
    changeNotes.push(`${message}`);
    changeNotes.push(``);
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
      //console.log(changesString);
      alertString += changesString + "\n";
      c.push(changesString);
      addNotes(changesString);
      graph["version" + version]["changes"] = c;
      return;
    }
  
    //console.log(`source: ${source}\nbroken edge with: ${target}`);
    //console.log(`available nodes: ${availableNodes}`);
  
    // select random source node from what is available
    sourceNode =
      availableNodes[Math.floor(Math.random() * availableNodes.length)];
  
    //console.log(`new target: ${sourceNode}`);
  
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
    displays[currGraph]['version'] = version;
    refresh();
    $("#versionDisplay").text(version);
    $("#currGraphVer").text(displays[currGraph]['version']);
  }
