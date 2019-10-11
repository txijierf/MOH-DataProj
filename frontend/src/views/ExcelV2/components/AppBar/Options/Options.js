import React, { useState } from "react";

import File from "./File";
import Edit from "./Edit";
import View from "./View";
import Insert from "./Insert";
import Help from "./Help";

/**
 * General options for the workbook (File, Edit, View, Insert, etc...)
 */
const Options = () => {
  // Two states for toggle and mouse enter additional effects
  // Opening an option by toggle will allow hover to open options
  const [ activeOption, setActiveOption ] = useState(null);
  const [ isMouseOverEnabled, setMouseOverEnabled ] = useState(false);

  const handleMouseEnter = (option) => {
    if(option !== activeOption && isMouseOverEnabled) setActiveOption(option);
  };

  const handleToggle = (option) => {
    if(option === activeOption) {
      setActiveOption(null);
      setMouseOverEnabled(false);
    } else {
      setActiveOption(option);
      setMouseOverEnabled(true);
    }
  };

  const sharedProps = { activeOption, handleMouseEnter, handleToggle };

  return (
    <div className="d-flex flex-row">
      <File {...sharedProps}/>
      <Edit {...sharedProps}/>
      <View {...sharedProps}/>
      <Insert {...sharedProps}/>
      <Help {...sharedProps}/>
    </div>
  );
};

export default Options;