export default Ember.ArrayController.extend({
  actions: {
    save: function(model) {
      window.alert('did save: ' + model.name);
    }
  }
});
