const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Root is working");
});

//*Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    // console.log(allListing[7]);
    res.render("./listings/index.ejs", {
      allListing,
      title: "AirBnB - All Listings",
    });
  }),
);

//*NEW Route
app.get("/listings/add", (req, res) => {
  res.render("./listings/add.ejs");
});

//*CREATE Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body) {
      throw new ExpressError(400, "Invalid Listing Data");
    }
    await Listing.create(req.body);
    res.redirect("/listings");
  }),
);

//*SHOW Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const cardInfo = await Listing.findById(id);
    // console.log(cardInfo);
    res.render("./listings/showInfo.ejs", { cardInfo, title: cardInfo.title });
  }),
);

//*EDIT route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const cardInfo = await Listing.findById(id);
    // console.log(cardInfo);
    res.render("./listings/edit.ejs", { cardInfo });
  }),
);

//*UPDATE route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  }),
);

//*DELETE Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
  console.log(err.message);
  // res.status(statusCode).send(message);
});

app.listen(8080, (req, res) => {
  console.log("server running on port:8080");
});
