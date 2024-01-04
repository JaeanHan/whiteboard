import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { eventNameEnum } from "../utils/enums";
import { useTrajectoryLineManager } from "../hooks/useTrajectoryLineManager";

export const toolBarWidth = 250;

export const ToolBar = ({ setCurrentEvent }) => {
  const [comment, setComment] = useState("");

  // test
  useEffect(() => {
    axios
      .get("api/test")
      .then((res) => setComment(res.data))
      .catch((err) => alert(err));
  }, []);

  const Document = () => {};
  const Rect = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addRect);
  };

  const Line = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addLine);
  };

  const Text = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addText);
  };

  const TrajectoryLine = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addTrajectory);
  };

  const ApiPath = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.none);
  };

  const temp = useMemo(
    () => [Document, Rect, Line, TrajectoryLine, Text, ApiPath],
    [],
  );

  return (
    <div
      style={{
        width: toolBarWidth,
        minWidth: toolBarWidth,
        height: "100%",
        backgroundColor: "dodgerblue",
        display: "flex",
        flexDirection: "column",
      }}
    >
      spring : {comment}
      {temp.map((el, index) => {
        return (
          <button
            key={el.name}
            style={{
              marginTop: "15px",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: 19,
            }}
            onClick={el}
          >
            {index === 0 ? " " : "generate"} {el.name}
          </button>
        );
      })}
    </div>
  );
};
