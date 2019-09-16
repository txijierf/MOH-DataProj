import React from "react";

import { VariableSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import Cell from "./Cell";

import "./Sheet.scss";

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 24);

const Sheet = () => {
  // Anchor/inital point for selection
  const onMouseDown = (rowIndex, columnIndex, button) => {
    console.log(rowIndex, columnIndex, button)
  };

  // Selection drag
  const onMouseOver = (rowIndex, columnIndex, button) => {
    
  };

  // Selection release
  const onMouseUp = (rowIndex, columnIndex) => {

  };

  // Editor trigger
  const onDoubleClick = (rowIndex, colcolumnIndexIdx) => {

  };

  const itemData = { onMouseDown, onMouseOver, onMouseUp, onDoubleClick };

  return (
    <AutoSizer className="sheet">
      {({ height, width }) => (
        <VariableSizeGrid
          height={height}
          width={width}
          columnCount={1000}
          columnWidth={index => columnWidths[index]}
          rowCount={1000}
          rowHeight={index => rowHeights[index]}
          itemData={itemData}
          freezeRowCount={1}
          freezeColumnCount={1}
        >
          {Cell}
        </VariableSizeGrid>
      )}
    </AutoSizer>
  );
};

export default Sheet;