import Axios from "axios";
import { useEffect } from "react";

function ReplyComment(props) {
  const { id, commentId, replyingTo, updateApp, resize, updateComment } = props;

  const comment = {
    id: id,
    content: "",
    createdAt: "today",
    score: 0,
    replyingTo: replyingTo,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
  };
  function setStyleText() {
    document.getElementById("comment-input").style.color = "hsl(212, 24%, 26%)";
    document.getElementById("comment-input").style.fontSize = "16px";
  }
  function getText() {
    updateComment();
    let word = "@" + replyingTo;
    let element = document.getElementById("comment-input").value;
    let text = element.replace(word, "");
    comment.content = text;
    setData(comment);
    text = "";
    document.getElementById("comment-input").value = text;
  }
  async function setData(data) {
    const response = await Axios.post(
      `https://interactive-comments-server.onrender.com/set/comments/${commentId}/replies`,
      data
    );
    updateApp(response.data);
  }

  useEffect(() => {
    if (resize) {
      document.getElementById("send-container-id").style.marginLeft = "87px";
      document.getElementById("send-container-id").style.width = "673px";
      document.getElementById("comment-input").style.width = "480px";
    }
  }, []);

  return (
    <section
      id={resize ? "send-container-id" : undefined}
      className="send-container"
    >
      <img
        className="send-image"
        src="./images/avatars/image-juliusomo.png"
        alt=""
      />
      <div className="comment-box">
        <textarea
          onClick={setStyleText}
          id="comment-input"
          name="comment-input"
          className="add-comment"
          style={{ cursor: "pointer" }}
          defaultValue={"@" + replyingTo}
        ></textarea>
      </div>
      <button
        onClick={getText}
        style={{ cursor: "pointer" }}
        className="send-button"
      >
        REPLY
      </button>
    </section>
  );
}

export default ReplyComment;
