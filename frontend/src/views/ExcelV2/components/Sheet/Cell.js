import React, { useState, useRef, useEffect } from "react";

/**
 * Fully functioning selection is extremely complicated
 * 
 * For now, basic selection will be the priority (no overlapping selections).
 */

const isCellSelectionContained = (columnIndex, rowIndex, { start, end }) => {
  if(!start || !end || start === {} || end === {}) return false;

  const { columnIndex: startColumn, rowIndex: startRow } = start;
  const { columnIndex: endColumn, rowIndex: endRow } = end;

  const isContained = (param, start, end) => (param >= start && param <= end) || (param >= end && param <= start);

  const isColumnContained = isContained(columnIndex, startColumn, endColumn);
  const isRowContained = isContained(rowIndex, startRow, endRow);

  return isColumnContained && isRowContained;
};


// Computes the coordinates of the new cell when arrow keys are pressed on non-editable data cells
// Upper and lower bounds are considered [1, columnCount - 1] and [1, rowCount - 1]
const computeCellDataDirection = (key, columnIndex, rowIndex, columnCount, rowCount) => {
  let newDirection;

  if(key === "ArrowUp") {
    newDirection = { rowIndex: rowIndex === 1 ? rowIndex : --rowIndex };
  } else if(key === "ArrowDown") {
    newDirection = { rowIndex: rowIndex === rowCount - 1 ? rowIndex : ++rowIndex };
  } else if(key === "ArrowLeft") {
    newDirection = { columnIndex: columnIndex === 1 ? columnIndex : --columnIndex };
  } else {
    newDirection = { columnIndex: columnIndex === columnCount - 1 ? columnIndex : ++columnIndex };
  }

  return newDirection;
}

const CellInput = ({ isCellActive, value, activeHeaders, editable, setEditable, setValue }) => {
  const [ inputValue, setInputValue ] = useState(value);
  const inputRef = useRef(null);

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      setValue(inputValue);
      event.preventDefault();
    } else if(event.key === "Tab") {
      setEditable(false);
    } else if(event.key === "Escape") {
      if(value !== inputValue) setInputValue(value);

      setEditable(false);
    }
  };

  const handleBlur = ({ target: { value: blurValue } }) => {
    if(value !== blurValue) setValue(blurValue);

    if((!isCellActive && editable) || activeHeaders !== {}) setEditable(false);
  };

  const handleChange = ({ target: { value } }) => setInputValue(value);

  useEffect(() => {
    return () => {
      if(!isCellActive && editable) setEditable(false);
    }
  });

  return (
    <input className="cell__input" autoFocus ref={inputRef} value={inputValue} type="text" onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur}/>
  );
};

/**
 * TODO: Allow selection scope copy 
 */
const CellData = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  data: { 
    activeCell: { columnIndex: activeColumn, rowIndex: activeRow }, 
    setActiveCell, 
    columnCount, 
    rowCount, 
    sheetData, 
    activeHeaders, 
    rectangularSelection,
    setRectangularSelection, 
    setActiveHeaders 
  } 
}) => {
  const [ value, setValue ] = useState(sheetData[rowIndex][columnIndex]);
  const [ editable, setEditable ] = useState(false);

  const containerRef = useRef(null);

  const isCellActive = columnIndex === activeColumn && rowIndex === activeRow;

  const isHighlighted = columnIndex === activeHeaders.column || rowIndex === activeHeaders.row || activeHeaders.all || isCellSelectionContained(columnIndex, rowIndex, rectangularSelection);

  const className = `cell ${isCellActive && editable ? "cell__editable" : "cell__uneditable"} ${isHighlighted && "cell__selected"}`;

  const handleFocus = () => {
    if(!isCellActive) setActiveCell({ columnIndex, rowIndex })
  };

  const handleClick = () => {
    if(activeHeaders !== {}) setActiveHeaders({});
  };

  const handleDoubleClick = () => {
    if(!editable) setEditable(true);
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      if(!editable) containerRef.current.focus();
      
      setEditable(!editable);
    } else if(event.key === "Tab") {
      if(editable) setEditable(false);
    } else if(/^Arrow(Up|Down|Left|Right)$/.test(event.key)) {
      if(!editable) {
        let newDirection = computeCellDataDirection(event.key, activeColumn, activeRow, columnCount, rowCount);
        setActiveCell({ columnIndex: activeColumn, rowIndex: activeRow, ...newDirection });
        event.preventDefault();
      }
    }
  };
  
  // Start anchor point for select
  const handleMouseDown = ({ button }) => {
    if(!editable && button === 0) {
      setRectangularSelection({ active: true, start: { columnIndex, rowIndex } })
      setActiveHeaders({});
    }
  };

  // Select in progress
  const handleMouseOver = () => {
    if(rectangularSelection.active) {
      setRectangularSelection({ ...rectangularSelection, end: { columnIndex, rowIndex } })
    }
  };

  // End point for select
  const handleMouseUp = ({ button }) => {
    if(rectangularSelection.active && button === 0) {
      setRectangularSelection({ ...rectangularSelection, active: false });
    }
  };

  useEffect(() => {
    if(isCellActive && !editable) {
      containerRef.current.focus();
    } else if(!isCellActive && editable) setEditable(false);  
  }, [ isCellActive, editable ]);
  
  
  const Content = (
    editable 
      ? <CellInput value={value} isCellActive={isCellActive} activeHeaders={activeHeaders} editable={editable} containerRef={containerRef} setEditable={setEditable} setValue={setValue}/>
      : <span>{value}</span>
  );
  return (
    <div 
      className={className} 
      style={style} 
      ref={containerRef}
      tabIndex="0" 
      onClick={handleClick}
      onDoubleClick={handleDoubleClick} 
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
    >
      {Content}
    </div>
  );
};

/**
 * Represents the top left cell between the column and row headers
 */
const CellHeaderBreaker = ({ style, data: { setActiveHeaders, setRectangularSelection } }) => {
  const handleClick = () => {
    setActiveHeaders({ all: { exclusions: [] } });
    setRectangularSelection({ active: false, start: {}, end: {} });
  };
  
  return (
    <div 
      className="cell cell__uneditable"
      style={style}
      tabIndex="0"
      onClick={handleClick}
    >
      
    </div>
  );
};

const CellHeaderColumn = ({ columnIndex, rowIndex, style, data: { sheetData, activeHeaders, setActiveHeaders, setRectangularSelection } }) => {
  const isActive = columnIndex === activeHeaders.column;
  const isHighlighted = activeHeaders.all;
  
  const handleClick = () => {
    setActiveHeaders({ column: isActive ? null : columnIndex });
    setRectangularSelection({ active: false, start: {}, end: {} });
  };

  const className = `cell cell__uneditable ${(isActive || isHighlighted) && "cell__selected"}`

  return (
    <div 
      className={className}
      style={style}
      tabIndex="0"
      onClick={handleClick}
    >
      {sheetData[rowIndex][columnIndex]}
    </div>
  );
};

const CellHeaderRow = ({ columnIndex, rowIndex, style, data: { sheetData, activeHeaders, setActiveHeaders, setRectangularSelection } }) => {
  const isActive = rowIndex === activeHeaders.row;
  const isHighlighted = activeHeaders.all;
  
  const handleClick = () => {
    setActiveHeaders({ row: isActive ? null: rowIndex });
    setRectangularSelection({ active: false, start: {}, end: {} });
  };

  const className = `cell cell__uneditable ${(isActive || isHighlighted) && "cell__selected"}`

  return (
    <div 
      className={className}
      style={style}
      tabIndex="0"
      onClick={handleClick}
    >
      {sheetData[rowIndex][columnIndex]}
    </div>
  );
};

// TODO: Allow Resizing of row/column
const CellHeaderFactory = (cellProps) => {
  // Row
  if(cellProps.rowIndex !== 0) {
    return <CellHeaderRow {...cellProps}/>
  // Column
  } else if(cellProps.columnIndex !== 0) {
    return <CellHeaderColumn {...cellProps}/>
  // Breaker
  } else {
    return <CellHeaderBreaker {...cellProps}/>
  }
};

const CellFactory = (cellProps) => (
  cellProps.columnIndex === 0 || cellProps.rowIndex === 0 
    ? <CellHeaderFactory {...cellProps}/>
    : <CellData {...cellProps}/>
);

export default CellFactory;