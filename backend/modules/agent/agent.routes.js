const router = require("express").Router();

const controller = require("./agent.controller");
const validate = require("../../middleware/validate.middleware");

const { initAgentSchema } = require("./agent.validation");

router.post(
    "/init",
    validate(initAgentSchema),
    controller.initAgent
);

module.exports = router;