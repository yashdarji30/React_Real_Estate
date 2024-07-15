import express from 'express';
const app = express();

app.use("/api/test", (req,res) => {
    res.send("work wprk");
})

app.listen(8800, () => {
    console.log("Server is runing"); 'Server is running'
})