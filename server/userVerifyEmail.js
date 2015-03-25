Meteor.startup(function() {
    Accounts.emailTemplates.from = Blog.appName + " <no-reply@east-wolf.com>";
    Accounts.emailTemplates.siteName = Blog.appName;
    Accounts.emailTemplates.verifyEmail.subject = function(user) {
        return 'Confirm your address email';
    }
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        return 'click on the following link to verify your email address: ' + url;
    };
});