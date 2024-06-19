var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var idvalidator  = require('mongoose-id-validator');

var VideoSchema   = new Schema({
    id: Schema.Types.ObjectId,
    title: {type: String, required: true},
    synopsis: {type: String, required: true},
    director: {type: String, required: true},
    cast:[{type: String, required: true}],
    poster: {type: String, required: true},
    category: { type: Schema.Types.ObjectId, ref: 'Category' , required: true},
    streamURL: {type: String, required: true},
    rate:[{ type: Number, min: 1, max: 5 }]
});

//VideoSchema.plugin(idvalidator);

module.exports = mongoose.model('Video', VideoSchema);