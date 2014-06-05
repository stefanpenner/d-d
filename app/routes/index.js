export default  Ember.Route.extend({
  model: function() {
    var model = {
      fruit: [
        { id: 1, name: 'apple' },
        { id: 2, name: 'pear'  },
        { id: 3, name: 'banana'},
        { id: 4, name: 'kiwi'  }
      ]
    };

    setTimeout(function () {
      model.fruit.pushObject({
        id: 5,
        name: 'orange'
      });
      model.fruit.removeObject(model.fruit[2]);
    }, 2000);

    return model;
  }
});
