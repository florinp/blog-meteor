Accounts.config({
    forbidClientAccountCreation: false,
    loginExpirationInDays: null
});

Accounts.onCreateUser(function(opts, user) {
    var d6 = function () { return Math.floor(Random.fraction() * 6) + 1; };
    user.dexterity = d6() + d6() + d6();
    // We still want the default hook's 'profile' behavior.
    if (opts.profile)
        user.profile = opts.profile;

    Meteor.setTimeout(function() {
        if(user.username == 'florin') {
            user.emails[0].verified = true;
        } else {
            Accounts.sendVerificationEmail(user._id);
        }
        Roles.addUsersToRoles(user._id, ['user']);
    }, 2 * 1000);

    return user;
});

Accounts.validateNewUser(function(user){

    return true;
});

Accounts.validateLoginAttempt(function(attempt) {
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
        console.log('email not verified');
        throw new Meteor.Error('403', 'Email not verified');
        return false; // the login is aborted
    }
    return true;
});