const React = require("../models/React");
const mongoose = require("mongoose");
const User = require("../models/User");

exports.reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body;

    const check = await React.findOne({
      postRef: postId,
      reactBy: new mongoose.Types.ObjectId(req.user.id), // ✅ usar "new"
    });

    if (!check) {
      // ➕ Nueva reacción
      const newReact = new React({
        react,
        postRef: postId,
        reactBy: new mongoose.Types.ObjectId(req.user.id), // ✅ usar "new"
      });
      await newReact.save();
      return res.json({ message: "React added", react: newReact.react });
    } else {
      if (check.react === react) {
        // ❌ Eliminar reacción
        await React.findByIdAndDelete(check._id);
        return res.json({ message: "React removed" });
      } else {
        // 🔄 Actualizar reacción
        const updated = await React.findByIdAndUpdate(
          check._id,
          { react },
          { new: true }
        );
        return res.json({ message: "React updated", react: updated.react });
      }
    }
  } catch (error) {
    console.error("🔥 Backend error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    /*
    const check1 = reacts.find(
      (x) => x.reactBy.toString() == req.user.id
    )?.react;
    */
    const newReacts = reactsArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.savedPosts.find((x) => x.post === req.params.id);
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
