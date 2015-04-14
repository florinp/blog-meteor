Meteor.startup(function() {
    user_count = Meteor.users.find({username: 'florin'}).count();
    if(user_count == 0) {
        id = Accounts.createUser({
            username: 'florin',
            email: 'florinp94@gmail.com',
            password: '123456',
            profile: {
                firstName: 'Florin',
                lastName: 'Pavel'
            }
        });
        Roles.addUsersToRoles(id, ['admin']);
    }
});