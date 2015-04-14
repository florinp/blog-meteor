Meteor.startup(function(){
    smtp = {
        host: 'smtp.gmail.com',
        username: '',
        password: '',
        port: 465
    };
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.host) + ':' + encodeURIComponent(smtp.port);
});