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
npm install -w functions
```

### Development

Start the app server locally:

```bash
npm start
```

In a separate terminal, start the functions and Firestore database locally:

```bash
npm run serve -w functions
```

The app, functions, and database will all be on different localhost ports.
Read the terminal for each command to access the different parts.

## Building for Production

Build is ran using the standard `npm run build` command in both folders, but
neither are necessary for deployment.

## Deployment

To deploy, in the root directory run:

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
utilize. It does this by utilizing workspace symlinking 
locally and by manually generating the dist folder and moving 
it when we deploy.