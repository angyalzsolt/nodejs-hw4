/*
*
*
* Request handlers
*
*
*/

// Dependenices
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const menu = require('./../.data/menu/menu');


// Define the handlers
let handlers = {};


/*
*
* HTML handlers
*
*
*
*/

// Index handlers
handlers.index = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Anytime, anywhere',
			'head.description': 'Order food whenever you are hungry',
			'body.class': 'loggedOut'
		};
		// Read in a template as a string
		helpers.getTemplate('index', templateData, (err, str)=>{
			if(!err && str){
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
						// Return the page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Create Account
handlers.accountCreate = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Create an accout',
			'head.description': 'Signup is easy and only takes a few seconds',
			'body.class': 'accountCreate'
		};

		// Read in a template as a string
		helpers.getTemplate('accountCreate', templateData, (err, str)=>{
			if(!err && str){
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
						// Return the page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				})
			} else {
				callback(500, undefined, 'html');
			}
		})
	} else {
		callback(405, undefined, 'html');
	}
}

// Edit your account
handlers.accountEdit = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Prepare for interpolation
		let templateData = {
			'head.title': 'Account Settings',
			'body.class': 'accountEdit'
		};

		// Read in a template as a string
		helpers.getTemplate('accountEdit', templateData, (err, str)=>{
			if(!err  && str){
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
						// Return the page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				})
			} else {
				callback(500, undefined, 'html');
			}
		})
	} else {
		callback(405, undefined, 'html');
	}
};

// Account has been deleted
handlers.accountDeleted = (data, callback)=>{
	// Reject any request that isn't a get
	if(data.method === 'get'){
		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Account Deleted',
			'head.descrription': 'Your account has been deleted',
			'body.class': 'accountDeleted'
		};
		// Read in a template as a string
		helpers.getTemplate('accountDeleted', templateData, (err, str)=>{
			if(!err && str){
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
							// Return the page as HTML
							callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				})
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
}

// Create New Session
handlers.sessionCreate = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){

		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Login to your account',
			'head.description': 'Please enter your phone number and password to access your account.',
			'body.class': 'sessionCreate'
		};

		// Read in a template as a string
		helpers.getTemplate('sessionCreate', templateData, (err, str)=>{
			if(!err && str){
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
						// Return the page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html')
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		})
	} else {
		callback(405, undefined, 'html');
	}
};

// // Session has been deleted
// handlers.sessionDeleted = (data, callback)=>{
// 	// Reject any request that isn't a GET
// 	if(data.method === 'get'){
// 		// Prepare data for interpolation
// 		let templateData = {
// 			'head.title': 'Logged out',
// 			'head.description': 'You have been logged out of your account.'
// 		};

// 		// Read in a template as a string
// 		helpers.getTemplate('sessionDeleted', templateData, (err, str)=>{
// 			if(!err && str){
// 				// Add the universal header and footer
// 				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
// 					if(!err && str){
// 						// Return the page as HTML
// 						callback(200, str, 'html');
// 					} else {
// 						callback(500, undefined, 'html')
// 					}
// 				});
// 			} else {
// 				callback(500, undefined, 'html');
// 			}
// 		})
// 	} else {
// 		callback(405, undefined, 'html');
// 	}
// };

// Dashboard (view all items)
handlers.menuList = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Menu',
			'head.description': 'What do you want to eat?',
			'body.class': 'menuList'
		};
		// Read in a template as a string
		helpers.getTemplate('home', templateData, (err, str)=>{
			if(!err && str){
				// Add universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err,str)=>{
					if(!err && str){
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				})
			} else {
				callback(500, undefined, 'html');
			}
		})
	} else {
		callback(405, undefined, 'html');
	}
}

// Users shoppingcart
handlers.listShoppingcart = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Prepare data for interpolation
		let templateData = {
			'head.title': 'Shoppingcart',
			'head.descripton': 'This is your shoppingcart',
			'body.class': 'listShoppingcart'
		}
		// Read in a template as a string
		helpers.getTemplate('shoppingCart', templateData, (err, str)=>{
			if(!err && str){
				// Add universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str)=>{
					if(!err && str){
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
}

// Public assets
handlers.public = (data, callback)=>{
	// Reject any request that isn't a GET
	if(data.method === 'get'){
		// Get the filename being requested
		const trimmedAssetName = data.trimmedPath.replace('public/','').trim();
		if(trimmedAssetName.length > 0){
			// Read in the assets data
			helpers.getStaticAsset(trimmedAssetName, (err, data)=>{
				if(!err && data){
					// Determine the content type (default to plain text)
					let contentType = 'plain';
					if(trimmedAssetName.indexOf('.css') > -1){
						contentType = 'css';
					};
					if(trimmedAssetName.indexOf('.png') > -1){
						contentType = 'png';
					};
					if(trimmedAssetName.indexOf('.jpg') > -1){
						contentType = 'jpg';
					};
					// Callback the data
					callback(200, data, contentType);
				} else {
					callback(404);
				}
			})
		} else {
			callback(404);
		}
	} else {
		callback(405);
	}
}

/*
*
* JSON API handlers
*
*/


// Users
handlers.users = (data, callback)=>{
	const acceptableMethods = ['get', 'post', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
}


// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, email, address
// Optional data: none
handlers._users.post = (data, callback)=>{
	// Check that all required field are filled out
	let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let address = typeof(data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

	if(firstName && lastName && email && password && address){
		// Make sure that the user doesn't already exist
		_data.read('users', email, (err, data)=>{
			if(err){
				// Hash the password
				const hashedPassword = helpers.hash(password);
				if(hashedPassword){
					// Create the users shoppingcart object
					let shoppingcartId = helpers.createRandomString(20);
					// Create the shoppingcart object, and include it into the user object
					let shoppingcartObject = {
						'userEmail': email,
						'id': shoppingcartId,
						'items':[],
						'price': 0
					}
					// Create the user object
					const userObject = {
						firstName,
						lastName,
						email,
						hashedPassword,
						address,
						shoppingcartId,
						signupDate: Date.now()
					};

					// Store the user
					_data.create('users', email, userObject, (err)=>{
						if(!err){
							// Store the users shoppingcart
							_data.create('shoppingcart', shoppingcartId, shoppingcartObject, (err)=>{
								if(!err){
									callback(200);
								} else {
									callback(500, {'Error': 'Could not create the new user object'});
								}
							})
						} else {
							console.log(err);
							callback(500, {'Error': 'Could not create the new user'});
						}
					})
				} else {
					callback(500, {'Error': 'Could not hash the user\'s password'});
				}

			} else {
				callback(500, {'Error': 'A user with that email address already exist'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field, or invalid data'});
	};
};

// User - get
// Required data: email
// Optional data: none
handlers._users.get = (data, callback)=>{
	// Check that the email is valid
	let email = typeof(data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 3 && helpers.verifyEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;

	if(email){
		// Get the token from the headers
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		// Verify that the given token is valid for the email address
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', email, (err, data)=>{
					if(!err && data){
						// remove the hashed password from the user object before we return it to the requestor
						delete data.hashedPassword;
						callback(200, data);
					} else {
						callback(404);
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in the header, or token is expired.'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}

}

// Users - put
// Required data: email
// Optional data: firstName, lastName, password, address (at least one of them must be provided)
handlers._users.put = (data, callback)=>{
	// Check for the required field
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	
	// Check for the optional fields
	let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let address = typeof(data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

	// Error if email is invalid
	if(email){
		// Error if nothing is sent to update
		if(firstName || lastName || password || address){
			// Get the token from the header
			let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
			handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
				if(tokenIsValid){
					// lookup the user
					_data.read('users', email, (err, userData)=>{
						if(!err && userData){
							// Update the neccessary fields
							if(firstName){
								userData.firstName = firstName;
							};
							if(lastName){
								userData.lastName = lastName;
							};
							if(password){
								userData.hashedPassword = helpers.hash(password);
							};
							if(address){
								userData.address = address;
							};
							// Store the new updates
							_data.update('users', email, userData, (err)=>{
								if(!err){
									callback(200);
								} else {
									console.log(err);
									callback(500, {'Error': 'Could not update the user'});
								}
							})
						} else {
							callback(400, {'Error': 'The specified user doesn\'t exist'});
						}
					})
				} else {
					callback(403, {'Error': 'Missing required token in header, or token is expired'});
				}
			})
		} else {
			callback(400, {'Error': 'Missing fields to update'});
		}
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Users - delete
// Required data: email
handlers._users.delete = (data, callback)=>{
	// Check that the email is valid
	let email = typeof(data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 3 && helpers.verifyEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;
	if(email){
		// Get the token from the header
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', email, (err, userData)=>{
					if(!err && userData){
						// Delete the user's shoppingcart
						let shoppingcartId = userData.shoppingcartId;
						_data.delete('shoppingcart', shoppingcartId, (err)=>{
							if(!err){
								// delete the user object
								_data.delete('users', email, (err)=>{
									if(!err){
										// delete the user's token
										_data.delete('tokens', token, (err)=>{
											if(!err){
												callback(200);
											} else {
												callback(500, {'Error': 'Could not delete the user\'s token'});
											}
										})
									} else {
										callback(500, {'Error': 'Could not delete the specified user'});
									}
								})

							} else {
								callback(500, {'Error': 'Could not delete the user\'s shoppingcart'});
							}
						})
					} else {
						callback(400, {'Error': 'Could not find the specified user'});
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in the header, or token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
}


// Tokens
handlers.tokens = (data, callback)=>{
	const acceptableMethods = ['get', 'post', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for all tokens methods
handlers._tokens = {};


// Tokens - post
// Required data: email, password
// Optional data: none
handlers._tokens.post = (data, callback)=>{
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if(email && password){
		// Lookup the user who has that email address
		_data.read('users', email, (err, userData)=>{
			if(!err && userData){
				// Hash the sent password, and compare it to the password stored in the use object
				const hashedPassword = helpers.hash(password);
				if(hashedPassword === userData.hashedPassword){
					// If valid, create a new token with a random name. Set expiration date 1 hour in the future
					const tokenId = helpers.createRandomString(20);
					const expires = Date.now() + 1000 * 60 * 60;
					const tokenObject = {
						email,
						'id': tokenId,
						expires
					};
					// Store the tokens
					_data.create('tokens', tokenId, tokenObject, (err)=>{
						if(!err){
							callback(200, tokenObject);
						} else {
							callback(500, {'Error': 'Could not create the new token'});
						}
					})
				} else {
					callback(400, {'Error': 'Password did not match the specified user\'s stored password'});
				}
			} else {
				callback(400, {'Error': 'Could not find the specified user'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
};


// Tokens - get 
// Required data: id
// Optional data: none
handlers._tokens.get = (data, callback)=>{
	// Check that the id is valid
	let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
	if(id){
		// Lookup the token
		_data.read('tokens', id, (err, tokenData)=>{
			if(!err && tokenData){
				callback(200, tokenData);
			} else {
				callback(404);
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Tokens - put



// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, callback)=>{
	// Check that the id is valid
	let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
	if(id){
		// Lookup the token
		_data.read('tokens', id, (err, data)=>{
			if(!err && data){
				_data.delete('tokens', id, (err)=>{
					if(!err){
						callback(200);
					} else {
						callback(500, {'Error': 'Could not delete the specified token'})
					}
				})
			} else {
				callback(400, {'Error': 'Could not find the specified token'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Tokens -put
// Required data: id, expired
// Optional data: none
handlers._tokens.put = (data, callback)=>{
	let id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length  > 18 ? data.payload.id.trim() : false;
	let extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;

	if(id && extend){
		// Lookup the token
		_data.read('tokens', id, (err, tokenData)=>{
			if(!err && tokenData){
				// Check to make sure the token isn't already expired
				if(tokenData.expires > Date.now()){
					// Set the expiration time from now
					tokenData.expires = Date.now() + 1000 * 60 * 60;

					// Store the news update
					_data.update('tokens', id, tokenData, (err)=>{
						if(!err){
							callback(200);
						} else {
							callback(500, {'Error': 'Could not update the token\'s expiration.'})
						}
					})
				} else {
					callback(400, {'Error': 'The token has already expired, and cannot be extended.'})
				}
			} else {
				callback(400, {'Error': 'Specified token does not exist'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field(s) or field(s) are invalid.'})
	}
};


// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, email, callback)=>{
	// Lokup the token
	_data.read('tokens', id, (err, tokenData)=>{
		if(!err && tokenData){
			// Check if the token is for the given user, and has not expired
			if(tokenData.email === email && tokenData.expires > Date.now()){
				callback(true);
			} else {
				callback(false);
			}
		} else {
			callback(false);
		}
	})
}

// Menu
handlers.menu = (data, callback)=>{
	const acceptableMethod = 'get';
	if(data.method === acceptableMethod){
		handlers.menu[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Menu - get
// Onyl signed in users
// Required data: email(? that not even neccessary)
// Optional data: none
handlers.menu.get = (data, callback)=>{
	// Check the email
	let email = typeof(data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 3 && helpers.verifyEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;

	if(email){
		// Get the token from the header
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Send back the menu
				callback(200, menu);
			} else {
				callback(403, {'Error': 'Missing required token in header, or token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Shoppingcart
handlers.shoppingcart = (data, callback)=>{
	const acceptableMethods = ['get', 'post', 'put', 'delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._shoppingcart[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for all the shoppingcart methods
handlers._shoppingcart = {}; 

// shoppingcart - post
// Required data: email, pizzaId
// Optional data: multiple pizza
handlers._shoppingcart.post = (data, callback)=>{
	// Check the email
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	// Check the payload
	let pizzaId = typeof(data.payload.pizzaId) === 'string' && data.payload.pizzaId.trim().length > 0 ? data.payload.pizzaId.trim() : false;
	if(email && pizzaId){
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the users data
				_data.read('users', email, (err, userData)=>{
					if(!err && userData){
						// Get the user's shoppingcart id
						let shoppingcartId = userData.shoppingcartId;
						// Lookup the user's shoppingcart
						_data.read('shoppingcart', shoppingcartId, (err, shoppingcartData)=>{
							// Check items number in tha user's cart
							if(!err && shoppingcartData.items.length < config.maxShoppingItem){
								// Read the menu
								_data.read('menu', 'menu', (err, menuData)=>{
									if(!err && menuData){
										// Check the required item in the menu
										let food = menuData.pizza.filter((item)=>{
											return item.id === pizzaId;
										});
										if(food.length === 1){
											// Create the shoppingcart item
											let foodItem = {
												'id': food[0].id,
												'name': food[0].name,
												'price': food[0].price
											};
											shoppingcartData.price += parseInt(food[0].price);
											shoppingcartData.items.push(foodItem);
											// Store the new updates
											_data.update('shoppingcart', shoppingcartId, shoppingcartData, (err)=>{
												if(!err){
													callback(200);
												} else {
													callback(500, {'Error': 'Could not update the user\'s shoppingcart'});
												}
											})
										} else {
											callback(403, {'Error': 'Could not find the required menu item'});
										}
									} else {
										callback(500, {'Error': 'Could not read the menu'});
									}
								})
							} else {
								callback(500, {'Error': 'Could not read user\'s shoppingcart, or the user has more than 5 item in the cart.'});
							}
						});
					} else {
						callback(403, {'Error': 'Could not find the user with that token'});
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in header, or token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
}


// Shoppingcart - get
// Required data: email
// Optional data: none
handlers._shoppingcart.get = (data, callback)=>{
	// Check the email
	let email = typeof(data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 3 && helpers.verifyEmail(data.queryStringObject.email) ? data.queryStringObject.email : false;
	if(email){
		// Check the token
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', email, (err, userData)=>{
					if(!err && userData){
						// Get the user's shoppingcarts id
						let userShoppingcartId = userData.shoppingcartId;
						// Look up the specified shoppingcart
						_data.read('shoppingcart', userShoppingcartId, (err, data)=>{
							if(!err && data){
								// delete the userEmail
								delete data.userEmail
								// delete the shoppingcart id
								delete data.id
								callback(200, data);
							} else {
								callback(404)
							}
						}) 
					} else {
						callback(403, {'Error': 'The specified user does not exist'});
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in the header, or the token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
}


// Shoppingcart - put
// (delete everything from the shoppingcart)
// Required data: email
// Optional data: none
handlers._shoppingcart.put = (data, callback)=>{
	// Check the email
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	if(email){
		// Check the token
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', email, (err, userData)=>{
					if(!err && userData){
						// Get the user's shoppingcarts id
						let userShoppingcartId = userData.shoppingcartId;
						_data.read('shoppingcart', userShoppingcartId, (err, shoppingcartData)=>{
							if(!err && shoppingcartData){
								// Set back the values to basic
								shoppingcartData.items = [];
								shoppingcartData.price = 0;
								// Strore the updates
								_data.update('shoppingcart', userShoppingcartId, shoppingcartData, (err)=>{
									if(!err){
										callback(200);
									} else {
										callback(500, {'Error': 'Could not update the user\'s shoppingcat'});
									}
								})
							} else {
								callback(403, {'Error': 'Could not read the user\'s shoppincart'});
							}
						})

					} else {
						callback(403, {'Error': 'The specified user does not exist'});
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in the header, or the token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};


// Order
handlers.order = (data, callback)=>{
	if(data.method === 'post'){
		handlers.order[data.method](data, callback);
	} else {
		callback(405);
	}
};
// Order - post
// Required data: email (and a not empty shoppingcart), cardNumber, cardDate, cardCvc
// Optional data: none
handlers.order.post = (data, callback)=>{
	// Check the email
	let email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 3 && helpers.verifyEmail(data.payload.email) ? data.payload.email : false;
	let cardNum = typeof(data.payload.cardNum) === 'string' && data.payload.cardNum.trim().length === 19 && helpers.verifyCard(data.payload.cardNum.trim()) ? data.payload.cardNum : false;
	let cardDate = typeof(data.payload.cardDate) === 'string' && data.payload.cardDate.trim().length > 1 ? data.payload.cardDate : false;
	let cardCvc = typeof(data.payload.cardCvc) === 'string' && data.payload.cardCvc.trim().length === 3 ? data.payload.cardCvc : false;
	if(email && cardNum && cardDate && cardCvc){
		// Check the token
		let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
		handlers._tokens.verifyToken(token, email, (tokenIsValid)=>{
			if(tokenIsValid){
				// Lookup the user
				_data.read('users', email, (err, userData)=>{
					if(!err && userData){
						// Get the user's shoppingcarts id
						let userShoppingcartId = userData.shoppingcartId;
						_data.read('shoppingcart', userShoppingcartId, (err, shoppingcartData)=>{
							if(!err && shoppingcartData){
								// Check the user's shoppingcart length
								if(shoppingcartData.items.length > 0){
									// Start the payment
									helpers.sendStripeOrder(email, shoppingcartData.price, (statusCode, receiptData)=>{
										// If the payment is successfull, send an email
										if(statusCode === 200 || statusCode === 201){
											helpers.sendMailgunEmail(email, receiptData, (statusCode,y)=>{
												if(statusCode === 200){
													// create orderId
													const orderId = helpers.createRandomString(10)+'-'+Date.now(); 
													// create the order object
													const orderObject = {
														'id': orderId,
														'userEmail': userData.email,
														'items': shoppingcartData.items,
														'price': shoppingcartData.price,
														'date': Date.now()
													};
													_data.create('orders', orderId, orderObject, (err)=>{
														if(!err){
															callback(200);
														} else {
															callback(500, {'Error': 'Could not create the order object'});
														}
													});
												} else {
													console.log(statusCode);
													callback(500, {'Error': 'Error with the email'});
												}
											})
										} else {
											callback(500, {'Error': 'Error during processing the payment'});
										}	
									})
								} else {
									callback(400, {'Error': 'The shoppingcart is empty'});
								}
							} else {
								callback(403, {'Error': 'Could not read the user\'s shoppingcart'});
							}
						})
					} else {
						callback(403, {'Error': 'The specified user does not exist'});
					}
				})
			} else {
				callback(403, {'Error': 'Missing required token in the header, or the token is expired'});
			}
		})
	} else {
		callback(400, {'Error': 'Missing required field, or invalid credentials'});
	}
};	


// Ping handler 
handlers.ping = (data, callback)=>{
	callback(200);
};


// Not found handler
handlers.notFound = (data, callback)=>{
	callback(404);
};


// Export the handlers
module.exports = handlers;

