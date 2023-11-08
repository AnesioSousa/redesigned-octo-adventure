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

//get a todo by id

app.get("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update a todos

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
