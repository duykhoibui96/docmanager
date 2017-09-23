var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SeminarSchema = new Schema({

    SeminarID: {

        type: Number,
        unique: true

    },
    Name: String,
    Content: String,
    Time: String,
    SharingEmpl: Number,
    OrganizationalUnit: String  

}, { collection: 'seminar' });

module.exports = mongoose.model('Seminar', SeminarSchema);