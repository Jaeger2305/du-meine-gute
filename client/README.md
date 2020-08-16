# NativeScript-Vue Application

> A native application for the niche German boardgame

## Requirements

Download android studio and XCode.

I've been using Android API 30 for a Pixel 3 emulator.

XCode doesn't compile with tns command, but will compile when opening the project inside of xcode directly.

## Environment setup

tns run/debug/build commands allow env vars to be passed in the same way as webpack does:

`tns run android --env.<propertyName>=<value>`

By default, the following environment variables are present when running android in debug mode:

```JavaScript
{
  hmr: true,
  android: true,
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',
  sourceMap: true
}
```

Android emulator has its own network, so the API URL differs with iOS for local development.

`tns run android --env.DMG_API_URL=http://10.0.2.2:4444`
`tns run ios --env.DMG_API_URL=http://localhost:4444`

The env vars for the app should be prefixed with `DMG_` to avoid clashes.

All env vars should be passed in like this.

## Usage

```bash
# Install dependencies
npm install

# Preview on device
tns preview

# Build, watch for changes and run the application
tns run

# Build, watch for changes and debug the application
tns debug <platform>

# Build for production
tns build <platform> --env.production

```
