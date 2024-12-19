const { type } = require("express/lib/response");
var mongoose=require("mongoose");

var hour= new mongoose.Schema({
    days:{type:String, required:true},
    open: String,
    close: String,
    isClosed: {type: Boolean, required:true}
});

var comment = new mongoose.Schema({
    author:{type:String,required:true},
    rating:{type:Number,min:0,max:5,default:0},
    text:{type:String,required:true},
    date:{type:Date,default:Date.now}
});

var venue= new mongoose.Schema({
    name: {type: String, required:true},
    address: String,
    rating:{type:Number, default:0, min:0, max:5},
    foodanddrink: [String],
    coordinates:{type: [Number], index:'2dsphere'},
    hours:[hour],
    comments:[comment]
});
mongoose.model("venue", venue,"venues");
