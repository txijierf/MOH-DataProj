import React, { useState } from "react";

import PropTypes from "prop-types";

import { AppBar, InputBase, Button, withStyles } from "@material-ui/core";

import { FileTableOutline } from "mdi-material-ui"; 

import Options from "./Options";

import "./AppBar.scss";

const styles = () => ({
  inputStyle: {
    margin: 2,
    padding: 2,
    paddingLeft: 10,
    border: "2px solid #fff0",
    borderRadius: 3,
    "&:hover": {
      border: "2px solid #E5E5E5",
    },
    "&:focus": {
      border: "2px solid #1A73E8",
    }
  }
});

const WorkBookTitle = ({ inputStyle, value, handleBlur, handleKeyDown, handleChange }) => <InputBase classes={{ input: inputStyle }} fullWidth type="text" value={value} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleChange}/>;

/**
 * The header of the workbook, which contains the title (?and related actions)
 */
const WorkBookHeader = ({ inputStyle, title, handleBlur, handleKeyDown, handleTitleChange }) => (
  <div className="w-100">
    <WorkBookTitle inputStyle={inputStyle} value={title} handleBlur={handleBlur} handleKeyDown={handleKeyDown} handleChange={handleTitleChange}/>
    <Options />
  </div>
);

const DEFAULT_TITLE = "Untitled workbook";
const ExcelAppBar = ({ excelManager, classes: { inputStyle }, handleSubmitTitle }) => {
  // Local title associated with temporary changes (workbook title changes only on blur, not on input change)
  const [ title, setTitle ] = useState(DEFAULT_TITLE);
  const handleTitleChange = (event) => setTitle(event.target.value);

  const handleKeyDown = ({ key, target }) => {
    if(key === "Enter") target.blur();
  };

  // Changes the workbook title when and only when blur occurs
  const handleBlur = () => handleSubmitTitle(title);

  return (
    <AppBar className="d-flex flex-row" position="relative" color="default">
      <FileTableOutline className="excelIcon"/>
      <WorkBookHeader inputStyle={inputStyle} title={title} handleBlur={handleBlur} handleKeyDown={handleKeyDown} handleTitleChange={handleTitleChange}/>
    </AppBar>
  );
};

ExcelAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExcelAppBar);