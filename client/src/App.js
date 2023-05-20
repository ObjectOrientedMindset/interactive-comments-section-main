import "./App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Comment from "./Comment";
import SendComment from "./SendComment";

function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const getData = async () => {
    const response = await Axios.get("https://interactive-comments-server.onrender.com/get");
    const userData = await response.data;
    setData(userData);
    setLoading(false);   
  } 
  
  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="main-container">
      {data.comments.sort((a, b) => a.score < b.score ? 1 : -1)
      .map((comment) => {
        var i = 0;
        return (
          <Comment
            key={i}
            comment={comment}
            data={data}
            updateApp={setData}
          />
        );
        i++;
      })}
      <SendComment data={data} updateApp={setData} />
    </div>
  );
}

export default App;
