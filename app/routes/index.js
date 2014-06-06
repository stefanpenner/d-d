export default  Ember.Route.extend({
  model: function() {
    var model = [
      { id:  1, name: "Apple"        },
      { id:  2, name: "Apricot"      },
      { id:  3, name: "Avocado"      },
      { id:  4, name: "Banana"       },
      { id:  5, name: "Breadfruit"   },
      { id:  6, name: "Bilberry"     },
      { id:  7, name: "Blackberry"   },
      { id:  8, name: "Blackcurrant" },
      { id:  9, name: "Blueberry"    },
      { id: 10, name: "Boysenberry"  },
      { id: 11, name: "Cantaloupe"   },
      { id: 12, name: "Currant"      },
      { id: 13, name: "Cherry"       },
      { id: 14, name: "Cherimoya"    },
      { id: 15, name: "Cloudberry"   },
      { id: 16, name: "Coconut"      },
      { id: 17, name: "Cranberry"    },
      { id: 18, name: "Cucumber"     },
      { id: 19, name: "Damson"       },
      { id: 20, name: "Dragonfruit"  },
      { id: 21, name: "Durian"       },
      { id: 22, name: "Eggplant"     },
      { id: 23, name: "Elderberry"   },
      { id: 24, name: "Feijoa"       },
      { id: 25, name: "Fig"          },
      { id: 26, name: "Goji berry"   },
      { id: 27, name: "Gooseberry"   },
      { id: 28, name: "Grape"        }
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
