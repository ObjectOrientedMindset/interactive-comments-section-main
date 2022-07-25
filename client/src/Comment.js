import { useState, useEffect } from "react";
import Reply from "./Reply";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const { data, updateApp } = props;
  const replyPaths = new Map([
    ["juliusomo", "./images/icon-edit.svg"],
    ["ramsesmiron", "./images/icon-reply.svg"],
    ["maxblagun", "./images/icon-reply.svg"],
    ["amyrobson", "./images/icon-reply.svg"],
  ]);
  const [isUser, setIsUser] = useState(false);
  const [replyState, setReplyState] = useState(false);

  function editReply() {
    if(replyState){
      setReplyState(false);
    }else if(!replyState){
      setReplyState(true);
    }
  }

  useEffect(() => {
    if (data.user.username === "juliusomo") {
      setIsUser(true);
    }
  }, []);

  return (
    <section className="comments-container">
      <div className="comment-container">
        <div className="upper-container">
          <div className="score-container">
            <img
              style={{ cursor: "pointer" }}
              className="plus"
              src="./images/icon-plus.svg"
              alt=""
            />
            <h4 id={data.user.username} className="score">
              {data.score}
            </h4>
            <img
              style={{ cursor: "pointer" }}
              className="minus"
              src="./images/icon-minus.svg"
              alt=""
            />
          </div>
          <img className="user-image" src={data.user.image.png} alt="" />
          <p className="title user">{data.user.username}</p>
          <p className={data.user.username}>{isUser ? "you" : undefined}</p>
          <p className="title createdAt">{data.createdAt}</p>
          <img
            className="delete"
            src={isUser ? "./images/icon-delete.svg" : undefined}
            alt=""
          />
          <p style={{ cursor: "pointer" }} className="delete-p">
            {isUser ? "Delete" : undefined}
          </p>
          <img
            className="reply"
            src={replyPaths.get(data.user.username)}
            alt=""
          />
          <p
            onClick={editReply}
            style={{ cursor: "pointer" }}
            className="reply-p"
          >
            {isUser ? "Edit" : "Reply"}
          </p>
        </div>
        <p className="comment-description">{data.content}</p>
      </div>
      {replyState ? (
        <ReplyComment
          key={data.replies.length}
          commentId={data.id}
          replyingTo={data.user.username}
          updateApp={updateApp}
          updateComment={setReplyState}
          isReply={false}
        />
      ) : undefined}
      {data.replies.map((reply) => {
        return (
          <Reply key={reply.id} data={reply} comment={data} updateApp={updateApp} replyPaths={replyPaths} />
        );
      })}
    </section>
  );
}

export default Comment;
