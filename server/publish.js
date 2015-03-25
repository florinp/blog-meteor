Meteor.publish('singlePost', function(slug){
    var post = Post.find({slug: slug});
    var count = post.count();
    if(count == 0) {
        console.log('Not found');
        throw new Meteor.Error('Post not found!');
    }

    return post;
});
Meteor.publish('postForEdit', function(id){
    var post = Post.find({_id: id});
    var count = post.count();
    if(count == 0) {
        console.log('Not found');
        throw new Meteor.Error('Post not found!');
    }

    return post;
});
Meteor.publish('posts', function(){
    return  [
        Post.find({}, { sort: { createdAt: -1 }}),
        Images.find()
    ];
});
Meteor.publish('morePosts', function(limit) {
    if(limit > Post.find().count()) {
        limit = 0;
    }
    return Post.find({}, {limit: limit});
});
Meteor.publish('comments', function(postSlug) {
    var post = Post.findOne({slug: postSlug});
    if(post === 'undefined' || post == null) {
        console.log('Not found');
        throw new Meteor.Error("Not found");
    }

    var comments = Comment.find({postId: post._id});

    return comments;
});
Meteor.publish('commentsForEdit', function() {
    return Comment.find({}, { sort: { createdAt: -1 } });
});
Meteor.publish('archivedPosts', function(month, year){
    // /([A-Za-z]){3}(\s)(Mar)(\s)(\d){2}(\s)(2015)(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)/i
    var date = moment([year, month - 1]);
    var posts = Post.find({
        createdAt: { $regex: '([A-Za-z]){3}(\s)('+ date.format("MMM") +')(\s)(\d){2}(\s)('+ date.format("YYYY") +')(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)', $options: 'i' }
    });
    console.log("Posts count: " + posts.count());
    return posts;
});

Meteor.publish('roles', function(){
    return Roles.find();
});

Meteor.publish('appUsers', function() {
    return Meteor.users.find();
});