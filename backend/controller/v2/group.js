const Group = require('../../models/group');
const {Organization} = require('../../models/organization');
const GroupLookup = require("../../models/workbook/groupLookup");
const {checkPermission, Permission, error} = require('./helpers');

import Facility from "../../models/organization/facility";
import Period from "../../models/organization/period";
import Year from "../../models/organization/year";
import Form from "../../models/organization/form";

module.exports = {
    getGroupName: async (req, res, next) => {
        if (!checkPermission(req, Permission.SYSTEM_MANAGEMENT)) {
            return next(error.api.NO_PERMISSION);
        }
        const groupNumber = req.session.user.groupNumber;
        try {
            const group = await Group.findOne({groupNumber});
            return res.json({name: group ? group.name : null});
        } catch (e) {
            next(e);
        }
    },

    setGroupName: async (req, res, next) => {
        if (!checkPermission(req, Permission.SYSTEM_MANAGEMENT)) {
            return next(error.api.NO_PERMISSION);
        }
        const groupNumber = req.session.user.groupNumber;
        const name = req.body.name;
        try {
            await Group.replaceOne({groupNumber}, {groupNumber, name}, {upsert: true});
            return res.json({message: `Current Group name is updated to ${name}`});
        } catch (e) {
            next(e);
        }
    },

    // admin creating a group
    // TODO: frontend
    createGroup: async (req, res, next) => {
        if (!checkPermission(req, Permission.SYSTEM_MANAGEMENT)) {
            return next(error.api.NO_PERMISSION);
        }
        const {groupNumber, name} = req.body;
        try {
            const group = new Group({groupNumber, name});
            const result = await group.save();
            return res.json({result})
        } catch (e) {
            next(e);
        }
    },

    // no login required, used for registration
    getGroups: async (req, res, next) => {
        try {
            const groups = await Group.find({});
            return res.json({groups})
        } catch (e) {
            next(e);
        }
    },

    // no login required, used for registration
    getOrganizationsInGroup: async (req, res, next) => {
        const groupNumber = req.params.number;
        try {
            const organizations = await Organization.find({groupNumber}, 'name managers types');
            return res.json({organizations});
        } catch (e) {
            next(e);
        }
    },

    getGroupLookup: async (req, res, next) => {
        res.json({ groups: [ "Organizations", "Years", "Facilities", "Periods", "Forms" ] });
    },
    
    getPeriods: async(req, res, next) => {
        Period.find({})
            .then((periods) => res.json({ periods }))
            .catch(next);
    },

    addPeriod: async(req, res, next) => {
        const period = req.body;
        console.log("adding period", period);
        Period.create(period)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    updatePeriod: async(req, res, next) => {
        const { oldPeriod, newPeriod } = req.body;
        console.log("Updating ", oldPeriod, " to ", newPeriod);
        Period.findOneAndUpdate(oldPeriod, newPeriod)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    deletePeriod: async(req, res, next) => {
        const { period } = req.params;

        Period.findOneAndDelete({ period })
            .then(() => res.json({ message: "Success" }))
            .catch(next);
    },

    getYears: async(req, res, next) => {
        Year.find({})
            .then((years) => res.json({ years }))
            .catch(next);
    },

    addYear: async(req, res, next) => {
        const year = req.body;
        Year.create(year)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    updateYear: async(req, res, next) => {
        const { oldYear, newYear } = req.body;
        console.log("Updating ", oldYear, " to ", newYear);
        Year.findOneAndUpdate(oldYear, newYear)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    deleteYear: async(req, res, next) => {
        const { year } = req.params;

        Year.findOneAndDelete({ year })
            .then(() => res.json({ message: "Success" }))
            .catch(next);
    },

    getFacilities: async(req, res, next) => {
        Facility.find({})
            .then((facilities) => res.json({ facilities }))
            .catch(next);
    },

    addFacility: async(req, res, next) => {
        const facility = req.body;
        Facility.create(facility)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    updateFacility: async(req, res, next) => {
        const { oldFacility, newFacility } = req.body;
        console.log("Updating ", oldFacility, " to ", newFacility);
        Facility.findOneAndUpdate(oldFacility, newFacility)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    deleteFacility: async(req, res, next) => {
        const { number } = req.params;

        Facility.findOneAndDelete({ number })
            .then(() => res.json({ message: "Success" }))
            .catch(next);
    },

    getForms: async(req, res, next) => {
        Form.find({})
            .then((forms) => res.json({ forms }))
            .catch(next);
    },

    addForm: async(req, res, next) => {
        const form = req.body;
        Form.create(form)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    updateForm: async(req, res, next) => {
        const { oldForm, newForm } = req.body;
        console.log("Updating ", oldForm, " to ", newForm);
        Form.findOneAndUpdate(oldForm, newForm)
            .then(() => res.json({ message: "Success!" }))
            .catch(next);
    },

    deleteForm: async(req, res, next) => {
        const { name } = req.params;

        Form.findOneAndDelete({ name })
            .then(() => res.json({ message: "Success" }))
            .catch(next);
    },
};
