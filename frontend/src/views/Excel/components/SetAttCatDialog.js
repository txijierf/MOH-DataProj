import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper
} from "@material-ui/core";
import Draggable from 'react-draggable';
import DropdownTreeSelect from "react-dropdown-tree-select";
import 'react-dropdown-tree-select/dist/styles.css'
import "./SetIdTree.css";

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const forEachNode = (tree, cb) => {
  tree.forEach(child => {
    cb(child);

    if (Array.isArray(child.children))
      forEachNode(child.children, cb);
  });
};

class SetAttributeDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      open: false,
      select: false
    };
    this.selectedNodes = [];
  }

  open = () => {
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false, select: false, treeData: []});
  };

  /**
   * @param {{}} treeData
   * @param {Array} groups
   */
  setData = (treeData, groups) => {
    forEachNode(treeData, node => {
      if (groups.includes(node._id)) {
        node.checked = true;
      }
      node.value = node._id;
    });
    this.setState({treeData});
  };

  handleChangeGroup = (currentNode, selectedNodes) => {
    this.selectedNodes = selectedNodes;
  };

  handleChange = name => (selectedOption) => {
    console.log(`${name} selected:`, selectedOption);
    this.setState({[name]: selectedOption})
  };

  save = () => {
    const {onSave} = this.props;
    const groups = this.selectedNodes.map(node => node.value);
    onSave(groups);
  };

  selectId = () => {
    this.setState({open: false});
    this.setState({select: true});
  };
  next (){
    const attOption = this.selectedNodes.map(node => node.attcat);
    console.log(attOption);
    return (
      <>
        <Dialog
          open={this.state.select}
          onClose={this.close}
          PaperComponent={PaperComponent}
          aria-labelledby={'Assign Id'}
          fullWidth={true}
        >
          <DialogTitle style={{cursor: 'move'}}>{'Set Attribute Id'}</DialogTitle>
          <DialogContent style={{maxHeight: '90vh', minHeight: '50vh'}}>
            <DialogContentText>
              Second Step: Select the Id you want:
            </DialogContentText>
            <DropdownTreeSelect mode={"simpleSelect"} showDropdown={"always"} data={this.state.treeData}
                                onChange={this.handleChangeGroup} className="mdl-demo" keepChildrenOnSearch="true" keepTreeOnSearch="true"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.close} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  render() {
    return (
      <>
        <Dialog
          open={this.state.open}
          onClose={this.close}
          PaperComponent={PaperComponent}
          aria-labelledby={'Assign groups'}
          fullWidth={true}
        >
          <DialogTitle style={{cursor: 'move'}}>{'Set Attribute Id'}</DialogTitle>
          <DialogContent style={{maxHeight: '90vh', minHeight: '50vh'}}>
            <DialogContentText>
              First Step: Select the groups you want:
            </DialogContentText>
            <DropdownTreeSelect mode={"radioSelect"} showDropdown={"always"} data={this.state.treeData}
                                onChange={this.handleChangeGroup} className="mdl-demo" keepChildrenOnSearch="true" keepTreeOnSearch="true"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.selectId} color="primary">
              Next
            </Button>
          </DialogActions>
        </Dialog>
        {this.next()}
    </>

    )
  }
}


export default SetAttributeDialog;
