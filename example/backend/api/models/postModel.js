const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    author: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true}
})

module.exports = model('Post', PostSchema)