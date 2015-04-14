Meteor.methods({
    'addPost': function(options) {

        // check if the slug exist;
        function checkSlug(slug) {
            var posts = Post.find({ slug: slug });
            if(posts.count() > 0) {
                return true;
            }
            return false;
        }

        var slug = options.slug;
        var baseSlug = slug;
        var countSlug = 1;
        while(checkSlug(slug)) {
            countSlug = countSlug + 1;
            slug = baseSlug + "-" + countSlug;
        }
        options.slug = slug;

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
        function checkSlug(slug, postId) {
            var posts = Post.find({ slug: slug });
            var post = posts.fetch()[0];
            if(posts.count() > 0 && post._id != postId) {
                return true;
            }
            return false;
        }

        var slug = options.slug;
        var baseSlug = slug;
        var countSlug = 1;
        while(checkSlug(slug, postId)) {
            countSlug = countSlug + 1;
            slug = baseSlug + "-" + countSlug;
        }
        options.slug = slug;

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
        };

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
    },
    'addComment': function(postSlug, options) {
        var post = Post.findOne({slug: postSlug});
        if(post === 'undefined' || post == null) {
            console.log('Not found');
            throw new Meteor.Error("Not found");
        }

        var comment = {
            postId: post._id,
            name: options.name,
            email: options.email,
            comment: options.comment,
            createdAt: new Date(),
            status: true
        }

        //console.log(comment);

        return Comment.insert(comment);
    },
    'approveComment': function(commentId) {
        Comment.update({_id: commentId}, { $set: { 'status': true } });
    },
    'disapproveComment': function(commentId) {
        Comment.update({_id: commentId}, { $set: { 'status': false } });
    },
    'deleteComment': function(commentId) {
        Comment.remove({_id: commentId});
    },
    'addRating': function(postId, rate) {
        var ip = '0.0.0.0';
        if(!this.connection.clientAddress)
            throw new Meteor.Error(403, "Server Error: You must be connected.");
        else
            ip = this.connection.clientAddress;

        // check rating
        var exists = false;
        var post = Post.findOne({_id: postId});
        if(post.rating) {
            var rating = post.rating;
            rating.forEach(function(item) {
                if(item.ip == ip) {
                    exists = true;
                } else {
                    return;
                }
            });
        }

        if(exists == false) {
            var rating = {
                rate: rate,
                ip: ip,
                createdAt: new Date()
            };

            Post.update({_id:postId}, {$push: { rating: rating }});
        }
    },
    'checkRating': function(postId) {
        var ip = '0.0.0.0';
        if(!this.connection.clientAddress)
            throw new Meteor.Error(403, "Server Error: You must be connected.");
        else
            ip = this.connection.clientAddress;

        // check rating
        var exists = false;
        var post = Post.findOne({_id: postId});
        if(post.rating) {
            var rating = post.rating;
            rating.forEach(function(item) {
                if(item.ip == ip) {
                    exists = true;
                } else {
                    return;
                }
            });
        }

        return exists;
    },
    'editAccount': function(options) {
        var user = Meteor.user();
        if(user) {
            Meteor.users.update({_id: user._id}, {
                $set: {
                    "profile.firstName": options.firstName,
                    "profile.lastName": options.lastName
                }
            });

            return true;
        } else {
            throw new Meteor.Error(403, "You are not logged in!");
        }
    }
});
