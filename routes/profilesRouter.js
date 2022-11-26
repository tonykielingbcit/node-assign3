const express = require("express");
const profilesRouter = express.Router();
const path = require("path");
const fs = require("fs").promises;
const profileController = require("../controller/ProfileController.js");

profilesRouter.get("/", profileController.Index);

profilesRouter.post("/search", profileController.Search);

profilesRouter.get("/create", profileController.Create);
profilesRouter.post("/create", profileController.CreateProfile);

profilesRouter.get("/:id", profileController.Detail);

profilesRouter.get("/delete/:id", profileController.Delete);
profilesRouter.post("/delete/:id", profileController.DeleteProfile);

profilesRouter.get("/edit/:id", profileController.EditProfile);
profilesRouter.post("/update/:id", profileController.UpdateProfile);



profilesRouter.get("/create", (req, res) => {
  fs.readFile(path.join(__dirname, "../data/profiles.json"))
  .then((contents) => {
      
    // need to parse the raw buffer as json if we want to work with it
    const profilesJson = JSON.parse(contents);
    
    //   prepare and send an OK response
    res.render("create", {
      title: "Express Yourself - Create Profile",
      profiles: profilesJson,
    });
  })
  .catch((err) => {
    console.log(err);
    res.writeHead(500);
    res.end("Error");
  });
});


profilesRouter.get("/edit/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "../data/profiles.json"))
  .then((contents) => {
      
    // need to parse the raw buffer as json if we want to work with it
    const profilesJson = JSON.parse(contents);
    
    //   prepare and send an OK response
    res.render("edit", {
      title: "Express Yourself - Edit Profile",
      profiles: profilesJson,
    });
  })
  .catch((err) => {
    console.log(err);
    res.writeHead(500);
    res.end("Error");
  });
});


profilesRouter.get("/delete/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "../data/profiles.json"))
  .then((contents) => {
      
    // need to parse the raw buffer as json if we want to work with it
    const profilesJson = JSON.parse(contents);
    
    //   prepare and send an OK response
    res.render("delete", {
      title: "Express Yourself - Delete Profile",
      profiles: profilesJson,
    });
  })
  .catch((err) => {
    console.log(err);
    res.writeHead(500);
    res.end("Error");
  });
});


profilesRouter.get("/", (req, res) => {
  console.log("=====INSIDE PROFILEROUTERRRRRRR");

  /*
  fs.readFile(path.join(__dirname, "../data/profiles.json"))
  .then((contents) => {
      
    // need to parse the raw buffer as json if we want to work with it
    const profilesJson = JSON.parse(contents);
    
    //   prepare and send an OK response
    res.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: profilesJson,
    });
  })
  .catch((err) => {
    console.log(err);
    res.writeHead(500);
    res.end("Error");
  }); */
});


profilesRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, "../data/profiles.json"))
    .then((contents) => {
      // need to parse the raw buffer as json if we want to work with it
      const profilesJson = JSON.parse(contents);

      // check whether id is valid and errors if it is not
      const person = profilesJson.filter(e => e.id === id)[0];
      if (!person) {
        res.status(404).render("error", { 
          title: `Express Yourself - Error`,
          errorMessage: "No profile has been found."
        })
        return;
      }
      
      //   prepare and send an OK response
      const otherPeople = profilesJson.filter(e => e.id !== id);
      res.render("profile", {
        title: `Express Yourself - ${person.name}`,
        person,
        otherPeople
      });
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(500);
      res.end("Error");
    });
});


module.exports = profilesRouter;

