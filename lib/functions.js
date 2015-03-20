Blog = {};

Blog.appName = APP_NAME;
Blog.setPageTitle = function(title) {
    document.title = Blog.appName + " - " + title;
};
Blog.generateSlug = function(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w ]+/g, '');
};

BaseController = RouteController.extend({
    layoutTemplate: 'layout'
});