"use strict"

const path = require("path");
const Profile = require("../models/Profile.js");

class ProfileOps {
  // empty constructor
  ProfileOps() {}

  // DB methods
  async getAllProfiles() {
    console.log("getting all profiles");
    let profiles = await Profile.find().collation({locale: "en"}).sort({ name: 1 });
    return profiles;
  }

  async getProfileById(id) {
    console.log(`getting profile by id ${id}`);
    let profile = await Profile.findById(id);
    return profile;
  }

  async searchFor(str) {
    const param = new RegExp(".*" + str + ".*");

    const profile = await Profile.find({name:{'$regex' : param, '$options' : 'i'}})
    return (typeof profile.name !== undefined
              ? profile
              : undefined) ;
  }

  async createProfile(input, img) {
    try {
      const { name } = input;
      const { imagePath } = img || {};

      const interests = [];
      for(let item in input)
        if (item.includes("int") && (input[item].length > 0))
          interests.push(input[item]);

      let tempProfileObj = new Profile({
        name,
        imagePath: (imagePath && imagePath.name) || undefined,
        interests
      });

      const error = await tempProfileObj.validateSync();

      if (error) {
        console.log("XXX Model is not valid!");
        const response = {
          obj: input,
          errorMessage: error
        };
        return response; // Exit if the model is invalid
      }

      // Model is valid, so save it
      if (imagePath) {
        const recordImgAt = path.join(__dirname, "..", "public", "images", imagePath.name);
        await imagePath.mv(recordImgAt, (err) => {
          if (err) {
            return({
              obj: input,
              errorMessage: err
            })
          }
        });
      }
      
      // save data on DB
      const result = await tempProfileObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;

    } catch (error) {
      const response = {
        errorMsg: error.message,
        obj: input
      };
      return response;
    }
  }

  async deleteProfile(id) {
    try {
        const deleteAction = await Profile.deleteOne( { "_id" : id });
        if (deleteAction.deletedCount > 0)
            return ({
                success: true,
                message: "Profile has been deleted successfully!"
            });
        else throw new Error();

    } catch(err) {
        console.log(`### Error on deleting ${id}`);
        return({
            success: false,
            message: `Error (${err.message || err || " on deleting profile. Please try again."})`
        });
    }
  }


  async updateProfile(bodyContent, profileId, files) {
    let response = {

    };

    const initial = {
      name: bodyContent.name,
      imagePath: ((files && files.imagePath && files.imagePath.name) || (bodyContent.imagePath || bodyContent.tempImagePath) || ""),
      interests: bodyContent.interests ?? []
    }

    try {
      const addTrimmed = [];
      if (bodyContent.additionals !== "") {
        const additionals = bodyContent.additionals.split(",");
        for (let i of additionals)
          if (i.trim().length > 0)
            addTrimmed.push(i.trim());
      }

      let interests = [];
      for(let item in bodyContent)
          if (item.includes("interest"))
              interests.push(bodyContent[item]);

      interests = [...interests, ...addTrimmed];

      const profileObj = new Profile({
          _id: profileId,
          name: initial.name,
          interests,
          imagePath: initial.imagePath
        });

      const error = await profileObj.validateSync();
      if (error)
        throw new Error(error.message || "Error when updating. Please try later."); // Exit if the model is invalid


      const { imagePath } = files || {};

      // Model is valid, so save it
      if (imagePath && imagePath.name) {
        const recordImgAt = path.join(__dirname, "..", "public", "images", imagePath.name);
        await imagePath.mv(recordImgAt, (err) => {
          if (err) {
            return({
              obj: bodyContent,
              errorMessage: err
            })
          }
        });
      }

      const profileToUpdate = await Profile.findById(profileObj._id);
      profileToUpdate.name = profileObj.name;
      profileToUpdate.interests = profileObj.interests || []
      profileToUpdate.imagePath = ((imagePath && imagePath.name) || initial.imagePath || "");
      
      // const result = await profileToUpdate.save();
      const result = await Profile.updateOne(
        {_id: profileObj._id},
        { 
          $set: {
            name: profileToUpdate.name,
            interests: profileToUpdate.interests,
            imagePath: profileToUpdate.imagePath
          }
        }
      )

      response = {
        profile: profileToUpdate,
        success: true,
        message: result.modifiedCount > 0 ? "Update has been done successfully! \\o/" : "No changes detected."
      };
      
    } catch (err) {
      console.log("error on update!!!!!!!!!!!", err);

        response = {
          obj: initial,
          success: false,
          message: err.message || "Error on deleting profile. Please try again.",
        };
    }

    return response;
  }


}

module.exports = ProfileOps;
