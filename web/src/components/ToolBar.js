import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { eventNameEnum } from "../utils/enums";
export const toolBarWidth = 250;

export const ToolBar = ({ setCurrentEvent }) => {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState("Default");

  // test
  useEffect(() => {
    axios
      .get("api/test")
      .then((res) => setComment(res.data))
      .catch((err) => alert(err));
  }, []);

  const Document = () => {
    alert("clicked");
    setMode("Default");
  };

  const Rect = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addRect);
    setMode("Default");
  };

  const Line = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addLine);
    setMode("Default");
  };

  const Text = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addText);
    setMode("Default");
  };

  const ApiPath = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.none);
    setMode("Default");
  };

  const Default = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.none);
  };
  const Pencil = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addPath);
  };

  const Eraser = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.erase);
  };

  const cursor = useMemo(() => [Default, Pencil, Eraser], [mode]);
  const temp = useMemo(() => [Document, Rect, Text, Line, ApiPath], [Document]);

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
      <br />
      cursor mode ↓
      <div style={{ flexDirection: "row" }}>
        {cursor.map((el, index) => {
          return (
            <button
              id={el.name}
              key={el.name}
              onClick={(e) => {
                el(e);
                setMode(el.name);
              }}
              style={{
                backgroundColor: "dodgerblue",
                border: "none",
                cursor: "pointer",
                color: mode === el.name ? "white" : "black",
              }}
            >
              {el.name}
            </button>
          );
        })}
      </div>
      {temp.map((el, index) => {
        return (
          <button
            id={el.name}
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
            {index < 1 ? "" : "generate"} {el.name}
          </button>
        );
      })}
    </div>
  );
};
