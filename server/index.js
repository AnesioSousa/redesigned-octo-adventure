const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());

app.use(express.json());

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.status(200).json(newTodo.rows[0]);
  } catch (err) {
    console.err(err.message);
    return res.status(400).json({
      message: `${err.message}`,
    });
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const todoList = await pool.query("SELECT * FROM todo");
    res.status(200).json(todoList.rows);
  } catch (error) {
    console.error(err);
    res.status(500);
  }
});

//update a todos

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
