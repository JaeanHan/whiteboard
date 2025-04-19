import { useEffect, useState } from "react";
import { sideBarWidth } from "./SideBar";
import { WindowManager } from "../eventTarget/WindowManager";
import { eventNameEnum } from "../utils/enums";

export const bannerHeight = 30;

export const Tabs = ({ setCurrentEvent }) => {
  const WM = WindowManager.getInstance();

  const [windows, setWindows] = useState([WM.getSelectedVirtualWindow()]);
  const [hoveringIndex, setHoveringIndex] = useState(null);
  const selectedWindow = WM.getSelectedVirtualWindow();
  WM.setBannerWindowHandler(setWindows);
  // const barWidth = window.innerWidth - sideBarWidth;

  const addWindow = () => {
    const tempName = prompt("enter a new name for window");

    if (tempName === null) return;

    const name = tempName || WM.getUnnamedWindowNameOnAdd();

    // console.log("name", name);

    WM.addWindow(name);

    setWindows((prev) => [...prev, name]);
    // setSelectedWindow(windows.length);
    setCurrentEvent(eventNameEnum.windowChange);
  };

  const deleteWindow = (e, index) => {
    e.stopPropagation();
    WM.deleteWindow(windows[index], index);
    setCurrentEvent(eventNameEnum.windowChange);
  };

  const selectWindow = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const currentName = windows[index];

    if (e.ctrlKey) {
      const newName = prompt("enter a new name for window");

      if (newName.trim().length > 0) {
        WM.changeWindowVirtualName(currentName, index, newName);
        setWindows(WM.getVirtualWindows());
      }

      return;
    }

    WM.setSelectedWindow(currentName, index);

    // setSelectedWindow(index);
    setCurrentEvent(eventNameEnum.windowChange);
    setHoveringIndex(-1);
  };

  const onMouseEnter = (e, index) => {
    setHoveringIndex(index);
  };

  const onMouseLeave = (e) => {
    setHoveringIndex(-1);
  };

  const onMouseEnterClose = (e) => {
    e.stopPropagation();
  };

  const onMouseLeaveClose = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10,
        width: "100%",
        height: bannerHeight,
        // background: "linear-gradient(90deg, dodgerblue 10%, #fffde4 100%)",
        // background: "linear-gradient(90deg, whitesmoke 20%, #fffde4 100%)",
        background: "linear-gradient(90deg, #F6F8FB 60%, #E1E9F2 100%)",
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
              // width: 200,
              // width: Math.min(180, barWidth / windows.length),
              height: "100%",
              display: "flex",
              // justifyContent: "center",
              // alignItems: "center",

                zIndex: 10,
                transform: 'translateY(1px)',
                alignItems: 'end',
              borderBottom: "none",
              color: "black",
              backgroundColor:
                selectedWindow === windows[index] ? "white" : "whitesmoke",
              borderTop:
                selectedWindow === windows[index]
                  ? "lightgray 1px solid"
                  : "none",
              borderLeft:
                selectedWindow === windows[index]
                  ? "lightgray 1px solid"
                  : "none",
              borderRight:
                selectedWindow === windows[index]
                  ? "lightgray 1px solid"
                  : "none",
              borderTopLeftRadius:
                selectedWindow === windows[index] || index === 0 ? 5 : 0,
              borderTopRightRadius: selectedWindow === windows[index] ? 5 : 0,
            }}
            onMouseLeave={onMouseLeave}
            onMouseEnter={(e) => onMouseEnter(e, index)}
            onClick={(e) => selectWindow(e, index)}
          >
            <div
              style={{
                display: "flex",
                lineHeight: "100%",
                overflowX: "hidden",
                cursor: "default",
                // width: "min(calc(max-content), 100px)",
                width: "max-content",
                paddingRight: 10,
                paddingLeft: 10,
                height: "80%",
                borderRadius: 5,
                backgroundColor:
                  selectedWindow !== windows[index] && hoveringIndex === index
                    ? "silver"
                    : "transparent",
                textAlign: "start",
                textIndent: 10,
              }}
              onMouseEnter={onMouseEnterClose}
              onMouseLeave={onMouseLeaveClose}
            >
              <div
                style={{
                  // width: Math.min(145, 'max-content'),
                  width: "min(max-content, 100px)",
                  // textOverflow: "ellipsis",
                  textOverflow: "clip",
                  overflowX: "hidden",
                }}
              >
                {el}
              </div>
              <div
                style={{
                  visibility:
                    hoveringIndex === index && selectedWindow !== windows[index]
                      ? "visible"
                      : "hidden",
                  opacity: 0.5,
                  borderRadius: 6,
                  width: 13,
                  height: 13,
                  marginLeft: 15,
                  border: "1px solid gray",
                  textAlign: "center",
                  lineHeight: 0.75,
                  zIndex: 15,
                  cursor: "default",
                }}
                onClick={(e) => deleteWindow(e, index)}
              >
                x
              </div>
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
        onMouseEnter={() => setHoveringIndex(-1)}
      >
        +
      </button>
    </div>
  );
};
