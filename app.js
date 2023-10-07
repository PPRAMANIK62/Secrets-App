import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.userName,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => res.render("secrets"))
    .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email: userName })
    .then(function (foundUser) {
      if (foundUser) if (foundUser.password === password) res.render("secrets");
    })
    .catch((err) => console.log(err));
});

app.listen(3000, () => console.log("Server started on port 3000"));
