import { useEffect, useMemo, useRef, useState } from "react";
import { eventNameEnum } from "../utils/enums";
import { HttpRequestManager } from "../eventTarget/HttpRequestManager";

export const sideBarWidth = 250;

export const SideBar = ({ currentEvent, setCurrentEvent }) => {
  const divRef = useRef();
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState("Default");
  const httpRequest = HttpRequestManager.getInstance();

  // test
  useEffect(() => {
    httpRequest
      // axios
      .get("api/test")
      .then((res) => {
        setComment(res);
      })
      .catch((err) => console.log(err));
  }, [setComment]);

  useEffect(() => {
    if (currentEvent === eventNameEnum.windowChange) {
      setMode("Default");
    }
  }, [currentEvent]);

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

  const ClipboardImage = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addImage);
    setMode("Default");
  };

  const Save = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.save);
    setMode("Default");
  };

  const SaveAll = (e) => {
    alert("yet implemented !!!");
  };

  const LoadSaved = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.load);
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
    () => [Document, Save, SaveAll, Rect, Text, Line, StarSign, ClipboardImage],
    [Document],
  );

  return (
    <div
      style={{
        width: sideBarWidth,
        minWidth: sideBarWidth,
        height: window.innerHeight,
        // backgroundColor: "dodgerblue",
        // background: "linear-gradient(200deg, whitesmoke 10%, #fffde4 100%)",
        background: "linear-gradient(200deg, #F6F8FB 60%, #E1E9F2 100%)",
        // backgroundColor: "whitesmoke",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: 10,
      }}
    >
      <div ref={divRef} style={{ cursor: "pointer" }}>
        spring : {comment}
      </div>
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
                // backgroundColor: "dodgerblue",
                backgroundColor: "whitesmoke",
                border: "none",
                cursor: "pointer",
                // color: mode === el.name ? "white" : "black",
                color: mode === el.name ? "black" : "dodgerblue",
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
              // color: "white",
              color: "gray",
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
