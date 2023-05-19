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
  const [deleteState, setDeleteState] = useState(false);
  const [message, setMessage] = useState(comment.content);
  const [isVisible, setIsVisible] = useState(false);


  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const yes = () => {
    setDeleteState(true);
    setIsVisible(true);
    const index = data.comments.indexOf(comment);
    if (index > -1) {
      data.comments.splice(index, 1);
      for (let i = 0; i < data.comments.length; i++) {
        data.comments[i].id = i;
      }
    }
    setData(data);
  }

  const cancel = () => {
    setIsVisible(false);
    setDeleteState(false);
  }

  function editReply() {
      if (editState) {
        document.getElementById("comment-id" + comment.user.username + comment.id).style.color =
          "hsl(238, 40%, 52%)";
        setEditState(false);
      } else if (!editState) {
        document.getElementById("comment-id" + comment.user.username + comment.id).style.color =
          "hsl(239, 57%, 85%)";
        setEditState(true);
      }
      if (replyState) {
        document.getElementById("comment-id" + comment.user.username + comment.id).style.color =
          "hsl(238, 40%, 52%)";
        setReplyState(false);
      } else if (!replyState) {
        document.getElementById("comment-id" + comment.user.username + comment.id).style.color =
          "hsl(239, 57%, 85%)";
        setReplyState(true);
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
    editReply();
  }
  function deleteComment() {
    const rootElement = document.documentElement;
    const deleteBox = document.querySelector(".delete-container");
       
    if(deleteState){
      setIsVisible(false);
      setDeleteState(false);
    }else if(!deleteState){
      setIsVisible(true);
      setDeleteState(true);
    }     
    
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
      <div id={"comment-id" + comment.id} className="comment-container">
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
            id={"comment-id" + comment.user.username + comment.id}
            onClick={editReply}
            style={{ cursor: "pointer" }}
            className="reply-p"
          >
            {isUser ? "Edit" : "Reply"}
          </p>
        </div>
        <p className="comment-description">
          {editState ? (
            <textarea name="edit" value={message} onChange={handleMessageChange} id="edit-text" className="edit-comment">
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
      {comment.replies.map((element) => {
        return (
          <Reply
            key={element.id}
            data={data}
            reply={element}
            comment={comment}
            updateApp={updateApp}
            replyPaths={replyPaths}
            replyHoverPaths={replyHoverPaths}
            commentDeleteState={deleteState}
          />
        );
      })}
        <section id="dk" className="delete-container" style={{visibility: isVisible ? 'visible' : 'hidden'}}>
        <h1 className="delete-confir h">Delete Comment</h1>
        <p className="delete-confir p">Are you sure you want to delete this comment ? This will remove the comment and can't be undone.</p>
        <button onClick={cancel} className="delete-confir no">NO, CANCEL</button>
        <button onClick={yes} className="delete-confir yes">YES, DELETE</button>
      </section>
    </section>
  );
}

export default Comment;
