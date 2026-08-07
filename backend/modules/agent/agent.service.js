const Agent = require("./agent.model");
const ApiError = require("../../utils/ApiError");

const createAgent = async ({ name, domain }) => {

    const agent = await Agent.create({
        name,
        domain,
    });

    if (!agent) {
        throw new ApiError(500, "Failed to create agent");
    }

    return agent;
};

module.exports = {
    createAgent,
};