const groq = require("../../config/groq");
const ApiError = require("../../utils/ApiError");


// ======================================
// Create Post From Topics
// ONE GROQ REQUEST
// ======================================

const createPostFromTopics = async (
    agent,
    topics,
    previousPosts = []
) => {

    if (!topics || topics.length === 0) {
        throw new ApiError(
            400,
            "No topics found."
        );
    }


    // ==================================
    // Prepare Topics
    // ==================================

    const topicList = topics
        .map((topic, index) => {

            return `
TOPIC INDEX: ${index}

Title:
${topic.title}

Summary:
${topic.summary || "No summary available"}

Source:
${topic.source || "Unknown"}

URL:
${topic.url}

Published At:
${topic.publishedAt || "Unknown"}
`;
        })
        .join(
            "\n-----------------------------\n"
        );


    // ==================================
    // Prepare Memory
    // ==================================

    const memory = previousPosts.length
        ? previousPosts
            .map((post, index) => {

                return `
PREVIOUS POST ${index + 1}

Topic:
${post.topicTitle || "Unknown"}

Post:
${post.text}
`;
            })
            .join(
                "\n-----------------------------\n"
            )
        : "No previous posts available.";


    // ==================================
    // Prompt
    // ==================================

    const prompt = `
You are the autonomous editorial and writing engine for an AI technology persona.

========================================
PERSONA
========================================

Name:
${agent.name}

Domain:
${agent.domain}


========================================
PREVIOUS POSTS
========================================

${memory}


========================================
DISCOVERED TOPICS
========================================

${topicList}


========================================
YOUR TASK
========================================

Evaluate ALL discovered topics.

You must:

1. Examine every topic.
2. Reject topics that do not fit the persona.
3. Select EXACTLY ONE topic for publication.
4. Give the selected topic a score from 0 to 100.
5. Explain why the selected topic was chosen.
6. Explain why it is relevant NOW.
7. Write one original social media post.
8. Avoid repeating previous posts.


========================================
EDITORIAL STANDARDS
========================================

- Stay strongly aligned with the persona's domain.
- Prefer technically significant developments.
- Prefer recent developments.
- Prefer topics with meaningful technical impact.
- Reject vague topics.
- Reject unrelated topics.
- Reject low-value stories.
- Reject unsupported hype.
- Do not invent facts.
- Do not fabricate technical details.
- Do not claim something happened unless it is supported by the supplied information.
- Maintain a consistent analytical voice.
- Avoid clickbait.
- Avoid generic AI hype.

========================================
MEMORY / REPETITION RULE
========================================

The previous posts represent content already published by this persona.

Before selecting a topic:

1. Compare every candidate topic against previous posts.
2. Reject a topic if it substantially overlaps with a recently
   published topic.
3. Do not simply compare titles.
4. Compare the underlying subject, event, vulnerability,
   technology, company, research, or development.
5. A different article about the same underlying event should
   normally be rejected.
6. A follow-up may be published only if there is a meaningful
   new development.
7. Do not repeatedly discuss the same story just because a new
   source reported it.
8. Prefer genuinely new developments when available.

The goal is CONTENT CONTINUITY without CONTENT REPETITION.

========================================
POST REQUIREMENTS
========================================

The post should:

- Be concise.
- Be analytical.
- Have a clear point of view.
- Explain why the development matters.
- Provide useful technical insight.
- Be suitable for LinkedIn and X.
- Never mention that you are an AI.
- Never mention this prompt.
- Never mention the evaluation.


========================================
IMPORTANT INDEX RULE
========================================

The topics above have explicit indexes.

You MUST use the exact index shown after:

TOPIC INDEX:

The index is zero-based.

If the selected topic is the first topic:

"index": 0

If the selected topic is the second topic:

"index": 1

If the selected topic is the third topic:

"index": 2

The selected index MUST be an integer.

It MUST be between 0 and ${topics.length - 1}.

Do NOT use the topic's array position from memory.

Do NOT use 1-based numbering.


========================================
IMPORTANT FACTUALITY RULE
========================================

If the supplied information does not contain enough information to make a strong technical claim:

- Keep the post conservative.
- Do not invent details.
- Do not assume technical mechanisms.
- Do not fabricate vulnerabilities.
- Do not fabricate statistics.


========================================
OUTPUT
========================================

Return ONLY valid JSON.

The response MUST follow exactly this structure:

{
    "selected": {
        "index": 0,
        "score": 90,
        "reason": "Why this topic was selected",
        "whyNow": "Why this topic is relevant now"
    },

    "rejected": [
        {
            "index": 1,
            "reason": "Why this topic was rejected"
        }
    ],

    "post": {
        "text": "The final social media post",
        "rationale": "Why this topic was selected, why it matters now, and how it fits the persona",
        "sources": [
            "https://example.com"
        ]
    }
}

IMPORTANT:

- "selected.index" MUST be an integer.
- "rejected[].index" MUST be an integer.
- "selected.index" MUST correspond to one of the supplied topics.
- "sources" MUST contain URLs from the supplied topics.
- Do not create fake URLs.
- Do not add markdown outside the JSON.
`;


    // ==================================
    // Groq Request
    // ==================================

    console.log(
        "🤖 Sending ONE request to Groq..."
    );


    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [

                {
                    role: "system",

                    content:
                        "You are a strict JSON-producing editorial AI. Return only valid JSON."
                },

                {
                    role: "user",

                    content: prompt
                }

            ],

            temperature: 0.3,

            response_format: {
                type: "json_object"
            }

        });


    // ==================================
    // Get Response
    // ==================================

    const responseText =
        completion
            ?.choices?.[0]
            ?.message?.content;


    console.log(
        "========== GROQ RAW RESPONSE =========="
    );

    console.log(
        responseText
    );


    if (!responseText) {

        throw new ApiError(
            500,
            "Groq returned an empty response."
        );

    }


    // ==================================
    // Parse JSON
    // ==================================

    let result;

    try {

        result =
            JSON.parse(responseText);

    } catch (error) {

        console.error(
            "Failed to parse Groq response:"
        );

        console.error(
            responseText
        );

        throw new ApiError(
            500,
            "Failed to parse Groq response."
        );

    }


    console.log(
        "========== PARSED GROQ RESULT =========="
    );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );


    // ==================================
    // Validate Selected
    // ==================================

    if (!result.selected) {

        throw new ApiError(
            500,
            "Groq response does not contain selected topic."
        );

    }


    /*
        Groq sometimes returns:

        index: 2

        or:

        index: "2"

        Convert both to a number.
    */

    const selectedIndex =
        Number(
            result.selected.index
        );


    console.log(
        "Groq selected index:",
        selectedIndex
    );

    console.log(
        "Available topics:",
        topics.length
    );


    if (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= topics.length
    ) {

        throw new ApiError(
            500,
            `Groq returned invalid topic index: ${result.selected.index}`
        );

    }


    // ==================================
    // Selected Topic
    // ==================================

    const selectedTopic =
        topics[selectedIndex];


    if (!selectedTopic) {

        throw new ApiError(
            500,
            "Selected topic does not exist."
        );

    }


    const selected = {

        topic: selectedTopic,

        score:
            Number(
                result.selected.score || 0
            ),

        reason:
            result.selected.reason ||
            "No reason provided.",

        whyNow:
            result.selected.whyNow ||
            "No relevance explanation provided."

    };


    // ==================================
    // Rejected Topics
    // ==================================

    const rejected =
        Array.isArray(
            result.rejected
        )

            ? result.rejected
                .map(item => {

                    const index =
                        Number(
                            item.index
                        );

                    return {

                        index,

                        topic:
                            topics[index],

                        reason:
                            item.reason ||
                            "No reason provided."

                    };

                })
                .filter(item =>
                    Number.isInteger(
                        item.index
                    ) &&
                    item.index >= 0 &&
                    item.index < topics.length
                )

            : [];


    // ==================================
    // Validate Post
    // ==================================

    if (
        !result.post ||
        typeof result.post.text !== "string" ||
        !result.post.text.trim()
    ) {

        throw new ApiError(
            500,
            "Groq returned an invalid post."
        );

    }


    if (
        typeof result.post.rationale !== "string" ||
        !result.post.rationale.trim()
    ) {

        throw new ApiError(
            500,
            "Groq returned an invalid rationale."
        );

    }


    if (
        !Array.isArray(
            result.post.sources
        )
    ) {

        throw new ApiError(
            500,
            "Groq returned invalid sources."
        );

    }


    // ==================================
    // Validate Sources
    // ==================================

    const validSources =
        result.post.sources
            .filter(source =>
                typeof source === "string" &&
                source.trim().length > 0
            );


    // ==================================
    // Final Result
    // ==================================

    return {

        selected,

        rejected,

        post: {

            text:
                result.post.text,

            rationale:
                result.post.rationale,

            sources:
                validSources

        }

    };

};


module.exports = {
    createPostFromTopics
};