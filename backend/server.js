const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const albumRoutes = require('./routes/album.routes');
const bandRoutes = require('./routes/band.routes');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/albums", albumRoutes);
app.use("/api/bands", bandRoutes);

mongoose.connect(process.env.MONGODB)
    .then(() => console.log("mongodb connection successful!"))
    .catch((err) => console.log(`mongodb connection failed: ${err}`));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started and listening on port ${port}`));
