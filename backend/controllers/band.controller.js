const Band = require('../models/band.model');
const Album = require('../models/album.model');

exports.band_create = async (req, res) => {
    const { band_name } = req.body;

    try {
        let band = await Band.create({ name: band_name });
        res.status(201).json({ success: true, band });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred creating new band: ${err.message}` });
    }
};

exports.band_list = async (req, res) => {
    const { band_name } = req.query;
    let condition = band_name ? { name: { $regex: `.*${band_name}.*`, $options: "i" } } : {};

    try {
        let bands = await Band.find(condition).select("_id name").populate({ path: "albums", select: "_id title release_date" });
        res.status(200).json({ success: true, bands });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred retrieving bands: ${err.message}` });
    }
};

exports.band_list_dropdown = async (req, res) => {
    try {
        let bands = await Band.find({}).select("_id name");
        res.status(200).json({ success: true, bands });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred retrieving bands dropdown: ${err.message}` });
    }
};

exports.band_details = async (req, res) => {
    const { id } = req.params;

    try {
        let band = await Band.findById(id).select("_id name").populate({ path: "albums", select: "_id title release_date" });
        res.status(200).json({ success: true, band });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred retrieving band with id = ${id}: ${err.message}` });
    }
};

exports.band_update = async (req, res) => {
    const { id } = req.params;
    const { band_name } = req.body;

    try {
        let band = await Band.findByIdAndUpdate(id, { name: band_name }, { new: false });
        res.status(200).json({ success: true, band });
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred updating band with id = ${id}: ${err.message}` });
    }
};

exports.band_delete = async (req, res) => {
    const { id } = req.params;

    try {
        let albums = await Album.deleteMany({ band: id });

        let band = await Band.findByIdAndDelete(id);
        if (band) {
            res.status(200).json({ success: true, message: `Band deleted and ${albums.deletedCount} associated albums deleted` });
        } else {
            res.status(404).send({ success: true, message: "Band not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred deleting band with id = ${id}: ${err.message}` });
    }
};

exports.band_delete_all = async (req, res) => {
    try {
        let albums = await Album.deleteMany({});

        let bands = await Band.deleteMany({});
        if (bands) {
            res.status(200).json({ success: true, message: `${bands.deletedCount} band deleted and ${albums.deletedCount} total albums deleted` });
        } else {
            res.status(404).send({ success: true, message: "No bands found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: `An error occurred deleting all bands and albums: ${err.message}` });
    }
};
