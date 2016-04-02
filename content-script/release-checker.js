var script = document.createElement('script');
script.src = chrome.extension.getURL('web/release-checker.js?' + Date.now());
document.body.appendChild(script);
