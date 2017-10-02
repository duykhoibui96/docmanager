var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConsultancySchema = new Schema({

    ConsID: {

        type: Number,
        unique: true

    },
    ConsultingEmplID: Number,
    CustomerID: Number,
    ConsultedPerson: String,
    Content: String,
    Document: [],
    Time: String


}, { collection: 'consultancy' });

module.exports = mongoose.model('consultancy', ConsultancySchema);