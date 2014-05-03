mate-app
========

An app for managing several beverage crates (initially just Club Mate). See [Wikipedia](http://en.wikipedia.org/wiki/Club-Mate) for more information about Club-Mate.

At my workplace, coffe is not to everybody's taste. One of my colleagues bought a crate of Club Mate and pinned a tally above it to the wall. Every employee and our student employees who want to drink a bottle have to mark it on the list.
Because of the unsteady work times/days of our student employees and their chronic shortage of money, collecting debts was pain in the a**. So I made this app. Now we have a beverage cash box, buy the crates pre paid and manage deposits and purchases with this app with minimal effort.

For clearer understanding I implemented a quick and dirty i18n solution.

### how to use

To create a fully mocked production environment, uncomment line `2 - 10` in `server/startup.js`.
After you first logged in to the app, you should uncomment line `13 - 19` and modify the username to yours to grant the right to modify users including yourself. Then you can go to `/admin/users`, select your user and grant yourself the rest of all rights.

The continuous texts in news and pages can be written in markdown.