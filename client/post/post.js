PostController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params.slug);
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