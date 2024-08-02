const mongoose = require('mongoose');
const {schema} = require('./secure/menuValidationModel');

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    subMenu: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 100
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    thumbnail:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

menuSchema.index({title:"text"});
menuSchema.statics.menuValidation = function (body) {
    return schema.validate(body, {
        abortEarly: false
    });

}
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
