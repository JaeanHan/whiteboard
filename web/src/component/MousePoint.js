export const MousePoint = ({ value }) => {
  const pos = value[1];

  return (
    <div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        border: "2px dotted black",
        borderRadius: "50%",
        background: "transparent",
        left: pos.x - 10,
        top: pos.y - 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 5,
          height: 5,
          background: "black",
          borderRadius: "50%",
          left: 7.5,
          top: 7.5,
        }}
      ></div>
    </div>
  );
};
