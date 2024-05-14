const mongoose = require('mongoose');
const { Schema } = mongoose;

const albumSchema = Schema({
    title: { type: String, required: true },
    release_date: { type: Date },
    band: { type: Schema.Types.ObjectId, ref: "Band", required: true }
});

module.exports = mongoose.model("Album", albumSchema, "album");
