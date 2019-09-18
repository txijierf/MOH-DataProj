import React, { useState } from "react";

/**
 * TODO: Allow input after tab and key press 
 * TODO: Prevent text selection while allowing key press
 * TODO: Allow selection and selection scope copy 
 */
const Cell = ({ columnIndex, rowIndex, style, data: { onMouseDown, onMouseOver, onMouseUp, onDoubleClick }}) => {
  const [ contentEditable, setContentEditable ] = useState(false);
  
  const handleMouseDown = ({ button }) => onMouseDown(rowIndex, columnIndex, button);
  // const handleMouseUp = ({ button }) => onMouseUp(rowIndex, columnIndex, button);
  const handleDoubleClick = () => {
    if(!contentEditable) setContentEditable(true);
  };
  const handleBlur = () => {
    // Submit content
    if(contentEditable) setContentEditable(false);
  };

  const handleChange = ({ key }) => {
    console.log("key change")
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();

      setContentEditable(!contentEditable);
    } else if(!contentEditable /** And key is proper input key */) setContentEditable(true);
  };

  const className = `cell ${contentEditable ? "cell__editable": "cell__uneditable"}`;

  return (
    <div 
      className={className} 
      style={style} 
      // draggable={true}
      tabIndex="0" 
      suppressContentEditableWarning 
      contentEditable={contentEditable} 
      onChange={handleChange} 
      onKeyDown={handleKeyDown} 
      onMouseDown={handleMouseDown} 
      onDoubleClick={handleDoubleClick} 
      onBlur={handleBlur}
    >
      texts
    </div>
  );
};

export default Cell;