"use strict"

//MongoDB connection setup
const { mongoose } = require("mongoose");
const uri =
  "mongodb+srv://***U-S-E-R***:***P-A-S-S-W-O-R-D***@cluster0.iw7hm03.mongodb.net/node-day-04?retryWrites=true&w=majority";

// set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require('morgan');
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const fileUpload = require("express-fileupload");


// Use environment variable if defined, or a fixed value if not.
const PORT = process.env.PORT || 3003;

// morgan is set ON
app.use(logger("combined"));

app.use(cors());


// get the routes
const indexRouter = require("./routes/indexRouter.js");
const profilesRouter = require("./routes/profilesRouter.js");
const apiProfilesRouter = require("./routes/apiRouter.js");

app.use(express.static('public'));

app.set("views", path.join(__dirname, "views"));
// set the view engine to ejs
app.set("view engine", "ejs");

// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/full-width");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// handle image upload
app.use(fileUpload({
    createParentPath: true,
  })
);
  

// call the routes
app.use("/profiles", profilesRouter);
app.use("/api", apiProfilesRouter);
app.use(indexRouter);


app.get("*", (req, res) => res.status(404)
                            .send("<h2 style='text-align: center; color: red; margin-top: 2rem;'>No page has been found</h2>"));

// app is listening
app.listen(PORT, () => {
    console.log(` => Server running at http://localhost:${PORT}`);
});
  
