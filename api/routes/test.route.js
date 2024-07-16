import express from "express";
import {shouldeBeLoggedIn,shouldBeAdmin} from "../controllers/test.controller.js";
import {verifyToken} from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/test",(req,res) => {
    console.log("router worksdfh"); 'routerworks' 
});
router.get("/should-be-logged-in",verifyToken,shouldeBeLoggedIn); 
   
router.get("/should-be-admin",shouldBeAdmin); 

 
export default router;  