const express = require("express");
const app = express();

app.use("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World!",
  });
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
