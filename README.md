# Cozy TTRPG

A companion app for a stealth-project cozy TTRPG for both the GM and players.

## Getting Started

This app has both a front-end app and back-end cloud functions. They both need to be installed
and ran together.

### Installation

Install the app dependencies:

```bash
npm install
```

Install the function dependencies:

```bash
cd functions
npm install
```

### Development

Start up the shared folder for build watch and symlinking to the app and functions:

```bash
cd shared
npm run link
```

Start the app server locally:

```bash
npm start
```

In a separate terminal, start the functions and Firestore database locally:

```bash
cd functions
npm run serve
```

The app, functions, and database will all be on different localhost ports.
Read the terminal for each command to access the different parts.

## Building for Production

Build is ran using the standard `npm run build` command in both folders, but
neither are necessary for deployment.

## Deployment

To deploy, you must first make sure you have publish the latest `/shared`
code to `@rhyeen/cozy-ttrpg-shared`. Update `/shared/package.json`

```bash
npm run predeploy
npm publish
```

Then in app and functions, run:

```bash
npm i npm i @rhyeen/cozy-ttrpg-shared@latest
```

Next, in the root directory run:

```bash
firebase deploy
```

You will need to be logged into firebase (`firebase init`), and have the correct
project selected, but otherwise, it should perform a build, lint, and test of both
the frontend and backend then deploy.

You can view this project at https://console.firebase.google.com/u/0/project/cozy-ttrpg.

## Nuances

### Shared folder

The shared folder provides code that both the app and functions
utilize. It would seem that we should do this through npm workspaces
but workspaces doesn't play nice with firebase functions for some
reason. Instead, we use a more standard symlinking approach.
This closer mimics what we have to do when publishing `/shared` anyway.

#### Shared folder changes not being picked up by Vite

While Vite is running, go to its `vite.config.ts` and just update something on it. For example, change `preserveSymlinks` to `false`, save, then back to `true`. This flushes the Vite caches and reretrieves the dependencies.
