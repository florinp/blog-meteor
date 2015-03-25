Blog = {};

Blog.appName = APP_NAME;
Blog.setPageTitle = function(title) {
    document.title = Blog.appName + " - " + title;
};
Blog.generateSlug = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};

BaseController = RouteController.extend({
    layoutTemplate: 'layout'
});

AdminController = RouteController.extend({
    layoutTemplate: 'adminLayout',
    onBeforeAction: function() {
        var user = Meteor.user();
        if(user) {
            if(!Roles.userIsInRole(user, 'admin')) {
                Router.go('/');
            }
            this.next();
        } else {
            Router.go('/');
        }
    }
});