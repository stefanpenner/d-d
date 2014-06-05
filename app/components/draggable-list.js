function applySortable(el, target, method) {
  if (el) {
    el.sortable().bind('sortupdate', function(e, ui) {
      Ember.run(target, method, ui.item.text(), ui.item.index());
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
    if (values) {
      values.forEach(function (value) {
        buffer.push('<li>'+value+'</li>');
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
    if (ul) {
      ul.sortable('destroy');
      ul.find('li').slice(start, start+removeCount).remove();
    }
  }.on('values'),

  arrayDidChange: function (values, start, removeCount, addCount) {
    if (this.updateDisabled) return;
    var ul = this.$();
    if (ul) {
      values.slice(start, start+addCount).forEach(function (value) {
        $('<li></li>').text(value).appendTo(ul);
      });
      applySortable(ul, this, 'itemDragged');
    }
  }
});
