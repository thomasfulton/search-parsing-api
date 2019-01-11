# Setup

This uses Node.js 10.15.0 with npm 6.4.1. Install nvm

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

and then

```
nvm install && nvm use
```

to get the right verson of Node.js.
`npm i -g 6.4.1`
to get the right version of npm.

Alternately, install Docker and use the dockerized build & run commands. In that case you won't need any dependencies other than Docker to run the API. You'll still need Node.js and npm to run the test suite, however.

# Usage

To start the api locally:

```
npm start
```

or to run it with docker:

```
npm run docker:build && npm run docker:run
```

Calling the api:

`POST /parse` with JSON body `{ "input": "<input>" }`. Response is of the form `{ "output": <output tree> }`

Sample request:

```
curl localhost/parse -H "Content-Type: application/json" --data '{"input":"test AND 3.5 AND 3 AND true AND !false OR (>3 OR <5) AND >=3.5 AND <=5 AND =6 AND \"6 AND 7\""}'
```

Sample response:

```
{"output":{"$or":[{"$and":[{"$and":[{"$and":[{"$and":["test",3.5]},3]},true]},{"$not":false}]},{"$and":[{"$and":[{"$and":[{"$and":[{"$or":[{"$gt":3},{"$lt":5}]},{"$ge":3.5}]},{"$le":5}]},{"$eq":6}]},{"$quoted":"6 AND 7"}]}]}}
```

# Test suite

```
npm t
```

to run the test suite.

# Caveats

- The way I implemented it, the parser cannot handle extra spaces. If I were to do this again I would change it to make that feasable by trimming all whitespace and then, in the parser, implicitly ANDing any two adjacent nodes with no infixed operator.
- The error handling is not robust. Some obvious errors are caught but I'm sure there are plenty of edge cases that are not dealt with gracefully.
