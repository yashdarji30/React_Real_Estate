import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const getUsers = async (req,res) =>{
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get users!"});
    }
}

export const getUser = async (req,res) =>{
    const id = req.params.id;

    try{
        const user = await prisma.user.findUnique({
            where:{id},
        });
        res.status(200).json(user);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get users!"});
    }
}
export const  updatedUser = async (req,res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar,...inputs} = req.body;

    if(id !== tokenUserId){
        return res.status(403).json({message: "Unauthorized!"});
    }

    let updatePassword = null;
    try{
        if(password){
             updatePassword = await bcrypt.hash(password,10);
        }
        const updatdUser = await prisma.user.update({
            where:{id},
            data: {
                ...inputs,
                ...(updatePassword && { password : updatePassword}),
                ...(avatar && {avatar}),
            },
        });
         res.status(200).json(updatdUser)

         
             
    }

    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get users!"});

    }
}

export const deleteUser =async (req,res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if(id !== tokenUserId){
        return res.status(403).json({message: "Unauthorized!"});
    }
    try{
        await prisma.user.delete({
            where:{id},
        });
        res.status(200).json({message: "User deleted successfully!"});
        

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete users!"});
    }
}