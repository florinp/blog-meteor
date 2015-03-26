AccountController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('appUsers');
    },
    data: function() {
    },
    onBeforeAction: function() {
        var user = Meteor.user()
        if(!user) {
            Router.go('/');
        }
        this.next();
    },
    action: function() {
        this.render('account');
    }
});
Session.setDefault('editAccountError', false);
Session.setDefault('editAccountSuccess', false);
Template.editAccount.helpers({
    editAccountSchema: function() {
        var user = Meteor.user();
        var schema = new SimpleSchema({
            firstName: {
                type: String,
                label: "First name",
                optional: true
            },
            lastName: {
                type: String,
                label: "Last name",
                optional: true
            }
        });

        return schema;
    },
    error: function() {
        return Session.get('editAccountError');
    },
    success: function() {
        return Session.get('editAccountSuccess');
    }
});
Template.editAccount.events({
    "submit #editAccountForm": function(event) {
        event.preventDefault();

        var firstName = event.target.firstName.value,
            lastName = event.target.lastName.value;

        var options = {
            firstName: firstName,
            lastName: lastName
        };

        Meteor.call('editAccount', options, function(error, result) {
            if(error) {
                Session.set('editAccountError', error.reason);
            } else {
                if(result) {
                    Session.set('editAccountSuccess', result);
                }
            }
        });

        return false;
    },
    "click .close-error": function(event) {
        event.preventDefault();
        var btn = $(event.currentTarget);

        Session.set('editAccountError', false);

        return false;
    },
    "click .close-success": function(event) {
        event.preventDefault();
        var btn = $(event.currentTarget);

        Session.set('editAccountSuccess', false);

        return false;
    }

});

Session.setDefault('changePasswordMsg', false);
Session.setDefault('changePasswordError', false);
Template.changePassword.helpers({
    changePasswordSchema: function() {
        SimpleSchema.messages({
            checkPassword: "[label] field does not match with Password field",
            existsAlready: "[label] already exists"
        });
        var schema = new SimpleSchema({
            oldPassword: {
                type: String,
                label: 'Old password',
                min: 6,
                max: 32,
                autoform: {
                    type: 'password'
                }
            },
            newPassword: {
                type: String,
                label: 'New password',
                min: 6,
                max: 32,
                autoform: {
                    type: 'password'
                }
            },
            confirmNewPassword: {
                type: String,
                label: 'Confirm new password',
                min: 6,
                max: 32,
                autoform: {
                    type: 'password'
                },
                custom: function() {
                    var password = this.field("newPassword");
                    if(this.value != password.value) {
                        return "checkPassword";
                    }
                    return true;
                }
            }
        });

        return schema;
    },
    error: function() {
        return Session.get('changePasswordError');
    },
    message: function() {
        return Session.get('changePasswordMsg');
    }
});
Template.changePassword.events({
    "submit #changePasswordForm": function(event) {
        event.preventDefault();

        var oldPassword = event.target.oldPassword.value,
            newPassword = event.target.newPassword.value;

        if(oldPassword.trim() != '' && newPassword.trim() != '') {
            Accounts.changePassword(oldPassword, newPassword, function(error) {
                if(error !== 'undefined' && error != null) {
                    console.log(error);
                    Session.set('changePasswordError', error.reason);
                    Session.set('changePasswordMsg', false);
                } else {
                    Session.set('changePasswordError', false);
                    Session.set('changePasswordMsg', true);
                }
            });
        }

        event.target.oldPassword.value = '';
        event.target.newPassword.value = '';
        event.target.confirmNewPassword.value = '';

        return false;
    },
    "click .close-error": function(event) {
        event.preventDefault();
        var btn = $(event.currentTarget);

        Session.set('changePasswordError', false);

        return false;
    },
    "click .close-message": function(event) {
        event.preventDefault();
        var btn = $(event.currentTarget);

        Session.set('changePasswordMsg', false);

        return false;
    }
});