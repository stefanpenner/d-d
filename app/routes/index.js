export default  Ember.Route.extend({
  model: function() {
    var model = {
      fruits: ['apple','pear','banana','kiwi']
    };

    setTimeout(function () {
      model.fruits.pushObject('orange');
      model.fruits.removeObject('pear');
    }, 2000);

    return model;
  }
});
