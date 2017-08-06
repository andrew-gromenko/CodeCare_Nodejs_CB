const Message = require('mongoose').model('Message');

class MessageRepository {
	constructor() {
		this.model = Message;
	}

	create({issuer, recipient, text}) {
	}

	update({text, removed, pristine}) {
	}
}

module.exports = new MessageRepository();