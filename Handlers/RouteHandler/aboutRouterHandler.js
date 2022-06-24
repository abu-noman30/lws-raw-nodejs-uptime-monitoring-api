/*
 * Title: about Handler
 * Description: about Route Handler
 * Author: Md. Abu Noman
 * Date:  25- May-2022
 *
 */

//about Handler Object - module scaffolding
const aboutHandler = {};

aboutHandler.handler = (requestProperties, callback) => {
	callback(200, {
		message: 'This is a About Handler url Request'
	});
	console.log('About Handler');
};

// Object Module Export --------------------------------
module.exports = aboutHandler;
