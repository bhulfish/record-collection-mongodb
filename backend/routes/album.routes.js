const express = require('express');
const controller = require('../controllers/album.controller');

const router = express.Router();

router.post("/", controller.album_create);
router.get("/", controller.album_list);
router.get("/:id", controller.album_details);
router.patch("/:id", controller.album_update);
router.delete("/:id", controller.album_delete);

module.exports = router;
