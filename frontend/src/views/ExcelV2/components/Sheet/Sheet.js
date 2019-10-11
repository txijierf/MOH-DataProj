import React, { useState } from "react";

import { VariableSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import CellData from "./Cell";

import "./Sheet.scss";

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const columnWidths = new Array(50)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

const rowHeights = new Array(50)
  .fill(true)
  .map(() => 24);

const sampleData = new Array(50)
  .fill(true)
  .map((data, rowIndex) => (
    new Array(50)
      .fill(true)
      .map((data, columnIndex) => `{ ${rowIndex}, ${columnIndex} }`)
  )
);

const Sheet = ({ excelManager }) => {
  const [ activeCell, setActiveCell ] = useState({ columnIndex: 1, rowIndex: 1 });
  const [ activeHeaders, setActiveHeaders ] = useState({});

  // Format: start = end = { rowIndex, columnIndex }
  const [ rectangularSelection, setRectangularSelection ] = useState({ active: false, start: {}, end: {} });

  // Temp for testing/developing
  const columnCount = 50;
  const rowCount = 50;

  const itemData = { 
    sheetData: sampleData, 
    columnCount, 
    rowCount, 
    excelManager, 
    activeCell, 
    activeHeaders, 
    rectangularSelection,
    setActiveCell, 
    setActiveHeaders, 
    setRectangularSelection
  };

  return (
    <AutoSizer className="sheet">
      {({ height, width }) => (
        <VariableSizeGrid
          height={height}
          width={width}
          columnCount={columnCount}
          columnWidth={index => columnWidths[index]}
          rowCount={rowCount}
          rowHeight={index => rowHeights[index]}
          itemData={itemData}
          freezeRowCount={1}
          freezeColumnCount={1}
        >
          {CellData}
        </VariableSizeGrid>
      )}
    </AutoSizer>
  );
};

export default Sheet;