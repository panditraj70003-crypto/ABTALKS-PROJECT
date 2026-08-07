const Agent = require("./agent.model");
const ApiError = require("../../utils/ApiError");
const postService = require("../post/post.service");

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

const getFeed = async (agentId) => {

    const posts = await postService.getAgentPosts(agentId);

    return posts.map(post => ({
        id: post._id,
        createdAt: post.createdAt,
        text: post.text,
        rationale: post.rationale,
        sources: post.sources,
    }));
    
};

const getAgentById = async (agentId) => {
    return await Agent.findById(agentId);
};

module.exports = {
    createAgent,
    getFeed,
    getAgentById,
};