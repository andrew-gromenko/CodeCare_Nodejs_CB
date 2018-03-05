const schedule = require('node-schedule');
const User = require('../../Models/User');
const Message = require('mongoose').model('Message');
const Room = require('mongoose').model('Room');
const Notification = require('mongoose').model('Notification');
const ObjectId = require('mongoose').Types.ObjectId;
const { send } = require('../../Services/Email')

const createDates = () => {
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  const lastWeek = new Date(currentDate.getTime());
  lastWeek.setDate(lastWeek.getDate() - 7);

  return {
    start: lastWeek,
    end: currentDate,
  };
};

const getNotifications = (user, dates) => {
  return Notification.find({
    type: 'invite',
    recipient: ObjectId(user.id),
    created_at: {
      $gte: dates.start,
      $lt: dates.end,
    },
  })
    .then(notifications => {
      return notifications.length;
    });
};

const getMessages = (user, dates) => {
  return Room.find({ participants: ObjectId(user.id) })
    .then(rooms => {
      return Promise.all(rooms.map(room => {
        return Message
          .find({
            room: room._id,
            issuer: { $ne: user.id },
            created_at: {
              $gte: dates.start,
              $lt: dates.end,
            },
          })
          .then(messages => {
            return messages.length;
          });
      })).then(res => {
        return res.reduce((acc, val) => acc + val, 0);
      });
    })
};

const processUser = (user, dates) => {
  Promise.all([getNotifications(user, dates), getMessages(user, dates)]).then((res) => {
    const newWorkspaceInvites = res[0];
    const newMessages = res[1];

    if (!newWorkspaceInvites && !newMessages) return;

    const mailOptions = {
      to: user.email,
      subject: 'Weekly report!',
      body: '<h3 style="text-align: center" align="center">Weekly report</h3><br>' +
      (newMessages ? 'New invites: ' + newWorkspaceInvites + '.<br>' : '') +
      (newMessages ? 'New messages: ' + newMessages + '.<br>' : '') +
      'If you have any questions, please do not hesitate to contact us!<br>' +
      'Best regards, #BreakTheSoundBarriers</p>'
    };

    send(mailOptions, (err, res) => {
      if (err) return console.log(res);
      return
    });
  });
};

const weeklyReportHandler = () => {
  const dates = createDates();

  User.list().then((users) => {
    users.forEach((user) => processUser(user, dates));
  });
};

// second, minute, hour, day of month, month, day of week
// Every Monday at 00:00:00
const weeklyReport = schedule.scheduleJob('0 0 0 * * 0', weeklyReportHandler);
