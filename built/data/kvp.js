var KeyValuePair = (function () {
    function KeyValuePair(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValuePair;
}());
var Dictionary = (function () {
    function Dictionary() {
        this.content = new Array();
    }
    Dictionary.prototype.hasKey = function (key) {
        var isKeyFound = false;
        for (var currKeyIdx = 0; currKeyIdx < this.content.length; currKeyIdx++) {
            if (this.content[currKeyIdx].key == key) {
                isKeyFound = true;
                break;
            }
        }
        return isKeyFound;
    };
    Dictionary.prototype.hasValue = function (value) {
        var isValueFound = false;
        for (var currKeyIdx = 0; currKeyIdx < this.content.length; currKeyIdx++) {
            if (this.content[currKeyIdx].value === value) {
                isValueFound = true;
                break;
            }
        }
        return isValueFound;
    };
    Dictionary.prototype.getByKey = function (key) {
        var value = null;
        for (var currKeyIdx = 0; currKeyIdx < this.content.length; currKeyIdx++) {
            if (this.content[currKeyIdx].key == key) {
                value = this.content[currKeyIdx].value;
                break;
            }
        }
        return value;
    };
    Dictionary.prototype.push = function (kvp) {
        this.content.push(kvp);
    };
    Dictionary.prototype.add = function (key, value) {
        this.content.push(new KeyValuePair(key, value));
    };
    Dictionary.prototype.set = function (kvp) {
        var isSet = false;
        for (var currIdx = 0; currIdx < this.content.length; currIdx++) {
            var item = this.content[currIdx];
            if (item.key == kvp.key) {
                item.value = kvp.value;
                isSet = true;
                break;
            }
        }
        if (!isSet)
            this.push(kvp);
    };
    Dictionary.prototype.length = function () {
        return this.content.length;
    };
    Dictionary.prototype.iterate = function (callback) {
        for (var currIdx = 0; currIdx < this.content.length; currIdx++)
            callback(this.content[currIdx]);
    };
    return Dictionary;
}());
