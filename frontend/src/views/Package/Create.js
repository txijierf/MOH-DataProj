import React, { useState, useCallback, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns';

import { TextField, Paper, Grid, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';

import { createPackage } from "../../controller/package"
import { getAllWorkbooksForAdmin } from "../../controller/workbookManager";
import { getAllUsers } from "../../controller/userManager";
import { getOrganizationTypes } from "../../controller/system"

import Dropdown from "./components/Dropdown";

const useStyles = makeStyles(theme => ({
  containerStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  textFieldStyle: {
    width: 400
  }
}));



const TimePickerContainer = ({ label, value, handleChange }) => (
  <Grid item>
    <KeyboardDateTimePicker margin="normal" label={label} value={value} variant="inline" format="yyyy/MM/dd HH:mm" onChange={handleChange}/>
  </Grid>
);

const CreatePackage = ({ showMessage }) => {
  const { containerStyle, textFieldStyle } = useStyles();

  const [ name, setName ] = useState("");
  const [ adminNotes, setAdminNotes ] = useState("");

  const [ editStartDate, setEditStartDate ] = useState(Date.now());
  const [ editEndDate, setEditEndDate ] = useState(new Date(Date.now() + 86400000 * 7));
  const [ approvalEndDate, setApprovalEndDate ] = useState(new Date(Date.now() + 86400000 * 7));

  const [ workbooks, setWorkbooks ] = useState(null);
  const [ orgTypes, setOrgTypes ] = useState(null);
  const [ originalTypes, setOriginalTypes ] = useState(null);
  
  const [ usernames, setUsernames ] = useState(null);
  
  const [ editors, setEditors ] = useState([]);
  const [ reviewers, setReviewers ] = useState([]);
  const [ approvers, setApprovers ] = useState([]);

  const [ selectedWorkbooks, setSelectedWorkbooks ] = useState([]);
  const [ selectedOrgTypes, setSelectedOrgTypes ] = useState([]);

  const [ published, setPublished ] = useState(false);
  const [ dataFetched, setDataFetched ] = useState(false);
  
  // Unmounted set state buffer
  let isSubscribed = true;

  const fetchData = async () => {
    try {
      const workbooksData = await getAllWorkbooksForAdmin();
      
      const organizationTypesData = await getOrganizationTypes();
      
      const usernamesData = await getAllUsers();
      
      const usernames = usernamesData.map(({ _id, username, firstName, lastName }) => [ _id, `${firstName} ${lastName} (${username})` ]);
      const workbooks = workbooksData.map(({ _id, name }) => [ _id, name ]);
      const orgTypes = organizationTypesData.map(({ _id, name }) => [ _id, name ]);
      
      if(isSubscribed) {
        setWorkbooks(workbooks);
        setOrgTypes(orgTypes);
        setOriginalTypes(organizationTypesData);
        setUsernames(usernames);
        setDataFetched(true);
      }
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(isSubscribed && !dataFetched) fetchData(setWorkbooks, setOrgTypes, setOriginalTypes, setUsernames, setDataFetched);
    return () => isSubscribed = false;
  });

  const handleChangeAdminNotes = ({ target: { value } }) => setAdminNotes(value);
  const handleChangeName = ({ target: { value } }) => setName(value);
  const handleChangePublished = ({ target: { checked } }) => setPublished(checked);

  // Event change functions for the date picker contains multiple argument, which causes issues with useState's setState. Only use the first argument, which is the date value.
  const handleEditStartDate = (date) => setEditStartDate(date);
  const handleEditEndDate = (date) => setEditEndDate(date);
  const handleApprovalEndDate = (date) => setApprovalEndDate(date);

  const handleSave = useCallback(async () => {
    if(editEndDate < editStartDate || approvalEndDate < editEndDate) {
      showMessage("Approval deadline must be after edit deadline. Edit deadline must be after edit and approval start date.", "error");
      return;
    }

    let orgIds = new Set();
    for (const selectedTypeId of selectedOrgTypes) {
      for (const type of originalTypes) {
        if (type._id === selectedTypeId) {
          for (const org of type.organizations) {
            orgIds.add(org._id);
          }
        }
      }
    }
    orgIds = [ ...orgIds ]
    const workbookIds = selectedWorkbooks;
    const organizationTypes = selectedOrgTypes;

    try {
      const data = await createPackage({ name, workbookIds, organizationTypes, editors, reviewers, approvers, orgIds, adminNotes, published, editStartDate, editEndDate, approvalEndDate });
      showMessage(data.message, 'success');
    } catch (e) {
      showMessage(e.toString() + '\nDetails: ' + e.response.data.message, 'error');
    }
  }, [ name, selectedWorkbooks, selectedOrgTypes, editors, reviewers, approvers, adminNotes, published, editStartDate, editEndDate, approvalEndDate ]);

  const publishCheckbox = <Checkbox checked={published} color="primary" onChange={handleChangePublished}/>

  return (
    <Paper className={containerStyle}>
      <TextField label="Package Name" className={textFieldStyle} value={name} onChange={handleChangeName} margin="normal" autoFocus required/>
      <TextField label="Admin Notes" value={adminNotes} onChange={handleChangeAdminNotes} multiline margin="normal" fullWidth/>

      <Dropdown title="Editors" options={usernames} onChange={setEditors}/>
      <Dropdown title="Reviewers" options={usernames} onChange={setReviewers}/>
      <Dropdown title="Approvers" options={usernames} onChange={setApprovers}/>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <TimePickerContainer label="Edit and Approval Start Date" value={editStartDate} handleChange={handleEditStartDate}/>
        <TimePickerContainer label="Edit Deadline" value={editEndDate} handleChange={handleEditEndDate}/>
        <TimePickerContainer label="Approval Deadline" value={approvalEndDate} handleChange={handleApprovalEndDate}/>
      </MuiPickersUtilsProvider>
      
      <Dropdown title="Organization Types" options={orgTypes} onChange={setSelectedOrgTypes}/>
      <Dropdown title="Workbooks" options={workbooks} onChange={setSelectedWorkbooks}/>
      
      <Dropdown title="Year" options={[]} onChange={()=>{}}/>
      <Dropdown title="Period" options={[]} onChange={()=>{}}/>

      {/* ? Is organization needed? Organization types is already present... */}
      <FormControlLabel style={{width: '100%'}} control={publishCheckbox} label="Publish"/>
      <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
    </Paper>
  );
}

export default CreatePackage;
