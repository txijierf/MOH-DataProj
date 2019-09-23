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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  textField: {
    width: 400
  }
}));

const fetchData = async (values, setValue) => {
  try {
    const workbooksData = await getAllWorkbooksForAdmin();
    const workbooks = workbooksData.map(({ _id, name }) => [ _id, name ]);

    const organizationTypesData = await getOrganizationTypes();
    const orgTypes = organizationTypesData.map(({ _id, name }) => [ _id, name ]);

    const usernamesData = await getAllUsers();
    const usernames = usernamesData.map(({ _id, username, firstName, lastName }) => [ _id, `${firstName} ${lastName} (${username})` ]);

    setValue({ ...values, workbooks, orgTypes, originalTypes: orgTypes, usernames, dataFetched: true });
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

const CreatePackage = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    adminNotes: '',
    editStartDate: Date.now(),
    //One week later
    editEndDate: new Date(Date.now() + 86400000 * 7),
    reviewStartDate: new Date(Date.now() + 86400000 * 7),
    reviewEndDate: new Date(Date.now() + 86400000 * 7),
    approvalStartDate: new Date(Date.now() + 86400000 * 7),
    approvalEndDate: new Date(Date.now() + 86400000 * 7),
    workbooks: null,
    orgTypes: null,
    originalTypes: null,
    usernames: null,
    editors: [],
    reviewers: [],
    approvers: [],
    selectedWorkbooks: [],
    selectedOrgTypes: [],
    published: false,
    dataFetched: false
  });

  useEffect(() => {
    if(!values.dataFetched) fetchData(values, setValues);
  });

  const handleChange = useCallback((name, value) => {
    setValues(values => ({...values, [name]: value}));
  }, []);

  const handleChangeEvent = name => e => handleChange(name, e.target.value);

  const handleChangeDate = useCallback(name => date => {
    setValues(values => ({...values, [name]: date}));
  }, []);

  const handleSave = useCallback(async () => {
    const orgIds = new Set();
    for (const selectedTypeId of values.selectedOrgTypes) {
      for (const type of values.originalTypes) {
        if (type._id === selectedTypeId) {
          for (const org of type.organizations) {
            orgIds.add(org._id);
          }
        }
      }
    }
    try {
      const data = await createPackage({
        name: values.name,
        workbookIds: values.selectedWorkbooks,
        organizationTypes: values.selectedOrgTypes,
        editors: values.editors,
        reviewers: values.reviewers,
        approvers: values.approvers,
        orgIds: [...orgIds],
        adminNotes: values.adminNotes,
        published: values.published,
        editStartDate: values.editStartDate,
        editEndDate: values.editEndDate,
        reviewStartDate: values.reviewStartDate,
        reviewEndDate: values.reviewEndDate,
        approvalStartDate: values.approvalStartDate,
        approvalEndDate: values.approvalEndDate

      });
      props.showMessage(data.message, 'success')
    } catch (e) {
      props.showMessage(e.toString() + '\nDetails: ' + e.response.data.message, 'error')
    }
  }, [values, props]);

  const publishCheckbox = <Checkbox checked={values.published} color="primary" onChange={e => handleChange('published', e.target.checked)}/>

  return (
    <Paper className={classes.container}>
      <TextField label="Package Name" className={classes.textField} value={values.name} onChange={handleChangeEvent('name')} margin="normal" autoFocus required/>
      <TextField label="Admin Notes" value={values.adminNotes} onChange={handleChangeEvent('adminNotes')} multiline margin="normal" fullWidth/>
      <WorkflowField title="Editors" options={values.usernames} startDate={values.editStartDate} endDate={values.editEndDate} handleOptionChange={(option) => handleChange("editors", option)} handleStartChange={(date) => handleChangeDate("editStartDate", date)} handleEndChange={(date) => handleChange("editEndDate", date)}/>
      <WorkflowField title="Reviewers" options={values.usernames} startDate={values.reviewStartDate} endDate={values.reviewEndDate} handleOptionChange={(option) => handleChange("reviewers", option)} handleStartChange={(date) => handleChange("reviewStartDate", date)} handleEndChange={(date) => handleChange("reviewEndDate", date)}/>
      <WorkflowField title="Approvers" options={values.usernames} startDate={values.approvalStartDate} endDate={values.approvalEndDate} handleOptionChange={(option) => handleChange("approval", option)} handleStartChange={(date) => handleChange("approvalStartDate", date)} handleEndChange={(date) => handleChange("approvalEndDate", date)}/>
      <Dropdown title="Organization Types" options={values.orgTypes} onChange={data => handleChange('selectedOrgTypes', data)}/>
      <Dropdown title="Workbooks" options={values.workbooks} onChange={data => handleChange('selectedWorkbooks', data)}/>
      <FormControlLabel style={{width: '100%'}} control={publishCheckbox} label="Publish"/>
      <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
    </Paper>
  );
}

export default CreatePackage;
