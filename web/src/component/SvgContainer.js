import { useState } from "react";
import { dragStateEnum } from "../utils/enums";

export const SvgContainer = ({
  children,
  containerRef,
  id,
  addSvgToGroup,
  removeSvgFromGroup,
}) => {
  const [objPos, setObjPos] = useState({ x: 0, y: 0 });
  const [clientPos, setClientPos] = useState({ x: 0, y: 0 });
  const [objSize, setObjSize] = useState({ width: 150, height: 150 });
  const [dragState, setDragState] = useState(dragStateEnum.none);

  const onMouseEnter = () => {
    if (dragState === dragStateEnum.none) {
      setDragState(dragStateEnum.select);
    }
  };
  const onMouseDown = (e) => {
    if (dragState !== dragStateEnum.select) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (clientX < objPos.x || clientX > objPos.x + objSize.width) return;

    if (clientY < objPos.y || clientY > objPos.y + objSize.height) return;

    const diffRatio = { x: e.clientX - objPos.x, y: e.clientY - objPos.y };
    setDragState(dragStateEnum.drag);
    setClientPos(diffRatio);
  };
  const onMouseMove = (e) => {
    e.preventDefault();
    if (dragState === dragStateEnum.drag) {
      const destPos = {
        x: e.clientX - clientPos.x,
        y: e.clientY - clientPos.y,
      };
      setObjPos(destPos);
    }
  };
  const onMouseUp = (e) => {
    if (dragState === dragStateEnum.drag) {
      const destPos = {
        x: e.clientX - clientPos.x,
        y: e.clientY - clientPos.y,
      };
      setObjPos(destPos);
      setDragState(dragStateEnum.none);
    }
  };
  const onMouseLeave = () => {
    if (dragState === dragStateEnum.drag) return;
    setDragState(dragStateEnum.none);
  };

  const onClick = () => {
    if (dragState === dragStateEnum.group) {
      removeSvgFromGroup(id);
      setDragState(dragStateEnum.none);
      return;
    }
    addSvgToGroup(id);
    setDragState(dragStateEnum.group);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onClick={onClick}
      id={id}
      style={{
        cursor: "pointer",
        boxSizing: "border-box",
        width: "max-content",
        height: "max-content",
        position: "absolute",
        top: objPos.y,
        left: objPos.x,
      }}
    >
      {children}
    </div>
  );
};
