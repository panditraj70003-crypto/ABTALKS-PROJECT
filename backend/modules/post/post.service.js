const Post = require("./post.model");


// ======================================
// Create Post
// ======================================

const createPost = async (data) => {

    return await Post.create(data);

};


// ======================================
// Get All Posts For Agent
// ======================================

const getAgentPosts = async (agentId) => {

    return await Post.find({
        agentId
    })
        .sort({
            createdAt: -1
        })
        .lean();

};


// ======================================
// Get Recent Posts
// Used as AI Memory
// ======================================

const getRecentPosts = async (
    agentId,
    limit = 10
) => {

    return await Post.find({
        agentId
    })
        .sort({
            createdAt: -1
        })
        .limit(limit)
        .lean();

};


module.exports = {
    createPost,
    getAgentPosts,
    getRecentPosts
};