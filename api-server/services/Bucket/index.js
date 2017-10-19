const Promise        = require('bluebird');
const {S3}           = require('aws-sdk');
const {Transform}    = require('stream');
const {IncomingForm} = require('formidable');
const {generate}     = require('shortid');

const {aws}   = require('../../../common.config');

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

function remove(Keys) {
	return deleteObjects({
		Delete: {
			Objects: Keys.map(Key => ({Key})),
		},
	});
}

function uploader(request) {
	const form = new IncomingForm();
	const result = {
		file: {},
		fields: [],
	};

	const key = (field, filename) => `${generate()}/${field}/${filename}`;

	const handler = (resolve, reject) => {
		form.on('fileBegin', (field, file) => {
			// TODO: should not load if there no file
			file.on('error', error => reject(error));


			file.open = function fileOpen() {
				this._writeStream = new Transform({
					transform(chunk, encoding, callback) {
						callback(null, chunk);
					},
				});

				this._writeStream.on('error', error => reject(error));

				upload(key(field, file.name), this._writeStream)
					.then(({status, data}) => {
						if (status !== 200) {
							reject(new Error('Something went wrong while loading data to the AWS S3'));
						}

						result.file = data;

						resolve(result);
					})
					.catch(error => reject(error));
			}
		});

		form.on('field', (name, value) => result.fields.push({[name]: value}));
		form.on('error', (error) => reject(new Error(`Error is occurred while loading file. ${error.message}`)));
		form.parse(request);
	};

	return new Promise(handler);
}