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

export const savePost =async (req,res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    
    try{

        const savedPost = await prisma.user.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });
       if(savedPost){
         await prisma.savedPost.delete({
            where:{
                id: savePost.id,
            },
         });
         res.status(200).json({message : "post removed from saved list"});
       }
       else{
        await prisma.savedPost.create({
            where:{
                userId: tokenUserId,
                postId,
            },
         });
         res.status(200).json({message : "post saved list"});
       }
       

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete users!"});
    }
}

export const profilePosts = async (req,res) =>{
    const tokenUserId = req.params.userId;

    try{
        const userPosts = await prisma.post.findMany({
            where:{userId:tokenUserId},
            include:{
                post:true,
            },
        });

        const savedPosts = saved.map((item) => item.postId);

        res.status(200).json({userPosts,savedPosts});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get Profile post!"});
    }
}

export const getNotificationNumber = async (req,res) => {
     const tokenUserId = req.userId;
     try{
        const number = await prisma.chat.count({
            where:{
                userIDs:{
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId],
                    }
                }
            }
        })
        res.status(200).json(number);
     }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get Profile post!"});
     }
}