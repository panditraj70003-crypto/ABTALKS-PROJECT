const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },

        topicTitle: {
            type: String,
            required: true,
        },
        topicUrl: {
            type: String,
            required: true,
            trim: true
        },

        text: {
            type: String,
            required: true,
        },

        rationale: {
            type: String,
            required: true,
        },

        sources: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);