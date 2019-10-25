import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";

import axios from "axios";
import {check, axiosConfig, config} from "../../controller/common";

// TODO : Add erro handling
const Year = () => {
  const [ years, setYears ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);

  useEffect(() => {
    if(!isDataFetched) {
      axios.get(config.server + '/api/v2/years/', axiosConfig)
        .then((response) => {
          if (check(response)) {
            return response.data;
          }
        })
        .then(({ years }) => setYears(years))
        .catch((error) => console.error(error));
    }

    setIsDataFetched(true);
  });

  const handleRowAdd = (year) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.post(`${config.server}/api/v2/years`, year, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          setYears([ ...years, year ]);
          resolve();
        })
        .catch(() => reject());
    }, 600);
  });

  const handleRowDelete = (oldYear) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.delete(`${config.server}/api/v2/years/${oldYear.year}`, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldYearIndex = years.indexOf(oldYear);
          setYears([ ...years.slice(0, oldYearIndex), ...years.slice(oldYearIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });

  const handleRowUpdate = (newYear, oldYear) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.put(`${config.server}/api/v2/years/`, { newYear, oldYear: { year: oldYear.year } }, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldYearIndex = years.indexOf(oldYear);
          setYears([ ...years.slice(0, oldYearIndex), newYear, ...years.slice(oldYearIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });


  const columns = [
    { title: "year", field: "year", type: "numeric" }
  ];

  return (
    <MaterialTable
      title="Years"
      columns={columns}
      data={years}
      editable={{ onRowAdd: handleRowAdd, onRowUpdate: handleRowUpdate, onRowDelete: handleRowDelete }}
      options={{ actionsColumnIndex: -1 }}
    />
  );
};

export default Year;