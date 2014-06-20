import Ember from 'ember';

var a_slice = Array.prototype.slice;

function index(element, selector) {
  return element.parent().children(selector).index(element);
}

function applySortable(el, target, method, itemSelector, handleSelector) {
  if (el) {
    el.sortable({
      items: itemSelector,
      handle: handleSelector,
      start: function(e, ui) {
        ui.item.data('dragon-drop-old-index', index(ui.item, itemSelector));
      },
      update: function(e, ui) {
        var newIndex = index(ui.item, itemSelector);
        var oldIndex = ui.item.data('dragon-drop-old-index');

        Ember.run(target, method, oldIndex, newIndex);
      }
    });
  }
}

function destroySortable(element) {
  if (element) {
    element.sortable('destroy');
  }
}
function refreshSortable(element) {
  if (element) {
    element.sortable('refresh');
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
    this.set('itemViewClass', Ember.View.extend({
      context: Ember.computed.oneWay('content'),
      template: this.get('template')
    }));
    this._super.apply(this, arguments);
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

      if (output !== undefined) {
        buffer.push(output);
      }
    }
  },

  didInsertElement: function () {
    applySortable(this.$(), this, 'itemWasDragged', this.get('itemSelector'), this.get('handleSelector'));
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

  itemWasDragged: function (oldIndex, newIndex) {
    var content = this.get('content');

    this.updateDisabled = true;
    var object = content.objectAt(oldIndex);
    content.removeAt(oldIndex);
    content.insertAt(newIndex, object);
    this.sendAction('itemWasMoved', object, oldIndex, newIndex);
    this.updateDisabled = false;
  }
});
