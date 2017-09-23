var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CustomerSchema = new Schema({

    CustomerID: {

        type: Number,
        unique: true

    },
    Name: String,
    Address: String,
    Phone: String,
    Representative: Number,
    ResponsibleEmpl: [Number]
    

}, { collection: 'customer' });

module.exports = mongoose.model('Customer', CustomerSchema);