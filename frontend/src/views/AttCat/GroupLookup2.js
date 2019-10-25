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

import uniqid from "uniqid";

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
    <Select className="groupSelect" options={options} value={value} onChange={handleGroupOptionChange}/>
    <AddButton handleClick={handleOpenGroupDialog}/>
    <DeleteButton handleClick={handleDeleteGroup}/>
  </div>
);

const GroupValuesList = ({ GroupSelection, groupValues, handleToggle, handleOpenValueDialog, handleOpenGroupDialog }) => {
  const columns = [{ title: "Value", field: "value" }];

  const handleRowAdd = () => {};
  const handleRowUpdate = () => {};
  const handleRowDelete = () => {};

  return (
    <Paper className="groupValues">
      <MaterialTable
        title={GroupSelection}
        columns={columns}
        data={groupValues}
        editable={{ onRowAdd: handleRowAdd, onRowUpdate: handleRowUpdate, onRowDelete: handleRowDelete }}
        options={{ actionsColumnIndex: -1 }}
      />
    </Paper>
  );
};

const GroupLookup = (props) => {
  const [ groups, setGroups ] = useState([]);
  const [ groupsOptions, setGroupsOptions ] = useState([]);
  const [ currentGroupOption, setCurrentGroupOption ] = useState("");
  const [ currentGroupValues, setCurrentGroupValues ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);
  const [ isGroupDialogOpen, setIsGroupDialogOpen ] = useState(false);
  const [ isValueDialogOpen, setIsValueDialogOpen ] = useState(false);

  const manager = new AttCatManager(props); 

  useEffect(() => {
    if(!isDataFetched) {
      manager.getGrouplookup()
        .then(({ groups }) => {
          setGroups(groups);
          setCurrentGroupValues(groups.length > 0 ? groups[0].values.map((value) => ({ value })) : []);
          setCurrentGroupOption(groups.length > 0 ? { value: groups[0].title, label: groups[0].title } : []);
          setGroupsOptions(groups.map(({ title }) => ({ value: title, label: title })));
        })
        .catch((error) => console.error(error));
      setIsDataFetched(true);
    }
  });

  const handleToggle = (value) => () => {

  };

  const handleOpenGroupDialog = () => setIsGroupDialogOpen(true);
  const handleCloseGroupDialog = () => setIsGroupDialogOpen(false);
  const handleCreateGroup = (title) => {
    manager.addGrouplookupGroup(title)
      .then(() => {
        setGroupsOptions([ ...groupsOptions, { value: title, label: title } ]);
        setGroups([ ...groups, { title, values: [] } ]);
        setCurrentGroupValues([]);
        setCurrentGroupOption({ label: title, value: title });
        setIsGroupDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeleteGroup = () => {
    const groupIndex = groupsOptions.findIndex(({ title }) => title === currentGroupOption.title);

    if(groupIndex !== -1) {
      manager.deleteGroupLookupGroup(currentGroupOption.value)
        .then(() => {
          const newGroups = [ ...groups.slice(0 , groupIndex), ...groups.slice(groupIndex + 1) ];
          setGroupsOptions([ ...groupsOptions.slice(0, groupIndex), ...groupsOptions.slice(groupIndex + 1) ]);
          setGroups(newGroups === null ? [] : newGroups);
          setCurrentGroupValues(newGroups.length > 0 ? newGroups[0].values : []);
          setCurrentGroupOption(newGroups.length > 0 ? { value: newGroups[0].title, label: newGroups[0].title } : []);
        })
        .catch((error) => {
          console.error(error);
        })
    }
  };
  const handleGroupOptionChange = (option) => {
    console.log(option, groups.find(({ title }) => title === option.value))
    setCurrentGroupOption(option);
    setCurrentGroupValues(groups.find(({ title }) => title === option.value).values.map((value) => ({ value })));
  };

  const handleOpenValueDialog = () => setIsValueDialogOpen(true);
  const handleCloseValueDialog = () => setIsValueDialogOpen(false);

  const GroupSelection = <GroupMenu value={currentGroupOption} options={groupsOptions} handleOpenGroupDialog={handleOpenGroupDialog} handleGroupOptionChange={handleGroupOptionChange} handleOpenValueDialog={handleOpenValueDialog} handleDeleteGroup={handleDeleteGroup}/>;

  return (
    <Paper className="groupLookup">
      <GroupValuesList GroupSelection={GroupSelection} groupTitle={currentGroupOption.value} groupValues={currentGroupValues} handleToggle={handleToggle}/>
      <NewItemDialog open={isGroupDialogOpen} title="Create Group" label="Group Name" handleSave={handleCreateGroup} handleClose={handleCloseGroupDialog}/>
      <NewItemDialog open={isValueDialogOpen} title="Create Group Value" label="Value name" handleClose={handleCloseValueDialog}/>
    </Paper>
  )
};

export default GroupLookup;