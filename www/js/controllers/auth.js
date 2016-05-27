'use strict';

app.controller('AuthCtrl', function(Auth, $state) {
	var auth = this;

	auth.login = function() {
		console.log('Login clicked');
		return Auth.login().then(function(user) {
			$state.go('tab.dash');
		});
	};

	auth.logout = function() {
		console.log('Logout clicked');
		Auth.logout();

	};
});