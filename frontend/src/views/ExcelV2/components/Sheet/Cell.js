import React, { useState, useRef, useEffect } from "react";

// TODO: Consider lower and upper bounds
const computeNewDirection = (key, columnIndex, rowIndex) => {
  let newDirection;

  if(key === "ArrowUp") {
    newDirection = { rowIndex: --rowIndex };
  } else if(key === "ArrowDown") {
    newDirection = { rowIndex: ++rowIndex };
  } else if(key === "ArrowLeft") {
    newDirection = { columnIndex: --columnIndex };
  } else {
    newDirection = { columnIndex: ++columnIndex };
  }

  return newDirection;
}

const SAMPLE_VALUE = "hello";

const CellInput = ({ containerRef, value, setEditable, handleChange }) => {
  const inputRef = useRef(null);

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
    } else if(event.key === "Tab") {
      setEditable(false);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
    
    // Blur input and focus on container parent once this component unmounts
    return () => {
      inputRef.current.blur();
      containerRef.current.focus();
    }
  });

  return (
    <input className="cell__input" ref={inputRef} value={value} type="text" onChange={handleChange} onKeyDown={handleKeyDown}/>
  );
};

/**
 * TODO: Allow input after tab/enter 
 * TODO: Allow selection and selection scope copy 
 */
const Cell = ({ columnIndex, rowIndex, style, data: { excelManager, activeCell: { columnIndex: activeColumn, rowIndex: activeRow }, setActiveCell }}) => {
  const [ value, setValue ] = useState(SAMPLE_VALUE);
  const [ editable, setEditable ] = useState(false);

  const containerRef = useRef(null);

  const className = `cell ${editable ? "cell__editable" : "cell__uneditable"}`;

  const handleChange = ({ target: { value } }) => setValue(value);

  const handleFocus = () => {
    if(columnIndex !== activeColumn || rowIndex !== activeRow) setActiveCell({ columnIndex, rowIndex })
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
      let newDirection = computeNewDirection(event.key, activeColumn, activeRow);
      setActiveCell({ columnIndex: activeColumn, rowIndex: activeRow, ...newDirection });
      event.preventDefault();
    }
  };

  const Content = (
    editable 
      ? <CellInput value={value} containerRef={containerRef} setEditable={setEditable} handleChange={handleChange}/>
      : <span>{value}</span>
  );

  const handleBlur = () => {
    if(columnIndex !== activeColumn || rowIndex !== activeRow) {
      if(editable) setEditable(false);
    }
  };

  useEffect(() => {
    if(columnIndex === activeColumn && rowIndex === activeRow) containerRef.current.focus(); 
  });

  return (
    <div 
      className={className} 
      style={style} 
      ref={containerRef}
      tabIndex="0" 
      onDoubleClick={handleDoubleClick} 
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {Content}
    </div>
  );
};

export default Cell;