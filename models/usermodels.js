import mongoose from "mongoose";

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const userSchema = new mongoose.Schema(
   { firstName:{
        type:String,
        required:[true,"First Name is required"]
    },
    lastName:{
        type:String,
        required:[true,"Last Name is required"]
    },
    email:{
        type:String,
        required:[true,"Emila is required"],
        validate:validateEmail,
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    status:{
        type:Boolean,
        default:true
    },
    role:{
        type:String, 
        default:"customer"
    },
    createdAt:{
        type:Date,
        defilat:Date.now()
    },
    resetPasswordOtp:{
        type:Number
    },
    resetpasswordExpires:{
        type:Date
    },
 },
 {
    collection:"users",
    versionKey:false,
 }
);
 const userModel= mongoose.model("users",userSchema);
 export default userModel;
