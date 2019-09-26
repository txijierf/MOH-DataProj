

import React, { useState, useEffect, useMemo } from 'react';

import { adminGetPackages, userGetPackages, adminDeletePackage } from "../../controller/package";
import { getCurrentUserOrganizations } from '../../controller/userManager';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fade, Select, MenuItem } from '@material-ui/core';
import PackageCard from './components/Card';
import Loading from "../components/Loading";
import PackagePicker from "./components/Picker";

// import { Badge } from "reactstrap";

import uniqid from "uniqid";

const useStyles = makeStyles((theme) => ({
  containerStyle: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

/**
 * Precondition: approval status is not rejected or approved.
 * Determines the phase of the workflow based on the start and end Date of each phase.
 */
const computeWorkingPhase = (editStartDate, editEndDate, reviewStartDate, reviewEndDate, approvalStartDate, approvalEndDate) => {
  const currentDate = Date.now();
  let phase;

  if(currentDate < editStartDate) {
    phase = "Pre-edit";
  } else if(currentDate < editEndDate) {
    phase = "Edit";
  } else if(currentDate < reviewStartDate) {
    phase = "Pre-review";
  } else if(currentDate < reviewEndDate) {
    phase = "Review";
  } else if(currentDate < approvalStartDate) {
    phase = "Pre-approval";
  } else if(currentDate < approvalEndDate) {
    phase = "Approval";
  } else {
    phase = "Post-approval";
  };

  return phase;
};

// const Phase = ({ color, phase }) => <Badge color={color}>{phase}</Badge>;

const Package = ({ fileName, published, approveStatus, editStartDate, editEndDate, reviewStartDate, reviewEndDate, approvalStartDate, approvalEndDate, handleOpenDeleteDialog, handleOpenPackage }) => {
  let phase = null;

  if(published) {
    approveStatus !== "Approved" || approveStatus !== "Rejected" 
      ? phase = computeWorkingPhase(new Date(editStartDate), new Date(editEndDate), new Date(reviewStartDate), new Date(reviewEndDate), new Date(approvalStartDate), new Date(approvalEndDate))
      : phase = "Completed";
  };

  return (
    <Grid key={uniqid()} item>
      <PackageCard type="package" phase={phase} published={published} fileName={fileName} handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenPackage={handleOpenPackage}/>
    </Grid>
  );
};

const DialogConfirmationMessage = ({ selectedName }) => (
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete <strong>{selectedName}</strong>? 
      <br/>
      This process cannot be undone.
    </DialogContentText>
  </DialogContent>
);

const DialogButtons = ({ handleCloseDialog, handleConfirmDelete }) => (
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
    <Button onClick={handleConfirmDelete} color="primary">Delete</Button>
  </DialogActions>
);

const DialogWindow = ({ open, selectedName, handleCloseDialog, handleConfirmDelete }) => (
  <Dialog open={open} keepMounted onClose={handleCloseDialog} >
    <DialogTitle>Confirm delete?</DialogTitle>
    <DialogConfirmationMessage selectedName={selectedName}/>
    <DialogButtons handleConfirmDelete={handleConfirmDelete} handleCloseDialog={handleCloseDialog}/>
  </Dialog>
);


const UserSelectedOrg = ({ selectedUserOrg, userOrganizations, handleChange }) => {
  if(selectedUserOrg === "") {
    return <Loading message="Loading your organizations..."/>;  
  } else if(userOrganizations.length === 0) {
    return <p>You don't belong to any organizations</p>;
  } else {
    const Menu = useMemo(() => (
      userOrganizations.map((organization) => <MenuItem key={uniqid()} value={organization}>{organization}</MenuItem>
    )), [ userOrganizations ]);
  
    const inputProps = { name: "Organizations" };
    return <Select value={selectedUserOrg} onChange={handleChange} inputProps={inputProps}>{Menu}</Select>
  }
};

const CreatePackage = ({ showMessage, history, params }) => {
  const isAdmin = params.mode === "admin";

  const { containerStyle } = useStyles();

  const [ packages, setPackages ] = useState([]);
  const [ openDialog, setOpenDialog ] = useState(false);
  const [ picker, setPicker ] = useState(null);
  const [ selectedName, setSelectedName ] = useState(null);
  const [ organizations, setOrganizations ] = useState([]);
  const [ pickedPackage, setPickedPackage ] = useState(null);
  const [ userOrganizations, setUserOrganizations ] = useState([]);
  const [ selectedUserOrg, setSelectedUserOrg ] = useState("");

  const fetchAndPopulateAdminValues = () => adminGetPackages().then((adminPackages) => setPackages(adminPackages));

  const fetchAndPopulateUserValues = async () => {
    const userOrganizations = await getCurrentUserOrganizations();
    const selectedUserOrg = userOrganizations[0];
    const userPackages = await userGetPackages(selectedUserOrg);

    setUserOrganizations(userOrganizations);
    setSelectedUserOrg(selectedUserOrg);
    setPackages(userPackages);
  };

  useEffect(() => {
    isAdmin
      ? fetchAndPopulateAdminValues()
      : fetchAndPopulateUserValues();
  }, [ isAdmin ]);
  
  const handleOpenPicker = (pickedPackage, anchorEl) => {
    const organizations = pickedPackage.organizations.map(({ name }) => name);
    if(!organizations.length) {
      console.log("No organizations");
    } else if(organizations.length === 1) {
      history.push('/admin/packages/view/' + pickedPackage.name + '/org/' + organizations[0]);
    } else {
      setPicker(anchorEl);
      setOrganizations(organizations);
      setPickedPackage(pickedPackage);
    }
  };

  const handleClosePicker = () => {
    if(picker !== null) setPicker(null);
  };
  
  
  const handleOpen = (name, pickedPackage, target) => (
      isAdmin
        ? handleOpenPicker(pickedPackage, target)
        : history.push('/packages/' + name + '/' + selectedUserOrg)
  );

  const handleCloseDialog = () => {
    if(openDialog) setOpenDialog(false);
  };
  


  const handleConfirmDelete = () => {
    if(isAdmin) {
      adminDeletePackage(selectedName)
      .then(({ message }) => {
          handleCloseDialog();
          setPackages(packages.filter(({ name }) => selectedName !== name));
          showMessage(message, "success");
        })
        .catch((error) => showMessage(`${error.toString()} \nDetails: ${error.response.data.message} error`));
    }
  };

  const handlePickedPackage = (organization) => history.push('/admin/packages/view/' + pickedPackage.name + '/org/' + organization);
  
  const handleChangeUserOrg = ({ target: { value } }) => {
    userGetPackages(value)
      .then((packages) => {
        setSelectedUserOrg(value);
        setPackages(packages);
      });
  };
        
  const AllPackages = useMemo(() => (
    packages.map((_package) => {
      const { published, approveStatus, editStartDate, editEndDate, reviewStartDate, reviewEndDate, approvalStartDate: approvalStartDate, approvalEndDate, name } = _package;

      const handleOpenPackage = ({ target }) => handleOpen(name, _package, target);
      const handleOpenDeleteDialog = () => {
        if(!openDialog) setOpenDialog(true);
        if(selectedName !== name) setSelectedName(name);
      };
    
      return (
        <Package 
          key={uniqid()}
          published={published} 
          approveStatus={approveStatus}
          editStartDate={editStartDate}
          editEndDate={editEndDate}
          reviewStartDate={reviewStartDate}
          reviewEndDate={reviewEndDate}
          approvalStartDate={approvalStartDate} 
          approvalEndDate={approvalEndDate}
          approveStatus={approveStatus} 
          handleOpenDeleteDialog={isAdmin && handleOpenDeleteDialog} 
          fileName={name}  
          handleOpenPackage={handleOpenPackage}
        />
      );
    }
  )), [ packages ]);  

  return (
    <Fade in>
      <Paper className={containerStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>All Packages</Typography>
            {!isAdmin && <UserSelectedOrg selectedUserOrg={selectedUserOrg} userOrganizations={userOrganizations} handleChange={handleChangeUserOrg}/>}
          </Grid>
          {AllPackages}
        </Grid>
        <DialogWindow open={openDialog} selectedName={selectedName} handleCloseDialog={handleCloseDialog} handleConfirmDelete={handleConfirmDelete}/>
        <PackagePicker title="Pick an organization" anchorEl={picker} onClose={handleClosePicker} onSelect={handlePickedPackage} options={organizations}/>
      </Paper>
    </Fade>
  );
};

export default CreatePackage;