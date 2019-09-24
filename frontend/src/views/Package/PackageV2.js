import React, { useState, useEffect, useState, useMemo } from 'react';

import { adminGetPackages, userGetPackages, adminDeletePackage } from "../../controller/package";
import { getCurrentUserOrganizations } from '../../controller/userManager';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fade, Select, MenuItem } from '@material-ui/core';
import PackageCard from './components/Card';
import Loading from "../components/Loading";
import PackagePicker from "./components/Picker";

import uniqid from "uniqid";

const useStyles = makeStyles(() = ({
    container: {
      padding: theme.spacing(2),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  })
);

const Package = ({ key, fileName, deleteCb, onOpen, openParams }) => (
  <Grid key={key} item>
    <PackageCard type="package" fileName={fileName} deleteCb={deleteCb} onOpen={onOpen} openParams={openParams}/>
  </Grid>
);

const DialogConfirmationMessage = () => (
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete <strong>{values.selectedName}</strong>? 
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

const Dialog = ({ open, handleCloseDialog, handleConfirmDelete }) => (
  <Dialog open={open} keepMounted onClose={handleCloseDialog} >
    <DialogTitle>Confirm delete?</DialogTitle>
    <DialogConfirmationMessage/>
    <DialogButtons handleConfirmDelete={handleConfirmDelete} handleCloseDialog={handleCloseDialog}/>
  </Dialog>
);

const CreatePackage = ({ showMessage, history, params }) => {
  const isAdmin = params.mode === "Admin";

  const classes = useStyles();

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

  
  const onOpen = (name, package) => (
    (event) => {
      isAdmin
        ? openPicker(package, event.target)
        : props.history.push('/packages/' + name + '/' + values.selectedUserOrg);
    }
  );
  
  const closeDialog = () => {
    if(openDialog) setOpenDialog(false);
  };
  
  const openDialog = (name) => {
    if(!openDialog) setOpenDialog(true);
    if(selectedName !== name) setSelectedName(name);
  };

  const openPicker = (pickedPackage, anchorEl) => {
    const organizations = pickedPackage.organizations.map(({ name }) => name);

    if(!organizaitons.length) {
      console.log("No organizations");
    } else if(organizations.length === 1) {
      props.history.push('/admin/packages/view/' + pickedPackage.name + '/org/' + organizations[0]);
    } else {
      setPicker(anchorEl);
      setOrganizations(organizations);
      setPickedPackage(pickedPackage);
    }
  };

  const handleConfirmDelete = () => {
    if(isAdmin) {
      adminDeletePackage(selectedName)
      .then(({ message }) => {
          closeDialog();
          setPackages(packages.filter(({ name }) => selectedName !== name))
        })
        .catch((error) => showMessage(`${error.toString()} \nDetails: ${error.response.data.message} error`));
    }
  };

  const handlePickedPackage = (organization) => props.history.push('/admin/packages/view/' + pickedPackage.name + '/org/' + organization);
  
  //Why not use memo here too?
  const AllPackages = packages.map((package) => <Package key={uniqid()} deleteCb={isAdmin ? openDialog: udnefined} fileName={package.name} onOpen={onOpen} openParams={[package]}/>);

  const Menu = useMemo(() => 
    userOrganizations.map((organization) => <MenuItem key={organization} value={organization}>{organization}</MenuItem>
  ), userOrganizations);

  
};

export default CreatePackage;