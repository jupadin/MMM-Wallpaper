# MMM-Wallpaper

<p style="text-align: center">
    <a href="https://choosealicense.com/licenses/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

This module is an extention for the [MagicMirror](https://github.com/MichMich/MagicMirror).

The module is based on the work of [delightedCrow](https://github.com/delightedCrow/WallberryTheme) to display a background image from [Unsplash](https://unsplash.com).

This module uses the predefined MagicMirror functions without any further stuff (except a own class to determine the brightness of the photo) and serves as self-explainatory module to dynamically add and change a background image.

### To-Do's
- Automatically resize image, when window is resized.

## Installation

Open a terminal session, navigate to your MagicMirror's `modules` folder and execute `git clone https://github.com/jupadin/MMM-Wallpaper.git`, such that a new folder called MMM-Wallpaper will be created.
Navigate inside the folder and execute `npm install` to install all dependencies.
Activate the module by adding it to the `config.js` file of the MagicMirror as shown below.

````javascript
cd modules
git clone https://github.com/jupadin/MMM-Wallpaper.git
cd MMM-Wallpaper
npm install
````

## Using the module
````javascript
    modules: [
        {
            module: 'MMM-Wallpaper',
            position: 'fullscreen_below',
            config: {
                updateInterval: 0,
                unsplashAPIKey: "", // REQUIRED
                query: false,
                collectionIDs: false,
                userName: false,
                photoID: false, 
                autoDim: true, 
                brightImageOpacity: 0.85, 
                imageOrientation: "landscape",
                imageWidth: "auto",
                imageHeight: "auto",
                imageOptions: "fit=fill&fill=blur",
            }
        }
    ]
````

## Configuration options

The table below lists all possible configuration options.
The following configuration options can be set and/or changed:

### Module

| Option | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| `updateInterval` | `int` | `0` | Interval, when a new background image is fetched (`0` implies a single fetch) |
| `unsplashAPIKey` | `string` | `false` | APIKey to access the Unsplash databse **REQUIRED** |
| `query` | `string` | `false` | Search term for specific photos, from which a random photo should then be chosen as background |
| `collectionIDs`| `array` | `false` | List of Unsplash collection IDs (example: `[123, 456]`) |
| `userName`| `string` | `false` | User name of Unsplash user to further restrict the randomized photo selection. |
| `photoID` | `string` | `false` | The photoID can be found in the address bar in the standalone photo page. **Note: This option (if set) disables the background image randomized background change by given collectionIDs and / or userName and / or query)**|
| `autoDim` | `bool` | `true` | Automatically darken bright images |
| `brightImageOpacity` | `double` | `0.85` | Between 0 (black background) and 1 (visible opaque background), **Note: Only used when `autoDim` is `true`** |
| `imageOrientation` | `string` | `"landscape"` | Desired photo orientation - can be portrait, landscape, or squarish |
| `imageWidth` | `string` | `"auto"` | Set width to (current) screen / window width, or specify a hard-coded with in pixels |
| `imageHeight` | `string` | `"auto"` | Set height to (current) screen / window height, or specify a hard-coded height in pixels |
| `imageOptions` | `string` | `"fit=fill&fill=blur"` | Define special options to fetch photo. Possible other options: `fit=scale` or `fit=crop`. See https://unsplash.com/documentation#dynamically-resizable-images and https://docs.imgix.com/apis/rendering/size/fit for further details. |

## Further references
The idea to calculate the brightness of the photo is taken from the Magic Mirror module of [delightedCrow](https://github.com/delightedCrow/WallberryTheme) and is based on Toni Tornado's answer on [StackOverflow](https://stackoverflow.com/questions/13762864/image-dark-light-detection-client-sided-script), which can be found [here](https://stackoverflow.com/a/13766539).

His working code at jsFiddle can be found at this [jsFiddle](http://jsfiddle.net/s7Wx2/328/).