Blog.setPageTitle('Home');

var posts_incement = 20;
Session.setDefault('postsLimit', posts_incement);
HomeController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('morePosts', Session.get('postsLimit'));
    },
    data: function() {
        return {
            posts: function() {
                return Post.find({}, {sort: {createdAt: -1}, limit: Session.get('postsLimit')});
            }
        }
    },
    action: function() {
        this.render('home');
    }
});

Template.home.helpers({
    moreResults: function() {
        return !(Post.find().count() <= Session.get('postsLimit'));
    }
});
Template.home.events({
    "click .load-more": function(event) {
        Session.set('postsLimit', Session.get('postsLimit') + posts_incement);
        console.log(Session.get('postsLimit'));
        return false;
    }
});

/*
Template.home.rendered = function() {
    $(window).scroll(function(){
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            Session.set('postsLimit', Session.get('postsLimit') + posts_incement);
        }
    });
};
*/
