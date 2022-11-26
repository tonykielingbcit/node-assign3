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

  async createProfile(profileObj) {
    console.log("profileObj========== ", profileObj);
    try {
      const error = await profileObj.validateSync();
      if (error) {
        const response = {
          obj: profileObj,
          errorMsg: error.message,
        };
        return response; // Exit if the model is invalid
      }

      // Model is valid, so save it
      const result = await profileObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;

    } catch (error) {
      const response = {
        obj: profileObj,
        errorMsg: error.message,
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


  async updateProfile(bodyContent, profileId) {
    console.log("--------receiving========== ", bodyContent, " id: " + "!!!");
    console.log("inside updateProfile!!!!!!!!!!!!!!!!!");

    const additionals = bodyContent.additionals.split(",");
    const addTrimmed = additionals.map(e => e.trim());


    let interests = [];
    for(let item in bodyContent)
        if (item.includes("interest"))
            interests.push(bodyContent[item]);
    interests = [...interests, ...addTrimmed];
    
    const profileObj = new Profile({
        _id: profileId,
        name: bodyContent.name,
        interests
      });
// console.log("--new profileOBJ== ", profileObj);
    
    let response = {};
    try {
      // it has not been able to valid the model.............
      const error = await profileObj.validateSync();
      if (error)
        throw new Error(error.message || "Error when updating. Please try later."); // Exit if the model is invalid      
      // console.log("inside updateProfile!!!!!!!!!!!!!!!!! VALIDDDDDDDDDD MODEL!!!!!!!");

      const profileToUpdate = await Profile.findById(profileObj._id);
      profileToUpdate.name = profileObj.name;
      profileToUpdate.interests = profileObj.interests
      // console.log("temppppppppppppppppppppppppppppppppp AFTER", profileToUpdate);
      const result = await profileToUpdate.save();
      console.log("-----result", result);

      response = {
        profile: result,
        success: true,
        message: "Update has been done successfully! \\o/"
      };
      
      console.log("=========RESPONSE:::::::: ", response);
    } catch (err) {
        response = {
          obj: profileObj,
          success: false,
          message: err.message || "Error on deleting profile. Please try again.",
        };
    }

    return response;
  }
}

module.exports = ProfileOps;
