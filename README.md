# React Hackernews

## About

This is my first React app. It refers to the amazing [The Road to learn React](https://roadtoreact.com/) book by [Robin Wieruch](https://www.robinwieruch.de/).

## Features

This simple application fetches data from real [Hackernews API](https://hn.algolia.com/api) and represents it the in table-like list.

You can do search queries, load more (with "More" button), dismiss particular news and sort them .

Also, there is a caching feature. It means, that, if you search something second time, data will retrieve from local cache and not from API.

## Local setup

Clone the repo:

```bash
git clone https://github.com/Roman-Alenskiy/react-hackernews.git
```

Install node packages:

```bash
npm install
```

Run development server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Create production build:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```
