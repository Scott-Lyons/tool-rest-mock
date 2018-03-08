# tool-rest-mock

A simple api that can be used to mock real apis.

## Getting Started

Follow these steps to get tool-rest-mock running on your local machine:

1. Clone this repository locally (`git clone repo_address`)
2. `npm install`
3. `node .`

## Setting up `config.json`

The `config.json` the file has several important configuration settings used by the app. 
The file has the following content (as at 2017-04-04): 

```json
{
    "solutionInfo": {
        "product": "tool-rest-mock",
        "description": "Mocked rest api for local testing",
        "serviceName": "tool-rest-mock"
    },
    "web": {
        "ports": {
            "web": 8585
        },
        "headers": ["x-session-id"]
    },
    "logging": {
        "level": "INFO"
    }
}

```

Important things to note about `config.json`:
- `web.ports.web` - port that the tool will listen on. There is only one port.
- `web.headers` - headers supported by CORS.
- `logging.level` - currently only supports DEBUG and INFO, determines what is output to the console when running.

## Running `tool-rest-mock`

`node .`

After the service has started you can hit it with the following requests:

```
GET http://localhost:8585/query/test/ping
GET http://localhost:8585/query/test/foo/[fooId]
POST http://localhost:8585/command/test/ping
```
