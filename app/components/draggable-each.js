import Ember from 'ember';

var a_slice = Array.prototype.slice;

function index(element, selector) {
  return element.parent().children(selector).index(element);
}

function applySortable(el, target, method, itemSelector, handleSelector, connectWith) {
  if (el) {
    var options = {
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
        var source = ui.item.__source__;

        Ember.run(function() {
          target.viewReceived(Ember.View.views[ui.item.attr('id')], source);
        });
      }
    };

    options.connectWith = connectWith || false;

    if (itemSelector)   { options.item   = itemSelector;   }
    if (handleSelector) { options.handle = handleSelector; }

    el.sortable(options);
  }
}

function destroySortable(element) {
  if (element) {
    element.sortable('destroy');
  }
}

var get = Ember.get;

export default Ember.CollectionView.extend(Ember.TargetActionSupport, {
  isVirtual: true,
  classNames: ['ember-drag-list'],
  content: Ember.computed.oneWay('context'),
  handleSelector: null,
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
      cloneKeywords: function () {
        var templateData = get(this, 'templateData');

        var keywords = templateData ? Ember.copy(templateData.keywords) : {};

        Ember.set(keywords, 'view', this._clonedKeywords$view = this._clonedKeywords$view || Ember.ObjectProxy.create({
          content: this._keywords$view = (this.isVirtual ? keywords.view : this)
        }));

        Ember.set(keywords, '_view', this);
        Ember.set(keywords, 'controller', this._clonedKeywords$controller = this._clonedKeywords$controller || Ember.ObjectProxy.create({
          content: get(this, 'controller')
        }));

        return keywords;
      },
      isVirtual: true,
      context: Ember.computed.oneWay('content'),
      template: this.get('template'),
      classNames: ['draggable-item'],
      didInsertElement: function () {
        // hack to support eventDispatcher
        Ember.View.views[this.get('elementId')] = this;
      },

      willDestroyElement: function () {
        // hack to support eventDispatcher
        delete Ember.View.views[this.get('elementId')];
      }
    }));

    this._super.apply(this, arguments);
  },

  didInsertElement: function () {
    Ember.View.views[this.get('elementId')] = this;
    applySortable(this.$(), this, 'itemWasDragged', this.get('itemSelector'), this.get('handleSelector'), this.get('connectWith'));
  },

  willDestroyElement: function () {
    delete Ember.View.views[this.get('elementId')];
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

  viewReceived: function(view /*, source */) {
    view.set('parentView', this.get('parentView'));

    view._clonedKeywords$view.set('content', this.templateData.keywords.view);
    view._clonedKeywords$controller.set('content', this.templateData.keywords.controller);
  },

  arrayWillChange: function() {
    if (this.updateDisabled) { return ;}
    this._super.apply(this, arguments);
  },

  arrayDidChange: function() {
    if (this.updateDisabled) { return ;}
    this._super.apply(this, arguments);
  },
  // - [x] ensure childViews is invalidated
  // - [x] nonVirtualChildViews (may be fixed by isVirtal)
  // - [ ] insertItem hook
  // - [ ] removeItem hook
  // - [x] "view" within children be from the outer scope (may be fixed by isVirtal)
  // - [x] keywords from outercontext should change when moved between trees (may be fixed by isVirtal)
  // - [ ] make eventDispatcher not block the move event stuff (caused by virtual)
  itemWasDragged: function (oldIndex, newIndex, source) {
    var sourceList = source.get('context');
    var targetList = this.get('context');

    this.updateDisabled = true;

    var object = sourceList.objectAt(oldIndex);
    var entry = object.isController ? object.get('content') : object;
    var view = source._childViews.splice(oldIndex, 1)[0];

    try {
      this._childViews.splice(newIndex, 0,  view);

      source.updateDisabled = true;

      sourceList.removeAt(oldIndex);
      targetList.insertAt(newIndex, entry);

      Ember.propertyDidChange(source, 'childViews');
      Ember.propertyDidChange(this, 'childViews');
    } finally {
      source.updateDisabled = false;
      this.updateDisabled = false;
    }

    this.sendAction('itemWasMoved', entry, oldIndex, newIndex, sourceList);
  }
});
