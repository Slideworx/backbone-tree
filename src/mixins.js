/**
 * Backbone-tree Mixins
 *
 * Provides useful mixins which can be applied to Backbone.Model and used within Collection.
 */

var _ = require('lodash');

module.exports = {
  treeNodeId: 'id',
  treeNodeParentId: 'parentId',

  isTreeRoot: function() {
    return this.treeGetParent() === undefined;
  },

  hasTreeAncestor: function(model) {
    var modelAncestors = model.treeGetPath();

    return modelAncestors.filter(function(ancestor) {
        return ancestor.cid === this.cid;
      }).length > 0;
  },

  treeGetPath: function(models) {
    models = models || [];
    models.unshift(this);

    return this.isTreeRoot() ? models : this.treeGetParent().treeGetPath(models);
  },

  treeAddChild: function(model) {
    model.set(this.treeNodeParentId, this.get(this.treeNodeId));
    this.collection.add(model);
  },

  treeGetRoot: function() {
    var parent = this.treeGetParent();

    return parent ? parent.treeGetRoot() : this;
  },

  treeGetParent: function() {
    if (!this.collection || typeof this.collection.findWhere !== 'function') {
      throw new Error('This model have to be within a collection.');
    }

    var parent,
      parentId = this.get(this.treeNodeParentId),
      whereClause = {};

    if (parentId) {
      whereClause[this.treeNodeId] = parentId;
      parent = this.collection.findWhere(whereClause);
    }

    return parent;
  },

  treeGetChildren: function() {
    var whereClause = {};

    whereClause[this.treeNodeParentId] = this.get(this.treeNodeId);

    return this.collection.where(whereClause);
  },

  treeGetDescendants: function() {
    var models = [];
    var children = this.treeGetChildren();

    models = models.concat(children);

    children.forEach(function(model) {
      var descendants = model.treeGetDescendants(true);
      if (descendants.length) {
        models = models.concat(descendants)
      }
    });

    return models;
  },

  toTreeJSON: function() {
    var node = _.clone(this.attributes),
      children = this.treeGetChildren();

    node.children = _.invoke(children, 'toTreeJSON');

    return node;
  }
};
