/*
 * Title: Not Found Handler
 * Description: Not Found Handler
 * Author: Md. Abu Noman
 * Date:  25- May-2022
 *
 */

//Sample Handler Object - module scaffolding
const notfoundHandler = {};

notfoundHandler.handler = (requestProperties, callback) => {
	callback(404, {
		message: 'URL not Founded....'
	});
	//console.log('Sample Handler');
};

// Object Module Export --------------------------------
module.exports = notfoundHandler;
