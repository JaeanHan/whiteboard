import "./App.css";
import { Canvas } from "./components/Canvas";
import { SideBar } from "./components/SideBar";
import { eventNameEnum } from "./utils/enums";
import { useState } from "react";
import { GroupEventManager } from "./eventTarget/GroupEventManager";
import { ThrottleManager } from "./eventTarget/ThrottleManager";
import { Banner } from "./components/Banner";

function App() {
  GroupEventManager.getInstance().addEventListener(
    GroupEventManager.eventName,
    (e) => {
      const { isGrouping } = e.detail;
      GroupEventManager.getInstance().setGroupingState(isGrouping);
    },
  );
  ThrottleManager.getInstance()
    .addEventListener(ThrottleManager.dragEvent, (e) => {
      const { eventName, isThrottling } = e.detail;
      ThrottleManager.getInstance().setEventMap(eventName, isThrottling);
    })
    .addEventListener(ThrottleManager.scrollEvent, (e) => {
      const { eventName, isThrottling } = e.detail;
      ThrottleManager.getInstance().setEventMap(eventName, isThrottling);
    });

  const [currentEvent, setCurrentEvent] = useState(eventNameEnum.none);

  return (
    <div className="App">
      <Banner setCurrentEvent={setCurrentEvent} />
      <SideBar setCurrentEvent={setCurrentEvent} />
      <Canvas currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
    </div>
  );
}

export default App;
