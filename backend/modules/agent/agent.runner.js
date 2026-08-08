const Agent = require("./agent.model");

const discoveryService =
    require("../discovery/discovery.service");

const editorialService =
    require("../editorial/editorial.service");

const memoryService =
    require("../memory/memory.service");

const llmService =
    require("../llm/llm.service");

const postService =
    require("../post/post.service");


const runAgent = async (agentId) => {

    console.log(`🤖 Agent ${agentId} started`);

    const agent = await Agent.findById(agentId);

    if (!agent) {
        console.log(`❌ Agent ${agentId} not found`);
        return;
    }

    if (!agent.isActive) {
        console.log(`⏸️ Agent ${agentId} is inactive`);
        return;
    }

    try {

        // 1. Discover topics
        const topics =
            await discoveryService.discoverTopics();

        console.log(
            `📰 Discovered ${topics.length} topics`
        );

        if (!topics.length) {
            console.log("No topics discovered");
            return;
        }


        // 2. Editorial selection
        const result =
            await editorialService.chooseTopic(
                agent,
                topics
            );

        if (!result || !result.selected) {
            console.log("❌ No suitable topic found");
            return;
        }

        const selectedTopic =
            result.selected.topic;

        console.log(
            `✅ Selected topic: ${selectedTopic.title}`
        );


        // 3. Memory check
        const alreadyPublished =
            await memoryService.hasPublishedTopic(
                agentId,
                selectedTopic
            );

        if (alreadyPublished) {

            console.log(
                `🧠 Topic already published: ${selectedTopic.title}`
            );

            return;
        }

        console.log(
            `🆕 New topic: ${selectedTopic.title}`
        );


        // 4. Get recent memory
        const recentPosts =
            await memoryService.getRecentMemory(
                agentId,
                10
            );

        console.log(
            `🧠 Loaded ${recentPosts.length} previous posts`
        );


        // 5. Generate post
        console.log("✍️ Generating post...");

        const generatedPost =
            await llmService.generatePost({
                agent,
                topic: selectedTopic,
                recentPosts,
            });

        console.log("✅ Post generated");


        // 6. Save post
        const post =
            await postService.createPost({
                agentId: agent._id,
                topicTitle: selectedTopic.title,
                text: generatedPost.text,
                rationale: generatedPost.rationale,
                sources: generatedPost.sources,
            });

        console.log(
            `💾 Post saved: ${post._id}`
        );

    } catch (error) {

        console.error(
            `❌ Agent ${agentId} failed:`,
            error.message
        );
    }
};


module.exports = {
    runAgent,
};