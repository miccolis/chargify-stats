var fs = require('fs');
var Step = require('step');
var chargify = require('chargify');
var download = require('./lib/downloader');

try {
    var config = require('./settings');
}
catch(e) {
    console.warn('Failed to load settings.');
    process.exit();
}

var wrapped_site = chargify.wrapSite(config['site-subdomain'], config['site-key']);

Step(function() {
    var fetchSubs = function(err, data, page, callback) {
        wrapped_site('subscriptions').get({per_page:200, page: page}, function(status, resp) {
            if (status !== 200) return this(new Error('Chargify responded with ' + status));
            if (!resp.length) return this(null, data);
            return callback(null, data.concat(resp), ++page, callback);
        }.bind(this));
    }.bind(this);
    fetchSubs(null, [], 1, fetchSubs);
}, function(err, data) {
    if (err) throw err;

    fs.writeFile('subscriptions.json', JSON.stringify(data), 'utf-8', this);
}, function(err) {
    if (err) console.warn(err);
    else console.log('> wrote subscriptions.json');
});
