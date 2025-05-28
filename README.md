## 👋 Welcome to the source code of my personal [website](https://olehlutsenko.com)!

If you visit it, you might ask yourself, is this dude joking? It has just his name that appears like it was typed, but even my grandma can do it these AI days!

Well, you are absolutely correct! It is very simple, and could perfectly be done in just a few lines of HTML, CSS, and JS. But what if we wanted to write it in a declarative rather than imperative way?..

Then things suddenly are not so straightforward, and there are lots of questions which require answers.

A good approach to write website code in a declarative way is to use JSX, which I absolutely love, since normally I use React. But using an existing framework would have been way too easy for this single line in the middle of the page. That's why I have written my own simple and naive `jsx-runtime`.

That was something new for me, since I usually, like I am sure lots of others, just take JSX for granted. But the next bit is even more interesting. Since at the end of the day, JSX is just syntactic sugar over createElement functions. In order to implement the typewriter effect, we would need to get elements from the DOM using some ye old `document.querySelector`, which makes the code imperative yet again or... ask ourselves how can we pass state declaratively... and what should happen when that state changes. Hence `reactivity.ts`!

Oh! And `typescript-jsx-transformer`, since if you know, then you know.

Hopefully, I will have some more inspiration one day to add some 🍖 on this website's 🦴s...