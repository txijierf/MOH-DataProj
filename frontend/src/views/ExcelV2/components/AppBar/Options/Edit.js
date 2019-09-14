import React from "react";

import WindowMenu from "./WindowMenu";

const Edit = ({ activeOption, handleToggle, handleMouseEnter }) => {
  // Menu items
  let groupMenuItems = [];
  
  return <WindowMenu label="Edit" activeOption={activeOption} groupMenuItems={groupMenuItems} handleToggle={handleToggle} handleMouseEnter={handleMouseEnter}/>;
};

export default Edit;
