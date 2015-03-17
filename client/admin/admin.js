Template.adminLogin.events({
    'submit .form-signin': function(event) {
        event.preventDefault();
        var email = event.target.email.value,
            password = event.target.password.value;

        Meteor.loginWithPassword(email, password, function(err) {
           if(err) {
               console.log(err);
           } else {
               console.log('Success');
               Router.go('admin');
           }
        });

        return false;
    }
});

Template.adminNavigation.events({
    'click .logoutBtn': function(event) {
        event.preventDefault();

        Meteor.logout(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('success');
                Router.go('admin/login');
            }
        });

        return false;
    }
});

Template.adminSidebar.helpers({
    menu: [
        {route: 'admin', label: 'Dashboard'},
        {route: 'admin/posts', label: 'Posts'},
        {route: 'admin/posts/add', label: 'Add post'}
    ]
});

Template.adminPosts.helpers({
    posts: function() {
        return Post.find({}, {sort: {createdAt: -1}});
    }
});

Template.adminPostsAdd.events({
    "submit .addPostForm": function(event) {
        event.preventDefault();

        var text = event.target.text.value,
            title = event.target.title.value;

        Post.insert({
            userId: Meteor.userId(),
            title: title,
            text: text,
            createdAt: new Date()
        });

        Router.go('/admin/posts');

        return false
    }
});