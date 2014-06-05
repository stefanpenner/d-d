export default Ember.ObjectController.extend({
  actions: {
    save: function(model) {
      window.alert('did save: ' + model.name);
    }
  }
});
