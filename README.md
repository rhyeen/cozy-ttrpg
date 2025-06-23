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

#### Test Users

We have these test users:
* test2@example.com (password what you think it is)
* test3@example.com (password what you think it is)

Note that any test user is possible as we don't do email validation yet.
Authentication is currently done against backend, even locally, instead of
emulator.


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

* Make sure you run `npm start`, not `npm run serve`.
* If needed, try "dev:flush" to flush the caches.
* Last resort: remove node_modules and do an `npm i`.

Likely, you're using vite.config.prod.ts instead of vite.config.dev.ts,
because the dev one should grab the files right from the /shared folder
rather than using the symlink. Symlink is only necessary for /functions