import mongoose from 'mongoose';

const userSchema =new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:false,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    }, 
    gender:{
        type:String,
        required:true,
        enum:["male","female"],
    },
    profilepic:{
        type:String,
        required: false,
        default:"",
    },
    dateOfBirth:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobileNo:{
        type:String,
        required:true,
    },
},
 {timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;