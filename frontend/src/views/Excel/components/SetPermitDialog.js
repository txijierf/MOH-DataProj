import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {
  Button,
  DialogActions,
  DialogContent,
  NoSsr,
  Typography,
  TextField,
  Paper,
  MenuItem,
} from "@material-ui/core";
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import React, {Component} from "react";
import Select from 'react-select';
import Popover from "@material-ui/core/Popover";

const styles = theme => ({
  popover: {
    overflow: 'visible'
  },
  dialogContent: {
    overflowY: 'visible'
  },
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing(0.5)}px ${theme.spacing(4)}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },

});

function inputComponent({inputRef, ...props}) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
          inputProps: {
          className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
        ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
);
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
);
}


function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
);
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
);
}

const components = {
  Control,
  Menu,
  Option,
  SingleValue,
  ValueContainer,
};

class SetPermitDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userPermit: props.userPermit
    };
    const {permitOptions} = props;
    //
    this.permitOptions = [{label: 'read only', value: true}, {label:'editor mode', value: false}];
  }

  handleChange = name => (selectedOption) => {
    console.log(`${name} selected:`, selectedOption);
    this.setState({[name]: selectedOption})
  };

  handleSet = () => {
    this.props.handleSetPermit(this.state.userPermit);
  };

  render() {
    const {classes, theme} = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    const open = Boolean(this.props.anchorEl);

    return (
      <Popover
        id="simple-popper"
        open={open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.handleClose}
        classes={{paper: classes.popover}}
        anchorOrigin={{
          vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
            horizontal: 'center',
        }}
        onContextMenu={e => e.preventDefault()}
      >
        {/*<DialogTitle id="form-dialog-title">Set ID</DialogTitle>*/}
        <DialogContent className={classes.dialogContent}>
          <NoSsr>
            <Select
              value={this.state.userPermit}
              onChange={this.handleChange('userPermit')}
              options={this.permitOptions}
              classes={classes}
              styles={selectStyles}
              components={components}
              textFieldProps={{
                label: 'User Permit',
                  InputLabelProps: {
                   shrink: true,
                },
              }}
              isClearable
              placeholder={"UserPermit"}
            />

          </NoSsr>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSet} color="primary">
            Set
          </Button>
        </DialogActions>
      </Popover>
    )
  }
}

SetPermitDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(SetPermitDialog);
