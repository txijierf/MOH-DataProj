import React from "react";

import WindowMenu from "./WindowMenu";

const Help = ({ activeOption, handleToggle, handleMouseEnter }) => {
  // Menu items
  let groupMenuItems = [];
  
  return <WindowMenu label="Help" activeOption={activeOption} groupMenuItems={groupMenuItems} handleToggle={handleToggle} handleMouseEnter={handleMouseEnter}/>;
};

export default Help;
