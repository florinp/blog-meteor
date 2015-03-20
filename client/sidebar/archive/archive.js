Template.archive.rendered = function() {
    var handle = Tracker.autorun(function() {
        Meteor.subscribe('posts');
    });
};
Template.archive.helpers({
    archives: function() {
        var dates = [];
        var posts = Post.find();
        posts.forEach(function(post){
            var date = moment(post.createdAt);
            //console.log(moment([2015, 2]).toDate());
            dates[date.format("M") + date.format("YYYY")] = {
                name: date.format("MMMM YYYY"),
                month: date.format("M"),
                year: date.format("YYYY")
            };
        });

        dates.sort(function(a, b){
            if(a.year == b.year) {
                return b.month - a.month;
            } else if(a.month == b.month) {
                return b.year - a.year;
            } else {
                return b.month - a.month && b.year - a.year;
            }
        });

        return dates;
    }
});

ArchiveController = BaseController.extend({
    waitOn: function() {
        return Meteor.subscribe('posts');
    },
    data: function() {
        Session.set('month', this.params.month);
        Session.set('year', this.params.year);
    },
    action: function() {
        this.render('archivePosts');
    }
});

Template.archivePosts.helpers({
    posts: function() {
        // /([A-Za-z]){3}(\s)(Mar)(\s)(\d){2}(\s)(2015)(\s)(\d){2}:(\d){2}:(\d){2}(\s)([A-Z]){3}\+(\d){4}(\s)\(([A-Za-z]\w+)(\s)([A-Za-z]\w+)(\s)([A-Za-z]\w+)\)/i
        var year = parseInt(Session.get('year')),
            month = parseInt(Session.get('month'));
        var posts = [];
        var postsCursor = Post.find();

        postsCursor.forEach(function(post) {
            var createdAt = moment(post.createdAt),
                createdMonth = parseInt(createdAt.format("M")),
                createdYear = parseInt(createdAt.format("YYYY"));
            if(createdMonth == month && createdYear == year) {
                posts.push(post);
            } else {
                return;
            }
        });

        return posts;
    }
});