var Step = require('step');
var fs = require('fs');
var chargify = require('chargify');
var wrapped_site = chargify.wrapSite('SITE-SUBDOMAIN', 'SITE-KEY');

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
    fs.writeFileSync('subscriptions.js', 'site.init(' + JSON.stringify(data) + ');', 'utf-8');
});
