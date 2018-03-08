var config = require("../config");
var restify = require("restify");
var corsMiddleware = require("restify-cors-middleware");
var requestHander = require("./request-handler");
var chalk = require("chalk");

var start = function () {
    var server = restify.createServer({
        name: config.solutionInfo.description + " [ReST-mock]"
    });
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    var configHeaders = (config.web.headers) ? config.web.headers : [];

    var cors = corsMiddleware({
        origins: ['*'],
        allowHeaders: configHeaders
    });

    server.pre(cors.preflight);
    server.use(cors.actual);


    var returnNotFound = function (req, res, next) {
        res.send(404, "404, not found");
        return next();
    };

    // test
    server.get("/query/test/.*", requestHander.handle("GET"));
    server.put("/command/test/.*", requestHander.handle("PUT"));
    server.patch("/command/test/.*", requestHander.handle("PATCH"));
    server.post("/command/test/.*", requestHander.handle("POST"));
    server.del("/command/test/.*", requestHander.handle("DELETE"));
    // generic
    server.get("/favicon.ico", function (req, res, next) {
        res.send(200, "fav!");
        return next();
    });

    server.opts(/.*/, function (req, res) {
        res.send(204)
    });
    server.get(/.*/, returnNotFound);
    server.put(/.*/, returnNotFound);
    server.patch(/.*/, returnNotFound);
    server.post(/.*/, returnNotFound);
    server.del(/.*/, returnNotFound);

    server.pre(restify.pre.userAgentConnection());

    server.on("request", function (req, res) {
        res.on("finish", function () {
            console.log(chalk.yellow(req.method) + " " + req.url);
            if (config.logging.level === "DEBUG") {
                console.log(chalk.blue(req.headers));
            }

            if (res.statusCode.toString().indexOf("2") == 0) {
                console.log(chalk.green(res.statusCode));
            } else {
                console.log(chalk.red(res.statusCode));
            }
            req.socket.destroy();
            console.log(chalk.blue("-----------------------"));
        });
    });

    server.listen(config.web.ports.web, function() {
        console.log("%s listening at %s", server.name, server.url);
    });
};


module.exports = {
    start: start
};
