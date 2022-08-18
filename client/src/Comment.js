import { useState, useEffect } from "react";
import Axios from "axios";
import Reply from "./Reply";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const { comment, data, updateApp } = props;
  const replyPaths = new Map([
    ["juliusomo", "./images/icon-edit.svg"],
    ["ramsesmiron", "./images/icon-reply.svg"],
    ["maxblagun", "./images/icon-reply.svg"],
    ["amyrobson", "./images/icon-reply.svg"],
  ]);
  const replyHoverPaths = new Map([
    ["juliusomo", "./images/icon-edit-hover.svg"],
    ["ramsesmiron", "./images/icon-reply-hover.svg"],
    ["maxblagun", "./images/icon-reply-hover.svg"],
    ["amyrobson", "./images/icon-reply-hover.svg"],
  ]);
  const [isUser, setIsUser] = useState(false);
  const [replyState, setReplyState] = useState(false);
  const [editState, setEditState] = useState(false);

  function editReply() {
    if (isUser) {
      if (editState) {
        document.getElementById("comment-id" + comment.id).style.color =
          "hsl(238, 40%, 52%)";
        setEditState(false);
      } else if (!editState) {
        document.getElementById("comment-id" + comment.id).style.color =
          "hsl(239, 57%, 85%)";
        setEditState(true);
      }
    } else if (!isUser) {
      if (replyState) {
        document.getElementById("comment-id" + comment.id).style.color =
          "hsl(238, 40%, 52%)";
        setReplyState(false);
      } else if (!replyState) {
        document.getElementById("comment-id" + comment.id).style.color =
          "hsl(239, 57%, 85%)";
        setReplyState(true);
      }
    }
  }

  function edit() {
    const text = document.getElementById("edit-text").value;
    data.comments.forEach((element) => {
      if (element === comment) {
        element.content = text;
      }
    });
    setData(data);
    if (editState) {
      setEditState(false);
    } else if (!editState) {
      setEditState(true);
    }
  }
  function deleteComment() {
    const index = data.comments.indexOf(comment);
    if (index > -1) {
      data.comments.splice(index, 1);
      for (let i = 0; i < data.comments.length; i++) {
        data.comments[i].id = i;
      }
    }
    setData(data);
  }
  function scoreIncrement() {
    data.comments.forEach((element) => {
      if (element === comment) {
        element.score++;
      }
    });
    setData(data);
  }
  function scoreDecrement() {
    data.comments.forEach((element) => {
      if (element === comment) {
        element.score--;
      }
    });
    setData(data);
  }

  async function setData(data) {
    const response = await Axios.post("http://localhost:5001/set", data);
    updateApp(response.data);
  }

  useEffect(() => {
    if (comment.user.username === "juliusomo") {
      setIsUser(true);
    }
  }, []);

  return (
    <section className="comments-container">
      <div className="comment-container">
        <div className="upper-container">
          <div className="score-container">
            <img
              onClick={scoreIncrement}
              style={{ cursor: "pointer" }}
              className="plus"
              src="./images/icon-plus.svg"
              alt=""
            />
            <h4 id={comment.user.username} className="score">
              {comment.score}
            </h4>
            <img
              onClick={scoreDecrement}
              style={{ cursor: "pointer" }}
              className="minus"
              src="./images/icon-minus.svg"
              alt=""
            />
          </div>
          <img className="user-image" src={comment.user.image.png} alt="" />
          <p className="title user">{comment.user.username}</p>
          <p className={comment.user.username}>{isUser ? "you" : undefined}</p>
          <p className="title createdAt">{comment.createdAt}</p>
          <img
            className="delete"
            src={isUser ? "./images/icon-delete.svg" : undefined}
            alt=""
          />
          <p
            onClick={deleteComment}
            style={{ cursor: "pointer" }}
            className="delete-p"
          >
            {isUser ? "Delete" : undefined}
          </p>
          <img
            className="reply"
            src={
              !replyState && !editState
                ? replyPaths.get(comment.user.username)
                : replyHoverPaths.get(comment.user.username)
            }
            alt=""
          ></img>
          <p
            id={"comment-id" + comment.id}
            onClick={editReply}
            style={{ cursor: "pointer" }}
            className="reply-p"
          >
            {isUser ? "Edit" : "Reply"}
          </p>
        </div>
        <p className="comment-description">
          {editState ? (
            <textarea name="" id="edit-text" cols="90" rows="8">
              {comment.content}
            </textarea>
          ) : (
            comment.content
          )}
          {editState ? (
            <button
              onClick={edit}
              id="update-btn"
              style={{ cursor: "pointer" }}
              className="send-button"
            >
              UPDATE
            </button>
          ) : undefined}
        </p>
      </div>
      {replyState ? (
        <ReplyComment
          key={comment.replies.length}
          id={comment.replies.length}
          commentId={comment.id}
          replyingTo={comment.user.username}
          updateApp={updateApp}
          updateComment={editReply}
          resize={false}
        />
      ) : undefined}
      {comment.replies.map((reply) => {
        return (
          <Reply
            key={reply.id}
            data={data}
            reply={reply}
            comment={comment}
            updateApp={updateApp}
            replyPaths={replyPaths}
            replyHoverPaths={replyHoverPaths}
          />
        );
      })}
    </section>
  );
}

export default Comment;
