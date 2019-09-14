import React from "react";

import WindowMenu from "./WindowMenu";

const View = ({ activeOption, handleToggle, handleMouseEnter }) => {
  // Menu items
  let groupMenuItems = [];
  
  return <WindowMenu label="View" activeOption={activeOption} groupMenuItems={groupMenuItems} handleToggle={handleToggle} handleMouseEnter={handleMouseEnter}/>;
};

export default View;
