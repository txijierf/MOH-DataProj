import React, { Component } from 'react';
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
import {UnfoldLess, UnfoldMore, Add, Search, NavigateBefore, NavigateNext, Delete, Edit, Save, Cancel} from "@material-ui/icons";
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
      dialog: false,
      dialogValue: '',
      dialogOptionValue: false,
      editValue: ""
    };
    this.showMessage = this.props.showMessage;
    this.attCatManager.getGroup(this.mode === 'att').then(data => {
      this.setState({
        loading: false,
        treeData: data
      })
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
            optional: this.state.dialogOptionValue,
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

  dialog = () => {
    return (
      <Dialog open={this.state.dialog} onClose={this.handleCloseDialog} aria-labelledby="add-dialog">
        <DialogTitle id="form-dialog-title">Add Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the group name:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            type="text"
            value={this.state.dialogValue}
            onChange={this.onDialogValueChange}
            fullWidth
          />
          Optional: <Checkbox checked={this.state.dialogOptionValue} onClick={() => this.setState({ dialogOptionValue: !this.state.dialogOptionValue })}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleDialogAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  };

  render() {
    const {classes} = this.props;
    const {searchFocusOffset, searchQuery} = this.state;
    if (this.state.loading) {
      return <Loading/>;
    }

    console.log(this.state.treeData)
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

              let ModifyButtons = node.editable ? EditMode() : [ <EditButton handleClick={this.edit(node, path)}/> ];


              const handleInputChange = ({ target: { value } }) => this.setState({ editValue: value });

              const handleInputSubmit = this.saveEdit(node, path);
              const handleCancelEdit = this.cancelEdit(node,path);
              return {
                title: node.editable ? <EditInput value={node.title} handleInputChange={handleInputChange} handleSubmit={handleInputSubmit} handleCancelEdit={handleCancelEdit}/> : <div className={node.optional && "text-warning" }>{node.title}</div>,
                buttons: [
                  ...ModifyButtons,
                  <DeleteGroup aria-label="Delete this group" handleClick={this.delete(node._id, path)}/>
                ]
              }
            }}
          />
        </div>
        {this.dialog()}
      </Paper>
    )
  }
}

AttCatGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttCatGroup);