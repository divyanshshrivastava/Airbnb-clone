const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Listing = require("./models/listing");
const path = require("path");

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

app.get("/", (req, res) => {
  res.send("Root is working");
});

//*Index Route
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({});
  console.log(allListing[1].image);
  res.render("./listings/index.ejs", { allListing });
});

//*NEW Route
app.get("/listings/add", (req, res) => {
  res.render("./listings/add.ejs");
});

//*CREATE Route
app.post("/listings", async (req, res) => {
  await Listing.insertOne(req.body).then(() => console.log("success"));
  res.redirect("/listings");
});

//*SHOW Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const cardInfo = await Listing.findById(id);
  // console.log(cardInfo);
  res.render("./listings/showInfo.ejs", { cardInfo });
});

//*this is a route for testing DB connection
/* 
app.get("/testListing", async (req, res) => {
  let sample = new Listing({
    title: "My Seafacing Villa",
    description: "This sea facing will show you the best view in all of Goa",
    price: 25000,
    location: "Calangute, Goa",
    country: "India",
  }
  await sample.save();
  res.send("sample Listing added");
});
*/

app.listen(8080, (req, res) => {
  console.log("server running on port:8080");
});
