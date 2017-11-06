const Promise = require('bluebird');
const {S3} = require('aws-sdk');
const {Transform} = require('stream');
const {IncomingForm} = require('formidable');
const {generate} = require('shortid');
const uuid = require('uuid/v4');
const moment = require('moment');
const {aws} = require('../../../common.config');

const amazon = new S3(aws);
const getObject = Promise.promisify(amazon.getObject, {context: amazon});
const uploadObject = Promise.promisify(amazon.upload, {context: amazon});
const deleteObjects = Promise.promisify(amazon.deleteObjects, {context: amazon});
const listObjectsV2 = Promise.promisify(amazon.listObjectsV2, {context: amazon});

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

function generateName(type = 'resource', ext) {
	const id = generate();
	const name = uuid();
	const date = moment().format('YYYY-MM-DD');

	return `${date}/${id}/${type}/${name}.${ext}`;
}

function uploader(request) {
	const form = new IncomingForm();
	const result = {
		file: {},
		fields: {},
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

				const [ext] = file.name.split('.').slice(-1);
				const [type] = file.type.split('/');

				upload(generateName(type, ext), this._writeStream)
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
			result.fields[name] = value);

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
	};

	return new Promise(handler);
}