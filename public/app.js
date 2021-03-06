/*
 * Frontend Logic for application
 *
 */

 // Container for frontend application
 let app = {};



// Config
app.config = {
	'sessionToken': false
};

// AJAX Client (for RESTful API)
app.client = {};

// Interface for making API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback)=>{
	// Set defaults
	headers = typeof(headers) === 'object' && headers !== null ? headers : {};
	path = typeof(path) === 'string' ? path : '/';
	method = typeof(method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
	queryStringObject = typeof(queryStringObject) === 'object' && queryStringObject !== null ? queryStringObject : {};
	payload = typeof(payload) === 'object' && payload !== null ? payload : {};
	callback = typeof(callback) === 'function' ? callback : false;

	// For each query string parameter sent, add it to the path
	let requestUrl = path+'?';
	let counter = 0;
	for(let queryKey in queryStringObject){
		if(queryStringObject.hasOwnProperty(queryKey)){
			counter++;
			// If at least one query string parameter has already been added, prepend new ones with an ampersand
			if(counter > 1){
				requestUrl+='&';
			};
			// Add the key and value
			requestUrl+=queryKey+'='+queryStringObject[queryKey];
		}
	}

	// Form the https request as a JSON type
	let xhr = new XMLHttpRequest();
	xhr.open(method, requestUrl, true);
	xhr.setRequestHeader('Content-type', 'application/json');

	// For each header sent, add it to the request
	for(let headerKey in headers){
		if(headers.hasOwnProperty(headerKey)){
			xhr.setRequestHeader(headerKey, headers[headerKey]);
		};
	};

	// If there is a current session token set, add that as a header
	if(app.config.sessionToken){
		xhr.setRequestHeader('token', app.config.sessionToken.id);
	};

	// When the request comes back, handle the response
	xhr.onreadystatechange = ()=>{
		if(xhr.readyState === XMLHttpRequest.DONE){
			const statusCode = xhr.status;
			const responseReturned = xhr.responseText;

			// Callback if requested
			if(callback){
				try {
					let parsedResponse = JSON.parse(responseReturned);
					callback(statusCode, parsedResponse);
				} catch(e){
					callback(statusCode, false);
				}
			}
		}
	}

	// Send the payload as JSON
	const payloadString = JSON.stringify(payload);
	xhr.send(payloadString);
};
// Bind the forms
app.bindForms = ()=>{
	if(document.querySelector('form')){
		let allForms = document.querySelectorAll('form');
		for(let i=0; i<allForms.length; i++){
			allForms[i].addEventListener('submit', function(e){
				// Stop it from submitting
				e.preventDefault();
				let formId = this.id;
				let path = this.action;
				let method = this.method;

				// Hide the error message (if it's currently shown due a previous error)
				document.querySelector('#'+formId+' .formError').style.display = 'none';

				// Hide the success message (if it's currently shown due to a pevious one)
				if(document.querySelector('#'+formId+' .formSuccess')){
					document.querySelector('#'+formId+' .formSuccess').style.display = 'none';
				}

				// Turn the inputs into a payload
				let payload = {};
				let elements = this.elements;
				for(let i=0; i<elements.length; i++){
					if(elements[i].type !== 'submit'){
						// Determine the class of the element and set value accordingly
						let classOfElement = typeof(elements[i].classList.value) === 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
						let valueOfElement = elements[i].type === 'checkbox' && classOfElement.indexOf('multiselect') === -1 ? elements[i].checked : classOfElement.indexOf('intval') === -1 ? elements[i].value : parseInt(elements[i].value);
						// Override the method of the form if the input's name is _method
						let nameOfElement = elements[i].name;
						if(nameOfElement === '_method'){
							method = valueOfElement;
						} else {
							// Create a payload field named 'method' if the elements name is actually httpmethod
							if(nameOfElement === 'httpmethod'){
								nameOfElement = 'method';
							}
							// Create a payload field named 'id' of the elements name is actually uid
							if(nameOfElement === 'uid'){
								nameOfElement = 'id';
							}
							
							payload[nameOfElement] = valueOfElement;
						}
					}
				}
				// If the method is DELETE, the payload should be a queryStringObject instead
				let queryStringObject = method === 'DELETE' ? payload : {};
				// Call the API
				app.client.request(undefined, path, method, queryStringObject, payload, (statusCode, responsePayload)=>{
					// Display an error on the form if needed
					if(statusCode !== 200){
						if(statusCode === 403){
							// Log out the user
							app.logUser();
						} else {
							// Try to get the error from the api, or set a default error message
							let error = typeof(responsePayload.Error) === 'string' ? responsePayload.Error : 'An error has occured, please try again';
							// Set the formError field with the error text
							document.querySelector('#'+formId+' .formError').innerHTML = error;
							// Show (unhide) the form error field on the form
							document.querySelector('#'+formId+' .formError').style.display = 'block';
						}
					} else {
						// If successful, send to form response processor
						app.formResponseProcessor(formId, payload, responsePayload);
					}
				})
			})
		}
	}
}


app.formResponseProcessor = (formId, requestPayload, responsePayload)=>{
	// If account creation was successful, try to immediately log the user in
	if(formId === 'accountCreate'){
		// Take the phone and password, and use it to log the user in
		let newPayload = {
		  'email' : requestPayload.email,
		  'password' : requestPayload.password
		};

		app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
			console.log('formresponesprocessor', newResponsePayload);
			// Display an error on the form if needed
			if(newStatusCode !== 200){
				// Set the formError field with the error text
				document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';
				// Show (unhide) the form error field on the form
				document.querySelector("#"+formId+" .formError").style.display = 'block';
			} else {
				// If successful, set the token and redirect the user
				app.setSessionToken(newResponsePayload);
				window.location = '/';
			}
		});
	}
	// If login was successful, set the token in localstorage and redirect the user
	if(formId === 'sessionCreate'){
		app.setSessionToken(responsePayload);
		window.location = '/';
	};
	// if account edited successfully, show message
	if(formId === 'accountEdit'){
		document.querySelector('#'+formId+' .formSuccess').style.display = 'block';
	}

	// if payment was successfull, show message
	if(formId === 'payment'){
		document.querySelector('#'+formId+' .formSuccess').style.display = 'block';
		let email = typeof(app.config.sessionToken.email) === 'string' ? app.config.sessionToken.email : false;
		clearItem(email, true);
	}

	// If the user just deleted their account, redirect them to the account-delete page
	if(formId === 'accountDelete'){
		window.location = '/account/deleted';
		app.logUserOut(false);
	}
};

// Bind the logout button
app.bindLogoutButton = ()=>{
	document.getElementById('logout_btn').addEventListener('click', (e)=>{
		app.logUserOut();
	});
}

// log the user out then redirect them
app.logUserOut = (redirectUser)=>{
	// Set redirectUser to default to true
	redirectUser = typeof(redirectUser) === 'boolean' ? redirectUser : true;

	// Get the current token id
	let tokenId = typeof(app.config.sessionToken.id) === 'string' ? app.config.sessionToken.id : false;

	// Send the current token to the tokens endpoint to delete it
	let queryStringObject = {
		'id': tokenId
	};
	app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, (statusCode, responsePayload)=>{
		// Set the app.config token as false
		app.setSessionToken(false);
		// Send the user to the index page
		if(redirectUser){
			window.location = '/';
		};
	});
}

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  let tokenString = localStorage.getItem('token');
  if(typeof(tokenString) === 'string'){
    try{
    	let token = JSON.parse(tokenString);
    	app.config.sessionToken = token;
    	if(typeof(token) == 'object'){
    	  app.setLoggedInClass(true);
    	  console.log('You\'re logged in');
    	} else {
    		console.log('You\'re logged out!');
    	  app.setLoggedInClass(false);
    	}
    }catch(e){
    	app.config.sessionToken = false;
    	app.setLoggedInClass(false);
    }
  }
};


// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  let tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = (add)=>{
	const target = document.querySelector('body');
	if(add){
		target.classList.remove('loggedOut');
		target.classList.add('loggedIn');
	} else {
		target.classList.remove('loggedIn');
		target.classList.add('loggedOut');
	}
}

// Renew the token
app.renewToken = (callback)=>{
	let currentToken = typeof(app.config.sessionToken) === 'object' ? app.config.sessionToken : false;
	if(currentToken){
		// Update the token with a new expiration
		const payload = {
			'id': currentToken.id,
			'extend': true
		};
		app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, (statusCode, responsePayload)=>{
			// Display an error on the form if needed
			if(statusCode === 200){
				// Get the new token details
				let queryStringObject = {'id': currentToken.id};
				app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, (statusCode, responsePayload)=>{
					// Display an error on te form if needed
					if(statusCode === 200 || statusCode === 102){
						app.setSessionToken(responsePayload);
						callback(false);
					} else {
						app.setSessionToken(false);
						callback(true);
					}
				});
			} else {
				app.setSessionToken(false);
				callback(true);
			}
		});
	} else {
		app.setSessionToken(false);
		callback(true);
	}
};

// Loop to renew the token
app.tokenRenewalLoop = ()=>{
	setInterval(()=>{
		app.renewToken((err)=>{
			if(!err){
				console.log('Token renewed successfully @ '+Date.now());
			}
		});
	}, 1000 * 60);
};

app.menuList = ()=>{
	// Get the email address from the current token, or log the user out if none is there
	let email = typeof(app.config.sessionToken.email) === 'string' ? app.config.sessionToken.email : false;
	if(email){
		// Fetch the use data
		let queryStringObject = {email};
		app.client.request(undefined, 'api/menu', 'GET', queryStringObject, undefined, (statusCode, responsePayload)=>{
			if(statusCode === 200){
				responsePayload['pizza'].forEach((item)=>{
					let cardEl = document.createElement('div');
					let nameEl = document.createElement('h1');
					let priceEl = document.createElement('p');
					let descEl = document.createElement('ul');
					let buttonEl = document.createElement('button');

					cardEl.classList.add('item-card');
					nameEl.classList.add('item-title');
					priceEl.classList.add('item-price');
					descEl.classList.add('item-desc');
					buttonEl.classList.add('item-btn');

					buttonEl.setAttribute('id', item['id']);
					buttonEl.addEventListener('click', (e)=>{
						console.log('Clicked', e.target.id, email);
						addItem(email, e.target.id);
					});

					nameEl.textContent = item['name'];
					priceEl.textContent = item['price']+' $';
					
					item['description'].forEach((desc)=>{
						let descLiEl = document.createElement('li');
						descLiEl.textContent = desc;
						descEl.append(descLiEl);
					})

					buttonEl.textContent = 'Add to cart';
					cardEl.appendChild(nameEl);
					cardEl.appendChild(descEl);
					cardEl.appendChild(priceEl);
					cardEl.appendChild(buttonEl);


					
					document.querySelector('#item_target').append(cardEl);
				})
			} else {
				// If the request comes back as something other than 200, log the user out (on the assumption that the api is temporarily down or the users token is bad)
				app.logUserOut();
			}
		})
	} else {
		app.logUserOut();
	}
};

// Show the users shoppingcart
app.listShoppingcart = ()=>{
	// Get the email from the current token, or log the user out if none is there
	let email = typeof(app.config.sessionToken.email) === 'string' ? app.config.sessionToken.email : false;
	if(email){
		// Fetch the users data
		let queryStringObject = {email};
		app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload)=>{
			if(statusCode === 200){
				// Get the users shoppingcart id
				let shopId = typeof(responsePayload.shoppingcartId) === 'string' ? responsePayload.shoppingcartId : false;
				if(shopId){
					// Get the data from the cart
					app.client.request(undefined, 'api/shoppingcart', 'GET',queryStringObject, undefined, (statusCode, responsePayload)=>{
						if(statusCode === 200){
							console.log(responsePayload['price']);
							// Select the target element
							const targetEl = document.querySelector('#sc_target');

							if(responsePayload.items.length < 1){
								targetEl.innerHTML = '<h2>Your cart is empty</h2>';
								document.querySelector('#paymentForm').style.display = 'none';
							} else{
								responsePayload['items'].forEach((item)=>{
									// console.log(item['name']);
									let titleEl = document.createElement('h2');
									titleEl.textContent = item['name'];
									let priceEl = document.createElement('h3');
									let hr = document.createElement('hr');
									priceEl.textContent = item['price']+'$';

									titleEl.classList.add('sc-title');
									priceEl.classList.add('sc-price');
									targetEl.append(titleEl);
									targetEl.append(priceEl);
									targetEl.append(hr);
								});
								let sumEl = document.createElement('h3');
								sumEl.textContent = `Total: ${responsePayload['price']}$`;
								targetEl.append(sumEl);

								let delBtn = document.createElement('button');
								delBtn.setAttribute('id', 'delItem');
								delBtn.textContent = 'Delete';
								delBtn.addEventListener('click', (e)=>{
									clearItem(email);
								})
								targetEl.append(delBtn);
							};
						} else {
							console.log('Cannot get data from the shoppingcart');
						}
					})
				} else {
					// If the user does not have a shoppingcartid, log out
					app.logUserOut();
				}
			} else {
				// If the request comes back sa something other than 200, log the user out (on the assumption that the api is temporarily down or the users token is bad)
				app.logUserOut();
			}
		})
	} else {
		app.logUserOut();
	}
};

// Function to add items to the shoppingcart
const addItem = (email, id)=>{
	let payload = {
		'email': email,
		'pizzaId': id
	};
	app.client.request(undefined, 'api/shoppingcart', 'POST', undefined, payload, (statusCode, responsePayload)=>{
		if(statusCode === 200){
			document.querySelector('#sc_msg').innerHTML = 'Item added to your shoppingcart';
		} else if(statusCode === 500) {
			document.querySelector('#sc_msg').innerHTML = 'You reached your limit.';
		}
	})
};

// Function to delete every item from the shoppingcart
const clearItem = (email, success)=>{
	let payload = {email};
	app.client.request(undefined, 'api/shoppingcart', 'PUT', undefined, payload, (statusCode, responsePayload)=>{
		if(statusCode === 200){
			if(success){
				document.querySelector('#sc_target').innerHTML = '<h2>Your payment was successfull</h2>';
				document.querySelector('#paymentForm').style.display = 'none';
			} else {
				document.querySelector('#sc_target').innerHTML = '<h2>Your shoppingcart is empty</h2>';
				document.querySelector('#paymentForm').style.display = 'none';
			}
			
		} else {
			console.log('Something went wrong');
		}
	})
};

// Account edit page
app.accountEdit = ()=>{
	// Get the email address from the current toke, or log the user out if none is there
	let email = typeof(app.config.sessionToken.email) === 'string' ? app.config.sessionToken.email : false;
	if(email){
		// Fetch the user data
		let queryStringObject = {email};
		app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload)=>{
			if(statusCode === 200){
				// Put the data into forms as values where needed
				document.querySelector('#accountEdit .firstNameInput').value = responsePayload.firstName;
				document.querySelector('#accountEdit .lastNameInput').value = responsePayload.lastName;
				document.querySelector('#accountEdit .addressInput').value = responsePayload.address;
				document.querySelector('#accountEdit .displayEmailInput').value = responsePayload.email;

				document.querySelector('#accountDelete .hiddenEmail').value = responsePayload.email;
				// document.querySelector('#accountEdit .')
			} else {
				// Of the request comes back as something other than 200, log the user out on the assumption that the api is temporarily down or the token is bad
				app.logUserOut();
			}
		})
	} else {
		app.logUserOut();
	}
}

// Send an order
app.buyItems = ()=>{
	// Get the email address from the current token, or log the user out if none is there
	let email = typeof(app.config.sessionToken.email) === 'string' ? app.config.sessionToken.email : false;
	if(email){
		document.querySelector('#paymentForm .hiddenEmail').value = email;
	} else {
		app.logUserOut();
	}
};

app.cardInput = ()=>{
	document.querySelector('#cardNum').addEventListener('input', (e)=>{
		let x = e.target.value;
		x  = x.replace(/\s/g, '');
		let z = '';
		for(let i=0; i < x.length; i++){
			if(i > 0 && i % 4 === 0){
				 z = z.concat(' ');
			}
			z = z.concat(x[i]);
		}
		document.querySelector('#cardNum').value = z;
	})
};

// Load data on the page
app.loadDataOnPage = ()=>{
	// Get the current page from the body class
	let bodyClasses = document.querySelector('body').classList;
	let primaryClass = typeof(bodyClasses[0]) === 'string' ? bodyClasses[0] : false;
	// Logic for menu list page
	if(primaryClass === 'menuList'){
		app.menuList();
	};
	if(primaryClass === 'listShoppingcart'){
		app.listShoppingcart();
		app.buyItems();
		app.cardInput();
	};
	if(primaryClass === 'accountEdit'){
		app.accountEdit();
	};
}



// Init (bootstrapping)
app.init = ()=>{
	// Bind all form submissions
	app.bindForms();
	// Bind the logout button
	app.bindLogoutButton();
	// Get the token from localstorage
	app.getSessionToken();
	// Renew token
	app.tokenRenewalLoop();
	// Load data to the page
	app.loadDataOnPage();
};

// Call the init process after the window loads
window.onload = ()=>{
	app.init();
}