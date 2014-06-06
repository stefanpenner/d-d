export default Ember.ArrayController.extend({
  actions: {
    save: function(model) {
      window.alert('did save: ' + model.name);
    },
    itemWasMoved: function(model, from, to) {
      Ember.Logger.info('itemWasMoved', model, from, '->', to);
    }
  }
});
