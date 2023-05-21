![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/Prozilla/Nexilis-app/react-native)
![GitHub Repo stars](https://img.shields.io/github/stars/Prozilla/Nexilis-app?color=yellow&label=%E2%AD%90%20Stars)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Prozilla/Nexilis-app?label=Commits)
![GitHub repo size](https://img.shields.io/github/repo-size/Prozilla/Nexilis-app?color=red&label=Repo%20size)
![GitHub](https://img.shields.io/github/license/Prozilla/Nexilis?label=License)

<img src="github/Logo.png" width="128" height="128"/>

# Nexilis
An alternative Reddit app built with React Native (Expo) by Prozilla. The Nexilis app aims to provide a smoother and more customizable interface for Reddit.

Note: this app is still in its early stages and is currently only targeting iOS and web (for testing). The app may still work on Android but some features will certainly be broken. Feel free to make a pull request to fix some of these issues.

## Links

- [Website](https://nexilis.netlify.app/)
- [Figma design file](https://www.figma.com/file/mbnC0fH09jpSdqcygosxjX/Mockup?type=design&node-id=0%3A1&t=MU1QF2iwvub5V1KK-1)

## Documentation
Each folder contains a README that explains its contents. Further documentation can be found in comments inside the code.

## Usage
First of all, you will need to change `reddit.clientIds` in `config.js`, the key of each entry represents a possible redirect URI, generated by the `makeRedirectUri()` function in the `expo-auth-session` package, each value represents the ID of your Reddit application (which can be created/configured at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)) that uses this redirect URI. This needs to be done because Reddit requires the `redirect_uri` property in the body of an authorization request to match the redirect URI of the Reddit application.


To start using your modified version of Nexilis, you will need to be running two commands simultaneously: `npm run start|ios|android|web` and `npm run server`. I recommend using two terminals, one for each command. Here's what each command does:

- `npm run start|ios|android|web` - Tells Expo to start the application. When you make any changes to your application, it will automatically be rebuilt. You can optionally specify a platform to run the application on. I recommend using `npm run web` for testing, as this will open the application in your browser.
- `npm run server` - This command starts an Express server with a very simple [API](api) that makes the Reddit authorization work. Therefore, running this command is obsolete if you do not plan on using the authorization functionality.

## History
This is the mobile app version of [Nexilis](https://nexilis.netlify.app/) [(repo)](https://github.com/Prozilla/Nexilis), a website powered by the Reddit API.
