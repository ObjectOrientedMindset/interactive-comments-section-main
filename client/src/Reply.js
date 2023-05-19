import { useEffect, useState } from "react";
import Axios from "axios";
import ReplyComment from "./ReplyComment";

function Reply(props) 
{
  const { data, reply, comment, updateApp, replyPaths, replyHoverPaths, commentDeleteState } =
    props;
  const [isUser, setIsUser] = useState(false);
  const [replyState, setReplyState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [message, setMessage] = useState("@" + reply.replyingTo + reply.content);

  const yes = () => {
    const indexComment = data.comments.indexOf(comment);
    if (indexComment > -1) {
      const indexReply = data.comments[indexComment].replies.indexOf(reply);
      if (indexReply > -1) {
        data.comments[indexComment].replies.splice(indexReply, 1);
        for (let i = 0; i < data.comments[indexComment].replies.length; i++) {
          data.comments[indexComment].replies.id = i;
        }
      }
    }
    setData(data);
    setDeleteState(true);
  }

  const cancel = () => {
    setDeleteState(false);
  }


  function editReply() {
    if (isUser) {
      if (editState) {
        document.getElementById("reply-id" + reply.user.username + reply.id).style.color =
          "hsl(238, 40%, 52%)";
        setEditState(false);
      } else if (!editState) {
        document.getElementById("reply-id" + reply.user.username + reply.id).style.color =
          "hsl(239, 57%, 85%)";
        setEditState(true);
      } 
    } else if (!isUser) {
      if (replyState) {
        document.getElementById("reply-id" + reply.user.username + reply.id).style.color =
          "hsl(238, 40%, 52%)";
        setReplyState(false);
      } else if (!replyState) {
        document.getElementById("reply-id" + reply.user.username + reply.id).style.color =
          "hsl(239, 57%, 85%)";
        setReplyState(true);
      }
    }
}
  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const edit = () => {
    let word = "@" + reply.replyingTo;
    let element = document.getElementById("edit-text").value;
    let text = element.replace(word, "");

    data.comments.forEach((element) => {
      if (element === comment) {
        element.replies.forEach((element) => {
          if (element === reply) {
            element.content = text;
          }
        });
      }
    });
    setData(data);
    editReply();
  };
  function scoreIncrement() {
    data.comments.forEach((element) => {
      if (element === comment) {
        element.replies.forEach((element) => {
          if (element === reply) {
            element.score++;
          }
        });
      }
    });
    setData(data);
  }
  function scoreDecrement() {
    data.comments.forEach((element) => {
      if (element === comment) {
        element.replies.forEach((element) => {
          if (element === reply) {
            element.score--;
          }
        });
      }
    });
    setData(data);
  }

  function deleteReply() {
    if(!commentDeleteState){
      if(deleteState){
        setDeleteState(false);
      }else if(!deleteState){
        setDeleteState(true);
      }
    }
  }

  async function setData(data) {
    const response = await Axios.post("http://localhost:5001/set", data);
    updateApp(response.data);
  }

  useEffect(() => {
    if (reply.user.username === "juliusomo") {
      setIsUser(true);
    }
  }, []);
  return (
    <section className="comments-container">
      <div className="_reply">
        <hr />
        <section className="reply-container">
          <div className="upper-container">
            <div className="score-container">
              <img
                onClick={scoreIncrement}
                style={{ cursor: "pointer" }}
                className="plus"
                src="./images/icon-plus.svg"
                alt=""
              />
              <h4 className="score">{reply.score}</h4>
              <img
                onClick={scoreDecrement}
                style={{ cursor: "pointer" }}
                className="minus"
                src="./images/icon-minus.svg"
                alt=""
              />
            </div>
            <img className="user-image" src={reply.user.image.png} alt="" />
            <p className="title user">{reply.user.username}</p>
            <p className={reply.user.username}>{isUser ? "you" : undefined}</p>
            <p className="title createdAt">{reply.createdAt}</p>
            <img
              className="delete"
              src={isUser ? "./images/icon-delete.svg" : undefined}
              alt=""
            />
            <p
              onClick={deleteReply}
              style={{ cursor: "pointer" }}
              className="delete-p"
            >
              {isUser ? "Delete" : undefined}
            </p>
            <img
              className="reply"
              src={
                !replyState && !editState
                  ? replyPaths.get(reply.user.username)
                  : replyHoverPaths.get(reply.user.username)
              }
              alt=""
            />
            <p
              id={"reply-id" + reply.user.username + reply.id}
              onClick={editReply}
              style={{ cursor: "pointer" }}
              className="reply-p"
            >
              {isUser ? "Edit" : "Reply"}
            </p>
          </div>
          <p className="comment-description">
            {editState ? (
              <textarea name="edit" value={message} id="edit-text" className="add-comment" onChange={handleMessageChange}>
                {"@" + reply.replyingTo + " " + reply.content}
              </textarea>
            ) : (
              <span className="replyingTo">{"@" + reply.replyingTo + " "}</span>
            )}
            {!editState ? reply.content : undefined}
            {editState ? (
              <button
                onClick={edit}
                id="update-btn2"
                style={{ cursor: "pointer" }}
                className="send-button"
              >
                UPDATE
              </button>
            ) : undefined}
          </p>
        </section>
      </div>
      {replyState ? (
        <ReplyComment
          key={comment.replies.length}
          id={comment.replies.length}
          commentId={comment.id}
          replyingTo={reply.user.username}
          updateApp={updateApp}
          updateComment={editReply}
          resize={true}
        />
      ) : undefined}
      {deleteState ? (
        <section className="delete-container">
        <h1 className="delete-confir h">Delete Comment</h1>
        <p className="delete-confir p">Are you sure you want to delete this comment ? This will remove the comment and can't be undone.</p>
        <button onClick={cancel} className="delete-confir no">NO, CANCEL</button>
        <button onClick={yes} className="delete-confir yes">YES, DELETE</button>
      </section>
      )
      : undefined
      }
    </section>
  );
}


export default Reply;




