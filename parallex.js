function arrayObserve(array, callback, thisArg){
    if (Array.isArray(array)){
         var result = [];
         result.push.apply(result, array);
     } else {
         var result = Object.assign({}, array);
     }

    function getterAndSetter() {
        if (Array.isArray(array))
            var currentArray = result;
        else
            var currentArray = Object.keys(result);
        currentArray.forEach( function(prop){
            if (Array.isArray(result))
                var currentProp = result.lastIndexOf(prop);
            else
                var currentProp = prop;

            /*if (typeof result[currentProp].tagName !== "undefined" && result[currentProp].tagName == "INPUT") {
                result[currentProp] = ' ';
                array[currentProp].addEventListener('keyup', function(){
                    callback.call(thisArg, result);
                    result[currentProp] = this.value;
                });
            } else {*/
            Object.defineProperty(array, currentProp, {
                configurable: true,
                enumerable: true,
                set: function(val) {
                    result[currentProp] = val;
                    callback.call(thisArg, result, currentProp);
                },
                get: function() {
                    return result[currentProp];
                }
            });
            //}
            if (typeof result[currentProp] == 'object') {
                arrayObserve(result[currentProp], callback, result);
            }
        });
    }
    getterAndSetter();
    if (Array.isArray(array)){
        ['pop','push','reverse','shift','unshift','splice','sort','map','filter'].forEach( function(method){
            Object.defineProperty(array, method, {
                configurable: false,
                enumerable: false,
                writable: true,
                value: function () {
                    var noReturnMethods = ['push', 'pop', 'reverse', 'shift', 'unshift'];
                    if (noReturnMethods.indexOf(method) > -1) {
                        Array.prototype[method].apply(result, arguments);
                    } else {
                        var results = Array.prototype[method].apply(result, arguments);
                        result = results;
                    }
                    callback.call(thisArg, result, null);
                    getterAndSetter();
                    return result;
                }
            });
        });
    }
    return result;
}

// Define the Parallex object
var Parallex = function(options) {
    var main = {
        // Define the main container from the options, defaults to the document body
        container: document.querySelector(options.elm) || document.body,
        // Define lastElement as the main container
        lastElement: this.container,

        lists: [],

        data: options.data || {},
        // List method:
        list: function(name, options) {
            if (typeof options !== 'object' && typeof name === 'object')
                options = name;

            if (typeof options.elm !== 'string')
                // If the element set in the options is not a string, set element to lastElement
                var element = this.lastElement;
            else
                // Otherwise set element to the selector set in options
                var element = document.querySelector(options.elm);

            if (typeof name !== 'string' && typeof options.name !== 'string')
                return this;
            else if (typeof name !== 'string')
                name = options.name;

            this.lastElement = element;

            var parentNode = element.parentNode;

            if (!Array.isArray(options.content))
                return this;

            var content = options.content,
                contentDup = options.content;

            var currentContent = '';

            while (parentNode.firstChild)
                parentNode.removeChild(parentNode.firstChild);

            // Loop through the content
            var index = 0;
            while (index < contentDup.length){

                currentContent = contentDup[index];

                if (typeof currentContent === 'string') {
                    var clone = element.cloneNode();

                    clone.innerHTML = currentContent;

                    parentNode.appendChild(clone);
                }

                index++;

            }

            /*this.lists[name] = new Proxy(content, {
                apply: function(target, thisArg, argumentsList) {
                    options.content[target].apply(thisArg, argumentsList);
                    this.list(name, options);
                    return thisArg[target].apply(thisArg, argumentList);
                },
                deleteProperty: function(target, property) {
                    delete options.content[property];
                    this.list(name, options);
                    return true;
                },
                set: function(target, property, value, receiver) {
                    target[property] = value;
                    options.content[property] = value;
                    this.list(name, options);
                    return true;
                }
            });*/

            if (!this.lists[name]){
                this.lists[name] = content;
                var that = this;
                arrayObserve(this.lists[name], function(result){
                    options.content = result;
                    that.list(name, options);
                }, null);
            }

            return this;
        },
        parseTemplate: function(){
            var that = this,
                attributesToReplace = [];
            function replaceData(dataVals){
                document.querySelectorAll('p-data').forEach(function(currentElement){
                    currentElement.innerHTML = dataVals[currentElement.getAttribute('data-name')];
                });
            }
            replaceData(that.data);
            var elementIndex = 0;
            document.querySelectorAll('[p-attributes]').forEach(function(currentElement){
                var attributes = currentElement.attributes,
                    index = 0;
                currentElement.setAttribute('p-attributes', 'p-index-' + elementIndex);
                while(index < attributes.length) {
                    var attribute = attributes[index];
                    if (/^\[\[.*\]\]$/.test(attribute.value)) {
                        var match = attribute.value.replace(/[\[]|[\]]/g, '');
                        attributesToReplace[match] = {
                            element: 'p-index-' + elementIndex,
                            attribute: attribute.name
                        };
                        currentElement.setAttribute(attribute.name, that.data[match]);
                    }
                    index++;
                }
                elementIndex++;
            });
            data = main.container.innerHTML;
            data = data.replace(/(?<!\\)(?:(\\\\)*)[\[]{2,}(\w+?)(?<!\\)(?:(\\\\)*)[\]]{2,}/g, function (match) {
                match = match.replace(/[\[]|[\]]/g, '');
                var index = Object.keys(that.data).indexOf(match),
                    inAttributes = Object.keys(attributesToReplace).indexOf(match) > -1;
                if(index > -1 && !inAttributes) {
                    return '<p-data data-name="' + match + '">' + that.data[match] + '</p-data>';
                } else if(!inAttributes) {
                    return '[[' + match + ']]';
                }
            });
            main.container.innerHTML = data;

            arrayObserve(that.data, function(result, property){
                if(property) {
                    var attributeToReplace = attributesToReplace[property];
                    if (attributeToReplace) {
                        var element = document.querySelector('[p-attributes=' + attributeToReplace.element + ']');
                        element.setAttribute(attributeToReplace.attribute, result[property]);
                    }
                }
                replaceData(result);
            }, null);
        },
        event: function(name, handler){
            var elements = document.querySelectorAll('[p-on$=":'+name+'"]'),
                that = this;
            elements.forEach(function(element){
                var attributeSplit = element.getAttribute('p-on').split(':'),
                    eventType = attributeSplit[0],
                    eventName = attributeSplit[1];

                if(eventName = name) {
                    element.addEventListener(eventType, function(event){
                        var call = handler.call(element, event, that);
                        return call;
                    });
                }
            });
        }
    }

    main.parseTemplate();

    return main;
};
