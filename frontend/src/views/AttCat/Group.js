import React, { Component, useState } from 'react';
import AttCatManager from "../../controller/attCatManager";
import {
  Grid,
  Button,
  AppBar,
  Paper,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/es";
import PropTypes from "prop-types";
import SortableTree, {toggleExpandedForAll, changeNodeAtPath, addNodeUnderParent, removeNodeAtPath} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import {UnfoldLess, UnfoldMore, Add, Search, Storage, NavigateBefore, NavigateNext, Delete, Edit, Save, Cancel} from "@material-ui/icons";
import {ToolBarDivider} from "../Excel/components/ExcelToolBarUser";
import Loading from '../components/Loading';

const styles = theme => ({
  button: {
    minWidth: 40,
  },
  leftIcon: {
    paddingRight: 5,
  },
  tree: {
    height: 'calc(100vh - 170px)',
    paddingTop: 10,
    overflow: "auto"
  },
  search: {
    paddingLeft: 10,
  }
});

const constructPropertyTreeData = (properties) => properties.map(({ _id, title, properties }) => ({
  title,
  _id,
  children: constructPropertyTreeData(properties)
}));

const EditButton = ({ handleClick }) => (
  <IconButton onClick={handleClick}>
    <Edit fontSize="small"/> 
  </IconButton>
);

const SaveButton = ({ handleClick }) => (
  <IconButton aria-label="Save changes to this group" onClick={handleClick}>
    <Save fontSize="small"/> 
  </IconButton>
);

const StorageButton = ({ handleClick }) => (
  <IconButton onClick={handleClick}>
    <Storage fontSize="small"/>
  </IconButton>
);

const CancelEdit = ({ handleClick }) => (
  <IconButton aria-label="Cancelling changes to this group" onClick={handleClick}>
    <Cancel fontSize="small"/> 
  </IconButton>
);

const DeleteGroup = ({ handleClick }) => (
  <IconButton aria-label="Delete this group" onClick={handleClick}>
    <Delete fontSize="small"/>
  </IconButton>
);

const EditInput = ({ value, handleInputChange, handleSubmit, handleCancelEdit }) => {
  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    } else if(event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return <input autoFocus type="text" defaultValue={value} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
};

const PropertyTree = ({ treeData }) => (
  <SortableTree 
    treeData={treeData}
    onChange={() => {}}
  />
);



const PropertyDialog = ({ node, path, open, handleClose, handleSave }) => {
  const [ properties, setProperties ] = useState(node.properties);
  const treeData = open ? constructPropertyTreeData(properties) : [];
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Update Properties</DialogTitle>
        <DialogContent>
          <PropertyTree treeData={treeData}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Update</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const GroupDialog = ({ open, value, handleChange, handleClose, handleAdd }) => (
  <Dialog open={open} onClose={handleClose} aria-labelledby="add-dialog">
    <DialogTitle id="form-dialog-title">Add Group</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter the group name:
      </DialogContentText>
      <TextField autoFocus margin="dense" label="Group Name" type="text" value={value} onChange={handleChange} fullWidth/>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Cancel</Button>
      <Button onClick={handleAdd} color="primary">Add</Button>
    </DialogActions>
  </Dialog>
);

class AttCatGroup extends Component {

  constructor(props) {
    super(props);
    this.mode = this.props.params.mode; // can be att or cat
    this.attCatManager = new AttCatManager(props);
    this.state = {
      loading: true,
      treeData: [],
      searchQuery: '',
      searchFocusOffset: 0,
      searchFoundCount: null,
      newGroupDialog: false,
      currentNode: {},
      currentPath: [],
      dialog: false,
      dialogValue: "",
      editValue: ""
    };
    this.showMessage = this.props.showMessage;
    this.attCatManager.getGroup(this.mode === 'att').then(data => {
      this.setState({ loading: false, treeData: data });
    })
  };

  /**
   * Save to backend.
   * @param treeData
   */
  save = async treeData => {
    if (!treeData) treeData = this.state.treeData;
    try {
      console.log(treeData)
      await this.attCatManager.updateGroup(this.mode === 'att', treeData);
      return true;
    } catch (err) {
      this.props.showMessage(err.response.data.message, 'error');
      return false;
    }
  };

  delete = (_id, path) => () => {
    this.attCatManager.removeGroup(this.mode === 'att', _id)
      .then(res => {
        const treeData = removeNodeAtPath({treeData: this.state.treeData, path, getNodeKey: this.getNodeKey});
        this.showMessage(res.message, 'success');
        this.setState({treeData});
      })
      .catch(err => {
        console.log(err);
        this.props.showMessage(err.response ? err.response.data.message : err.message, 'error');
      })
  };

  edit = (node, path) => () => {
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, editable: true }
      }),
      editValue: node.title
    });
  };

  saveEdit = (node, path) => () => {
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, title: this.state.editValue, editable: false }
      }),
    }, () => this.save(this.state.treeData));
  };

  cancelEdit = (node, path) => () => {
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, editable: false }
      }),
      editValue: ""
    });
  };

  getNodeKey = ({node, treeIndex}) => {
    return node._id;
  };

  add = events => {
    this.setState({dialog: true});
  };

  expand = expanded => {
    this.setState({treeData: toggleExpandedForAll({treeData: this.state.treeData, expanded})})
  };

  onSearchValueChange = event => {
    this.setState({searchQuery: event.target.value})
  };

  selectPrevMatch = () => {
    const {searchFocusOffset, searchFoundCount} = this.state;
    this.setState({
      searchFocusOffset:
        searchFocusOffset !== null
          ? (searchFoundCount + searchFocusOffset - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  };

  selectNextMatch = () => {
    const {searchFocusOffset, searchFoundCount} = this.state;
    this.setState({
      searchFocusOffset:
        searchFocusOffset !== null
          ? (searchFocusOffset + 1) % searchFoundCount
          : 0,
    });
  };

  handleCloseDialog = () => {
    this.setState({dialog: false})
  };

  handleDialogAdd = () => {
    const dialogValue = this.state.dialogValue;
    this.attCatManager.generateObjectId()
      .then(ids => {
        const {treeData} = addNodeUnderParent({
          treeData: this.state.treeData, newNode: {
            title: dialogValue,
            _id: ids[0],
            properties: [],
            editable: false
          }
        });
        this.save(treeData).then(success => {
          if (success) this.setState({treeData});
        })
      })
      .finally(() => this.setState({dialog: false, dialogValue: '', dialogOptionValue: false}))
  };

  onDialogValueChange = event => {
    this.setState({dialogValue: event.target.value})
  };

  addProperty = (node, path) => () => {
    console.log("Adding property", path)
    this.setState({ newGroupDialog: true, currentNode: node, currentPath: path }); 
  }

  handleClosePropertyDialog = () => {
    this.setState({ newGroupDialog: false, currentNode: {}, currentPath: [] });
  };

  // TODO
  handleSaveProperties = () => {
    this.setState({ newGroupDialog: false, currentNode: {}, currentPath: [] });
  };

  render() {
    const {classes} = this.props;
    const {searchFocusOffset, searchQuery} = this.state;
    if (this.state.loading) {
      return <Loading/>;
    }

    // TODO : Fix infinite loop in Grid child!!
    return (
      <Paper>
        <AppBar position="static" color="default">
          <Grid container className={classes.root}>
            <Button aria-label="Add" className={classes.button}
                    onClick={this.add}>
              <Add fontSize="small"/>
            </Button>
            <ToolBarDivider/>
            <Button aria-label="Collapse All" className={classes.button}
                    onClick={() => this.expand(false)}>
              <UnfoldLess fontSize="small" className={classes.leftIcon}/>
              Collapse All
            </Button>
            <Button aria-label="Expand All" className={classes.button}
                    onClick={() => this.expand(true)}>
              <UnfoldMore fontSize="small" className={classes.leftIcon}/>
              Expand All
            </Button>
            <ToolBarDivider/>
            <TextField
              className={classes.search}
              value={this.state.searchQuery}
              onChange={this.onSearchValueChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search/>
                  </InputAdornment>
                ),
              }}
            />
            <Button aria-label="Expand All" className={classes.button}
                    onClick={this.selectPrevMatch}>
              <NavigateBefore fontSize="small"/>
            </Button>
            <Button aria-label="Expand All" className={classes.button}
                    onClick={this.selectNextMatch}>
              <NavigateNext fontSize="small"/>
            </Button>
          </Grid>
        </AppBar>
        <div className={classes.tree}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => {
              this.setState({treeData});
            }}
            onMoveNode={data => {
              this.save();
            }}
            getNodeKey={this.getNodeKey}
            searchQuery={searchQuery}
            searchFocusOffset={searchFocusOffset}
            searchFinishCallback={matches => {
              this.setState({
                searchFoundCount: matches.length,
                searchFocusOffset:
                  matches.length > 0 ? searchFocusOffset % matches.length : 0,
              })
            }}
            generateNodeProps={({node, path}) => {
              const EditMode = () => [ <SaveButton node={node} path={path} handleClick={this.saveEdit(node, path)}/>, <CancelEdit node={node} path={path} handleClick={this.cancelEdit(node, path)}/> ];
              const NormalMode = () => [ <StorageButton handleClick={this.addProperty(node, path)}/>, <EditButton handleClick={this.edit(node, path)}/> ];

              let ModifyButtons = node.editable ? EditMode() : NormalMode();

              const handleInputChange = ({ target: { value } }) => this.setState({ editValue: value });

              const handleInputSubmit = this.saveEdit(node, path);
              const handleCancelEdit = this.cancelEdit(node, path);
              return {
                title: node.editable ? <EditInput value={node.title} handleInputChange={handleInputChange} handleSubmit={handleInputSubmit} handleCancelEdit={handleCancelEdit}/> : node.title,
                buttons: [
                  ...ModifyButtons,
                  <DeleteGroup aria-label="Delete this group" handleClick={this.delete(node._id, path)}/>
                ]
              }
            }}
          />
        </div>
        <GroupDialog open={this.state.dialog} value={this.state.dialogValue} handleChange={this.onDialogValueChange} handleClose={this.handleCloseDialog} handleAdd={this.handleDialogAdd}/>
        {this.state.newGroupDialog && <PropertyDialog node={this.state.currentNode} path={this.state.currentPath} open={this.state.newGroupDialog} handleClose={this.handleClosePropertyDialog} handleSave={this.handleSaveProperties}/>}
      </Paper>
    )
  }
}

AttCatGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttCatGroup);