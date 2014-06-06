export default  Ember.Route.extend({
  model: function() {
    var model = [
      { id: 1, name: 'apple' },
      { id: 2, name: 'pear'  },
      { id: 3, name: 'banana'},
      { id: 4, name: 'kiwi'  }
    ];

    // similate some stuff
    setTimeout(function () {
      model.pushObject({
        id: 5,
        name: 'orange'
      });

      model.removeAt(2);
    }, 2000);

    return model;
  }
});
