//TODO: Fix HTML message - provide valid links

import nodeMailer from "nodemailer";
import { mailServer, serverHostname } from "../config/config";

const smtpTransport = nodeMailer.createTransport(mailServer);

const from = mailServer.sender;

const sendMail = (mailOptions, callback) => {
  smtpTransport.sendMail(mailOptions, (error, { messageId }) => {
    if (error) {
      return console.log(error);
    }
    console.log(`Message sent: ${messageId}`);
    callback('Email sent.');
  });   
};

export const sendValidationEmail = (to, token, callback) => {
  sendMail({
    from, 
    to, 
    subject: 'Please Validate Your Account', 
    html: '<html>Please click on the following link: to validate yourself:<br>'
      + serverHostname +'/validate/' + token + ' <html>'
  }, callback);
};

export const sendResetEmail = (to, token, callback) => {
  sendMail({
    from,
    to,
    subject: 'Please Reset your Password',
    html: '<html>Please click on the following link to reset password:<br>'
      + serverHostname +'/reset/' + token + ' <html>'
  }, callback);
};

export const sendRegisterSubmitEmail = (to, username, callback) => {
  sendMail({
    from, 
    to, 
    subject: 'Register Submit Successfully!', 
    html: `<html>Dear ${username}, your registration request has been submitted! Please wait for the response from your manager.<html>`
  }, callback);
};

export const sendRegisterSuccessEmail = (to, password, callback) => {
  sendmail({
    from, 
    to, 
    subject: 'Register Successfully!', 
    html: '<html>' + 'Your Registration has been approved! Your temporary password is ' + password + '. Please log in to your account and change your password as soon as possible! <html>'
  }, callback);
};

export const sendRegisterFailEmail = (to, callback) => {
  sendMail({
    from, 
    to, 
    subject: 'Register Fail', 
    html: '<html>' + 'Your Registration has been rejected.<html>'
  }, callback);
};

export const sendRequestRemindEmail = (to, username, callback) => {
  sendMail({
    from, 
    to, 
    subject: 'Registration Request', 
    html: '<html>' + username + ' has submitted his registration request. Please log in your account and approve/disapprove his request.' + '<br>'
      + serverHostname +'/login' + ' <html>'
  }, callback);
};
