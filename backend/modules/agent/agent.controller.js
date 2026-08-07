const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const agentService = require("./agent.service");

const initAgent = asyncHandler(async (req, res) => {

    const { name, domain } = req.body.persona;

    const agent = await agentService.createAgent({
        name,
        domain,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                agentId: agent._id,
            },
            "Agent initialized successfully"
        )
    );
});

module.exports = {
    initAgent,
};