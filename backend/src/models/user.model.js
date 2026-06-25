import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
        
    },
    verified:{
        type:Boolean,
        default:false
    },
    lastVerificationEmailSentAt: {
    type: Date,
    default: null,
  },
  lastPasswordResetEmailSentAt: {
  type: Date,
  default: null,
}
},{timestamps:true});


userSchema.pre('save',async function (){
    if(!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword =function (candidatePassword){
    return bcrypt.compare(candidatePassword,this.password)
}

const userModel = mongoose.model("users",userSchema);

export default userModel