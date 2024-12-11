# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# TODO

1. Write the specs to run tauri
2. Create a Node server on tauri to run the combined chats and release a URL for the user use as an ovelay on OBS

to add plugins in tauri:

> yarn run tauri add plugins-name

https://icones.js.org/collection/ant-design?s=twitch

# notes

- separate the overlay chat into a new project
- create a API on Vercel, that has its own Chrome, that will fetch youtube messages using puppeteer
- update the call for fetching messages
- remove the code that does that from the project and move to separe project using only node and puppeteer

https://overlaydobx.squareweb.app/chats-overlay?twitchUser=sadixbx&youtubeUser=@TylerTeeP
