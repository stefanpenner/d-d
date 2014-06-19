import Ember from 'ember';

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

var get = Ember.get;

document.ontouchmove = function(event){
    event.preventDefault();
};

export default Ember.Component.extend({
  values: undefined,

  classNames: ['ember-drag-list'],

  render: function (buffer) {
    var values = this.get('values');
    var view = this;

    if (values) {
      values.forEach(function (value) {
        view._renderEntry(value, buffer);
      });
    }
  },

  _renderEntry: function(context, buffer) {
    var template = get(this, 'template');

    if (template) {
      var keywords = this.cloneKeywords();
      var output;

      var data = {
        view: this,
        buffer: buffer,
        isRenderData: true,
        keywords: keywords,
        insideGroup: get(this, 'templateData.insideGroup')
      };

      data.keywords.controller = context;
      output = template(context, { data: data });

      if (output !== undefined) { buffer.push(output); }
    }
  },

  didInsertElement: function () {
    applySortable(this.$(), this, 'itemWasDragged');

  },

  willDestroyElement: function () {
    destroySortable(this.$());
  },

  itemWasDragged: function (oldIndex, newIndex) {
    var values = this.get('values');

    this.updateDisabled = true;
    var object = values.objectAt(oldIndex);
    values.removeAt(oldIndex);
    values.insertAt(newIndex, object);
    this.sendAction('itemWasMoved', object, oldIndex, newIndex);
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
    if (this.updateDisabled) { return; }
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
      //ul.sortable('reload');
    }
  },

  arrayDidChange: function (values, start, removeCount, addCount) {
    if (this.updateDisabled) { return; }
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
