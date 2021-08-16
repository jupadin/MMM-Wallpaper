/* Magic Mirror
 * Module: MMM-Wallpaper
 *
 * By Julian Dinter
 * MIT Licensed.
 */

Module.register("MMM-Wallpaper", {
    // Default module config.
    defaults: {
        header: "MMM-Wallpaper",
        animationSpeed: 0, // Show wallpaper immediately after loading
        updateInterval: 0, // Do not update the wallpaper
        unsplashAPIKey: "",
        collectionIDs: "", // Comma separated list of Unsplash collection ids
        userName: "",
        photoID: "ALWzVxyAXGE", // The photoID can be found in the address bar in the standalone photo page.
        autoDim: true, // Automatically darken bright images
        brightImageOpacity: 0.85, // Between 0 (black background) and 1 (visible opaque background), only used when autoDim is true
        imageOrientation: "landscape", // Desired photo orientation - can be portrait, landscape, or squarish
        imageWidth: "auto", // "auto" set width to screen, or specify a hard-coded with in pixels
        imageHeight: "auto", // "auto" set height to screen, or specify a hard-coded height in pixels
        imageOptions: "fit=fill&fill=blur",//"fit=scale",//"fit=crop", // see https://unsplash.com/documentation#dynamically-resizable-images and https://docs.imgix.com/apis/rendering/size/fit
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.fetchedData = null;
        this.photoData = null;
        this.img = null;
        this.credentials = null;

        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    // Define required styles.
    getStyles: function() {
        return ["font-awesome.css"];
    },

    // Define required scripts.
    getScripts: function() {
        return ["ColorHelper.js"];
    },

    // Define header.
    getHeader: function() {
        // Do not show header / Hide header
        return "";
    },

    // Override dom generator.
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.id = "wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "light small dimmed";
            return wrapper;
        }

        const width = (this.config.imageWidth == "auto") ? window.innerWidth : this.config.imageWidth;
        const height = (this.config.imageHeight == "auto") ? window.innerHeight : this.config.imageHeight;

        // Set wrapper to full width and height.
        wrapper.style.widht = width;
        wrapper.style.height = height;
        
        // Create credentials div.
        if (this.credentials === null) {
            this.credentials = document.createElement("div");
            this.credentials.id = "credentials";

            this.credentials.style.position = "absolute";
            this.credentials.style.bottom = "0px";

            const scalingFactor = width / height;
            console.log(scalingFactor);

            this.credentials.style.right = (window.innerWidth / 6) + "px";


            const icon = document.createElement("i");
            icon.id = "credentialsIcon";
            icon.className = "fas fa-camera";

            const name = document.createElement("div");
            name.id = "credentialsName";
            name.innerHTML = this.photoData.authorName;

            this.credentials.appendChild(icon);
            this.credentials.appendChild(name);
            
            // this.credentials.innerHTML = "Photo by " + this.photoData.authorName + " on Unsplash.";
        }

        // Add photo and credentials to wrapper
        wrapper.appendChild(this.img);
        wrapper.appendChild(this.credentials);

        // Return the wrapper to the dom.
        return wrapper;
    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        if (notification == "DATA") {
            var animationSpped = this.config.animationSpeed;
            if (this.loaded) {
                animationSpped = 0;
            }
            this.fetchedData = payload;
            this.loaded = true;

            // Process fetched data (image)
            var photoDetails = {};
            let width = this.config.imageWidth == "auto" ? window.innerWidth : this.config.imageWidth;
            let height = this.config.imageHeight == "auto" ? window.innerHeight : this.config.imageHeight;

            // Create URL with specific options to exactly fit to our specific mirror (width, height, imageOptions, ...)
            // See: https://unsplash.com/documentation#supported-parameters
            photoDetails.url = this.fetchedData.urls.raw +
                "&w=" + width +
                "&h=" + height +
                "&" + this.config.imageOptions;
            
            // Unsplash sends us a color swatch for the image
            photoDetails.color = ColorHelper.rgb2hsv(ColorHelper.hex2rgb(this.fetchedData.color));
            // Using the hue from this color, we can then generate a new light shade
            photoDetails.light = ColorHelper.hsv2rgb({h: photoDetails.color.h, s: 20, v:30});
            photoDetails.dark = ColorHelper.hsv2rgb({h: photoDetails.color.h, s: 40, v:7});

            // Set author of photo
            photoDetails.authorName = this.fetchedData.user.name;

            // Save photo details
            this.photoData = photoDetails;

            // Create img div / object
            if (this.img === null) {
                this.img = document.createElement("img");
                this.img.id = "img";
            }

            this.img.style.opacity = 1.0;
            this.img.crossOrigin = "Anonymous";

            // Set src of background image to previously created personal URL
            this.img.src = this.photoData.url;
            this.img.style.position = "relative";

            // Onload of photo, set size and shade / opacity.
            this.img.onload = () => {
                this.img.setAttribute("width", width);
                this.img.setAttribute("height", height);

                if (this.config.autoDim) {
                    this.photoData.isLight = ColorHelper.isImageLight(this.img);
                    if (this.photoData.isLight) {
                        this.img.style.opacity = this.config.brightImageOpacity;
                    }
                }
                // Update dom.
                this.updateDom();
            };
        } else if (notification == "ERROR") {
            // TODO: Update front-end to display specific error.
        }
    }
});