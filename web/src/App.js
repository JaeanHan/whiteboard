import "./App.css";
import { Canvas } from "./components/Canvas";
import { ToolBar } from "./components/ToolBar";
import { eventNameEnum } from "./utils/enums";
import { useState } from "react";
import { GroupEventManager } from "./eventTarget/GroupEventManager";

function App() {
  GroupEventManager.getInstance().addEventListener(
    GroupEventManager.eventName,
    (e) => {
      const { isGrouping } = e.detail;
      GroupEventManager.getInstance().setGroupingState(isGrouping);
    },
  );
  const [currentEvent, setCurrentEvent] = useState(eventNameEnum.none);

  return (
    <div className="App">
      <ToolBar setCurrentEvent={setCurrentEvent} />
      <Canvas currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
    </div>
  );
}

export default App;
