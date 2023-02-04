import messageModel from "../../../DB/model/message.js";
import userModel from "../../../DB/model/user.js";
export const getAllMessages = async (req, res) => {
  const messages = await messageModel
    .find({ recievedId: req.user._id })
    .populate({
      path: "recievedId",
      select: "firstName lastName email phone age",
    });
  res.json({ message: "Done", messages });
};
export const sendMessage = async (req, res) => {
  try {
    const { recievedId } = req.params;
    const { text } = req.body;
    const user = await userModel.findById(recievedId);
    if (!user) {
      res.json({ message: "In-valid user" });
    } else {
      if (user.isDelete === false) {
        const newMessage = new messageModel({ text, recievedId });
        const savedMessage = await newMessage.save();
        res.json({ message: "Done", savedMessage });
      } else {
        res.json({ message: "your accont is Stopped" });
      }
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const softDeleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message1 = await messageModel.findById(messageId);
    if (message1) {
      if (req.user.isDelete) {
        res.json({ message: "your accont is Stopped" });
      } else {
        if (req.user.isDelete) {
          res.json({ message: "your account is stopped" });
        } else {
          if (message1.isDelete) {
            const messages = await messageModel.findOneAndUpdate(
              { _id: messageId, recievedId: req.user._id },
              { isDelete: false }
            );
            messages
              ? res.json({ message: "Done", messages })
              : res.json({
                  message: "In-valid user token or this token expired",
                });
          } else {
            const messages = await messageModel.findOneAndUpdate(
              { _id: messageId, recievedId: req.user._id },
              { isDelete: true }
            );
            messages
              ? res.json({ message: "Done", messages })
              : res.json({
                  message: "In-valid user token or this token expired",
                });
          }
        }
      }
    } else {
      res.json({ message: "In-valid this message" });
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const messagebyid = async (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = await messageModel.findOne({_id:messageId,recievedId:req.user._id}).populate({
      path: "recievedId",
      select: "firstName lastName email phone age",
    });
    messages
      ? res.json({ message: "Done", messages })
      : res.json({ message: "In-valid message" });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = await messageModel.findById({
      _id: messageId,
      recievedId: req.user._id,
    });
    if (req.user.isDelete) {
      res.json({ message: "Your account is stopped" });
    } else {
      if (!messages) {
        res.json({ message: "In-valid message" });
      } else {
        if (messages.isDelete) {
          res.json({ message: "this message is stopped" });
        } else {
          const deleted = await messageModel.findByIdAndDelete(messageId);
          res.json({ message: "Done", deleted });
        }
      }
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};