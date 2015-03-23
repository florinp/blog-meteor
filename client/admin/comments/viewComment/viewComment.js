ViewCommentController = AdminController.extend({
    waitOn: function() {
        return Meteor.subscribe('commentsForEdit');
    },
    data: function() {
        Session.set('entityId', this.params._id);
    },
    action: function(){
        this.render('viewComment');
    }
});

Template.viewComment.helpers({
    comment: function() {
        var comment = Comment.findOne({_id: Session.get('entityId')});
        console.log(comment);
        return comment;
    }
});

Template.viewComment.events({
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

        Router.go('admin/comments');

        return false;
    }
});