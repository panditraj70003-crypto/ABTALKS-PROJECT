const Agent = require("./agent.model");
const ApiError = require("../../utils/ApiError");
const postService = require("../post/post.service");


const createAgent = async ({ name, domain }) => {

    const agent = await Agent.create({
        name,
        domain,
    });

    if (!agent) {
        throw new ApiError(
            500,
            "Failed to create agent"
        );
    }

    return agent;
};


const getAgentById = async (agentId) => {

    return await Agent.findById(agentId);
};


const getFeed = async (agentId) => {

    return await postService.getAgentPosts(
        agentId
    );
};


const getRecentPosts = async (
    agentId,
    limit = 10
) => {

    return await postService.getRecentPosts(
        agentId,
        limit
    );
};


const createPost = async (data) => {

    return await postService.createPost(
        data
    );
};

const hasPublishedTopic = async (
    agentId,
    topicUrl
) => {

    return await postService.hasPublishedTopic(
        agentId,
        topicUrl
    );
};


module.exports = {
    createAgent,
    getAgentById,
    getFeed,
    getRecentPosts,
    createPost,
    hasPublishedTopic
};