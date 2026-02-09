const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//*Index Route
router.get(
  "/",
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
router.get("/add", isLoggedIn, (req, res) => {
  // console.log(req.user);
  res.render("./listings/add.ejs");
});

//*CREATE Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    req.body.listing.owner = req.user._id;
    await Listing.create(req.body.listing);
    req.flash("success", "New Listing Added Successfully");
    res.redirect("/listings");
  }),
);

//*SHOW Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const cardInfo = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    // console.log(cardInfo);
    if (!cardInfo) {
      req.flash("error", "Listing does not Exist");
      return res.redirect("/listings");
    }
    res.render("./listings/showInfo.ejs", { cardInfo, title: cardInfo.title });
  }),
);

//*EDIT route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const cardInfo = await Listing.findById(id);
    if (!cardInfo) {
      req.flash("error", "Listing does not Exist");
      return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { cardInfo });
  }),
);

//*UPDATE route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//*DELETE Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  }),
);

module.exports = router;
