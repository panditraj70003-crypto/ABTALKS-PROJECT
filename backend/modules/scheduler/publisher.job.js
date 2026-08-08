const Agent = require("../agent/agent.model");
const discovery = require("../discovery/discovery.service");
const llmService = require("../llm/llm.service");
const agentService = require("../agent/agent.service");


// ======================================
// Run One Autonomous Agent Cycle
// ======================================

const runAgent = async (agent) => {

    console.log(`Running agent: ${agent.name}`);

    const topics =
        await discovery.discoverTopics();

    if (!topics.length) {
        console.log("No topics discovered.");
        return;
    }

    const previousPosts =
        await agentService.getRecentPosts(
            agent._id,
            10
        );

    const result =
        await llmService.createPostFromTopics(
            agent,
            topics,
            previousPosts
        );

    console.log("Selected topic:");
    console.log(result.selected);

    console.log("Rejected topics:");
    console.log(result.rejected);

    console.log("Generated post:");
    console.log(result.post);

    const post =
        await agentService.createPost({

            agentId: agent._id,

            text: result.post.text,

            rationale: result.post.rationale,

            sources: result.post.sources

        });

    console.log(
        "Post saved:",
        post._id
    );

    agent.lastRunAt = new Date();

    await agent.save();
};


// ======================================
// Run All Active Agents
// ======================================

const runAllAgents = async () => {

    const agents = await Agent.find({
        isActive: true
    });


    for (const agent of agents) {

        try {

            await runAgent(agent);

        } catch (error) {

            console.error(
                `Agent ${agent._id} failed:`,
                error.message
            );

        }
    }
};


// ======================================
// Scheduler
// ======================================

const cron = require("node-cron");


const startScheduler = () => {

    // TEMPORARY:
    // Run every 5 minutes for testing.

    cron.schedule(
        "*/5 * * * *",
        async () => {

            console.log(
                `[${new Date().toISOString()}] Autonomous cycle started`
            );

            await runAllAgents();

        }
    );


    console.log(
        "Autonomous publisher started."
    );
};


module.exports = {
    runAgent,
    runAllAgents,
    startScheduler,
};