const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tagsController");

// GET request for all the tags.
router.get("/tags", tagsController.tags_list);

// POST request for creating a tag.
router.post("/tags/", tagsController.tags_post);

// GET request for a tag. (might not need this)
router.get("/tags/:_id", tagsController.tag_get);

module.exports = router;
