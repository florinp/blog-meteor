Template.registerHelper('classTop', function() {
    currentRoute = Router.current().route.getName();
    routes = [
        'admin', 'admin/posts', 'admin/posts/add'
    ];
    if(currentRoute !== 'undefined' && currentRoute != null) {
        if(routes.indexOf(currentRoute) != -1) {
            return 'adminTop';
        } else if(currentRoute == 'admin/login') {
            return 'loginTop';
        }
        return '';
    } else {
        return 'null';
    }
});

Template.registerHelper('formatDate', function(date){
    return moment(date).format('DD MMM YYYY HH:MM:ss');
});

Template.registerHelper('shortText', function(text, start, end){
    start = parseInt(start);
    end = parseInt(end);
    if(text.length > end) {
        text = text.substr(start, end) + ' ...';
    }
    return text;
});

Template.home.helpers({
    posts: function() {
        return Post.find({}, {sort: {createdAt: -1}});
    },
    getAuthorName: function(userId) {
        return Meteor.users().find({}, {userId: userId});
    }
});