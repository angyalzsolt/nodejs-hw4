/*
*
*
* Helpers for various tasks
*
*
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const querystring = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');


// Contatiner for all the helpers
let helpers = {};


// Verify the email address
helpers.verifyEmail = (email)=>{
	let re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

// Verify the card number
helpers.verifyCard = (card)=>{
	let re = /^[\d\s]+$/;
	return re.test(card) && ['4242 4242 4242 4242', '4000 0566 5566 5556', '5555 5555 5555 4444'].indexOf(card) > -1;
}


// Create a SHA256 for all the helpers
helpers.hash = (str)=>{
	if(typeof(str) === 'string' && str.length > 0){
		let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	};
};


// Parse a JSON string to an object in all cases, without throwing an error
helpers.parseJSONToObject = (str)=>{
	try {
		let obj = JSON.parse(str);
		return obj;
	} catch(e){
		return {};
	};
};



// Create a string of random alphanumeric character of a given length
helpers.createRandomString = (strLength)=>{
	strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
	if(strLength){
		// Define all the possible characters that could go into a string
		const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

		// start the final string
		let str = '';

		for(let i=0; i<strLength; i++){
			// Get random characters from the possibleCharacters string
			let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			// Append this character to the final string
			str+=randomCharacter;
		};
		// Return the final string
		return str;
	} else {
		return false;
	};
};


// Send an order via Stripe
helpers.sendStripeOrder = (email, amount, callback)=>{
	// Validate the parameters
	email = typeof(email) === 'string' && helpers.verifyEmail(email) ? email : false;
	amount = typeof(amount) === 'number' ? amount * 100 : false;
	if(email && amount){
	// Configure the order object
	let chargeObject = {
		'amount': amount,
		'currency': 'usd',
		'source': 'tok_amex',
		'description': `Charge for ${email}`,
		'receipt_email': email
	};
	// Stringify the order object
	let stringChargeObject = querystring.stringify(chargeObject);

	// Configure the request detail
	let requestDetails = {
		'protocol': 'https:',
		'hostname':'api.stripe.com',
		'method': 'POST',
		'path': '/v1/charges',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${config.stripeKey}`
		}
	};

	// Instantiate the request object
	let req = https.request(requestDetails, (res)=>{
		// Grab the status of the sent request
		let status = res.statusCode;

		let buffer = [];	
	   	res.on("data",  (data) => {
		  buffer.push(data);
		});


		res.on("end",  () => {
			let body = Buffer.concat(buffer);
			if(status == 200 || status == 201){
		  		callback(status, {'Response': JSON.parse(body.toString()).receipt_url});
			} else {
				callback(status,{'Status code returned was ': status});
			}
		})
});


	// Bind to the erro event, so it doesn't get thrown
	req.on('error', (e)=>{
		callback(e);
	});
	// Add the chargeObject
	req.write(stringChargeObject);
	// End the request
	req.end();

  } else {
    callback('Given parameters were missing or invalid')
  }
}

// Send email to the user via 
helpers.sendMailgunEmail = (email, receiptUrl, callback)=>{
	// Get the receipt url from the object
	let url = receiptUrl.Response;
	//Validate parameters
	email = typeof(email) === 'string' && helpers.verifyEmail(email) ? email : false;
	url = typeof(url) === 'string' ? url : false;

	if(email && url){
		// Configure the request payload
		const payload = {
			'from': 'pizza.company@sandbox529f692b7927443f8571c9a556f2bab7.mailgun.org',
			'to': 'angyal.zsolt.gyula@gmail.com',
			'subject': 'Verify your order',
			'html': `<h2>Your payment from ${email} address has been accepted</h2><p>Check your receipt <a href='${url}'>here</a><p>`
		};
		//Stringify the request object
		const stringPayload = querystring.stringify(payload);

		// Configure the request details
		const requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.mailgun.net',
			'method': 'POST',
			'path': '/v3/sandbox529f692b7927443f8571c9a556f2bab7.mailgun.org/messages',
			'auth': 'api:'+config.mailgunKey,
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload)
			}
		}
		// Instantiate the request object
		let req = https.request(requestDetails, (res)=>{
			// Grab the status of the sent request
			const status = res.statusCode;
			// Callback successfully if the request went through
			if ([200, 201].indexOf(status) == -1) {
			  callback(status, { 'Error': 'Status code returned was ' + status })
			}
			// Returning 301
			let buffer = []
			res.on("data",  (data) => {
			  buffer.push(data)
			})
			res.on("end",  () => {
			  let body = Buffer.concat(buffer);
			  if(status == 200 || status == 201){
			  	callback(status, { 'Response': JSON.parse(body.toString())})
			  } else {
			  	callback(status,{'Status code returned was ': status});
			  }
			})
			})

			req.on('error',  (e) => {
				callback(400, {'The error is here': e})
			})

			// Add payload to the request
			req.write(stringPayload)

			req.end()
	} else {
		callback('Given parameters were missing or invalid');
	}
};


// Get the string content of a template
helpers.getTemplate = (templateName, data, callback)=>{
	templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : false;
	data = typeof(data) === 'object' && data !== null ? data : {};
	if(templateName){
		const templatesDir = path.join(__dirname, '/../templates/');
		fs.readFile(templatesDir+templateName+'.html', 'utf8', (err, str)=>{
			if(!err && str && str.length > 0){
				// Do the interpolation on the string
				const finalString = helpers.interpolate(str, data);
				callback(false, finalString);
			} else {
				callback('No template could be found');
			}
		})
	} else {
		callback('A valid template name was not specified');
	}
};


// Add the universal header and footer, and pass the provided data object to the header and the footer for interpolation
helpers.addUniversalTemplates = (str, data, callback)=>{
	str = typeof(str) === 'string' && str.length > 0 ? str : '';
	data = typeof(data) === 'object' && data !== null ? data : {};
	// Get the header
	helpers.getTemplate('_header', data, (err, headerString)=>{
		if(!err && headerString){
			// Get the footer
			helpers.getTemplate('_footer', data, (err, footerString)=>{
				if(!err && footerString){
					// Add them all together
					const fullString = headerString+str+footerString;
					callback(false, fullString);
				} else {
					callback('Could not find the footer object');
				}
			});
		} else {
			callback('Could not find the header object');
		}
	})
}


// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data)=>{
	str = typeof(str) === 'string' && str.length > 0 ? str : '';
	data = typeof(data) === 'object' && data !== null ? data : {};

	// Add the templateGlobals to the data object, prepending their key name with the 'global'
	for(let keyName in config.templateGlobals){
		if(config.templateGlobals.hasOwnProperty(keyName)){
			data['global.'+keyName]=config.templateGlobals[keyName];
		};
	};

	// For each key in the data object, insert it's value into the string at the corresponding placeholder
	for(let key in data){
		if(data.hasOwnProperty(key) && typeof(data[key]) === 'string'){
			let replace = data[key];
			let find = '{'+key+'}';
			str = str.replace(find, replace);
		};
	};
	return str;
}

// Get the assests of a static (public) asset
helpers.getStaticAsset = (fileName, callback)=>{
	fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false;
	if(fileName){
		const publicDir = path.join(__dirname, '/../public/');
		fs.readFile(publicDir+fileName, (err, data)=>{
			if(!err && data){
				callback(false, data);
			} else {
				callback('No file could be found');
			}
		})
	} else {
		callback('A valid file name was not provided');
	}
};






// Export the module
module.exports = helpers;