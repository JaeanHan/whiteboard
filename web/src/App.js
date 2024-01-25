import "./App.css";
import { Canvas } from "./components/Canvas";
import { SideBar } from "./components/SideBar";
import { eventNameEnum } from "./utils/enums";
import { useState } from "react";
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

  return (
    <div className="App">
      <Banner />
      <SideBar setCurrentEvent={setCurrentEvent} />
      <Canvas currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
    </div>
  );
}

export default App;
