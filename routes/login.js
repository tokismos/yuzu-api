require('dotenv').config();
const router = require("express").Router();

router.post("/", async (req, res) => {
    console.log('salut login')
    const { username, password } = req.body;


    const { DASHBOARD_USERNAME, DASHBOARD_PASSWORD } = process.env;
    console.log({ username, password, DASHBOARD_USERNAME, DASHBOARD_PASSWORD });

    if (DASHBOARD_USERNAME === username && DASHBOARD_PASSWORD === password) return res.send({ token: 'myAwesomeToken' });
    return res.status(401).send({ err: "Unauthorized" });
});

module.exports = router;