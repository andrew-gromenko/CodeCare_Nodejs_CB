const User = require('../Models/User');
const Token = require('../Services/Token');
const mail = require('../../config/mail')
const { paymentToken, paymentPlan, testKey } = require('../../config/payment');
const stripe = require('stripe')(paymentToken);
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function errorHandler(error) {
	return {
		status: 400,
		error: {
			message: error.message,
		},
	};
}


const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'bonystdia02',
		pass: 'lfkflyjcerf&j,kjvbimcz1994nnJi53xt'
	}
});

function authorize(request, response) {
	const { app, body } = request;
	const secret = app.get('SECRET_TOKEN');
	stripe.customers.create({
		email: body.email,
		description: body.email,
		source: body.token
	}, (error, customer) => {
		if (error) {
			return response.send(errorHandler(error));
		}

		let subscription = {};
		if (body.coupon) {
			subscription = {
				customer: customer.id,
				plan: paymentPlan,
				coupon: body.coupon
			};
		} else {
			subscription = {
				customer: customer.id,
				plan: paymentPlan
			};
		}

		stripe.subscriptions.create(
			subscription,
			(error, subscription) => {
				if (error) {
					return response.send(errorHandler(error));
				}

				const object = {
					password: body.password,
					username: body.username,
					paymentToken: subscription.customer,
					email: body.email
				}

				User.create(object)
					.then(user => {
						const token = Token.assign(user, secret)
						const mailOptions = {
							from: 'hello@clockbeats.com',
							to: user.email,
							subject: 'Clockbeats',
							html: '<a href="http://' + request.headers.host + '/authorize/verify-email?token=' + token + '">Verify link</a>'
						};
						transporter.sendMail(mailOptions,
							(error, info) => {
								if (error) {
									return response.send(errorHandler(error))
								}
								return response.send({ status: 200, data: {mail: 'successfully'}})
							})
					})
					.catch(error =>
						response.send(errorHandler(error)));
			}
		)
	})
}

function verify(req, res) {
	const { app } = req;
	const secret = app.get('SECRET_TOKEN');
	var token = req.query.token

	jwt.verify(token, secret, function (err, decoded) {
		if (err) return res.json({ success: false, message: 'user not found' });
		User.update(decoded.id, { verify: true })
			.then(user => {
				var mailOptions = {
					from: 'hello@clockbeats.com',
					to: decoded.email,
					subject: 'Hey! You are a Clockbeater now!',
					html: '<h3 style="text-align: center" align="center">Dear “' + user.username + '”,</h3><br>' +
						'<p>thank you for signing up and join our fam!! From now on you can start to share your projects and start your work.' +
						'We are thrilled to welcome you to Clockbeats, the new generation music community.<br>' +
						'LOG IN here : <a href="http://www.clockbeats.com/dashboard#/login?_k=drlzu5">http://www.clockbeats.com/dashboard#/login?_k=drlzu5</a><br>' +
						'Username : “' + user.username + '”<br>' +
						'We hugely appreciate your support, and we will keep you updated about devolopments of Clockbeats, through our newsletter.<br>' +
						'If you have any questions, please do not hesitate to contact us!<br>' +
						'Best regards, #BreakTheSoundBarriers</p>'
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						return res.send(error);
					} else {
						res.json({ success: true, message: 'User successfully verified' });
					}
				});
			})
			.catch(error => errorHandler(error))
	});
}

module.exports = {
	authorize,
	verify
}