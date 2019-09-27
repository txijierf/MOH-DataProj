import React from "react";

import uniqid from "uniqid";

import { Button, Card, CardActionArea, CardActions, CardContent, Grid, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { FileTableOutline, FileOutline, FolderOpen } from "mdi-material-ui";
import { Badge } from "reactstrap";

const useStyles = makeStyles(() => ({
  cardStyle: {
    width: 208,
    height: 210
  },
   cardContentStyle: {
    height: 145,
    padding: "16px 16px 0 16px"
  },
  cardActionsStyle: {
    // padding: "0 4px"
  },
  cardBadgesStyle: {
    padding: "4px 16px 0 16px",
    display: "flex"
  },
  cardBadgeStyle: {
    margin: "0 4px 0 4px"
  },
  excelIconStyle: {
    color: "#22a463",
    height: 80,
    width: 80
  },
  packageIconStyle: {
    color: "#939393",
    height: 80,
    width: 80
  }
}));

const FileCardIconFactory = ({ type, excelIconStyle, packageIconStyle }) => {
  let Icon;

  if(type === "excel") {
    Icon = <FileTableOutline className={excelIconStyle}/>;
  } else if(type === "package") {
    Icon = <FolderOpen className={packageIconStyle}/>;
  } else {
    Icon = <FileOutline className={packageIconStyle}/>;
  }

  return Icon;
};

const FileCardText = ({ fileName }) => (
  <Grid item xs={12}>
    <Typography variant="subtitle1" noWrap style={{color: "rgba(0,0,0,0.87)"}}>{fileName}</Typography>
  </Grid>
);

const FileCardIcon = ({ type, excelIconStyle, packageIconStyle }) => (
  <Grid item xs={12} style={{textAlign: "center"}}>
    <FileCardIconFactory type={type} excelIconStyle={excelIconStyle} packageIconStyle={packageIconStyle}/>
  </Grid>
);

const FileCardContent = ({ cardContentStyle, excelIconStyle, packageIconStyle, type, fileName, handleOpenPackage }) => (
  <Tooltip title={fileName} placement="bottom" enterDelay={300}>
    <CardActionArea onClick={handleOpenPackage}>
      <CardContent className={cardContentStyle}>
        <Grid container alignItems="center" justify="center" spacing={2}>
          <FileCardIcon type={type} excelIconStyle={excelIconStyle} packageIconStyle={packageIconStyle}/>
          <FileCardText fileName={fileName}/>  
        </Grid>
      </CardContent>
    </CardActionArea>
  </Tooltip>
);

const FileCardActions = ({ cardActionsStyle, handleOpenPackage, handleOpenDeleteDialog }) => (
  <CardActions className={cardActionsStyle} disableSpacing>
    <Button size="small" color="primary" onClick={handleOpenPackage}>Open</Button>
    <Button size="small" color="primary">Edit</Button>
    {handleOpenDeleteDialog && <Button size="small" color="primary" onClick={handleOpenDeleteDialog}>Delete</Button>}
  </CardActions>
);

const FileCardBadges = ({ cardBadgeStyle, cardBadgesStyle, badges }) => {
  const Badges = () => badges.map(({ color, text }) => <Badge key={uniqid()} className={cardBadgeStyle} color={color}>{text}</Badge>);
  return (
    <Grid item xs={12} className={cardBadgesStyle}>
      <Badges/>
    </Grid>
  );
};

const FileCard = ({ fileName, badges, handleOpenDeleteDialog, type, handleOpenPackage }) => {
  const { cardStyle, cardContentStyle, cardActionsStyle, cardBadgeStyle, cardBadgesStyle, excelIconStyle, packageIconStyle } = useStyles();

  return (
    <Card className={cardStyle} elevation={2}>
      <FileCardContent cardContentStyle={cardContentStyle} excelIconStyle={excelIconStyle} packageIconStyle={packageIconStyle} type={type} fileName={fileName} handleOpenPackage={handleOpenPackage}/>
      {type === "package" && <FileCardBadges cardBadgeStyle={cardBadgeStyle} cardBadgesStyle={cardBadgesStyle} badges={badges}/>}
      <FileCardActions cardActionsStyle={cardActionsStyle} handleOpenPackage={handleOpenPackage} handleOpenDeleteDialog={handleOpenDeleteDialog}/>
    </Card>
  );
};

export default FileCard;
