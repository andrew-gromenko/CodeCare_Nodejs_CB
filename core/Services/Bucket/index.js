const Promise        = require('bluebird');
const {S3}           = require('aws-sdk');
const {Transform}    = require('stream');
const {IncomingForm} = require('formidable');
const {generate}     = require('shortid');
const {aws}          = require('../../../common.config');

const amazon        = new S3(aws);
const	getObject     = Promise.promisify(amazon.getObject, {context: amazon});
const uploadObject  = Promise.promisify(amazon.upload, {context: amazon});
const	deleteObjects = Promise.promisify(amazon.deleteObjects, {context: amazon});
const	listObjectsV2 = Promise.promisify(amazon.listObjectsV2, {context: amazon});

/* Exports */
module.exports = {
	one,
	list,
	upload,
	remove,
	uploader,
};

function one(Key) {
	return getObject({Key});
}

function list() {
	return listObjectsV2();
}

function upload(Key, Body) {
	return uploadObject({Key, Body});
}

function remove(Keys = []) {
	return deleteObjects({
		Delete: {
			Objects: Keys.map(Key => ({Key})),
		},
	});
}

function uploader(request) {
	const {_user} = request;
	const form = new IncomingForm();
	const result = {
		file: {},
		fields: [],
	};

	// generate name for file which will be stored on AWS S3
	// user_id/images/file_name TODO: user_id/images/<SIZE>/file_name
	// user_id/audios/file_name
	// user_id/videos/file_name

	const key = ({userId, type}) => {
		const date = new Date();
		const day = date.getDate();
		const year = date.getFullYear();
		const month = (date.getMonth() + 1);

		const formatted = {
			day: day <= 9 ? `0${day}` : day,
			year,
			month: month <= 9 ? `0${month}` : month,
		};

		return `${userId}/${formatted.year}-${formatted.month}-${formatted.day}/${type}/${generate()}`;
	};

	const handler = (resolve, reject) => {
		form.on('fileBegin', (field, file) => {
			// TODO: should't load if there no file
			file.on('error', reject);

			file.open = function open() {
				this._writeStream = new Transform({
					transform(chunk, encoding, callback) {
						callback(null, chunk);
					},
				});

				this._writeStream.on('error', reject);

				upload(key({userId: _user.id, type:'image'}), this._writeStream)
					.then(({Location, Bucket, Key}) => {

						result.file = Object.assign({}, result.file, {
							key: Key,
							src: Location,
							bucket: Bucket,
						});

						return resolve(result);
					})
					.catch(error => reject(error));
			}
		});

		form.on('field', (name, value) =>
			result.fields.push({[name]: value}));

		form.on('error', (error) =>
			reject(new Error(`Error is occurred while loading file. ${error.message}`)));

		form.on('file', (name, file) => {
			const {size, type, name: file_name} = file.toJSON();

			result.file = Object.assign({}, result.file, {
				size,
				type,
				file_name,
			});
		});

		form.parse(request);
	}

	return new Promise(handler);
}