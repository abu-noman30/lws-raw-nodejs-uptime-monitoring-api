/*
 * Title: Client Data verify Helper Hand
 * Description: Client Data verify for Error Handling
 * Author: Md. Abu Noman
 * Date: 29-May-2022
 *
 */

// Dependencies
const crypto = require('crypto'); //for hashing passwords
const Env = require('../Environments/env');

// App Object - Module - scaffolding
const handlerUtilities = {};

//parse JSON string to Object
handlerUtilities.parseJSON = (JSONstring) => {
	let outputJSON;

	try {
		outputJSON = JSON.parse(JSONstring);
		//console.log('JSONparseObject: ', outputJSON);
	} catch {
		outputJSON = {};
	}
	return outputJSON;
};

//Hashing Password for security purposes
handlerUtilities.hashpassword = (password) => {
	if (typeof password === 'string' && password.length > 0) {
		console.log('ENV_Secretkey:', Env.secretKey);
		let hashpass = crypto
			.createHmac('sha256', Env.secretKey)
			.update(password)
			.digest('hex');

		console.log('Hashing: ', hashpass);
		return hashpass;
	} else {
		return false;
	}
};

//Create Random String Token
handlerUtilities.createStringToken = (stringLength) => {
	let length =
		typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;

	if (length) {
		let possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890';
		let output = '';

		for (let i = 0; i < length; i++) {
			let randomChar = possibleChar.charAt(
				Math.floor(Math.random() * possibleChar.length)
			);
			output += randomChar;
		}
		return output;
	} else {
		console.log('Token Length is not specified');
		return false;
	}
};
// Export Module Object
module.exports = handlerUtilities;
