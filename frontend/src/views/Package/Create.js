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

const fetchData = async (setWorkbooks, setOrgTypes, setOriginalTypes, setUsernames, setDataFetched) => {
  try {
    const workbooksData = await getAllWorkbooksForAdmin();
    const workbooks = workbooksData.map(({ _id, name }) => [ _id, name ]);

    const organizationTypesData = await getOrganizationTypes();
    const orgTypes = organizationTypesData.map(({ _id, name }) => [ _id, name ]);

    const usernamesData = await getAllUsers();
    const usernames = usernamesData.map(({ _id, username, firstName, lastName }) => [ _id, `${firstName} ${lastName} (${username})` ]);

    setWorkbooks(workbooks);
    setOrgTypes(orgTypes);
    setOriginalTypes(organizationTypesData);
    setUsernames(usernames);
    setDataFetched(true);
  } catch(error) {
    console.log(error);
  }
};

const TimePickerContainer = ({ label, value, handleChange }) => (
  <Grid item>
    <KeyboardDateTimePicker margin="normal" label={label} value={value} variant="inline" format="yyyy/MM/dd HH:mm" onChange={handleChange}/>
  </Grid>
);

// TODO: Limit bound times later so there's no conflict
const Deadline = ({ startDate, endDate, handleStartChange, handleEndChange }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <TimePickerContainer label="Start Date" value={startDate} handleChange={handleStartChange}/>
    <TimePickerContainer label="End Date" value={endDate} handleChange={handleEndChange}/>
  </MuiPickersUtilsProvider>
);

const WorkflowField = ({ title, options, startDate, endDate, handleOptionChange, handleStartChange, handleEndChange }) => (
  <div>
    <Dropdown title={title} options={options} onChange={handleOptionChange}/>
    <Deadline startDate={startDate} endDate={endDate} handleStartChange={handleStartChange} handleEndChange={handleEndChange}/>
  </div>
);

const CreatePackage = ({ showMessage }) => {
  const { containerStyle, textFieldStyle } = useStyles();

  const [ name, setName ] = useState("");
  const [ adminNotes, setAdminNotes ] = useState("");

  const [ editStartDate, setEditStartDate ] = useState(Date.now());
  const [ reviewStartDate, setReviewStartDate ] = useState(new Date(Date.now() + 86400000 * 7));
  const [ approvalStartDate, setApprovalStartDate ] = useState(new Date(Date.now() + 86400000 * 7));
  const [ editEndDate, setEditEndDate ] = useState(new Date(Date.now() + 86400000 * 7));
  const [ reviewEndDate, setReviewEndDate ] = useState(new Date(Date.now() + 86400000 * 7));
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

  useEffect(() => {
    if(!dataFetched) fetchData(setWorkbooks, setOrgTypes, setOriginalTypes, setUsernames, setDataFetched);
  });

  const handleChangeAdminNotes = ({ target: { value } }) => setAdminNotes(value);
  const handleChangeName = ({ target: { value } }) => setName(value);
  const handleChangePublished = ({ target: { checked } }) => setPublished(checked);

  // Event change functions for the date picker contains multiple argument, which causes issues with useState's setState. Only use the first argument, which is the date value.
  const handleEditStartDate = (date) => setEditStartDate(date);
  const handleEditEndDate = (date) => setEditEndDate(date);
  const handleReviewStartDate = (date) => setReviewStartDate(date);
  const handleReviewEndDate = (date) => setReviewEndDate(date);
  const handleApprovalStartDate = (date) => setApprovalStartDate(date);
  const handleApprovalEndDate = (date) => setApprovalEndDate(date);

  const handleSave = useCallback(async () => {
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
      const data = await createPackage({ name, workbookIds, organizationTypes, editors, reviewers, approvers, orgIds, adminNotes, published, editStartDate, editEndDate, reviewStartDate, reviewEndDate, approvalStartDate, approvalEndDate });
      showMessage(data.message, 'success');
    } catch (e) {
      showMessage(e.toString() + '\nDetails: ' + e.response.data.message, 'error');
    }
  }, [ name, selectedWorkbooks, selectedOrgTypes, editors, reviewers, approvers, adminNotes, published, editStartDate, editEndDate, reviewStartDate, reviewEndDate, approvalStartDate, approvalEndDate ]);

  const publishCheckbox = <Checkbox checked={published} color="primary" onChange={handleChangePublished}/>

  return (
    <Paper className={containerStyle}>
      <TextField label="Package Name" className={textFieldStyle} value={name} onChange={handleChangeName} margin="normal" autoFocus required/>
      <TextField label="Admin Notes" value={adminNotes} onChange={handleChangeAdminNotes} multiline margin="normal" fullWidth/>
      <WorkflowField title="Editors" options={usernames} startDate={editStartDate} endDate={editEndDate} handleOptionChange={setEditors} handleStartChange={handleEditStartDate} handleEndChange={handleEditEndDate}/>
      <WorkflowField title="Reviewers" options={usernames} startDate={reviewStartDate} endDate={reviewEndDate} handleOptionChange={setReviewers} handleStartChange={handleReviewStartDate} handleEndChange={handleReviewEndDate}/>
      <WorkflowField title="Approvers" options={usernames} startDate={approvalStartDate} endDate={approvalEndDate} handleOptionChange={setApprovers} handleStartChange={handleApprovalStartDate} handleEndChange={handleApprovalEndDate}/>
      <Dropdown title="Organization Types" options={orgTypes} onChange={setSelectedOrgTypes}/>
      <Dropdown title="Workbooks" options={workbooks} onChange={setSelectedWorkbooks}/>
      <FormControlLabel style={{width: '100%'}} control={publishCheckbox} label="Publish"/>
      <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
    </Paper>
  );
}

export default CreatePackage;
