import React from "react";

import PropTypes from "prop-types";

import { AppBar, InputBase, Button, withStyles } from "@material-ui/core";

import { FileTableOutline } from "mdi-material-ui"; 

import Options from "./Options";

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
  },
  iconStyle: {
    color: "#22a463",
    height: 38,
    width: 38,
    margin: 12,
  },
  buttonStyle: {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    textTransform: "initial"
  }
});

const WorkBookTitle = ({ inputStyle, value, handleChange }) => <InputBase classes={{ input: inputStyle }} fullWidth type="text" value={value} onChange={handleChange}/>;

/**
 * General options for the workbook (File, Edit, View, Insert, etc...)
 */
// const Options = ({ buttonStyle }) => (
//   <div className="d-flex flex-row">
//     {/* <Button size="small" className={buttonStyle}>File</Button> */}
//     <File/>
//     <Button size="small" className={buttonStyle}>Edit</Button>
//     <Button size="small" className={buttonStyle}>View</Button>
//     <Button size="small" className={buttonStyle}>Help</Button>
//   </div>
// );

/**
 * The header of the workbook, which contains the title (?and related actions)
 */
const WorkBookHeader = ({ inputStyle, buttonStyle, title, handleTitleChange }) => (
  <div className="w-100">
    <WorkBookTitle inputStyle={inputStyle} value={title} handleChange={handleTitleChange}/>
    <Options />
  </div>
);

const ExcelAppBar = ({ classes: { inputStyle, iconStyle, buttonStyle }, title, handleTitleChange }) => {


  return (
    <AppBar className="d-flex flex-row" position="static" color="default">
      <FileTableOutline className={iconStyle}/>
      <WorkBookHeader inputStyle={inputStyle} buttonStyle={buttonStyle} title={title} handleTitleChange={handleTitleChange}/>
    </AppBar>
  );
};

ExcelAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExcelAppBar);