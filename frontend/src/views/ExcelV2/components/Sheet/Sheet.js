import React, { useState } from "react";

import { VariableSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import Cell from "./Cell";

import "./Sheet.scss";

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const columnWidths = new Array(50)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(50)
  .fill(true)
  .map(() => 24);

const Sheet = ({ excelManager }) => {
  const itemData = { excelManager };

  return (
    <AutoSizer className="sheet">
      {({ height, width }) => (
        <VariableSizeGrid
          height={height}
          width={width}
          columnCount={50}
          columnWidth={index => columnWidths[index]}
          rowCount={50}
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