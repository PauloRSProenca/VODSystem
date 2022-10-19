var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategorySchema   = new Schema({
    id: Schema.Types.ObjectId,
    name: String
});

module.exports = mongoose.model('Category', CategorySchema);