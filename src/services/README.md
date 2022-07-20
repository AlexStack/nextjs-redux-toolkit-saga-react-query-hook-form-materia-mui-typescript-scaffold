# What's this folder used for?

**services** directory is less essential than components, but if you're making a plain JavaScript module that the rest of the application is using, it can be handy.

- Contains reusable code for interacting with an API, often in the form of hooks, and ideally utilizing a server-cache tool like React Query or RTK Query.

- Do not mistake this with an Angular-esque service which is meant to handle injecting functionality into components. React handles this scenario using contexts and hooks. This directory should only contain code for interacting with an API.

- Inspired by RTK Query’s recommendation to keep your API definition in a central location. This is the only example of where we purposely break the local-first rule. I like to think of API definitions as their own modular feature. In fact it’s not uncommon to have a features/api directory in lieu of a services directory.
“Our perspective is that it’s much easier to keep track of how requests, cache invalidation, and general app configuration behave when they’re all in one central location in comparison to having X number of custom hooks in different files throughout your application.” — RTK
