const express = require("express");
const profilesRouter = express.Router();

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


module.exports = profilesRouter;

