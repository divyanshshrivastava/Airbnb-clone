const Listing = require("../models/listing.js");
const axios = require("axios");
require("dotenv").config();

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("./listings/index.ejs", {
    allListing,
    title: "AirBnB - All Listings",
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/add.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let location = req.body.listing.location;
  const response = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=ab44001be198411fa2f0c864d3d9c8ee`,
  );
  req.body.listing.geometry = response.data.features[0].geometry;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = req.body.listing.geometry;
  await newListing.save();
  req.flash("success", "New Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const cardInfo = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!cardInfo) {
    req.flash("error", "Listing does not Exist");
    return res.redirect("/listings");
  }
  res.render("./listings/showInfo.ejs", {
    cardInfo,
  });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const cardInfo = await Listing.findById(id);
  if (!cardInfo) {
    req.flash("error", "Listing does not Exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = cardInfo.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("./listings/edit.ejs", { cardInfo, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  let updatedListing = await Listing.findById(id);
  let location = updatedListing.location;
  const response = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=ab44001be198411fa2f0c864d3d9c8ee`,
  );
  listing.geometry = response.data.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
