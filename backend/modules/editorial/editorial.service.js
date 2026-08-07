const llmService = require("../llm/llm.service");

const chooseTopic = async (agent, topics) => {

    return await llmService.chooseBestTopic(
        agent,
        topics
    );

};

module.exports = {
    chooseTopic,
};