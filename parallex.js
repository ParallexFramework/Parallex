<<<<<<< HEAD
var Parallex = function (options){
    var initialise = function (){
        var final = {
            // Object currently being handled
            handle: '',

            // Object type currently being handled
            handleType: '',

            // The main element containing everything that is happening
            container: '',

            // A few useful regular expressions
            regex: {
                enclosedHTML: /^<(.*)>$/
            },

            waitTime: 0,

            inElement: false,

            /**
                Input Methods
                                **/

            // Quick array to list
            list: function (object){
                var that = this;

                if ( this.inElement ) {
                    this.doForElementList(that.container, function(container){
                        that.doForElementList(that.inElement, function(element) {
                            var parent = document.body.contains(element.parentNode) ?
                                            element.parentNode: container;
                            that.doForElementList(parent, function(parentNode){
                                parentNode.innerHTML = '';
                            });
                            if ( Array.isArray (object) ) {
                                object.forEach (function (value){
                                    if ( typeof value === 'string' ) {
                                        var clone = element.cloneNode();
                                        clone.innerHTML = value;

                                        that.doForElementList(parent, function(parentNode){
                                            parentNode.appendChild(clone);
                                        });
                                    }
                                });
                            } else if ( typeof object === 'object' ) {

                            } else {
                                that.doForElementList(this.inElement, function(element) {
                                    that.doForElementList(parent, function(parentNode){
                                        parentNode.appendChild(element);
                                    });
                                });
                            }
                        });
                    });
                } else {
                    this.handleType = 'list';
                    this.handle = [object];
                }
=======
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
>>>>>>> parent of 15e24d0... Update to new version

            if (!Array.isArray(options.content))
                return this;

            var content = options.content,
                contentDup = options.content;

<<<<<<< HEAD
            // Set the element in which to change data
            in: function (element, run) {
                elements = [];

                var that = this;

                this.doForElementList(this.container, function(container){
                    var elementFromVariable = that.getElementFromVariable(element, container),
                        args = (Array.isArray(elementFromVariable) || that.isElementList(elementFromVariable)) ? elementFromVariable: [elementFromVariable];
                    elements.push.apply(elements, args);
                });

                this.inElement = elements;
=======
            var currentContent = '';

            while (parentNode.firstChild)
                parentNode.removeChild(parentNode.firstChild);
>>>>>>> parent of 15e24d0... Update to new version

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

<<<<<<< HEAD
                function noWait(){
                    that[that.handleType].apply(that, that.handle);
                    that.arrayObserve(that.handle, function(changedHandle){
                        that[that.handleType].apply(that, [changedHandle]);
                    }, that);
                }
=======
            }
>>>>>>> parent of 15e24d0... Update to new version

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
<<<<<<< HEAD

                return this;
            },

            // Initialise the object again
            init: function() {
                this.inElement = '';
                this.handle = '';
                this.handleType = '';
                this.container = this.getElementFromVariable(arguments[0], document.body);
                this.waitTime = 0;
            },

            /**
                Back-End Methods
                                  **/

            // Quickly convert any variable type to an element
            getElementFromVariable: function (element, container) {
                container = container || this.container;

                var element,
                    that = this;
                this.doForElementList(container, function(container){
                    if ( typeof element === 'string' && this.regex.enclosedHTML.test(element) ) {
                        // Element is an HTML string, convert it to a node

                        clone = document.createElement('template');
                        clone.innerHTML = element;
                        /*that.doForElementList(clone.content.childNodes, function(node){
                            console.log(node);
                            container.appendChild(node);
                        });*/
                        element = clone.content.childNodes;
                    } else if ( typeof element === 'string' && typeof document.querySelectorAll(element) === 'object' ) {
                        // ELement is a selector
                        element = container.querySelectorAll(element);
                    } else if ( that.isElementList(element) ) {
                        // Leave `element` as is
                    } else if (typeof element === 'object' && typeof element.nodeName === 'string' && typeof element.nodeType === 'number') {
                        // Leave `element` as is
                    } else {
                        element = false;
                    }
                });

                return element;
            },
=======
            });*/
>>>>>>> parent of 15e24d0... Update to new version

            if (!this.lists[name]){
                this.lists[name] = content;
                var that = this;
                arrayObserve(this.lists[name], function(result){
                    options.content = result;
                    that.list(name, options);
                }, null);
            }

<<<<<<< HEAD
                if ( typeof elements === 'object' &&
                    (/^\[object\s(HTMLCollection|NodeList)\]$/.test( Object.prototype.toString.call(elements) ) ||
                    Array.isArray(elements) ) ) {
                    elements.forEach(function (element) {
                        callback.apply(that, [element, elements]);
                    });
                } else if ( typeof elements === 'object') {
                    callback.apply(that, [elements, elements]);
                }
            },

            // Is something a list of elements/nodes?
            isElementList: function(element){
                return /^\[object\s(HTMLCollection|NodeList)\]$/.test( Object.prototype.toString.call(element) );
            },

            //Make an array observable
            arrayObserve: function(array, callback, thisArg){

                thisArg = thisArg || null;

                if (Array.isArray(array)){
                     var result = [];
                     result.push.apply(result, array);
                 } else {
                     var result = Object.assign({}, array);
                 }

                 var that = this;

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
                            that.arrayObserve(result[currentProp], callback, result);
                        }
                    });
=======
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
>>>>>>> parent of 15e24d0... Update to new version
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

<<<<<<< HEAD
    return initialise.apply(this, arguments);
}
=======
    main.parseTemplate();

    return main;
};
>>>>>>> parent of 15e24d0... Update to new version
