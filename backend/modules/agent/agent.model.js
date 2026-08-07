const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        domain: {
            type: String,
            required: true,
            trim: true,
        },

        personality: {
            type: String,
            default: "",
        },

        editorialRules: {
            type: [String],
            default: [],
        },

        initializedAt: {
            type: Date,
            default: Date.now,
        },

        lastRunAt: Date,

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Agent", agentSchema);