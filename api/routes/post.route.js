import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();
import { getPosts,getPost,addPost,updatePost,deletePost } from "../controllers/post.controller.js";
router.get("/test",(req,res) => {
    console.log("router worksdfh"); 'routerworks' 
});
router.get("/",getPosts);
router.get("/:id",getPost);
router.post("/",verifyToken,addPost);
router.put("/:id",verifyToken,updatePost);
router.delete("/:id",verifyToken,deletePost);
 
export default router;  