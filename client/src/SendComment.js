import Axios from "axios";

function SendComment(props) {
  const { data, updateApp } = props;
  const comment = {
    id: data.comments.length,
    content: "",
    createdAt: "today",
    score: 0,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    replies: [],
  };
  function setStyleText() {
    document.getElementById("comment-input").style.color = "hsl(212, 24%, 26%)";
    document.getElementById("comment-input").style.fontSize = "16px";
  }
  function getText() {
    let text = document.getElementById("comment-input").value;
    comment.content = text;
    setData(comment);
    text = "";
    document.getElementById("comment-input").value = text;
  }
  async function setData(data) {
    const response = await Axios.post(
      "https://interactive-comments-server.onrender.com/set/comments",
      data
    );
    updateApp(response.data);
  }

  return (
    <section className="send-container">
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
          defaultValue="Add a comment...."
        ></textarea>
      </div>
      <button
        onClick={getText}
        style={{ cursor: "pointer" }}
        className="send-button"
      >
        SEND
      </button>
    </section>
  );
}

export default SendComment;
