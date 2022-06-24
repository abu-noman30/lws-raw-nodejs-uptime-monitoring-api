/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Md. Abu Noman
 * Date: 25-May-2022
 *
 */

// Dependencies

// App Object - Module - scaffolding
const environment = {};

// Environment Object Declarations
environment.staging = {
	PORT: 3000,
	envName: 'staging',
	secretKey: 'gdgdgdggdgdgd',
	maxCheckLimit: 5,
	twilio: {
		fromPhone: '+19785612155',
		accountSid: 'ACa2510076dccb5fa016f4ecaeb69ee9b8',
		authToken: '9c02bc881a661208057c933b88b05a0d'
	}
};
environment.production = {
	PORT: 4000,
	envName: 'production',
	secretKey: 'bsbsbsbbsbsbs',
	maxCheckLimit: 5,
	twilio: {
		fromPhone: '+19785612155',
		accountSid: 'ACa2510076dccb5fa016f4ecaeb69ee9b8',
		authToken: '9c02bc881a661208057c933b88b05a0d'
	}
};

//Determine the Environment which was passed
const currentEnvironment =
	typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Export Corresponding Environment Object
const Env =
	typeof environment[currentEnvironment] === 'object'
		? environment[currentEnvironment]
		: environment.staging;

// Export Module Object
module.exports = Env;
