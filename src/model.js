var Backbone = require('backbone');
var treeMixins = require('./mixins');

module.exports = Backbone.Model
  .extend(treeMixins)
  .extend({
    defaults: {},
    sync: function() {
      return false;
    }
  });
