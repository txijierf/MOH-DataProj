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
import SortableTree, {toggleExpandedForAll, changeNodeAtPath, addNodeUnderParent, removeNodeAtPath, getNodeAtPath} from 'react-sortable-tree';
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

const constructPropertyTreeData = (properties) => properties.map(({ title, optional, children }) => ({ title, optional, children: constructPropertyTreeData(children) }));

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

const AddButton = ({ handleClick }) => (
  <IconButton onClick={handleClick}>
    <Add fontSize="small"/>
  </IconButton>
);

const CancelButton = ({ handleClick }) => (
  <IconButton aria-label="Cancelling changes to this group" onClick={handleClick}>
    <Cancel fontSize="small"/> 
  </IconButton>
);

const DeleteButton = ({ handleClick }) => (
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

const PropertyTree = ({ treeData, handleChange, handleDelete }) => (
  <div style={{ height: 500, width: 400 }}>
    <SortableTree 
      treeData={treeData}
      onChange={handleChange}
      generateNodeProps={({ node, treeIndex }) => ({
        title: <div className={node.optional ? "text-warning" : ""}>{node.title}</div>,
        buttons: [
          <DeleteButton aria-label="Delete this property" handleClick={() => handleDelete(treeIndex)}/>
        ]
      })}
    />
  </div>
);

const PropertiesTreeHeader = ({ handleAdd }) => (
  <AppBar position="static" color="default">
    <Grid container>
      <Button aria-label="Add" onClick={handleAdd}>
        <Add fontSize="small"/>
      </Button>
    </Grid>
  </AppBar>
);


const PropertyDialog = ({ open, newPropertyName, handleClose, handleSave, optionalChecked, handlePropertyNameChange, handleOptionalToggle }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>New Property</DialogTitle>
    <DialogContent>
      <DialogContentText>Enter the property name:</DialogContentText><TextField autoFocus margin="dense" label="Property Name" type="text" value={newPropertyName} onChange={handlePropertyNameChange} fullWidth/>
      <DialogContentText className="d-inline">Optional:</DialogContentText><Checkbox checked={optionalChecked} onClick={handleOptionalToggle}/>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleSave} color="primary">Add</Button>
      <Button onClick={handleClose} color="primary">Cancel</Button>
    </DialogActions>
  </Dialog>
);

const PropertiesDialog = ({ node, path, currentNodePropertyTreeData, open, handlePropertiesChange, handleDeleteProperty, handleClose, handleSave }) => {
  const [ propertyDialog, setPropertyDialog ] = useState(false);
  const [ propertyOptional, setNewPropertyOptional ] = useState(false);
  const [ property, setProperty ] = useState("");
  
  const handleOpenPropertyDialog = () => setPropertyDialog(true);
  const handleClosePropertyDialog = () => setPropertyDialog(false);

  const handleOptionalClick = () => setNewPropertyOptional(!propertyOptional);

  const handleNewPropertyNameChange = ({ target: { value } }) => setProperty(value);

  const handleSaveClick = () => {
    handleSave(node, path, property, propertyOptional);
    setPropertyDialog(false);
  };
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Update Properties</DialogTitle>
        <DialogContent>
          <Paper>
            <PropertiesTreeHeader handleAdd={handleOpenPropertyDialog}/>
            <PropertyTree treeData={currentNodePropertyTreeData} handleChange={handlePropertiesChange} handleDelete={handleDeleteProperty}/>
            <PropertyDialog open={propertyDialog} propertyName={property} handlePropertyNameChange={handleNewPropertyNameChange} optionalChecked={propertyOptional} handleClose={handleClosePropertyDialog} handleSave={handleSaveClick} handleOptionalToggle={handleOptionalClick}/>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
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
      <Button onClick={handleAdd} color="primary">Add</Button>
      <Button onClick={handleClose} color="primary">Cancel</Button>
    </DialogActions>
  </Dialog>
);

const PropertyValueTree = ({ treeData, handleChange }) => (
  <div style={{ height: 500, width: 400 }}>
    <SortableTree
      treeData={treeData}
      onChange={(e) => handleChange(e)}
      canDrag={false}
    />
  </div>
);

const PropertiesValueDialog = ({ open, path, getNodeKey, handleClose, treeData, handlePropertiesChange, currentNodePropertyTreeData }) => {
  const { properties } = getNodeAtPath({ treeData, path: [path[0]], getNodeKey }).node;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="form-dialog-title">Property Value</DialogTitle>
      <DialogContent>
        <PropertyValueTree treeData={properties} handleChange={handlePropertiesChange}/>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

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
      propertiesDialog: false,
      currentNode: {},
      currentPath: [],
      currentNodePropertyTreeData: [],
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
  handleSave = async treeData => {
    if (!treeData) treeData = this.state.treeData;
    try {
      await this.attCatManager.updateGroup(this.mode === 'att', treeData);
      return true;
    } catch (err) {
      this.props.showMessage(err.response.data.message, 'error');
      return false;
    }
  };

  handleDeleteGroup = (_id, path) => () => {
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

  handleEdit = (node, path) => () => {
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

  handleSaveEdit = (node, path) => () => {
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, title: this.state.editValue, editable: false }
      }),
    }, () => this.handleSave(this.state.treeData));
  };

  handleCancelEdit = (node, path) => () => {
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

  handleOpenGroupDialog = events => {
    this.setState({dialog: true});
  };

  handleExpand = expanded => {
    this.setState({treeData: toggleExpandedForAll({treeData: this.state.treeData, expanded})})
  };

  handleSearchValueChange = event => {
    this.setState({searchQuery: event.target.value})
  };

  handleSelectPrevMatch = () => {
    const {searchFocusOffset, searchFoundCount} = this.state;
    this.setState({
      searchFocusOffset:
        searchFocusOffset !== null
          ? (searchFoundCount + searchFocusOffset - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  };

  handleSelectNextMatch = () => {
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
        this.handleSave(treeData).then(success => {
          if (success) this.setState({treeData});
        })
      })
      .finally(() => this.setState({dialog: false, dialogValue: '', dialogOptionValue: false}))
  };

  handleDialogValueChange = event => {
    this.setState({dialogValue: event.target.value})
  };

  handleOpenPropertyDialog = (node, path) => () => {
    this.setState({ propertiesDialog: true, currentNode: node, currentNodePropertyTreeData: constructPropertyTreeData(node.properties), currentPath: path }); 
  }

  handleClosePropertyDialog = () => {
    this.setState({ propertiesDialog: false, currentNode: {}, currentNodePropertyTreeData: [], currentPath: [] });
  };

  handleClosePropertiesDialog = () => {
    this.setState({ propertiesDialog: false, currentNode: {}, currentNodePropertyTreeData: [], currentPath: [] });
  };

  handleAddProperty = (node, path, newProperty, optional) => {
    const newProperties = [ ...this.state.currentNodePropertyTreeData, { title: newProperty, children: [], optional } ];
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, properties: newProperties }
      }),
      currentNodePropertyTreeData: newProperties
    }, () => this.handleSave(this.state.treeData));
  };

  handlePropertiesChange = (newPropertiesTreeData) => {
    console.log(newPropertiesTreeData);
    this.setState({
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path: this.state.currentPath,
        getNodeKey: this.getNodeKey,
        newNode: { ...this.state.currentNode, properties: newPropertiesTreeData }
      }),
      currentNodePropertyTreeData: newPropertiesTreeData
    }, () => this.handleSave(this.state.treeData));
  };

  handleDeleteProperty = (index) => {
    const node = this.state.currentNode;
    const newProperties = index === 0 && this.state.currentNodePropertyTreeData.length === 1 ? [] : [ ...this.state.currentNodePropertyTreeData.slice(0, index), ...this.state.currentNodePropertyTreeData.slice(index + 1) ]
    this.setState({ 
      treeData: changeNodeAtPath({
        treeData: this.state.treeData,
        path: this.state.currentPath,
        getNodeKey: this.getNodeKey,
        newNode: { ...node, properties: newProperties }
      }),
      currentNodePropertyTreeData: newProperties
    }, () => this.handleSave(this.state.treeData));
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
            <Button aria-label="Add" className={classes.button} onClick={this.handleOpenGroupDialog}>
              <Add fontSize="small"/>
            </Button>
            <ToolBarDivider/>
            <Button aria-label="Collapse All" className={classes.button} onClick={() => this.handleExpand(false)}>
              <UnfoldLess fontSize="small" className={classes.leftIcon}/>
              Collapse All
            </Button>
            <Button aria-label="Expand All" className={classes.button} onClick={() => this.handleExpand(true)}>
              <UnfoldMore fontSize="small" className={classes.leftIcon}/>
              Expand All
            </Button>
            <ToolBarDivider/>
            <TextField
              className={classes.search}
              value={this.state.searchQuery}
              onChange={this.handleSearchValueChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search/>
                  </InputAdornment>
                ),
              }}
            />
            <Button aria-label="Expand All" className={classes.button} onClick={this.handleSelectPrevMatch}>
              <NavigateBefore fontSize="small"/>
            </Button>
            <Button aria-label="Expand All" className={classes.button} onClick={this.handleSelectNextMatch}>
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
              this.handleSave();
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
            maxDepth={2}
            generateNodeProps={({node, path}) => {
              const EditMode = () => [ <SaveButton node={node} path={path} handleClick={this.handleSaveEdit(node, path)}/>, <CancelButton node={node} path={path} handleClick={this.handleCancelEdit(node, path)}/> ];
              const NormalMode = () => [ <StorageButton handleClick={this.handleOpenPropertyDialog(node, path)}/>, <EditButton handleClick={this.handleEdit(node, path)}/> ];

              let ModifyButtons = node.editable ? EditMode() : NormalMode();

              const handleInputChange = ({ target: { value } }) => this.setState({ editValue: value });

              const handleInputSubmit = this.handleSaveEdit(node, path);
              const handleCancelEdit = this.handleCancelEdit(node, path);
              return {
                title: node.editable ? <EditInput value={node.title} handleInputChange={handleInputChange} handleSubmit={handleInputSubmit} handleCancelEdit={handleCancelEdit}/> : node.title,
                buttons: [
                  ...ModifyButtons,
                  <DeleteButton aria-label="Delete this group" handleClick={this.handleDeleteGroup(node._id, path)}/>
                ]
              }
            }}
          />
        </div>
        <GroupDialog open={this.state.dialog} value={this.state.dialogValue} handleChange={this.handleDialogValueChange} handleClose={this.handleCloseDialog} handleAdd={this.handleDialogAdd}/>
        {
          this.state.currentPath.length < 2 
            ? <PropertiesDialog node={this.state.currentNode} path={this.state.currentPath} currentNodePropertyTreeData={this.state.currentNodePropertyTreeData} open={this.state.propertiesDialog} handleClose={this.handleClosePropertyDialog} handleSave={this.handleAddProperty} handleDeleteProperty={this.handleDeleteProperty} handlePropertiesChange={this.handlePropertiesChange}/> 
            : <PropertiesValueDialog open={this.state.propertiesDialog} path={this.state.currentPath} getNodeKey={this.getNodeKey} handleClose={this.handleClosePropertyDialog} handlePropertiesChange={this.handlePropertiesChange} currentNodePropertyTreeData={this.state.currentNodePropertyTreeData} treeData={this.state.treeData}/>
        }

      </Paper>
    )
  }
}

AttCatGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttCatGroup);