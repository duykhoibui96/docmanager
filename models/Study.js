var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StudySchema = new Schema({

    StudyID: {

        type: Number,
        unique: true

    },
    Name: String,
    Content: String,
    StudyEmpl: [Number],
    Time: String,
    Document: [],
    Seminar: Number,
    Instructor: [Number]
    

}, { collection: 'study' });

module.exports = mongoose.model('Study', StudySchema);