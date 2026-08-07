const hackerNews = require("./hackernews.service");

const discoverTopics = async () => {

    const topics = [];

    const hnTopics = await hackerNews.getTopStories();

    topics.push(...hnTopics);

    return topics;
};

module.exports = {
    discoverTopics,
};