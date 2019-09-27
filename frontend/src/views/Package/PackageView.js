import React, { useState, useEffect } from "react";

import { buildErrorParams } from "../../controller/common";
import { adminGetPackage, userGetPackage, userSubmitPackage } from "../../controller/package";

import uniqid from "uniqid";

import { Paper, Grid, Typography, Button, TextField, Fade } from "@material-ui/core";
import PackageCard from "./components/Card";
import Loading from "../components/Loading";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  containerStyle: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  noteStyle: {
    paddingBottom: 10
  },
  adminNotesStyle: {
    whiteSpace: "pre"
  }
}));

const Package = ({ name, handleOpenFile }) => (
  <Grid item>
    <PackageCard type="excel" fileName={name} handleOpenFile={handleOpenFile}/>
  </Grid>
);

const UserContents = ({ userNotes, noteStyle, handleChangeUserNotes, handleSubmit }) => (
  <React.Fragment>
    <TextField label="User Notes" value={userNotes} className={noteStyle} onChange={handleChangeUserNotes} multiline margin="normal" fullWidth/>
    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
  </React.Fragment>
);

const AdminContents = ({ userNotes, noteStyle, handleChangeUserNotes }) => <TextField disabled label="User Notes" value={userNotes} className={noteStyle} onChange={handleChangeUserNotes} multiline margin="normal" fullWidth />;

const PackageView = ({ showMessage, params, match, history }) => {
  const admin = params.mode === "admin";
  const packageName = match.params.name;
  const organization = match.params.organization;
  const { containerStyle, noteStyle, adminNotesStyle } = useStyles();

  const [ data, setData ] = useState(null);
  const [ userNotes, setUserNotes ] = useState("");
  const [ dataFetched, setDataFetched ] = useState(false);

  useEffect(() => {
    (admin ? adminGetPackage : userGetPackage)(packageName, organization)
      .then((data) => {
        setDataFetched(true);

        if(data !== {} && typeof data !== "undefined") {
          setData(data);
          setUserNotes(data.userNotes);
        }
      })
      .catch((error) => showMessage(...buildErrorParams(error)))

  }, [ packageName, organization, admin, showMessage ]);
  
  const AllWorkbooks = () => {
    if(dataFetched) {
      if(data !== null && data !== {} && typeof data !== "undefined") {
        return data.workbooks.map(({ name }) => {
          const handleOpenFile = () => {
            if (admin) {
              history.push(`/admin/packages/view/${packageName}/org/${organization}/workbook/${name}`);
            } else {
              history.push(`/packages/${packageName}/${organization}/workbook/${name}`);
            }
          };
  
          return <Package key={uniqid()} name={name} handleOpenFile={handleOpenFile} />
        });
      } else {
        return <p>No Submission</p>
      }
    }

    return <Loading message="Loading Package..."/>;
  };

  const handleChangeUserNotes = ({ target: { value } }) => setUserNotes(value);

  const handleSubmit = async () => {
    try {
      const { message } = await userSubmitPackage(packageName, organization, {userNotes: userNotes});
      showMessage(message, "success");
    } catch (e) {
      showMessage(...buildErrorParams(e));
    }
  };

  return (
    <Fade in>
      <Paper className={containerStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>{packageName}</Typography>
            <Typography variant="subtitle1" gutterBottom className={adminNotesStyle}>{data ? ("Note: " + data.adminNotes) : ""}</Typography>
          </Grid>
          <AllWorkbooks/>
        </Grid>
        <br/>
        {
          admin 
            ? <AdminContents userNotes={userNotes} noteStyle={noteStyle} handleChangeUserNotes={handleChangeUserNotes}/> 
            : <UserContents userNotes={userNotes} noteStyle={noteStyle} handleChangeUserNotes={handleChangeUserNotes} handleSubmit={handleSubmit}/>
        }
      </Paper>
    </Fade>
  );
};

export default PackageView;