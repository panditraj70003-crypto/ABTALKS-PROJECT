require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const agentRoutes = require("./modules/agent/agent.routes");

const app = express();

app.use(express.json());

app.use("/api/agent", agentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`);
        });

    } catch (error) {

        console.error(
            "❌ Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();