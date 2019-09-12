import React from "react";

import { Menu, MenuItem, Divider, withStyles } from "@material-ui/core";

import uniqid from "uniqid";


const StyledMenuItem = withStyles(() => ({
  root: {
    minWidth: 140,
    fontSize: 13,
    minHeight: 'initial',
    whiteSpace: 'pre'
  },
}))(MenuItem);

const StyledMenu = withStyles(() => ({
  list: {
    padding: 'initial'
  }
}))(Menu);

const ContextMenuItem = ({ itemProps: { description, command, handleClick }, config }) => (
  <StyledMenuItem key={uniqid()} className="d-flex justify-content-between" onClick={() => handleClick(config.anchorEl)}>
    <p className="mb-0">{description}</p>
    {command && <p className="mb-0">{command}</p>}
  </StyledMenuItem>
);

const CustomContextMenu = ({ groupMenuItems, isOpen, config, handleClose, handleMouseDown }) => {
  const ContextMenuItems = (
    groupMenuItems.map((groupMenuItem, index) => (
      <div key={uniqid()}>
        {index > 0 && <Divider/>}
        {groupMenuItem.map((itemProps) => <ContextMenuItem key={uniqid()} itemProps={itemProps} config={config}/>)}
      </div>
    ))
  );

  const preventEventDefault = (event) => event.preventDefault();

  return (
    isOpen &&
      <StyledMenu anchorReference="anchorPosition" anchorPosition={config} open={isOpen} onClose={handleClose} transitionDuration={200} onContextMenu={preventEventDefault} onMouseDown={handleMouseDown}>{ContextMenuItems}</StyledMenu>
  );
};

export default CustomContextMenu;
