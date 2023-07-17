import { users, quotes } from "./fakeDb.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const User = mongoose.model("User");
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { _id }) => users.find((user) => user._id === _id),
    quotes: () => quotes,
    quote: (_, { by }) => quotes.filter((quote) => quote.by === by),
  },
  User: {
    quotes: (user) => quotes.filter((quote) => quote.by === user.id),
  },
  Mutation: {
    signUpUser: async (_, { userInput }) => {
      const user = await User.findOne({ email: userInput.email });
      if (user) {
        throw new Error("User already exist");
      }
      const hashedPass = await bcrypt.hash(userInput.password, 12);

      const newUser = new User({
        ...userInput,
        password: hashedPass,
      });
      return await newUser.save();
    },
    signInUser: async (_, { userLogin }) => {
      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        throw new Error("User doesn't exist");
      }
      const doMatched = await bcrypt.compare(userLogin.password, user.password);
      if (!doMatched) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      return { token };
    },
  },
};

export default resolvers;
