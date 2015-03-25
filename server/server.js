Meteor.startup(function() {
    process.env.ROOT_URL = 'http://192.168.1.200:3000';
    process.env.MOBILE_DDP_URL = 'http://192.168.1.200:3000';
    process.env.MOBILE_ROOT_URL = 'http://192.168.1.200:3000';
    process.env.MONGO_URL = 'mongodb://192.168.1.20:27017/meteor';
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