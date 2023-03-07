// dependencies
require("dotenv").config();
const { PORT = 3300, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// mongo
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Register Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const TodosSchema = new mongoose.Schema({
  todo: String,
  details: String,
});

const Todo = mongoose.model("Todo", TodosSchema);

//--------------------------------------
// routes
//--------------------------------------

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/todos", async (req, res) => {
  try {
    res.json(await Todo.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Create Route
app.post("/todos", async (req, res) => {
  try {
    res.json(await Todo.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update Route
app.put("/todos/:id", async (req, res) => {
  try {
    res.json(
      await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete Route
app.delete("/todos/:id", async (req, res) => {
  try {
    res.json(await Todo.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Show Route
app.get("/todos/:id", async (req, res) => {
  try {
    res.json(await Todo.findById(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
