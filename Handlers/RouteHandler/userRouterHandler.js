/*
 * Title: user Handler
 * Description: user Route Handler that handle [real Route] user related routes
 * Author: Md. Abu Noman
 * Date:  28- May-2022
 *
 */

//Dependencies
const lib = require('../../Library/data');
const handlerUtilities = require('../../Helpers/HandlerUtilities');
const tokenVerifyHandler = require('./tokenVerifyRouteHandler');

//about Handler Object - module scaffolding
const userHandler = {};

userHandler.handler = (requestProperties, callback) => {
	//checking the validate method [GET,POST,PUT,DELETE]
	const acceptedMethods = ['get', 'post', 'put', 'delete'];
	console.log(requestProperties);

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		//if Method match call Method functon()---userHandler.Method[get/post/put/delete]()
		userHandler._Method[requestProperties.method](requestProperties, callback);
	} else {
		callback(405, {
			message: `${requestProperties.method} Method not found`
		});
	}
};

//userMethod Handler Object - module scaffolding that define the Method match call functon()
userHandler._Method = {
	//get,
	//post,
	//put,
	//delete
};

//POST Method
userHandler._Method.post = (requestProperties, callback) => {
	//POST (firstName,lastName,phoneNumber,age,student & Password) for Register........
	//Validate input

	const firstName =
		typeof requestProperties.body.firstName === 'string' &&
		requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;

	const lastName =
		typeof requestProperties.body.lastName === 'string' &&
		requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;

	const phoneNumber =
		typeof requestProperties.body.phoneNumber === 'string' &&
		requestProperties.body.phoneNumber.trim().length === 11
			? requestProperties.body.phoneNumber
			: false;

	const age =
		typeof requestProperties.body.age === 'number' &&
		requestProperties.body.age > 0
			? requestProperties.body.age
			: false;

	const student =
		typeof requestProperties.body.student === 'boolean'
			? requestProperties.body.student
			: false;

	const password =
		typeof requestProperties.body.password === 'string' &&
		requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;
	console.log(
		'Users Lists: ',
		firstName,
		lastName,
		phoneNumber,
		age,
		student,
		password
	);
	if (firstName && lastName && phoneNumber && age && student && password) {
		//make sure that the user is Available or Not
		lib.readfile('users', phoneNumber, (err) => {
			//if dataFile is not available at file means - [got error- means dataFile is not there, can't read],
			//                                             [got !error- means dataFile is there, can read]
			if (err) {
				//make all datas as a Object
				let userDataObject = {
					firstName: firstName,
					lastName: lastName,
					phoneNumber: phoneNumber,
					age: age,
					student: student,
					password: handlerUtilities.hashpassword(password)
				};

				//write the user datas into the file
				lib.createfile('users', phoneNumber, userDataObject, (err) => {
					if (!err) {
						console.log(err);

						callback(200, {
							message: 'User is created successfully'
						});
					} else {
						console.log(err);

						callback(500, {
							error: 'Server Site Error: Can not create user Data'
						});
					}
				});
			} else {
				callback(500, {
					error: 'Server site problem: File not found'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Client Request Problem '
		});
	}
};

// @TODO: User Authentication
//GET Method
userHandler._Method.get = (requestProperties, callback) => {
	//check the phoneNumber is valid for queryString
	console.log(
		'Query_StringObj: ',
		requestProperties.queryStringObj.phoneNumber
	);

	const phoneNumber =
		typeof requestProperties.queryStringObj.phoneNumber === 'string' &&
		requestProperties.queryStringObj.phoneNumber.trim().length === 11
			? requestProperties.queryStringObj.phoneNumber
			: false;
	console.log('Query_StringObj_phone: ', phoneNumber);
	if (phoneNumber) {
		//	FIXME: Verify : (phoneNumber & tokenId) have to matched
		//user Send tokenId by 'Headers' at GET Request (Login)
		let token =
			typeof requestProperties.headersObj.token === 'string'
				? requestProperties.headersObj.token
				: false;
		tokenVerifyHandler._Token.VerifyToken(token, phoneNumber, (tokenId) => {
			if (tokenId) {
				//find the user by user's phone number(After User Authentication)
				lib.readfile('users', phoneNumber, (err, user) => {
					console.log('Userdata(String): ', user);

					//makeing user String data to validate JSON Object data
					let userData = handlerUtilities.parseJSON(user);

					//const userData = { ...parseJSON(user) };
					console.log('Userdata(JSONObject): ', userData);

					if (!err && userData) {
						delete userData.password;
						callback(200, userData);
					} else {
						callback(404, {
							error: 'Requested User not Found'
						});
					}
				});
			} else {
				callback(403, {
					error: 'User Authentication Failed'
				});
			}
		});

		//find the user by user's phone number(Before User Authentication)
	} else {
		callback(404, {
			error: 'Requested User not Found'
		});
	}
};

// @TODO: User Authentication
//PUT Method
userHandler._Method.put = (requestProperties, callback) => {
	//check the phoneNumber & other properties is valid for body properties
	const phoneNumber =
		typeof requestProperties.body.phoneNumber === 'string' &&
		requestProperties.body.phoneNumber.trim().length === 11
			? requestProperties.body.phoneNumber
			: false;

	const firstName =
		typeof requestProperties.body.firstName === 'string' &&
		requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;

	const lastName =
		typeof requestProperties.body.lastName === 'string' &&
		requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;

	const age =
		typeof requestProperties.body.age === 'number' &&
		requestProperties.body.age > 0
			? requestProperties.body.age
			: false;

	const student =
		typeof requestProperties.body.student === 'boolean'
			? requestProperties.body.student
			: false;

	const password =
		typeof requestProperties.body.password === 'string' &&
		requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;
	console.log(
		'Users Lists: ',
		firstName,
		lastName,
		phoneNumber,
		age,
		student,
		password
	);

	if (phoneNumber) {
		if (firstName || lastName || age || student || password) {
			//	FIXME: Verify : (phoneNumber & tokenId) have to matched
			//user Send tokenId by 'Headers' at PUT Request (Login)
			let token =
				typeof requestProperties.headersObj.token === 'string'
					? requestProperties.headersObj.token
					: false;
			tokenVerifyHandler._Token.VerifyToken(token, phoneNumber, (tokenId) => {
				if (tokenId) {
					//find the file(phoneNumber) is available or Not (After Authentication)
					lib.readfile('users', phoneNumber, (err, user) => {
						//makeing user String data to validate JSON Object data
						let userData = handlerUtilities.parseJSON(user);

						if (!err && userData) {
							if (firstName) {
								userData.firstName = firstName;
							}
							if (lastName) {
								userData.lastName = lastName;
							}
							if (age) {
								userData.age = age;
							}
							if (student) {
								userData.student = student;
							}
							if (password) {
								userData.password = handlerUtilities.hashpassword(password);
							}

							//Update data & store to user datafile
							lib.updatefile('users', phoneNumber, userData, (err) => {
								if (!err) {
									callback(200, {
										message: 'User Updated Successfully'
									});
								} else {
									callback(500, {
										error: 'Error in the Server Side'
									});
								}
							});
						} else {
							callback(400, {
								error: 'Problem in Requested data'
							});
						}
					});
				} else {
					callback(403, {
						error: 'User Authentication Failed'
					});
				}
			});
			//find the file(phoneNumber) is available or Not(Before Authontication)
		} else {
			callback(400, {
				error: 'problem in your Request!'
			});
		}
	} else {
		callback(400, {
			error: 'Invalid phone number Plz try again...'
		});
	}
};

// @TODO: User Authentication
//DELETE Method
userHandler._Method.delete = (requestProperties, callback) => {
	//check the phoneNumber is valid for body properties
	const phoneNumber =
		typeof requestProperties.queryStringObj.phoneNumber === 'string' &&
		requestProperties.queryStringObj.phoneNumber.trim().length === 11
			? requestProperties.queryStringObj.phoneNumber
			: false;

	if (phoneNumber) {
		//	FIXME: Verify : (phoneNumber & tokenId) have to matched
		//user Send tokenId by 'Headers' at PUT Request (Login)
		let token =
			typeof requestProperties.headersObj.token === 'string'
				? requestProperties.headersObj.token
				: false;
		tokenVerifyHandler._Token.VerifyToken(token, phoneNumber, (tokenId) => {
			if (tokenId) {
				//lookup the userfile is available or not(After Authenticationb)
				lib.readfile('users', phoneNumber, (err, user) => {
					if (!err && user) {
						lib.deletefile('users', phoneNumber, (err) => {
							if (!err) {
								callback(200, { message: 'User Data deleted successfully' });
							} else {
								callback(500, {
									error: 'User Data Not deleted'
								});
							}
						});
					} else {
						callback(500, {
							error: 'User not found'
						});
					}
				});
			} else {
				callback(403, {
					error: 'User Authentication Failed'
				});
			}
		});
		//lookup the userfile is available or not(Before Authentication)
	} else {
		callback(400, {
			error: 'Requested User not Found'
		});
	}
};

// Object Module Export --------------------------------
module.exports = userHandler;
