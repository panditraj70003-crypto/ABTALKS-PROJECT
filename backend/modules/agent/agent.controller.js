const asyncHandler = require("../../middleware/asyncHandler");
const ApiError = require("../../utils/ApiError");

const agentService = require("./agent.service");

const {
    runAgent,
    startScheduler
} = require("../scheduler/publisher.job");


// ======================================
// Initialize Agent
// ======================================

const initAgent = asyncHandler(async (req, res) => {

    const { name, domain } = req.body.persona;


    // Create agent
    const agent =
        await agentService.createAgent({
            name,
            domain
        });


    console.log(
        `Agent initialized: ${agent._id}`
    );


    // ==================================
    // FIRST POST
    // ==================================

    try {

        await runAgent(agent);

    } catch (error) {

        console.error(
            "Initial autonomous cycle failed:",
            error
        );

        throw error;
    }


    // ==================================
    // START FUTURE AUTONOMOUS CYCLES
    // ==================================

    startScheduler(agent._id);


    return res.status(201).json({
        agentId: agent._id
    });
});


// ======================================
// Get Feed
// ======================================

const getFeed = asyncHandler(async (req, res) => {

    const { agentId } = req.query;


    const agent =
        await agentService.getAgentById(
            agentId
        );


    if (!agent) {

        throw new ApiError(
            404,
            "Agent not found"
        );
    }


    // IMPORTANT:
    // Feed ONLY reads MongoDB.
    //
    // No discovery.
    // No Groq.
    // No scheduler.
    // No post generation.

    const posts =
        await agentService.getFeed(
            agentId
        );


    return res.status(200).json({
        posts
    });
});


module.exports = {
    initAgent,
    getFeed
};