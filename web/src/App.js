import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { RectSVG } from "./component/RectSVG";
import { useSelectManager } from "./hooks/useSelectManager";
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

  const onClick = () => {};

  return (
    <div className="App" onClick={onClick}>
      spring: {comment}
      <Canvas />
    </div>
  );
}

export default App;
