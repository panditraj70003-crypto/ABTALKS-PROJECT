const { z } = require("zod");

const initAgentSchema = z.object({
    body: z.object({
        persona: z.object({
            name: z.string().min(1),
            domain: z.string().min(1),
        }),
    }),
});

module.exports = {
    initAgentSchema,
};