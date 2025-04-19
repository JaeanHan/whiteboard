import "./App.css";
import { Canvas } from "./components/Canvas/Canvas";
import { SideBar } from "./components/SideBar";
import { eventNameEnum } from "./utils/enums";
import {useEffect, useRef, useState} from "react";
import { GroupEventManager } from "./eventTarget/GroupEventManager";
import { ThrottlingDebouncingManager } from "./eventTarget/ThrottlingDebouncingManager";
import { Tabs } from "./components/Tabs";

function App() {
  GroupEventManager.getInstance().addEventListener(
    GroupEventManager.eventName,
    (e) => {
      const { isGrouping } = e.detail;
      GroupEventManager.getInstance().setGroupingState(isGrouping);
    },
  );
  ThrottlingDebouncingManager.getInstance()
    .addEventListener(ThrottlingDebouncingManager.dragEvent, (e) => {
      const { eventName, isThrottling } = e.detail;
      ThrottlingDebouncingManager.getInstance().setEventMap(
        eventName,
        isThrottling,
      );
    })
    .addEventListener(ThrottlingDebouncingManager.scrollEvent, (e) => {
      const { eventName, isThrottling } = e.detail;
      ThrottlingDebouncingManager.getInstance().setEventMap(
        eventName,
        isThrottling,
      );
    });

  const [currentEvent, setCurrentEvent] = useState(() => eventNameEnum.none);
  // const [user, setUser] = useState("jaean");
  const [user, setUser] = useState("study");
  const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({
        // width: window.innerWidth - sideBarWidth,
        // height: window.innerHeight - bannerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
    setCurrentEvent(eventNameEnum.load);
  }, [setUser]);

  return (
    <div className="App">
      <SideBar currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} ref={canvasRef} canvasSize={canvasSize} />
      <Tabs setCurrentEvent={setCurrentEvent} />
      <Canvas
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        owner={user}
        ref={canvasRef}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
      />
    </div>
  );
}

export default App;
