import { useState } from "react";
import { MessageQueue } from "../utils/MessageQueue";
import { sideBarWidth } from "./SideBar";

export const ToastMessage = ({ message }) => {
  const MD = MessageQueue.getInstance();
  const currentQueue = MD.getCurrentQueue();

  return (
    <div
      style={{
        position: "absolute",
        zIndex: "100",
        width: 400,
        height: 50,
        top: currentQueue.length * 50,
        left: sideBarWidth + 50,
        // color: "dodgerblue",
        background: "linear-gradient(90deg, #F6F8FB 60%, #E1E9F2 100%)",
        borderRadius: 20,
        textAlign: "center",
        transition: "0.3",
      }}
    >
      {message}
    </div>
  );
};
