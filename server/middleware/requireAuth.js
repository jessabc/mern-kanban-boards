import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select("_id");
  } catch (error) {
    res.status(400).json({ error: "Request not verified" });
  }

  next();
};
