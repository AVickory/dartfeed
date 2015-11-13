var User = require('./userModel.js');

module.exports = {

  getUser: function(req, res, next){
    User.find({fbId: req.params.user_id}, function (err, user){
      if(err){
        console.log(err);
      } else{  
        res.json(user);
      }
    });
  },

  getAllUsers: function(req, res, next){
    User.find(null, function (err, users){
      if(err){
        res.send(err);
      }  
      res.json(users);
    });
  },

  updateUser: function(req, res, next){
    User.find({fbId: req.params.user_id}, function (err, users){
      if(err){
        res.send(err);
      } 
      users[0].categories = req.body.categories;  
      console.log(users[0]);
      console.log(req.body.categories);
      users[0].save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'User updated!' });
      });
    });
  }
}
