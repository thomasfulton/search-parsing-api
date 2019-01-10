# Env

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

# Usage

To start the api locally:
```
npm start
```
or to run it with docker:
```
npm run docker:build && npm run docker:start
```

Calling the api:


Sample request:

```
curl localhost/parse -H "Content-Type: application/json" --data '{"input":"test AND 3.5 AND 3 AND true AND !false OR (>3 OR <5) AND >=3.5 AND <=5 AND =6 AND \"6 AND 7\""}'
```

Sample response:
