const User = require('../models/user');
const RegisterRequest = require('../models/registerRequest');
const sendMail = require('./sendmail');
const jwt = require('jsonwebtoken');
const registration_ldap_controller = require('./registration/ldap');
const config = require('../config/config'); // get our config file
const error = require('../config/error');

// ?isEmail and generateTokoen unused - check out validation and sessions
// const isEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
// const generateToken = (username, expireTime) => jwt.sign({ username }, config.superSecret, { expiresIn: expireTime * 60 });

const checkPermission = (req) => req.session.user.permissions.includes(config.permissions.USER_MANAGEMENT);

let allPermissions = Object.keys(config.permissions).map((key) => config.permissions[key]);


module.exports = {
    checkPermission,

    admin_update_user_permission: (req, res) => {
        if (!checkPermission(req)) {
            return res.status(403).json({success: false, message: error.api.NO_PERMISSION})
        } else {
            const permission = req.body.permissions;
            let fails = [];
            let promiseArr = [];
            // activesArr = [];

            for(let i = 0; i < permission.length; i++) {
                const username = permission[i].username;
                const permissions = permission[i].permissions;
                let filteredPermissions = [];
                // validate permission Array
                for (let i = 0; i < permissions.length; i++) {
                    if (allPermissions.includes(permissions[i]))
                        filteredPermissions.push(permissions[i])
                }
                if (req.session.user.username === username) {
                    req.session.user.permissions = filteredPermissions;
                }
    
                // add to promise chain
                promiseArr.push(new Promise((resolve) => {
                    User.findOneAndUpdate({username: username}, {
                            permissions: filteredPermissions,
                            active: permission[i].active
                        })
                        .then(() => resolve())
                        .catch(err => {
                            console.log(err);
                            fails.push(username);
                        })
                }));
            }
    
            Promise.all(promiseArr).then(() => {
                if (fails.length !== 0) {
                    res.json({ success: false, message: fails.length + '/' + data.length + 'failed.' });
                } else {
                    res.json({ success: true, message: 'Success.' });
                }
            });
        }
    },

    user_register_details: (req, res) => {
        if (!checkPermission(req)) {
            res.status(403).json({success: false, message: error.api.NO_PERMISSION})
        } else {
            RegisterRequest.find({}, (err, requests) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({success: false, message: err});
                } else {
                    res.json({success: true, registerrequests: requests});
                }
            });
        }
    },

    register_management: (req, res, next) => {
        var username = req.body.data.username;
        var registerResponse = req.body.data.value;
        if (registerResponse == "approve") {
            RegisterRequest.findOne({username: username}, (err, user) => {
                if (err) {
                    res.status(501).json({success: false, message: err});
                } else {
                    registration_ldap_controller.user_ldap_register(req, res, user, next);
    
                    // Set up new user to add to db
                    const { firstName, password, lastName, groupNumber, organization, phoneNumber, email } = user;
                    const validated = req.body.validated || false;
                    // system admin=0, form manager=1, user=2
                    const type = 2;

                    let permissions = [ "CRUD-workbook-template" ];

                    if (req.body.data.role === "workbookAdmin") {
                        permissions = [...permissions, "create-delete-attribute-category" ];
                    } else if(req.body.data.role !== "user") {
                        permissions = [ ...permissions, "create-delete-attribute-category", "user-management" ];
                    }
    
                    let newUser = new User({ 
                        username, firstName, lastName, groupNumber, organization, phoneNumber, validated, type,  email, permissions
                    });
    
                    User.register(newUser, password, (err, { email, password }) => {
                        if (err) {
                            console.log(err);
                            res.json({success: false, message: err});
                        } else {
                            console.log('success register');
                            sendMail.sendRegisterSuccessEmail(email, password, () => {
                                RegisterRequest.findOneAndDelete({username: username}, function (err) {
                                    if (err) {
                                        res.status(501).json({success: false, message: err});
                                    } else {
                                        res.json({success: true});
                                    }
                                });
                            });
                        }
                    });
                }
            });
        } else {
            RegisterRequest.findOne({username: username}, (err, user) => {
                if(err) {
                    res.status(501).json({ success: false, message: err });
                } else {
                    sendMail.sendRegisterFailEmail(user.email, () => {
                        RegisterRequest.findOneAndDelete({username: username}, function (err) {
                            if (err) {
                                res.status(501).json({success: false, message: err});
                            } else {
                                res.json({success: true});
                            }
                        });
                    });
                }
            });
        }
    },

    admin_get_all_users_with_details: (req, res) => {
        if (!checkPermission(req)) {
            res.status(403).json({success: false, message: error.api.NO_PERMISSION})
        } else {
            const groupNumber = req.session.user.groupNumber;
            let query = parseInt(groupNumber) === 0 ? {} : { groupNumber };

            User.find(query, (err, users) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({success: false, message: err});
                } else {
                    res.json({success: true, users});
                }
            });
        }
    },

    admin_get_all_permissions: (req, res) => {
        if (!checkPermission(req)) {
            res.status(403).json({success: false, message: error.api.NO_PERMISSION})
        } else {
            res.json({success: true, permissions: allPermissions});
        }
    },

    // ?NOT USED YET - need to implement
    // delete_user: (req, res) => {
    //     if (!checkPermission(req)) {
    //         return res.status(403).json({success: false, message: error.api.NO_PERMISSION})
    //     }
    //     User.deleteOne({username: req.body.username}, (err) => {
    //         if (err) {
    //             return res.status(500).json({success: false, message: err});
    //         }
    //         return res.json({success: true, message: "The user " + req.body.username + " has been deleted!"});
    //     });
    // }
};
