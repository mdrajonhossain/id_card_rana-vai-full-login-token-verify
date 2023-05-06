var mongoose = require('mongoose');



const Schema = mongoose.Schema

const addcardSchema = new Schema({
    student_name: { type: String, required: true },
    class_roll: { type: String, required: true },
    blood_group: { type: String, required: true },
    student_phone_number: { type: String, required: true },
    parents_phone_number: { type: String, required: true },
    degree: { type: String, required: true },
    department: { type: String, default: ''},
    section: { type: String, default: ''},
    session: { type: String, required: true},
    group: { type: String, default: ''},
    picture: { type: String, required: true }
})


module.exports = mongoose.models.addcard || mongoose.model('addcard', addcardSchema);