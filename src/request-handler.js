try {
	var overrideHandlers = require("./handlers");
} catch (err) {
	console.log("No handlers.js detected, using default handlers.");
}

// if the requestUrl is /details/:id/bob and the handlerUrl is /details/123/bob 
// then this is a successful match and the return data is { match: true, params: { id: 123 } }
var tryMatchUrl = function(requestUrl, handlerUrl) {

	if (requestUrl === handlerUrl) {
		// urls match exactly and there are no params
		return { match: true };
	}

	var params = {};
	
	var handlerUrlParts = handlerUrl.split("?")[0].split("/");
	var requestUrlParts = requestUrl.split("?")[0].split("/");
	
	var handlerQueryParts = (handlerUrl.indexOf("?") > -1) ? handlerUrl.split("?")[1].split("&") : [];
	var requestQueryParts = (requestUrl.indexOf("?") > -1) ? requestUrl.split("?")[1].split("&") : [];
	
	if (handlerUrlParts.length !== requestUrlParts.length) {
		return { match: false };
	}

	for (var i = 0; i < handlerUrlParts.length; i++) {
		var handlerUrlPart = handlerUrlParts[i];
		var requestUrlPart = requestUrlParts[i];

		if (handlerUrlPart[0] === ":") {
			params[handlerUrlPart.substring(1)] = requestUrlPart;
		} else if (handlerUrlPart !== requestUrlPart) {
			return { match: false };
		}
	}
	
	for (i = 0; i < handlerQueryParts.length; i++) {
		var handlerQueryPart = handlerQueryParts[i].split("=")[1];
		var requestQueryPart = (requestQueryParts.length >= i) ? requestQueryParts[i].split("=")[1] : null;
		
		if (handlerQueryPart[0] === ":") {
			params[handlerQueryPart.substring(1)] = requestQueryPart;
		} else if (handlerQueryPart !== requestQueryPart) {
			return { match: false };
		}
	}

	return { match: true, params: params };
};

var handleRequest = function(httpMethod) {
	return function(req, res, next) {
		if (overrideHandlers && overrideHandlers.handlers) {
			overrideHandlers.handlers.forEach(function (handler) {
				if (handler.method === httpMethod) {
					var matchResult = tryMatchUrl(req.url, handler.url);
					if (matchResult.match) {
						req.params = matchResult.params;
						return handler.action(req, res, next);
					}
				}
			});
		}

		throw "Could not find handler for: [" + httpMethod + "][" + req.url + "]";
	}
};

module.exports = {
	handle: handleRequest
};
