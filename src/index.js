const express = require('express');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
mongoose.set('strictQuery', false);
const multer = require('multer')
const app = express();

app.use(multer().any())

app.use(express.json());

mongoose.connect("mongodb+srv://Rimsha:RimAtlas@cluster0.ij9mujl.mongodb.net/JobPortal", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});