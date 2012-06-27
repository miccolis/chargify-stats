
var site = site || {};

site.init = function(subscriptions) {
  subscriptions = _(subscriptions).pluck('subscription');

  var dates = _(subscriptions).chain()
    .filter(function(subscription) { return subscription.created_at })
    .groupBy(function(subscription) {
      return (new Date(subscription.created_at)).format('Y m');
    })
    .keys()
    .sortBy(function(month) { return month; })
    .value();

  var byCreatedDate = _(subscriptions).chain()
    .filter(function(subscription) { return subscription.created_at })
    .groupBy(function(subscription) {
      return (new Date(subscription.created_at)).format('Y m');
    })
    .map(function(month, key) { return [key, month.length]; })
    .sortBy(function(month) { return month[0]; })
    .map(function(month) { return month[1]; })
    .value();

  var byCanceledDate = _(subscriptions).chain()
    .filter(function(subscription) { return subscription.canceled_at })
    .groupBy(function(subscription) {
      return (new Date(subscription.canceled_at)).format('Y m');
    })
    .map(function(month, key) { return [key, month.length]; })
    .sortBy(function(month) { return month[0]; })
    .map(function(month) { return month[1]; })
    .value();

  _(dates).zip(byCreatedDate, byCanceledDate)
  var combine = _(dates).chain()
    .zip(byCreatedDate, byCanceledDate)
    .map(function(month) { return month.concat([month[1] - month[2]]) })
    .value();

  console.log(combine);

};
