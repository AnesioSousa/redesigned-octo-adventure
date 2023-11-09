const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());

app.use(express.json());

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const todoList = await pool.query("SELECT * FROM todo ORDER BY todo_id");
    res.status(200).json(todoList.rows);
  } catch (error) {
    console.error(err);
    res.status(500);
  }
});

async function getTodoById(id) {
  try {
    const { rows } = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

//get a todo by id
app.get("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const rows = await getTodoById(id);

    if (rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//create a todo
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

//update a todo
app.put("/todos/:id", async (req, res) => {
  const { description } = req.body;
  try {
    const id = parseInt(req.params.id, 10);

    await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [
      description,
      id,
    ]);
    res.status(200).json({
      todo_id: id,
      description: description,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const aux = "deletedObject";
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

    res.status(200).json(aux);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
