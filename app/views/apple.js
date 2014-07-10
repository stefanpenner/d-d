import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['foo', 'bar'],
  didInsertElement: function() {
    console.log('apple#didInsertElement');
    this._super();
  }
});
