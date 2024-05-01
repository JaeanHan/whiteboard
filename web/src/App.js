import "./App.css";
import { Canvas } from "./components/Canvas";
import { SideBar } from "./components/SideBar";
import { eventNameEnum } from "./utils/enums";
import { useEffect, useState } from "react";
import { GroupEventManager } from "./eventTarget/GroupEventManager";
import { ThrottlingDebouncingManager } from "./eventTarget/ThrottlingDebouncingManager";
import { Banner } from "./components/Banner";

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

  const [currentEvent, setCurrentEvent] = useState(eventNameEnum.none);
  // const [user, setUser] = useState("jaean");
  const [user, setUser] = useState("study");

  useEffect(() => {
    setCurrentEvent(eventNameEnum.load);
  }, [setUser]);

  return (
    <div className="App">
      <Banner setCurrentEvent={setCurrentEvent} />
      <SideBar currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
      <Canvas
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        owner={user}
      />
    </div>
  );
}

export default App;
