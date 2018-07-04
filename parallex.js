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

            /**
                Input Methods
                                **/

            // Quick array to list
            list: function (object, run){
                var that = this;



                if ( this.inElement ) {
                    that.doForElementList(that.inElement, function(element) {
                        var parent = document.body.contains(element.parentNode) ?
                                        element.parentNode: that.container;
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
                                    parentNode.appendChild(clone);
                                });
                            });
                        }
                    });
                } else {
                    this.handleType = 'list';
                    this.handle = [object];
                }

                return this;
            },

            /**
                Output Methods
                                **/

            // Set the element in which to change data
            in: function (element, run) {
                element = this.getElementFromVariable(element);

                this.inElement = element;

                if (run)
                    this[this.handleType].apply(this, this.handle);

                return this;
            },

            // After a certain time do everything
            after: function(time, run) {
                this.waitTime = parseInt(time, 10);

                if (run)
                    this[this.handleType].apply(this, this.handle);

                return this;
            },

            // Run everything
            run: function() {
                var that = this;

                function noWait(){
                    that[that.handleType].apply(that, that.handle);
                    that.arrayObserve(that.handle, function(changedHandle){
                        that[that.handleType].apply(that, changedHandle);
                    }, that);
                }

                if (this.waitTime > 0) {
                    setTimeout(noWait, this.waitTime);
                } else {
                    noWait();
                }
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

                    } else if (typeof element === 'object' && typeof element.nodeName === 'string' && typeof element.nodeType === 'number') {
                        // Leave `element` as is
                    } else {
                        element = false;
                    }
                });

                return element;
            },

            // Run a function for a list of elements or one element
            doForElementList: function (elements, callback) {
                var that = this;

                if ( typeof elements === 'object' &&
                    /^\[object\s(HTMLCollection|NodeList)\]$/.test( Object.prototype.toString.call(elements) ) ) {
                    elements.forEach(function (element) {
                        callback.apply(that, [element, elements]);
                    });
                } else if ( typeof elements === 'object') {
                    callback.apply(that, [elements, elements]);
                }
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
        }

        final.container = final.getElementFromVariable(arguments[0], document.body);

        return final;
    }

    return initialise;
}
