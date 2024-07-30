const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: Date, default: Date.now},
    lastEditDate: {type: Date, default: null}
})

module.exports = model('Post', PostSchema)