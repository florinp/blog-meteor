EditPostController = AdminController.extend({
    waitOn: function() {
        return Meteor.subscribe('postForEdit', this.params._id);
    },
    data: function() {
        Session.set('postId', this.params._id);
        return {
            post: Post.findOne({_id: this.params._id})
        };
    },
    action: function() {
        this.render('editPost');
    }
});

Template.editPost.rendered = function() {
    $("#text").redactor({
        plugins: ['imagemeteor', 'imagemanager']
    });
};
Template.editPost.helpers({
    editPostForm: function() {
        return new SimpleSchema({
            title: {
                type: String,
                label: "Title",
                max: 200
            },
            slug: {
                type: String,
                label: "Slug",
                max: 200,
                optional: true
            },
            text: {
                type: String,
                label: "Text",
                min: 20,
                autoform: {
                    rows: 6,
                    id: "text"
                }
            }
        });
    }
});
Template.editPost.events({
    "submit .editPostForm": function(event) {
        event.preventDefault();

        var title = event.target.title.value,
            text = event.target.text.value,
            slug = event.target.slug.value;

        var update = {
            title: title,
            text: text,
            slug: slug,
            metadata: {
                thumbnail: null
            }
        };
        var fileObj = null;
        var file = $('.fileInput').get(0).files[0];
        if(file) {
            fileObj = Images.insert(file);
        }
        update.metadata.thumbnail = fileObj;

        var postId = Session.get('postId');

        Meteor.call('editPost', postId, update);

        Router.go('admin/posts');

        return false;
    }
});
Template.editPost.helpers({
    getThumbnail: function(thumbnail) {
        var file = new FS.File(thumbnail);
        return file.url({
            store: 'systemImages'
        });
    }
});