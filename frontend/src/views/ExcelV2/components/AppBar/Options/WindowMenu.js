import React from "react";

import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

import uniqid from "uniqid";

import "./WindowMenu.scss";

const WindowMenuItem = ({ label, command, divider, handleClick }) => (
  <DropdownItem className="d-flex justify-content-between" divider={divider} onClick={handleClick}>
    <p className="mb-0">{label}</p>
    {command && <p className="mb-0">{command}</p>}
  </DropdownItem>
);

const WindowMenu = ({ activeOption, label, groupMenuItems, handleToggle, handleMouseEnter }) => {

  const handleOptionToggle = () => handleToggle(label);
  const handleOptionMouseEnter = () => handleMouseEnter(label)
  const isOpen = label === activeOption;

  const WindowMenuItems = groupMenuItems.map((groupMenuItem, groupIndex) => (
    groupMenuItem.map((itemProps, groupItemIndex) => <WindowMenuItem key={uniqid()} {...itemProps} divider={groupIndex > 0 && groupItemIndex === 1} />)
  ));

  return (
    <Dropdown className="windowMenu" isOpen={isOpen} toggle={handleOptionToggle} onMouseEnter={handleOptionMouseEnter}>
      <DropdownToggle className="windowMenu__toggle" color="light">{label}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Foo Adction</DropdownItem>
        <DropdownItem>Bar Action</DropdownItem>
        <DropdownItem>Quo Action</DropdownItem>
        {WindowMenuItems}
      </DropdownMenu>
    </Dropdown>
  );
}

export default WindowMenu;
