# backbone.state-router

A Router that manages the state of your application.

# About

Backbone's Router, like many other Backbone objects, is much too simple for anything
other than the simplest of applications. But the Router is worse off than other objects,
because it's hardcoded to function in basically only way: setting up the initial state of your
application.

The success of Angular's UI-Router and Ember's Router have demonstrated that routers can, and
should, do more than that. This Router adopts the philosophies of those two routers by providing
a simple interface for managing your app's state.

### Dependencies

- `window.Promise` must exist, and it must be A+ compliant.
- Underscore
- Backbone

### Getting Started
