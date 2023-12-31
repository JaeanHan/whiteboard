import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Canvas } from "./component/Canvas";

function App() {
  const [comment, setComment] = useState("");

  // test
  useEffect(() => {
    axios
      .get("api/test")
      .then((res) => setComment(res.data))
      .catch((err) => alert(err));
  }, []);

  return (
    <div className="App">
      spring: {comment}
      <Canvas />
    </div>
  );
}

export default App;
