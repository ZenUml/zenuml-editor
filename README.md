The code editor for Zenuml
---

# How to use
## As an iFrame
You can embed this editor in an iFrame then postMessage to it to load a diagram.

```html
<iframe src="https://xxx" width="100%" height="100%"></iframe>
```

Then postMessage to it to load a diagram.

```javascript
const iframe = document.querySelector('iframe');
iframe.addEventListener('load', () => {
  iframe.contentWindow.postMessage({
    method: 'replace',
    code: 'ZEN:...'
  }, '*');
});
```

## Available methods
- `replace` - Replace the current diagram with the given code
- `get` - Get the current diagram code
- `autoReport` - Enable or disable auto reporting

The editor starts wth a default diagram code snippet. You can replace it with your own code by sending a `replace` message to the editor.

```javascript
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  method: 'replace',
  code: 'ZEN:...'
}, '*');
```

You can also get the current diagram code by sending a `get` message to the editor.

```javascript
const iframe = document.querySelector('iframe');
window.addEventListener('message', (event) => {
  if (event.data.method === 'get') {
    console.log(event.data.result);
  }
});

iframe.contentWindow.postMessage({
  method: 'get'
}, '*');
```

You can enable or disable auto reporting by sending an `autoReport` message to the editor. Default is `false`, once enabled, the editor will automatically report the current diagram code to the parent window with a `autoReport` method.

```javascript

window.addEventListener('message', (event) => {
  if (event.data.method === 'autoReport') {
    console.log(event.data.result); // ok
  }
  if (event.data.method === 'get') {
    console.log(event.data.result); // codes whenever user changed
  }
});

const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage({
  method: 'autoReport',
  enabled: true
}, '*');
```
