var express = require('express');
var router = express.Router();

// ItemLibrary class
function ItemLibrary() {
  this.items = [];
  this.id = 0;
}

// methods
ItemLibrary.prototype.addItem = function(name) {
  // add new item to the library

  var newItem = {name: name, id: this.id};
  this.items.push(newItem);
  this.id += 1;
};

// create some
var storage = new ItemLibrary();
storage.addItem('Noodles');
storage.addItem('Tomatoes');
storage.addItem('Peppers');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/items', function(req, res) {
  res.json(storage.items);
});

router.post('/items', function(req, res) {
  storage.addItem(req.body.name);
  res.json({message: 'Item added.'});
});

router.put('/item/:id', function(req, res) {
  console.log(typeof req.params.id);
  // handle some errors
  if (Object.keys(req.body).length === 0) {
    res.json({message: 'Please enter something to change.'});
  }
  if (req.body.name && typeof req.body.name !== 'string') {
    res.json({message: 'Please enter a string for name.'});
  }
  if (req.params.id && isNaN(+req.params.id)) {
    res.json({message: 'Please enter an integer for ID.'});
  }

  var item = storage.items.filter(function(someItem) {
    return someItem.id === +req.params.id;
  });

  if (item.length > 0) {
    for (var i = 0; i < storage.items.length; i++) {
      if (storage.items[i].id === +req.params.id) {
        for (var key in req.body) {
          if (key === 'id') {
            storage.items[i].id = +req.body.id;
          }
          else if (key === 'name') {
            storage.items[i].name = req.body.name;
          }
        }
      }
    }
    res.json({
      message: 'Success!',
      list: storage.items
    });
  }
  else {
    res.json({message: 'Item not found.'});
  }
});

router.delete('/item/:id', function(req, res) {
  var item = storage.items.filter(function(someItem) {
    return someItem.id === +req.params.id;
  });

  if (item.length > 0) {
    for (var i = 0; i < storage.items.length; i++) {
      if (storage.items[i].id === +req.params.id) {
        var spliced = storage.items.splice(i, 1);
        res.json({
          message: 'Item deleted.',
          item: spliced
        });
      }
    }
  }
  else {
    res.json({message: 'Item not found.'});
  }
});

module.exports = router;
