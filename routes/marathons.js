var express = require("express");
var router  = express.Router();
var Marathon = require("../models/marathon");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Marathon.find({}, function(err, allMarathons){
       if(err){
           console.log(err);
       } else {
          res.render("marathons/index",{marathons:allMarathons});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to marathons array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newMarathon = {name: name, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Marathon.create(newMarathon, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to marathons page
            // console.log(newlyCreated);
            res.redirect("/marathons");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("marathons/new"); 
});

// SHOW - shows more info about one marathon
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Marathon.findById(req.params.id).populate("comments").exec(function(err, foundMarathon){
        if(err){
            console.log(err);
        } else {
            // console.log(foundMarathon);
            //render show template with that marathon
            res.render("marathons/show", {marathon: foundMarathon});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkMarathonOwnership, function(req, res){
    Marathon.findById(req.params.id, function(err, foundMarathon){
        res.render("marathons/edit", {marathon: foundMarathon});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkMarathonOwnership, function(req, res){
    // find and update the correct marathon
    Marathon.findByIdAndUpdate(req.params.id, req.body.marathon, function(err, updatedMarathon){
       if(err){
           res.redirect("/marathons");
       } else {
           //redirect somewhere(show page)
           res.redirect("/marathons/" + req.params.id);
       }
    });
});

// DESTROY MARATHON ROUTE
router.delete("/:id",middleware.checkMarathonOwnership, function(req, res){
   Marathon.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/marathons");
      } else {
          res.redirect("/marathons");
      }
   });
});


module.exports = router;

