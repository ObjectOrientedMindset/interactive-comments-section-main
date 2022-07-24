import { useEffect, useState } from "react";

function Reply(props) {
  const { data, updateApp, replyPaths } = props;
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (data.user.username === "juliusomo") {
      setIsUser(true);
    }
  }, []);
  return (
    <div className="_reply">
      <hr />
      <section className="reply-container">
        <div className="upper-container">
          <div className="score-container">
            <img
              style={{ cursor: "pointer" }}
              className="plus"
              src="./images/icon-plus.svg"
              alt=""
            />
            <h4 className="score">{data.score}</h4>
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
          <p style={{ cursor: "pointer" }} className="reply-p">
            {isUser ? "Edit" : "Reply"}
          </p>
        </div>
        <p className="comment-description">
          <span className="replyingTo">{"@" + data.replyingTo}</span>
          {" " + data.content}
        </p>
      </section>
    </div>
  );
}

export default Reply;
