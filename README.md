## 👋 Welcome to the source code of my personal [website](https://olehlutsenko.com)!

If you visit it, you might ask yourself: *is this dude joking?*  
It just shows his name being typed out — even my grandma could do that these days with AI!

Well, you’re absolutely right! It’s very simple and could easily be done in just a few lines of HTML, CSS, and JS.  
But what if we wanted to write it **declaratively** instead of **imperatively**?..

Then things suddenly aren’t so straightforward, and there are lots of questions that need answers.

A good way to write website code declaratively is to use JSX, which I absolutely love — since I normally use React.  
But using an existing framework would’ve been way too easy for a single line in the middle of the page.  
That’s why I wrote my own simple (and naive) `jsx-runtime`.

That was something new for me, since I, like many others, usually just take JSX for granted.  
But the next bit is even more interesting: at the end of the day, JSX is just syntactic sugar over `createElement` calls.  
To implement the typewriter effect, we’d need to grab elements from the DOM using some ye olde `document.querySelector`, which makes the code imperative again… or we could ask ourselves: *how can we pass state declaratively, and what should happen when that state changes?*  
Hence — `reactivity.ts`!

Oh, and `typescript-jsx-transformer` — because if you know, you know.

Hopefully one day I’ll have more inspiration to put some 🍖 on this website’s 🦴s...
