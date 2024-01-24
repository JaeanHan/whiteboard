import { useState } from "react";
import { sideBarWidth } from "./SideBar";
import { WindowManager } from "../eventTarget/WindowManager";

export const bannerHeight = 25;

export const Banner = ({ setCurrentEvent }) => {
  const [windows, setWindows] = useState(["Linear Algebra"]);
  const [selectedWindow, setSelectedWindow] = useState(0);
  const WM = WindowManager.getInstance();

  const addWindow = () => {
    const name = prompt("name");

    setWindows((prev) => [...prev, name]);
    setSelectedWindow(windows.length);

    WM.addWindow(name);
    WM.setSelectedWindowIndex(windows.length);

    // setCurrentEvent(eventNameEnum.windowChange);
  };

  const selectWindow = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedWindow(index);
    WM.setSelectedWindowIndex(index);
    // setCurrentEvent(eventNameEnum.windowChange);
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10,
        width: "100%",
        height: bannerHeight,
        background: "linear-gradient(90deg, dodgerblue 10%, #fffde4 100%)",
        display: "flex",
        justifyContent: "start",
        alignItems: "flex-end",
        paddingLeft: sideBarWidth,
        // opacity: window.scrollY > bannerHeight ? 0.5 : 1,
        // filter: "blur(1px)",
      }}
    >
      <div
        style={{
          width: "max-content",
          height: "90%",
          backgroundColor: "whitesmoke",
          display: "flex",
          alignItems: "flex-end",
          borderTopLeftRadius: 5,
        }}
      >
        {windows.map((el, index) => (
          <button
            key={index}
            style={{
              width: 200,
              height: "100%",
              cursor: "pointer",
              borderBottom: "none",
              backgroundColor:
                selectedWindow === index ? "white" : "whitesmoke",
              borderTop:
                selectedWindow === index ? "lightgray 1px solid" : "none",
              borderLeft:
                selectedWindow === index ? "lightgray 1px solid" : "none",
              borderRight:
                selectedWindow === index ? "lightgray 1px solid" : "none",
              borderTopLeftRadius: selectedWindow === index ? 5 : 0,
              borderTopRightRadius: selectedWindow === index ? 5 : 0,
            }}
            onClick={(e) => selectWindow(e, index)}
          >
            {el}
          </button>
        ))}
      </div>
      <button
        style={{
          border: "none",
          height: "90%",
          cursor: "pointer",
          backgroundColor: "whitesmoke",
          borderTopRightRadius: 5,
          // borderTopLeftRadius: 5,
          // borderBottomLeftRadius: 5,
          // borderLeft: "lightgray 1px solid",
        }}
        onClick={addWindow}
      >
        +
      </button>
    </div>
  );
};
