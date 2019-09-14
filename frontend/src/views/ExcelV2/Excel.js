import React, { useState } from "react";

import AppBar from "./components/AppBar";
import ToolBar from "./components/ToolBar";
import Sheet from "./components/Sheet";
import BottomBar from "./components/BottomBar";

const DEFAULT_TITLE = "Untitled workbook";

const Excel = () => {
  const [ title, setTitle ] = useState(DEFAULT_TITLE);
  
  const handleTitleChange = (event) => setTitle(event.target.value);

  return (
    <div className="animated fadeIn">
      <AppBar title={title} handleTitleChange={handleTitleChange}/>
      <ToolBar/>
      <Sheet/>
      <BottomBar/>
    </div>
  );
};

export default Excel;