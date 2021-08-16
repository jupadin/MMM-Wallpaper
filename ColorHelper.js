const ColorHelper = {
    isImageLight: function(img) {
        // This function is developed by ToniTornado and can be found here:
        // https://stackoverflow.com/questions/13762864/image-dark-light-detection-client-sided-script
        // and here: https://stackoverflow.com/a/13766539
        // with his code at jsFiddle at: http://jsfiddle.net/s7Wx2/328/
        var fuzzy = 0.2;

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var r, g, b, max_rgb = 0;
        var light = 0;
        var dark = 0;

        for (let i = 0; i < data.length; i+=4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];

            max_rgb = Math.max(Math.max(r, g), b);
            if (max_rgb < 128) {
                dark++;
            } else {
                light++;
            }
        }
        var dl_diff = ((light - dark) / (img.width * img.height));
        if (dl_diff + fuzzy < 0) {
            return false; // dark
        } else {
            return true; // light
        }
    },

    hsv2rgb: function(h, s, v) {
        // Taken from the colorsys library at:
        // https://github.com/netbeast/colorsys
        const RGB_MAX = 255;
        const HUE_MAX = 360;
        const SV_MAX = 100;

        if (typeof h === 'object') {
            const args = h;
            h = args.h;
            s = args.s;
            v = args.v;
        }

        h = (h % 360 + 360) % 360;
        h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / parseFloat(HUE_MAX) * 6);
        s = (s === SV_MAX) ? 1 : (s % SV_MAX / parseFloat(SV_MAX));
        v = (v === SV_MAX) ? 1 : (v % SV_MAX / parseFloat(SV_MAX));

        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var mod = i % 6;
        var r = [v, q, p, p, t, v][mod];
        var g = [t, v, v, q, p, p][mod];
        var b = [p, p, t, v, v, q][mod];

        return {
            r: Math.floor(r * RGB_MAX),
            g: Math.floor(g * RGB_MAX),
            b: Math.floor(b * RGB_MAX),
        };
    },

    rgb2hsv: function(r, g, b) {
        const RGB_MAX = 255;
        const HUE_MAX = 360;
        const SV_MAX = 100;

        if (typeof r === 'object') {
            const args = r;
            r = args.r;
            g = args.g;
            b = args.b;
        }

        // It converts [0, 255] to [0, 1]
        r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / parseFloat(RGB_MAX));
        g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / parseFloat(RGB_MAX));
        b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / parseFloat(RGB_MAX));

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = (max === 0) ? 0 : (d / max);

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * HUE_MAX),
            s: Math.round(s * SV_MAX),
            v: Math.round(v * SV_MAX)
        }
    },

    hex2rgb: function(hex) {
        // Manage shorthand hexidecimal form
        var result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(`${result[1]}${result[1]}`, 16),
                g: parseInt(`${result[2]}${result[2]}`, 16),
                b: parseInt(`${result[3]}${result[3]}`, 16)
            };
        }
        // Manage hexadecimal form
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
        return null;
    }
}