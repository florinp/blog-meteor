RegisterController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('appUsers');
    },
    data: function() {

    },
    action: function() {
        this.render('register');
    }
});

Template.register.helpers({
    registerFormSchema: function() {
        SimpleSchema.messages({
            checkPassword: "[label] field does not match with Password field",
            existsAlready: "[label] already exists"
        });
        var schema = new SimpleSchema({
            username: {
                type: String,
                label: 'Username',
                min: 3,
                custom: function() {
                    if(Meteor.isClient && this.isSet) {
                        var users = Meteor.users.find({username: this.value});
                        if(users.count() > 0) {
                            return "existsAlready";
                        }
                    }
                    return true;
                }
            },
            password: {
                type: String,
                label: 'Password',
                min: 6,
                max: 32,
                autoform: {
                    type: 'password'
                }
            },
            confirmPassword: {
                type: String,
                label: 'Confirm password',
                min: 6,
                max: 32,
                autoform: {
                    type: 'password'
                },
                custom: function() {
                    var password = this.field("password");
                    if(this.value != password.value) {
                        return "checkPassword";
                    }
                    return true;
                }
            },
            email: {
                type: String,
                label: 'Email',
                regEx: SimpleSchema.RegEx.Email,
                custom: function() {
                    if(Meteor.isClient && this.isSet) {
                        var users = Meteor.users.find({ emails: { $elemMatch: { address: this.value } } });
                        if(users.count() > 0)
                            return 'existsAlready';
                    }
                    return true;
                }
            }
        });


        return schema;
    }
});

Template.register.events({
    "submit #registerForm": function(event) {
        event.preventDefault();

        var username = event.target.username.value,
            email = event.target.email.value,
            password = event.target.password.value,
            profile = {};

        Accounts.createUser({
            username: username,
            email: email,
            password: password,
            profile: {}
        }, function(error) {
            if(!error) {
                RegisterController.render('confirmMsg');
            } else {
                console.log(error);
            }
        });

        return false;
    }
});