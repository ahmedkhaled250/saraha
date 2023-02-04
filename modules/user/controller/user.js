import userModel from "../../../DB/model/user.js";
import bcrypt from "bcryptjs";
export const getAllUser = async (req, res) => {
  const user = await userModel.find();
  res.json({ message: "Done", user });
};
export const profile = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  user
    ? res.json({ message: "Done", user })
    : res.json({ message: "In-valid user" });
};
export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      phone,
      address,
      gander,
    } = req.body;
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.saltRound)
    );
    const user = await userModel.updateOne(
      { _id: req.user._id },
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        age,
        phone,
        address,
        gander,
      }
    );
    user?.modifiedCount
      ? res.json({ message: "Done", user })
      : res.json({ message: "In-valid user token or this token expired" });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const deleteProfile = async (req, res) => {
  try {
    const deleted = await userModel.deleteOne({ _id: req.user._id });
    deleted
      ? res.json({ message: "Done", deleted })
      : res.json({ message: "In-valid user token or this token expired" });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const softdelete = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user) {
      if (user.isDelete) {
        const account = await userModel
          .findByIdAndUpdate(
            user._id,
            { isDelete: false, isOnline: false },
            { new: true }
          )
          .select("-_id");
        res.json({ message: "Done", account });
      } else {
        const account = await userModel
          .findByIdAndUpdate(req.user._id, { isDelete: true }, { new: true })
          .select("-_id");
        res.json({ message: "Done", account });
      }
    } else {
      res.json({ message: "In-valid user token or this token expired" });
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const updatePassword = async (req, res) => {
  const { oldPassword, password, cPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.json({ message: "In-valid user token or this token expired" });
  } else {
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      res.json({ message: "In-valid login password" });
    } else {
      const hashPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.saltRound)
      );
      const user = await userModel.updateOne(
        { _id: user._id },
        { password: hashPassword }
      );
      user?.modifiedCount
        ? res.json({ message: "Done", user })
        : res.json({ message: "Fail to update your password" });
    }
  }
};
export const shareprofile = async (req, res) => {
  try {
    const url = `${req.protocol}://${req.headers.host}${process.env.paseURL}/user/sharelinkprofile/${req.user._id}`;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      res.json({ message: "In-valid user" });
    } else {
      res.json({ message: "Done", url });
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const sharelinkprofile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .select("firstName lastName email age phone");
    user
      ? res.json({ message: "Done", user })
      : res.json({ message: "In-valid account" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch error", error });
  }
};
