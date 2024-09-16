<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homestart</title>
    <!-- Tailwind CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <!-- Cytoscape.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.22.0/cytoscape.min.js"></script>
    <style>
        #graph {
            width: 100%;
            height: 600px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body class="bg-gray-100 flex flex-col items-center min-h-screen">

    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-8">
        <h1 class="text-xl font-semibold mb-4">Homestart</h1>

        <!-- Form for Weight Input -->
        <form id="weightForm" action="json_mapper.php" method="POST" class="mb-8">
            <div class="mb-4">
                <label for="weight1" class="block text-gray-700">Weight 1:</label>
                <input type="number" id="weight1" name="weight1" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
            </div>
            <div class="mb-4">
                <label for="weight2" class="block text-gray-700">Weight 2:</label>
                <input type="number" id="weight2" name="weight2" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
            </div>
            <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit Weights</button>
        </form>

        <!-- Button to Generate Graph -->
        <button id="generateGraph" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Generate Graph</button>

        <!-- Graph Container -->
        <div id="graph" class="mt-8"></div>
    </div>

    <script>
        document.getElementById('generateGraph').addEventListener('click', function() {
            fetch('graph_data.json') // Updated path to JSON file
                .then(response => response.json())
                .then(data => {
                    const elements = [];
                    const addedNodes = new Set();

                    // Process the JSON data into Cytoscape elements
                    Object.keys(data).forEach(source => {
                        // Add node if not already added
                        if (!addedNodes.has(source)) {
                            elements.push({ data: { id: source, label: source } });
                            addedNodes.add(source);
                        }

                        // Process each entry in the source node
                        const edges = data[source];
                        Object.keys(edges).forEach(target => {
                            const weight = edges[target];

                            // Add target node if not already added
                            if (!addedNodes.has(target)) {
                                elements.push({ data: { id: target, label: target } });
                                addedNodes.add(target);
                            }

                            // Add edge with weight
                            elements.push({
                                data: {
                                    id: `${source}-${target}`,
                                    source: source,
                                    target: target,
                                    weight: weight
                                }
                            });
                        });
                    });

                    // Initialize Cytoscape
                    const cy = cytoscape({
                        container: document.getElementById('graph'),
                        elements: elements,
                        style: [
                            {
                                selector: 'node',
                                style: {
                                    'background-color': '#0074D9',
                                    'label': 'data(label)',
                                    'color': '#fff',
                                    'text-valign': 'center',
                                    'text-halign': 'center',
                                    'font-size': 12
                                }
                            },
                            {
                                selector: 'edge',
                                style: {
                                    'width': 2,
                                    'line-color': '#888',
                                    'target-arrow-color': '#888',
                                    'target-arrow-shape': 'triangle',
                                    'label': 'data(weight)',
                                    'font-size': 10,
                                    'text-rotation': 'autorotate'
                                }
                            }
                        ],
                        layout: {
                            name: 'cose',
                            animate: true
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching or processing JSON:', error);
                });
        });
    </script>

</body>
</html>
