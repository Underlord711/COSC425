import random
import string
import networkx as nx
import matplotlib.pyplot as plt
import json

# Function to generate a random letter
def generate_random_letter():
    return random.choice(string.ascii_uppercase)

# Create a graph
G = nx.Graph()

# Number of vertices you want to add
num_vertices = 30

# Add vertices with random labels
for _ in range(num_vertices):
    label = generate_random_letter()
    G.add_node(label)


# Add some random edges between vertices
nodes = list(G.nodes())
for i in range(len(nodes) - 1):
	for j in range(i + 1, len(nodes)):
		if random.random() > 0.5:  # Randomly decide if an edge should be added
			weight = random.randint(1, 10)/10  # Random weight between 1 and 10
			G.add_edge(nodes[i], nodes[j], weight=weight)

graph_data = {}

# Populate the dictionary with vertices and their connections
for node in G.nodes():
    graph_data[node]={}
    for neighbor in G.neighbors(node):
        # Get the weight of the edge connecting the node and the neighbor
        weight = G[node][neighbor]['weight'] 
        # Store the neighbor and weight in the dictionary
        graph_data[node][neighbor] = weight

print("number of edges", G.number_of_edges())

# Specify the path to the JSON file
json_file_path = 'graph_data.json'

# Write the dictionary to a JSON file
with open(json_file_path, 'a') as json_file:
    json.dump(graph_data, json_file, indent=4)

print(f'Graph data has been written to {json_file_path}')

# Draw the graph
pos = nx.spring_layout(G)  # Positioning nodes using a spring layout
nx.draw(G, pos, with_labels=True, node_size=500, node_color='lightblue', font_size=16, font_weight='bold', edge_color='gray')

# Draw edge labels (weights)
edge_labels = nx.get_edge_attributes(G, 'weight')
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='red')

# Show the plot
plt.show()
