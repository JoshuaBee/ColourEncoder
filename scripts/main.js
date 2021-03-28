var deferredPrompt;

document.addEventListener('DOMContentLoaded', function(event) {

	// Add event listeners
	document.getElementById('message').addEventListener('keyup', function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			generateFromTextBox();
		}
	});

	document.getElementById('generate').addEventListener('click', function(event) {
		event.preventDefault();
		generateFromTextBox();
	});
});

// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
window.addEventListener('beforeinstallprompt', (event) => {

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	deferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById('install').addEventListener('click', (event) => {

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});

	document.getElementById('install').setAttribute('aria-hidden', false);
});

// When the app is installed it should remove the install snackbar
window.addEventListener('appinstalled', (event) => {
	console.log('a2hs installed');
	document.getElementById('install').setAttribute('aria-hidden', true);
});

function generateFromTextBox() {
	var message = document.getElementById('message').value;
	var messageHash = hash(message);

	var colors = [];
	while (messageHash.length > 0) {
		colors.push(messageHash.substr(0, 4));
		messageHash = messageHash.substring(4);
	}

	var style = 'background: linear-gradient(90deg, ';
	for (var i = 0; i < colors.length; i++) {
		var color = colors[i];

		style += `hsla(${ (hexToDec(color) / 65025) * 360 }, 100%, 50%, 1) ${ 100 * i / (colors.length - 1) }%`;

		if (i !== colors.length - 1) {
			style += ', ';
		}
	}
	style += ')';

	document.querySelector('body').style = style;
}

function hash(message) {
	return CryptoJS.MD5(message).toString();
}

function hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}