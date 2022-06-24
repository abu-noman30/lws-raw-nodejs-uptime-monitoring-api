/*
 * Title: Notification Library (Twilio API Library)
 * Description: Function that Notify the users
 * Author: Md. Abu Noman
 * Date:  19- Jun- 2022
 *
 */

// Description: (Twilio always Prefere: HTTPS request)
const https = require('https');
const Env = require('../Environments/env');

//Object -Module scafolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
	// input validation
	const userPhone =
		typeof phone === 'string' && phone.trim().length === 11
			? phone.trim()
			: false;

	const userMsg =
		typeof msg === 'string' &&
		msg.trim().length > 0 &&
		msg.trim().length <= 1600
			? msg.trim()
			: false;

	if (userPhone && userMsg) {
		// configure the request payload
		const payload = {
			From: Env.twilio.fromPhone,
			To: `+88${userPhone}`,
			Body: userMsg
		};
		console.log(payload);

		// stringify the payload
		const stringifyPayload = JSON.stringify(payload);
		console.log(stringifyPayload);

		// configure the request details
		const requestDetails = {
			hostname: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/${Env.twilio.accountSid}/Messages.json`,
			auth: `${Env.twilio.accountSid}:${Env.twilio.authToken}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		// instantiate the request object
		const req = https.request(requestDetails, (res) => {
			// get the status of the sent request
			const status = res.statusCode;

			// callback successfully if the request went through
			if (status === 200 || status === 201) {
				callback(false);
			} else {
				console.log('Error:', status);
				callback(`Status code returned was ${status}`);
			}
		});

		req.on('error', (e) => {
			callback(e);
		});

		req.write(stringifyPayload);
		req.end();
	} else {
		callback('Given parameters were missing or invalid!');
	}
};

// export the module
module.exports = notifications;
