module.exports = class UserDto {
    id
    username
    email
    isActivated

    constructor(model) {
        this.id = model._id
        this.username = model.username
        this.email = model.email
        this.isActivated = model.isActivated
    }
}