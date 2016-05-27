'use strict';

app.factory('Auth', function(FURL, $firebaseAuth, $firebaseObject, $state) {
	var ref = new Firebase(FURL);
	var auth = $firebaseAuth(ref);

	var Auth = {

		createProfile: function(uid, auth) {
			var profile = {
				name: auth.displayName,
				gender: auth.cachedUserProfile.gender,
				email: auth.email,
				avatar: auth.profileImageURL,
				birthday: auth.cachedUserProfile.birthday,
				location: auth.cachedUserProfile.location.name
			};
			return ref.child('profiles').child(uid).set(profile);
		},

		getProfile: function(uid) {
			return $firebaseObject(ref.child('profiles').child(uid));
		},


		login: function() {
			return auth.$authWithOAuthPopup('facebook', {
				remember: 'sessionOnly',
				scope: "public_profile, email, user_location, user_birthday, user_photos, user_about_me"
			})
			.then(function(authFacebook) {
				var user = Auth.getProfile(authFacebook.uid).$loaded();
				user.then(function(profile) {
					if (profile.name == undefined) {
						Auth.createProfile(authFacebook.uid, authFacebook.facebook);
					}
				});
			});
		},

		logout: function() {
			return auth.$unauth();
		}

	};
	
	auth.$onAuth(function(authData) {
		if (authData) {
			console.log('Logged in');
		} else {
			$state.go('login');
			console.log("You need to login");
		}
	});

	return Auth;

});