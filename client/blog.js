Template.registerHelper('formatDate', function(date){
    return moment(date).format('DD MMM YYYY HH:MM:ss');
});
Template.registerHelper('shortText', function(text, start, end){
    start = parseInt(start);
    end = parseInt(end);
    text = text.replace(/<img\s.+?(?!\/)>/g, "");
    text = text.replace(/(<([^>]+)>)/ig, "");
    if(text.length > end) {
        text = text.substr(start, end) + ' ...';
    }
    return text;
});
