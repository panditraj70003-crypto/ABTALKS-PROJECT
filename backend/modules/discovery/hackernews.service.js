const axios = require("axios");

const getTopStories = async () => {

    const ids = await axios.get(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const top10 = ids.data.slice(0, 10);

    const stories = await Promise.all(
        top10.map(async (id) => {

            const story = await axios.get(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );

            return story.data;
        })
    );

    return stories
        .filter(story => story.type === "story")
        .map(story => ({
            title: story.title,
            summary: "",
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            source: "Hacker News",
            publishedAt: new Date(story.time * 1000),
        }));
};

module.exports = {
    getTopStories,
};