import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";

import axios from "axios";
import {check, axiosConfig, config} from "../../controller/common";

// TODO : Add erro handling
const Facilities = () => {
  const [ facilities, setFacilities ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);

  useEffect(() => {
    if(!isDataFetched) {
      axios.get(config.server + '/api/v2/facilities/', axiosConfig)
        .then((response) => {
          if (check(response)) {
            return response.data;
          }
        })
        .then(({ facilities }) => setFacilities(facilities))
        .catch((error) => console.error(error));
    }

    setIsDataFetched(true);
  });

  const handleRowAdd = (facility) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.post(`${config.server}/api/v2/facilities`, facility, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          setFacilities([ ...facilities, facility ]);
          resolve();
        })
        .catch(() => reject());
    }, 600);
  });

  const handleRowDelete = (oldFacility) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.delete(`${config.server}/api/v2/facilities/${oldFacility.number}`, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldFacilityIndex = facilities.indexOf(oldFacility);
          setFacilities([ ...facilities.slice(0, oldFacilityIndex), ...facilities.slice(oldFacilityIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });

  const handleRowUpdate = (newFacility, oldFacility) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.put(`${config.server}/api/v2/facilities/`, { newFacility, oldFacility: { facility: oldFacility.facility } }, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldFacilityIndex = facilities.indexOf(oldFacility);
          setFacilities([ ...facilities.slice(0, oldFacilityIndex), newFacility, ...facilities.slice(oldFacilityIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });


  const columns = [
    { title: "Facility Number", field: "number", type: "numeric" },
    { title: "Facility Name", field: "name" }
  ];

  return (
    <MaterialTable
      title="Facilities"
      columns={columns}
      data={facilities}
      editable={{ onRowAdd: handleRowAdd, onRowUpdate: handleRowUpdate, onRowDelete: handleRowDelete }}
      options={{ actionsColumnIndex: -1 }}
    />
  );
};

export default Facilities;