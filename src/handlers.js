var fooDetails = require("./data/foo-details.json");

var returnPing = function (req, res, next) {
    res.send({"ping": "ping response"});
    return next();
};

var returnNoContent = function (req, res, next) {
    res.send(204);
    return next();
};

var returnFooData = function (req, res, next) {
    res.send(fooDetails);
    return next();
};

var handlers = [
    // test -----------------------------
    {
        method: "GET",
        url: "/query/test/ping",
        action: returnPing
    }, {
        method: "GET",
        url: "/query/test/foo/:fooId",
        action: returnFooData
    }, {
        method: "POST",
        url: "/command/test/ping",
        action: returnNoContent
    }
];

module.exports = {
    handlers: handlers
};
