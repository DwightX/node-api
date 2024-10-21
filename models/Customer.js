const mongoose = require("mongoose")
const timestampsPlugin = require("mongoose-timestamp")

const CustomerSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true //removes any whitespace at the beginning and end of the name.
    },
    email:{
        type:String,
        required: true,
        trim:true
    },
    balance:{
        type:Number,
        default: 0,
    }
})
CustomerSchema.plugin(timestampsPlugin);

const Customer = mongoose.model("Customer",CustomerSchema)
module.exports = Customer