import React, { useState } from "react";

/**
 * TODO: Allow input after tab and key press 
 * TODO: Prevent text selection while allowing key press
 * TODO: Allow selection and selection scope copy 
 */
const Cell = ({ columnIndex, rowIndex, style, data: { onMouseDown, onMouseOver, onMouseUp, onDoubleClick }}) => {
  const [ contentEditable, setContentEditable ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  
  // const handleMouseUp = ({ button }) => onMouseUp(rowIndex, columnIndex, button);
  const handleClick = (event) => {
    if(contentEditable) {
      if(!editMode) setEditMode(true);
    } else {
      setContentEditable(true);
    }
  };

  const handleBlur = () => {
    // Submit content
    if(contentEditable) {
      setContentEditable(false); 
    }

    if(editMode) {
      setEditMode(false);
    }
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();

      setEditMode(!editMode);

      if(!contentEditable) setContentEditable(true);
    } 
  };

  const handleDragEnter = () => {
    if(contentEditable) {
      if(!editMode) setEditMode(true);
    }
  };

  const handleFocus = () => {
    if(editMode) {
      if(!contentEditable) setContentEditable(true);
    }
  };

  const className = `cell ${editMode ? "cell__editable" : "cell__uneditable"}`;

  console.log("edit mode", editMode, "contenteditab", contentEditable);

  return (
    <div 
      className={className} 
      style={style} 
      tabIndex="0" 
      suppressContentEditableWarning 
      contentEditable={contentEditable} 
      onDragEnter={handleDragEnter}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown} 
      onClick={handleClick}
      onBlur={handleBlur}
    >
      texts
    </div>
  );
};

export default Cell;