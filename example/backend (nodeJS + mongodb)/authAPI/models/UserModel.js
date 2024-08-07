const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: "Role"}],
    isBlocked: {type: Boolean, default: false}
})

module.exports = model('User', UserSchema)