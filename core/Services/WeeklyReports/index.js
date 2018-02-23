const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const { mail } = require('../../../config/mail');
const User = require('../../Models/User');
const Message = require('mongoose').model('Message');
const Room = require('mongoose').model('Room');
const Notification = require('mongoose').model('Notification');
const ObjectId = require('mongoose').Types.ObjectId;

const transporter = nodemailer.createTransport({
  service: mail.service,
  auth: {
    user: mail.user,
    pass: mail.password
  }
});

const getNotifications = (user) => {
  return Notification.find({ type: 'invite', recipient: ObjectId(user.id) })
    .then(notifications => {
      return notifications.length;
    });
};

const getMessages = (user) => {
  return Room.find({ participants: ObjectId(user.id) })
    .then(rooms => {
      return Promise.all(rooms.map(room => {
        return Message
          .find({ room: room._id, issuer: { $ne: user.id } })
          .then(messages => {
            return messages.length;
          });
      })).then(res => {
        return res.reduce((acc, val) => acc + val, 0);
      });
    })
};

const processUser = (user) => {
  console.log('Processing', user.username, user.id);

  Promise.all([getNotifications(user), getMessages(user)]).then((res) => {
    console.log('All:', res);
    const mailOptions = {
      from: 'hello@clockbeats.com',
      to: user.email,
      subject: 'Weekly report!',
      html: '<h3 style="text-align: center" align="center">Weekly report</h3><br>' +
      '<p>New workspace invites ' + res[0] +'.<br>' +
      'New messages: ' + res[1] + '.<br>' +
      'If you have any questions, please do not hesitate to contact us!<br>' +
      'Best regards, #BreakTheSoundBarriers</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('1', error);
      } else {
        console.log('Successfully sent', info);
      }
    });
  });
};

const weeklyReportHandler = () => {
  console.log('Report!', new Date());

  User.list().then((users) => {
    console.log('first user', users[0]);
    users.forEach(processUser);
  });
};

const weeklyReport = schedule.scheduleJob('0 * * * * *', weeklyReportHandler);

// weeklyReportHandler();