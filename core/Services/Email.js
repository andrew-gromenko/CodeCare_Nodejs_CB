const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const axios = require('axios');
const { mail } = require('../../config/mail');
// config = { to, subject, body }
const send = (config, cb) => {
  const configAuth = {
    auth: {
      api_key: mail.api_key,
      domain: mail.domain
    },
  } 
  const nodemailerMailgun = nodemailer.createTransport(mg(configAuth));

  nodemailerMailgun.sendMail({
    from: mail.default_from,
    to: config.to,
    subject: config.subject,
    html: config.body,
  }, (err, info) => {
    if (cb){
      if (err) return cb(err, null)  
      return cb(null, info)
    }
    return
  });
}

const subscribeToWelcomeNewsletter = (username, email) => {
  const config = {
    auth: {
      username: 'clockbeats',
      password: '8a8ef4b7a58cdad9382181baf212d614-us11'
    },
    data : {
      email_address: email,
      status: "subscribed",
      merge_fields: { 
        FNAME: username,
      }
    }
  }
  axios({
    method: 'POST',
    url: 'https://us11.api.mailchimp.com/3.0/lists/0df3a67cce/members',
    auth: {
      username: 'clockbeats',
      password: '8a8ef4b7a58cdad9382181baf212d614-us11'
    },
    responseType: 'json',
    data : {
      email_address: email,
      status: "subscribed",
      merge_fields: { 
        FNAME: username,
      }
    }
  }).then((res) => console.log(res.data)).catch((err) => console.log('err'))
}

module.exports = { send, subscribeToWelcomeNewsletter } 