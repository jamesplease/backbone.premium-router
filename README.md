# backbone.premium-router
[![Travis build status](http://img.shields.io/travis/jmeas/backbone.premium-router.svg?style=flat)](https://travis-ci.org/jmeas/backbone.premium-router)
[![Code Climate](https://codeclimate.com/github/jmeas/backbone.premium-router/badges/gpa.svg)](https://codeclimate.com/github/jmeas/backbone.premium-router)
[![Dependency Status](https://david-dm.org/jmeas/backbone.premium-router.svg)](https://david-dm.org/jmeas/backbone.premium-router)
[![devDependency Status](https://david-dm.org/jmeas/backbone.premium-router/dev-status.svg)](https://david-dm.org/jmeas/backbone.premium-router#info=devDependencies)

A premium routing solution for Backbone.

### Features

- Callbacks for the most common actions when changing URLs: fetching data, then showing views
- Easily add authentication/authorization to routes
- Cancel navigation (for instance, if a Model is unsaved)
- Re-route during transitions
- Extends from Backbone.Router, rather than replacing it

### Motivation

Backbone's Router was developed to only be used when the page first loads. In other words, passing `trigger: true` to `navigate` is discouraged.
This is an approach to routing that is rapidly declining in popularity in web development. Even within the Backbone community, fewer and fewer Backbone
developers are using the Router in the intended way. Other popular frameworks, like Ember, Angular, and React, all take the approach of
activating route handlers **every** time a URL matches. By doing so, you can move much of the management of application state into the router,
simplifying your application's code tremendously.

This fundamental difference in how Backbone approaches routing manifests itself in the API the Backbone Router exposes: it is simple to a fault.
PremiumRouter is a small extension to Backbone's Router that makes it **drastically** more powerful.

### Getting Started

The PremiumRouter extends from a regular Backbone Router. Because of this, its API for registering routes may be familiar to you.

```js
// Create a new PremiumRouter
var router = new Backbone.PremiumRouter({
  
  // Just like Backbone's Router, we can pass our routes
  // in at creation time. Instead of a callback, though, associate
  // Route classes with your URLs.
  routes: {
    'home': HomeRoute,
    'books/:bookId': BookRoute
  }
});
```

A Route is a Class that exists on the `PremiumRouter` class. In the simplest implementation,
they can be used to fetch data, and then show a view. These two actions will happen each time
the Route is matched.

```js

// The base Route Class is attached to the ObjectRoute
var BookRoute = Backbone.PremiumRouter.Route.extend({

  // Fetch is called when the route is entered. Use it
  // to fetch data.
  fetch: function(routeData) {

    // In this case, we're fetching a model called `book`.
    return book.fetch();
  },

  // Once the data has been fetched, we create a new BookView,
  // render it, then attach it to the `body` of the page.
  show: function() {
    new BookView()
      .render()
      .$el.appendTo('body');
  }
});
```

As you might have guessed, both fetching and showing are optional. If your route doesn't need to do one, or both,
of those things, simply omit them.

This is just a small taste of what's possible with the PremiumRouter. For more, refer to the API documentation below.

### API

Coming soon!

### Caveats

Avoid using `Backbone.history.navigate` when using the `PremiumRouter`. Always go through the `navigate` method
on the router or route instances.

### Problems not solved by PremiumRouter

PremiumRouter does not make any changes to Backbone.history. Accordingly, you must keep these things in
mind:

1. Routes are **still** matched in a first-come-first-serve basis.
2. `trigger: true` must always be passed to `navigate` if you wish for the Route to be
  changed.

### FAQ

#### Should I use `trigger: true`?

Yes, always. Backbone's official recommendation is to never use `trigger: true`, but the standard Backbone
Router is not intended to be used in the same way that PremiumRouter is. Backbone's style of routing comes
from the jQuery days of development, and it has essentially been abandoned by the greater web development community.

#### Are there any other libraries related to Routing that work well with this library?

[Backbone.Intercept](https://github.com/jmeas/backbone.intercept) is a library integrates well with the PremiumRouter. It makes it easier to
automatically manage `trigger: true` when users of your application click links.
