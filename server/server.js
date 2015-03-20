Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: null
});

Accounts.onCreateUser(function(opts, user) {
    var d6 = function () { return Math.floor(Random.fraction() * 6) + 1; };
    user.dexterity = d6() + d6() + d6();
    // We still want the default hook's 'profile' behavior.
    if (opts.profile)
        user.profile = opts.profile;
    return user;
});

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
Meteor.publish('archivedPosts', function(month, year){
    // /([A-Za-z]){3}(\s)(Mar)(\s)(\d){2}(\s)(2015)(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)/i
    var date = moment([year, month - 1]);
    var posts = Post.find({
        createdAt: { $regex: '([A-Za-z]){3}(\s)('+ date.format("MMM") +')(\s)(\d){2}(\s)('+ date.format("YYYY") +')(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)', $options: 'i' }
    });
    console.log("Posts count: " + posts.count());
    return posts;
});

Meteor.publish('appUsers', function() {
    return Meteor.users.find();
});

Meteor.methods({
    'addPost': function(options) {

        // check if the slug exists
        var post = Post.findOne({ slug: options.slug });
        if(post) {
            console.log('Slug: ' + options.slug);
            console.log('Post slug: ' + post.slug);
            if(post.slug == options.slug) {
                var slug_split = post.slug.split('-');
                var no = (slug_split[slug_split.length-1 !== parseInt(slug_split[slug_split.length-1])] ) ? (parseInt(slug_split[slug_split.length-1]) + 1) : null;
                var count = no != null ? no : 2;
                options.slug = options.slug + "-" + count;
            }
        }

        var post = {
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            title: options.title,
            slug: options.slug,
            text: options.text,
            metadata: options.metadata,
            createdAt: new Date(),
            updatedAt: null
        };
        Post.insert(post);
    },
    'editPost': function(postId, options) {

        // check if the slug exists
        var post = Post.findOne({ slug: options.slug });
        if(post) {
            console.log('Slug: ' + options.slug);
            console.log('Post slug: ' + post.slug);
            if(post.slug == options.slug && post._id != postId) {
                var slug_split = post.slug.split('-');
                var no = (slug_split[slug_split.length-1 !== parseInt(slug_split[slug_split.length-1])] ) ? (parseInt(slug_split[slug_split.length-1]) + 1) : null;
                var count = no != null ? no : 2;
                options.slug = options.slug + "-" + count;
            }
        }

        var post = {
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            title: options.title,
            slug: options.slug,
            text: options.text,
            metadata: {
                thumbnail: options.metadata.thumbnail != null ? options.metadata.thumbnail : Post.findOne({_id: postId}).metadata.thumbnail
            },
            createdAt: Post.findOne({_id: postId}).createdAt,
            updatedAt: new Date()
        }

        Post.update({_id: postId}, post);
    },
    'deletePost': function(postId) {
        Post.remove({_id: postId});
    },
    'getArchivedPosts': function(month, year) {
        // /([A-Za-z]){3}(\s)(Mar)(\s)(\d){2}(\s)(2015)(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)/i
        var date = moment([year, month - 1]);
        var posts = Post.find({
            createdAt: { $regex: '([A-Za-z]){3}(\s)('+ date.format("MMM") +')(\s)(\d){2}(\s)('+ date.format("YYYY") +')(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)', $options: 'i' }
        });
        console.log(posts);
        return posts;
    }
});

Meteor.startup(function() {
    user_count = Meteor.users.find({username: 'florin'}).count();
    if(user_count == 0) {
        Accounts.createUser({
            username: 'florin',
            email: 'florin.pavel@east-wolf.com',
            password: '123456',
            profile: {
                firstName: 'Florin',
                lastName: 'Pavel'
            }
        });
    }
});