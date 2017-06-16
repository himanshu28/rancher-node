# rancher-node
Node client for the Rancher API

## Client

An API client is included in this package

```js
const Rancher = require('rancher-node');

const client = new Rancher.Client({ host: '127.0.0.1', port: 8080, access_key: 'SoMeToKeN', secret_key: 'someSecRetToken', environment: '1a5' });

client.getContainer(containerId).then((container) => {

  // gets the container for the provided container id
});
```

Many methods are available, until they're documented see [lib/index.js](lib/index.js) for details.