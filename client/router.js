Router.configure({
    layoutTemplate: 'layout'
});

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
});

Router.onBeforeAction(function(){
    if(!Meteor.userId()) {
        Router.go('/');
    } else {
        this.next();
    }
}, { only: ['admin/posts', 'admin/posts/add', 'admin/posts/edit']});