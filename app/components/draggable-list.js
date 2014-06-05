function applySortable(el, target, method) {
  if (el) {
    el.sortable().bind('sortupdate', function(e, ui) {
      var newIndex = ui.item.index();
      var id = ui.item.data('id');
      var context = target.get('values').findProperty('id', id);

      Ember.run(target, method, context, newIndex);
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

  tagName: 'ul',
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

  itemDragged: function (value, index) {
    var values = this.get('values');

    this.updateDisabled = true;
    values.removeObject(value);
    values.insertAt(index, value);
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
    // remove it on the UI item
    if (ul) {
      ul.sortable('destroy');
      ul.find('li').slice(start, start+removeCount).remove();
    }
  }.on('values'),

  arrayDidChange: function (values, start, removeCount, addCount) {
    if (this.updateDisabled) return;
    var ul = this.$();
    if (ul) {
      if (addCount > 0) {
        // render in a sane way
        this.rerender();
      }
      applySortable(ul, this, 'itemDragged');
    }
  }
});
