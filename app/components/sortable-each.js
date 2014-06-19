import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['touch-action'],
  'touch-action': 'none',

  didInsertElement: function() {
    var events = [
      // base events
      'click',
      'pointerdown',
      'pointerup',
      'pointermove',
      'pointerover',
      'pointerout',
      'pointerenter',
      'pointerleave'
    ];

    var el = this.get('element');
    events.forEach(function(en) {
      el.addEventListener(en, function(inEvent) {
        window.console.log(inEvent.type + ' [' + inEvent.pointerId + ']');
      });
    });
  }
});

/*
 * states:
 * - idle
 * - dragging
 *
 * events:
 * - click
 * - pointerdown
 *   is the target (or a parent of it, a target draaggable?) if so, to set the
 *   draggable as the selectedElement, and transition to "dragging"
 * - pointerup
 * - pointermove
 * - pointerover
 * - pointerout
 * - pointerenter
 * - pointerleave
 */

function Sortable(view) {
  this.selected    = undefined;
  this.down        = false;
  this.view        = view;
  this.states      = states;
  this.placeholder = undefined;
}

Sortable.prototype.send = function(name, event) {
  this.state[name].call(this, event);
};

var states = {
  idle: {
    click:        function() { },
    pointerdown:  function() {
      // is the target (or a parent of it, a target draaggable?) if so, to set the
      // draggable as the selectedElement, and transition to "dragging"
    },
    pointerup:    function() { },
    pointermove:  function() { },
    pointerover:  function() { },
    pointerout:   function() { },
    pointerenter: function() { },
    pointerleave: function() { }
  },

  dragging: {
    click:        function() { },
    pointerdown:  function() { },
    pointerup:    function() {
      // are we over a dropZone?
      //  - yes: insert
      //  - no:  snap back
    },
    pointermove:  function() {
      // are we within the bounds?
      //  - yes: update selectedElements position
      //  - no:  noop
    },
    pointerover:  function() {

    },
    pointerout:   function() {

    },
    pointerenter: function() {

    },
    pointerleave: function() {

    }
  }
};
