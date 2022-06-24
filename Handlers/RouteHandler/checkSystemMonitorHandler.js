/*
 * Title: Check Handler(After Login in to the System)
 * Description: Check the System for Monitoring Web site URL(UP or DOWN) Handler.
 * Author: Md. Abu Noman
 * Date:  18- Jun- 2022
 *
 */

//Dependencies
const lib = require('../../Library/data');
const handlerUtilities = require('../../Helpers/HandlerUtilities');
const tokenVerifyHandler = require('./tokenVerifyRouteHandler');
const Env = require('../../Environments/env');

//about Handler Object - module scaffolding
const checkHandler = {};

checkHandler.handler = (requestProperties, callback) => {
	//checking the validate method [GET,POST,PUT,DELETE]
	const acceptedMethods = ['get', 'post', 'put', 'delete'];
	console.log(requestProperties);

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		//if Method match call Method functon()---userHandler.Method[get/post/put/delete]()
		checkHandler._Check[requestProperties.method](requestProperties, callback);
	} else {
		callback(405, {
			message: `${requestProperties.method} Method not found`
		});
	}
};

//userMethod Handler Object - module scaffolding that define the Method match call functon()
checkHandler._Check = {
	//get,
	//post,
	//put,
	//delete
};

//POST Method(After Login in to the System- Create/POST url Links)
checkHandler._Check.post = (requestProperties, callback) => {
	//validate Inputs
	const allProtocols = ['http', 'https'];
	const allMethods = ['post', 'get', 'put', 'delete'];

	let protocol =
		typeof requestProperties.body.protocol === 'string' &&
		allProtocols.indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false;

	let url =
		typeof requestProperties.body.url === 'string' &&
		requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false;

	let method =
		typeof requestProperties.body.method === 'string' &&
		allMethods.indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false;

	//typeof(Array[]) = 'Object';
	//Array[] instanceof Array = 'true'
	let successCodes =
		typeof requestProperties.body.successCodes === 'object' &&
		requestProperties.body.successCodes instanceof Array
			? requestProperties.body.successCodes
			: false;

	let timeoutSeconds =
		typeof requestProperties.body.timeoutSeconds === 'number' &&
		requestProperties.body.timeoutSeconds % 1 === 0 &&
		requestProperties.body.timeoutSeconds >= 1 &&
		requestProperties.body.timeoutSeconds <= 5
			? requestProperties.body.timeoutSeconds
			: false;

	if (protocol && url && method && successCodes && timeoutSeconds) {
		//Validate that, user Send token by 'Headers' at Login to the System

		let token =
			typeof requestProperties.headersObj.token === 'string'
				? requestProperties.headersObj.token
				: false;

		//lookup the user phoneNumber by reading the token
		lib.readfile('tokens', token, (err, tokenData) => {
			//makeing token String data to validate JSON Object data
			let userTokenData = handlerUtilities.parseJSON(tokenData);

			if (!err && userTokenData) {
				//lookup the user phoneNumber
				let userphoneNumber = userTokenData.phoneNumber;

				//lookup the user data by user phoneNumber
				lib.readfile('users', userphoneNumber, (err, user) => {
					//makeing user String data to validate JSON Object data
					let userData = handlerUtilities.parseJSON(user);

					if (!err && userData) {
						//verify the token by tokenVerifyHandler
						tokenVerifyHandler._Token.VerifyToken(
							token,
							userphoneNumber,
							(validtokenId) => {
								if (validtokenId) {
									//Validate the user's already have 5 checks(protocol,url,method,successCodes,timeoutSeconds) or Not

									//typeof(Array[]) = 'Object';
									//Array[] instanceof Array = 'true'
									let userCheckIds =
										typeof userData.checkIDs === 'object' &&
										userData.checkIDs instanceof Array
											? userData.checkIDs
											: [];

									if (userCheckIds.length < Env.maxCheckLimit) {
										//Make a Random checkId using the  createStringToken function()
										let checkId = handlerUtilities.createStringToken(20);
										let checkObject = {
											checkId: checkId,
											phoneNumber: userphoneNumber,
											protocol: protocol,
											url: url,
											method: method,
											successCodes: successCodes,
											timeoutSeconds: timeoutSeconds
										};

										//Store the objects to te database file
										lib.createfile('checks', checkId, checkObject, (err) => {
											if (!err) {
												//Add the checkId to the userData file
												userData.checkIDs = userCheckIds;
												userData.checkIDs.push(checkId);

												console.log(userData);

												//save the user Updated data
												lib.updatefile(
													'users',
													userphoneNumber,
													userData,
													(err) => {
														if (!err) {
															//Update the data
															callback(200, userData, {
																message: 'User Updated data successfully'
															});
														} else {
															callback(500, {
																error:
																	'Problem in the Server Side to Update the user data for checkId'
															});
														}
													}
												);
											} else {
												callback(500, {
													error: 'Problem in the Server Side'
												});
											}
										});
									} else {
										callback(403, {
											error: 'User has already reached maxCheckLimit'
										});
									}
								} else {
									callback(403, {
										error: 'Token Authentication problem'
									});
								}
							}
						);
					} else {
						callback(403, {
							error: 'User not Found'
						});
					}
				});
			} else {
				callback(403, {
					error: 'Authentication Problem'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Request Problem'
		});
	}
};

//GET Method (After Login in to the System- GET url Links)
checkHandler._Check.get = (requestProperties, callback) => {
	//check the checkId is valid for queryString
	const checkId =
		typeof requestProperties.queryStringObj.checkId === 'string' &&
		requestProperties.queryStringObj.checkId.trim().length === 20
			? requestProperties.queryStringObj.checkId
			: false;

	if (checkId) {
		//find the user by user's checkId
		lib.readfile('checks', checkId, (err, checkData) => {
			//makeing user Check String data to validate JSON Object data
			let userCheckData = handlerUtilities.parseJSON(checkData);

			console.log('UserCheckdata(JSONObject): ', userCheckData);

			if (!err && userCheckData) {
				// Verify : (phoneNumber & tokenId) have to matched
				//user Send tokenId by 'Headers' at GET Request (Login)
				let token =
					typeof requestProperties.headersObj.token === 'string'
						? requestProperties.headersObj.token
						: false;
				let phoneNumber = userCheckData.phoneNumber;
				tokenVerifyHandler._Token.VerifyToken(token, phoneNumber, (tokenId) => {
					if (tokenId) {
						callback(200, userCheckData, {
							message: 'User Check GET Request Successful'
						});
					} else {
						callback(403, {
							error: 'Authentication Failed'
						});
					}
				});
			} else {
				callback(404, {
					error: 'Token not Found'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Requested Check Id not Found'
		});
	}
};

//PUT Method (After Login in to the System- Update url Links)
checkHandler._Check.put = (requestProperties, callback) => {
	//check the checkId is valid for bodry property

	const checkId =
		typeof requestProperties.body.checkId === 'string' &&
		requestProperties.body.checkId.trim().length === 20
			? requestProperties.body.checkId
			: false;

	//validate Inputs
	const allProtocols = ['http', 'https'];
	const allMethods = ['post', 'get', 'put', 'delete'];

	let protocol =
		typeof requestProperties.body.protocol === 'string' &&
		allProtocols.indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false;

	let url =
		typeof requestProperties.body.url === 'string' &&
		requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false;

	let method =
		typeof requestProperties.body.method === 'string' &&
		allMethods.indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false;

	//typeof(Array[]) = 'Object';
	//Array[] instanceof Array = 'true'
	let successCodes =
		typeof requestProperties.body.successCodes === 'object' &&
		requestProperties.body.successCodes instanceof Array
			? requestProperties.body.successCodes
			: false;

	let timeoutSeconds =
		typeof requestProperties.body.timeoutSeconds === 'number' &&
		requestProperties.body.timeoutSeconds % 1 === 0 &&
		requestProperties.body.timeoutSeconds >= 1 &&
		requestProperties.body.timeoutSeconds <= 5
			? requestProperties.body.timeoutSeconds
			: false;
	if (checkId) {
		//Have to update any field
		if (protocol || url || method || successCodes || timeoutSeconds) {
			//Have to verify the token by tokenVerifyHandler
			lib.readfile('checks', checkId, (err, checkData) => {
				//makeing user Check String data to validate JSON Object data
				let userCheckData = handlerUtilities.parseJSON(checkData);

				console.log('UserCheckdata(JSONObject): ', userCheckData);

				if (!err && userCheckData) {
					// Verify : (phoneNumber & tokenId) have to matched
					//user Send tokenId by 'Headers' at GET Request (Login)
					let token =
						typeof requestProperties.headersObj.token === 'string'
							? requestProperties.headersObj.token
							: false;

					//Verify token with phoneNumber
					let phoneNumber = userCheckData.phoneNumber;

					tokenVerifyHandler._Token.VerifyToken(
						token,
						phoneNumber,
						(tokenId) => {
							if (tokenId) {
								//Have to update at least 1 properties
								if (protocol) {
									userCheckData.protocol = protocol;
								}
								if (url) {
									userCheckData.url = url;
								}
								if (method) {
									userCheckData.method = method;
								}
								if (successCodes) {
									userCheckData.successCodes = successCodes;
								}
								if (timeoutSeconds) {
									userCheckData.timeoutSeconds = timeoutSeconds;
								}
								//Update data & store to user datafile
								lib.updatefile('checks', checkId, userCheckData, (err) => {
									if (!err) {
										callback(200, userCheckData, {
											message: 'User Updated Successfully'
										});
									} else {
										callback(500, {
											error: 'Error in the Server Side at PUT Request'
										});
									}
								});
							} else {
								callback(403, {
									error: 'Authentication Error at PUT Request'
								});
							}
						}
					);
				} else {
					callback(500, {
						error: 'Problem in the Server Side at PUT request'
					});
				}
			});
		} else {
			callback(400, {
				error: 'Have to provide at list 1 field to Update'
			});
		}
	} else {
		callback(400, {
			error: 'Request Problem'
		});
	}
};

//DELETE Method (After Login in to the System- Delete url Links)
checkHandler._Check.delete = (requestProperties, callback) => {
	//check the checkId is valid for queryString
	const checkId =
		typeof requestProperties.queryStringObj.checkId === 'string' &&
		requestProperties.queryStringObj.checkId.trim().length === 20
			? requestProperties.queryStringObj.checkId
			: false;

	if (checkId) {
		//find the user by user's checkId
		lib.readfile('checks', checkId, (err, checkData) => {
			//makeing user Check String data to validate JSON Object data
			let userCheckData = handlerUtilities.parseJSON(checkData);

			console.log('UserCheckdata(JSONObject): ', userCheckData);

			if (!err && userCheckData) {
				// Verify : (phoneNumber & tokenId) have to matched
				//user Send tokenId by 'Headers' at GET Request (Login)
				let token =
					typeof requestProperties.headersObj.token === 'string'
						? requestProperties.headersObj.token
						: false;
				let phoneNumber = userCheckData.phoneNumber;
				tokenVerifyHandler._Token.VerifyToken(token, phoneNumber, (tokenId) => {
					if (tokenId) {
						//Delete the checkId's Data
						lib.deletefile('checks', checkId, (err) => {
							if (!err) {
								//find the phoneNumber of the checkId
								let phoneNumber = userCheckData.phoneNumber;

								lib.readfile('users', phoneNumber, (err, checkData) => {
									//makeing user Check String data to validate JSON Object data
									let userCheckData = handlerUtilities.parseJSON(checkData);

									console.log('UserCheckdata(JSONObject): ', userCheckData);

									if (!err && userCheckData) {
										let userCheckIds =
											typeof userCheckData.checkIDs === 'object' &&
											userCheckData.checkIDs instanceof Array
												? userCheckData.checkIDs
												: [];

										//remove the deleted check ID from the user's checkIds list, Array[]
										let checkIdsPosition = userCheckIds.indexOf(checkId);

										if (checkIdsPosition > -1) {
											//Remove = splice(position,numOFElement) -> overwrite the orginal Array
											userCheckIds.splice(checkIdsPosition, 1);

											//Resave the user Datafile
											userCheckData.checkIDs = userCheckIds;

											//Update the user file(for remove the checkId in user Data file)
											lib.updatefile(
												'users',
												phoneNumber,
												userCheckData,
												(err) => {
													if (!err) {
														callback(200, {
															message:
																"CheckId file Deleted Successfully && User Data file's [checkId] remove Successfully"
														});
													} else {
														callback(500, {
															error:
																'User Data file Update Faild after removing the checkId'
														});
													}
												}
											);
										} else {
											callback(500, {
												error: 'The checkId  not found at the List'
											});
										}
									} else {
										callback(500, {
											error:
												'Server side problem at DELETE request to find the phoneNumber'
										});
									}
								});
							} else {
								callback(500, {
									error: 'User checks Data Not deleted'
								});
							}
						});
					} else {
						callback(403, {
							error: 'Authentication Failed at DELETE request'
						});
					}
				});
			} else {
				callback(404, {
					error: 'Token not Found at DELETE request'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Requested Check Id not Found at DELETE request'
		});
	}
};

// Object Module Export --------------------------------
module.exports = checkHandler;
