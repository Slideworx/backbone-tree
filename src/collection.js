var Backbone = require('backbone');
var TreeModel = require('./model');

module.exports = Backbone.Collection.extend({
  model: TreeModel,
  comparator: 'order'
});
