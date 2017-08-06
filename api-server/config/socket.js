const io = require('socket.io');

const config = {
	origins: 'http://localhost:3000',
};

module.exports = http => io.listen(http, config);