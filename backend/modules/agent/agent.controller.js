const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const Agent  =require("../agent/agent.model");

const discovery = require("../discovery/discovery.service");
const editorial = require("../editorial/editorial.service");
const agentService = require("./agent.service");

const initAgent = asyncHandler(async (req, res) => {

    const { name, domain } = req.body.persona;

    const agent = await agentService.createAgent({
        name,
        domain,
    });

    return res.status(201).json({agentId: agent._id});
});

const getFeed = asyncHandler(async (req, res) => {

    const { agentId } = req.query;

    const agent = await agentService.getAgentById(agentId);

    const topics = await discovery.discoverTopics();

    const result = await editorial.chooseTopic(agent, topics);

    console.log(result.selected);
    console.log(result.rejected);

    const posts = await agentService.getFeed(agentId);

    return res.status(200).json({
        posts
    });

});

module.exports = {
    initAgent,
    getFeed,
};