/*
*
* Server-related tasks
*
*
*
*/


// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');


// Instantiate the server module object
const server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req, res)=>{
	server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
	'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, reqs)=>{
	server.unifiedServer(req, res);
});

// All the server logic for both http and https server
server.unifiedServer = (req, res)=>{
	// Get the url and parse it
	const parsedUrl = url.parse(req.url, true);

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the http method
	const method = req.method.toLowerCase();

	//Get the header as an object
	const headers = req.headers;

	// Get the payload, if any
	const decoder = new StringDecoder('utf8');
	let buffer = '';
	req.on('data', (data)=>{
		buffer += decoder.write(data);
	});
	req.on('end', ()=>{
		buffer += decoder.end();

		// Choose the handler this request should go to. If one is not found, use the notFound handler
		let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

		// if the request is within the public directory, use the public handler instead
		chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

		// Construct the data object to send to the handler
		let data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			'payload': helpers.parseJSONToObject(buffer)
		};
		// Route the request to the handler specified in the router
		chosenHandler(data, (statusCode, payload, contentType)=>{
			// Determine the type of resopnse (fallback to json)
			contentType = typeof(contentType) === 'string' ? contentType : 'json';

			// use the status code called back by the handler, or default to 200
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

			// Return the response-parts that are content-specific
			let payloadString = '';
			if(contentType === 'json'){
				res.setHeader('Content-Type', 'application/json');
				// use the payload called back by the handler, or default an empty object
				payload = typeof(payload) === 'object' ? payload : {};
				payloadString = JSON.stringify(payload);
			};
			if(contentType === 'html'){
				res.setHeader('Content-Type', 'text/html');
				payloadString = typeof(payload) === 'string' ? payload : '';
			};
			if(contentType === 'css'){
				res.setHeader('Content-Type', 'text/css');
				// use the payload called back by the handler, or default an empty object
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			};
			if(contentType === 'png'){
				res.setHeader('Content-Type', 'image/png');
				// use the payload called back by the handler, or default an empty object
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType === 'jpg'){
				res.setHeader('Content-Type', 'image/jpeg');
				// use the payload called back by the handler, or default an empty object
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType === 'plain'){
				res.setHeader('Content-Type', 'text/plain');
				// use the payload called back by the handler, or default an empty object
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			// Return the response-parts that are common to all content-types
			res.writeHead(statusCode);
			res.end(payloadString);

			// If the response is 200, print green, otherwise print red
			if(statusCode === 200){
				debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			} else {
				debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			}
		});
	});
};


// Define a request router
server.router = {
	'': handlers.index,
	'account/create': handlers.accountCreate,
	'account/edit': handlers.accountEdit,
	'account/deleted': handlers.accountDeleted,
	'account/menu': handlers.menuList,
	'account/listShoppingcart': handlers.listShoppingcart,
	'session/create': handlers.sessionCreate,
	'api/users': handlers.users,
	'api/tokens': handlers.tokens,
	'api/menu': handlers.menu,
	'api/shoppingcart': handlers.shoppingcart,
	'api/order': handlers.order,
	'ping': handlers.ping,
	'public': handlers.public
};

// Init the script
server.init = ()=>{
	// Start the http server
	server.httpServer.listen(3000, ()=>{
		console.log('\x1b[36m%s\x1b[0m', `The server is started on port ${config.httpPort} in ${config.envname} mode now`);
	});

	// Start the https server
	server.httpsServer.listen(3001, ()=>{
		console.log('\x1b[36m%s\x1b[0m', `The server is started on port ${config.httpsPort} in ${config.envname} mode now`);
	})
}

// Export the server
module.exports = server;


