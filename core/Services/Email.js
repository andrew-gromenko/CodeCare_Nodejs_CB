const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
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

module.exports = { send } 