import express from "express";
const router = express.Router();

router.get("/test",(req,res) => {
    console.log("router worksdfh"); 'routerworks' 
});
// router.post("/test",(req,res) => {
//     console.log("router works"); 'routerworks' 
// });
// router.put("/test",(req,res) => {
//     console.log("router works"); 'routerworks' 
// });
// router.delete("/test",(req,res) => {
//     console.log("router works"); 'routerworks' 
// });
 
export default router;  