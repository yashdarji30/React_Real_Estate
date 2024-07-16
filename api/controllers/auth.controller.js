// import bycrpt from "bcrypt";
// import prisma from "../lib/prisma.js";
// export const register = async (req,res) => {
//   const {username,email,password} = req.body;

//   //HASH The Password
//   try {
//     const hashedPassword = await bcrypt.hash(password,10);
//   console.log(hashedPassword);
     
//     //create a new user and save to db

//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password : hashedPassword,
//       },
//     });
//     console.log(newUser); 

//     res.status(201).json({ message: "User created Scuuessfully"})
// }catch(err) {
//   res.status(500).json({messagage: "Failed to create user!"})
// }
//   }

// export const login = (req,res) => {

// }
// export const logout = (req,res) => {
     
// } 
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";   
import jwt from "jsonwebtoken";
export const register =async (req,res) => {
  const {username,email,password} = req.body;
  
  try{
    const hashedPassword = await bcrypt.hash(password, 10); 
     console.log(hashedPassword);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password : hashedPassword,
      }
    });
    console.log(newUser); 
    res.status(201).json({ message: "User created Scuuessfully"});
  }catch(error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user!"}); 
  }

} 
export const login = async(req,res) => {
  const {username,password} = req.body;
   
try{
    //User If the User Is Exists

    const user = await prisma.user.findUnique({
      where:{username},

    });
    if(!user) return res.status(401).json({message : "Invalid Credentails"});

  //Check If The Password Is Corecet

  const isPasswordValid = await bcrypt.compare(password,user.password);
  if(!isPasswordValid) return res.status(401).json({message : "Invalid Credentails"});


  // Generate Cookie Token And Send To The User
  const age = 1000 *60 *60*24*7

  const token = jwt.sign({
    id:user.id,
    isAdmin:false,
  },process.env.JWT_SECRET_KEY,
  { expiresIn: age});
   
  const {password: userPassword,  ...userInfo} = user
   res.cookie("token",token,{
    httpOnly:true,
    // secure:true,
    maxAge:age,
      
   })
   .status(200)
   .json(userInfo);

}
catch(err){
  console.log(err);
  res.status(500).json({message: "Failed to login!"});
}

}
export const logout  = (req,res) => {
  // console.log("register endpoint called"); 

  res.clearCookie("token").status(200).json({message: "Logout Successflly"}); 
}