const Album = require('../models/album.model');

exports.album_create = async (req, res) => {
    const { album_title, release_date, band_id } = req.body;

    try {
        let album = await Album.create({ title: album_title, release_date: release_date, band: band_id });
        res.status(201).json({ success: true, album });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred creating new album: ${err.message}` });
    }
};

exports.album_list = async (req, res) => {
    const { album_title } = req.query;
    let condition = album_title ? { title: { $regex: `.*${album_title}.*`, $options: "i" } } : {};

    try {
        let albums = await Album.find(condition).select("_id title release_date").populate({ path: "band", select: "_id name" });
        res.status(200).json({ success: true, albums });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred retrieving albums: ${err.message}` });
    }
};

exports.album_details = async (req, res) => {
    const { id } = req.params;

    try {
        let album = await Album.findById(id).select("_id title release_date").populate({ path: "band", select: "_id name" });
        res.status(200).json({ success: true, album });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred retrieving album with id = ${id}: ${err.message}` });
    }
};

exports.album_update = async (req, res) => {
    const { id } = req.params;
    const { album_title, release_date, band_id } = req.body;

    try {
        let album = await Album.findByIdAndUpdate(id, { title: album_title, release_date: release_date, band: band_id }, { new: false });
        res.status(200).json({ success: true, album });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred updating album with id = ${id}: ${err.message}` });
    }
};

exports.album_delete = async (req, res) => {
    const { id } = req.params;

    try {
        let album = await Album.findByIdAndDelete(id);
        if (album) {
            res.status(200).json({ success: true, message: "Album deleted" });
        } else {
            res.status(404).send({ success: true, message: "Album not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred deleting album with id = ${id}: ${err.message}` });
    }
};
