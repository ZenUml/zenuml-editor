The code editor for ZenUML
---

# Quick test
1. Open https://embed-editor.zenuml.com/embed.html
2. Open the console (`F12` on Chrome)
3. Paste the following code in the console and press enter

```javascript
// Post the code to the editor and render it
// If the editor is in an iFrame, you need to post to `iframe.contentWindow`  
window.postMessage({
    method: 'replace',
    code: 'Participant.Message'
  }, '*');
```

# How to use
## As an iFrame
You can embed this editor in an iFrame then postMessage to it to load a diagram.

```html
<iframe src="https://embed-editor.zenuml.com/embed.html" width="100%" height="100%"></iframe>
```

Then postMessage to it to load a diagram.

```javascript
const iframe = document.querySelector('iframe');
iframe.addEventListener('load', () => {
  iframe.contentWindow.postMessage({
    method: 'replace',
    code: 'Participant.Message'
  }, '*');
});
```

## Available methods
- `replace` - Replace the current diagram with the given code
- `get` - Get the current diagram code
- `autoReport` - Enable or disable auto reporting
- `theme` - Set the theme
- `png` - Get the current diagram as a PNG image

The editor starts wth a default diagram code snippet. You can replace it with your own code by sending a `replace` message to the editor.

```javascript
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  method: 'replace',
  code: 'Participant.Message'
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

You can set the theme by sending a `theme` message to the editor. Default is empty name, you can also set it to `theme-black-white`, `theme-blue` and `theme-star-uml`.

```javascript
window.addEventListener('message', (event) => {
  if (event.data.method === 'theme') {
    console.log(event.data.result); // ok
  }
});

const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  method: 'theme',
  theme: 'theme-star-uml'
}, '*');
```

You can get the current diagram as a PNG image by sending a `png` message to the editor. The editor will reply with a `png` method.

```javascript
window.addEventListener('message', (event) => {
  if (event.data.method === 'png') {
    console.log(event.data.result); // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
  }
});

const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  method: 'png'
}, '*');
```
