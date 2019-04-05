/*
*
* CLI - Related tasks
*
*
*
*/

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const _data = require('./data');
const helpers = require('./helpers');

// Instantiate the CLI module object
const cli = {};

// Input handlers
e.on('man', (str)=>{
	cli.responders.help();
});

e.on('help', (str)=>{
	cli.responders.help();
});
e.on('exit', (str)=>{
	cli.responders.exit();
});
e.on('list menu', (str)=>{
	cli.responders.listMenu();
});
e.on('list orders', (str)=>{
	cli.responders.listOrders();
});
e.on('more order info', (str)=>{
	cli.responders.moreOrderInfo(str);
});
e.on('list users', (str)=>{
	cli.responders.listUsers();
});
e.on('more user info', (str)=>{
	cli.responders.moreUserInfo(str);
});

// Responders object
cli.responders = {};

// Help / man
cli.responders.help = ()=>{
	const commands = {
		'exit': 'Kill the CLI (and the rest of the application)',
		'man': 'Show this help page',
		'help': 'Alias of the "man" command',
		'list menu': 'Show a list of all the available items from the menu',
		'list orders': 'Show a list of all the orders in the last 24 hour',
		'more order info --{orderId}': 'Show the details of a specified order',
		'list users': 'Show a list all of the users registered in the last 24 hour',
		'more user info --{userEmail}': 'Show details of a specified user'
	};
	// Show header for the help page that is as wide as the screen
	cli.horizontalLine();
	cli.centered('CLI MANUAL');
	cli.horizontalLine();
	cli.verticalSpace(2);

	// Show each command. Followed by it's explanation in white and yellow respectively
	for(let key in commands){
		if(commands.hasOwnProperty(key)){
			let value = commands[key];
			let line = '\x1b[33m'+key+'\x1b[0m';
			let padding = 50 - line.length;
			for(i=0;i<padding;i++){
				line+=' ';
			};
			line+=value;
			console.log(line);
			cli.verticalSpace();
		}
	};
	cli.verticalSpace();
	// End with another horizontalline
};

// Exit
cli.responders.exit = ()=>{
	process.exit(0);
}

// List menu
cli.responders.listMenu = ()=>{
	_data.read('menu', 'menu', (err, menuData)=>{
		if(!err && menuData){
			cli.verticalSpace();
			menuData.pizza.forEach((item)=>{
				let line = `Id: ${item.id}; Name: ${item.name}; Ingredients: ${item.description}; Price: ${item.price}`;
				console.log(line);
				cli.verticalSpace();
			})
			// console.log(menuData.pizza);
		}
	})
};

// List orders
cli.responders.listOrders = ()=>{
	_data.list('orders', (err, orderIds)=>{
		if(!err && orderIds && orderIds.length > 0){
			cli.verticalSpace();
			orderIds.forEach((orderId)=>{
				_data.read('orders', orderId, (err, orderData)=>{
					// If the differnce between the create-date and today's date is bigger than 24hour, do not show 
					if(!err && orderData && (Date.now() - orderData.date) < 86400000){
						let line = `Id: ${orderData.id}; Customer Email: ${orderData.userEmail}; Price: ${orderData.price}; Date: ${orderData.date}; Items: ${orderData.items.length}`;
						console.log(line);
						cli.verticalSpace();
					}
				})
			})
		}
	})
};

// More order info
cli.responders.moreOrderInfo = (str)=>{
	// Get the id from the string
	const arr = str.split('--');
	const orderId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1] : false;
	if(orderId){
		// Lookup the order
		_data.read('orders', orderId, (err, orderData)=>{
			if(!err && orderData){
				if(!err && orderData){
					// Print the JSON with text highlighting
					cli.verticalSpace();
					console.dir(orderData, {'colors': true});
					cli.verticalSpace();
				}
			}
		})
	}
};

// List users
cli.responders.listUsers = ()=>{
	_data.list('users', (err, userIds)=>{
		if(!err && userIds && userIds.length > 0){
			cli.verticalSpace();
			userIds.forEach((userId)=>{
				_data.read('users', userId, (err, userData)=>{
					// If the differnce between the singup-date and today's date is bigger than 24hour, do not show
					if(!err && userData && (Date.now() - userData.signupDate) < 86400000){
						let line = `Name: ${userData.firstName} ${userData.lastName}; Email: ${userData.email};`;
						console.log(line);
						cli.verticalSpace();
					}
				})
			})
		}
	})
};

// More user info
cli.responders.moreUserInfo = (str)=>{
	// Get the id from the string
	const arr = str.split('--');
	const userEmail = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1] : false;
	if(userEmail){
		// Lookup the user
		_data.read('users', userEmail, (err, userData)=>{
			if(!err && userData){
				// Remove the hashed password
				delete userData.hashedPassword;
				// Print the JSON with text highlighting
				cli.verticalSpace();
				console.dir(userData, {'colors': true});
				cli.verticalSpace();
			}
		})
	}
};


// Create a vertical space
cli.verticalSpace = (lines)=>{
	lines = typeof(lines) === 'number' && lines > 0 ? lines : 1;
	for(i=0;i<lines;i++){
		console.log('');
	};
};

// Create a horizontal line across the screen
cli.horizontalLine = ()=>{
	// Get the available screen size
	const width = process.stdout.columns;
	let line = '';
	for(i=0;i<width;i++){
		line+='-';
	};
	console.log(line);
};

// Create a cetered text on the screen
cli.centered = (str)=>{
	str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : '';
	// Get the available screen size
	const width = process.stdout.columns;
	// Calculate the left padding
	const leftPadding = Math.floor((width - str.length) / 2);
	// Put in the left padded spaces before the string itself
	let line = '';
	for(i=0;i<leftPadding;i++){
		line+=' ';
	};
	line+=str;
	console.log(line);
};


// Input processor
cli.processInput = (str)=>{
	str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : false;
	// Only process the input if the user actually wrote something. Otherwise ignore it
	if(str){
		// Codify the unique strings that indetify the questions allowed to be asked
		const uniqueInputs = [
			'man',
			'help',
			'exit',
			'list menu',
			'list orders',
			'more order info',
			'list users',
			'more user info'
		];

		// Go trough the possible inputs, emit an event when a match is found
		let matchFound = false;
		uniqueInputs.some((input)=>{
			if(str.toLowerCase().indexOf(input) > -1){
				matchFound = true;
				// Emit and event matching the unique input, and include the full string given by the user
				e.emit(input, str);
				return true;
			}
		});
		// If no match is found, tell the user to try again
		if(!matchFound){
			console.log('Sorry, try again!');
		}
	}
};

// Init script
cli.init = ()=>{
	// Send the starts message to the console in dark blue
	console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');
	// Start the interface
	const _interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '#'
	});
	// Create an initial prompt
	_interface.prompt();

	// Handel each line of the input seperately
	_interface.on('line', (str)=>{
		// Send to the input processor
		cli.processInput(str);

		// Re-initialize the prompt afterwards
		_interface.prompt();
	});
	// if the user stops the CLI, kill the associated process
	_interface.on('close', ()=>{
		process.exit(0);
	});
};


// Export the module
module.exports = cli;