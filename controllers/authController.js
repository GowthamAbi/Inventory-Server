import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const authControll={

Register:async(req,res)=>{
try {
   const {name,email,phone,password}=req.body
   const user=await User.findOne({email})

   if(user){
    return res.status(400).send("Already register")
   }
   const hashPassword=await bcrypt.hash(password,10) 
   const newUser=new User({name,email,phone,password:hashPassword})
    console.log(newUser)
    newUser.save().then(res.status(201).send("User registered successfully 🚀"))
   
} catch (error) {
    console.log("Error in Register")
}
},

login:async(req,res)=>{

try {
    
    const{email,password}=req.body

    console.log(email,password)

    const user = await User.findOne({ email });

    console.log(user)

    const isMatch=await bcrypt.compare(password,user.password)

    console.log(user)

    const token = jwt.sign({ userId: user.id }, "Apple", { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    console.log(password,user.password,isMatch)

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


    res.status(200).send("SucessFully Login")
} catch (error) {
    console.log("Login Fetch Problem")
}


}
}

export default authControll