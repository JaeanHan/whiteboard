import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { RectSVG } from "./component/RectSVG";
import { useSelectManager } from "./hooks/useSelectManager";

function App() {
  const [comment, setComment] = useState("");
  const containerRef = useRef(null);
  const { addSvgToGroup, removeSvgFromGroup } = useSelectManager();

  // test
  useEffect(() => {
    axios
      .get("api/test")
      .then((res) => setComment(res.data))
      .catch((err) => alert(err));
  }, []);

  // setTimeout(() => {
  //   const img = convertSvgToString(rect).then((res) => drawSvg(res));
  // }, 1000);

  return (
    <div className="App" ref={containerRef}>
      spring: {comment}
      {/*<canvas*/}
      {/*  id="canvas"*/}
      {/*  ref={canvasRef}*/}
      {/*  width={1200}*/}
      {/*  height={800}*/}
      {/*  style={{ border: "1px solid #000000", backgroundColor: "white" }}*/}
      {/*></canvas>*/}
      <RectSVG
        canvasRef={containerRef}
        id={1}
        addSvgToGroup={addSvgToGroup}
        removeSvgFromGroup={removeSvgFromGroup}
      />
      <RectSVG
        canvasRef={containerRef}
        id={2}
        addSvgToGroup={addSvgToGroup}
        removeSvgFromGroup={removeSvgFromGroup}
      />
    </div>
  );
}

export default App;
