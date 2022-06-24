/*
 * Title: Routes
 * Description: Application Roures
 * Author: Md. Abu Noman
 * Date: 25-May-2022
 *
 */

//Dependencies
const sampleHandler = require('../Handlers/RouteHandler/sampleRouteHandler');
const aboutHandler = require('../Handlers/RouteHandler/aboutRouterHandler');
const userHandler = require('../Handlers/RouteHandler/userRouterHandler');
const tokenVerifyHandler = require('../Handlers/RouteHandler/tokenVerifyRouteHandler');
const checkSystemMonitorHandler = require('../Handlers/RouteHandler/checkSystemMonitorHandler');

//Routes Object - Module - scaffolding
const routes = {
	sample: sampleHandler.handler, // (statuscode,paylod)
	about: aboutHandler.handler,
	user: userHandler.handler, //User CRUD(POST,GET,PUT,DELETE)
	token: tokenVerifyHandler.handler, // User Authentication
	check: checkSystemMonitorHandler.handler
};

// Object Module Export --------------------------------

module.exports = routes;
