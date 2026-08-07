require("dotenv").config();
const express = require("express");
const connectDB  =require("./config/db");
const agentRoutes = require("./modules/agent/agent.routes");

const app = express();

app.use(express.json());

connectDB();
app.use("/api/agent", agentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
});