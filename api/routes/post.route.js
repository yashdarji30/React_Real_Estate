import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
import { getPosts,getPost,addPost,updatePost,deletePost,addMultiplePosts } from "../controllers/post.controller.js";
router.get("/test",(req,res) => {
    console.log("router worksdfh"); 'routerworks' 
});
router.get("/",getPosts);
router.get("/:id",getPost);
router.post("/",verifyToken,addPost);
router.post("/multiple", verifyToken, addMultiplePosts);
router.put("/:id",verifyToken,updatePost);
router.delete("/:id",verifyToken,deletePost);
 
export default router;  