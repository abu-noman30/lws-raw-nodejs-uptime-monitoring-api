/*
 * Title: Sample Handler
 * Description: Sample Route Handler
 * Author: Md. Abu Noman
 * Date:  25- May-2022
 *
 */

//Sample Handler Object - module scaffolding
const sampleHandler = {};

sampleHandler.handler = (requestProperties, callback) => {
	console.log('Request Prop: ', requestProperties);
	callback(200, {
		message: 'This is a Sample Handler url Request'
	});
	//console.log('Sample Handler');
};

// Object Module Export --------------------------------
module.exports = sampleHandler;
