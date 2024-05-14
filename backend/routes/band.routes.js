const express = require('express');
const controller = require('../controllers/band.controller');

const router = express.Router();

router.post("/", controller.band_create);
router.get("/", controller.band_list);
router.get("/dropdown", controller.band_list_dropdown);
router.get("/:id", controller.band_details);
router.patch("/:id", controller.band_update);
router.delete("/:id", controller.band_delete);
router.delete("/", controller.band_delete_all);

module.exports = router;
