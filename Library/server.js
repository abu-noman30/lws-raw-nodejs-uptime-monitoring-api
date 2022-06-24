/*
 * Title: Uptime Monitoring Application
 * Description: A Restful API to monitor up or down time of user defined links
 * Author: Md. Abu Noman
 * Date: 23-May-2022
 *
 */

// Dependencies
const http = require('http');
const handler = require('../Helpers/HandleRegRes');
const environment = require('../Environments/env');
//const lib = require('./Library/data');
//const notifications = require('./Helpers/Notification');

// App Object - Module - scaffolding
const server = {};

/*
// Configuration
//(we set the environment configuration GLOBAL )
 server.config = {
	PORT: 3000
}; 
*/
/* 
// TODO: Check the data write & Read system
//_______________________________________________
// FIXME: Testing Data: input(Write) data to file

const writedata = { name: 'Md.Abu Noman', age: 26, profession: 'Student' };

lib.createfile('files', 'newFile', writedata, (err) => {
	console.log(err);
});
//____________________________________________
// FIXME: Testing Data: Read data from file
lib.readfile('users', 'files', (err,result) => {
	console.log(err,result);
});
//____________________________________________
// FIXME: Testing Data: Update data to file
const updatedata = {
	name: 'Md.Abu Noman',
	age: 26,
	profession: 'Student',
	department: 'CSE',
	semester: 'Graduate',
	cgpa: '3.00'
};
lib.updatefile('files', 'newFile', updatedata, (err) => {
	console.log(err);
});
//____________________________________________
// FIXME: Testing Data: Delete  file
lib.deletefile('files', 'newFile', (err) => {
	console.log(err);
});
 //____________________________________________
// @FIXME: Twilio SMS notification Testing
notifications.sendTwilioSms('01521309669', 'Hello world', (err) => {
	console.log(`The Error is:`, err);
});
*/
//____________________________________________
// Function Declarations - CREATE SERVER (Server runnning...)
server.createServer = () => {
	const createServerApp = http.createServer(handler.hendleReqRes);

	createServerApp.listen(environment.PORT, () => {
		console.log(`Node_environment listening on = ${process.env.NODE_ENV}`);

		//console.log(`Node_environment_1 listening on = ${process.env.NODE_ENV_1}`);

		console.log(`Server is Running at PORT ${environment.PORT}.....`);
	});
};

// Function call - START THE SERVER
server.start = () => {
	server.createServer();
};

//Export server file
module.exports = server;
