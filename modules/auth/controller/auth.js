import userModel from "../../../DB/model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../../../service/send.js";
import { nanoid } from "nanoid";
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, phone } =
      req.body;
    const user = await userModel.findOne({ email }).select("email");
    if (user) {
      res.json({ message: "Email exist", user });
    } else {
      const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashPassword,
        age,
        phone,
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        const token = jwt.sign(
          { id: savedUser._id },
          process.env.confirmEmailToken,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: savedUser._id },
          process.env.confirmEmailToken
        );
        const link1 = `${req.protocol}://${req.headers.host}${process.env.paseURL}/auth/confirmemail/${token}`;
        const link2 = `${req.protocol}://${req.headers.host}${process.env.paseURL}/auth/requestreftoken/${refreshToken}`;
        const sendMessage = `<a href='${link1}'>
            Follow me to confirm your account
            </a>
            <br>
            <a href='${link2}'>
            Request new link
          </a>
          `;
        sendEmail(savedUser.email, `Confirm Email`, sendMessage);
        res.json({ message: "Done" });
      } else {
        res.json({ message: "Fail to signup" });
      }
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.json({ message: "In-valid token payload" });
    } else {
      const user = await userModel.updateOne(
        { _id: decoded.id, confirmEmail: false },
        { confirmEmail: true }
      );
      user.modifiedCount
        ? res.json({ message: "Your Email confirmed please login" })
        : res.json({
            message: "eather email is already confirmed or in-valid email",
          });
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const requestreftoken = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.confirmEmailToken);
  if (!decoded?.id) {
    res.json({ message: "In-valid token payload" });
  } else {
    const user = await userModel
      .findById(decoded.id)
      .select("firstName lastName confirmEmail");
    if (user?.confirmEmail) {
      res.json({ message: "Already confirmed" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.confirmEmailToken, {
        expiresIn: 60 * 2,
      });
      const url = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;

      const message = `
              <a href ="${url}">
               Follow me to confirm your account
               </a>
              `;
      sendEmail(user.email, "Confirm Email", message);
      res.json({ message: "Done" });
    }
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ message: "In-valid account" });
    } else {
      if (!confirmEmail) {
        res.json({ message: "Please confirm your email" });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.json({ message: "In-valid password" });
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.tokenSagniture,
            { expiresIn: "1h" }
          );
          await userModel.updateOne({ _id: user._id }, { isOnline: true });
          res.json({ message: "Done", token });
        }
      }
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const logOut = async (req, res) => {
  const user = await userModel.updateOne(
    { _id: req.user._id, isOnline: true },
    { isOnline: false, lastSeen: new Date() }
  );
  user?.modifiedCount
    ? res.json({ message: "Done", user })
    : res.json({ message: "In-valid user token or this token expired" });
};
export const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel
    .findOne({ email })
    .select("email confirmEmail isDelete isBlocked");
  if (!user) {
    res.json({
      message:
        "Can not send code to not register account or stopped or blocked",
    });
  } else {
    if (user.isDelete || user.isBlocked || user.confirmEmail == false) {
      res.json({
        message: "Your account stopped or blocked",
      });
    } else {
      const accessCode = nanoid();
      console.log(accessCode);
      await userModel.findByIdAndUpdate(user._id, { code: accessCode });
      sendEmail(
        user.email,
        `forgert password`,
        `<h1>please use this code: ${accessCode} to reset your password</h1>`
      );
      res.json({ message: "Done check your email" });
    }
  }
};
export const forgetPssword = async (req, res) => {
  const { email, code, password } = req.body;
  if (!code) {
    res.json({ message: "Account doesn't require forget password yet!" });
  } else {
    const user = await userModel.findOne({ email }).select("email code");
    if (!user) {
      res.json({ message: "Not register account" });
    } else {
      if (user.code != code || user.code == null) {
        res.json({ message: "In-valid code" });
      } else {
        const hashPassword = await bcrypt.hash(
          password,
          parseInt(process.env.saltRound)
        );
        const updateUser = await userModel.updateOne(
          { _id: user._id },
          { password: hashPassword, code: null }
        );
        res.json({ message: "Done", updateUser });
      }
    }
  }
};