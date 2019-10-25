import React, { useState, useEffect } from "react";

import Select from "react-select";

import MaterialTable from "material-table";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import Paper from "@material-ui/core/Paper";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";

import AttCatManager from "../../controller/attCatManager";

import OrganizationTable from "../System/Organizations";
import FacilityTable from "./Facility";
import PeriodTable from "./Period";
import YearTable from "./Year";
import FormTable from "./Form";

import "./GroupLookup.scss";

const NewItemDialog = ({ open, title, label, handleSave, handleClose }) => {
  const [ itemValue, setItemValue ] = useState("");

  const handleSaveItem = () => handleSave(itemValue);

  const handleInputChange = ({ target: { value } }) => setItemValue(value);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label={label} type="text" value={itemValue} onChange={handleInputChange} fullWidth/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveItem} type="submit" color="primary">Add</Button>
        <Button onClick={handleClose} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddButton = ({ handleClick }) => (
  <Fab color="primary" variant="extended" size="small" arial-label="add" onClick={handleClick}>
    <AddIcon/>
  </Fab>
);

const DeleteButton = ({ handleClick }) => (
  <Fab color="secondary" variant="extended" size="small" arial-label="delete" onClick={handleClick}>
    <DeleteIcon/>
  </Fab>
);

const GroupMenu = ({ value, options, handleGroupOptionChange, handleOpenGroupDialog, handleDeleteGroup }) => (
  <div className="groupMenu">
    <Select className="groupSelect" placeholder="Select Group..." options={options} value={value} onChange={handleGroupOptionChange}/>
  </div>
);

const GroupLookup = (props) => {
  const [ groupsOptions, setGroupsOptions ] = useState([]);
  const [ currentGroupOption, setCurrentGroupOption ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);

  const manager = new AttCatManager(props); 

  useEffect(() => {
    if(!isDataFetched) {
      manager.getGrouplookup()
        .then(({ groups }) => {
          setGroupsOptions(groups.map((group) => ({ label: group, value: group })));
        })
        .catch((error) => console.error(error));
      setIsDataFetched(true);
    }
  });

  const handleGroupOptionChange = (option) => setCurrentGroupOption(option);

  let GroupTable = null;
  const currentOption = currentGroupOption.value;
  if(currentOption === "Organizations"){
    GroupTable = <OrganizationTable {...props}/>;
  } else if(currentOption === "Facilities") {
    GroupTable = <FacilityTable/>;
  } else if(currentOption === "Years") {
    GroupTable = <YearTable/>;
  } else if(currentOption === "Periods") {
    GroupTable = <PeriodTable/>;
  } else {
    GroupTable = <FormTable/>;
  }

  return (
    <Paper className="groupLookup">
      <GroupMenu value={currentGroupOption} options={groupsOptions} handleGroupOptionChange={handleGroupOptionChange}/>
      {/* <GroupValuesList groupTitle={currentGroupOption.value} groupValues={currentGroupValues} columns={currentGroupSchema}/> */}
      {GroupTable}
    </Paper>
  )
};

export default GroupLookup;
