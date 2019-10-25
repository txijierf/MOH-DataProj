const express = require('express');
const router = express.Router();
const {groupController} = require('../../controller/v2');
const {
  setGroupName, 
  getGroupName, 
  getGroupLookup, 

  getPeriods, 
  addPeriod, 
  updatePeriod, 
  deletePeriod, 

  getYears, 
  addYear, 
  updateYear, 
  deleteYear, 

  getFacilities, 
  addFacility, 
  updateFacility, 
  deleteFacility,

  getForms,
  addForm,
  updateForm,
  deleteForm
} = groupController;

router.get('/api/v2/group', getGroupName);

router.post('/api/v2/group', setGroupName);

router.get('/api/v2/grouplookup', getGroupLookup);

router.get('/api/v2/periods', getPeriods);
router.post('/api/v2/periods', addPeriod);
router.put('/api/v2/periods', updatePeriod);
router.delete('/api/v2/periods/:period', deletePeriod);

router.get('/api/v2/years', getYears);
router.post('/api/v2/years', addYear);
router.put('/api/v2/years', updateYear);
router.delete('/api/v2/years/:year', deleteYear);

router.get('/api/v2/facilities', getFacilities);
router.post('/api/v2/facilities', addFacility);
router.put('/api/v2/facilities', updateFacility);
router.delete('/api/v2/facilities/:number', deleteFacility);

router.get('/api/v2/forms', getForms);
router.post('/api/v2/forms', addForm);
router.put('/api/v2/forms', updateForm);
router.delete('/api/v2/forms/:name', deleteForm);

// router.get('/api/v2/grouplookup/:group', getGroupLookupValues);

module.exports = router;
