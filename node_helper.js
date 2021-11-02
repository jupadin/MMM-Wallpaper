/* Magic Mirror
 * Module: MMM-Wallpaper
 *
 * By jupadin
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const { XMLHttpRequest } = require('xmlhttprequest');
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification == "SET_CONFIG") {
            this.config = payload;
        }

        // Retrieve data from Server
        this.getData();
    },

    getData: function() {
        const self = this;
        console.info(this.name + ": Fetching data from Unsplash-Server...");
        this.fetchImage(self).then(fetchedData => {
            self.sendSocketNotification("DATA", JSON.parse(fetchedData));
        }).catch(error => {
            console.log(error);
        });

        // Set default update interval to 10 minutes
        let updateInterval = 10 * 60 * 1000;

        // If there is no photoID given
        // (So either a random photo is requested, a collectionID is given or a query / search keyword)
        if (!this.config.photoID) {
            // If there is an update interval specified,
            if (this.config.updateInterval > 0) {
                // then use it or
                updateInterval = this.config.updateInterval;
            }
            // use the default update interval to update (change) the (random?) wallpaper from the collection with the given collectionID or a wallpaper returned by the query / search keyword
            // (Otherwise we could have used the photoID option to only show a single wallpaper, instead of the collectionID (which would or then should only have a single wallpaper in it))
            setTimeout(this.getData.bind(this), updateInterval);
        }
    },

    fetchImage: function() {
        let url = null;

        // If a specific photo is requested...
        if (this.config.photoID) {
            url = "https://api.unsplash.com/photos/" + this.config.photoID + "?client_id=" + this.config.unsplashAPIKey;
        } else {
            url = "https://api.unsplash.com/photos/random?" + "client_id=" + this.config.unsplashAPIKey;

            // Handle query parameter
            if (this.config.query) {
                url += "&query=" + this.config.query;
            }

            // Filter photos based on given collectionsID or (!) user name
            if (this.config.collectionIDs !== false && !this.config.userName && !this.config.photoID) {
                url += "&collections=" + this.config.collectionIDs;
            } else if (this.config.userName) {
                url += "&username=" + this.config.userName;
            }

            // Handle orientation
            if (!this.config.collectionIDs && !this.config.photoID && this.config.imageOrientation) {
                url += "&orientation=" + this.config.imageOrientation;
            }
        }

        return new Promise((resolve, reject) => {
            const apiRequest = new XMLHttpRequest();
            apiRequest.open("GET", url);
            apiRequest.onload = () => {
                if (apiRequest.status != 200) {
                    reject(apiRequest.statusText);
                }
                resolve(apiRequest.responseText);
            };
            apiRequest.setRequestHeader("Accept-Version", "v1"); // see https://unsplash.com/documentation#version
            apiRequest.send();
        });
    }
});