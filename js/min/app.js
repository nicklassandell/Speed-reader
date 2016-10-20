/*
 *  Angular RangeSlider Directive
 * 
 *  Version: 0.0.7
 *
 *  Author: Daniel Crisp, danielcrisp.com
 *
 *  The rangeSlider has been styled to match the default styling
 *  of form elements styled using Twitter's Bootstrap
 * 
 *  Originally forked from https://github.com/leongersen/noUiSlider
 *

    This code is released under the MIT Licence - http://opensource.org/licenses/MIT

    Copyright (c) 2013 Daniel Crisp

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

*/
!function() {
    "use strict";
    /**
     * RangeSlider, allows user to define a range of values using a slider
     * Touch friendly.
     * @directive
     */
    angular.module("ui-rangeSlider", []).directive("rangeSlider", [ "$document", "$filter", "$log", function($document, $filter, $log) {
        // test for mouse, pointer or touch
        var EVENT = window.PointerEvent ? 1 : window.MSPointerEvent ? 2 : "ontouchend" in document ? 3 : 4, // 1 = IE11, 2 = IE10, 3 = touch, 4 = mouse
        eventNamespace = ".rangeSlider", defaults = {
            disabled: !1,
            orientation: "horizontal",
            step: 0,
            decimalPlaces: 0,
            showValues: !0,
            preventEqualMinMax: !1,
            attachHandleValues: !1
        }, onEvent = (1 === EVENT ? "pointerdown" : 2 === EVENT ? "MSPointerDown" : 3 === EVENT ? "touchstart" : "mousedown") + eventNamespace, moveEvent = (1 === EVENT ? "pointermove" : 2 === EVENT ? "MSPointerMove" : 3 === EVENT ? "touchmove" : "mousemove") + eventNamespace, offEvent = (1 === EVENT ? "pointerup" : 2 === EVENT ? "MSPointerUp" : 3 === EVENT ? "touchend" : "mouseup") + eventNamespace, // get standarised clientX and clientY
        client = function(f) {
            try {
                return [ f.clientX || f.originalEvent.clientX || f.originalEvent.touches[0].clientX, f.clientY || f.originalEvent.clientY || f.originalEvent.touches[0].clientY ];
            } catch (e) {
                return [ "x", "y" ];
            }
        }, restrict = function(value) {
            // normalize so it can't move out of bounds
            return value < 0 ? 0 : value > 100 ? 100 : value;
        }, isNumber = function(n) {
            // console.log(n);
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        // some sort of touch has been detected
        return EVENT < 4 ? angular.element("html").addClass("ngrs-touch") : angular.element("html").addClass("ngrs-no-touch"), 
        {
            restrict: "A",
            replace: !0,
            template: [ '<div class="ngrs-range-slider">', '<div class="ngrs-runner">', '<div class="ngrs-handle ngrs-handle-min"><i></i></div>', '<div class="ngrs-handle ngrs-handle-max"><i></i></div>', '<div class="ngrs-join"></div>', "</div>", '<div class="ngrs-value-runner">', '<div class="ngrs-value ngrs-value-min" ng-show="showValues"><div>{{filteredModelMin}}</div></div>', '<div class="ngrs-value ngrs-value-max" ng-show="showValues"><div>{{filteredModelMax}}</div></div>', "</div>", "</div>" ].join(""),
            scope: {
                disabled: "=?",
                min: "=",
                max: "=",
                modelMin: "=?",
                modelMax: "=?",
                onHandleDown: "&",
                // calls optional function when handle is grabbed
                onHandleUp: "&",
                // calls optional function when handle is released 
                orientation: "@",
                // options: horizontal | vertical | vertical left | vertical right
                step: "@",
                decimalPlaces: "@",
                filter: "@",
                filterOptions: "@",
                showValues: "@",
                pinHandle: "@",
                preventEqualMinMax: "@",
                attachHandleValues: "@"
            },
            link: function(scope, element, attrs, controller) {
                /**
                 * HANDLE CHANGES
                 */
                function setPinHandle(status) {
                    "min" === status ? (angular.element(handles[0]).css("display", "none"), angular.element(handles[1]).css("display", "block")) : "max" === status ? (angular.element(handles[0]).css("display", "block"), 
                    angular.element(handles[1]).css("display", "none")) : (angular.element(handles[0]).css("display", "block"), 
                    angular.element(handles[1]).css("display", "block"));
                }
                function setDisabledStatus(status) {
                    status ? $slider.addClass("disabled") : $slider.removeClass("disabled");
                }
                function setMinMax() {
                    scope.min > scope.max && throwError("min must be less than or equal to max"), // only do stuff when both values are ready
                    angular.isDefined(scope.min) && angular.isDefined(scope.max) && (// make sure they are numbers
                    isNumber(scope.min) || throwError("min must be a number"), isNumber(scope.max) || throwError("max must be a number"), 
                    range = scope.max - scope.min, allowedRange = [ scope.min, scope.max ], // update models too
                    setModelMinMax());
                }
                function setModelMinMax() {
                    // only do stuff when both values are ready
                    if (scope.modelMin > scope.modelMax && (throwWarning("modelMin must be less than or equal to modelMax"), 
                    // reset values to correct
                    scope.modelMin = scope.modelMax), (angular.isDefined(scope.modelMin) || "min" === scope.pinHandle) && (angular.isDefined(scope.modelMax) || "max" === scope.pinHandle)) {
                        // make sure they are numbers
                        isNumber(scope.modelMin) || ("min" !== scope.pinHandle && throwWarning("modelMin must be a number"), 
                        scope.modelMin = scope.min), isNumber(scope.modelMax) || ("max" !== scope.pinHandle && throwWarning("modelMax must be a number"), 
                        scope.modelMax = scope.max);
                        var handle1pos = restrict((scope.modelMin - scope.min) / range * 100), handle2pos = restrict((scope.modelMax - scope.min) / range * 100);
                        if (scope.attachHandleValues) var value1pos = handle1pos, value2pos = handle2pos;
                        // make sure the model values are within the allowed range
                        scope.modelMin = Math.max(scope.min, scope.modelMin), scope.modelMax = Math.min(scope.max, scope.modelMax), 
                        scope.filter ? (scope.filteredModelMin = $filter(scope.filter)(scope.modelMin, scope.filterOptions), 
                        scope.filteredModelMax = $filter(scope.filter)(scope.modelMax, scope.filterOptions)) : (scope.filteredModelMin = scope.modelMin, 
                        scope.filteredModelMax = scope.modelMax), // check for no range
                        scope.min === scope.max && scope.modelMin == scope.modelMax ? (// reposition handles
                        angular.element(handles[0]).css(pos, "0%"), angular.element(handles[1]).css(pos, "100%"), 
                        scope.attachHandleValues && (// reposition values
                        angular.element(".ngrs-value-runner").addClass("ngrs-attached-handles"), angular.element(values[0]).css(pos, "0%"), 
                        angular.element(values[1]).css(pos, "100%")), // reposition join
                        angular.element(join).css(pos, "0%").css(posOpp, "0%")) : (// reposition handles
                        angular.element(handles[0]).css(pos, handle1pos + "%"), angular.element(handles[1]).css(pos, handle2pos + "%"), 
                        scope.attachHandleValues && (// reposition values
                        angular.element(".ngrs-value-runner").addClass("ngrs-attached-handles"), angular.element(values[0]).css(pos, value1pos + "%"), 
                        angular.element(values[1]).css(pos, value2pos + "%"), angular.element(values[1]).css(posOpp, "auto")), 
                        // reposition join
                        angular.element(join).css(pos, handle1pos + "%").css(posOpp, 100 - handle2pos + "%"), 
                        // ensure min handle can't be hidden behind max handle
                        handle1pos > 95 && angular.element(handles[0]).css("z-index", 3));
                    }
                }
                function handleMove(index) {
                    var $handle = handles[index];
                    // on mousedown / touchstart
                    $handle.bind(onEvent + "X", function(event) {
                        var handleDownClass = (0 === index ? "ngrs-handle-min" : "ngrs-handle-max") + "-down", unbind = $handle.add($document).add("body"), modelValue = (0 === index ? scope.modelMin : scope.modelMax) - scope.min, originalPosition = modelValue / range * 100, originalClick = client(event), previousClick = originalClick, previousProposal = !1;
                        angular.isFunction(scope.onHandleDown) && scope.onHandleDown(), // stop user accidentally selecting stuff
                        angular.element("body").bind("selectstart" + eventNamespace, function() {
                            return !1;
                        }), // only do stuff if we are disabled
                        scope.disabled || (// add down class
                        $handle.addClass("ngrs-down"), $slider.addClass("ngrs-focus " + handleDownClass), 
                        // add touch class for MS styling
                        angular.element("body").addClass("ngrs-touching"), // listen for mousemove / touchmove document events
                        $document.bind(moveEvent, function(e) {
                            // prevent default
                            e.preventDefault();
                            var movement, proposal, currentClick = client(e), per = scope.step / range * 100, otherModelPosition = ((0 === index ? scope.modelMax : scope.modelMin) - scope.min) / range * 100;
                            "x" !== currentClick[0] && (// calculate deltas
                            currentClick[0] -= originalClick[0], currentClick[1] -= originalClick[1], // has movement occurred on either axis?
                            movement = [ previousClick[0] !== currentClick[0], previousClick[1] !== currentClick[1] ], 
                            // propose a movement
                            proposal = originalPosition + 100 * currentClick[orientation] / (orientation ? $slider.height() : $slider.width()), 
                            // normalize so it can't move out of bounds
                            proposal = restrict(proposal), scope.preventEqualMinMax && (0 === per && (per = 1 / range * 100), 
                            0 === index ? otherModelPosition -= per : 1 === index && (otherModelPosition += per)), 
                            // check which handle is being moved and add / remove margin
                            0 === index ? proposal = proposal > otherModelPosition ? otherModelPosition : proposal : 1 === index && (proposal = proposal < otherModelPosition ? otherModelPosition : proposal), 
                            scope.step > 0 && proposal < 100 && proposal > 0 && (proposal = Math.round(proposal / per) * per), 
                            proposal > 95 && 0 === index ? $handle.css("z-index", 3) : $handle.css("z-index", ""), 
                            movement[orientation] && proposal != previousProposal && (0 === index ? // update model as we slide
                            scope.modelMin = parseFloat(proposal * range / 100 + scope.min).toFixed(scope.decimalPlaces) : 1 === index && (scope.modelMax = parseFloat(proposal * range / 100 + scope.min).toFixed(scope.decimalPlaces)), 
                            // update angular
                            scope.$apply(), previousProposal = proposal), previousClick = currentClick);
                        }).bind(offEvent, function() {
                            angular.isFunction(scope.onHandleUp) && scope.onHandleUp(), unbind.off(eventNamespace), 
                            angular.element("body").removeClass("ngrs-touching"), // remove down class
                            $handle.removeClass("ngrs-down"), // remove active class
                            $slider.removeClass("ngrs-focus " + handleDownClass);
                        }));
                    });
                }
                function throwError(message) {
                    throw scope.disabled = !0, new Error("RangeSlider: " + message);
                }
                function throwWarning(message) {
                    $log.warn(message);
                }
                /** 
                 *  FIND ELEMENTS
                 */
                var $slider = angular.element(element), handles = [ element.find(".ngrs-handle-min"), element.find(".ngrs-handle-max") ], values = [ element.find(".ngrs-value-min"), element.find(".ngrs-value-max") ], join = element.find(".ngrs-join"), pos = "left", posOpp = "right", orientation = 0, allowedRange = [ 0, 0 ], range = 0;
                // filtered
                scope.filteredModelMin = scope.modelMin, scope.filteredModelMax = scope.modelMax, 
                /**
                 *  FALL BACK TO DEFAULTS FOR SOME ATTRIBUTES
                 */
                attrs.$observe("disabled", function(val) {
                    angular.isDefined(val) || (scope.disabled = defaults.disabled), scope.$watch("disabled", setDisabledStatus);
                }), attrs.$observe("orientation", function(val) {
                    angular.isDefined(val) || (scope.orientation = defaults.orientation);
                    for (var useClass, classNames = scope.orientation.split(" "), i = 0, l = classNames.length; i < l; i++) classNames[i] = "ngrs-" + classNames[i];
                    useClass = classNames.join(" "), // add class to element
                    $slider.addClass(useClass), // update pos
                    "vertical" !== scope.orientation && "vertical left" !== scope.orientation && "vertical right" !== scope.orientation || (pos = "top", 
                    posOpp = "bottom", orientation = 1);
                }), attrs.$observe("step", function(val) {
                    angular.isDefined(val) || (scope.step = defaults.step);
                }), attrs.$observe("decimalPlaces", function(val) {
                    angular.isDefined(val) || (scope.decimalPlaces = defaults.decimalPlaces);
                }), attrs.$observe("showValues", function(val) {
                    angular.isDefined(val) ? "false" === val ? scope.showValues = !1 : scope.showValues = !0 : scope.showValues = defaults.showValues;
                }), attrs.$observe("pinHandle", function(val) {
                    angular.isDefined(val) && ("min" === val || "max" === val) ? scope.pinHandle = val : scope.pinHandle = null, 
                    scope.$watch("pinHandle", setPinHandle);
                }), attrs.$observe("preventEqualMinMax", function(val) {
                    angular.isDefined(val) ? "false" === val ? scope.preventEqualMinMax = !1 : scope.preventEqualMinMax = !0 : scope.preventEqualMinMax = defaults.preventEqualMinMax;
                }), attrs.$observe("attachHandleValues", function(val) {
                    angular.isDefined(val) ? "false" === val ? scope.attachHandleValues = !1 : scope.attachHandleValues = !0 : scope.attachHandleValues = defaults.attachHandleValues;
                }), // listen for changes to values
                scope.$watch("min", setMinMax), scope.$watch("max", setMinMax), scope.$watch("modelMin", setModelMinMax), 
                scope.$watch("modelMax", setModelMinMax), /**
                 * DESTROY
                 */
                scope.$on("$destroy", function() {
                    // unbind event from slider
                    $slider.off(eventNamespace), // unbind from body
                    angular.element("body").off(eventNamespace), // unbind from document
                    $document.off(eventNamespace);
                    // unbind from handles
                    for (var i = 0, l = handles.length; i < l; i++) handles[i].off(eventNamespace), 
                    handles[i].off(eventNamespace + "X");
                }), /**
                 * INIT
                 */
                $slider.bind("selectstart" + eventNamespace, function(event) {
                    return !1;
                }).bind("click", function(event) {
                    event.stopPropagation();
                }), // bind events to each handle
                handleMove(0), handleMove(1);
            }
        };
    } ]), // requestAnimationFramePolyFill
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // shim layer with setTimeout fallback
    window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1e3 / 60);
        };
    }();
}(), /* mousetrap v1.4.6 craig.is/killing/mice */
function(J, r, f) {
    function s(a, b, d) {
        a.addEventListener ? a.addEventListener(b, d, !1) : a.attachEvent("on" + b, d);
    }
    function A(a) {
        if ("keypress" == a.type) {
            var b = String.fromCharCode(a.which);
            return a.shiftKey || (b = b.toLowerCase()), b;
        }
        return h[a.which] ? h[a.which] : B[a.which] ? B[a.which] : String.fromCharCode(a.which).toLowerCase();
    }
    function t(a) {
        a = a || {};
        var d, b = !1;
        for (d in n) a[d] ? b = !0 : n[d] = 0;
        b || (u = !1);
    }
    function C(a, b, d, c, e, v) {
        var g, k, f = [], h = d.type;
        if (!l[a]) return [];
        for ("keyup" == h && w(a) && (b = [ a ]), g = 0; g < l[a].length; ++g) if (k = l[a][g], 
        !(!c && k.seq && n[k.seq] != k.level || h != k.action || ("keypress" != h || d.metaKey || d.ctrlKey) && b.sort().join(",") !== k.modifiers.sort().join(","))) {
            var m = c && k.seq == c && k.level == v;
            (!c && k.combo == e || m) && l[a].splice(g, 1), f.push(k);
        }
        return f;
    }
    function K(a) {
        var b = [];
        return a.shiftKey && b.push("shift"), a.altKey && b.push("alt"), a.ctrlKey && b.push("ctrl"), 
        a.metaKey && b.push("meta"), b;
    }
    function x(a, b, d, c) {
        m.stopCallback(b, b.target || b.srcElement, d, c) || !1 !== a(b, d) || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, 
        b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0);
    }
    function y(a) {
        "number" != typeof a.which && (a.which = a.keyCode);
        var b = A(a);
        b && ("keyup" == a.type && z === b ? z = !1 : m.handleKey(b, K(a), a));
    }
    function w(a) {
        return "shift" == a || "ctrl" == a || "alt" == a || "meta" == a;
    }
    function L(a, b, d, c) {
        function e(b) {
            return function() {
                u = b, ++n[a], clearTimeout(D), D = setTimeout(t, 1e3);
            };
        }
        function v(b) {
            x(d, b, a), "keyup" !== c && (z = A(b)), setTimeout(t, 10);
        }
        for (var g = n[a] = 0; g < b.length; ++g) {
            var f = g + 1 === b.length ? v : e(c || E(b[g + 1]).action);
            F(b[g], f, c, a, g);
        }
    }
    function E(a, b) {
        var d, c, e, f = [];
        for (d = "+" === a ? [ "+" ] : a.split("+"), e = 0; e < d.length; ++e) c = d[e], 
        G[c] && (c = G[c]), b && "keypress" != b && H[c] && (c = H[c], f.push("shift")), 
        w(c) && f.push(c);
        if (d = c, e = b, !e) {
            if (!p) {
                p = {};
                for (var g in h) 95 < g && 112 > g || h.hasOwnProperty(g) && (p[h[g]] = g);
            }
            e = p[d] ? "keydown" : "keypress";
        }
        return "keypress" == e && f.length && (e = "keydown"), {
            key: c,
            modifiers: f,
            action: e
        };
    }
    function F(a, b, d, c, e) {
        q[a + ":" + d] = b, a = a.replace(/\s+/g, " ");
        var f = a.split(" ");
        1 < f.length ? L(a, f, b, d) : (d = E(a, d), l[d.key] = l[d.key] || [], C(d.key, d.modifiers, {
            type: d.action
        }, c, a, e), l[d.key][c ? "unshift" : "push"]({
            callback: b,
            modifiers: d.modifiers,
            action: d.action,
            seq: c,
            level: e,
            combo: a
        }));
    }
    var p, D, h = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
    }, B = {
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    }, H = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        $: "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        _: "-",
        "+": "=",
        ":": ";",
        '"': "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\"
    }, G = {
        option: "alt",
        command: "meta",
        return: "enter",
        escape: "esc",
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
    }, l = {}, q = {}, n = {}, z = !1, I = !1, u = !1;
    for (f = 1; 20 > f; ++f) h[111 + f] = "f" + f;
    for (f = 0; 9 >= f; ++f) h[f + 96] = f;
    s(r, "keypress", y), s(r, "keydown", y), s(r, "keyup", y);
    var m = {
        bind: function(a, b, d) {
            a = a instanceof Array ? a : [ a ];
            for (var c = 0; c < a.length; ++c) F(a[c], b, d);
            return this;
        },
        unbind: function(a, b) {
            return m.bind(a, function() {}, b);
        },
        trigger: function(a, b) {
            return q[a + ":" + b] && q[a + ":" + b]({}, a), this;
        },
        reset: function() {
            return l = {}, q = {}, this;
        },
        stopCallback: function(a, b) {
            return !(-1 < (" " + b.className + " ").indexOf(" mousetrap ")) && ("INPUT" == b.tagName || "SELECT" == b.tagName || "TEXTAREA" == b.tagName || b.isContentEditable);
        },
        handleKey: function(a, b, d) {
            var e, c = C(a, b, d);
            b = {};
            var f = 0, g = !1;
            for (e = 0; e < c.length; ++e) c[e].seq && (f = Math.max(f, c[e].level));
            for (e = 0; e < c.length; ++e) c[e].seq ? c[e].level == f && (g = !0, b[c[e].seq] = 1, 
            x(c[e].callback, d, c[e].combo, c[e].seq)) : g || x(c[e].callback, d, c[e].combo);
            c = "keypress" == d.type && I, d.type != u || w(a) || c || t(b), I = g && "keydown" == d.type;
        }
    };
    J.Mousetrap = m, "function" == typeof define && define.amd && define(m);
}(window, document);

var app = angular.module("speedReadingApp", [ "ui-rangeSlider" ]);

app.controller("MainCtrl", [ "$scope", "$timeout", "$interval", "$window", "$http", function($scope, $timeout, $interval, $window, $http) {
    "use strict";
    $scope.settings = {
        wpm: 400,
        wpmMS: function() {
            return 6e4 / $scope.settings.wpm;
        },
        pauseBetweenParagraphs: !0,
        pauseBetweenSentences: !0,
        enableMultiplier: !0,
        nightMode: !1,
        text: "",
        highlightFocusPoint: !0,
        centerFocusPoint: !0,
        toastDefault: "",
        toast: "",
        useSerifFont: !0,
        pauseCountdown: 1,
        countDownInProgress: !1,
        showLoadingOverlay: !1,
        init: !1
    }, $scope.settings.toast = $scope.settings.toastDefault, $scope.game = {
        words: [],
        currentWord: 0,
        paused: !1,
        hasStarted: !1,
        percentComplete: function(round) {
            var perc = $scope.game.currentWord / $scope.game.words.length * 100, ret = round ? perc.toFixed(1) : perc;
            return ret;
        },
        timeToComplete: function() {
            var wordsLeft = $scope.game.words.length - $scope.game.currentWord, min = wordsLeft / $scope.settings.wpm, round = Math.round(min);
            return min < 1 ? "< 1" : round;
        }
    }, $scope.modelsToAutoSave = [ "settings.wpm", "settings.pauseBetweenSentences", "enableMultiplier", "settings.nightMode", "settings.text", "settings.highlightFocusPoint", "settings.centerFocusPoint", "settings.useSerifFont", "game.words", "game.currentWord", "game.hasStarted" ], 
    // Is called at bottom of controller
    $scope.init = function() {
        $scope.autoSave.loadAll(), $scope.autoSave.setup();
        var cookieText = $scope.cookie.get("READ_TEXT");
        if (cookieText.length > 0) {
            // Remove cookie
            $scope.cookie.set("READ_TEXT", "", -1);
            var text = $scope.makeTextReadable($scope.decodeURI(cookieText));
            // Start reading cookie text
            $scope.stopRead(), $scope.settings.text = text, $scope.startRead();
        }
        // Lastly, init app
        $scope.settings.init = !0;
    }, $scope.decodeURI = function(text) {
        var text = decodeURI(text), text = text.replaceAll("%0A", "\r\n");
        return text;
    }, $scope.cookie = {
        set: function(name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3), expires = "; expires=" + date.toGMTString();
            } else expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        get: function(c_name) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    var c_end = document.cookie.indexOf(";", c_start);
                    return c_end == -1 && (c_end = document.cookie.length), unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        }
    }, // Handles auto saving of models
    $scope.autoSave = {
        // Runs on page load. Will restore saved values.
        loadAll: function() {
            if (!localStorage.spread) return !1;
            var stored = JSON.parse(localStorage.spread);
            for (var model in stored) {
                var modelValue = stored[model];
                // For checkboxes
                "on" === modelValue && (modelValue = !0), "off" === modelValue && (modelValue = !1), 
                // Make numbers actual numbers
                modelValue == parseInt(modelValue) && (modelValue = parseInt(modelValue)), // Split model name by dot, loop through each level and update
                // the corresponding value in $scope
                model.split(".").reduce(function(result, key, index, array) {
                    return index === array.length - 1 && (result[key] = modelValue), result[key];
                }, $scope);
            }
        },
        // Save key-value pair
        save: function(model, val) {
            // Read local storage
            var currStored = localStorage.spread ? JSON.parse(localStorage.spread) : {};
            // Set new value
            currStored[model] = val, // Save to local storage
            localStorage.spread = JSON.stringify(currStored);
        },
        // Setup watchers for models to autosave
        setup: function() {
            for (var mindex in $scope.modelsToAutoSave) {
                var modelName = $scope.modelsToAutoSave[mindex];
                $scope.$watch(modelName, function(newValue) {
                    $scope.autoSave.save(this.exp, newValue);
                });
            }
        }
    }, /**
	 * Prepares for reading then fires off wordLoop
	 */
    $scope.startRead = function() {
        // Bail if already started
        if ($scope.game.hasStarted) return !1;
        if ($scope.isValidURL($scope.settings.text)) $scope.settings.showLoadingOverlay = !0, 
        $scope.extractFromUrl($scope.settings.text, function(res) {
            if ("success" === res.status) {
                var text = res.result.betterTrim();
                $scope.settings.text = $scope.makeTextReadable(text), $scope.game.words = $scope.splitToWords(text), 
                $scope.game.hasStarted = !0, $scope.game.paused = !1, $scope.resetToast(), $timeout(function() {
                    $scope.settings.showLoadingOverlay = !1, $scope.startCountdown(3 * $scope.settings.pauseCountdown);
                }, 300);
            } else $scope.settings.showLoadingOverlay = !1, $scope.flashToast("Sorry, i couldn't parse that URL.");
        }); else {
            if ($scope.game.words = $scope.splitToWords($scope.settings.text), $scope.game.words.length < 2) return $scope.flashToast("Please enter something to read."), 
            !1;
            $scope.game.hasStarted = !0, $scope.game.paused = !1, $timeout(function() {
                $scope.startCountdown(3 * $scope.settings.pauseCountdown);
            }, 300);
        }
    }, // Todo: Clean this mess up
    $scope.startCountdown = function(steps) {
        if ($scope.settings.countDownInProgress) return !1;
        $scope.settings.countDownInProgress = !0;
        var prog = angular.element("#countdown-bar"), bar = prog.find(".progress"), currStep = 1, percentSteps = 100 / steps;
        prog.addClass("visible"), $timeout(function() {
            bar.css("width", percentSteps + "%"), $scope.countDownTimeout = $interval(function() {
                var percent = percentSteps * (currStep + 1);
                return bar.css("width", percent + "%"), currStep >= steps ? ($scope.wordLoop(), 
                $interval.cancel($scope.countDownTimeout), prog.removeClass("visible"), bar.attr("style", ""), 
                $scope.settings.countDownInProgress = !1, !1) : void (currStep += 1);
            }, 1e3);
        }, 50);
    }, $scope.stopRead = function() {
        // Bail if not started
        /*
		if(!$scope.game.hasStarted) {
			return false;
		}
		*/
        $scope.game.hasStarted = !1, $scope.game.paused = !1, $scope.game.currentWord = 0;
    }, $scope.restartRead = function() {
        $scope.pauseRead(), $scope.game.currentWord = 0, $scope.continueRead();
    }, $scope.pauseRead = function() {
        // Bail if not started or already paused
        // Bail if not started or already paused
        return !(!$scope.game.hasStarted || $scope.game.paused) && (angular.element("#countdown-bar").removeClass("visible"), 
        void ($scope.game.paused = !0));
    }, /**
	 * Runs when reading is continued from a paused state
	 */
    $scope.continueRead = function(offset) {
        // Bail if we're not paused or not running
        // Bail if we're not paused or not running
        return !(!$scope.game.hasStarted || !$scope.game.paused) && (offset && $scope.goToPosition(offset), 
        $scope.game.paused = !1, $scope.game.hasStarted = !0, void $scope.startCountdown($scope.settings.pauseCountdown));
    }, $scope.goToPosition = function(pos) {
        if ("last_sentence" === pos) var goTo = $scope.findLastSentence(); else if ("previous" === pos) {
            if ($scope.game.currentWord > 0) var goTo = $scope.game.currentWord - 1;
        } else if ("next" === pos && $scope.game.currentWord < $scope.game.words.length) var goTo = $scope.game.currentWord + 1;
        isNaN(goTo) || ($scope.game.currentWord = goTo);
    }, $scope.togglePause = function() {
        return !!$scope.game.hasStarted && void ($scope.game.paused ? $scope.continueRead() : $scope.pauseRead());
    }, $scope.setWPM = function(wpm) {
        // Round to nearest 50
        // Min/max checks
        // Round to nearest 50
        // Min/max checks
        return wpm = 50 * Math.round(wpm / 50), !(wpm < 50 || wpm > 800) && void ($scope.settings.wpm = wpm);
    }, $scope.extractFromUrl = function(url, callback) {
        url = url.betterTrim(), $http.get(window.base_url + "readability.php?url=" + encodeURIComponent(url)).success(function(data, status) {
            callback(data);
        }).error(function() {
            callback(!1);
        });
    }, $scope.flashToast = function(text) {
        $scope.settings.toast = text, $timeout($scope.resetToast, 3e3);
    }, $scope.resetToast = function() {
        $scope.settings.toast = $scope.settings.toastDefault;
    }, $scope.findLastSentence = function() {
        for (var currWord = $scope.game.currentWord, currWord = currWord > 0 ? currWord - 1 : currWord, countDown = currWord; countDown >= 2; --countDown) {
            var word = $scope.game.words[countDown].value, prevWord = $scope.game.words[countDown - 1].value, secondPrevWord = $scope.game.words[countDown - 2].value;
            if ($scope.isBeginningOfSentence(word) && ($scope.isEndOfSentence(prevWord) || $scope.isEndOfSentence(secondPrevWord))) return countDown;
        }
        return 0;
    }, $scope.isBeginningOfSentence = function(word) {
        // Cancel if empty (it's a pause)
        // Strip whitespace
        // Cancel if empty (it's a pause)
        return word = word.betterTrim().replace(/\s/, ""), "" !== word && word.charAt(0) === word.charAt(0).toUpperCase();
    }, $scope.isEndOfSentence = function(word) {
        var lastChar = word.slice(-1);
        // Check last char
        return "!" === lastChar || "?" === lastChar || "." === lastChar;
    }, /**
	 * Splits chunk of text into array of words, with spaces between
	 * paragraphs if specified.
	 */
    $scope.splitToWords = function(text) {
        // Remove double spaces, tabs, and new lines, this could be improved
        var text = text.betterTrim().replace(/(\s){2,}/g, "$1"), paras = text.split(/[\n]/), words = [];
        if (text.length < 1) return [];
        // Loop through all paragraphs
        for (var i in paras) {
            var para = paras[i], paraWords = para.split(" "), spaceAfterSentence = !1;
            // Loop through all words
            for (var wi in paraWords) {
                var multiplier, w = paraWords[wi], lastChar = w.slice(-1);
                // Short
                multiplier = w.length <= 4 ? .7 : w.length <= 8 ? 1 : w.length <= 12 ? 1.3 : 1.5;
                var highlighted = $scope.highlightFocusPoint(w);
                // Append word to array
                words.push({
                    type: "word",
                    multiplier: multiplier,
                    value: w,
                    raw: highlighted
                }), // Append space after word if it's the last word in a
                // sentence, and the setting is on
                spaceAfterSentence = !1, "." !== lastChar && "?" !== lastChar && "!" !== lastChar || (words.push({
                    type: "pause",
                    multiplier: 1.5,
                    value: "",
                    raw: {
                        specialChar: "(new line)"
                    }
                }), spaceAfterSentence = !0);
            }
            // Add space between each paragraph
            spaceAfterSentence || words.push({
                type: "pause",
                multiplier: 1.5,
                value: "",
                raw: {
                    specialChar: "(new paragraph)"
                }
            });
        }
        // Hack, remove last whitespace
        return $scope.settings.pauseBetweenParagraphs && words.pop(), words;
    }, $scope.highlightFocusPoint = function(word) {
        var breakpoint = .33, length = word.length, breakAt = Math.floor(length * breakpoint), result = {
            start: word.slice(0, breakAt),
            highlighted: word.slice(breakAt, breakAt + 1),
            end: word.slice(breakAt + 1)
        };
        return result;
    }, /**
	 * Loop that changes current word. Interval based on specified WPM.
	 */
    $scope.wordLoop = function() {
        // If reading is paused or not started, don't continue
        if ($scope.game.hasStarted === !1 || $scope.game.paused === !0) return !1;
        var word = $scope.game.words[$scope.game.currentWord];
        // If pause is disabled and the type is a pause, skip this word
        if (!$scope.settings.pauseBetweenSentences && "pause" == word.type) return $scope.game.currentWord += 1, 
        void $scope.wordLoop();
        // Unless this is the last word, set timeout for next word
        if ($scope.game.currentWord < $scope.game.words.length - 1) {
            var ms = $scope.settings.wpmMS(), multiplier = word.multiplier, timeout = ms;
            if ($scope.settings.enableMultiplier) var timeout = ms * multiplier;
            $timeout.cancel($scope.wordLoopTimeout), $scope.wordLoopTimeout = $timeout(function() {
                // Todo: Clean dis' up
                $scope.game.hasStarted === !0 && $scope.game.paused === !1 && ($scope.game.currentWord += 1, 
                $scope.wordLoop());
            }, timeout);
        } else $timeout(function() {
            $scope.stopRead();
        }, 500);
    }, $scope.makeTextReadable = function(text) {
        return text.betterTrim().replace(/(\r\n|\n|\r)+/gm, "\r\n\r\n");
    }, $scope.isValidURL = function(text) {
        return text.betterTrim().match(/^https?:\/\/[^\s]*$/);
    }, $interval.cancel($scope.countDownTimeout), // Pause
    Mousetrap.bind("ctrl+enter", function() {
        $scope.startRead(), $scope.$apply();
    }), // Pause
    Mousetrap.bind("space", function() {
        $scope.togglePause(), $scope.$apply();
    }), // Previous word
    Mousetrap.bind([ "left", "a" ], function() {
        $scope.pauseRead(), $scope.goToPosition("previous"), $scope.$apply();
    }), // Next word
    Mousetrap.bind([ "right", "d" ], function() {
        $scope.pauseRead(), $scope.goToPosition("next"), $scope.$apply();
    }), // Previous sentence
    Mousetrap.bind([ "ctrl+left" ], function() {
        $scope.pauseRead(), $scope.goToPosition("last_sentence"), $scope.$apply();
    }), // We merged these two settings, but let's keep them under the hood for now
    // This makes sure the values stay the same
    $scope.$watch("settings.pauseBetweenSentences", function() {
        $scope.settings.pauseBetweenParagraphs = $scope.settings.pauseBetweenSentences;
    }), // Tried to put this in ng-mousedown, but no luck
    angular.element("#timeline").on("mousedown", function() {
        $scope.pauseRead();
    }), // Lastly, run app
    $scope.init();
} ]), app.filter("unsafe", [ "$sce", function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
} ]), app.directive("toggleDropdown", [ "$timeout", function($timeout) {
    return {
        link: function(scope, elem, attr) {
            var closeDropdown = function(e) {
                // If click was NOT inside dropdown
                !angular.element(e.target).closest(".dropdown").length > 0 && (angular.element(".dropdown").removeClass("open"), 
                angular.element(document).off("click.closeDropdown"));
            };
            // Watch for dropdown triggers
            angular.element(elem[0]).on("click", function(e) {
                var dropdown = angular.element(document.getElementById(attr.toggleDropdown)), allOpenDropdowns = angular.element(".dropdown.open");
                // If a dropdown is already open, make sure to close it first
                // If a dropdown is already open, make sure to close it first
                // Attempt to open dropdown
                // When you click anywhere outside dropdown, close it
                return allOpenDropdowns.length ? (closeDropdown(e), !1) : void (dropdown.length > 0 && !dropdown.is(".open") && (dropdown.addClass("open"), 
                $timeout(function() {
                    angular.element(document).on("click.closeDropdown", closeDropdown);
                }, 0)));
            });
        }
    };
} ]), // Removes all double whitespace. Also trims beginning and end.
String.prototype.betterTrim = function() {
    return this.replace(/\s+(?=\s)/g, "").trim();
}, String.prototype.replaceAll = function(stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    for (var temp = this, index = temp.indexOf(stringToFind); index != -1; ) temp = temp.replace(stringToFind, stringToReplace), 
    index = temp.indexOf(stringToFind);
    return temp;
};