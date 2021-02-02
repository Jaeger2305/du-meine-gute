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

`tns run android --env.DMG_API_URL=http://10.0.2.2:4444 --env.DMG_WS_URL=ws://10.0.2.2:4444`
`tns run ios --env.DMG_API_URL=http://localhost:4444 --env.DMG_WS_URL=ws://localhost:4444`

or in debug mode
`tns debug android --env.DMG_API_URL=http://10.0.2.2:4444 --env.DMG_WS_URL=ws://10.0.2.2:4444`

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

## Differences from initial build

I needed to adjust the AndroidManifest a little after the websockets and session storage with these permissions

```xml
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.INTERNET"/>
```

Also, the application settings:

```xml
  <application
      android:usesCleartextTraffic="true"
      android:name="com.tns.NativeScriptApplication"
      android:allowBackup="true"
      android:icon="@drawable/icon"
      android:label="@string/app_name"
      android:theme="@style/AppTheme">
```

I haven't added a custom logo or anything yet, so this isn't final.

## Developing on a real phone

Developing for a real phone had some extra hurdles over the emulator.

### Prerequisites

- The phone has to be developer enabled
- Then USB debugging needs to be turned on.
- Then it has to be connected via USB (for my mac, USB-C to USB-C didn't work, it had to be USB-A into the mac)
- Approval must be given on the phone to connect to the computer.
- Android studio also has its own connection assistant.

### First time setup

I had issues with the signing of the app, and followed [this](https://github.com/flutter/flutter/issues/55117#issuecomment-615921647) tutorial. The password for the key vault is stored in my phone, and the keyvault should be stored in the `./du-meine-gute/client/sensitive` folder. Controlling this via env vars is probably more sensible, but this was a quick solution whilst testing it out.

Otherwise, running via normal tns debug like above worked for me.

Maybe this will be retained between builds on the same machine, but on a fresh clone it won't be.

## Deployment to the app store

`ns build android`
outputs a apk file locally - this can be uploaded to the app store, to the Industrialist app.

But, to upload and create a release, it must be signed.

First generate a key store, and store it in the ./sensitive folder locally - this won't be comitted.

The password for the keystore is probably in my phone. The alias is the name of the file.

`ns build android --aab --release --key-store-password <password> --key-store-path ./sensitive/key.jks --key-store-alias key --key-store-alias-password test`

`/Users/richard/personal/du-meine-gute/client/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
