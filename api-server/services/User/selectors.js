const Self = {
	id: '',
	name: '',
	username: '',
	followers: 0,
	following: 0,
	projects: 0,
	gigs: 0,
	picture: '',
};

const Profile = {
	contacts: {
		country: '',
		city: '',
		email: '',
		phone: '',

		// Add to model
		__secure__: [{
			email: ['private', 'friends', 'public'],
			phone: ['private', 'friends', 'public'],
		}],
	},
	categories: ['', ''],
	cover: '',
	skills: ['', ''],
	summary: '',
};

const User = {
	id: '',
	name: '',
	username: '',
	followers: 0,
	following: 0,
	picture: '',
	categories: ['', ''],
	cover: '',
	skills: ['', ''],
	summary: '',
};

/*====================*/
// TODO
const Media = {};
const Project = {};
const Gig = {};
const Chat = {};
const Messages = {};
const Notification = {};
// Create models
const City = {}; // ?
const Country = {};
/*====================*/

/*========== System ==========*/

const Socket = {
	id: '',
	contacts: [''],
};