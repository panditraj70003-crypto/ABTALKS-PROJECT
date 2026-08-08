
const Agent = require("../agent/agent.model");
const discovery = require("../discovery/discovery.service");
const llmService = require("../llm/llm.service");
const agentService = require("../agent/agent.service");


// ======================================
// Run One Autonomous Agent Cycle
// ======================================

const runAgent = async (agent) => {

    console.log("");
    console.log("=================================");
    console.log(`Running agent: ${agent.name}`);
    console.log(`Agent ID: ${agent._id}`);
    console.log("=================================");


    // ==================================
    // 1. Discover Topics
    // ==================================

    console.log("🔎 Discovering topics...");

    const topics =
        await discovery.discoverTopics();

    console.log(
        `Topics discovered: ${topics.length}`
    );


    if (!topics.length) {

        console.log(
            "⚠️ No topics discovered."
        );

        return;
    }


    // ==================================
    // 2. Get Previous Posts
    // ==================================

    console.log(
        "🧠 Loading previous posts..."
    );

    const previousPosts =
        await agentService.getRecentPosts(
            agent._id,
            10
        );

    console.log(
        `Previous posts loaded: ${previousPosts.length}`
    );


    // ==================================
    // 3. ONE GROQ REQUEST
    // ==================================

    console.log(
        "🤖 Sending topics to Groq..."
    );

    const result =
        await llmService.createPostFromTopics(
            agent,
            topics,
            previousPosts
        );


    // ==================================
    // 4. Editorial Result
    // ==================================

    console.log("");
    console.log("========== SELECTED TOPIC ==========");

    console.log(
        result.selected
    );


    console.log("");
    console.log("========== REJECTED TOPICS ==========");

    console.log(
        result.rejected
    );


    // ==================================
    // 5. Generated Post
    // ==================================

    console.log("");
    console.log("========== GENERATED POST ==========");

    console.log(
        result.post
    );


    // ==================================
    // 6. Save Post
    // ==================================

    console.log("");
    console.log(
        "💾 Saving post to MongoDB..."
    );

    const post =
    await agentService.createPost({

        agentId: agent._id,

        topicTitle:
            result.selected.topic.title,

        text:
            result.post.text,

        rationale:
            result.post.rationale,

        sources:
            result.post.sources

    });


    console.log("");
    console.log(
        `✅ POST CREATED: ${post._id}`
    );

    console.log(
        `Created At: ${post.createdAt}`
    );


    // ==================================
    // 7. Update Agent
    // ==================================

    agent.lastRunAt = new Date();

    await agent.save();


    console.log(
        `✅ Agent ${agent.name} completed successfully`
    );
};


// ======================================
// Run All Active Agents
// ======================================

const runAllAgents = async () => {

    console.log("");
    console.log(
        "🔍 Looking for active agents..."
    );


    const agents = await Agent.find({
        isActive: true
    });


    console.log(
        `Active agents found: ${agents.length}`
    );


    if (agents.length === 0) {

        console.log(
            "❌ No active agents found."
        );

        return;
    }


    // ==================================
    // Run Each Agent
    // ==================================

    for (const agent of agents) {

        console.log("");
        console.log(
            `▶ Starting agent: ${agent.name}`
        );


        try {

            await runAgent(agent);


            console.log(
                `✅ Finished agent: ${agent.name}`
            );


        } catch (error) {

            console.error("");
            console.error(
                `❌ Agent ${agent._id} failed`
            );

            console.error(
                error
            );
        }
    }
};


// ======================================
// Start Autonomous Scheduler
// ======================================
// ======================================
// Start Scheduler For One Agent
// ======================================

const startScheduler = (agentId) => {

    console.log("");
    console.log("=================================");
    console.log(
        `🚀 AUTONOMOUS SCHEDULER STARTED`
    );
    console.log(
        `Agent: ${agentId}`
    );
    console.log("=================================");


    // ==================================
    // Temporary testing:
    // run every 1 minute
    // ==================================

    setInterval(
        async () => {

            console.log("");
            console.log("=================================");
            console.log(
                `⏰ AUTONOMOUS CYCLE`
            );
            console.log(
                new Date().toISOString()
            );
            console.log("=================================");


            try {

                const agent =
                    await Agent.findById(
                        agentId
                    );


                // Agent was deleted
                if (!agent) {

                    console.log(
                        "❌ Agent no longer exists."
                    );

                    return;
                }


                // Agent was disabled
                if (!agent.isActive) {

                    console.log(
                        "⏸️ Agent is inactive."
                    );

                    return;
                }


                // Run autonomous cycle
                await runAgent(agent);


            } catch (error) {

                console.error(
                    "❌ Autonomous cycle failed:"
                );

                console.error(error);
            }

        },

        30*60 * 1000
    );
};


// ======================================
// Exports
// ======================================

module.exports = {
    runAgent,
    runAllAgents,
    startScheduler
};

