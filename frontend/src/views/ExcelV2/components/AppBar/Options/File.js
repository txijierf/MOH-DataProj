import React from "react";

import WindowMenu from "./WindowMenu";

const File = ({ activeOption, handleToggle, handleMouseEnter }) => {
  // Menu items
  let groupMenuItems = [[{ label: "New", command: "Ctrl+N" }]];
  
  return <WindowMenu label="File" activeOption={activeOption} groupMenuItems={groupMenuItems} handleToggle={handleToggle} handleMouseEnter={handleMouseEnter}/>;
};

export default File;
