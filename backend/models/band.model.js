const mongoose = require('mongoose');
const { Schema } = mongoose;

const bandSchema = new Schema({
    name: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

bandSchema.virtual("albums", {
    ref: "Album",
    localField: "_id",
    foreignField: "band",
    options: { sort: { release_date: 1 }}
});

module.exports = mongoose.model("Band", bandSchema, "band");
