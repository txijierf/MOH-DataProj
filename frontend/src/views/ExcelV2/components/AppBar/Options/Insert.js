import React from "react";

import WindowMenu from "./WindowMenu";

const Insert = ({ activeOption, handleToggle, handleMouseEnter }) => {
  // Menu items
  let groupMenuItems = [];
  
  return <WindowMenu label="Insert" activeOption={activeOption} groupMenuItems={groupMenuItems} handleToggle={handleToggle} handleMouseEnter={handleMouseEnter}/>;
};

export default Insert;
