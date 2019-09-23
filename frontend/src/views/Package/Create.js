import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {TextField, Paper, Grid, Button, FormControlLabel, Checkbox} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Dropdown from "./components/Dropdown";
import {getAllWorkbooksForAdmin} from "../../controller/workbookManager";
import {createPackage} from "../../controller/package"
import {getOrganizationTypes} from "../../controller/system"

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  textField: {
    width: 400,
  },

}));

const fetchData = async (values, setValue) => {
  try {
    const workbooksData = await getAllWorkbooksForAdmin();
    const workbooks = workbooksData.map(({ _id, name }) => ([ _id, name ]));

    const organizationTypesData = await getOrganizationTypes();
    const orgTypes = organizationTypesData.map(({ _id, name }) => ([ _id, name ]));

    setValue({ ...values, workbooks, orgTypes, originalTypes: orgTypes, dataFetched: true });
  } catch(error) {
    console.log(error);
  }
};

export default function CreatePackage(props) {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    adminNotes: '',
    startDate: Date.now(),
    endDate: new Date(Date.now() + 86400000 * 7),  // one week later
    workbooks: null,
    orgTypes: null,
    originalTypes: null,
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
        startDate: values.startDate,
        endDate: values.endDate,
        workbookIds: values.selectedWorkbooks,
        organizationTypes: values.selectedOrgTypes,
        orgIds: [...orgIds],
        adminNotes: values.adminNotes,
        published: values.published,
      });
      props.showMessage(data.message, 'success')
    } catch (e) {
      props.showMessage(e.toString() + '\nDetails: ' + e.response.data.message, 'error')
    }

  }, [values, props]);

  const renderDates = useMemo(() => (<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Grid container justify={"flex-start"} spacing={4}>
      <Grid item>
        <KeyboardDateTimePicker
          margin="normal"
          label="Start Date"
          value={values.startDate}
          variant="inline"
          format="yyyy/MM/dd HH:mm"
          onChange={handleChangeDate('startDate')}
        />
      </Grid>
      <Grid item>
        <KeyboardDateTimePicker
          margin="normal"
          label="End Date"
          value={values.endDate}
          variant="inline"
          format="yyyy/MM/dd HH:mm"
          onChange={handleChangeDate('endDate')}
        />
      </Grid>
    </Grid>
  </MuiPickersUtilsProvider>), [handleChangeDate, values.startDate, values.endDate]);

  const renderDropdown = useMemo(() => (
    <>
      <Dropdown title="Reviewers" options={values.reviewers} onChange={(data) => handleChange("reviewers", data)}/>
      <Dropdown title="Approvers" options={values.approvers} onChange={(data) => handleChange("approvers", data)}/>
      <Dropdown title="Organization Types" options={values.orgTypes} onChange={data => handleChange('selectedOrgTypes', data)}/>
      <Dropdown title="Workbooks" options={values.workbooks} onChange={data => handleChange('selectedWorkbooks', data)}/>
    </>
  ), [values.orgTypes, values.workbooks, handleChange]);

  return (
    <Paper className={classes.container}>
      <TextField
        label="Package Name"
        className={classes.textField}
        value={values.name}
        onChange={handleChangeEvent('name')}
        margin="normal"
        autoFocus
        required
      />
      <TextField
        label="Admin Notes"
        value={values.adminNotes}
        onChange={handleChangeEvent('adminNotes')}
        multiline
        margin="normal"
        fullWidth
      />
      {renderDates}
      {renderDropdown}
      <FormControlLabel style={{width: '100%'}}
                        control={
                          <Checkbox checked={values.published} color="primary"
                                    onChange={e => handleChange('published', e.target.checked)}/>
                        }
                        label="Publish"
      />
      <Button onClick={handleSave} color="primary" variant="contained">
        Save
      </Button>
    </Paper>
  );
}
