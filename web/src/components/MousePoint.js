export const MousePoint = ({ src }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        border: "2px dotted black",
        borderRadius: "50%",
        background: "transparent",
        left: src.x - 10,
        top: src.y - 10,
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
