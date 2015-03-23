Router.configure({
    layoutTemplate: 'layout'
});

Router._scrollToHash = function(hash) {
    var section = $(hash);
    if (section.length) {
        var sectionTop = section.offset().top;
        $("html, body").animate({
            scrollTop: sectionTop
        }, "slow");
    }
};

Router.map(function() {
    this.route('home', {
        path: '/',
        controller: 'HomeController'
    });
    this.route('post', {
        path: '/post/:slug',
        controller: 'PostController'
    });
    this.route('archive', {
        path: '/archive/:month/:year',
        controller: 'ArchiveController'
    });
    this.route('admin/posts/edit', {
        path: '/admin/posts/edit/:_id',
        controller: 'EditPostController'
    });
    this.route('admin/posts', {
        path: '/admin/posts',
        controller: 'PostsController'
    });
    this.route('admin/posts/add', {
        path: '/admin/posts/add',
        controller: 'AddPostController'
    });
    this.route('admin/comments', {
        path: '/admin/comments',
        controller: 'CommentsController'
    });
    this.route('admin/comments/view', {
        path: '/admin/comments/view/:_id',
        controller: 'ViewCommentController'
    });
});

Router.onBeforeAction(function(){
    if(!Meteor.userId()) {
        Router.go('/');
    } else {
        this.next();
    }
}, { only: ['admin/posts', 'admin/posts/add', 'admin/posts/edit']});