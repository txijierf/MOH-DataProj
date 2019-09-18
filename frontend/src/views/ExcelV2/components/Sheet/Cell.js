import React, { useState, useRef } from "react";

/**
 * TODO: Allow input after tab/enter 
 * TODO: Allow selection and selection scope copy 
 */
const Cell = ({ columnIndex, rowIndex, style, data: { excelManager }}) => {
  const [ contentEditable, setContentEditable ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  const inputRef = useRef(null);
  
  // const handleMouseUp = ({ button }) => onMouseUp(rowIndex, columnIndex, button);
  const handleClick = (event) => {
    event.preventDefault();
    if(contentEditable) {
      if(!editMode) setEditMode(true);
    } else {
      setContentEditable(true);
    }
  };

  const handleBlur = () => {
    // Submit content
    if(contentEditable) setContentEditable(false);

    if(editMode) setEditMode(false);
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();

      setEditMode(!editMode);
    }
  };

  const handleMouseDown = () => {
    if(contentEditable) {
      if(!editMode) setEditMode(true);
    }
  };

  const className = `cell ${editMode ? "cell__editable" : "cell__uneditable"}`;

  return (
    <div 
      className={className} 
      style={style} 
      ref={inputRef}
      tabIndex="0" 
      suppressContentEditableWarning 
      contentEditable={contentEditable} 
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown} 
      onClick={handleClick}
      onBlur={handleBlur}
    >
      texts
    </div>
  );
};

export default Cell;