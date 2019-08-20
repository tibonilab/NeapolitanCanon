# onStage client

onStage client for the onStage project: a powerful and easy-to-use analysis application interacting with Solr search engine. onStage is built on top of <a href="https://github.com/facebook/react/" target="_blank">React</a> library integrating <a href="https://github.com/ddmal/diva.js" target="_blank">DivaJS</a> for resources rendering.

This README provides simple instructions to run the application on your local machine.


Try it
---
A Demo is available here: <a href="http://onstage-beta.rism-ch.org/">http://onstage-beta.rism-ch.org/</a>.


Installation
---
`npm install`

Usage
---
Simply run `npm start` and enjoy onStage out of the box consuming the Demo search engine server.

Development
---
If you want to run a local server, plesae visit <a href="https://github.com/rism-ch/onstage-backend">rism-ch/onstage-backend</a> repository to find out how to install and run Solr on your local machine.

After `onstage-backend` installation change the `useRemoteServer` const to `true` on top of your `webpack.config.js` file.

```js
const useRemoteServer = true;
```

Then start the `solr-adaptor` server running ```node solr-adaptor/server.js```

And finally ```npm start```


Build
---
```npm run build```


Tips
---
A `.nvmrc` file is present referring to the latest stable node version, you can consume it with 
```
nvm install
nvm use
```