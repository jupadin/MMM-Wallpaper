/* Magic Mirror
 * Module: MMM-Wallpaper
 *
 * By Julian Dinter
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const { XMLHttpRequest } = require('xmlhttprequest');

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
        console.info(this.name + ": Fetching data from Unsplash-Server");
        this.fetchImage().then(fetchedData => {
            this.sendSocketNotification("DATA", JSON.parse(fetchedData));
        }).catch(error => {
            console.log(error);
        });
        // If you want to continuously update the wallpaper
        if (this.config.updateInterval > 0) {
            // Set timeout to continuously fetch new data from Unsplash-Server
            setTimeout(this.getData.bind(this), this.config.updateInterval);
        }
    },

    fetchImage: function() {
        let url = null;

        // If a specific photo is requested...
        if (this.config.photoID) {
            url = "https://api.unsplash.com/photos/" + this.config.photoID + "?client_id=" + this.config.unsplashAPIKey;
        } else {
            url = "https://api.unsplash.com/photos/random?" + "client_id=" + this.config.unsplashAPIKey;

            if (this.config.collections && !this.config.userName && !this.config.photoID) {
                url += "&collections=" + this.config.collections;
            } else if (this.config.userName) {
                url += "&username=" + this.config.userName;
            }

            if (this.config.imageOrientation && !this.config.photoID) {
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