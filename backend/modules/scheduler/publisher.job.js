const cron = require("node-cron");

const { runAgent } = require("../agent/agent.runner");

const startPublisher = (agentId) => {

    console.log(
        `⏰ Scheduler started for agent ${agentId}`
    );

    const job = cron.schedule("*/15 * * * *", async () => {

        console.log(
            `\n🔄 Running autonomous cycle for ${agentId}`
        );

        await runAgent(agentId);

    });

    return job;
};

module.exports = {
    startPublisher,
};