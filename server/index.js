// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.get("/api/tasks", async (req, res) => {
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({ error: "Server Error" });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params.id;  
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({ error: "Task not Found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: "Server Error" }); 
    }
});

app.post("/api/tasks", async (req, res) => {
    const {title, content} = req.body;
    if (!title || !content){
        return res.status(401).json({ message: "Invalid Input" });
    }
    try {
        const newTask = new Task({title, content});
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Server Error" }); 
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;  
    const { title, content } = req.body;
    if (!title || !content){
        return res.status(401).json({ message: "Invalid Input" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );
        if(!updatedTask){
            return res.status(404).json({ error: "Task not Found" });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Server Error" }); 
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedTask = await Task.findByIdAndDelete(id);
        if(!deletedTask){
            return res.status(404).json({ error: "Task not Found" });
        }
        res.status(200).json({ message: "Task Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" }); 
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

