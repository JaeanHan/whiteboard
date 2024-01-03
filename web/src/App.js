import "./App.css";
import { Canvas } from "./component/Canvas";
import { ToolBar } from "./component/ToolBar";
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
  // const [leftOffsetWidth, setLeftOffsetWidth] = useState(0);
  return (
    <div className="App">
      <ToolBar
        setCurrentEvent={setCurrentEvent}
        // setLeftOffsetWidth={setLeftOffsetWidth}
      />
      <Canvas
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        // leftOffsetWidth={leftOffsetWidth}
      />
    </div>
  );
}

export default App;
