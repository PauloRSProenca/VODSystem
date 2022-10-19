var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    id: Schema.Types.ObjectId,
    name: {type: String, required: true},
    role: {type: String, enum: ['client', 'manager'], required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength:5, maxlength:10, required: true}
});

module.exports = mongoose.model('VODUser', UserSchema);