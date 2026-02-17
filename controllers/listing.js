const Listing = require("../models/listing.js");

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
  req.body.listing.owner = req.user._id;
  await Listing.create(req.body.listing);
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
  res.render("./listings/showInfo.ejs", { cardInfo, title: cardInfo.title });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const cardInfo = await Listing.findById(id);
  if (!cardInfo) {
    req.flash("error", "Listing does not Exist");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { cardInfo });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
