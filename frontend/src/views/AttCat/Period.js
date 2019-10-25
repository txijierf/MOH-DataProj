import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";

import axios from "axios";
import {check, axiosConfig, config} from "../../controller/common";

// TODO : Add erro handling
const Period = () => {
  const [ periods, setPeriods ] = useState([]);
  const [ isDataFetched, setIsDataFetched ] = useState(false);

  useEffect(() => {
    if(!isDataFetched) {
      axios.get(config.server + '/api/v2/periods/', axiosConfig)
        .then((response) => {
          if (check(response)) {
            return response.data;
          }
        })
        .then(({ periods }) => setPeriods(periods))
        .catch((error) => console.error(error));
    }

    setIsDataFetched(true);
  });

  const handleRowAdd = (period) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.post(`${config.server}/api/v2/periods`, period, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          setPeriods([ ...periods, period ]);
          resolve();
        })
        .catch(() => reject());
    }, 600);
  });

  const handleRowDelete = (oldPeriod) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.delete(`${config.server}/api/v2/periods/${oldPeriod.period}`, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldPeriodIndex = periods.indexOf(oldPeriod);
          setPeriods([ ...periods.slice(0, oldPeriodIndex), ...periods.slice(oldPeriodIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });

  const handleRowUpdate = (newPeriod, oldPeriod) => new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.put(`${config.server}/api/v2/periods/`, { newPeriod, oldPeriod: { period: oldPeriod.period } }, axiosConfig)
        .then(response => {
          if(check(response)) {
            return response.data;
          }
        })
        .then(() => {
          const oldPeriodIndex = periods.indexOf(oldPeriod);
          setPeriods([ ...periods.slice(0, oldPeriodIndex), newPeriod, ...periods.slice(oldPeriodIndex + 1) ]);
          resolve();
        })
        .catch(() => reject());
    }, 1000);
  });


  const columns = [
    { title: "Period", field: "period" }
  ];

  return (
    <MaterialTable
      title="Periods"
      columns={columns}
      data={periods}
      editable={{ onRowAdd: handleRowAdd, onRowUpdate: handleRowUpdate, onRowDelete: handleRowDelete }}
      options={{ actionsColumnIndex: -1 }}
    />
  );
};

export default Period;