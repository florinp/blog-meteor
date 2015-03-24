Template.sidebar.helpers({
    loginForm: function() {
        return new SimpleSchema({
            username: {
                type: String
            },
            password: {
                type: String
            }
        });
    }
});

Template.sidebar.events({
    "submit .loginForm": function(event) {
        event.preventDefault();

        var username = event.target.username.value,
            password = event.target.password.value;

        Meteor.loginWithPassword(username, password, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });

        return false;
    },
    "click .logoutBtn": function(event) {

        Meteor.logout(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });

        return false;
    }
});