PostsController = AdminController.extend({
    waitOn: function() {
        return Meteor.subscribe('posts');
    },
    data: function() {
        return {posts: Post.find()};
    },
    action: function() {
        this.render('posts');
    }
});

Template.posts.events({
    "click .deletePost": function(event) {
        var postId = $(event.currentTarget).data('postid');

        Meteor.call('deletePost', postId);

        return false;
    }
});