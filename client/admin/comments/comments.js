CommentsController = AdminController.extend({
    waitOn: function() {
        return [
            Meteor.subscribe('commentsForEdit'),
            Meteor.subscribe('posts')
        ]
    },
    data: function() {

    },
    action: function() {
        this.render('adminComments');
    }
});

Template.adminComments.helpers({
    comments: function() {
        var comm = [];
        var comments = Comment.find({}, { sort: { createdAt: -1 } });
        comments.forEach(function(comment){
            var post = Post.find({_id: comment.postId});
            post.forEach(function(post) {
                comm.push({
                    id: comment._id,
                    author: comment.name,
                    authorEmail: comment.email,
                    comment: comment.comment,
                    status: comment.status,
                    postId: post._id,
                    postTitle: post.title,
                    postSlug: post.slug,
                    createdAt: comment.createdAt
                });
            });
        });

        console.log(comm);

        return comm;
    }
});

Template.adminComments.events({
    "click .approveCommentBtn": function(event) {
        var commentId = $(event.currentTarget).data("commentid");
        Meteor.call('approveComment', commentId);
        return false;
    },
    "click .disapproveCommentBtn": function(event) {
        var commentId = $(event.currentTarget).data("commentid");
        Meteor.call('disapproveComment', commentId);
        return false;
    },
    "click .deleteCommentBtn": function(event) {
        var commentId = $(event.currentTarget).data("commentid");
        Meteor.call('deleteComment', commentId);
        return false;
    }
});

