Post = new Meteor.Collection('post');
Comment = new Meteor.Collection('comment');
Rating = new Meteor.Collection('rating');

var imageStoreFileSystem = new FS.Store.FileSystem("systemImages", { path: "~/uploads/images" });
Images = new FS.Collection("images", {
    stores: [imageStoreFileSystem],
    filter: {
        allow: {
            contentTypes: ['image/*'] //allow only images in this FS.Collection
        }
    }
});
Images.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    },
    download: function(){
        return true;
    }
});

Avatars = new FS.Collection("avatars", {
    stores: [
        new FS.Store.FileSystem("avatarsStore", {
            path: "~/uploads/avatars"
        })
    ]
});
Avatars.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    },
    download: function(){
        return true;
    }
});