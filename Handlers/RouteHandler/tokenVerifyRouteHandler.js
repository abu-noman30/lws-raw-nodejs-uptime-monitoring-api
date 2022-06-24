/*
 * Title: Token Verify Handler
 * Description: Generate Random Token for User Authentication
 * Author: Md. Abu Noman
 * Date: 16-June-2022
 *
 */

//Dependencies
const lib = require('../../Library/data');
const handlerUtilities = require('../../Helpers/HandlerUtilities');

//about Handler Object - module scaffolding
const tokenVerifyHandler = {};

tokenVerifyHandler.handler = (requestProperties, callback) => {
	//checking the validate method [GET,POST,PUT,DELETE]
	const acceptedMethods = ['get', 'post', 'put', 'delete'];
	console.log(requestProperties);

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		//if Method match call Method functon()---userHandler.Method[get/post/put/delete]()
		tokenVerifyHandler._Token[requestProperties.method](
			requestProperties,
			callback
		);
	} else {
		callback(405, {
			message: `${requestProperties.method} Method not found`
		});
	}
};

//userMethod Handler Object - module scaffolding that define the Method match call functon()
tokenVerifyHandler._Token = {
	//get,
	//post,
	//put,
	//delete
};

//POST Method
tokenVerifyHandler._Token.post = (requestProperties, callback) => {
	//POST (phoneNumber & Password) for Login........
	const phoneNumber =
		typeof requestProperties.body.phoneNumber === 'string' &&
		requestProperties.body.phoneNumber.trim().length === 11
			? requestProperties.body.phoneNumber
			: false;
	const password =
		typeof requestProperties.body.password === 'string' &&
		requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;

	if (phoneNumber && password) {
		//check the User phoneNumber & Password combination is Correct or Not
		lib.readfile('users', phoneNumber, (err, user) => {
			console.log('Userdata(String): ', user);

			let hashpassword = handlerUtilities.hashpassword(password);

			//makeing user String data to validate JSON Object data
			let userData = handlerUtilities.parseJSON(user);
			console.log('Userdata(JSONObject): ', userData);

			if (hashpassword === userData.password) {
				//Generate a Random Token for Authentication by passing(token Length)

				let tokenID = handlerUtilities.createStringToken(20);
				let expireTime = Date.now() + 5 * 60 * 60 * 1000;

				const tokenObject = {
					phoneNumber: phoneNumber,
					tokenId: tokenID,
					expireTime: expireTime
				};
				// Store token in token Data file
				lib.createfile('tokens', tokenID, tokenObject, (err) => {
					if (!err) {
						callback(200, tokenObject, {
							message: 'Token Generated Successfully'
						});
					} else {
						callback(400, {
							error: 'Token Generating Problem in server Side'
						});
					}
				});
			} else {
				callback(400, {
					error: 'Password not Matched'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Phonenumber OR Password wrong!'
		});
	}
};

//GET Method -> (User Authentication)
tokenVerifyHandler._Token.get = (requestProperties, callback) => {
	//check the tokenId valid for queryString
	console.log('Query_StringObj: ', requestProperties.queryStringObj.tokenId);

	const tokenId =
		typeof requestProperties.queryStringObj.tokenId === 'string' &&
		requestProperties.queryStringObj.tokenId.trim().length === 20
			? requestProperties.queryStringObj.tokenId
			: false;
	console.log('Query_StringObj_tokenId: ', tokenId);
	if (tokenId) {
		//find the user by user's tokenId'
		lib.readfile('tokens', tokenId, (err, tokendata) => {
			console.log('Userdata(String): ', tokendata);

			//makeing user String data to validate JSON Object data
			let userTokenData = handlerUtilities.parseJSON(tokendata);

			//const userTokenData = { ...parseJSON(tokendata) };
			console.log('Userdata(JSONObject): ', userTokenData);

			if (!err && userTokenData) {
				callback(200, userTokenData, {
					message: 'GET Token Data successfully'
				});
			} else {
				callback(404, {
					error: 'Token not Found'
				});
			}
		});
	} else {
		callback(404, {
			error: 'Requested Token Data not Found'
		});
	}
};

//PUT Method -> (User Authentication)
tokenVerifyHandler._Token.put = (requestProperties, callback) => {
	//check the tokenId & expireTime is valid for body properties

	const tokenId =
		typeof requestProperties.body.tokenId === 'string' &&
		requestProperties.body.tokenId.trim().length === 20
			? requestProperties.body.tokenId
			: false;

	const expireTime =
		typeof requestProperties.body.expireTime === 'boolean' &&
		requestProperties.body.expireTime === true
			? true
			: false;

	if (tokenId && expireTime) {
		//Check the token is available or not

		lib.readfile('tokens', tokenId, (err, tokendata) => {
			//makeing token String data to validate JSON Object data
			let userTokenData = handlerUtilities.parseJSON(tokendata);
			if (!err && userTokenData.expireTime > Date.now()) {
				// Increase the token expiration time
				userTokenData.expireTime = Date.now() + 2 * 60 * 60 * 1000;

				//Store the updated data
				lib.updatefile('tokens', tokenId, userTokenData, (err) => {
					if (!err) {
						callback(500, {
							message: 'Expire Time updated Successfully'
						});
					} else {
						callback(400, {
							error: 'Expire Time not updated Successfully'
						});
					}
				});
			} else {
				callback(400, {
					error: 'Token Already Expired'
				});
			}
		});
	} else {
		callback(400, {
			error: 'There was a problem in the request'
		});
	}
};

//DELETE Method -> (User Authentication)
tokenVerifyHandler._Token.delete = (requestProperties, callback) => {
	//check the tokenId is valid for body properties
	const tokenId =
		typeof requestProperties.queryStringObj.tokenId === 'string' &&
		requestProperties.queryStringObj.tokenId.trim().length === 20
			? requestProperties.queryStringObj.tokenId
			: false;

	if (tokenId) {
		//lookup the tokenfile is available or not
		lib.readfile('tokens', tokenId, (err, tokenData) => {
			if (!err && tokenData) {
				lib.deletefile('tokens', tokenId, (err) => {
					if (!err) {
						callback(200, { message: 'Token Data deleted successfully' });
					} else {
						callback(500, {
							error: 'Token Data Not deleted'
						});
					}
				});
			} else {
				callback(500, {
					error: 'Token not found'
				});
			}
		});
	} else {
		callback(400, {
			error: 'Requested User not Found'
		});
	}
};

//______________________________________________________________
//General Function() for VerifyToken
tokenVerifyHandler._Token.VerifyToken = (tokenId, phoneNumber, callback) => {
	// Verify the phoneNumber & tokenId is matched or Not
	lib.readfile('tokens', tokenId, (err, tokenData) => {
		if (!err && tokenData) {
			//makeing user String data to validate JSON Object data
			let userTokenData = handlerUtilities.parseJSON(tokenData);

			//Matching phoneNumber & tokenId
			if (
				userTokenData.phoneNumber === phoneNumber &&
				userTokenData.expireTime > Date.now()
			) {
				callback(true);
			} else {
				callback(false);
			}
		} else {
			callback(false);
		}
	});
};
//______________________________________________________________

// Object Module Export --------------------------------
module.exports = tokenVerifyHandler;
