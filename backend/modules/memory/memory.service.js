const Post = require("../post/post.model");

const hasPublishedTopic = async (agentId, topic) => {

    if (!topic) {
        return false;
    }

    const existingPost = await Post.findOne({
        agentId,
        $or: [
            { topicTitle: topic.title },
            { sources: topic.url },
        ],
    }).lean();

    return Boolean(existingPost);
};


const getRecentMemory = async (agentId, limit = 10) => {

    return await Post.find({ agentId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(
            "topicTitle text rationale sources createdAt"
        )
        .lean();
};


module.exports = {
    hasPublishedTopic,
    getRecentMemory,
};