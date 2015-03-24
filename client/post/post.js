var self = this;

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
        //Session.set('clientIp', self.request.connection.remoteAddress);
        this.render('post');
    }
});

Template.post.helpers({
    ret: function() {
        var ret = {};
        ret.post = Post.findOne({slug: Session.get('entitySlug')});
        ret.rating = function() {
            var post = Post.findOne({slug: Session.get('entitySlug')});
            var ma = 0;
            var total_rate = 0;
            var ratings = post.rating;
            if(ratings) {
                ratings.forEach(function(item){
                    total_rate = total_rate + parseInt(item.rate);
                });

                ma = total_rate/ratings.length;
            }
            return Math.round(ma);
        };
        return ret;
    },
    checkStar: function(star, rating) {
        if(parseInt(star) == parseInt(rating)) {
            return true;
        } else {
            return false;
        }
    },
    checkRating: function() {
        var post = Post.findOne({slug: Session.get('entitySlug')}),
            exists = false;
        Meteor.call('checkRating', post._id, function(err, resp) {
            Session.set('checkRatingIfExists', resp);
        });

        exists = Session.get('checkRatingIfExists');

        return exists;
    }
});
Template.post.events({
    "change input[name=star]": function(event) {
        var post = Post.findOne({slug: Session.get('entitySlug')});
        var rate = event.currentTarget.value;
        Meteor.call('addRating', post._id, rate);
    }
});

Template.comments.helpers({
    postComments: function() {
        var post = Post.findOne({slug: Session.get('entitySlug')});
        var comments = Comment.find({postId: post._id, status: true});

        return comments;
    },
    addCommentFormSchema: function() {
        return new SimpleSchema({
            name: {
                type: String,
                label: "Name",
                max: 200
            },
            email: {
                type: String,
                label: "Email",
                max: 255,
                autoform: {
                    type: "email"
                },
                regEx: SimpleSchema.RegEx.Email
            },
            comment: {
                type: String,
                label: "Comment",
                min: 50,
                autoform: {
                    rows: 6
                }
            }
        });
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

Template.comments.rendered = function() {

    //$(".addCommentForm").parsley();
}