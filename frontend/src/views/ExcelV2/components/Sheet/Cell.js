import React from "react";

const Cell = ({ columnIndex, rowIndex, style, data: { onMouseDown, onMouseOver, onMouseUp, onDoubleClick }}) => {
  const handleMouseDown = ({ button }) => onMouseDown(rowIndex, columnIndex, button);
  const handleMouseUp = ({ button }) => onMouseUp(rowIndex, columnIndex, button);
  return (
    <div className="cell" style={style} onMouseDown={handleMouseDown}>
      Item {rowIndex},{columnIndex}
    </div>
  );
};

export default Cell;