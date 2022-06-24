/*
 * Title: Initial file.
 * Description: Initial file to start Server & Worker file.
 * Author: Md. Abu Noman
 * Date: 24-Jun-2022
 *
 */

// Dependencies
const server = require('./Library/server');
const worker = require('./Library/worker');

// App Object - Module - scaffolding
const app = {};

app.init = () => {
	//Start the Server
	server.start();

	//Start the Worker
	worker.start();
};

app.init();
