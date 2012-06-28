var path = require('path');
var util = require('util');
var subs = require(path.join(__dirname, '../subscriptions'));

var results = {'TOTAL': {}};

subs.forEach(function(v) {
    var s = v.subscription;
    if (s.state == 'canceled') return;

    var p = s.product.name;
    var d = new Date(s.created_at);
    d = util.format('%s%s', d.getFullYear(), d.getMonth() + 1);

    results['TOTAL'][d] = results['TOTAL'][d] || 0;
    results['TOTAL'][d]++;

    results[p] = results[p] || {};
    results[p][d] = results[p][d] || 0;
    results[p][d]++;
});

Object.keys(results).forEach(function(k) {
    var periods = Object.keys(results[k]);
    periods.sort();

    var delta = [];
    periods.forEach(function(p) { delta.push(results[k][p]) })

    var sum = delta.reduce(function(m, v) { return m + v; }, 0);

    var prev = 0;
    var total = delta.map(function(v) { prev+=v; return prev;});

    console.log('%s    (sum): %s', k, sum);
    console.log('%s  (delta): %s', k, delta.join(' '));
    console.log('%s  (total): %s', k, total.join(' '));
});
