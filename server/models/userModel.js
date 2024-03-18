import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (email, password) {
  // check email and password fields are not blank
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // check email is a valid email - validator
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  // check password is strong enough - validator
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  // check email not already in database
  const alreadyInDB = await this.findOne({ email });

  if (alreadyInDB) {
    throw Error("Email already in use");
  }

  // salt and hash password - bcrypt
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // add user to database
  const user = this.create({ email, password: hash });

  // return user
  return user;
};

userSchema.statics.login = async function (email, password) {
  // check email and password fields are not blank
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // check email/user in database
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User does not exist");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Password incorrect");
  }

  if (match) {
    return user;
  }
};

export const User = mongoose.model("User", userSchema);
