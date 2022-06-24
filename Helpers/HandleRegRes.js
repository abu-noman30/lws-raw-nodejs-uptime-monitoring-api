/*
 * Title: Handle Request and Response.
 * Description: Handle Request and Response.
 * Author: Md. Abu Noman
 * Date:  24- May- 2022
 *
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../Routes/routes');
const notfoundHandler = require('../Handlers/RouteHandler/notfoundRouterHandler');
const handlerUtilities = require('../Helpers/HandlerUtilities');

// App Object - Module - scaffolding
const handler = {};

//Handler on CreateServer (Request , Response)
handler.hendleReqRes = (req, res) => {
	//Request handle............
	// get the url and Parse it
	const parseUrl = url.parse(req.url, true);
	console.log(parseUrl);

	const Path = parseUrl.pathname;
	const trimPath = Path.replace(/^\/+|\/+$/g, '');
	console.log(trimPath);

	const method = req.method.toLowerCase();
	const queryStringObj = parseUrl.query;
	const headersObj = req.headers;
	console.log(headersObj);

	//Body/Payload Data(JSON data) - convert to string data.(For POST Request)
	const decoder = new StringDecoder('utf-8');
	let realData = '';

	//JSON - String data stored in realData
	req.on('data', (buffer) => {
		realData += decoder.write(buffer);
	});

	// request Properties of ChosenHandler() callback function..
	const requestProperties = {
		parseUrl,
		Path,
		trimPath,
		method,
		queryStringObj,
		headersObj
	};

	//Chosing the Handler fuunction by matching trimpath in to routes file.....
	const chosenHandler = routes[trimPath]
		? routes[trimPath]
		: notfoundHandler.handler; //about=(){}/sample()

	console.log('chosenHandler :', chosenHandler);

	req.on('end', () => {
		realData += decoder.end();
		console.log(realData);

		//sending realData as a property of  requestProperties....
		requestProperties.body = handlerUtilities.parseJSON(realData);
		console.log('requestProperties.body: ', requestProperties.body);

		//Calling the chosenHandler and passing the properties
		chosenHandler(requestProperties, (statusCode, payload) => {
			statusCode = typeof statusCode === 'number' ? statusCode : '500';
			payload = typeof payload === 'object' ? payload : {};

			let payloadString = JSON.stringify(payload); //Request Body(Postman) = payload

			//return the final response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		});
	});
};

// Object Module Export --------------------------------
module.exports = handler;
