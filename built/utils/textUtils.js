var renderPro;
(function (renderPro) {
    var utils;
    (function (utils) {
        var text;
        (function (text) {
            var wavefront;
            (function (wavefront) {
                function trimComment(token) {
                    Application.Debug.assert(token !== null && token !== undefined, "Param not supplied.");
                    return token.split('#')[0].trim();
                }
                wavefront.trimComment = trimComment;
                function containsComment(token) {
                    Application.Debug.assert(token !== undefined && token !== null, "Param not supplied.");
                    return (token.indexOf('#') !== -1);
                }
                wavefront.containsComment = containsComment;
                function parseRGB(tokens, startIdx) {
                    Application.Debug.assert(tokens !== null && tokens !== undefined, "Param not supplied.");
                    Application.Debug.assert(tokens instanceof Array, "Param not of type 'Array'.");
                    var colour = {};
                    if (tokens.length >= (startIdx + 3)) {
                        var red = tokens[startIdx];
                        var green = tokens[startIdx + 1];
                        var blue = tokens[startIdx + 2];
                        red = Number(red);
                        if (!isNaN(red))
                            red = (red >= 0 && red <= 1) ? red : NaN;
                        green = Number(green);
                        if (!isNaN(green))
                            green = (green >= 0 && green <= 1) ? green : NaN;
                        blue = Number(blue);
                        if (!isNaN(blue))
                            blue = (blue >= 0 && blue <= 1) ? blue : NaN;
                        if (isNaN(red) || isNaN(green) || isNaN(blue))
                            colour = null;
                        else {
                            colour = { red: red, green: green, blue: blue };
                        }
                    }
                    return colour;
                }
                wavefront.parseRGB = parseRGB;
                function parseSingleFloat(tokens, startIdx) {
                    Application.Debug.assert(tokens !== null && tokens !== undefined, "Param not supplied.");
                    Application.Debug.assert(tokens instanceof Array, "Param not of type 'Array'.");
                    var float = NaN;
                    if (tokens.length >= (startIdx + 1)) {
                        var candidate = tokens[startIdx];
                        float = Number(candidate);
                        /* Is there a next word? If so, does it contain anything but a comment? */
                        if (tokens.length > (startIdx + 1))
                            float = (tokens[startIdx + 1].charAt(0) === '#') ? float : NaN;
                    }
                    return float;
                }
                wavefront.parseSingleFloat = parseSingleFloat;
                function parseSingleInt(tokens, startIdx) {
                    Application.Debug.assert(tokens !== null && tokens !== undefined, "Param not supplied.");
                    Application.Debug.assert(tokens instanceof Array, "Param not of type 'Array'.");
                    var int = NaN;
                    if (tokens.length >= (startIdx + 1)) {
                        var candidate = tokens[startIdx];
                        int = Number(candidate);
                        /* Is there a next word? If so, does it contain anything but a comment? */
                        if (tokens.length > (startIdx + 1))
                            int = (tokens[startIdx + 1].charAt(0) === '#') ? Math.round(int) : NaN;
                    }
                    return int;
                }
                wavefront.parseSingleInt = parseSingleInt;
            })(wavefront = text.wavefront || (text.wavefront = {}));
        })(text = utils.text || (utils.text = {}));
    })(utils = renderPro.utils || (renderPro.utils = {}));
})(renderPro || (renderPro = {}));
