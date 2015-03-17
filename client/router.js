Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', { path: '/' });
    this.route('admin', {
        layoutTemplate: 'admin/layout'
    });
    this.route('admin/posts', {
        layoutTemplate: 'admin/layout'
    });
    this.route('admin/posts/add', {
        layoutTemplate: 'admin/layout'
    });
    this.route('admin/login', {
        layoutTemplate: ''
    });
});

Router.onBeforeAction(function(){
    if(!Meteor.userId()) {
        Router.go('admin/login');
    } else {
        this.next();
    }
}, { only: ['admin'] });