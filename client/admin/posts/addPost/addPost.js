AddPostController = AdminController.extend({
    waitOn: function() {
        return Meteor.subscribe('posts');
    },
    action: function() {
        this.render('addPost');
    }
});

Template.addPost.events({
    "submit .addNewPostForm": function(event) {
        event.preventDefault();

        var title = event.target.title.value,
            text = event.target.text.value,
            slug = Blog.generateSlug(title);

        var insert = {
            title: title,
            slug: slug,
            text: text,
            metadata: {
                thumbnail: null
            }
        };
        var fileObj = null;
        var file = $('.fileInput').get(0).files[0];
        if(file) {
            fileObj = Images.insert(file);
        }
        insert.metadata.thumbnail = fileObj;

        console.log(insert);

        Meteor.call('addPost', insert);


        Router.go('admin/posts');

        return false;
    }
});

Template.addPost.rendered = function() {
    $("#text").redactor({
        plugins: ['imagemeteor']
    });
}