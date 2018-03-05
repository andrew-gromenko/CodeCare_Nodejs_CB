const User = require('../Models/User');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const UserService = require('../Services/User'); 
const Token = require('../Services/Token');
const { paymentToken, paymentPlan } = require('../../config/payment');
const stripe = require('stripe')(paymentToken);
const { send } = require('../Services/Email')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function errorHandler(error) {
  return {
    status: 400,
    error: {
      message: error.message,
    },
  };
}

function successHandler(data) {
  return {
    status: 200,
    data,
  };
}

function authorize(request, response) {
  const { app, body } = request;
  const secret = app.get('SECRET_TOKEN');
  if (!body.token) return response.send(errorHandler({ message: 'payment information not provided' }));

  UserService.profile(body.username).then(profile => {
    response.send(errorHandler({ message: 'Username has already been taken' }));
  }).catch(err => {
    UserModel.find({ email: body.email }).then(users => {
      if (users.length) {
        response.send(errorHandler({ message: 'Email is already in use' }));
      } else {
        stripe.customers.create({
          email: body.email,
          description: body.email,
          source: body.token,
        }, (error, customer) => {
          if (error) {
            return response.send(errorHandler(error));
          }

          let subscription = {};
          if (body.coupon) {
            subscription = {
              customer: customer.id,
              plan: paymentPlan,
              coupon: body.coupon,
            };
          } else {
            subscription = {
              customer: customer.id,
              plan: paymentPlan,
            };
          }

          stripe.subscriptions.create(
            subscription,
            (error, subscription) => {
              if (error) {
                return response.send(errorHandler(error));
              } else {
                const object = {
                  password: body.password,
                  username: body.username,
                  paymentToken: subscription.customer,
                  email: body.email,
                };

                // If email service will fail, the user will be still created, but no verification link will be provided
                User.create(object)
                  .then(user => {
                    const token = Token.assign(user, secret);
                    const mailOptions = {
                      to: user.email,
                      subject: 'Verify your Clockbeats account',
                      body: '<a href="http://' + request.headers.host + '/authorize/verify-email?token=' + token + '">Verify link</a>',
                    };
                    send(mailOptions, (err, res) => {
                      if (err) return response.send(errorHandler(error));
                      return response.send({ status: 200, data: { mail: 'successfully' } });
                    })
                  })
                  .catch(error => {
                    console.log('User create catch', error);
                    response.send(errorHandler(error));
                  });
              }
            } 
          )
        })
      }
    });
  });
}
 
function verify(req, res) {
  const { app } = req;
  const secret = app.get('SECRET_TOKEN');
  const token = req.query.token;

  jwt.verify(token, secret, function (err, decoded) {
    if (err) return res.redirect('https://clb-staging.herokuapp.com/sign-up-failed');
    User.update(decoded.id, { verified: true })
      .then(user => {
        const mailOptions = {
          to: decoded.email,
          subject: 'Hey! You are a Clockbeater now!',
          body: '<h3 style="text-align: center" align="center">Dear “' + user.username + '”,</h3><br>' +
          '<p>thank you for signing up and join our fam!! From now on you can start to share your projects and start your work.' +
          'We are thrilled to welcome you to Clockbeats, the new generation music community.<br>' +
          'LOG IN here : <a href="https://clb-staging.herokuapp.com/sign-in">https://clb-staging.herokuapp.com/sign-in</a><br>' +
          'Username : “' + user.username + '”<br>' +
          'We hugely appreciate your support, and we will keep you updated about devolopments of Clockbeats, through our newsletter.<br>' +
          'If you have any questions, please do not hesitate to contact us!<br>' +
          'Best regards, #BreakTheSoundBarriers</p>'
        };
        send(mailOptions, (err, info) => {
          if (err) res.redirect('https://clb-staging.herokuapp.com/sign-up-failed')
          return res.redirect('https://clb-staging.herokuapp.com/sign-up-succeeded');
        })
      })
      .catch(error => errorHandler(error))
  });
}

function verifyEmail(request, response) {
  const { body, app } = request;
  const secret = app.get('SECRET_TOKEN');

  User.oneByEmail(body.email)
    .then(user => {
      const token = jwt.sign({
        email: user.email,
        id: user.id
      }, secret, { expiresIn: '1h' });

      const mailOptions = {
        to: user.email,
        subject: 'Clockbeats',
        body: '<a href="https://clb-staging.herokuapp.com/restore?token=' + token + '">Restore password link</a>'
      };
      send(mailOptions, (err, res) => {
        if (err) response.send(errorHandler(error))
        return response.send({ status: 200, data: { mail: 'Succeeded' } })
      })
    })
    .catch(error => response.send(errorHandler(error)));
}

function restorePassword(request, response) {
  const { body, params, app } = request;
  const secret = app.get('SECRET_TOKEN');
  const token = params.token;

  jwt.verify(token, secret, function (err, decoded) {
    if (err) return response.send(errorHandler(err));
    bcrypt.hash(body.password, 10)
      .then(password => {
        return User.update(decoded.id, { password })
          .then(user => {
            const mailOptions = {
              to: decoded.email,
              subject: 'Clockbeats',
              body: 'New password :' + body.password + '.'
            };
            send(mailOptions, (err, res) => {
              if (err) response.send(errorHandler(error))
              return response.send({ status: 200, data: { mail: 'Succeeded' } })
            })
          })
      })
      .catch(error => errorHandler(error))
  });
}

module.exports = {
  authorize,
  verify,
  verifyEmail,
  restorePassword,
};

