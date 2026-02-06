const React = require('react');

const WebView = React.forwardRef(function WebView(props, ref) {
  return React.createElement('View', { ref, ...props }, props.children);
});

module.exports = { WebView, default: WebView };
