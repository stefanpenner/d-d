function applySortable(el, target, method) {
  if (el) {
    el.sortable().bind('sortupdate', function(e, ui) {
      var newIndex = ui.item.index();
      var oldIndex = ui.oldindex;

      Ember.run(target, method, oldIndex, newIndex);
    });
  }
}

function destroySortable(el) {
  if (el) {
    el.sortable('destroy');
  }
}

export default Ember.Component.extend({
  values: undefined,

  classNames: ['ember-drag-list'],

  render: function (buffer) {
    var values = this.get('values');
    var template = this.get('template');
    var view = this;

    if (values) {
      values.forEach(function (value) {
        buffer.push(template(value, {
          data: {
            buffer: buffer,
            view: view,
            keywords: view.templateData.keywords
          }
        }));
      });
    }
  },

  didInsertElement: function () {
    applySortable(this.$(), this, 'itemDragged');
  },

  willDestroyElement: function () {
    destroySortable(this.$());
  },

  itemDragged: function (oldIndex, index) {
    var values = this.get('values');

    this.updateDisabled = true;
    var object = values.objectAt(oldIndex);
    values.removeAt(oldIndex);
    values.insertAt(index, object);
    this.updateDisabled = false;
  },

  valuesWillChange: function () {
    var values = this.get('values');
    if (values) {
      values.removeArrayObserver(this);
    }
  }.observesBefore('values'),

  valuesDidChange: function () {
    var values = this.get('values');
    if (values) {
      values.addArrayObserver(this);
    }
  }.observes('values').on('init'),

  arrayWillChange: function (values, start, removeCount /*, addCount */) {
    if (this.updateDisabled) return;
    var ul = this.$();
    if (ul) {
      this.$sortables().slice(start, start+removeCount).remove();
    }
  }.on('values'),

  $sortables: function() {
    return this.$('>');
  },

  _reload: function() {
    var ul = this.$();
    if (ul) {
      ul.sortable('reload');
    }
  },

  arrayDidChange: function (values, start, removeCount, addCount) {
    if (this.updateDisabled) return;
    var ul = this.$();
    if (ul) {
      if (addCount > 0) {
        // don't naively re-render, instead render and insert
        this.rerender();
      }
      Ember.run.schedule('afterRender', this, this._reload);
    }
  }
});
