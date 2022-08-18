const express = require("express");
const { writeFile } = require("fs").promises;
const path = require("path");
let data = require("./data.json");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const saveData = async (_data) => {
  try {
    await writeFile("./data.json", _data);
  } catch (error) {
    console.log(error);
  }
};

app.get("/get", (req, res) => {
  res.json(data);
});

app.post("/set", (req, res) => {
  data = req.body;
  const save = JSON.stringify(data, null, 2);
  saveData(save);
  res.json(data);
});

app.post("/set/comments/:commentId/replies", (req, res) => {
  const { commentId } = req.params;
  const { comments } = data;
  const reply = req.body;
  if (Number(commentId) >= 0 && Number(commentId) < comments.length) {
    data.comments[Number(commentId)].replies.push(reply);
    const save = JSON.stringify(data, null, 2);
    saveData(save);
    res.json(data);
  } else {
    res.status(404).send("Comment Not Found");
  }
});

app.post("/set/comments", (req, res) => {
  const comment = req.body;
  data.comments.push(comment);
  const save = JSON.stringify(data, null, 2);
  saveData(save);
  res.json(data);
});

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(5001);
