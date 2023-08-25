const Router = require("express").Router;
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new Router();

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const message = await Message.get(req.params.id);
    
    if (
      message.from_user.username !== req.user.username &&
      message.to_user.username !== req.user.username
    ) {
      throw new ExpressError("Unauthorized", 401);
    }

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});



router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    const message = await Message.create({ from_username, to_username, body });
    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});



router.post("/:id/read", ensureCorrectUser, async function (req, res, next) {
  try {
    const message = await Message.markRead(req.params.id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
