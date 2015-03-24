Post = new Meteor.Collection('post');
Comment = new Meteor.Collection('comment');
Rating = new Meteor.Collection('rating');

var imageStoreFileSytem = new FS.Store.FileSystem("systemImages", { path: "~/uploads" });
var imageStore = new FS.Store.GridFS("mongoImages");
Images = new FS.Collection("images", {
    stores: [imageStoreFileSytem]
});
Images.deny({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    },
    download: function(){
        return false;
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