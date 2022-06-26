const mongoose = require('mongoose');
  
const imageSchema = new mongoose.Schema({
    id: Number,
    title: String,
    subtitle: String,
    description: String,
    // img:
    // {
    //     data: Buffer,
    //     contentType: String
    // }
});
  
module.exports = new mongoose.model('Test', imageSchema);