import React, { useState, useRef, useEffect } from "react";


// TODO: Do not send both properties here!!!
const arrowDestination = (arrow, rowIndex, columnIndex) => {
  if(arrow === "ArrowUp") {
    rowIndex--;
  } else if(arrow === "ArrowDown") {
    rowIndex++;
  } else if(arrow === "ArrowLeft") {
    columnIndex--;
  } else {
    columnIndex++;
  }

  return { columnIndex, rowIndex };
};

/**
 * TODO: Allow input after tab/enter 
 * TODO: Allow selection and selection scope copy 
 * 
 * 
 * Ideas: push active cell ref up to sheet
 * > When new ref selected, put focus on it
 */
const Cell = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  data: { 
    activeCell: { columnIndex: activeColumn, rowIndex: activeRow },
    editMode,
    cellClicked,
    setActiveCell,
    setEditMode,
    setCellClicked
  } 
}) => {
  const inputRef = useRef(null);
  
  const contentEditable = activeColumn === columnIndex && activeRow === rowIndex;

  const handleClick = (event) => {
    event.preventDefault();
    setCellClicked(true);
  };

  const handleBlur = () => {
    if(editMode) setEditMode(false);
    if(cellClicked) setCellClicked(false);
  };

  const handleKeyDown = (event) => {
    // console.log(event.keys);
    if(event.key === "Enter") {
      event.preventDefault();

      setEditMode(!editMode);

      // TODO: multiple key detection and change
      // Edit mode check
    } else if(/^Arrow(Up|Down|Left|Right)$/.test(event.key)) {
      const newCell = arrowDestination(event.key, rowIndex, columnIndex);
      setActiveCell(newCell);
      event.preventDefault();
    }
  };

  const handleMouseDown = () => {
    if(contentEditable) {
      if(!editMode) setEditMode(true);
    }
  };

  const className = `cell ${contentEditable && editMode ? "cell__editable" : "cell__uneditable"}`;

  const handleFocus = () => {
    if(!contentEditable) setActiveCell({ rowIndex, columnIndex });
  };

  useEffect(() => {
    if(contentEditable) {
      // console.log("focusable")
      inputRef.current.focus();
    }
  });

  return (
    <div 
      className={className} 
      style={style} 
      ref={inputRef}
      tabIndex="0" 
      suppressContentEditableWarning 
      contentEditable={contentEditable} 
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown} 
      onDoubleClick={handleClick}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      texts
    </div>
  );
};

export default Cell;