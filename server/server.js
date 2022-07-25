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

app.get("/api", (req, res) => {
  res.json(data);
});

app.get("/currentUser", (req, res) => {
  const { currentUser } = data;
  res.json(currentUser);
});

app.get("/comments", (req, res) => {
  const { comments } = data;
  res.json(comments);
});

app.get("/comments/:commentId", (req, res) => {
  const { commentId } = req.params;
  const { comments } = data;
  if (Number(commentId) >= 0 && Number(commentId) < comments.length) {
    const comment = comments.find((comment) => {
      return comment.id === Number(commentId);
    });

    res.json(comment);
  } else {
    res.status(404).send("Comment Not Found");
  }
});

app.get("/comments/:commentId/replies", (req, res) => {
  const { commentId } = req.params;
  const { comments } = data;
  if (Number(commentId) >= 0 && Number(commentId) < comments.length) {
    const comment = comments.find((comment) => {
      return comment.id === Number(commentId);
    });

    res.json(comment.replies);
  } else {
    res.status(404).send("Comment Not Found");
  }
});

app.get("/comments/:commentId/replies/:replieId", (req, res) => {
  const { commentId, replieId } = req.params;
  const { comments } = data;
  if (Number(commentId) >= 0 && Number(commentId) < comments.length) {
    const comment = comments.find((comment) => {
      return comment.id === Number(commentId);
    });
    if (Number(replieId) >= 0 && Number(replieId) < comment.replies.length) {
      const replie = comment.replies.find((replie) => {
        return replie.id === Number(replieId);
      });
      res.json(replie || "Replie Not Found");
    } else {
      res.status(404).send("Replie Not Found");
    }
  } else {
    res.status(404).send("Comment Not Found");
  }
});

app.post("/comments/:commentId/replies", (req, res) => {
  const { commentId } = req.params;
  const { comments } = data;
  const reply = req.body;
  if (Number(commentId) >= 0 && Number(commentId) < comments.length) {
    const reply = req.body;
    data.comments[Number(commentId)].replies.push(reply);
    const save = JSON.stringify(data, null, 2);
    saveData(save);
    res.json(data);
  } else {
    res.status(404).send("Comment Not Found");
  }
});

app.post("/comments", (req, res) => {
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
