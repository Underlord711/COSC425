**Website used to simulate interactions between groups with differing opinions on random issues.**

**Number of Vertices** - Number of nodes in the graph.

**Weight 1 and 2** - Edge weights to represent different relationships. Defaults are 0.2 (friend) and 0.9 (family).

**Generate Graph** - Create a graph with chosen number of vertices and edge weights. Allows up to three edges per vertex and creates (number of vertices * 3) / 2 edges for the initial graph version.

**Show Matrix** - Show and hide an adjacency matrix that represents edges in the graph. Edges can be changed using the matrix and they will be updated on the graph when clicking out of the matrix. 

**Download JSON** - Download JSON file containing each graph version. Can choose JSON file to upload to create graph.

**Run Algorithm** - Runs the algorithm on the current version of the graph. Will overwrite later versions (if running algorithm on graph version 1 while graph version 2 exists, version 2 will be overwritten with results of algorithm). Input box next to Run Algorithm button allows user to select how many times they would like to run the algorithm.

**Patch Notes** - Display alert containing all changes that have happened to the graph since loading (will only display changes to graph from running the algorithm - loading graphs will not have any patch notes until the algorithm has been performed). 

**Run All Nodes** - Option to have the algorithm run on all nodes in the graph. If unchecked, a random node will be selected for testing. If checked, each node will be tested. 

**Allow Past Edges** - Option to allow/prevent reforming broken relationships. If checked, nodes can select any other node they don't have an edge with to form a new relationship. If checked, nodes attempt to find a relationship with a new node. 

**Graph Coloring** - Node color allows the user to change the color of nodes in the graph. Safe edge color represents edges that will not break if they are tested by the algorithm. Unsafe edge color represents edges that will break if they are tested. 

**Previous/Next** - Allow user to display each version of the graph, represented by the version counter on the top left of the graph. If there are no versions before or after the current graph the buttons do nothing. 

**Graph Layouts** - Dropdown menu that allows user to select how they want their graph to be displayed. Default display is circle. CoSE (Compound Spring Embedder) is a force-directed algorithm used to position nodes. fCoSE<sup>1, 2</sup> (Fast CoSE) is an optimized version of the CoSE algorithm. CiSE<sup>3</sup> (Circular Spring Embedder) is another force-directed algorithm that clusters nodes using Markov Clustering from the Cytoscape.js core. 

<p align="center">
  <kbd><img width="170" alt="Screenshot 2024-12-05 at 12 03 36 PM" src="https://github.com/user-attachments/assets/68b49e52-17c1-4486-ba3d-7017e24f7e2c"></kbd> 
  <kbd><img width="185" alt="Screenshot 2024-12-05 at 12 08 09 PM" src="https://github.com/user-attachments/assets/402f079d-7169-4f5c-a390-ea7af2b731a7"></kbd>
</p>

**JSON** - Example of JSON file. Each graph version stores the vertices, their opinion (weight), and their edges. Past edges stores nodes from broken relationships. Each graph version has its own change log that describes what happened to each node in the graph. 

**1.** U. Dogrusoz, E. Giral, A. Cetintas, A. Civril and E. Demir, "A Layout Algorithm For Undirected Compound Graphs", Information Sciences, 179, pp. 980-994, 2009.

**2.** H. Balci and U. Dogrusoz, "fCoSE: A Fast Compound Graph Layout Algorithm with Constraint Support," in IEEE Transactions on Visualization and Computer Graphics, 28(12), pp. 4582-4593, 2022.

**3.** M. Belviranli, A. Dilek and U. Dogrusoz, "CiSE: A Circular Spring Embedder Layout Algorithm" in IEEE Transactions on Visualization & Computer Graphics, vol. 19, no. 06, pp. 953-966, 2013.