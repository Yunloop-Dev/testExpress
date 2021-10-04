require("dotenv").config();
require("./Strategies/discord");
//
const express = require("express");
const app = express();
const port = process.env.PORT_SITE;
const routes = require("./routes");
const passport = require("passport");
//

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", routes);
app.listen(port);
console.info(`Server is Online : ${port}`);
