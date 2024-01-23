import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { eventNameEnum } from "../utils/enums";
import { HttpRequestManager } from "../eventTarget/HttpRequestManager";
export const toolBarWidth = 250;

export const ToolBar = ({ setCurrentEvent }) => {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState("Default");
  const httpRequest = HttpRequestManager.getInstance();

  // test
  useEffect(() => {
    httpRequest
      // axios
      .get("api/test")
      .then((res) => {
        console.log("wtf", res);
        setComment(res);
      })
      .catch((err) => console.log(err));
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

  const StarSign = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addStars);
    setMode("Default");
  };

  const Save = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.save);
    setMode("Default");
  };

  const LoadSaved = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.read);
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
  const temp = useMemo(
    () => [Document, Save, LoadSaved, Rect, Text, Line, StarSign],
    [Document],
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
        position: "fixed",
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
            {index < 3 ? "" : "generate"} {el.name}
          </button>
        );
      })}
    </div>
  );
};
