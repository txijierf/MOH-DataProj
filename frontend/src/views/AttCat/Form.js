import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";

import axios from "axios";
import {check, axiosConfig, config} from "../../controller/common";

// TODO : Add erro handling
const Form = () => {
  const [ forms, setFacilities ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);

  useEffect(() => {
    if(!isDataFetched) {
      axios.get(config.server + '/api/v2/forms/', axiosConfig)
        .then((response) => {
          if (check(response)) {
            return response.data;
          }
        })
        .then(({ forms }) => setFacilities(forms))
        .catch((error) => console.error(error));
    }

    setIsDataFetched(true);
  });

  const handleRowAdd = (form) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.post(`${config.server}/api/v2/forms`, form, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          setFacilities([ ...forms, form ]);
          resolve();
        })
        .catch(() => reject());
    }, 600);
  });

  const handleRowDelete = (oldForm) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.delete(`${config.server}/api/v2/forms/${oldForm.name}`, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldFormIndex = forms.indexOf(oldForm);
          setFacilities([ ...forms.slice(0, oldFormIndex), ...forms.slice(oldFormIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });

  const handleRowUpdate = (newForm, oldForm) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.put(`${config.server}/api/v2/forms/`, { newForm, oldForm: { name: oldForm.name } }, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldFormIndex = forms.indexOf(oldForm);
          setFacilities([ ...forms.slice(0, oldFormIndex), newForm, ...forms.slice(oldFormIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });


  const columns = [
    { title: "Name", field: "name" }
  ];

  return (
    <MaterialTable
      title="Forms"
      columns={columns}
      data={forms}
      editable={{ onRowAdd: handleRowAdd, onRowUpdate: handleRowUpdate, onRowDelete: handleRowDelete }}
      options={{ actionsColumnIndex: -1 }}
    />
  );
};

export default Form;