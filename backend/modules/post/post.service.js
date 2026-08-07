const Post = require("./post.model");

const getAgentPosts = async (agentId) => {
    return await Post.find({ agentId })
        .sort({ createdAt: -1 })
        .lean();
};

module.exports = {
    getAgentPosts,
};