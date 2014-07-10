import Ember from 'ember';

var a_slice = Array.prototype.slice;

function index(element, selector) {
  return element.parent().children(selector).index(element);
}

function applySortable(el, target, method, itemSelector, handleSelector, connectWith) {
  if (el) {
    el.sortable({
      items: itemSelector,
      handle: handleSelector,
      connectWith: connectWith,

      start: function(e, ui) {
        ui.item.data('dragon-drop-old-index', index(ui.item, itemSelector));
        ui.item.__source__ = target;
      },

      update: function(e, ui) {
        var newIndex = index(ui.item, itemSelector);
        var oldIndex = ui.item.data('dragon-drop-old-index');
        var source = ui.item.__source__;

        if (ui.item.closest('.ember-drag-list').attr('id') === target.get('elementId')) {
          Ember.run(function() {
            target[method](oldIndex, newIndex, source);
          });
        }
      },
      receive: function (e, ui) {
        var newIndex = index(ui.item, itemSelector);
        var oldIndex = ui.item.data('dragon-drop-old-index');
        var source = ui.item.__source__;

        Ember.run(function() {
          target.viewRecieved(Ember.View.views[ui.item.attr('id')], source);
        });
      }
    });
  }
}

function destroySortable(element) {
  if (element) {
    element.sortable('destroy');
  }
}

var get = Ember.get;

export default Ember.CollectionView.extend(Ember.TargetActionSupport, {
  classNames: ['ember-drag-list'],
  content: Ember.computed.oneWay('context'),
  handleSelector: '.draggable-item-handle',
  itemSelector: '.draggable-item',
  target: Ember.computed.oneWay('controller'),
  init: function() {

    var itemView = this.get('itemView');
    var ItemViewClass;

    if (itemView) {
      ItemViewClass = this.container.lookupFactory('view:' + itemView);
    } else {
      ItemViewClass = this.get('itemViewClass');
    }

    this.set('itemViewClass', ItemViewClass.extend({
      context: Ember.computed.oneWay('content'),
      template: this.get('template'),
      classNames: ['draggable-item']
    }));

    this._super.apply(this, arguments);
  },

  didInsertElement: function () {
    applySortable(this.$(), this, 'itemWasDragged', this.get('itemSelector'), this.get('handleSelector'), this.get('connectWith'));
  },

  willDestroyElement: function () {
    destroySortable(this.$());
  },
  // lifted from Ember.Compontent
  sendAction: function(action) {
    var actionName;
    var contexts = a_slice.call(arguments, 1);

    // Send the default action
    if (action === undefined) {
      actionName = get(this, 'action');
    } else {
      actionName = get(this, action);
    }

    // If no action name for that action could be found, just abort.
    if (actionName === undefined) { return; }

    this.triggerAction({
      action: actionName,
      actionContext: contexts
    });
  },

  viewRecieved: function(view, source) {
    view.set('parentView', this);
  },

  arrayWillChange: function() {
    if (this.updateDisabled) { return ;}
    this._super.apply(this, arguments);
  },

  arrayDidChange: function() {
    if (this.updateDisabled) { return ;}
    this._super.apply(this, arguments);
  },

  itemWasDragged: function (oldIndex, newIndex, source) {
    var sourceList = source.get('context');
    var targetList = this.get('context');

    this.updateDisabled = true;

    var object = sourceList.objectAt(oldIndex);

    var entry = object.isController ? object.get('content') : object;

    var view = source._childViews.splice(oldIndex, 1)[0];

    this._childViews.splice(newIndex, 0,  view);

    source.updateDisabled = true;
    sourceList.removeAt(oldIndex);
    targetList.insertAt(newIndex, entry);
    source.updateDisabled = false;

    this.sendAction('itemWasMoved', entry, oldIndex, newIndex, sourceList);

    this.updateDisabled = false;
  }
});
