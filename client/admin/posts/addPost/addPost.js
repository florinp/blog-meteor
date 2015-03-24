AddPostController = AdminController.extend({
    waitOn: function() {
        return Meteor.subscribe('posts');
    },
    action: function() {
        this.render('addPost');
    }
});
Template.addPost.helpers({
    addPostForm: function() {
        return new SimpleSchema({
            title: {
                type: String,
                label: "Title",
                max: 200
            },
            text: {
                type: String,
                label: "Text",
                min: 20,
                autoform: {
                    rows: 6
                }
            },
            Thumbnail: {
                type: Object,
                label: "Thumbnail",
                optional: true
            }
        });
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