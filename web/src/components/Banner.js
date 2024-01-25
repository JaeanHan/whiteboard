import { useState } from "react";
import { sideBarWidth } from "./SideBar";
import { WindowManager } from "../eventTarget/WindowManager";

export const bannerHeight = 25;

export const Banner = () => {
  const WM = WindowManager.getInstance();

  console.log("asdas");

  const [windows, setWindows] = useState([WM.getSelectedVirtualWindow()]);
  const [selectedWindow, setSelectedWindow] = useState(0);
  const [hoveringIndex, setHoveringIndex] = useState(null);
  const [hoveringClose, setHoveringClose] = useState(false);

  const addWindow = () => {
    const name =
      prompt("new windows require unique name") ||
      WM.getUnnamedWindowNameOnAdd();

    WM.addWindow(name);

    setWindows((prev) => [...prev, name]);
    setSelectedWindow(windows.length);
  };

  const selectWindow = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const currentName = windows[index];

    if (e.ctrlKey) {
      const newName = prompt("unique name required for new windows");

      if (newName.trim().length > 0) {
        WM.changeWindowVirtualName(currentName, index, newName);
        setWindows(WM.getVirtualWindows());
      }

      return;
    }

    WM.setSelectedWindow(currentName, index);

    setSelectedWindow(index);
  };

  const onMouseEnter = (e, index) => {
    e.preventDefault();
    setHoveringIndex(index);
  };

  const onMouseLeave = (e) => {
    e.preventDefault();
    setHoveringIndex(null);
  };

  const onMouseEnterClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveringClose(true);
  };

  const onMouseLeaveClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveringClose(false);
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
          <div
            key={index}
            style={{
              width: 200,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: "none",
              color: "black",
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
            onMouseLeave={onMouseLeave}
            onMouseEnter={(e) => onMouseEnter(e, index)}
            onClick={(e) => selectWindow(e, index)}
          >
            <div
              style={{
                display: "flex",
                lineHeight: "100%",
                width: "max-content",
                paddingRight: 10,
                paddingLeft: 10,
                height: "80%",
                borderRadius: 5,
                backgroundColor:
                  selectedWindow !== index && hoveringIndex === index
                    ? "silver"
                    : "transparent",
              }}
              onMouseEnter={onMouseEnterClose}
              onMouseLeave={onMouseLeaveClose}
            >
              {el}
              {hoveringIndex === index && (
                <div
                  style={{
                    opacity: 0.5,
                    borderRadius: 6,
                    width: 13,
                    height: 13,
                    marginLeft: 15,
                    border: "1px solid gray",
                    textAlign: "center",
                    lineHeight: 0.75,
                    cursor: "default",
                  }}
                >
                  x
                </div>
              )}
            </div>
          </div>
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
