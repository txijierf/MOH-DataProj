import React, { useState, useEffect } from "react";

import AppBar from "./components/AppBar";
import ToolBar from "./components/ToolBar";
import Sheet from "./components/Sheet";
import BottomBar from "./components/BottomBar";

import ExcelManager from "../../controller/excelManager";


const DEFAULT_TITLE = "Untitled workbook";
const Excel = ({ 
  showMessage, 
  match: { params: { packageName, organization } }, 
  params: { mode } 
}) => {
  const [ excelManager, setExcelManager ] = useState(null);
  const [ title, setTitle ] = useState(DEFAULT_TITLE)

  useEffect(() => {
    if(excelManager === null) {
      const managerInstance = new ExcelManager(showMessage);
      managerInstance
        .createWorkbookLocal()
        .then((workbook) => setExcelManager({ managerInstance, workbook }));
    }
  });

  const handleSubmitTitle = (title) => setTitle(title);
  console.log(title);
  return (
    <div className="animated fadeIn w-100 h-100">
      <AppBar excelManager={excelManager} handleSubmitTitle={handleSubmitTitle}/>
      <ToolBar excelManager={excelManager}/>
      <Sheet excelManager={excelManager}/>
      {/* <BottomBar/> */}
    </div>
  );
};

export default Excel;