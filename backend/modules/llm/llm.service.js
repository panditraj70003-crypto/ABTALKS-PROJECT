const ai = require("../../config/gemini");
const ApiError = require("../../utils/ApiError");

const chooseBestTopic = async (persona, topics) => {

    if (!topics.length) {
        throw new ApiError(400, "No topics found.");
    }

    const topicList = topics
        .map(
            (topic, index) => `
${index}.

Title: ${topic.title}

Summary: ${topic.summary || "None"}

Source: ${topic.source}

Published At: ${topic.publishedAt}
`
        )
        .join("\n---------------------------\n");

    const prompt = `
You are the chief editor of an autonomous AI creator.

Persona

Name: ${persona.name}
Domain: ${persona.domain}

You have discovered multiple technology news stories.

Your job is to choose EXACTLY ONE story for publication.

Publishing Standards

- Strongly match the persona.
- Focus on AI and technology.
- Prefer technically important stories.
- Prefer recent stories.
- Reject marketing and hype.
- Reject duplicate ideas.
- Keep every reason below 30 words.

Topics

${topicList}

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations.

The JSON must match this structure:

{
    "selected": {
        "index": 0,
        "score": 95,
        "reason": "...",
        "whyNow": "..."
    },
    "rejected": [
        {
            "index": 1,
            "reason": "..."
        }
    ]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    selected: {
                        type: "OBJECT",
                        properties: {
                            index: {
                                type: "INTEGER"
                            },
                            score: {
                                type: "NUMBER"
                            },
                            reason: {
                                type: "STRING"
                            },
                            whyNow: {
                                type: "STRING"
                            }
                        },
                        required: [
                            "index",
                            "score",
                            "reason",
                            "whyNow"
                        ]
                    },
                    rejected: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                index: {
                                    type: "INTEGER"
                                },
                                reason: {
                                    type: "STRING"
                                }
                            },
                            required: [
                                "index",
                                "reason"
                            ]
                        }
                    }
                },
                required: [
                    "selected",
                    "rejected"
                ]
            }
        }
    });

    let result;

    try {

        result = JSON.parse(response.text);

    } catch (err) {

        console.error("Gemini Response:");
        console.error(response.text);

        throw new ApiError(
            500,
            "Failed to parse Gemini response."
        );
    }

    const selectedIndex = result.selected.index;

    if (
        selectedIndex < 0 ||
        selectedIndex >= topics.length
    ) {
        throw new ApiError(
            500,
            "Gemini returned an invalid topic index."
        );
    }

    return {

        selected: {

            topic: topics[selectedIndex],

            score: result.selected.score,

            reason: result.selected.reason,

            whyNow: result.selected.whyNow
        },

        rejected: result.rejected
            .filter(
                item =>
                    item.index >= 0 &&
                    item.index < topics.length
            )
            .map(item => ({

                topic: topics[item.index],

                reason: item.reason

            }))
    };
};

module.exports = {
    chooseBestTopic,
};