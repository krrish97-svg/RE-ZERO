🌀 Re:Zero – Subaru’s Checkpoint Save States
“Every death rewinds time, but every choice changes fate.”

An interactive visualization and algorithmic simulation inspired by Re:Zero: Starting Life in Another World.
This project models Subaru Natsuki’s Return by Death mechanic as a weighted decision tree, using graph algorithms to find the optimal path (minimum deaths) to reach salvation.

🚀 Project Overview

Subaru’s decisions create multiple branching timelines — each representing a possible future.
Each transition between two states has a death cost, and Subaru wants to minimize his suffering while reaching his goal.

This website demonstrates how graph theory, Dijkstra’s algorithm, and tree traversal can be used to simulate this “checkpoint system” — and visualize it beautifully.

🧩 Features

🧠 Algorithm Tab — “Checkpoints”
Displays efficient, optimized C++ implementations for all relevant Data Structures & Algorithms (Graphs, Dijkstra, BFS, etc.) used in the simulation.

🌌 Visualization Tab — “Timelines”
Brings the algorithm to life as an interactive graph — showing Subaru’s decisions, deaths, and paths branching across timelines.

⚡ Weighted Graph Logic
Each edge represents a “death cost” → the path with minimum cumulative deaths is the optimal timeline.

🎞️ Immersive Landing Page with MP4 Background
The homepage features a cinematic looping MP4 video that captures Re:Zero’s dark, time-loop atmosphere.

🧠 Algorithms & Data Structures Used
Type	Purpose	Algorithm / Structure Used
Graph Representation	Store states and transitions	Adjacency List (Weighted)
Shortest Path Finding	Compute minimum deaths path	Dijkstra’s Algorithm
Path Reconstruction	Track Subaru’s optimal route	Parent Map + Backtracking
Tree Traversal	Explore alternate timelines	BFS / DFS
Memoization	Avoid recomputation of states	Hash Map / Distance Array
🕸️ Visualization Design
🎯 Objective

The visualization simulates how Subaru’s choices form a branching tree of futures, where each node is a “state” (like Mansion, TrustRem, Village, etc.) and each edge represents a “decision” with a death cost.

💡 Working

The system loads the decision graph from user input or sample data.

The algorithm (Dijkstra) runs in the background, computing the minimum cumulative deaths.

As the algorithm explores the graph:

Nodes light up in real-time when visited.

Edge weights are shown dynamically.

The final optimal path is highlighted (e.g., glowing gold).

A step-by-step animation shows how Subaru progresses through each decision point.

🔮 Visual Elements
Element	Representation
🟢 Node (Start)	Subaru’s starting point (“Mansion”)
🔵 Nodes	Possible decision outcomes
🔴 Node (Goal)	Desired final state (“MeetWitch”)
⚫ Edge Label	Death cost per transition
✨ Highlighted Path	Minimum death route (Dijkstra result)
🛠️ Tech Stack
Category	Tools / Libraries
Frontend	HTML, CSS, JavaScript, p5.js / D3.js
Visualization	D3.js (Dynamic Graph), p5.js (Animated Paths)
Algorithm Implementation	C++ (Optimized Dijkstra / BFS / DFS)
Deployment GitHub Pages
Media	MP4 background integrated using <video> tag
Version Control	Git + GitHub


Clone the repository

git clone https://github.com/<your-username>/ReZero-Checkpoint-Simulation.git
cd ReZero-Checkpoint-Simulation


Run the website locally

Open index.html in your browser
OR

Use a live server in VS Code

View Algorithm Output

Open the “Checkpoints” tab

Explore the optimized C++ solutions

Visualize Subaru’s Journey

Switch to the “Timelines” tab

Watch the algorithm animate through the decision graph

🏁 Example Input & Output
Input
6 8
Mansion TrustRem 3
Mansion TrustRam 2
TrustRem Village 1
TrustRam Village 4
Mansion DirectVillage 8
Village MeetWitch 2
TrustRem MeetWitch 5
TrustRam MeetWitch 3
Mansion MeetWitch

Output
5
Mansion TrustRam Village MeetWitch
