import "./App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Comment from "./Comment";
import SendComment from "./SendComment";

function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const getData = async () => {
    const response = await Axios.get("http://localhost:5000/api");
    const userData = await response.data;
    setData(userData);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="main-container">
      {data.comments.map((comment) => {
        return <Comment data={comment} updateApp={setData} />;
      })}
      <SendComment data={data} updateApp={setData} />
    </div>
  );
}

export default App;
