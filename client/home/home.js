Blog.setPageTitle('Home');

HomeController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('posts');
    },
    data: function() {

    },
    action: function() {
        this.render('home');
    }
});

Template.home.helpers({
    posts: function() {
        return Post.find({}, {sort: {createdAt: -1}});
    }
});