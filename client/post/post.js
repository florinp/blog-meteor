PostController = BaseController.extend({
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params.slug),
            Meteor.subscribe('comments', this.params.slug)
        ];
    },
    data: function() {
        Session.set('entitySlug', this.params.slug);
    },
    action: function() {
        this.render('post');
    }
});

Template.post.helpers({
    post: function() {
        return Post.findOne({slug: Session.get('entitySlug')});
    }
});

Template.comments.helpers({
    postComments: function() {
        var post = Post.findOne({slug: Session.get('entitySlug')});
        var comments = Comment.find({postId: post._id, status: true});

        console.log(comments);

        return comments;
    }
});

Template.comments.events({
    "submit .addCommentForm": function(e) {
        e.preventDefault();

        var name = e.target.name.value,
            email = e.target.email.value,
            comment = e.target.comment.value;

        var insert = {
            name: name,
            email: email,
            comment: comment
        };

        var id;
        Meteor.call('addComment', Session.get('entitySlug'), insert, function(error, result) {
            Session.set('commentId', result);
        });

        console.log(Session.get('commentId'));

        e.target.name.value = "";
        e.target.email.value = "";
        e.target.comment.value = "";

        Router.go("post", {slug: Session.get('entitySlug')}, {hash: "comment-" + Session.get('commentId')});

        return false;
    },
    "click .displayAddCommentForm": function(e) {
        var form = $(".addCommentForm"),
            btn = $(this);

        if(form.css('display') == 'none') {
            form.slideToggle('slow');
            btn.html('Hide form');
        } else {
            form.slideToggle('slow');
            btn.html('Show form');
        }

        return false;
    }
});