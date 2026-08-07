const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const discovery = require("../discovery/discovery.service");
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

    const topics = await discovery.discoverTopics();
    console.log(topics);

    const { agentId } = req.query;

    const posts = await agentService.getFeed(agentId);

    return res.status(200).json({posts});
});

module.exports = {
    initAgent,
    getFeed,
};