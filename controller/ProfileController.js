const Profile = require("../models/Profile.js");

const ProfileActions = require("../data/profilesActions.js");
// instantiate the class so we can use its methods
const _profileActions = new ProfileActions();

exports.Index = async function (request, response) {
  console.log("loading profiles from controller");
  let profiles = await _profileActions.getAllProfiles();
  return response.render("profiles", {
    title: "Express Yourself - Profiles",
    profiles: profiles.length ? profiles : [],
  });
};

exports.Search = async (req, res) => {
    const nameToSearch = req.body.searchFor;
    const profiles = await _profileActions.searchFor(nameToSearch);
    console.log("profileIsValid", profiles);

    return res.render("profile-search", {
        title: "Express Yourself - Search",
        profiles,
        message: `No profile has been found for *${nameToSearch}'*`
      });
}

exports.Detail = async function (request, response) {
  const profileId = request.params.id;
  console.log(`loading single profile by id ${profileId}`);
  let profile = await _profileActions.getProfileById(profileId);
  let profiles = await _profileActions.getAllProfiles();
  profiles = profiles.filter(e => e._id.toString() !== profileId);
  if (profile) {
    response.render("profile-details", {
      title: "Express Yourself - " + profile.name,
      profiles,
      profile,
      layoutPath: "./layouts/sideBar.ejs"
    });
  } else {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: [],
    });
  }
};

// Handle profile form GET request
exports.Create = async function (request, response) {
    response.render("profile-create", {
        title: "Create Profile",
        errorMessage: "",
        profile: {},
    });
};

// Handle profile form GET request
exports.CreateProfile = async function (request, response) {
  // instantiate a new Profile Object populated with form data
  let tempProfileObj = new Profile({
    name: request.body.name,
    interests: [1, 2, 3]
  });

  //
  let responseObj = await _profileActions.createProfile(tempProfileObj);
  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    let profiles = await _profileActions.getAllProfiles();
    profiles = profiles.filter(e => e._id.toString() !== responseObj.obj._id.toString());

    response.render("profile-details", {
      title: "Express Yourself - " + responseObj.obj.name,
      profile: responseObj.obj,
      profiles,
      layoutPath: "./layouts/sideBar.ejs",
      message: "Profile created successfully! \\o/"
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    response.render("profile-create", {
      title: "Create Profile",
      profile: responseObj.obj,
      errorMessage: responseObj.errorMsg,
    });
  }
};


exports.Delete = async (req, res) => {
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId);
    const validProfile = (typeof profile.name !== undefined) ? true : false;

    res.render("profile-delete", {
        title: "Delete Profile",
        profile,
        message: validProfile ? "Are you sure you want to delete this profile?" : undefined,
        errorMessage: !validProfile ? "No Profile has been found, please try again." : undefined,
        showButtons: validProfile  // if no profile found, it does not show the buttons
      });
};


exports.DeleteProfile = async (req, res) => {
    console.log("go to DB to DELETEEEEEEEEEEEEEEE::::: " + req.params.id + "!!!");
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId);

    const deleteProfile = await _profileActions.deleteProfile(profileId);
    console.log("--- deleteProfile:: ", deleteProfile);

    // the deleteprofile.success will set the css-class for render
    // red if fail blue if success
    res.render("profile-delete", {
        title: "Delete Profile - Success",
        profile,
        message: deleteProfile.message
      });
};


exports.EditProfile = async (req, res) => {
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId);
    const validProfile = (typeof profile.name !== undefined) ? true : false;
    console.log("=========sending this profile:::: ", profile);

    res.render("profile-edit", {
        title: "Update Profile",
        profile,
        errorMessage: !validProfile ? "No Profile has been found, please try again." : undefined,
      });
};

exports.UpdateProfile = async (req, res) => {
    console.log("---------------------------------- before go to DB to UPDATE:");
    // console.log("req.body", req.body);
    const profileId = req.params.id;

    // const updateIsValid = _profileActions.updateProfile(tempProfileObj);
    const updateProfile = await _profileActions.updateProfile(req.body, profileId);
    // console.log("AFTEEEEEEEEEEERRRRRRRRRRR UPLOADING: ", updateIsValid);

    // RECEIVE A MESSAGE from the action and set to the render accordingly
    return res.render("profile-edit", {
        title: "Update Profile",
        profile: updateProfile.profile,
        message: updateProfile.message,
        // css-class accordingly to the XPathResult.success
      });
};
