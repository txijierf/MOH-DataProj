import React, { useEffect, useState } from "react";

import { Badge } from "reactstrap";
import { getAllUsers, getAllPermissions, updatePermission, switchUserValidate, switchUserActive } from "../../controller/userManager";
import { FormControl, InputLabel, Select, Input, Checkbox, MenuItem, ListItemText } from "@material-ui/core";

import { buildErrorParams } from "../../controller/common";

import MaterialTable from "material-table";

import uniqid from "uniqid";

const PermissionMenuItem = ({ name, checked }) => (
  <MenuItem value={name}>
    <Checkbox checked={checked}/>
    <ListItemText primary={name}/>
  </MenuItem>
);

const SelectInput = () => <Input id="select-multiple-checkbox"/>;

const PermissionSelectMenu = ({ selected, handleChange, selectRenderValue }) => (
  <Select multiple value={selected} onChange={handleChange(username)} input={SelectInput} renderValue={selectRenderValue}>
    <PermissionMenuItems/> 
  </Select>

);

const PermissionSelect = ({ permissions, selected, handleChange, username }) => {
  const PermissionMenuItems = () => permissions.map((name) => <PermissionMenuItem name={name} checked={selected.indexOf(name) > - 1}/>);
  
  
  const selectRenderValue = (selected) => `${selected.length} item${selected.length < 2 ? '' : 's'} selected`;
  
  return (
    <FormControl>
      <InputLabel htmlFor="select-multiple-checkbox"> </InputLabel>
      <PermissionSelectMenu selected={selected} selectRenderValue={selectRenderValue} />
    </FormControl>
  );
};

const Users = ({ showMessage }) => {
  const [ users, setUsers ] = useState([]);
  const [ permissions, setPermissions ] = useState([]);
  const [ dataFetched, setDataFetched ] = useState(false);
  const [ isSubscribed, setIsSubscribed ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const permissions = await getAllPermissions();
        const users = await getAllUsers();

        if(isSubscribed) {
          setUsers(users);
          setPermissions(permissions);
        }
      } catch(error) {
        console.log(error);
      }
    };

    if(!dataFetched) {
      fetchData();
      setDataFetched(true); 
    }
  });

  
};

export default Users;
