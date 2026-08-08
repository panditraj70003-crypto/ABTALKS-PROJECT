const Post = require("./post.model");


const createPost = async (data) => {
    return await Post.create(data);
};


const getAgentPosts = async (agentId) => {
    return await Post.find({ agentId })
        .sort({ createdAt: -1 })
        .lean();
};


module.exports = {
    createPost,
    getAgentPosts,
};