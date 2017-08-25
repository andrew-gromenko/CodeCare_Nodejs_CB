const Chat = require('../../services/Chat/index');

function one(request, response, next) {
	const {params} = request;

	Chat.findById(params.chat)
		.then(chat =>
			response.send({status: 200, data: {chat}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function list(request, response, next) {
	const {_user} = request;

	Chat.list(_user.id)
		.then(chats =>
			response.send({status: 200, data: {chats}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function create(request, response, next) {
	const {_user, body} = request;

	Chat.find([_user.id, body.participants])
		.then(chat => {

			if (chat.length === 0) {
				return Chat.create([_user.id, body.participants]);
			}

			return chat;
		})
		.then(chat =>
			response.send({status: 200, data: {chat}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}


function messageCreate(request, response, next) {
	const {body, params} = request;

	Chat.pushMessage(params.room, body)
		.then(message =>
			response.send({status: 200, data: {message, room: params.room}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function messageList(request, response, next) {
	const {params} = request;

	response.send({status: 200, data: {message: `Should show list message.`, params}});
}

function messageEdit(request, response, next) {
	const {params} = request;

	response.send({message: `Should edit message.`});
}

function messageRemove(request, response, next) {
	const {params} = request;

	response.send({message: `Should remove message.`});
}

module.exports = {
	one,
	list,
	create,
	messageCreate,
	messageList,
	messageEdit,
	messageRemove,
};