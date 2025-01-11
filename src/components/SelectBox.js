export const SelectBox = ({ selectClientBox }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: Math.min(selectClientBox.src.y, selectClientBox.dest.y),
        left: Math.min(selectClientBox.src.x, selectClientBox.dest.x),
        border: "dashed gray",
        backgroundColor: "none",
        width: Math.abs(selectClientBox.src.x - selectClientBox.dest.x),
        height: Math.abs(selectClientBox.src.y - selectClientBox.dest.y),
      }}
    ></div>
  );
};
