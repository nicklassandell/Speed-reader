/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? // For CommonJS and CommonJS-like environments where a proper window is present,
    // execute the factory and get jQuery
    // For environments that do not inherently posses a window with a document
    // (such as Node.js), expose a jQuery-making factory as module.exports
    // This accentuates the need for the creation of a real window
    // e.g. var jQuery = require("jquery")(window);
    // See ticket #14549 for more info
    module.exports = global.document ? factory(global, !0) : function(w) {
        if (!w.document) throw new Error("jQuery requires a window with a document");
        return factory(w);
    } : factory(global);
}("undefined" != typeof window ? window : this, function(window, noGlobal) {
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        return "function" !== type && !jQuery.isWindow(obj) && (!(1 !== obj.nodeType || !length) || ("array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj));
    }
    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
            /* jshint -W018 */
            return !!qualifier.call(elem, i, elem) !== not;
        });
        if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
        });
        if ("string" == typeof qualifier) {
            if (risSimple.test(qualifier)) return jQuery.filter(qualifier, elements, not);
            qualifier = jQuery.filter(qualifier, elements);
        }
        return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) >= 0 !== not;
        });
    }
    function sibling(cur, dir) {
        for (;(cur = cur[dir]) && 1 !== cur.nodeType; ) ;
        return cur;
    }
    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions(options) {
        var object = optionsCache[options] = {};
        return jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
            object[flag] = !0;
        }), object;
    }
    /**
 * The ready event handler and self cleanup method
 */
    function completed() {
        document.removeEventListener("DOMContentLoaded", completed, !1), window.removeEventListener("load", completed, !1), 
        jQuery.ready();
    }
    function Data() {
        // Support: Android < 4,
        // Old WebKit does not have Object.preventExtensions/freeze method,
        // return new empty object instead with no [[set]] accessor
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {};
            }
        }), this.expando = jQuery.expando + Math.random();
    }
    function dataAttr(elem, key, data) {
        var name;
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (void 0 === data && 1 === elem.nodeType) if (name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase(), 
        data = elem.getAttribute(name), "string" == typeof data) {
            try {
                data = "true" === data || "false" !== data && ("null" === data ? null : // Only convert to a number if it doesn't change the string
                +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data);
            } catch (e) {}
            // Make sure we set the data so it isn't changed later
            data_user.set(elem, key, data);
        } else data = void 0;
        return data;
    }
    function returnTrue() {
        return !0;
    }
    function returnFalse() {
        return !1;
    }
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) {}
    }
    // Support: 1.x compatibility
    // Manipulating tables requires a tbody
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
    }
    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        for (var i = 0, l = elems.length; i < l; i++) data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"));
    }
    function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
        if (1 === dest.nodeType) {
            // 1. Copy private data: events, handlers, etc.
            if (data_priv.hasData(src) && (pdataOld = data_priv.access(src), pdataCur = data_priv.set(dest, pdataOld), 
            events = pdataOld.events)) {
                delete pdataCur.handle, pdataCur.events = {};
                for (type in events) for (i = 0, l = events[type].length; i < l; i++) jQuery.event.add(dest, type, events[type][i]);
            }
            // 2. Copy user data
            data_user.hasData(src) && (udataOld = data_user.access(src), udataCur = jQuery.extend({}, udataOld), 
            data_user.set(dest, udataCur));
        }
    }
    function getAll(context, tag) {
        var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
        return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([ context ], ret) : ret;
    }
    // Support: IE >= 9
    function fixInput(src, dest) {
        var nodeName = dest.nodeName.toLowerCase();
        // Fails to persist the checked state of a cloned checkbox or radio button.
        "input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : "input" !== nodeName && "textarea" !== nodeName || (dest.defaultValue = src.defaultValue);
    }
    /**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
    // Called only from within defaultDisplay
    function actualDisplay(name, doc) {
        var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body), // getDefaultComputedStyle might be reliably used only on attached element
        display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? // Use of this method is a temporary fix (more like optmization) until something better comes along,
        // since it was removed from specification and supported only in FF
        style.display : jQuery.css(elem[0], "display");
        // We don't have any data stored on the element,
        // so use "detach" method as fast way to get rid of the element
        return elem.detach(), display;
    }
    /**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
    function defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        // If the simple way fails, read from inside an iframe
        // Use the already-created iframe if possible
        // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
        // Support: IE
        // Store the correct default display
        return display || (display = actualDisplay(nodeName, doc), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement), 
        doc = iframe[0].contentDocument, doc.write(), doc.close(), display = actualDisplay(nodeName, doc), 
        iframe.detach()), elemdisplay[nodeName] = display), display;
    }
    function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, style = elem.style;
        // Support: IE9
        // getPropertyValue is only needed for .css('filter') in IE9, see #12537
        // Support: iOS < 6
        // A tribute to the "awesome hack by Dean Edwards"
        // iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
        // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
        // Remember the original values
        // Put in the new values to get a computed value out
        // Revert the changed values
        // Support: IE
        // IE returns zIndex value as an integer.
        return computed = computed || getStyles(elem), computed && (ret = computed.getPropertyValue(name) || computed[name]), 
        computed && ("" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), 
        rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, 
        maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, 
        ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), 
        void 0 !== ret ? ret + "" : ret;
    }
    function addGetHookIf(conditionFn, hookFn) {
        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function() {
                // Hook not needed (or it's not possible to use it due to missing dependency),
                // remove it.
                // Since there are no other hooks for marginRight, remove the whole object.
                return conditionFn() ? void delete this.get : (this.get = hookFn).apply(this, arguments);
            }
        };
    }
    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(style, name) {
        // shortcut for names that are not vendor prefixed
        if (name in style) return name;
        for (// check for vendor prefixed names
        var capName = name[0].toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length; i--; ) if (name = cssPrefixes[i] + capName, 
        name in style) return name;
        return origName;
    }
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        for (var i = extra === (isBorderBox ? "border" : "content") ? // If we already have the right measurement, avoid augmentation
        4 : // Otherwise initialize for horizontal or vertical properties
        "width" === name ? 1 : 0, val = 0; i < 4; i += 2) // both box models exclude margin, so add it if we want it
        "margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), 
        isBorderBox ? (// border-box includes padding, so remove it if we want content
        "content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), 
        // at this point, extra isn't border nor margin, so remove border
        "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (// at this point, extra isn't content, so add padding
        val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), // at this point, extra isn't content nor padding, so add border
        "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = !0, val = "width" === name ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || null == val) {
            // Computed unit is not pixels. Stop here and return.
            if (// Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name, styles), (val < 0 || null == val) && (val = elem.style[name]), 
            rnumnonpx.test(val)) return val;
            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]), 
            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }
        // use the active box-sizing model to add/subtract irrelevant styles
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }
    function showHide(elements, show) {
        for (var display, elem, hidden, values = [], index = 0, length = elements.length; index < length; index++) elem = elements[index], 
        elem.style && (values[index] = data_priv.get(elem, "olddisplay"), display = elem.style.display, 
        show ? (// Reset the inline display of this element to learn if it is
        // being hidden by cascaded rules or not
        values[index] || "none" !== display || (elem.style.display = ""), // Set elements which have been overridden with display: none
        // in a stylesheet to whatever the default browser style is
        // for such an element
        "" === elem.style.display && isHidden(elem) && (values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName)))) : (hidden = isHidden(elem), 
        "none" === display && hidden || data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) elem = elements[index], elem.style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
        return elements;
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    // Animations created synchronously will run synchronously
    function createFxNow() {
        return setTimeout(function() {
            fxNow = void 0;
        }), fxNow = jQuery.now();
    }
    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which, i = 0, attrs = {
            height: type
        };
        for (// if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0; i < 4; i += 2 - includeWidth) which = cssExpand[i], 
        attrs["margin" + which] = attrs["padding" + which] = type;
        return includeWidth && (attrs.opacity = attrs.width = type), attrs;
    }
    function createTween(value, prop, animation) {
        for (var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length; index < length; index++) if (tween = collection[index].call(animation, prop, value)) // we're done with this property
        return tween;
    }
    function defaultPrefilter(elem, props, opts) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = data_priv.get(elem, "fxshow");
        // handle queue: false promises
        opts.queue || (hooks = jQuery._queueHooks(elem, "fx"), null == hooks.unqueued && (hooks.unqueued = 0, 
        oldfire = hooks.empty.fire, hooks.empty.fire = function() {
            hooks.unqueued || oldfire();
        }), hooks.unqueued++, anim.always(function() {
            // doing this makes sure that the complete handler will be called
            // before this completes
            anim.always(function() {
                hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
            });
        })), // height/width overflow pass
        1 === elem.nodeType && ("height" in props || "width" in props) && (// Make sure that nothing sneaks out
        // Record all 3 overflow attributes because IE9-10 do not
        // change the overflow attribute when overflowX and
        // overflowY are set to the same value
        opts.overflow = [ style.overflow, style.overflowX, style.overflowY ], // Set display property to inline-block for height/width
        // animations on inline elements that are having width/height animated
        display = jQuery.css(elem, "display"), // Test default display if display is currently "none"
        checkDisplay = "none" === display ? data_priv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display, 
        "inline" === checkDisplay && "none" === jQuery.css(elem, "float") && (style.display = "inline-block")), 
        opts.overflow && (style.overflow = "hidden", anim.always(function() {
            style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
        }));
        // show/hide pass
        for (prop in props) if (value = props[prop], rfxtypes.exec(value)) {
            if (delete props[prop], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) {
                // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
                if ("show" !== value || !dataShow || void 0 === dataShow[prop]) continue;
                hidden = !0;
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
        } else display = void 0;
        if (jQuery.isEmptyObject(orig)) "inline" === ("none" === display ? defaultDisplay(elem.nodeName) : display) && (style.display = display); else {
            dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = data_priv.access(elem, "fxshow", {}), 
            // store state if its toggle - enables .stop().toggle() to "reverse"
            toggle && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : anim.done(function() {
                jQuery(elem).hide();
            }), anim.done(function() {
                var prop;
                data_priv.remove(elem, "fxshow");
                for (prop in orig) jQuery.style(elem, prop, orig[prop]);
            });
            for (prop in orig) tween = createTween(hidden ? dataShow[prop] : 0, prop, anim), 
            prop in dataShow || (dataShow[prop] = tween.start, hidden && (tween.end = tween.start, 
            tween.start = "width" === prop || "height" === prop ? 1 : 0));
        }
    }
    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        // camelCase, specialEasing and expand cssHook pass
        for (index in props) if (name = jQuery.camelCase(index), easing = specialEasing[name], 
        value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), 
        index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name], 
        hooks && "expand" in hooks) {
            value = hooks.expand(value), delete props[name];
            // not quite $.extend, this wont overwrite keys already present.
            // also - reusing 'index' from above because we have the correct "name"
            for (index in value) index in props || (props[index] = value[index], specialEasing[index] = easing);
        } else specialEasing[name] = easing;
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
            // don't match elem in the :animated selector
            delete tick.elem;
        }), tick = function() {
            if (stopped) return !1;
            for (var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
            temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length; index < length; index++) animation.tweens[index].run(percent);
            return deferred.notifyWith(elem, [ animation, percent, remaining ]), percent < 1 && length ? remaining : (deferred.resolveWith(elem, [ animation ]), 
            !1);
        }, animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(!0, {
                specialEasing: {}
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
                var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                return animation.tweens.push(tween), tween;
            },
            stop: function(gotoEnd) {
                var index = 0, // if we are going to the end, we want to run all the tweens
                // otherwise we skip this part
                length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) return this;
                for (stopped = !0; index < length; index++) animation.tweens[index].run(1);
                // resolve when we played the last frame
                // otherwise, reject
                return gotoEnd ? deferred.resolveWith(elem, [ animation, gotoEnd ]) : deferred.rejectWith(elem, [ animation, gotoEnd ]), 
                this;
            }
        }), props = animation.props;
        for (propFilter(props, animation.opts.specialEasing); index < length; index++) if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) return result;
        // attach callbacks from options
        return jQuery.map(props, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), 
        jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {
        // dataTypeExpression is optional and defaults to "*"
        return function(dataTypeExpression, func) {
            "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
            if (jQuery.isFunction(func)) // For each dataType in the dataTypeExpression
            for (;dataType = dataTypes[i++]; ) // Prepend if requested
            "+" === dataType[0] ? (dataType = dataType.slice(1) || "*", (structure[dataType] = structure[dataType] || []).unshift(func)) : (structure[dataType] = structure[dataType] || []).push(func);
        };
    }
    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        function inspect(dataType) {
            var selected;
            return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                return "string" != typeof dataTypeOrTransport || seekingTransport || inspected[dataTypeOrTransport] ? seekingTransport ? !(selected = dataTypeOrTransport) : void 0 : (options.dataTypes.unshift(dataTypeOrTransport), 
                inspect(dataTypeOrTransport), !1);
            }), selected;
        }
        var inspected = {}, seekingTransport = structure === transports;
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }
    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) void 0 !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        return deep && jQuery.extend(!0, target, deep), target;
    }
    /* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
    function ajaxHandleResponses(s, jqXHR, responses) {
        // Remove auto dataType and get content-type in the process
        for (var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes; "*" === dataTypes[0]; ) dataTypes.shift(), 
        void 0 === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
        // Check if we're dealing with a known content-type
        if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
            dataTypes.unshift(type);
            break;
        }
        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                firstDataType || (firstDataType = type);
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }
        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) return finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), 
        responses[finalDataType];
    }
    /* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, // Work with a copy of dataTypes in case we need to modify it for conversion
        dataTypes = s.dataTypes.slice();
        // Create converters map with lowercased keys
        if (dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
        // Convert to each sequential dataType
        for (current = dataTypes.shift(); current; ) if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), 
        // Apply the dataFilter if provided
        !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), 
        prev = current, current = dataTypes.shift()) // There's only work to do if current dataType is non-auto
        if ("*" === current) current = prev; else if ("*" !== prev && prev !== current) {
            // If none found, seek a pair
            if (// Seek a direct converter
            conv = converters[prev + " " + current] || converters["* " + current], !conv) for (conv2 in converters) if (// If conv2 outputs current
            tmp = conv2.split(" "), tmp[1] === current && (// If prev can be converted to accepted input
            conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                // Condense equivalence converters
                conv === !0 ? conv = converters[conv2] : converters[conv2] !== !0 && (current = tmp[0], 
                dataTypes.unshift(tmp[1]));
                break;
            }
            // Apply converter (if not an equivalence)
            if (conv !== !0) // Unless errors are allowed to bubble, catch and return them
            if (conv && s.throws) response = conv(response); else try {
                response = conv(response);
            } catch (e) {
                return {
                    state: "parsererror",
                    error: conv ? e : "No conversion from " + prev + " to " + current
                };
            }
        }
        return {
            state: "success",
            data: response
        };
    }
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) // Serialize array item.
        jQuery.each(obj, function(i, v) {
            traditional || rbracket.test(prefix) ? // Treat each array item as a scalar.
            add(prefix, v) : // Item is non-scalar (array or object), encode its numeric index.
            buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
        }); else if (traditional || "object" !== jQuery.type(obj)) // Serialize scalar item.
        add(prefix, obj); else // Serialize object item.
        for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
    }
    /**
 * Gets a window from an element
 */
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType && elem.defaultView;
    }
    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    // Support: Firefox 18+
    //
    var arr = [], slice = arr.slice, concat = arr.concat, push = arr.push, indexOf = arr.indexOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, support = {}, // Use the correct document accordingly with window argument (sandbox)
    document = window.document, version = "2.1.1", // Define a local copy of jQuery
    jQuery = function(selector, context) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init(selector, context);
    }, // Support: Android<4.1
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    };
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // Start with an empty selector
        selector: "",
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
            return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
            // Return just the one element from the set
            // Return all the elements in a clean array
            return null != num ? num < 0 ? this[num + this.length] : this[num] : slice.call(this);
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);
            // Return the newly-formed element set
            // Add the old object onto the stack (as a reference)
            return ret.prevObject = this, ret.context = this.context, ret;
        },
        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        slice: function() {
            return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [ this[j] ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    }, jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
        for (// Handle a deep copy situation
        "boolean" == typeof target && (deep = target, // skip the boolean and the target
        target = arguments[i] || {}, i++), // Handle case when target is a string or something (possible in deep copy)
        "object" == typeof target || jQuery.isFunction(target) || (target = {}), // extend jQuery itself if only one argument is passed
        i === length && (target = this, i--); i < length; i++) // Only deal with non-null/undefined values
        if (null != (options = arguments[i])) // Extend the base object
        for (name in options) src = target[name], copy = options[name], // Prevent never-ending loop
        target !== copy && (// Recurse if we're merging plain objects or arrays
        deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, 
        clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, 
        // Never move original objects, clone them
        target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
        // Return the modified object
        return target;
    }, jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: !0,
        error: function(msg) {
            throw new Error(msg);
        },
        noop: function() {},
        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function(obj) {
            return "function" === jQuery.type(obj);
        },
        isArray: Array.isArray,
        isWindow: function(obj) {
            return null != obj && obj === obj.window;
        },
        isNumeric: function(obj) {
            // parseFloat NaNs numeric-cast false positives (null|true|false|"")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
        },
        isPlainObject: function(obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            return "object" === jQuery.type(obj) && !obj.nodeType && !jQuery.isWindow(obj) && !(obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"));
        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) return !1;
            return !0;
        },
        type: function(obj) {
            return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj;
        },
        // Evaluates a script in a global context
        globalEval: function(code) {
            var script, indirect = eval;
            code = jQuery.trim(code), code && (// If the code includes a valid, prologue position
            // strict mode pragma, execute code by injecting a
            // script tag into the document.
            1 === code.indexOf("use strict") ? (script = document.createElement("script"), script.text = code, 
            document.head.appendChild(script).parentNode.removeChild(script)) : // Otherwise, avoid the DOM node creation, insertion
            // and removal by using an indirect global eval
            indirect(code));
        },
        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        // args is for internal usage only
        each: function(obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) for (;i < length && (value = callback.apply(obj[i], args), value !== !1); i++) ; else for (i in obj) if (value = callback.apply(obj[i], args), 
                value === !1) break;
            } else if (isArray) for (;i < length && (value = callback.call(obj[i], i, obj[i]), 
            value !== !1); i++) ; else for (i in obj) if (value = callback.call(obj[i], i, obj[i]), 
            value === !1) break;
            return obj;
        },
        // Support: Android<4.1
        trim: function(text) {
            return null == text ? "" : (text + "").replace(rtrim, "");
        },
        // results is for internal usage only
        makeArray: function(arr, results) {
            var ret = results || [];
            return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [ arr ] : arr) : push.call(ret, arr)), 
            ret;
        },
        inArray: function(elem, arr, i) {
            return null == arr ? -1 : indexOf.call(arr, elem, i);
        },
        merge: function(first, second) {
            for (var len = +second.length, j = 0, i = first.length; j < len; j++) first[i++] = second[j];
            return first.length = i, first;
        },
        grep: function(elems, callback, invert) {
            // Go through the array, only saving the items
            // that pass the validator function
            for (var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert; i < length; i++) callbackInverse = !callback(elems[i], i), 
            callbackInverse !== callbackExpect && matches.push(elems[i]);
            return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            // Go through the array, translating each of the items to their new values
            if (isArray) for (;i < length; i++) value = callback(elems[i], i, arg), null != value && ret.push(value); else for (i in elems) value = callback(elems[i], i, arg), 
            null != value && ret.push(value);
            // Flatten any nested arrays
            return concat.apply([], ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function(fn, context) {
            var tmp, args, proxy;
            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn)) // Simulated bind
            // Set the guid of unique handler to the same of original handler, so it can be removed
            return args = slice.call(arguments, 2), proxy = function() {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy;
        },
        now: Date.now,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    }), // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    var Sizzle = /*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
    function(window) {
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, // QSA vars
            i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), 
            context = context || document, results = results || [], !selector || "string" != typeof selector) return results;
            if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) return [];
            if (documentIsHTML && !seed) {
                // Shortcuts
                if (match = rquickExpr.exec(selector)) // Speed-up: Sizzle("#ID")
                if (m = match[1]) {
                    if (9 === nodeType) {
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document (jQuery #6963)
                        if (elem = context.getElementById(m), !elem || !elem.parentNode) return results;
                        // Handle the case where IE, Opera, and Webkit return items
                        // by name instead of ID
                        if (elem.id === m) return results.push(elem), results;
                    } else // Context is not a document
                    if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), 
                    results;
                } else {
                    if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), 
                    results;
                    if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), 
                    results;
                }
                // QSA path
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    if (nid = old = expando, newContext = context, newSelector = 9 === nodeType && selector, 
                    1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
                        for (groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), 
                        nid = "[id='" + nid + "'] ", i = groups.length; i--; ) groups[i] = nid + toSelector(groups[i]);
                        newContext = rsibling.test(selector) && testContext(context.parentNode) || context, 
                        newSelector = groups.join(",");
                    }
                    if (newSelector) try {
                        return push.apply(results, newContext.querySelectorAll(newSelector)), results;
                    } catch (qsaError) {} finally {
                        old || context.removeAttribute("id");
                    }
                }
            }
            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        /**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
        function createCache() {
            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                // Only keep the most recent entries
                return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key + " "] = value;
            }
            var keys = [];
            return cache;
        }
        /**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
        function markFunction(fn) {
            return fn[expando] = !0, fn;
        }
        /**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
        function assert(fn) {
            var div = document.createElement("div");
            try {
                return !!fn(div);
            } catch (e) {
                return !1;
            } finally {
                // Remove from its parent by default
                div.parentNode && div.parentNode.removeChild(div), // release memory in IE
                div = null;
            }
        }
        /**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
        function addHandle(attrs, handler) {
            for (var arr = attrs.split("|"), i = attrs.length; i--; ) Expr.attrHandle[arr[i]] = handler;
        }
        /**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
            // Use IE sourceIndex if available on both nodes
            if (diff) return diff;
            // Check if b follows a
            if (cur) for (;cur = cur.nextSibling; ) if (cur === b) return -1;
            return a ? 1 : -1;
        }
        /**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
        function createInputPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return "input" === name && elem.type === type;
            };
        }
        /**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
        function createButtonPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return ("input" === name || "button" === name) && elem.type === type;
            };
        }
        /**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    // Match elements found at the specified indexes
                    for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--; ) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        /**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== strundefined && context;
        }
        // Easy API for creating new setFilters
        function setFilters() {}
        function toSelector(tokens) {
            for (var i = 0, len = tokens.length, selector = ""; i < len; i++) selector += tokens[i].value;
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && "parentNode" === dir, doneName = done++;
            // Check against closest ancestor/preceding element
            // Check against all ancestor/preceding elements
            return combinator.first ? function(elem, context, xml) {
                for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
            } : function(elem, context, xml) {
                var oldCache, outerCache, newCache = [ dirruns, doneName ];
                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                if (xml) {
                    for (;elem = elem[dir]; ) if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                } else for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) {
                    if (outerCache = elem[expando] || (elem[expando] = {}), (oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) // Assign to newCache so results back-propagate to previous elements
                    return newCache[2] = oldCache[2];
                    // A match means we're done; a fail means we have to keep checking
                    if (// Reuse newcache so results back-propagate to previous elements
                    outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) return !0;
                }
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
                for (var i = matchers.length; i--; ) if (!matchers[i](elem, context, xml)) return !1;
                return !0;
            } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
            for (var i = 0, len = contexts.length; i < len; i++) Sizzle(selector, contexts[i], results);
            return results;
        }
        function condense(unmatched, map, filter, context, xml) {
            for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; i < len; i++) (elem = unmatched[i]) && (filter && !filter(elem, context, xml) || (newUnmatched.push(elem), 
            mapped && map.push(i)));
            return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), 
            postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), 
            markFunction(function(seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, // Get initial elements from seed or context
                elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] : context, []), // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml), matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                postFinder || (seed ? preFilter : preexisting || postFilter) ? // ...intermediate processing is necessary
                [] : // ...otherwise use results directly
                results : matcherIn;
                // Apply postFilter
                if (// Find primary matches
                matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for (temp = condense(matcherOut, postMap), 
                postFilter(temp, [], context, xml), // Un-match failing elements by moving them back to matcherIn
                i = temp.length; i--; ) (elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            for (// Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [], i = matcherOut.length; i--; ) (elem = matcherOut[i]) && // Restore matcherIn since elem is not yet a final match
                            temp.push(matcherIn[i] = elem);
                            postFinder(null, matcherOut = [], temp, xml);
                        }
                        for (// Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length; i--; ) (elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                    }
                } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), 
                postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
            });
        }
        function matcherFromTokens(tokens) {
            for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator(function(elem) {
                return elem === checkContext;
            }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, !0), matchers = [ function(elem, context, xml) {
                return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            } ]; i < len; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
                // Return special upon seeing a positional matcher
                if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
                    for (// Find the next relative operator (if any) for proper handling
                    j = ++i; j < len && !Expr.relative[tokens[j].type]; j++) ;
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                        value: " " === tokens[i - 2].type ? "*" : ""
                    })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
            }
            return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, // We must always have either seed elements or outermost context
                elems = seed || byElement && Expr.find.TAG("*", outermost), // Use integer dirruns iff this is the outermost matcher
                dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1, len = elems.length;
                // Add elements passing elementMatchers directly to results
                // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for (outermost && (outermostContext = context !== document && context); i !== len && null != (elem = elems[i]); i++) {
                    if (byElement && elem) {
                        for (j = 0; matcher = elementMatchers[j++]; ) if (matcher(elem, context, xml)) {
                            results.push(elem);
                            break;
                        }
                        outermost && (dirruns = dirrunsUnique);
                    }
                    // Track unmatched elements for set filters
                    bySet && (// They will have gone through all possible matchers
                    (elem = !matcher && elem) && matchedCount--, // Lengthen the array for every element, matched or not
                    seed && unmatched.push(elem));
                }
                if (// Apply set filters to unmatched elements
                matchedCount += i, bySet && i !== matchedCount) {
                    for (j = 0; matcher = setMatchers[j++]; ) matcher(unmatched, setMatched, context, xml);
                    if (seed) {
                        // Reintegrate element matches to eliminate the need for sorting
                        if (matchedCount > 0) for (;i--; ) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                        // Discard index placeholder values to get only actual matches
                        setMatched = condense(setMatched);
                    }
                    // Add matches to results
                    push.apply(results, setMatched), // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                }
                // Override manipulation of globals by nested matchers
                return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), 
                unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, // Local document vars
        setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, // Instance-specific data
        expando = "sizzle" + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function(a, b) {
            return a === b && (hasDuplicate = !0), 0;
        }, // General-purpose constants
        strundefined = "undefined", MAX_NEGATIVE = 1 << 31, // Instance methods
        hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, // Use a stripped-down indexOf if we can't use a native one
        indexOf = arr.indexOf || function(elem) {
            for (var i = 0, len = this.length; i < len; i++) if (this[i] === elem) return i;
            return -1;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", // Regular expressions
        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace("w", "w#"), // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + characterEncoding + ")"),
            CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
            TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"), funescape = function(_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 65536;
            // NaN means non-codepoint
            // Support: Firefox<24
            // Workaround erroneous numeric interpretation of +"0x"
            // BMP codepoint
            // Supplemental Plane codepoint (surrogate pair)
            return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
        };
        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), 
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? // Leverage slice if possible
                function(target, els) {
                    push_native.apply(target, slice.call(els));
                } : // Support: IE<9
                // Otherwise append directly
                function(target, els) {
                    // Can't trust NodeList.length
                    for (var j = target.length, i = 0; target[j++] = els[i++]; ) ;
                    target.length = j - 1;
                }
            };
        }
        // Expose support vars for convenience
        support = Sizzle.support = {}, /**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
        isXML = Sizzle.isXML = function(elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return !!documentElement && "HTML" !== documentElement.nodeName;
        }, /**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
        setDocument = Sizzle.setDocument = function(node) {
            var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
            // If no document and documentElement is available, return
            // If no document and documentElement is available, return
            // Set our document
            // Support tests
            // Support: IE>8
            // If iframe document is assigned to "document" variable and if iframe has been reloaded,
            // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
            // IE6-8 do not support the defaultView property so parent will be undefined
            // IE11 does not have attachEvent, so all must suffer
            /* Attributes
	---------------------------------------------------------------------- */
            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
            /* getElement(s)By*
	---------------------------------------------------------------------- */
            // Check if getElementsByTagName("*") returns only elements
            // Check if getElementsByClassName can be trusted
            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            // ID find and filter
            // Support: IE6/7
            // getElementById is not reliable as a find shortcut
            // Tag
            // Class
            /* QSA/matchesSelector
	---------------------------------------------------------------------- */
            // QSA and matchesSelector support
            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            // Build QSA regex
            // Regex strategy adopted from Diego Perini
            /* Contains
	---------------------------------------------------------------------- */
            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            /* Sorting
	---------------------------------------------------------------------- */
            // Document order sorting
            return doc !== document && 9 === doc.nodeType && doc.documentElement ? (document = doc, 
            docElem = doc.documentElement, documentIsHTML = !isXML(doc), parent && parent !== parent.top && (parent.addEventListener ? parent.addEventListener("unload", function() {
                setDocument();
            }, !1) : parent.attachEvent && parent.attachEvent("onunload", function() {
                setDocument();
            })), support.attributes = assert(function(div) {
                return div.className = "i", !div.getAttribute("className");
            }), support.getElementsByTagName = assert(function(div) {
                return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
            }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function(div) {
                // Support: Opera<10
                // Catch gEBCN failure to find non-leading classes
                // Support: Safari<4
                // Catch class over-caching
                return div.innerHTML = "<div class='a'></div><div class='a i'></div>", div.firstChild.className = "i", 
                2 === div.getElementsByClassName("i").length;
            }), support.getById = assert(function(div) {
                return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
            }), support.getById ? (Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== strundefined && documentIsHTML) {
                    var m = context.getElementById(id);
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    return m && m.parentNode ? [ m ] : [];
                }
            }, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag);
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                // Filter out possible comments
                if ("*" === tag) {
                    for (;elem = results[i++]; ) 1 === elem.nodeType && tmp.push(elem);
                    return tmp;
                }
                return results;
            }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) return context.getElementsByClassName(className);
            }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // http://bugs.jquery.com/ticket/12359
                div.innerHTML = "<select msallowclip=''><option selected=''></option></select>", 
                // Support: IE8, Opera 11-12.16
                // Nothing should be selected when empty strings follow ^= or $= or *=
                // The test attribute must be unknown in Opera but "safe" for WinRT
                // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                div.querySelectorAll("[msallowclip^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), 
                // Support: IE8
                // Boolean attributes and "value" are not treated correctly
                div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), 
                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here and will not see later tests
                div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
            }), assert(function(div) {
                // Support: Windows 8 Native Apps
                // The type and name attributes are restricted during .innerHTML assignment
                var input = doc.createElement("input");
                input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("name", "D"), 
                // Support: IE8
                // Enforce case-sensitivity of name attribute
                div.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), 
                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here and will not see later tests
                div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), 
                // Opera 10-11 does not throw on post-comma invalid pseudos
                div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            })), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call(div, "div"), // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), 
            hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
            } : function(a, b) {
                if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                return !1;
            }, sortOrder = hasCompare ? function(a, b) {
                // Flag for duplicate removal
                if (a === b) return hasDuplicate = !0, 0;
                // Sort on method existence if only one input has compareDocumentPosition
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                // Calculate position if both inputs belong to the same document
                // Otherwise we know they are disconnected
                // Disconnected nodes
                // Choose the first element that is related to our preferred document
                return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 
                1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : 4 & compare ? -1 : 1);
            } : function(a, b) {
                // Exit early if the nodes are identical
                if (a === b) return hasDuplicate = !0, 0;
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                // Parentless nodes are either documents or disconnected
                if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                if (aup === bup) return siblingCheck(a, b);
                for (// Otherwise we need full lists of their ancestors for comparison
                cur = a; cur = cur.parentNode; ) ap.unshift(cur);
                for (cur = b; cur = cur.parentNode; ) bp.unshift(cur);
                // Walk down the tree looking for a discrepancy
                for (;ap[i] === bp[i]; ) i++;
                // Do a sibling check if the nodes have a common ancestor
                // Otherwise nodes in our document sort first
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            }, doc) : document;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            if (// Set document vars if needed
            (elem.ownerDocument || elem) !== document && setDocument(elem), // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                var ret = matches.call(elem, expr);
                // IE 9's matchesSelector returns false on disconnected nodes
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && 11 !== elem.document.nodeType) return ret;
            } catch (e) {}
            return Sizzle(expr, document, null, [ elem ]).length > 0;
        }, Sizzle.contains = function(context, elem) {
            // Set document vars if needed
            return (context.ownerDocument || context) !== document && setDocument(context), 
            contains(context, elem);
        }, Sizzle.attr = function(elem, name) {
            // Set document vars if needed
            (elem.ownerDocument || elem) !== document && setDocument(elem);
            var fn = Expr.attrHandle[name.toLowerCase()], // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
            return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }, Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }, /**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
        Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i = 0;
            if (// Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), 
            results.sort(sortOrder), hasDuplicate) {
                for (;elem = results[i++]; ) elem === results[i] && (j = duplicates.push(i));
                for (;j--; ) results.splice(duplicates[j], 1);
            }
            // Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            return sortInput = null, results;
        }, /**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
        getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (jQuery #11153)
                    if ("string" == typeof elem.textContent) return elem.textContent;
                    // Traverse its children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
                } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            } else // If no nodeType, this is expected to be an array
            for (;node = elem[i++]; ) // Do not traverse comment nodes
            ret += getText(node);
            // Do not include comment or processing instruction nodes
            return ret;
        }, Expr = Sizzle.selectors = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(match) {
                    // Move the given value to match[3] whether quoted or unquoted
                    return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), 
                    "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                },
                CHILD: function(match) {
                    /* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
                    // nth-* requires argument
                    // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), 
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), 
                    match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), 
                    match;
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[6] && match[2];
                    // Accept quoted arguments as-is
                    // Get excess from tokenize (recursively)
                    // advance to the next closing parenthesis
                    // excess is a negative index
                    return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), 
                    match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                }
            },
            filter: {
                TAG: function(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return "*" === nodeNameSelector ? function() {
                        return !0;
                    } : function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                        return pattern.test("string" == typeof elem.className && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name);
                        return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"));
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                    // Shortcut for :nth-*(n)
                    return 1 === first && 0 === last ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            // :(first|last|only)-(child|of-type)
                            if (simple) {
                                for (;dir; ) {
                                    for (node = elem; node = node[dir]; ) if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = "only" === type && !start && "nextSibling";
                                }
                                return !0;
                            }
                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (start = [ forward ? parent.firstChild : parent.lastChild ], forward && useCache) {
                                for (// Seek `elem` from a previously-cached index
                                outerCache = parent[expando] || (parent[expando] = {}), cache = outerCache[type] || [], 
                                nodeIndex = cache[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], 
                                node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (// Fallback to seeking `elem` from the start
                                diff = nodeIndex = 0) || start.pop(); ) // When found, cache indexes on `parent` and break
                                if (1 === node.nodeType && ++diff && node === elem) {
                                    outerCache[type] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1]; else // Use the same loop as above to seek `elem` from the start
                            for (;(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (// Cache the index of each encountered element
                            useCache && ((node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ]), 
                            node !== elem)); ) ;
                            // Incorporate the offset, then check against cycle size
                            return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    // But maintain support for old signatures
                    return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [ pseudo, pseudo, "", argument ], 
                    Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        for (var idx, matched = fn(seed, argument), i = matched.length; i--; ) idx = indexOf.call(seed, matched[i]), 
                        seed[idx] = !(matches[idx] = matched[i]);
                    }) : function(elem) {
                        return fn(elem, 0, args);
                    }) : fn;
                }
            },
            pseudos: {
                // Potentially complex pseudos
                not: markFunction(function(selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        // Match elements unmatched by `matcher`
                        for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--; ) (elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                    }) : function(elem, context, xml) {
                        return input[0] = elem, matcher(input, null, xml, results), !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function(text) {
                    return function(elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                lang: markFunction(function(lang) {
                    // lang value must be a valid identifier
                    return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), 
                    lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                        var elemLang;
                        do if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return elemLang = elemLang.toLowerCase(), 
                        elemLang === lang || 0 === elemLang.indexOf(lang + "-"); while ((elem = elem.parentNode) && 1 === elem.nodeType);
                        return !1;
                    };
                }),
                // Miscellaneous
                target: function(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                // Boolean properties
                enabled: function(elem) {
                    return elem.disabled === !1;
                },
                disabled: function(elem) {
                    return elem.disabled === !0;
                },
                checked: function(elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                },
                selected: function(elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0;
                },
                // Contents
                empty: function(elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                    //   but not by others (comment: 8; processing instruction: 7; etc.)
                    // nodeType < 6 works because attributes (2) do not appear as children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeType < 6) return !1;
                    return !0;
                },
                parent: function(elem) {
                    return !Expr.pseudos.empty(elem);
                },
                // Element/input types
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name;
                },
                text: function(elem) {
                    var attr;
                    // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                    return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase());
                },
                // Position-in-collection
                first: createPositionalPseudo(function() {
                    return [ 0 ];
                }),
                last: createPositionalPseudo(function(matchIndexes, length) {
                    return [ length - 1 ];
                }),
                eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [ argument < 0 ? argument + length : argument ];
                }),
                even: createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 0; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 1; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; --i >= 0; ) matchIndexes.push(i);
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; ++i < length; ) matchIndexes.push(i);
                    return matchIndexes;
                })
            }
        }, Expr.pseudos.nth = Expr.pseudos.eq;
        // Add button/input type pseudos
        for (i in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) Expr.pseudos[i] = createInputPseudo(i);
        for (i in {
            submit: !0,
            reset: !0
        }) Expr.pseudos[i] = createButtonPseudo(i);
        /**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
        // One-time assignments
        // Sort stability
        // Support: Chrome<14
        // Always assume duplicates if they aren't passed to the comparison function
        // Initialize against the default document
        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters(), 
        tokenize = Sizzle.tokenize = function(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) return parseOnly ? 0 : cached.slice(0);
            for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar; ) {
                // Comma and first run
                matched && !(match = rcomma.exec(soFar)) || (match && (// Don't consume trailing commas as valid
                soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = [])), matched = !1, 
                // Combinators
                (match = rcombinators.exec(soFar)) && (matched = match.shift(), tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrim, " ")
                }), soFar = soFar.slice(matched.length));
                // Filters
                for (type in Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), 
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                }), soFar = soFar.slice(matched.length));
                if (!matched) break;
            }
            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            // Cache the tokens
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }, compile = Sizzle.compile = function(selector, match) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                for (// Generate a function of recursive functions that can be used to check each element
                match || (match = tokenize(selector)), i = match.length; i--; ) cached = matcherFromTokens(match[i]), 
                cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)), 
                // Save selector and tokenization
                cached.selector = selector;
            }
            return cached;
        }, select = Sizzle.select = function(selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = "function" == typeof selector && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            // Try to minimize operations if there is no seed and only one group
            if (results = results || [], 1 === match.length) {
                if (// Take a shortcut and set the context if the root selector is an ID
                tokens = match[0] = match[0].slice(0), tokens.length > 2 && "ID" === (token = tokens[0]).type && support.getById && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                    if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], 
                    !context) return results;
                    compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length);
                }
                for (// Fetch a seed set for right-to-left matching
                i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], 
                !Expr.relative[type = token.type]); ) if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                    if (// If seed is empty or no tokens remain, we can return early
                    tokens.splice(i, 1), selector = seed.length && toSelector(tokens), !selector) return push.apply(results, seed), 
                    results;
                    break;
                }
            }
            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context), 
            results;
        }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, 
        support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
            // Should return 1, but returns 4 (following)
            return 1 & div1.compareDocumentPosition(document.createElement("div"));
        }), assert(function(div) {
            return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
        }) || addHandle("type|href|height|width", function(elem, name, isXML) {
            if (!isXML) return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
        }), support.attributes && assert(function(div) {
            return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
        }) || addHandle("value", function(elem, name, isXML) {
            if (!isXML && "input" === elem.nodeName.toLowerCase()) return elem.defaultValue;
        }), assert(function(div) {
            return null == div.getAttribute("disabled");
        }) || addHandle(booleans, function(elem, name, isXML) {
            var val;
            if (!isXML) return elem[name] === !0 ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }), Sizzle;
    }(window);
    jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, 
    jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, 
    jQuery.contains = Sizzle.contains;
    var rneedsContext = jQuery.expr.match.needsContext, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, risSimple = /^.[^:#\[\.,]*$/;
    jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [ elem ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
            return 1 === elem.nodeType;
        }));
    }, jQuery.fn.extend({
        find: function(selector) {
            var i, len = this.length, ret = [], self = this;
            if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) if (jQuery.contains(self[i], this)) return !0;
            }));
            for (i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
            // Needed because $( selector, context ) becomes $( context ).find( selector )
            return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, 
            ret;
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], !1));
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector || [], !0));
        },
        is: function(selector) {
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            return !!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length;
        }
    });
    // Initialize a jQuery object
    // A central reference to the root jQuery(document)
    var rootjQuery, // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, init = jQuery.fn.init = function(selector, context) {
        var match, elem;
        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) return this;
        // Handle HTML strings
        if ("string" == typeof selector) {
            // Match html or make sure no context is specified for #id
            if (// Assume that strings that start and end with <> are HTML and skip the regex check
            match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [ null, selector, null ] : rquickExpr.exec(selector), 
            !match || !match[1] && context) return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
            // HANDLE: $(html) -> $(array)
            if (match[1]) {
                // HANDLE: $(html, props)
                if (context = context instanceof jQuery ? context[0] : context, // scripts is true for back-compat
                // Intentionally let the error be thrown if parseHTML is not present
                jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), 
                rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for (match in context) // Properties of context are called as methods if possible
                jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                return this;
            }
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            // Inject the element directly into the jQuery object
            return elem = document.getElementById(match[2]), elem && elem.parentNode && (this.length = 1, 
            this[0] = elem), this.context = document, this.selector = selector, this;
        }
        // Execute immediately if ready is not present
        return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, 
        this) : jQuery.isFunction(selector) ? "undefined" != typeof rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, 
        this.context = selector.context), jQuery.makeArray(selector, this));
    };
    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn, // Initialize central reference
    rootjQuery = jQuery(document);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/, // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    jQuery.extend({
        dir: function(elem, dir, until) {
            for (var matched = [], truncate = void 0 !== until; (elem = elem[dir]) && 9 !== elem.nodeType; ) if (1 === elem.nodeType) {
                if (truncate && jQuery(elem).is(until)) break;
                matched.push(elem);
            }
            return matched;
        },
        sibling: function(n, elem) {
            for (var matched = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && matched.push(n);
            return matched;
        }
    }), jQuery.fn.extend({
        has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
                for (var i = 0; i < l; i++) if (jQuery.contains(this, targets[i])) return !0;
            });
        },
        closest: function(selectors, context) {
            for (var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; i < l; i++) for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) // Always skip document fragments
            if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : // Don't pass non-elements to Sizzle
            1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
                matched.push(cur);
                break;
            }
            return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        },
        // Determine the position of an element within
        // the matched set of elements
        index: function(elem) {
            // No argument, return index in parent
            // No argument, return index in parent
            // index in selector
            // If it receives a jQuery object, the first element is used
            return elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(selector, context) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
        },
        addBack: function(selector) {
            return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
        }
    }), jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return elem.contentDocument || jQuery.merge([], elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            // Remove duplicates
            // Reverse order for parents* and prev-derivatives
            return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), 
            this.length > 1 && (guaranteedUnique[name] || jQuery.unique(matched), rparentsprev.test(name) && matched.reverse()), 
            this.pushStack(matched);
        };
    });
    var rnotwhite = /\S+/g, optionsCache = {};
    /*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
    jQuery.Callbacks = function(options) {
        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
        var // Last fire value (for non-forgettable lists)
        memory, // Flag to know if list was already fired
        fired, // Flag to know if list is currently firing
        firing, // First callback to fire (used internally by add and fireWith)
        firingStart, // End of the loop when firing
        firingLength, // Index of currently firing callback (modified by remove if needed)
        firingIndex, // Actual callback list
        list = [], // Stack of fire calls for repeatable lists
        stack = !options.once && [], // Fire callbacks
        fire = function(data) {
            for (memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, 
            firingStart = 0, firingLength = list.length, firing = !0; list && firingIndex < firingLength; firingIndex++) if (list[firingIndex].apply(data[0], data[1]) === !1 && options.stopOnFalse) {
                memory = !1;
                // To prevent further calls using add
                break;
            }
            firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
        }, // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
                if (list) {
                    // First, we save the current length
                    var start = list.length;
                    !function add(args) {
                        jQuery.each(args, function(_, arg) {
                            var type = jQuery.type(arg);
                            "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && // Inspect recursively
                            add(arg);
                        });
                    }(arguments), // Do we need to add the callbacks to the
                    // current firing batch?
                    firing ? firingLength = list.length : memory && (firingStart = start, fire(memory));
                }
                return this;
            },
            // Remove a callback from the list
            remove: function() {
                return list && jQuery.each(arguments, function(_, arg) {
                    for (var index; (index = jQuery.inArray(arg, list, index)) > -1; ) list.splice(index, 1), 
                    // Handle firing indexes
                    firing && (index <= firingLength && firingLength--, index <= firingIndex && firingIndex--);
                }), this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !(!list || !list.length);
            },
            // Remove all callbacks from the list
            empty: function() {
                return list = [], firingLength = 0, this;
            },
            // Have the list do nothing anymore
            disable: function() {
                return list = stack = memory = void 0, this;
            },
            // Is it disabled?
            disabled: function() {
                return !list;
            },
            // Lock the list in its current state
            lock: function() {
                return stack = void 0, memory || self.disable(), this;
            },
            // Is it locked?
            locked: function() {
                return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
                return !list || fired && !stack || (args = args || [], args = [ context, args.slice ? args.slice() : args ], 
                firing ? stack.push(args) : fire(args)), this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
                return self.fireWith(this, arguments), this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!fired;
            }
        };
        return self;
    }, jQuery.extend({
        Deferred: function(func) {
            var tuples = [ // action, add listener, listener list, final state
            [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory") ] ], state = "pending", promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    return deferred.done(arguments).fail(arguments), this;
                },
                then: function() {
                    var fns = arguments;
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each(tuples, function(i, tuple) {
                            var fn = jQuery.isFunction(fns[i]) && fns[i];
                            // deferred[ done | fail | progress ] for forwarding actions to newDefer
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments);
                            });
                        }), fns = null;
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function(obj) {
                    return null != obj ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            // All done!
            // Keep pipe for back-compat
            // Add list-specific methods
            // Make the deferred a promise
            // Call given func if any
            return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add, // Handle state
                stateString && list.add(function() {
                    // state = [ resolved | rejected ]
                    state = stateString;
                }, tuples[1 ^ i][2].disable, tuples[2][2].lock), // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function() {
                    return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), 
                    this;
                }, deferred[tuple[0] + "With"] = list.fireWith;
            }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
        },
        // Deferred helper
        when: function(subordinate) {
            var progressValues, progressContexts, resolveContexts, i = 0, resolveValues = slice.call(arguments), length = resolveValues.length, // the count of uncompleted subordinates
            remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
            deferred = 1 === remaining ? subordinate : jQuery.Deferred(), // Update function for both resolve and progress values
            updateFunc = function(i, contexts, values) {
                return function(value) {
                    contexts[i] = this, values[i] = arguments.length > 1 ? slice.call(arguments) : value, 
                    values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
                };
            };
            // add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) for (progressValues = new Array(length), progressContexts = new Array(length), 
            resolveContexts = new Array(length); i < length; i++) resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
            // if we're not waiting on anything, resolve the master
            return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
        }
    });
    // The deferred used on DOM ready
    var readyList;
    jQuery.fn.ready = function(fn) {
        // Add the callback
        return jQuery.ready.promise().done(fn), this;
    }, jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: !1,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function(hold) {
            hold ? jQuery.readyWait++ : jQuery.ready(!0);
        },
        // Handle when the DOM is ready
        ready: function(wait) {
            // Abort if there are pending holds or we're already ready
            (wait === !0 ? --jQuery.readyWait : jQuery.isReady) || (// Remember that the DOM is ready
            jQuery.isReady = !0, // If a normal DOM Ready event fired, decrement, and wait if need be
            wait !== !0 && --jQuery.readyWait > 0 || (// If there are functions bound, to execute
            readyList.resolveWith(document, [ jQuery ]), // Trigger any bound ready events
            jQuery.fn.triggerHandler && (jQuery(document).triggerHandler("ready"), jQuery(document).off("ready"))));
        }
    }), jQuery.ready.promise = function(obj) {
        // Catch cases where $(document).ready() is called after the browser event has already occurred.
        // we once tried to use readyState "interactive" here, but it caused issues like the one
        // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        // Use the handy event callback
        // A fallback to window.onload, that will always work
        return readyList || (readyList = jQuery.Deferred(), "complete" === document.readyState ? setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed, !1), 
        window.addEventListener("load", completed, !1))), readyList.promise(obj);
    }, // Kick off the DOM ready check even if the user does not
    jQuery.ready.promise();
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = null == key;
        // Sets many values
        if ("object" === jQuery.type(key)) {
            chainable = !0;
            for (i in key) jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw);
        } else if (void 0 !== value && (chainable = !0, jQuery.isFunction(value) || (raw = !0), 
        bulk && (// Bulk operations run against the entire set
        raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
            return bulk.call(jQuery(elem), value);
        })), fn)) for (;i < len; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        // Gets
        return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
    };
    /**
 * Determines whether an object can have data
 */
    jQuery.acceptData = function(owner) {
        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        /* jshint -W018 */
        return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType;
    }, Data.uid = 1, Data.accepts = jQuery.acceptData, Data.prototype = {
        key: function(owner) {
            // We can accept data for non-element nodes in modern browsers,
            // but we should not, see #8335.
            // Always return the key for a frozen object.
            if (!Data.accepts(owner)) return 0;
            var descriptor = {}, // Check if the owner object already has a cache key
            unlock = owner[this.expando];
            // If not, create one
            if (!unlock) {
                unlock = Data.uid++;
                // Secure it in a non-enumerable, non-writable property
                try {
                    descriptor[this.expando] = {
                        value: unlock
                    }, Object.defineProperties(owner, descriptor);
                } catch (e) {
                    descriptor[this.expando] = unlock, jQuery.extend(owner, descriptor);
                }
            }
            // Ensure the cache object
            return this.cache[unlock] || (this.cache[unlock] = {}), unlock;
        },
        set: function(owner, data, value) {
            var prop, // There may be an unlock assigned to this node,
            // if there is no entry for this "owner", create one inline
            // and set the unlock as though an owner entry had always existed
            unlock = this.key(owner), cache = this.cache[unlock];
            // Handle: [ owner, key, value ] args
            if ("string" == typeof data) cache[data] = value; else // Fresh assignments by object are shallow copied
            if (jQuery.isEmptyObject(cache)) jQuery.extend(this.cache[unlock], data); else for (prop in data) cache[prop] = data[prop];
            return cache;
        },
        get: function(owner, key) {
            // Either a valid cache is found, or will be created.
            // New caches will be created and the unlock returned,
            // allowing direct access to the newly created
            // empty data object. A valid owner object must be provided.
            var cache = this.cache[this.key(owner)];
            return void 0 === key ? cache : cache[key];
        },
        access: function(owner, key, value) {
            var stored;
            // In cases where either:
            //
            //   1. No key was specified
            //   2. A string key was specified, but no value provided
            //
            // Take the "read" path and allow the get method to determine
            // which value to return, respectively either:
            //
            //   1. The entire cache object
            //   2. The data stored at the key
            //
            // In cases where either:
            //
            //   1. No key was specified
            //   2. A string key was specified, but no value provided
            //
            // Take the "read" path and allow the get method to determine
            // which value to return, respectively either:
            //
            //   1. The entire cache object
            //   2. The data stored at the key
            //
            // [*]When the key is not a string, or both a key and value
            // are specified, set or extend (existing objects) with either:
            //
            //   1. An object of properties
            //   2. A key and value
            //
            return void 0 === key || key && "string" == typeof key && void 0 === value ? (stored = this.get(owner, key), 
            void 0 !== stored ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), 
            void 0 !== value ? value : key);
        },
        remove: function(owner, key) {
            var i, name, camel, unlock = this.key(owner), cache = this.cache[unlock];
            if (void 0 === key) this.cache[unlock] = {}; else {
                // Support array or space separated string of keys
                jQuery.isArray(key) ? // If "name" is an array of keys...
                // When data is initially created, via ("key", "val") signature,
                // keys will be converted to camelCase.
                // Since there is no way to tell _how_ a key was added, remove
                // both plain key and camelCase key. #12786
                // This will only penalize the array argument path.
                name = key.concat(key.map(jQuery.camelCase)) : (camel = jQuery.camelCase(key), // Try the string as a key before any manipulation
                key in cache ? name = [ key, camel ] : (// If a key with the spaces exists, use it.
                // Otherwise, create an array by matching non-whitespace
                name = camel, name = name in cache ? [ name ] : name.match(rnotwhite) || [])), i = name.length;
                for (;i--; ) delete cache[name[i]];
            }
        },
        hasData: function(owner) {
            return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {});
        },
        discard: function(owner) {
            owner[this.expando] && delete this.cache[owner[this.expando]];
        }
    };
    var data_priv = new Data(), data_user = new Data(), rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /([A-Z])/g;
    jQuery.extend({
        hasData: function(elem) {
            return data_user.hasData(elem) || data_priv.hasData(elem);
        },
        data: function(elem, name, data) {
            return data_user.access(elem, name, data);
        },
        removeData: function(elem, name) {
            data_user.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to data_priv methods, these can be deprecated.
        _data: function(elem, name, data) {
            return data_priv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
            data_priv.remove(elem, name);
        }
    }), jQuery.fn.extend({
        data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            // Gets all values
            if (void 0 === key) {
                if (this.length && (data = data_user.get(elem), 1 === elem.nodeType && !data_priv.get(elem, "hasDataAttrs"))) {
                    for (i = attrs.length; i--; ) // Support: IE11+
                    // The attrs elements can be null (#14894)
                    attrs[i] && (name = attrs[i].name, 0 === name.indexOf("data-") && (name = jQuery.camelCase(name.slice(5)), 
                    dataAttr(elem, name, data[name])));
                    data_priv.set(elem, "hasDataAttrs", !0);
                }
                return data;
            }
            // Sets multiple values
            // Sets multiple values
            return "object" == typeof key ? this.each(function() {
                data_user.set(this, key);
            }) : access(this, function(value) {
                var data, camelKey = jQuery.camelCase(key);
                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if (elem && void 0 === value) {
                    if (// Attempt to get data from the cache
                    // with the key as-is
                    data = data_user.get(elem, key), void 0 !== data) return data;
                    if (// Attempt to get data from the cache
                    // with the key camelized
                    data = data_user.get(elem, camelKey), void 0 !== data) return data;
                    if (// Attempt to "discover" the data in
                    // HTML5 custom data-* attrs
                    data = dataAttr(elem, camelKey, void 0), void 0 !== data) return data;
                } else // Set the data...
                this.each(function() {
                    // First, attempt to store a copy or reference of any
                    // data that might've been store with a camelCased key.
                    var data = data_user.get(this, camelKey);
                    // For HTML5 data-* attribute interop, we have to
                    // store property names with dashes in a camelCase form.
                    // This might not apply to all properties...*
                    data_user.set(this, camelKey, value), // *... In the case of properties that might _actually_
                    // have dashes, we need to also store a copy of that
                    // unchanged property.
                    key.indexOf("-") !== -1 && void 0 !== data && data_user.set(this, key, value);
                });
            }, null, value, arguments.length > 1, null, !0);
        },
        removeData: function(key) {
            return this.each(function() {
                data_user.remove(this, key);
            });
        }
    }), jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) // Speed up dequeue by getting out quickly if this is just a lookup
            return type = (type || "fx") + "queue", queue = data_priv.get(elem, type), data && (!queue || jQuery.isArray(data) ? queue = data_priv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), 
            queue || [];
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
                jQuery.dequeue(elem, type);
            };
            // If the fx queue is dequeued, always remove the progress sentinel
            "inprogress" === fn && (fn = queue.shift(), startLength--), fn && (// Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            "fx" === type && queue.unshift("inprogress"), // clear up the last queue stop function
            delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire();
        },
        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return data_priv.get(elem, key) || data_priv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    data_priv.remove(elem, [ type + "queue", key ]);
                })
            });
        }
    }), jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                // ensure a hooks for this queue
                jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                --count || defer.resolveWith(elements, [ elements ]);
            };
            for ("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--; ) tmp = data_priv.get(elements[i], type + "queueHooks"), 
            tmp && tmp.empty && (count++, tmp.empty.add(resolve));
            return resolve(), defer.promise(obj);
        }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, cssExpand = [ "Top", "Right", "Bottom", "Left" ], isHidden = function(elem, el) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem);
    }, rcheckableType = /^(?:checkbox|radio)$/i;
    !function() {
        var fragment = document.createDocumentFragment(), div = fragment.appendChild(document.createElement("div")), input = document.createElement("input");
        // #11217 - WebKit loses check when the name is after the checked attribute
        // Support: Windows Web Apps (WWA)
        // `name` and `type` need .setAttribute for WWA
        input.setAttribute("type", "radio"), input.setAttribute("checked", "checked"), input.setAttribute("name", "t"), 
        div.appendChild(input), // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
        // old WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, // Make sure textarea (and checkbox) defaultValue is properly cloned
        // Support: IE9-IE11+
        div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue;
    }();
    var strundefined = "undefined";
    support.focusinBubbles = "onfocusin" in window;
    var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
    jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.get(elem);
            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (elemData) for (// Caller can pass in an object of custom data in lieu of the handler
            handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, selector = handleObjIn.selector), 
            // Make sure that the handler has a unique ID, used to find/remove it later
            handler.guid || (handler.guid = jQuery.guid++), // Init the element's event structure and main handler, if this is the first
            (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            }), // Handle multiple events separated by a space
            types = (types || "").match(rnotwhite) || [ "" ], t = types.length; t--; ) tmp = rtypenamespace.exec(types[t]) || [], 
            type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), // There *must* be a type, no attaching namespace-only handlers
            type && (// If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[type] || {}, // If selector defined, determine special event api type, otherwise given type
            type = (selector ? special.delegateType : special.bindType) || type, // Update special based on newly reset type
            special = jQuery.event.special[type] || {}, // handleObj is passed to all event handlers
            handleObj = jQuery.extend({
                type: type,
                origType: origType,
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
            }, handleObjIn), // Init the event handler queue if we're the first
            (handlers = events[type]) || (handlers = events[type] = [], handlers.delegateCount = 0, 
            // Only use addEventListener if the special events handler returns false
            special.setup && special.setup.call(elem, data, namespaces, eventHandle) !== !1 || elem.addEventListener && elem.addEventListener(type, eventHandle, !1)), 
            special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), 
            // Add to the element's handler list, delegates in front
            selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), 
            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[type] = !0);
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.hasData(elem) && data_priv.get(elem);
            if (elemData && (events = elemData.events)) {
                for (// Once for each type.namespace in types; type may be omitted
                types = (types || "").match(rnotwhite) || [ "" ], t = types.length; t--; ) // Unbind all events (on this namespace, if provided) for the element
                if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), 
                type) {
                    for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, 
                    handlers = events[type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                    // Remove matching events
                    origCount = j = handlers.length; j--; ) handleObj = handlers[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || tmp && !tmp.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (handlers.splice(j, 1), 
                    handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                    // Remove generic event handler if we removed something and no more handlers exist
                    // (avoids potential for endless recursion during removal of special event handlers)
                    origCount && !handlers.length && (special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== !1 || jQuery.removeEvent(elem, type, elemData.handle), 
                    delete events[type]);
                } else for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                // Remove the expando if it's no longer used
                jQuery.isEmptyObject(events) && (delete elemData.handle, data_priv.remove(elem, "events"));
            }
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [ elem || document ], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            // Don't do events on text and comment nodes
            if (cur = tmp = elem = elem || document, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (// Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, 
            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), 
            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), 
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
            // Clean up the event in case it is being reused
            event.result = void 0, event.target || (event.target = elem), // Clone any incoming data and prepend the event, creating the handler arg list
            data = null == data ? [ event ] : jQuery.makeArray(data, [ event ]), // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || special.trigger.apply(elem, data) !== !1)) {
                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                    for (bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode) eventPath.push(cur), 
                    tmp = cur;
                    // Only add window if we got to document (e.g., not plain obj or detached DOM)
                    tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
                for (// Fire handlers on the event path
                i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped(); ) event.type = i > 1 ? bubbleType : special.bindType || type, 
                // jQuery handler
                handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle"), 
                handle && handle.apply(cur, data), // Native handler
                handle = ontype && cur[ontype], handle && handle.apply && jQuery.acceptData(cur) && (event.result = handle.apply(cur, data), 
                event.result === !1 && event.preventDefault());
                // If nobody prevented the default action, do it now
                // Call a native DOM method on the target with the same name name as the event.
                // Don't do default actions on window, that's where global variables be (#6170)
                // Don't re-trigger an onFOO event when we call its FOO() method
                // Prevent re-triggering of the same event, since we already bubbled it above
                return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && special._default.apply(eventPath.pop(), data) !== !1 || !jQuery.acceptData(elem) || ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem) && (tmp = elem[ontype], 
                tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = void 0, 
                tmp && (elem[ontype] = tmp)), event.result;
            }
        },
        dispatch: function(event) {
            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);
            var i, j, ret, matched, handleObj, handlerQueue = [], args = slice.call(arguments), handlers = (data_priv.get(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (// Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== !1) {
                for (// Determine handlers
                handlerQueue = jQuery.event.handlers.call(this, event, handlers), // Run delegates first; they may want to stop propagation beneath us
                i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped(); ) for (event.currentTarget = matched.elem, 
                j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped(); ) // Triggered event must either 1) have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                event.namespace_re && !event.namespace_re.test(handleObj.namespace) || (event.handleObj = handleObj, 
                event.data = handleObj.data, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), 
                void 0 !== ret && (event.result = ret) === !1 && (event.preventDefault(), event.stopPropagation()));
                // Call the postDispatch hook for the mapped type
                return special.postDispatch && special.postDispatch.call(this, event), event.result;
            }
        },
        handlers: function(event, handlers) {
            var i, matches, sel, handleObj, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (delegateCount && cur.nodeType && (!event.button || "click" !== event.type)) for (;cur !== this; cur = cur.parentNode || this) // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
            if (cur.disabled !== !0 || "click" !== event.type) {
                for (matches = [], i = 0; i < delegateCount; i++) handleObj = handlers[i], // Don't conflict with Object.prototype properties (#13203)
                sel = handleObj.selector + " ", void 0 === matches[sel] && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [ cur ]).length), 
                matches[sel] && matches.push(handleObj);
                matches.length && handlerQueue.push({
                    elem: cur,
                    handlers: matches
                });
            }
            // Add the remaining (directly-bound) handlers
            return delegateCount < handlers.length && handlerQueue.push({
                elem: this,
                handlers: handlers.slice(delegateCount)
            }), handlerQueue;
        },
        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(event, original) {
                // Add which for key events
                return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), 
                event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var eventDoc, doc, body, button = original.button;
                // Calculate pageX/Y if missing and clientX/Y available
                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                return null == event.pageX && null != original.clientX && (eventDoc = event.target.ownerDocument || document, 
                doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), 
                event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), 
                event.which || void 0 === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), 
                event;
            }
        },
        fix: function(event) {
            if (event[jQuery.expando]) return event;
            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            for (fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), 
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), 
            i = copy.length; i--; ) prop = copy[i], event[prop] = originalEvent[prop];
            // Support: Cordova 2.5 (WebKit) (#13255)
            // All events should have a target; Cordova deviceready doesn't
            // Support: Safari 6.0+, Chrome < 28
            // Target should not be a text node (#504, #13143)
            return event.target || (event.target = document), 3 === event.target.nodeType && (event.target = event.target.parentNode), 
            fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: !0
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function() {
                    if (this !== safeActiveElement() && this.focus) return this.focus(), !1;
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === safeActiveElement() && this.blur) return this.blur(), !1;
                },
                delegateType: "focusout"
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function() {
                    if ("checkbox" === this.type && this.click && jQuery.nodeName(this, "input")) return this.click(), 
                    !1;
                },
                // For cross-browser consistency, don't fire native .click() on links
                _default: function(event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(event) {
                    // Support: Firefox 20+
                    // Firefox doesn't alert if the returnValue field is not set.
                    void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result);
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: !0,
                originalEvent: {}
            });
            bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), 
            e.isDefaultPrevented() && event.preventDefault();
        }
    }, jQuery.removeEvent = function(elem, type, handle) {
        elem.removeEventListener && elem.removeEventListener(type, handle, !1);
    }, jQuery.Event = function(src, props) {
        // Allow instantiation without the 'new' keyword
        // Allow instantiation without the 'new' keyword
        // Event object
        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        // Support: Android < 4.0
        // Put explicitly provided properties onto the event object
        // Create a timestamp if incoming event doesn't have one
        // Mark it as fixed
        return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, 
        this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === !1 ? returnTrue : returnFalse) : this.type = src, 
        props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), 
        void (this[jQuery.expando] = !0)) : new jQuery.Event(src, props);
    }, // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault();
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation();
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), 
            this.stopPropagation();
        }
    }, // Create mouseenter/leave events using mouseover/out and event-time checks
    // Support: Chrome 15+
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                return related && (related === target || jQuery.contains(target, related)) || (event.type = handleObj.origType, 
                ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
            }
        };
    }), // Create "bubbling" focus and blur events
    // Support: Firefox, Chrome, Safari
    support.focusinBubbles || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        // Attach a single capturing handler on the document while someone wants focusin/focusout
        var handler = function(event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
        };
        jQuery.event.special[fix] = {
            setup: function() {
                var doc = this.ownerDocument || this, attaches = data_priv.access(doc, fix);
                attaches || doc.addEventListener(orig, handler, !0), data_priv.access(doc, fix, (attaches || 0) + 1);
            },
            teardown: function() {
                var doc = this.ownerDocument || this, attaches = data_priv.access(doc, fix) - 1;
                attaches ? data_priv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), 
                data_priv.remove(doc, fix));
            }
        };
    }), jQuery.fn.extend({
        on: function(types, selector, data, fn, /*INTERNAL*/ one) {
            var origFn, type;
            // Types can be a map of types/handlers
            if ("object" == typeof types) {
                // ( types-Object, selector, data )
                "string" != typeof selector && (// ( types-Object, data )
                data = data || selector, selector = void 0);
                for (type in types) this.on(type, selector, data, types[type], one);
                return this;
            }
            if (null == data && null == fn ? (// ( types, fn )
            fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (// ( types, selector, fn )
            fn = data, data = void 0) : (// ( types, data, fn )
            fn = data, data = selector, selector = void 0)), fn === !1) fn = returnFalse; else if (!fn) return this;
            // Use same guid so caller can remove using origFn
            return 1 === one && (origFn = fn, fn = function(event) {
                // Can use an empty set, since event contains the info
                return jQuery().off(event), origFn.apply(this, arguments);
            }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) // ( event )  dispatched jQuery.Event
            return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), 
            this;
            if ("object" == typeof types) {
                // ( types-object [, selector] )
                for (type in types) this.off(type, selector, types[type]);
                return this;
            }
            // ( types [, fn] )
            return selector !== !1 && "function" != typeof selector || (fn = selector, selector = void 0), 
            fn === !1 && (fn = returnFalse), this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) return jQuery.event.trigger(type, data, elem, !0);
        }
    });
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, // We have to close these tags to support XHTML (#13200)
    wrapMap = {
        // Support: IE 9
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: [ 0, "", "" ]
    };
    // Support: IE 9
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, 
    wrapMap.th = wrapMap.td, jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(!0), inPage = jQuery.contains(elem.ownerDocument, elem);
            // Support: IE >= 9
            // Fix Cloning issues
            if (!(support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem))) for (// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
            destElements = getAll(clone), srcElements = getAll(elem), i = 0, l = srcElements.length; i < l; i++) fixInput(srcElements[i], destElements[i]);
            // Copy the events from the original to the clone
            if (dataAndEvents) if (deepDataAndEvents) for (srcElements = srcElements || getAll(elem), 
            destElements = destElements || getAll(clone), i = 0, l = srcElements.length; i < l; i++) cloneCopyEvent(srcElements[i], destElements[i]); else cloneCopyEvent(elem, clone);
            // Return the cloned set
            // Preserve script evaluation history
            return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), 
            clone;
        },
        buildFragment: function(elems, context, scripts, selection) {
            for (var elem, tmp, tag, wrap, contains, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; i < l; i++) if (elem = elems[i], 
            elem || 0 === elem) // Add nodes directly
            if ("object" === jQuery.type(elem)) // Support: QtWebKit
            // jQuery.merge because push.apply(_, arraylike) throws
            jQuery.merge(nodes, elem.nodeType ? [ elem ] : elem); else if (rhtml.test(elem)) {
                for (tmp = tmp || fragment.appendChild(context.createElement("div")), // Deserialize a standard representation
                tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, 
                tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], // Descend through wrappers to the right content
                j = wrap[0]; j--; ) tmp = tmp.lastChild;
                // Support: QtWebKit
                // jQuery.merge because push.apply(_, arraylike) throws
                jQuery.merge(nodes, tmp.childNodes), // Remember the top-level container
                tmp = fragment.firstChild, // Fixes #12346
                // Support: Webkit, IE
                tmp.textContent = "";
            } else nodes.push(context.createTextNode(elem));
            for (// Remove wrapper from fragment
            fragment.textContent = "", i = 0; elem = nodes[i++]; ) // #4087 - If origin and destination elements are the same, and this is
            // that element, do not do anything
            if ((!selection || jQuery.inArray(elem, selection) === -1) && (contains = jQuery.contains(elem.ownerDocument, elem), 
            // Append to fragment
            tmp = getAll(fragment.appendChild(elem), "script"), // Preserve script evaluation history
            contains && setGlobalEval(tmp), scripts)) for (j = 0; elem = tmp[j++]; ) rscriptType.test(elem.type || "") && scripts.push(elem);
            return fragment;
        },
        cleanData: function(elems) {
            for (var data, elem, type, key, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++) {
                if (jQuery.acceptData(elem) && (key = elem[data_priv.expando], key && (data = data_priv.cache[key]))) {
                    if (data.events) for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                    data_priv.cache[key] && // Discard any remaining `private` data
                    delete data_priv.cache[key];
                }
                // Discard any remaining `user` data
                delete data_user.cache[elem[data_user.expando]];
            }
        }
    }), jQuery.fn.extend({
        text: function(value) {
            return access(this, function(value) {
                return void 0 === value ? jQuery.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = value);
                });
            }, null, value, arguments.length);
        },
        append: function() {
            return this.domManip(arguments, function(elem) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, function(elem) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },
        before: function() {
            return this.domManip(arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this);
            });
        },
        after: function() {
            return this.domManip(arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },
        remove: function(selector, keepData) {
            for (var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0; null != (elem = elems[i]); i++) keepData || 1 !== elem.nodeType || jQuery.cleanData(getAll(elem)), 
            elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), 
            elem.parentNode.removeChild(elem));
            return this;
        },
        empty: function() {
            for (var elem, i = 0; null != (elem = this[i]); i++) 1 === elem.nodeType && (// Prevent memory leaks
            jQuery.cleanData(getAll(elem, !1)), // Remove any remaining nodes
            elem.textContent = "");
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, 
            this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            return access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
                // See if we can take a shortcut and just use innerHTML
                if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for (;i < l; i++) elem = this[i] || {}, // Remove element nodes and prevent memory leaks
                        1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                        elem = 0;
                    } catch (e) {}
                }
                elem && this.empty().append(value);
            }, null, value, arguments.length);
        },
        replaceWith: function() {
            var arg = arguments[0];
            // Force removal if there was no new content (e.g., from empty arguments)
            // Make the changes, replacing each context element with the new content
            return this.domManip(arguments, function(elem) {
                arg = this.parentNode, jQuery.cleanData(getAll(this)), arg && arg.replaceChild(elem, this);
            }), arg && (arg.length || arg.nodeType) ? this : this.remove();
        },
        detach: function(selector) {
            return this.remove(selector, !0);
        },
        domManip: function(args, callback) {
            // Flatten any nested arrays
            args = concat.apply([], args);
            var fragment, first, scripts, hasScripts, node, doc, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            // We can't cloneNode fragments that contain checked, in WebKit
            if (isFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return this.each(function(index) {
                var self = set.eq(index);
                isFunction && (args[0] = value.call(this, index, self.html())), self.domManip(args, callback);
            });
            if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this), 
            first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), 
            first)) {
                // Use the original fragment for the last item instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for (scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; i < l; i++) node = fragment, 
                i !== iNoClone && (node = jQuery.clone(node, !0, !0), // Keep references to cloned scripts for later restoration
                hasScripts && // Support: QtWebKit
                // jQuery.merge because push.apply(_, arraylike) throws
                jQuery.merge(scripts, getAll(node, "script"))), callback.call(this[i], node, i);
                if (hasScripts) // Evaluate executable scripts on first document insertion
                for (doc = scripts[scripts.length - 1].ownerDocument, // Reenable scripts
                jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++) node = scripts[i], 
                rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? // Optional AJAX dependency, but won't run scripts if not present
                jQuery._evalUrl && jQuery._evalUrl(node.src) : jQuery.globalEval(node.textContent.replace(rcleanScript, "")));
            }
            return this;
        }
    }), jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            for (var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; i <= last; i++) elems = i === last ? this : this.clone(!0), 
            jQuery(insert[i])[original](elems), // Support: QtWebKit
            // .get() because push.apply(_, arraylike) throws
            push.apply(ret, elems.get());
            return this.pushStack(ret);
        };
    });
    var iframe, elemdisplay = {}, rmargin = /^margin/, rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"), getStyles = function(elem) {
        return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    };
    !function() {
        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computePixelPositionAndBoxSizingReliable() {
            div.style.cssText = // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", 
            div.innerHTML = "", docElem.appendChild(container);
            var divStyle = window.getComputedStyle(div, null);
            pixelPositionVal = "1%" !== divStyle.top, boxSizingReliableVal = "4px" === divStyle.width, 
            docElem.removeChild(container);
        }
        var pixelPositionVal, boxSizingReliableVal, docElem = document.documentElement, container = document.createElement("div"), div = document.createElement("div");
        div.style && (div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", 
        support.clearCloneStyle = "content-box" === div.style.backgroundClip, container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", 
        container.appendChild(div), // Support: node.js jsdom
        // Don't assume that getComputedStyle is a property of the global object
        window.getComputedStyle && jQuery.extend(support, {
            pixelPosition: function() {
                // This test is executed only once but we still do memoizing
                // since we can use the boxSizingReliable pre-computing.
                // No need to check if the test was already performed, though.
                return computePixelPositionAndBoxSizingReliable(), pixelPositionVal;
            },
            boxSizingReliable: function() {
                return null == boxSizingReliableVal && computePixelPositionAndBoxSizingReliable(), 
                boxSizingReliableVal;
            },
            reliableMarginRight: function() {
                // Support: Android 2.3
                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // This support function is only executed once so no memoizing is needed.
                var ret, marginDiv = div.appendChild(document.createElement("div"));
                // Reset CSS: box-sizing; display; margin; border; padding
                // Support: Firefox<29, Android 2.3
                // Vendor-prefix box-sizing
                return marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", 
                marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", 
                docElem.appendChild(container), ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight), 
                docElem.removeChild(container), ret;
            }
        }));
    }(), // A method for quickly swapping in/out CSS properties to get correct calculations.
    jQuery.swap = function(elem, options, callback, args) {
        var ret, name, old = {};
        // Remember the old values, and insert the new ones
        for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
        ret = callback.apply(elem, args || []);
        // Revert the old values
        for (name in options) elem.style[name] = old[name];
        return ret;
    };
    var // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/, rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"), rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"), cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
    }, cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return "" === ret ? "1" : ret;
                    }
                }
            }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            float: "cssFloat"
        },
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                // Make sure that we're working with the right name
                var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
                // Check if we're setting a value
                // gets hook for the prefixed version
                // followed by the unprefixed version
                // Check if we're setting a value
                // If a hook was provided get the non-computed value from there
                // convert relative number strings (+= or -=) to relative numbers. #7345
                // Fixes bug #9237
                // Make sure that null and NaN values aren't set. See: #7116
                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                // Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                // If a hook was provided, use that value, otherwise just set the specified value
                return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), 
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value ? hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name] : (type = typeof value, 
                "string" === type && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), 
                type = "number"), null != value && value === value && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), 
                support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), 
                hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (style[name] = value)), 
                void 0);
            }
        },
        css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = jQuery.camelCase(name);
            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            // Make sure that we're working with the right name
            // gets hook for the prefixed version
            // followed by the unprefixed version
            // If a hook was provided get the computed value from there
            // Otherwise, if a way to get the computed value exists, use that
            //convert "normal" to computed value
            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), 
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), 
            void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), 
            "" === extra || extra ? (num = parseFloat(val), extra === !0 || jQuery.isNumeric(num) ? num || 0 : val) : val;
        }
    }), jQuery.each([ "height", "width" ], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                if (computed) // certain elements can have dimension info if we invisibly show them
                // however, it must have a current display style that would benefit from this
                return rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? jQuery.swap(elem, cssShow, function() {
                    return getWidthOrHeight(elem, name, extra);
                }) : getWidthOrHeight(elem, name, extra);
            },
            set: function(elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles) : 0);
            }
        };
    }), // Support: Android 2.3
    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
        if (computed) // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        // Work around by temporarily setting element display to inline-block
        return jQuery.swap(elem, {
            display: "inline-block"
        }, curCSS, [ elem, "marginRight" ]);
    }), // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                for (var i = 0, expanded = {}, // assumes a single number if not a string
                parts = "string" == typeof value ? value.split(" ") : [ value ]; i < 4; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                return expanded;
            }
        }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
    }), jQuery.fn.extend({
        css: function(name, value) {
            return access(this, function(elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    for (styles = getStyles(elem), len = name.length; i < len; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                    return map;
                }
                return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function() {
            return showHide(this, !0);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state) {
            return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
                isHidden(this) ? jQuery(this).show() : jQuery(this).hide();
            });
        }
    }), jQuery.Tween = Tween, Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem, this.prop = prop, this.easing = easing || "swing", this.options = options, 
            this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, 
            this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
            hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
        }
    }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
        _default: {
            get: function(tween) {
                var result;
                // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                return null == tween.elem[tween.prop] || tween.elem.style && null != tween.elem.style[tween.prop] ? (result = jQuery.css(tween.elem, tween.prop, ""), 
                result && "auto" !== result ? result : 0) : tween.elem[tween.prop];
            },
            set: function(tween) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
            }
        }
    }, // Support: IE9
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
        }
    }, jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        }
    }, jQuery.fx = Tween.prototype.init, // Back Compat <1.8 extension point
    jQuery.fx.step = {};
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [ defaultPrefilter ], tweeners = {
        "*": [ function(prop, value) {
            var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value), unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), // Starting value computation is required for potential unit mismatches
            start = (jQuery.cssNumber[prop] || "px" !== unit && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)), scale = 1, maxIterations = 20;
            if (start && start[3] !== unit) {
                // Trust units reported by jQuery.css
                unit = unit || start[3], // Make sure we update the tween properties later on
                parts = parts || [], // Iteratively approximate from a nonzero starting point
                start = +target || 1;
                do // If previous iteration zeroed out, double until we get *something*
                // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                scale = scale || ".5", // Adjust and apply
                start /= scale, jQuery.style(tween.elem, prop, start + unit); while (scale !== (scale = tween.cur() / target) && 1 !== scale && --maxIterations);
            }
            // Update tween properties
            // If a +=/-= token was provided, we're doing a relative animation
            return parts && (start = tween.start = +start || +target || 0, tween.unit = unit, 
            tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]), tween;
        } ]
    };
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function(props, callback) {
            jQuery.isFunction(props) ? (callback = props, props = [ "*" ]) : props = props.split(" ");
            for (var prop, index = 0, length = props.length; index < length; index++) prop = props[index], 
            tweeners[prop] = tweeners[prop] || [], tweeners[prop].unshift(callback);
        },
        prefilter: function(callback, prepend) {
            prepend ? animationPrefilters.unshift(callback) : animationPrefilters.push(callback);
        }
    }), jQuery.speed = function(speed, easing, fn) {
        var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        // normalize opt.queue - true/undefined/null -> "fx"
        // Queueing
        return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, 
        null != opt.queue && opt.queue !== !0 || (opt.queue = "fx"), opt.old = opt.complete, 
        opt.complete = function() {
            jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
        }, opt;
    }, jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            // show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                // Operate on a copy of prop so per-property easing won't be lost
                var anim = Animation(this, jQuery.extend({}, prop), optall);
                // Empty animations, or finishing resolves immediately
                (empty || data_priv.get(this, "finish")) && anim.stop(!0);
            };
            return doAnimation.finish = doAnimation, empty || optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop, stop(gotoEnd);
            };
            return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), 
            clearQueue && type !== !1 && this.queue(type || "fx", []), this.each(function() {
                var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = data_priv.get(this);
                if (index) data[index] && data[index].stop && stopQueue(data[index]); else for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                for (index = timers.length; index--; ) timers[index].elem !== this || null != type && timers[index].queue !== type || (timers[index].anim.stop(gotoEnd), 
                dequeue = !1, timers.splice(index, 1));
                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                !dequeue && gotoEnd || jQuery.dequeue(this, type);
            });
        },
        finish: function(type) {
            return type !== !1 && (type = type || "fx"), this.each(function() {
                var index, data = data_priv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                // look for any active animations, and finish them
                for (// enable finishing flag on private data
                data.finish = !0, // empty the queue first
                jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0), 
                index = timers.length; index--; ) timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), 
                timers.splice(index, 1));
                // look for any animations in the old queue and finish them
                for (index = 0; index < length; index++) queue[index] && queue[index].finish && queue[index].finish.call(this);
                // turn off finishing flag
                delete data.finish;
            });
        }
    }), jQuery.each([ "toggle", "show", "hide" ], function(i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
        };
    }), // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    }), jQuery.timers = [], jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        for (fxNow = jQuery.now(); i < timers.length; i++) timer = timers[i], // Checks the timer has not already been removed
        timer() || timers[i] !== timer || timers.splice(i--, 1);
        timers.length || jQuery.fx.stop(), fxNow = void 0;
    }, jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer), timer() ? jQuery.fx.start() : jQuery.timers.pop();
    }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
        timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval));
    }, jQuery.fx.stop = function() {
        clearInterval(timerId), timerId = null;
    }, jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    }, // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function(time, type) {
        return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", 
        this.queue(type, function(next, hooks) {
            var timeout = setTimeout(next, time);
            hooks.stop = function() {
                clearTimeout(timeout);
            };
        });
    }, function() {
        var input = document.createElement("input"), select = document.createElement("select"), opt = select.appendChild(document.createElement("option"));
        input.type = "checkbox", // Support: iOS 5.1, Android 4.x, Android 2.3
        // Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
        support.checkOn = "" !== input.value, // Must access the parent to make an option select properly
        // Support: IE9, IE10
        support.optSelected = opt.selected, // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = !0, support.optDisabled = !opt.disabled, // Check if an input maintains its value after becoming a radio
        // Support: IE9, IE10
        input = document.createElement("input"), input.value = "t", input.type = "radio", 
        support.radioValue = "t" === input.value;
    }();
    var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle;
    jQuery.fn.extend({
        attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        }
    }), jQuery.extend({
        attr: function(elem, name, value) {
            var hooks, ret, nType = elem.nodeType;
            // don't get/set attributes on text, comment and attribute nodes
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) // Fallback to prop when attributes are not supported
            // Fallback to prop when attributes are not supported
            // All attributes are lowercase
            // Grab necessary hook if one is defined
            return typeof elem.getAttribute === strundefined ? jQuery.prop(elem, name, value) : (1 === nType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), 
            hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), 
            void 0 === value ? hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : (ret = jQuery.find.attr(elem, name), 
            null == ret ? void 0 : ret) : null !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), 
            value) : void jQuery.removeAttr(elem, name));
        },
        removeAttr: function(elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(rnotwhite);
            if (attrNames && 1 === elem.nodeType) for (;name = attrNames[i++]; ) propName = jQuery.propFix[name] || name, 
            // Boolean attributes get special treatment (#10870)
            jQuery.expr.match.bool.test(name) && (// Set corresponding property to false
            elem[propName] = !1), elem.removeAttribute(name);
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        return elem.setAttribute("type", value), val && (elem.value = val), value;
                    }
                }
            }
        }
    }), // Hooks for boolean attributes
    boolHook = {
        set: function(elem, value, name) {
            // Remove boolean attributes when set to false
            return value === !1 ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), 
            name;
        }
    }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name, isXML) {
            var ret, handle;
            // Avoid an infinite loop by temporarily removing this function from the getter
            return isXML || (handle = attrHandle[name], attrHandle[name] = ret, ret = null != getter(elem, name, isXML) ? name.toLowerCase() : null, 
            attrHandle[name] = handle), ret;
        };
    });
    var rfocusable = /^(?:input|select|textarea|button)$/i;
    jQuery.fn.extend({
        prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            return this.each(function() {
                delete this[jQuery.propFix[name] || name];
            });
        }
    }), jQuery.extend({
        propFix: {
            for: "htmlFor",
            class: "className"
        },
        prop: function(elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            // don't get/set properties on text, comment and attribute nodes
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) // Fix name and attach hooks
            return notxml = 1 !== nType || !jQuery.isXMLDoc(elem), notxml && (name = jQuery.propFix[name] || name, 
            hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ? elem.tabIndex : -1;
                }
            }
        }
    }), // Support: IE9+
    // Selectedness for an option in an optgroup can be inaccurate
    support.optSelected || (jQuery.propHooks.selected = {
        get: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.parentNode && parent.parentNode.selectedIndex, null;
        }
    }), jQuery.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
    });
    var rclass = /[\t\r\n\f]/g;
    jQuery.fn.extend({
        addClass: function(value) {
            var classes, elem, cur, clazz, j, finalValue, proceed = "string" == typeof value && value, i = 0, len = this.length;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, this.className));
            });
            if (proceed) for (// The disjunction here is for better compressibility (see removeClass)
            classes = (value || "").match(rnotwhite) || []; i < len; i++) if (elem = this[i], 
            cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
                for (j = 0; clazz = classes[j++]; ) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
                // only assign if different to avoid unneeded rendering.
                finalValue = jQuery.trim(cur), elem.className !== finalValue && (elem.className = finalValue);
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, clazz, j, finalValue, proceed = 0 === arguments.length || "string" == typeof value && value, i = 0, len = this.length;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, this.className));
            });
            if (proceed) for (classes = (value || "").match(rnotwhite) || []; i < len; i++) if (elem = this[i], 
            // This expression is here for better compressibility (see addClass)
            cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
                for (j = 0; clazz = classes[j++]; ) // Remove *all* instances
                for (;cur.indexOf(" " + clazz + " ") >= 0; ) cur = cur.replace(" " + clazz + " ", " ");
                // only assign if different to avoid unneeded rendering.
                finalValue = value ? jQuery.trim(cur) : "", elem.className !== finalValue && (elem.className = finalValue);
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value;
            return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            }) : this.each(function() {
                if ("string" === type) for (// toggle individual class names
                var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || []; className = classNames[i++]; ) // check each className given, space separated list
                self.hasClass(className) ? self.removeClass(className) : self.addClass(className); else type !== strundefined && "boolean" !== type || (this.className && // store className if set
                data_priv.set(this, "__className__", this.className), // If the element has a class name or if we're passed "false",
                // then remove the whole classname (if there was one, the above saved it).
                // Otherwise bring back whatever was previously saved (if anything),
                // falling back to the empty string if nothing was stored.
                this.className = this.className || value === !1 ? "" : data_priv.get(this, "__className__") || "");
            });
        },
        hasClass: function(selector) {
            for (var className = " " + selector + " ", i = 0, l = this.length; i < l; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
            return !1;
        }
    });
    var rreturn = /\r/g;
    jQuery.fn.extend({
        val: function(value) {
            var hooks, ret, isFunction, elem = this[0];
            {
                if (arguments.length) return isFunction = jQuery.isFunction(value), this.each(function(i) {
                    var val;
                    1 === this.nodeType && (val = isFunction ? value.call(this, i, jQuery(this).val()) : value, 
                    // Treat null/undefined as ""; convert numbers to string
                    null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                        return null == value ? "" : value + "";
                    })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], 
                    // If set returns undefined, fall back to normal setting
                    hooks && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val));
                });
                if (elem) // handle most common string cases
                // handle cases where value is null/undef or number
                return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], 
                hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : (ret = elem.value, 
                "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
            }
        }
    }), jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = jQuery.find.attr(elem, "value");
                    // Support: IE10-11+
                    // option.text throws exceptions (#14686, #14858)
                    return null != val ? val : jQuery.trim(jQuery.text(elem));
                }
            },
            select: {
                get: function(elem) {
                    // Loop through all the selected options
                    for (var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0; i < max; i++) // IE6-9 doesn't update selected after form reset (#2551)
                    if (option = options[i], (option.selected || i === index) && (// Don't return options that are disabled or in a disabled optgroup
                    support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                        // We don't need an array for one selects
                        if (// Get the specific value for the option
                        value = jQuery(option).val(), one) return value;
                        // Multi-Selects return an array
                        values.push(value);
                    }
                    return values;
                },
                set: function(elem, value) {
                    for (var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--; ) option = options[i], 
                    (option.selected = jQuery.inArray(option.value, values) >= 0) && (optionSet = !0);
                    // force browsers to behave consistently when non-matching value is set
                    return optionSet || (elem.selectedIndex = -1), values;
                }
            }
        }
    }), // Radios and checkboxes getter/setter
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[this] = {
            set: function(elem, value) {
                if (jQuery.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
            }
        }, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
            // Support: Webkit
            // "" is returned instead of "on" if a value isn't specified
            return null === elem.getAttribute("value") ? "on" : elem.value;
        });
    }), // Return jQuery for attributes-only inclusion
    jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
        // Handle event binding
        jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    }), jQuery.fn.extend({
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },
        bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
            return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
            // ( namespace ) or ( selector, types [, fn] )
            return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });
    var nonce = jQuery.now(), rquery = /\?/;
    // Support: Android 2.3
    // Workaround failure to string-cast null input
    jQuery.parseJSON = function(data) {
        return JSON.parse(data + "");
    }, // Cross-browser xml parsing
    jQuery.parseXML = function(data) {
        var xml, tmp;
        if (!data || "string" != typeof data) return null;
        // Support: IE9
        try {
            tmp = new DOMParser(), xml = tmp.parseFromString(data, "text/xml");
        } catch (e) {
            xml = void 0;
        }
        return xml && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), 
        xml;
    };
    var // Document location
    ajaxLocParts, ajaxLocation, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm, // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, /* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
    prefilters = {}, /* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
    transports = {}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat("*");
    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href;
    }
    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                "* text": String,
                // Text to html (true = no transformation)
                "text html": !0,
                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,
                // Parse text as xml
                "text xml": jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
            // Building a settings object
            // Extending ajaxSettings
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                // Called once
                2 !== state && (// State is "done" now
                state = 2, // Clear timeout if it exists
                timeoutTimer && clearTimeout(timeoutTimer), // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = void 0, // Cache response headers
                responseHeadersString = headers || "", // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0, // Determine if successful
                isSuccess = status >= 200 && status < 300 || 304 === status, // Get response data
                responses && (response = ajaxHandleResponses(s, jqXHR, responses)), // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert(s, response, jqXHR, isSuccess), // If successful, handle type chaining
                isSuccess ? (// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                s.ifModified && (modified = jqXHR.getResponseHeader("Last-Modified"), modified && (jQuery.lastModified[cacheURL] = modified), 
                modified = jqXHR.getResponseHeader("etag"), modified && (jQuery.etag[cacheURL] = modified)), 
                // if no content
                204 === status || "HEAD" === s.type ? statusText = "nocontent" : 304 === status ? statusText = "notmodified" : (statusText = response.state, 
                success = response.data, error = response.error, isSuccess = !error)) : (// We extract error from statusText
                // then normalize statusText and status for non-aborts
                error = statusText, !status && statusText || (statusText = "error", status < 0 && (status = 0))), 
                // Set data for the fake xhr object
                jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", 
                // Success/Error
                isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]), 
                // Status-dependent callbacks
                jqXHR.statusCode(statusCode), statusCode = void 0, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [ jqXHR, s, isSuccess ? success : error ]), 
                // Complete
                completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]), 
                // Handle the global AJAX counter
                --jQuery.active || jQuery.event.trigger("ajaxStop")));
            }
            // If url is an object, simulate pre-1.5 signature
            "object" == typeof url && (options = url, url = void 0), // Force options to be an object
            options = options || {};
            var transport, // URL without anti-cache param
            cacheURL, // Response headers
            responseHeadersString, responseHeaders, // timeout handle
            timeoutTimer, // Cross-domain detection vars
            parts, // To know if global events are to be dispatched
            fireGlobals, // Loop variable
            i, // Create the final options object
            s = jQuery.ajaxSetup({}, options), // Callbacks context
            callbackContext = s.context || s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, // Deferreds
            deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), // Status-dependent callbacks
            statusCode = s.statusCode || {}, // Headers (they are sent all at once)
            requestHeaders = {}, requestHeadersNames = {}, // The jqXHR state
            state = 0, // Default abort message
            strAbort = "canceled", // Fake xhr
            jqXHR = {
                readyState: 0,
                // Builds headers hashtable if needed
                getResponseHeader: function(key) {
                    var match;
                    if (2 === state) {
                        if (!responseHeaders) for (responseHeaders = {}; match = rheaders.exec(responseHeadersString); ) responseHeaders[match[1].toLowerCase()] = match[2];
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return null == match ? null : match;
                },
                // Raw string
                getAllResponseHeaders: function() {
                    return 2 === state ? responseHeadersString : null;
                },
                // Caches the header
                setRequestHeader: function(name, value) {
                    var lname = name.toLowerCase();
                    return state || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, 
                    requestHeaders[name] = value), this;
                },
                // Overrides response content-type header
                overrideMimeType: function(type) {
                    return state || (s.mimeType = type), this;
                },
                // Status-dependent callbacks
                statusCode: function(map) {
                    var code;
                    if (map) if (state < 2) for (code in map) // Lazy-add the new callback in a way that preserves old ones
                    statusCode[code] = [ statusCode[code], map[code] ]; else // Execute the appropriate callbacks
                    jqXHR.always(map[jqXHR.status]);
                    return this;
                },
                // Cancel the request
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    return transport && transport.abort(finalText), done(0, finalText), this;
                }
            };
            // If request was aborted inside a prefilter, stop there
            if (// Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, 
            jqXHR.error = jqXHR.fail, // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (prefilters might expect it)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), 
            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type, // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [ "" ], 
            // A cross-domain request is in order when we have a protocol:host:port mismatch
            null == s.crossDomain && (parts = rurl.exec(s.url.toLowerCase()), s.crossDomain = !(!parts || parts[1] === ajaxLocParts[1] && parts[2] === ajaxLocParts[2] && (parts[3] || ("http:" === parts[1] ? "80" : "443")) === (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? "80" : "443")))), 
            // Convert data if not already a string
            s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), 
            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state) return jqXHR;
            // We can fire global events as of now if asked to
            fireGlobals = s.global, // Watch for a new set of requests
            fireGlobals && 0 === jQuery.active++ && jQuery.event.trigger("ajaxStart"), // Uppercase the type
            s.type = s.type.toUpperCase(), // Determine if request has content
            s.hasContent = !rnoContent.test(s.type), // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url, // More options handling for requests with no content
            s.hasContent || (// If data is available, append data to url
            s.data && (cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data, // #9682: remove data so that it's not used in an eventual retry
            delete s.data), // Add anti-cache in url if needed
            s.cache === !1 && (s.url = rts.test(cacheURL) ? // If there is already a '_' parameter, set its value
            cacheURL.replace(rts, "$1_=" + nonce++) : // Otherwise add one to the end
            cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++)), // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), 
            jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), 
            // Set the correct header, if data is being sent
            (s.data && s.hasContent && s.contentType !== !1 || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), 
            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            // Check for headers option
            for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === !1 || 2 === state)) // Abort if not done already and return
            return jqXHR.abort();
            // aborting is no longer a cancellation
            strAbort = "abort";
            // Install callbacks on deferreds
            for (i in {
                success: 1,
                error: 1,
                complete: 1
            }) jqXHR[i](s[i]);
            // If no transport, we auto-abort
            if (// Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
                jqXHR.readyState = 1, // Send global event
                fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]), // Timeout
                s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
                    jqXHR.abort("timeout");
                }, s.timeout));
                try {
                    state = 1, transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (!(state < 2)) throw e;
                    done(-1, e);
                }
            } else done(-1, "No Transport");
            return jqXHR;
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
        }
    }), jQuery.each([ "get", "post" ], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            // shift arguments if data argument was omitted
            return jQuery.isFunction(data) && (type = type || callback, callback = data, data = void 0), 
            jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    }), // Attach a bunch of functions for handling common AJAX events
    jQuery.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(i, type) {
        jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
        };
    }), jQuery._evalUrl = function(url) {
        return jQuery.ajax({
            url: url,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        });
    }, jQuery.fn.extend({
        wrapAll: function(html) {
            var wrap;
            // The elements to wrap the target around
            return jQuery.isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapAll(html.call(this, i));
            }) : (this[0] && (wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && wrap.insertBefore(this[0]), 
            wrap.map(function() {
                for (var elem = this; elem.firstElementChild; ) elem = elem.firstElementChild;
                return elem;
            }).append(this)), this);
        },
        wrapInner: function(html) {
            return jQuery.isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
            }) : this.each(function() {
                var self = jQuery(this), contents = self.contents();
                contents.length ? contents.wrapAll(html) : self.append(html);
            });
        },
        wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
            }).end();
        }
    }), jQuery.expr.filters.hidden = function(elem) {
        // Support: Opera <= 12.12
        // Opera reports offsetWidths and offsetHeights less than zero on some elements
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
    }, jQuery.expr.filters.visible = function(elem) {
        return !jQuery.expr.filters.hidden(elem);
    };
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, value) {
            // If value is a function, invoke it and return its value
            value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        // If an array was passed in, assume that it is an array of form elements.
        if (// Set traditional to true for jQuery <= 1.3.2 behavior.
        void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), 
        jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) // Serialize the form elements
        jQuery.each(a, function() {
            add(this.name, this.value);
        }); else // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    }, jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
                var type = this.type;
                // Use .is( ":disabled" ) so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    }), jQuery.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest();
        } catch (e) {}
    };
    var xhrId = 0, xhrCallbacks = {}, xhrSuccessStatus = {
        // file protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    }, xhrSupported = jQuery.ajaxSettings.xhr();
    // Support: IE9
    // Open requests must be manually aborted on unload (#5280)
    window.ActiveXObject && jQuery(window).on("unload", function() {
        for (var key in xhrCallbacks) xhrCallbacks[key]();
    }), support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, 
    jQuery.ajaxTransport(function(options) {
        var callback;
        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) return {
            send: function(headers, complete) {
                var i, xhr = options.xhr(), id = ++xhrId;
                // Apply custom fields if provided
                if (xhr.open(options.type, options.url, options.async, options.username, options.password), 
                options.xhrFields) for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
                // Override mime type if needed
                options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), 
                // X-Requested-With header
                // For cross-domain requests, seeing as conditions for a preflight are
                // akin to a jigsaw puzzle, we simply never set it to be sure.
                // (it can always be set on a per-request basis or even using ajaxSetup)
                // For same-domain requests, won't change header if already provided.
                options.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
                // Set headers
                for (i in headers) xhr.setRequestHeader(i, headers[i]);
                // Callback
                callback = function(type) {
                    return function() {
                        callback && (delete xhrCallbacks[id], callback = xhr.onload = xhr.onerror = null, 
                        "abort" === type ? xhr.abort() : "error" === type ? complete(// file: protocol always yields status 0; see #8605, #14207
                        xhr.status, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, // Support: IE9
                        // Accessing binary-data responseText throws an exception
                        // (#11426)
                        "string" == typeof xhr.responseText ? {
                            text: xhr.responseText
                        } : void 0, xhr.getAllResponseHeaders()));
                    };
                }, // Listen to events
                xhr.onload = callback(), xhr.onerror = callback("error"), // Create the abort callback
                callback = xhrCallbacks[id] = callback("abort");
                try {
                    // Do send the request (this may raise an exception)
                    xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                    // #14683: Only rethrow if this hasn't been notified as an error yet
                    if (callback) throw e;
                }
            },
            abort: function() {
                callback && callback();
            }
        };
    }), // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(text) {
                return jQuery.globalEval(text), text;
            }
        }
    }), // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter("script", function(s) {
        void 0 === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET");
    }), // Bind script tag hack transport
    jQuery.ajaxTransport("script", function(s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script, callback;
            return {
                send: function(_, complete) {
                    script = jQuery("<script>").prop({
                        async: !0,
                        charset: s.scriptCharset,
                        src: s.url
                    }).on("load error", callback = function(evt) {
                        script.remove(), callback = null, evt && complete("error" === evt.type ? 404 : 200, evt.type);
                    }), document.head.appendChild(script[0]);
                },
                abort: function() {
                    callback && callback();
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
            return this[callback] = !0, callback;
        }
    }), // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== !1 && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || "jsonp" === s.dataTypes[0]) // Delegate to script
        // Get callback name, remembering preexisting value associated with it
        // Insert callback into url or form data
        // Use data converter to retrieve json after script execution
        // force json dataType
        // Install callback
        // Clean-up function (fires after converters)
        return callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, 
        jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== !1 && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), 
        s.converters["script json"] = function() {
            return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
        }, s.dataTypes[0] = "json", overwritten = window[callbackName], window[callbackName] = function() {
            responseContainer = arguments;
        }, jqXHR.always(function() {
            // Restore preexisting value
            window[callbackName] = overwritten, // Save back as free
            s[callbackName] && (// make sure that re-using the options doesn't screw things around
            s.jsonpCallback = originalSettings.jsonpCallback, // save the callback name for future use
            oldCallbacks.push(callbackName)), // Call if it was a function and we have a response
            responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), 
            responseContainer = overwritten = void 0;
        }), "script";
    }), // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function(data, context, keepScripts) {
        if (!data || "string" != typeof data) return null;
        "boolean" == typeof context && (keepScripts = context, context = !1), context = context || document;
        var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
        // Single tag
        // Single tag
        return parsed ? [ context.createElement(parsed[1]) ] : (parsed = jQuery.buildFragment([ data ], context, scripts), 
        scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
    };
    // Keep a copy of the old load method
    var _load = jQuery.fn.load;
    /**
 * Load a url into a page
 */
    jQuery.fn.load = function(url, params, callback) {
        if ("string" != typeof url && _load) return _load.apply(this, arguments);
        var selector, type, response, self = this, off = url.indexOf(" ");
        // If it's a function
        // We assume that it's the callback
        // If we have elements to modify, make the request
        return off >= 0 && (selector = jQuery.trim(url.slice(off)), url = url.slice(0, off)), 
        jQuery.isFunction(params) ? (callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), 
        self.length > 0 && jQuery.ajax({
            url: url,
            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params
        }).done(function(responseText) {
            // Save response for use in complete callback
            response = arguments, self.html(selector ? // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : // Otherwise use the full result
            responseText);
        }).complete(callback && function(jqXHR, status) {
            self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
        }), this;
    }, jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    };
    var docElem = window.document.documentElement;
    jQuery.offset = {
        setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            // Set position first, in-case top/left are set even on static elem
            "static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), 
            curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1, 
            // Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, 
            curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), 
            jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), 
            null != options.left && (props.left = options.left - curOffset.left + curLeft), 
            "using" in options ? options.using.call(elem, props) : curElem.css(props);
        }
    }, jQuery.fn.extend({
        offset: function(options) {
            if (arguments.length) return void 0 === options ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
            });
            var docElem, win, elem = this[0], box = {
                top: 0,
                left: 0
            }, doc = elem && elem.ownerDocument;
            if (doc) // Make sure it's not a disconnected DOM node
            // Make sure it's not a disconnected DOM node
            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            return docElem = doc.documentElement, jQuery.contains(docElem, elem) ? (typeof elem.getBoundingClientRect !== strundefined && (box = elem.getBoundingClientRect()), 
            win = getWindow(doc), {
                top: box.top + win.pageYOffset - docElem.clientTop,
                left: box.left + win.pageXOffset - docElem.clientLeft
            }) : box;
        },
        position: function() {
            if (this[0]) {
                var offsetParent, offset, elem = this[0], parentOffset = {
                    top: 0,
                    left: 0
                };
                // Subtract parent offsets and element margins
                // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
                // We assume that getBoundingClientRect is available when computed position is fixed
                // Get *real* offsetParent
                // Get correct offsets
                // Add offsetParent borders
                return "fixed" === jQuery.css(elem, "position") ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), 
                offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), 
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), 
                {
                    top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                    left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                };
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var offsetParent = this.offsetParent || docElem; offsetParent && !jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"); ) offsetParent = offsetParent.offsetParent;
                return offsetParent || docElem;
            });
        }
    }), // Create scrollLeft and scrollTop methods
    jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
            return access(this, function(elem, method, val) {
                var win = getWindow(elem);
                return void 0 === val ? win ? win[prop] : elem[method] : void (win ? win.scrollTo(top ? window.pageXOffset : val, top ? val : window.pageYOffset) : elem[method] = val);
            }, method, val, arguments.length, null);
        };
    }), // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // getComputedStyle returns percent when specified for top/left/bottom/right
    // rather than make the css module depend on the offset module, we just check for it here
    jQuery.each([ "top", "left" ], function(i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
            if (computed) // if curCSS returns percentage, fallback to offset
            return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
        });
    }), // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type) {
        jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
                return access(this, function(elem, type, value) {
                    var doc;
                    // Get document width or height
                    // Get width or height on the element, requesting but not forcing parseFloat
                    // Set width or height on the element
                    return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, 
                    Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : void 0, chainable, null);
            };
        });
    }), // The number of elements contained in the matched element set
    jQuery.fn.size = function() {
        return this.length;
    }, jQuery.fn.andSelf = jQuery.fn.addBack, // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    // Note that for maximum portability, libraries that are not jQuery should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jQuery is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return jQuery;
    });
    var // Map over jQuery in case of overwrite
    _jQuery = window.jQuery, // Map over the $ in case of overwrite
    _$ = window.$;
    // Expose jQuery and $ identifiers, even in
    // AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    return jQuery.noConflict = function(deep) {
        return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), 
        jQuery;
    }, typeof noGlobal === strundefined && (window.jQuery = window.$ = jQuery), jQuery;
}), /*
 AngularJS v1.2.15
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
function(Q, T, s) {
    "use strict";
    function z(b) {
        return function() {
            var c, a = arguments[0], a = "[" + (b ? b + ":" : "") + a + "] http://errors.angularjs.org/1.2.15/" + (b ? b + "/" : "") + a;
            for (c = 1; c < arguments.length; c++) a = a + (1 == c ? "?" : "&") + "p" + (c - 1) + "=" + encodeURIComponent("function" == typeof arguments[c] ? arguments[c].toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof arguments[c] ? "undefined" : "string" != typeof arguments[c] ? JSON.stringify(arguments[c]) : arguments[c]);
            return Error(a);
        };
    }
    function $a(b) {
        if (null == b || Aa(b)) return !1;
        var a = b.length;
        return !(1 !== b.nodeType || !a) || (x(b) || M(b) || 0 === a || "number" == typeof a && 0 < a && a - 1 in b);
    }
    function r(b, a, c) {
        var d;
        if (b) if (D(b)) for (d in b) "prototype" == d || "length" == d || "name" == d || b.hasOwnProperty && !b.hasOwnProperty(d) || a.call(c, b[d], d); else if (b.forEach && b.forEach !== r) b.forEach(a, c); else if ($a(b)) for (d = 0; d < b.length; d++) a.call(c, b[d], d); else for (d in b) b.hasOwnProperty(d) && a.call(c, b[d], d);
        return b;
    }
    function Ob(b) {
        var c, a = [];
        for (c in b) b.hasOwnProperty(c) && a.push(c);
        return a.sort();
    }
    function Qc(b, a, c) {
        for (var d = Ob(b), e = 0; e < d.length; e++) a.call(c, b[d[e]], d[e]);
        return d;
    }
    function Pb(b) {
        return function(a, c) {
            b(c, a);
        };
    }
    function ab() {
        for (var a, b = ia.length; b; ) {
            if (b--, a = ia[b].charCodeAt(0), 57 == a) return ia[b] = "A", ia.join("");
            if (90 != a) return ia[b] = String.fromCharCode(a + 1), ia.join("");
            ia[b] = "0";
        }
        return ia.unshift("0"), ia.join("");
    }
    function Qb(b, a) {
        a ? b.$$hashKey = a : delete b.$$hashKey;
    }
    function v(b) {
        var a = b.$$hashKey;
        return r(arguments, function(a) {
            a !== b && r(a, function(a, c) {
                b[c] = a;
            });
        }), Qb(b, a), b;
    }
    function R(b) {
        return parseInt(b, 10);
    }
    function Rb(b, a) {
        return v(new (v(function() {}, {
            prototype: b
        }))(), a);
    }
    function B() {}
    function Ba(b) {
        return b;
    }
    function Y(b) {
        return function() {
            return b;
        };
    }
    function E(b) {
        return "undefined" == typeof b;
    }
    function u(b) {
        return "undefined" != typeof b;
    }
    function W(b) {
        return null != b && "object" == typeof b;
    }
    function x(b) {
        return "string" == typeof b;
    }
    function ub(b) {
        return "number" == typeof b;
    }
    function Ma(b) {
        return "[object Date]" === ta.call(b);
    }
    function M(b) {
        return "[object Array]" === ta.call(b);
    }
    function D(b) {
        return "function" == typeof b;
    }
    function bb(b) {
        return "[object RegExp]" === ta.call(b);
    }
    function Aa(b) {
        return b && b.document && b.location && b.alert && b.setInterval;
    }
    function Rc(b) {
        return !(!b || !(b.nodeName || b.prop && b.attr && b.find));
    }
    function Sc(b, a, c) {
        var d = [];
        return r(b, function(b, f, g) {
            d.push(a.call(c, b, f, g));
        }), d;
    }
    function cb(b, a) {
        if (b.indexOf) return b.indexOf(a);
        for (var c = 0; c < b.length; c++) if (a === b[c]) return c;
        return -1;
    }
    function Na(b, a) {
        var c = cb(b, a);
        return 0 <= c && b.splice(c, 1), a;
    }
    function $(b, a) {
        if (Aa(b) || b && b.$evalAsync && b.$watch) throw Oa("cpws");
        if (a) {
            if (b === a) throw Oa("cpi");
            if (M(b)) for (var c = a.length = 0; c < b.length; c++) a.push($(b[c])); else {
                c = a.$$hashKey, r(a, function(b, c) {
                    delete a[c];
                });
                for (var d in b) a[d] = $(b[d]);
                Qb(a, c);
            }
        } else (a = b) && (M(b) ? a = $(b, []) : Ma(b) ? a = new Date(b.getTime()) : bb(b) ? a = RegExp(b.source) : W(b) && (a = $(b, {})));
        return a;
    }
    function Sb(b, a) {
        a = a || {};
        for (var c in b) !b.hasOwnProperty(c) || "$" === c.charAt(0) && "$" === c.charAt(1) || (a[c] = b[c]);
        return a;
    }
    function ua(b, a) {
        if (b === a) return !0;
        if (null === b || null === a) return !1;
        if (b !== b && a !== a) return !0;
        var d, c = typeof b;
        if (c == typeof a && "object" == c) {
            if (!M(b)) {
                if (Ma(b)) return Ma(a) && b.getTime() == a.getTime();
                if (bb(b) && bb(a)) return b.toString() == a.toString();
                if (b && b.$evalAsync && b.$watch || a && a.$evalAsync && a.$watch || Aa(b) || Aa(a) || M(a)) return !1;
                c = {};
                for (d in b) if ("$" !== d.charAt(0) && !D(b[d])) {
                    if (!ua(b[d], a[d])) return !1;
                    c[d] = !0;
                }
                for (d in a) if (!c.hasOwnProperty(d) && "$" !== d.charAt(0) && a[d] !== s && !D(a[d])) return !1;
                return !0;
            }
            if (!M(a)) return !1;
            if ((c = b.length) == a.length) {
                for (d = 0; d < c; d++) if (!ua(b[d], a[d])) return !1;
                return !0;
            }
        }
        return !1;
    }
    function Tb() {
        return T.securityPolicy && T.securityPolicy.isActive || T.querySelector && !(!T.querySelector("[ng-csp]") && !T.querySelector("[data-ng-csp]"));
    }
    function db(b, a) {
        var c = 2 < arguments.length ? va.call(arguments, 2) : [];
        return !D(a) || a instanceof RegExp ? a : c.length ? function() {
            return arguments.length ? a.apply(b, c.concat(va.call(arguments, 0))) : a.apply(b, c);
        } : function() {
            return arguments.length ? a.apply(b, arguments) : a.call(b);
        };
    }
    function Tc(b, a) {
        var c = a;
        return "string" == typeof b && "$" === b.charAt(0) ? c = s : Aa(a) ? c = "$WINDOW" : a && T === a ? c = "$DOCUMENT" : a && a.$evalAsync && a.$watch && (c = "$SCOPE"), 
        c;
    }
    function oa(b, a) {
        return "undefined" == typeof b ? s : JSON.stringify(b, Tc, a ? "  " : null);
    }
    function Ub(b) {
        return x(b) ? JSON.parse(b) : b;
    }
    function Pa(b) {
        return "function" == typeof b ? b = !0 : b && 0 !== b.length ? (b = O("" + b), b = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)) : b = !1, 
        b;
    }
    function fa(b) {
        b = w(b).clone();
        try {
            b.empty();
        } catch (a) {}
        var c = w("<div>").append(b).html();
        try {
            return 3 === b[0].nodeType ? O(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(a, b) {
                return "<" + O(b);
            });
        } catch (d) {
            return O(c);
        }
    }
    function Vb(b) {
        try {
            return decodeURIComponent(b);
        } catch (a) {}
    }
    function Wb(b) {
        var c, d, a = {};
        return r((b || "").split("&"), function(b) {
            b && (c = b.split("="), d = Vb(c[0]), u(d) && (b = !u(c[1]) || Vb(c[1]), a[d] ? M(a[d]) ? a[d].push(b) : a[d] = [ a[d], b ] : a[d] = b));
        }), a;
    }
    function Xb(b) {
        var a = [];
        return r(b, function(b, d) {
            M(b) ? r(b, function(b) {
                a.push(wa(d, !0) + (!0 === b ? "" : "=" + wa(b, !0)));
            }) : a.push(wa(d, !0) + (!0 === b ? "" : "=" + wa(b, !0)));
        }), a.length ? a.join("&") : "";
    }
    function vb(b) {
        return wa(b, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
    }
    function wa(b, a) {
        return encodeURIComponent(b).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, a ? "%20" : "+");
    }
    function Uc(b, a) {
        function c(a) {
            a && d.push(a);
        }
        var e, f, d = [ b ], g = [ "ng:app", "ng-app", "x-ng-app", "data-ng-app" ], h = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
        r(g, function(a) {
            g[a] = !0, c(T.getElementById(a)), a = a.replace(":", "\\:"), b.querySelectorAll && (r(b.querySelectorAll("." + a), c), 
            r(b.querySelectorAll("." + a + "\\:"), c), r(b.querySelectorAll("[" + a + "]"), c));
        }), r(d, function(a) {
            if (!e) {
                var b = h.exec(" " + a.className + " ");
                b ? (e = a, f = (b[2] || "").replace(/\s+/g, ",")) : r(a.attributes, function(b) {
                    !e && g[b.name] && (e = a, f = b.value);
                });
            }
        }), e && a(e, f ? [ f ] : []);
    }
    function Yb(b, a) {
        var c = function() {
            if (b = w(b), b.injector()) {
                var c = b[0] === T ? "document" : fa(b);
                throw Oa("btstrpd", c);
            }
            return a = a || [], a.unshift([ "$provide", function(a) {
                a.value("$rootElement", b);
            } ]), a.unshift("ng"), c = Zb(a), c.invoke([ "$rootScope", "$rootElement", "$compile", "$injector", "$animate", function(a, b, c, d, e) {
                a.$apply(function() {
                    b.data("$injector", d), c(b)(a);
                });
            } ]), c;
        }, d = /^NG_DEFER_BOOTSTRAP!/;
        return Q && !d.test(Q.name) ? c() : (Q.name = Q.name.replace(d, ""), void (Ca.resumeBootstrap = function(b) {
            r(b, function(b) {
                a.push(b);
            }), c();
        }));
    }
    function eb(b, a) {
        return a = a || "_", b.replace(Vc, function(b, d) {
            return (d ? a : "") + b.toLowerCase();
        });
    }
    function wb(b, a, c) {
        if (!b) throw Oa("areq", a || "?", c || "required");
        return b;
    }
    function Qa(b, a, c) {
        return c && M(b) && (b = b[b.length - 1]), wb(D(b), a, "not a function, got " + (b && "object" == typeof b ? b.constructor.name || "Object" : typeof b)), 
        b;
    }
    function xa(b, a) {
        if ("hasOwnProperty" === b) throw Oa("badname", a);
    }
    function $b(b, a, c) {
        if (!a) return b;
        a = a.split(".");
        for (var d, e = b, f = a.length, g = 0; g < f; g++) d = a[g], b && (b = (e = b)[d]);
        return !c && D(b) ? db(e, b) : b;
    }
    function xb(b) {
        var a = b[0];
        if (b = b[b.length - 1], a === b) return w(a);
        var c = [ a ];
        do {
            if (a = a.nextSibling, !a) break;
            c.push(a);
        } while (a !== b);
        return w(c);
    }
    function Wc(b) {
        var a = z("$injector"), c = z("ng");
        return b = b.angular || (b.angular = {}), b.$$minErr = b.$$minErr || z, b.module || (b.module = function() {
            var b = {};
            return function(e, f, g) {
                if ("hasOwnProperty" === e) throw c("badname", "module");
                return f && b.hasOwnProperty(e) && (b[e] = null), b[e] || (b[e] = function() {
                    function b(a, d, e) {
                        return function() {
                            return c[e || "push"]([ a, d, arguments ]), n;
                        };
                    }
                    if (!f) throw a("nomod", e);
                    var c = [], d = [], l = b("$injector", "invoke"), n = {
                        _invokeQueue: c,
                        _runBlocks: d,
                        requires: f,
                        name: e,
                        provider: b("$provide", "provider"),
                        factory: b("$provide", "factory"),
                        service: b("$provide", "service"),
                        value: b("$provide", "value"),
                        constant: b("$provide", "constant", "unshift"),
                        animation: b("$animateProvider", "register"),
                        filter: b("$filterProvider", "register"),
                        controller: b("$controllerProvider", "register"),
                        directive: b("$compileProvider", "directive"),
                        config: l,
                        run: function(a) {
                            return d.push(a), this;
                        }
                    };
                    return g && l(g), n;
                }());
            };
        }());
    }
    function Xc(b) {
        v(b, {
            bootstrap: Yb,
            copy: $,
            extend: v,
            equals: ua,
            element: w,
            forEach: r,
            injector: Zb,
            noop: B,
            bind: db,
            toJson: oa,
            fromJson: Ub,
            identity: Ba,
            isUndefined: E,
            isDefined: u,
            isString: x,
            isFunction: D,
            isObject: W,
            isNumber: ub,
            isElement: Rc,
            isArray: M,
            version: Yc,
            isDate: Ma,
            lowercase: O,
            uppercase: Da,
            callbacks: {
                counter: 0
            },
            $$minErr: z,
            $$csp: Tb
        }), Ra = Wc(Q);
        try {
            Ra("ngLocale");
        } catch (a) {
            Ra("ngLocale", []).provider("$locale", Zc);
        }
        Ra("ng", [ "ngLocale" ], [ "$provide", function(a) {
            a.provider({
                $$sanitizeUri: $c
            }), a.provider("$compile", ac).directive({
                a: ad,
                input: bc,
                textarea: bc,
                form: bd,
                script: cd,
                select: dd,
                style: ed,
                option: fd,
                ngBind: gd,
                ngBindHtml: hd,
                ngBindTemplate: id,
                ngClass: jd,
                ngClassEven: kd,
                ngClassOdd: ld,
                ngCloak: md,
                ngController: nd,
                ngForm: od,
                ngHide: pd,
                ngIf: qd,
                ngInclude: rd,
                ngInit: sd,
                ngNonBindable: td,
                ngPluralize: ud,
                ngRepeat: vd,
                ngShow: wd,
                ngStyle: xd,
                ngSwitch: yd,
                ngSwitchWhen: zd,
                ngSwitchDefault: Ad,
                ngOptions: Bd,
                ngTransclude: Cd,
                ngModel: Dd,
                ngList: Ed,
                ngChange: Fd,
                required: cc,
                ngRequired: cc,
                ngValue: Gd
            }).directive({
                ngInclude: Hd
            }).directive(yb).directive(dc), a.provider({
                $anchorScroll: Id,
                $animate: Jd,
                $browser: Kd,
                $cacheFactory: Ld,
                $controller: Md,
                $document: Nd,
                $exceptionHandler: Od,
                $filter: ec,
                $interpolate: Pd,
                $interval: Qd,
                $http: Rd,
                $httpBackend: Sd,
                $location: Td,
                $log: Ud,
                $parse: Vd,
                $rootScope: Wd,
                $q: Xd,
                $sce: Yd,
                $sceDelegate: Zd,
                $sniffer: $d,
                $templateCache: ae,
                $timeout: be,
                $window: ce,
                $$rAF: de,
                $$asyncCallback: ee
            });
        } ]);
    }
    function Sa(b) {
        return b.replace(fe, function(a, b, d, e) {
            return e ? d.toUpperCase() : d;
        }).replace(ge, "Moz$1");
    }
    function zb(b, a, c, d) {
        function e(b) {
            var k, l, n, q, p, t, e = c && b ? [ this.filter(b) ] : [ this ], m = a;
            if (!d || null != b) for (;e.length; ) for (k = e.shift(), l = 0, n = k.length; l < n; l++) for (q = w(k[l]), 
            m ? q.triggerHandler("$destroy") : m = !m, p = 0, q = (t = q.children()).length; p < q; p++) e.push(Ea(t[p]));
            return f.apply(this, arguments);
        }
        var f = Ea.fn[b], f = f.$original || f;
        e.$original = f, Ea.fn[b] = e;
    }
    function L(b) {
        if (b instanceof L) return b;
        if (x(b) && (b = aa(b)), !(this instanceof L)) {
            if (x(b) && "<" != b.charAt(0)) throw Ab("nosel");
            return new L(b);
        }
        if (x(b)) {
            var a = T.createElement("div");
            a.innerHTML = "<div>&#160;</div>" + b, a.removeChild(a.firstChild), Bb(this, a.childNodes), 
            w(T.createDocumentFragment()).append(this);
        } else Bb(this, b);
    }
    function Cb(b) {
        return b.cloneNode(!0);
    }
    function Fa(b) {
        fc(b);
        var a = 0;
        for (b = b.childNodes || []; a < b.length; a++) Fa(b[a]);
    }
    function gc(b, a, c, d) {
        if (u(d)) throw Ab("offargs");
        var e = ja(b, "events");
        ja(b, "handle") && (E(a) ? r(e, function(a, c) {
            Db(b, c, a), delete e[c];
        }) : r(a.split(" "), function(a) {
            E(c) ? (Db(b, a, e[a]), delete e[a]) : Na(e[a] || [], c);
        }));
    }
    function fc(b, a) {
        var c = b[fb], d = Ta[c];
        d && (a ? delete Ta[c].data[a] : (d.handle && (d.events.$destroy && d.handle({}, "$destroy"), 
        gc(b)), delete Ta[c], b[fb] = s));
    }
    function ja(b, a, c) {
        var d = b[fb], d = Ta[d || -1];
        return u(c) ? (d || (b[fb] = d = ++he, d = Ta[d] = {}), void (d[a] = c)) : d && d[a];
    }
    function hc(b, a, c) {
        var d = ja(b, "data"), e = u(c), f = !e && u(a), g = f && !W(a);
        if (d || g || ja(b, "data", d = {}), e) d[a] = c; else {
            if (!f) return d;
            if (g) return d && d[a];
            v(d, a);
        }
    }
    function Eb(b, a) {
        return !!b.getAttribute && -1 < (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + a + " ");
    }
    function gb(b, a) {
        a && b.setAttribute && r(a.split(" "), function(a) {
            b.setAttribute("class", aa((" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + aa(a) + " ", " ")));
        });
    }
    function hb(b, a) {
        if (a && b.setAttribute) {
            var c = (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            r(a.split(" "), function(a) {
                a = aa(a), -1 === c.indexOf(" " + a + " ") && (c += a + " ");
            }), b.setAttribute("class", aa(c));
        }
    }
    function Bb(b, a) {
        if (a) {
            a = a.nodeName || !u(a.length) || Aa(a) ? [ a ] : a;
            for (var c = 0; c < a.length; c++) b.push(a[c]);
        }
    }
    function ic(b, a) {
        return ib(b, "$" + (a || "ngController") + "Controller");
    }
    function ib(b, a, c) {
        for (b = w(b), 9 == b[0].nodeType && (b = b.find("html")), a = M(a) ? a : [ a ]; b.length; ) {
            for (var d = b[0], e = 0, f = a.length; e < f; e++) if ((c = b.data(a[e])) !== s) return c;
            b = w(d.parentNode || 11 === d.nodeType && d.host);
        }
    }
    function jc(b) {
        for (var a = 0, c = b.childNodes; a < c.length; a++) Fa(c[a]);
        for (;b.firstChild; ) b.removeChild(b.firstChild);
    }
    function kc(b, a) {
        var c = jb[a.toLowerCase()];
        return c && lc[b.nodeName] && c;
    }
    function ie(b, a) {
        var c = function(c, e) {
            if (c.preventDefault || (c.preventDefault = function() {
                c.returnValue = !1;
            }), c.stopPropagation || (c.stopPropagation = function() {
                c.cancelBubble = !0;
            }), c.target || (c.target = c.srcElement || T), E(c.defaultPrevented)) {
                var f = c.preventDefault;
                c.preventDefault = function() {
                    c.defaultPrevented = !0, f.call(c);
                }, c.defaultPrevented = !1;
            }
            c.isDefaultPrevented = function() {
                return c.defaultPrevented || !1 === c.returnValue;
            };
            var g = Sb(a[e || c.type] || []);
            r(g, function(a) {
                a.call(b, c);
            }), 8 >= P ? (c.preventDefault = null, c.stopPropagation = null, c.isDefaultPrevented = null) : (delete c.preventDefault, 
            delete c.stopPropagation, delete c.isDefaultPrevented);
        };
        return c.elem = b, c;
    }
    function Ga(b) {
        var c, a = typeof b;
        return "object" == a && null !== b ? "function" == typeof (c = b.$$hashKey) ? c = b.$$hashKey() : c === s && (c = b.$$hashKey = ab()) : c = b, 
        a + ":" + c;
    }
    function Ua(b) {
        r(b, this.put, this);
    }
    function mc(b) {
        var a, c;
        return "function" == typeof b ? (a = b.$inject) || (a = [], b.length && (c = b.toString().replace(je, ""), 
        c = c.match(ke), r(c[1].split(le), function(b) {
            b.replace(me, function(b, c, d) {
                a.push(d);
            });
        })), b.$inject = a) : M(b) ? (c = b.length - 1, Qa(b[c], "fn"), a = b.slice(0, c)) : Qa(b, "fn", !0), 
        a;
    }
    function Zb(b) {
        function a(a) {
            return function(b, c) {
                return W(b) ? void r(b, Pb(a)) : a(b, c);
            };
        }
        function c(a, b) {
            if (xa(a, "service"), (D(b) || M(b)) && (b = n.instantiate(b)), !b.$get) throw Va("pget", a);
            return l[a + h] = b;
        }
        function d(a, b) {
            return c(a, {
                $get: b
            });
        }
        function e(a) {
            var c, d, f, h, b = [];
            return r(a, function(a) {
                if (!k.get(a)) {
                    k.put(a, !0);
                    try {
                        if (x(a)) for (c = Ra(a), b = b.concat(e(c.requires)).concat(c._runBlocks), d = c._invokeQueue, 
                        f = 0, h = d.length; f < h; f++) {
                            var g = d[f], m = n.get(g[0]);
                            m[g[1]].apply(m, g[2]);
                        } else D(a) ? b.push(n.invoke(a)) : M(a) ? b.push(n.invoke(a)) : Qa(a, "module");
                    } catch (l) {
                        throw M(a) && (a = a[a.length - 1]), l.message && l.stack && -1 == l.stack.indexOf(l.message) && (l = l.message + "\n" + l.stack), 
                        Va("modulerr", a, l.stack || l.message || l);
                    }
                }
            }), b;
        }
        function f(a, b) {
            function c(d) {
                if (a.hasOwnProperty(d)) {
                    if (a[d] === g) throw Va("cdep", m.join(" <- "));
                    return a[d];
                }
                try {
                    return m.unshift(d), a[d] = g, a[d] = b(d);
                } catch (e) {
                    throw a[d] === g && delete a[d], e;
                } finally {
                    m.shift();
                }
            }
            function d(a, b, e) {
                var g, k, m, f = [], h = mc(a);
                for (k = 0, g = h.length; k < g; k++) {
                    if (m = h[k], "string" != typeof m) throw Va("itkn", m);
                    f.push(e && e.hasOwnProperty(m) ? e[m] : c(m));
                }
                return a.$inject || (a = a[g]), a.apply(b, f);
            }
            return {
                invoke: d,
                instantiate: function(a, b) {
                    var e, c = function() {};
                    return c.prototype = (M(a) ? a[a.length - 1] : a).prototype, c = new c(), e = d(a, c, b), 
                    W(e) || D(e) ? e : c;
                },
                get: c,
                annotate: mc,
                has: function(b) {
                    return l.hasOwnProperty(b + h) || a.hasOwnProperty(b);
                }
            };
        }
        var g = {}, h = "Provider", m = [], k = new Ua(), l = {
            $provide: {
                provider: a(c),
                factory: a(d),
                service: a(function(a, b) {
                    return d(a, [ "$injector", function(a) {
                        return a.instantiate(b);
                    } ]);
                }),
                value: a(function(a, b) {
                    return d(a, Y(b));
                }),
                constant: a(function(a, b) {
                    xa(a, "constant"), l[a] = b, q[a] = b;
                }),
                decorator: function(a, b) {
                    var c = n.get(a + h), d = c.$get;
                    c.$get = function() {
                        var a = p.invoke(d, c);
                        return p.invoke(b, null, {
                            $delegate: a
                        });
                    };
                }
            }
        }, n = l.$injector = f(l, function() {
            throw Va("unpr", m.join(" <- "));
        }), q = {}, p = q.$injector = f(q, function(a) {
            return a = n.get(a + h), p.invoke(a.$get, a);
        });
        return r(e(b), function(a) {
            p.invoke(a || B);
        }), p;
    }
    function Id() {
        var b = !0;
        this.disableAutoScrolling = function() {
            b = !1;
        }, this.$get = [ "$window", "$location", "$rootScope", function(a, c, d) {
            function e(a) {
                var b = null;
                return r(a, function(a) {
                    b || "a" !== O(a.nodeName) || (b = a);
                }), b;
            }
            function f() {
                var d, b = c.hash();
                b ? (d = g.getElementById(b)) ? d.scrollIntoView() : (d = e(g.getElementsByName(b))) ? d.scrollIntoView() : "top" === b && a.scrollTo(0, 0) : a.scrollTo(0, 0);
            }
            var g = a.document;
            return b && d.$watch(function() {
                return c.hash();
            }, function() {
                d.$evalAsync(f);
            }), f;
        } ];
    }
    function ee() {
        this.$get = [ "$$rAF", "$timeout", function(b, a) {
            return b.supported ? function(a) {
                return b(a);
            } : function(b) {
                return a(b, 0, !1);
            };
        } ];
    }
    function ne(b, a, c, d) {
        function e(a) {
            try {
                a.apply(null, va.call(arguments, 1));
            } finally {
                if (t--, 0 === t) for (;H.length; ) try {
                    H.pop()();
                } catch (b) {
                    c.error(b);
                }
            }
        }
        function f(a, b) {
            !function kb() {
                r(C, function(a) {
                    a();
                }), A = b(kb, a);
            }();
        }
        function g() {
            y = null, J != h.url() && (J = h.url(), r(ba, function(a) {
                a(h.url());
            }));
        }
        var h = this, m = a[0], k = b.location, l = b.history, n = b.setTimeout, q = b.clearTimeout, p = {};
        h.isMock = !1;
        var t = 0, H = [];
        h.$$completeOutstandingRequest = e, h.$$incOutstandingRequestCount = function() {
            t++;
        }, h.notifyWhenNoOutstandingRequests = function(a) {
            r(C, function(a) {
                a();
            }), 0 === t ? a() : H.push(a);
        };
        var A, C = [];
        h.addPollFn = function(a) {
            return E(A) && f(100, n), C.push(a), a;
        };
        var J = k.href, F = a.find("base"), y = null;
        h.url = function(a, c) {
            return k !== b.location && (k = b.location), l !== b.history && (l = b.history), 
            a ? J != a ? (J = a, d.history ? c ? l.replaceState(null, "", a) : (l.pushState(null, "", a), 
            F.attr("href", F.attr("href"))) : (y = a, c ? k.replace(a) : k.href = a), h) : void 0 : y || k.href.replace(/%27/g, "'");
        };
        var ba = [], S = !1;
        h.onUrlChange = function(a) {
            return S || (d.history && w(b).on("popstate", g), d.hashchange ? w(b).on("hashchange", g) : h.addPollFn(g), 
            S = !0), ba.push(a), a;
        }, h.baseHref = function() {
            var a = F.attr("href");
            return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : "";
        };
        var N = {}, Z = "", U = h.baseHref();
        h.cookies = function(a, b) {
            var d, e, f, h;
            if (!a) {
                if (m.cookie !== Z) for (Z = m.cookie, d = Z.split("; "), N = {}, f = 0; f < d.length; f++) e = d[f], 
                h = e.indexOf("="), 0 < h && (a = unescape(e.substring(0, h)), N[a] === s && (N[a] = unescape(e.substring(h + 1))));
                return N;
            }
            b === s ? m.cookie = escape(a) + "=;path=" + U + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : x(b) && (d = (m.cookie = escape(a) + "=" + escape(b) + ";path=" + U).length + 1, 
            4096 < d && c.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + d + " > 4096 bytes)!"));
        }, h.defer = function(a, b) {
            var c;
            return t++, c = n(function() {
                delete p[c], e(a);
            }, b || 0), p[c] = !0, c;
        }, h.defer.cancel = function(a) {
            return !!p[a] && (delete p[a], q(a), e(B), !0);
        };
    }
    function Kd() {
        this.$get = [ "$window", "$log", "$sniffer", "$document", function(b, a, c, d) {
            return new ne(b, d, a, c);
        } ];
    }
    function Ld() {
        this.$get = function() {
            function b(b, d) {
                function e(a) {
                    a != n && (q ? q == a && (q = a.n) : q = a, f(a.n, a.p), f(a, n), n = a, n.n = null);
                }
                function f(a, b) {
                    a != b && (a && (a.p = b), b && (b.n = a));
                }
                if (b in a) throw z("$cacheFactory")("iid", b);
                var g = 0, h = v({}, d, {
                    id: b
                }), m = {}, k = d && d.capacity || Number.MAX_VALUE, l = {}, n = null, q = null;
                return a[b] = {
                    put: function(a, b) {
                        if (k < Number.MAX_VALUE) {
                            var c = l[a] || (l[a] = {
                                key: a
                            });
                            e(c);
                        }
                        if (!E(b)) return a in m || g++, m[a] = b, g > k && this.remove(q.key), b;
                    },
                    get: function(a) {
                        if (k < Number.MAX_VALUE) {
                            var b = l[a];
                            if (!b) return;
                            e(b);
                        }
                        return m[a];
                    },
                    remove: function(a) {
                        if (k < Number.MAX_VALUE) {
                            var b = l[a];
                            if (!b) return;
                            b == n && (n = b.p), b == q && (q = b.n), f(b.n, b.p), delete l[a];
                        }
                        delete m[a], g--;
                    },
                    removeAll: function() {
                        m = {}, g = 0, l = {}, n = q = null;
                    },
                    destroy: function() {
                        l = h = m = null, delete a[b];
                    },
                    info: function() {
                        return v({}, h, {
                            size: g
                        });
                    }
                };
            }
            var a = {};
            return b.info = function() {
                var b = {};
                return r(a, function(a, e) {
                    b[e] = a.info();
                }), b;
            }, b.get = function(b) {
                return a[b];
            }, b;
        };
    }
    function ae() {
        this.$get = [ "$cacheFactory", function(b) {
            return b("templates");
        } ];
    }
    function ac(b, a) {
        var c = {}, d = "Directive", e = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, f = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, g = /^<\s*(tr|th|td|thead|tbody|tfoot)(\s+[^>]*)?>/i, h = /^(on[a-z]+|formaction)$/;
        this.directive = function k(a, e) {
            return xa(a, "directive"), x(a) ? (wb(e, "directiveFactory"), c.hasOwnProperty(a) || (c[a] = [], 
            b.factory(a + d, [ "$injector", "$exceptionHandler", function(b, d) {
                var e = [];
                return r(c[a], function(c, f) {
                    try {
                        var h = b.invoke(c);
                        D(h) ? h = {
                            compile: Y(h)
                        } : !h.compile && h.link && (h.compile = Y(h.link)), h.priority = h.priority || 0, 
                        h.index = f, h.name = h.name || a, h.require = h.require || h.controller && h.name, 
                        h.restrict = h.restrict || "A", e.push(h);
                    } catch (g) {
                        d(g);
                    }
                }), e;
            } ])), c[a].push(e)) : r(a, Pb(k)), this;
        }, this.aHrefSanitizationWhitelist = function(b) {
            return u(b) ? (a.aHrefSanitizationWhitelist(b), this) : a.aHrefSanitizationWhitelist();
        }, this.imgSrcSanitizationWhitelist = function(b) {
            return u(b) ? (a.imgSrcSanitizationWhitelist(b), this) : a.imgSrcSanitizationWhitelist();
        }, this.$get = [ "$injector", "$interpolate", "$exceptionHandler", "$http", "$templateCache", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function(a, b, n, q, p, t, H, C, A, J, F, y) {
            function ba(a, b, c, d, e) {
                a instanceof w || (a = w(a)), r(a, function(b, c) {
                    3 == b.nodeType && b.nodeValue.match(/\S+/) && (a[c] = w(b).wrap("<span></span>").parent()[0]);
                });
                var f = N(a, b, a, c, d, e);
                return S(a, "ng-scope"), function(b, c, d) {
                    wb(b, "scope");
                    var e = c ? Ha.clone.call(a) : a;
                    r(d, function(a, b) {
                        e.data("$" + b + "Controller", a);
                    }), d = 0;
                    for (var h = e.length; d < h; d++) {
                        var g = e[d].nodeType;
                        1 !== g && 9 !== g || e.eq(d).data("$scope", b);
                    }
                    return c && c(e, b), f && f(b, e, e), e;
                };
            }
            function S(a, b) {
                try {
                    a.addClass(b);
                } catch (c) {}
            }
            function N(a, b, c, d, e, f) {
                function h(a, c, d, e) {
                    var f, k, l, n, p, t, q;
                    f = c.length;
                    var ca = Array(f);
                    for (p = 0; p < f; p++) ca[p] = c[p];
                    for (q = p = 0, t = g.length; p < t; q++) k = ca[q], c = g[p++], f = g[p++], l = w(k), 
                    c ? (c.scope ? (n = a.$new(), l.data("$scope", n)) : n = a, (l = c.transclude) || !e && b ? c(f, n, k, d, Z(a, l || b)) : c(f, n, k, d, e)) : f && f(a, k.childNodes, s, e);
                }
                for (var k, l, n, p, g = [], t = 0; t < a.length; t++) k = new Fb(), l = U(a[t], [], k, 0 === t ? d : s, e), 
                (f = l.length ? Wa(l, a[t], k, b, c, null, [], [], f) : null) && f.scope && S(w(a[t]), "ng-scope"), 
                k = f && f.terminal || !(n = a[t].childNodes) || !n.length ? null : N(n, f ? f.transclude : b), 
                g.push(f, k), p = p || f || k, f = null;
                return p ? h : null;
            }
            function Z(a, b) {
                return function(c, d, e) {
                    var f = !1;
                    return c || (c = a.$new(), f = c.$$transcluded = !0), d = b(c, d, e), f && d.on("$destroy", db(c, c.$destroy)), 
                    d;
                };
            }
            function U(a, b, c, d, h) {
                var k, g = c.$attr;
                switch (a.nodeType) {
                  case 1:
                    u(b, ka(Ia(a).toLowerCase()), "E", d, h);
                    var l, n, p;
                    k = a.attributes;
                    for (var t = 0, q = k && k.length; t < q; t++) {
                        var H = !1, C = !1;
                        if (l = k[t], !P || 8 <= P || l.specified) {
                            n = l.name, p = ka(n), la.test(p) && (n = eb(p.substr(6), "-"));
                            var J = p.replace(/(Start|End)$/, "");
                            p === J + "Start" && (H = n, C = n.substr(0, n.length - 5) + "end", n = n.substr(0, n.length - 6)), 
                            p = ka(n.toLowerCase()), g[p] = n, c[p] = l = aa(l.value), kc(a, p) && (c[p] = !0), 
                            ga(a, b, l, p), u(b, p, "A", d, h, H, C);
                        }
                    }
                    if (a = a.className, x(a) && "" !== a) for (;k = f.exec(a); ) p = ka(k[2]), u(b, p, "C", d, h) && (c[p] = aa(k[3])), 
                    a = a.substr(k.index + k[0].length);
                    break;

                  case 3:
                    L(b, a.nodeValue);
                    break;

                  case 8:
                    try {
                        (k = e.exec(a.nodeValue)) && (p = ka(k[1]), u(b, p, "M", d, h) && (c[p] = aa(k[2])));
                    } catch (y) {}
                }
                return b.sort(z), b;
            }
            function I(a, b, c) {
                var d = [], e = 0;
                if (b && a.hasAttribute && a.hasAttribute(b)) {
                    do {
                        if (!a) throw ha("uterdir", b, c);
                        1 == a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--), d.push(a), 
                        a = a.nextSibling;
                    } while (0 < e);
                } else d.push(a);
                return w(d);
            }
            function ya(a, b, c) {
                return function(d, e, f, h, g) {
                    return e = I(e[0], b, c), a(d, e, f, h, g);
                };
            }
            function Wa(a, c, d, e, f, h, g, k, p) {
                function q(a, b, c, d) {
                    a && (c && (a = ya(a, c, d)), a.require = G.require, (N === G || G.$$isolateScope) && (a = nc(a, {
                        isolateScope: !0
                    })), g.push(a)), b && (c && (b = ya(b, c, d)), b.require = G.require, (N === G || G.$$isolateScope) && (b = nc(b, {
                        isolateScope: !0
                    })), k.push(b));
                }
                function C(a, b, c) {
                    var d, e = "data", f = !1;
                    if (x(a)) {
                        for (;"^" == (d = a.charAt(0)) || "?" == d; ) a = a.substr(1), "^" == d && (e = "inheritedData"), 
                        f = f || "?" == d;
                        if (d = null, c && "data" === e && (d = c[a]), d = d || b[e]("$" + a + "Controller"), 
                        !d && !f) throw ha("ctreq", a, ga);
                    } else M(a) && (d = [], r(a, function(a) {
                        d.push(C(a, b, c));
                    }));
                    return d;
                }
                function J(a, e, f, h, p) {
                    function q(a, b) {
                        var c;
                        return 2 > arguments.length && (b = a, a = s), Ja && (c = ya), p(a, b, c);
                    }
                    var y, ca, A, I, ba, U, u, ya = {};
                    if (y = c === f ? d : Sb(d, new Fb(w(f), d.$attr)), ca = y.$$element, N) {
                        var oe = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
                        h = w(f), U = e.$new(!0), Z && Z === N.$$originalDirective ? h.data("$isolateScope", U) : h.data("$isolateScopeNoTemplate", U), 
                        S(h, "ng-isolate-scope"), r(N.scope, function(a, c) {
                            var g, k, p, n, d = a.match(oe) || [], f = d[3] || c, h = "?" == d[2], d = d[1];
                            switch (U.$$isolateBindings[c] = d + f, d) {
                              case "@":
                                y.$observe(f, function(a) {
                                    U[c] = a;
                                }), y.$$observers[f].$$scope = e, y[f] && (U[c] = b(y[f])(e));
                                break;

                              case "=":
                                if (h && !y[f]) break;
                                k = t(y[f]), n = k.literal ? ua : function(a, b) {
                                    return a === b;
                                }, p = k.assign || function() {
                                    throw g = U[c] = k(e), ha("nonassign", y[f], N.name);
                                }, g = U[c] = k(e), U.$watch(function() {
                                    var a = k(e);
                                    return n(a, U[c]) || (n(a, g) ? p(e, a = U[c]) : U[c] = a), g = a;
                                }, null, k.literal);
                                break;

                              case "&":
                                k = t(y[f]), U[c] = function(a) {
                                    return k(e, a);
                                };
                                break;

                              default:
                                throw ha("iscp", N.name, c, a);
                            }
                        });
                    }
                    for (u = p && q, F && r(F, function(a) {
                        var c, b = {
                            $scope: a === N || a.$$isolateScope ? U : e,
                            $element: ca,
                            $attrs: y,
                            $transclude: u
                        };
                        ba = a.controller, "@" == ba && (ba = y[a.name]), c = H(ba, b), ya[a.name] = c, 
                        Ja || ca.data("$" + a.name + "Controller", c), a.controllerAs && (b.$scope[a.controllerAs] = c);
                    }), h = 0, A = g.length; h < A; h++) try {
                        (I = g[h])(I.isolateScope ? U : e, ca, y, I.require && C(I.require, ca, ya), u);
                    } catch (v) {
                        n(v, fa(ca));
                    }
                    for (h = e, N && (N.template || null === N.templateUrl) && (h = U), a && a(h, f.childNodes, s, p), 
                    h = k.length - 1; 0 <= h; h--) try {
                        (I = k[h])(I.isolateScope ? U : e, ca, y, I.require && C(I.require, ca, ya), u);
                    } catch (K) {
                        n(K, fa(ca));
                    }
                }
                p = p || {};
                for (var A, G, ga, v, L, y = -Number.MAX_VALUE, F = p.controllerDirectives, N = p.newIsolateScopeDirective, Z = p.templateDirective, u = p.nonTlbTranscludeDirective, Wa = !1, Ja = p.hasElementTranscludeDirective, K = d.$$element = w(c), z = e, la = 0, P = a.length; la < P; la++) {
                    G = a[la];
                    var R = G.$$start, V = G.$$end;
                    if (R && (K = I(c, R, V)), v = s, y > G.priority) break;
                    if ((v = G.scope) && (A = A || G, G.templateUrl || (Q("new/isolated scope", N, G, K), 
                    W(v) && (N = G))), ga = G.name, !G.templateUrl && G.controller && (v = G.controller, 
                    F = F || {}, Q("'" + ga + "' controller", F[ga], G, K), F[ga] = G), (v = G.transclude) && (Wa = !0, 
                    G.$$tlb || (Q("transclusion", u, G, K), u = G), "element" == v ? (Ja = !0, y = G.priority, 
                    v = I(c, R, V), K = d.$$element = w(T.createComment(" " + ga + ": " + d[ga] + " ")), 
                    c = K[0], lb(f, w(va.call(v, 0)), c), z = ba(v, e, y, h && h.name, {
                        nonTlbTranscludeDirective: u
                    })) : (v = w(Cb(c)).contents(), K.empty(), z = ba(v, e))), G.template) if (Q("template", Z, G, K), 
                    Z = G, v = D(G.template) ? G.template(K, d) : G.template, v = oc(v), G.replace) {
                        if (h = G, v = E(v), c = v[0], 1 != v.length || 1 !== c.nodeType) throw ha("tplrt", ga, "");
                        lb(f, K, c), P = {
                            $attr: {}
                        }, v = U(c, [], P);
                        var X = a.splice(la + 1, a.length - (la + 1));
                        N && kb(v), a = a.concat(v).concat(X), B(d, P), P = a.length;
                    } else K.html(v);
                    if (G.templateUrl) Q("template", Z, G, K), Z = G, G.replace && (h = G), J = O(a.splice(la, a.length - la), K, d, f, z, g, k, {
                        controllerDirectives: F,
                        newIsolateScopeDirective: N,
                        templateDirective: Z,
                        nonTlbTranscludeDirective: u
                    }), P = a.length; else if (G.compile) try {
                        L = G.compile(K, d, z), D(L) ? q(null, L, R, V) : L && q(L.pre, L.post, R, V);
                    } catch (Y) {
                        n(Y, fa(K));
                    }
                    G.terminal && (J.terminal = !0, y = Math.max(y, G.priority));
                }
                return J.scope = A && !0 === A.scope, J.transclude = Wa && z, p.hasElementTranscludeDirective = Ja, 
                J;
            }
            function kb(a) {
                for (var b = 0, c = a.length; b < c; b++) a[b] = Rb(a[b], {
                    $$isolateScope: !0
                });
            }
            function u(b, e, f, h, g, l, p) {
                if (e === g) return null;
                if (g = null, c.hasOwnProperty(e)) {
                    var t;
                    e = a.get(e + d);
                    for (var q = 0, H = e.length; q < H; q++) try {
                        t = e[q], (h === s || h > t.priority) && -1 != t.restrict.indexOf(f) && (l && (t = Rb(t, {
                            $$start: l,
                            $$end: p
                        })), b.push(t), g = t);
                    } catch (y) {
                        n(y);
                    }
                }
                return g;
            }
            function B(a, b) {
                var c = b.$attr, d = a.$attr, e = a.$$element;
                r(a, function(d, e) {
                    "$" != e.charAt(0) && (b[e] && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]));
                }), r(b, function(b, f) {
                    "class" == f ? (S(e, b), a.class = (a.class ? a.class + " " : "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), 
                    a.style = (a.style ? a.style + ";" : "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, 
                    d[f] = c[f]);
                });
            }
            function E(a) {
                var b;
                return a = aa(a), (b = g.exec(a)) ? (b = b[1].toLowerCase(), a = w("<table>" + a + "</table>"), 
                /(thead|tbody|tfoot)/.test(b) ? a.children(b) : (a = a.children("tbody"), "tr" === b ? a.children("tr") : a.children("tr").contents())) : w("<div>" + a + "</div>").contents();
            }
            function O(a, b, c, d, e, f, h, g) {
                var l, n, k = [], t = b[0], H = a.shift(), y = v({}, H, {
                    templateUrl: null,
                    transclude: null,
                    replace: null,
                    $$originalDirective: H
                }), C = D(H.templateUrl) ? H.templateUrl(b, c) : H.templateUrl;
                return b.empty(), q.get(J.getTrustedResourceUrl(C), {
                    cache: p
                }).success(function(p) {
                    var q, J;
                    if (p = oc(p), H.replace) {
                        if (p = E(p), q = p[0], 1 != p.length || 1 !== q.nodeType) throw ha("tplrt", H.name, C);
                        p = {
                            $attr: {}
                        }, lb(d, b, q);
                        var A = U(q, [], p);
                        W(H.scope) && kb(A), a = A.concat(a), B(c, p);
                    } else q = t, b.html(p);
                    for (a.unshift(y), l = Wa(a, q, c, e, b, H, f, h, g), r(d, function(a, c) {
                        a == q && (d[c] = b[0]);
                    }), n = N(b[0].childNodes, e); k.length; ) {
                        p = k.shift(), J = k.shift();
                        var I = k.shift(), F = k.shift(), A = b[0];
                        if (J !== t) {
                            var ba = J.className;
                            g.hasElementTranscludeDirective && H.replace || (A = Cb(q)), lb(I, w(J), A), S(w(A), ba);
                        }
                        J = l.transclude ? Z(p, l.transclude) : F, l(n, p, A, d, J);
                    }
                    k = null;
                }).error(function(a, b, c, d) {
                    throw ha("tpload", d.url);
                }), function(a, b, c, d, e) {
                    k ? (k.push(b), k.push(c), k.push(d), k.push(e)) : l(n, b, c, d, e);
                };
            }
            function z(a, b) {
                var c = b.priority - a.priority;
                return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
            }
            function Q(a, b, c, d) {
                if (b) throw ha("multidir", b.name, c.name, a, fa(d));
            }
            function L(a, c) {
                var d = b(c, !0);
                d && a.push({
                    priority: 0,
                    compile: Y(function(a, b) {
                        var c = b.parent(), e = c.data("$binding") || [];
                        e.push(d), S(c.data("$binding", e), "ng-binding"), a.$watch(d, function(a) {
                            b[0].nodeValue = a;
                        });
                    })
                });
            }
            function Ja(a, b) {
                if ("srcdoc" == b) return J.HTML;
                var c = Ia(a);
                return "xlinkHref" == b || "FORM" == c && "action" == b || "IMG" != c && ("src" == b || "ngSrc" == b) ? J.RESOURCE_URL : void 0;
            }
            function ga(a, c, d, e) {
                var f = b(d, !0);
                if (f) {
                    if ("multiple" === e && "SELECT" === Ia(a)) throw ha("selmulti", fa(a));
                    c.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(c, d, g) {
                                    if (d = g.$$observers || (g.$$observers = {}), h.test(e)) throw ha("nodomevents");
                                    (f = b(g[e], !0, Ja(a, e))) && (g[e] = f(c), (d[e] || (d[e] = [])).$$inter = !0, 
                                    (g.$$observers && g.$$observers[e].$$scope || c).$watch(f, function(a, b) {
                                        "class" === e && a != b ? g.$updateClass(a, b) : g.$set(e, a);
                                    }));
                                }
                            };
                        }
                    });
                }
            }
            function lb(a, b, c) {
                var h, g, d = b[0], e = b.length, f = d.parentNode;
                if (a) for (h = 0, g = a.length; h < g; h++) if (a[h] == d) {
                    a[h++] = c, g = h + e - 1;
                    for (var k = a.length; h < k; h++, g++) g < k ? a[h] = a[g] : delete a[h];
                    a.length -= e - 1;
                    break;
                }
                for (f && f.replaceChild(c, d), a = T.createDocumentFragment(), a.appendChild(d), 
                c[w.expando] = d[w.expando], d = 1, e = b.length; d < e; d++) f = b[d], w(f).remove(), 
                a.appendChild(f), delete b[d];
                b[0] = c, b.length = 1;
            }
            function nc(a, b) {
                return v(function() {
                    return a.apply(null, arguments);
                }, a, b);
            }
            var Fb = function(a, b) {
                this.$$element = a, this.$attr = b || {};
            };
            Fb.prototype = {
                $normalize: ka,
                $addClass: function(a) {
                    a && 0 < a.length && F.addClass(this.$$element, a);
                },
                $removeClass: function(a) {
                    a && 0 < a.length && F.removeClass(this.$$element, a);
                },
                $updateClass: function(a, b) {
                    var c = pc(a, b), d = pc(b, a);
                    0 === c.length ? F.removeClass(this.$$element, d) : 0 === d.length ? F.addClass(this.$$element, c) : F.setClass(this.$$element, c, d);
                },
                $set: function(a, b, c, d) {
                    var e = kc(this.$$element[0], a);
                    e && (this.$$element.prop(a, b), d = e), this[a] = b, d ? this.$attr[a] = d : (d = this.$attr[a]) || (this.$attr[a] = d = eb(a, "-")), 
                    e = Ia(this.$$element), ("A" === e && "href" === a || "IMG" === e && "src" === a) && (this[a] = b = y(b, "src" === a)), 
                    !1 !== c && (null === b || b === s ? this.$$element.removeAttr(d) : this.$$element.attr(d, b)), 
                    (c = this.$$observers) && r(c[a], function(a) {
                        try {
                            a(b);
                        } catch (c) {
                            n(c);
                        }
                    });
                },
                $observe: function(a, b) {
                    var c = this, d = c.$$observers || (c.$$observers = {}), e = d[a] || (d[a] = []);
                    return e.push(b), C.$evalAsync(function() {
                        e.$$inter || b(c[a]);
                    }), b;
                }
            };
            var R = b.startSymbol(), V = b.endSymbol(), oc = "{{" == R || "}}" == V ? Ba : function(a) {
                return a.replace(/\{\{/g, R).replace(/}}/g, V);
            }, la = /^ngAttr[A-Z]/;
            return ba;
        } ];
    }
    function ka(b) {
        return Sa(b.replace(pe, ""));
    }
    function pc(b, a) {
        var c = "", d = b.split(/\s+/), e = a.split(/\s+/), f = 0;
        a: for (;f < d.length; f++) {
            for (var g = d[f], h = 0; h < e.length; h++) if (g == e[h]) continue a;
            c += (0 < c.length ? " " : "") + g;
        }
        return c;
    }
    function Md() {
        var b = {}, a = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function(a, d) {
            xa(a, "controller"), W(a) ? v(b, a) : b[a] = d;
        }, this.$get = [ "$injector", "$window", function(c, d) {
            return function(e, f) {
                var g, h, m;
                if (x(e) && (g = e.match(a), h = g[1], m = g[3], e = b.hasOwnProperty(h) ? b[h] : $b(f.$scope, h, !0) || $b(d, h, !0), 
                Qa(e, h, !0)), g = c.instantiate(e, f), m) {
                    if (!f || "object" != typeof f.$scope) throw z("$controller")("noscp", h || e.name, m);
                    f.$scope[m] = g;
                }
                return g;
            };
        } ];
    }
    function Nd() {
        this.$get = [ "$window", function(b) {
            return w(b.document);
        } ];
    }
    function Od() {
        this.$get = [ "$log", function(b) {
            return function(a, c) {
                b.error.apply(b, arguments);
            };
        } ];
    }
    function qc(b) {
        var c, d, e, a = {};
        return b ? (r(b.split("\n"), function(b) {
            e = b.indexOf(":"), c = O(aa(b.substr(0, e))), d = aa(b.substr(e + 1)), c && (a[c] = a[c] ? a[c] + (", " + d) : d);
        }), a) : a;
    }
    function rc(b) {
        var a = W(b) ? b : s;
        return function(c) {
            return a || (a = qc(b)), c ? a[O(c)] || null : a;
        };
    }
    function sc(b, a, c) {
        return D(c) ? c(b, a) : (r(c, function(c) {
            b = c(b, a);
        }), b);
    }
    function Rd() {
        var b = /^\s*(\[|\{[^\{])/, a = /[\}\]]\s*$/, c = /^\)\]\}',?\n/, d = {
            "Content-Type": "application/json;charset=utf-8"
        }, e = this.defaults = {
            transformResponse: [ function(d) {
                return x(d) && (d = d.replace(c, ""), b.test(d) && a.test(d) && (d = Ub(d))), d;
            } ],
            transformRequest: [ function(a) {
                return W(a) && "[object File]" !== ta.call(a) && "[object Blob]" !== ta.call(a) ? oa(a) : a;
            } ],
            headers: {
                common: {
                    Accept: "application/json, text/plain, */*"
                },
                post: $(d),
                put: $(d),
                patch: $(d)
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN"
        }, f = this.interceptors = [], g = this.responseInterceptors = [];
        this.$get = [ "$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function(a, b, c, d, n, q) {
            function p(a) {
                function c(a) {
                    var b = v({}, a, {
                        data: sc(a.data, a.headers, d.transformResponse)
                    });
                    return 200 <= a.status && 300 > a.status ? b : n.reject(b);
                }
                var d = {
                    method: "get",
                    transformRequest: e.transformRequest,
                    transformResponse: e.transformResponse
                }, f = function(a) {
                    function b(a) {
                        var c;
                        r(a, function(b, d) {
                            D(b) && (c = b(), null != c ? a[d] = c : delete a[d]);
                        });
                    }
                    var f, h, c = e.headers, d = v({}, a.headers), c = v({}, c.common, c[O(a.method)]);
                    b(c), b(d);
                    a: for (f in c) {
                        a = O(f);
                        for (h in d) if (O(h) === a) continue a;
                        d[f] = c[f];
                    }
                    return d;
                }(a);
                v(d, a), d.headers = f, d.method = Da(d.method), (a = Gb(d.url) ? b.cookies()[d.xsrfCookieName || e.xsrfCookieName] : s) && (f[d.xsrfHeaderName || e.xsrfHeaderName] = a);
                var h = [ function(a) {
                    f = a.headers;
                    var b = sc(a.data, rc(f), a.transformRequest);
                    return E(a.data) && r(f, function(a, b) {
                        "content-type" === O(b) && delete f[b];
                    }), E(a.withCredentials) && !E(e.withCredentials) && (a.withCredentials = e.withCredentials), 
                    t(a, b, f).then(c, c);
                }, s ], g = n.when(d);
                for (r(A, function(a) {
                    (a.request || a.requestError) && h.unshift(a.request, a.requestError), (a.response || a.responseError) && h.push(a.response, a.responseError);
                }); h.length; ) {
                    a = h.shift();
                    var k = h.shift(), g = g.then(a, k);
                }
                return g.success = function(a) {
                    return g.then(function(b) {
                        a(b.data, b.status, b.headers, d);
                    }), g;
                }, g.error = function(a) {
                    return g.then(null, function(b) {
                        a(b.data, b.status, b.headers, d);
                    }), g;
                }, g;
            }
            function t(b, c, f) {
                function g(a, b, c) {
                    A && (200 <= a && 300 > a ? A.put(s, [ a, b, qc(c) ]) : A.remove(s)), k(b, a, c), 
                    d.$$phase || d.$apply();
                }
                function k(a, c, d) {
                    c = Math.max(c, 0), (200 <= c && 300 > c ? t.resolve : t.reject)({
                        data: a,
                        status: c,
                        headers: rc(d),
                        config: b
                    });
                }
                function m() {
                    var a = cb(p.pendingRequests, b);
                    -1 !== a && p.pendingRequests.splice(a, 1);
                }
                var A, r, t = n.defer(), q = t.promise, s = H(b.url, b.params);
                if (p.pendingRequests.push(b), q.then(m, m), (b.cache || e.cache) && !1 !== b.cache && "GET" == b.method && (A = W(b.cache) ? b.cache : W(e.cache) ? e.cache : C), 
                A) if (r = A.get(s), u(r)) {
                    if (r.then) return r.then(m, m), r;
                    M(r) ? k(r[1], r[0], $(r[2])) : k(r, 200, {});
                } else A.put(s, q);
                return E(r) && a(b.method, s, c, g, f, b.timeout, b.withCredentials, b.responseType), 
                q;
            }
            function H(a, b) {
                if (!b) return a;
                var c = [];
                return Qc(b, function(a, b) {
                    null === a || E(a) || (M(a) || (a = [ a ]), r(a, function(a) {
                        W(a) && (a = oa(a)), c.push(wa(b) + "=" + wa(a));
                    }));
                }), 0 < c.length && (a += (-1 == a.indexOf("?") ? "?" : "&") + c.join("&")), a;
            }
            var C = c("$http"), A = [];
            return r(f, function(a) {
                A.unshift(x(a) ? q.get(a) : q.invoke(a));
            }), r(g, function(a, b) {
                var c = x(a) ? q.get(a) : q.invoke(a);
                A.splice(b, 0, {
                    response: function(a) {
                        return c(n.when(a));
                    },
                    responseError: function(a) {
                        return c(n.reject(a));
                    }
                });
            }), p.pendingRequests = [], function(a) {
                r(arguments, function(a) {
                    p[a] = function(b, c) {
                        return p(v(c || {}, {
                            method: a,
                            url: b
                        }));
                    };
                });
            }("get", "delete", "head", "jsonp"), function(a) {
                r(arguments, function(a) {
                    p[a] = function(b, c, d) {
                        return p(v(d || {}, {
                            method: a,
                            url: b,
                            data: c
                        }));
                    };
                });
            }("post", "put"), p.defaults = e, p;
        } ];
    }
    function qe(b) {
        if (8 >= P && (!b.match(/^(get|post|head|put|delete|options)$/i) || !Q.XMLHttpRequest)) return new Q.ActiveXObject("Microsoft.XMLHTTP");
        if (Q.XMLHttpRequest) return new Q.XMLHttpRequest();
        throw z("$httpBackend")("noxhr");
    }
    function Sd() {
        this.$get = [ "$browser", "$window", "$document", function(b, a, c) {
            return re(b, qe, b.defer, a.angular.callbacks, c[0]);
        } ];
    }
    function re(b, a, c, d, e) {
        function f(a, b) {
            var c = e.createElement("script"), d = function() {
                c.onreadystatechange = c.onload = c.onerror = null, e.body.removeChild(c), b && b();
            };
            return c.type = "text/javascript", c.src = a, P && 8 >= P ? c.onreadystatechange = function() {
                /loaded|complete/.test(c.readyState) && d();
            } : c.onload = c.onerror = function() {
                d();
            }, e.body.appendChild(c), d;
        }
        var g = -1;
        return function(e, m, k, l, n, q, p, t) {
            function H() {
                A = g, F && F(), y && y.abort();
            }
            function C(a, d, e, f) {
                S && c.cancel(S), F = y = null, 0 === d && (d = e ? 200 : "file" == pa(m).protocol ? 404 : 0), 
                a(1223 == d ? 204 : d, e, f), b.$$completeOutstandingRequest(B);
            }
            var A;
            if (b.$$incOutstandingRequestCount(), m = m || b.url(), "jsonp" == O(e)) {
                var J = "_" + (d.counter++).toString(36);
                d[J] = function(a) {
                    d[J].data = a;
                };
                var F = f(m.replace("JSON_CALLBACK", "angular.callbacks." + J), function() {
                    d[J].data ? C(l, 200, d[J].data) : C(l, A || -2), d[J] = Ca.noop;
                });
            } else {
                var y = a(e);
                if (y.open(e, m, !0), r(n, function(a, b) {
                    u(a) && y.setRequestHeader(b, a);
                }), y.onreadystatechange = function() {
                    if (y && 4 == y.readyState) {
                        var a = null, b = null;
                        A !== g && (a = y.getAllResponseHeaders(), b = "response" in y ? y.response : y.responseText), 
                        C(l, A || y.status, b, a);
                    }
                }, p && (y.withCredentials = !0), t) try {
                    y.responseType = t;
                } catch (s) {
                    if ("json" !== t) throw s;
                }
                y.send(k || null);
            }
            if (0 < q) var S = c(H, q); else q && q.then && q.then(H);
        };
    }
    function Pd() {
        var b = "{{", a = "}}";
        this.startSymbol = function(a) {
            return a ? (b = a, this) : b;
        }, this.endSymbol = function(b) {
            return b ? (a = b, this) : a;
        }, this.$get = [ "$parse", "$exceptionHandler", "$sce", function(c, d, e) {
            function f(f, k, l) {
                for (var n, q, p = 0, t = [], H = f.length, C = !1, A = []; p < H; ) -1 != (n = f.indexOf(b, p)) && -1 != (q = f.indexOf(a, n + g)) ? (p != n && t.push(f.substring(p, n)), 
                t.push(p = c(C = f.substring(n + g, q))), p.exp = C, p = q + h, C = !0) : (p != H && t.push(f.substring(p)), 
                p = H);
                if ((H = t.length) || (t.push(""), H = 1), l && 1 < t.length) throw tc("noconcat", f);
                if (!k || C) return A.length = H, p = function(a) {
                    try {
                        for (var h, b = 0, c = H; b < c; b++) "function" == typeof (h = t[b]) && (h = h(a), 
                        h = l ? e.getTrusted(l, h) : e.valueOf(h), null === h || E(h) ? h = "" : "string" != typeof h && (h = oa(h))), 
                        A[b] = h;
                        return A.join("");
                    } catch (g) {
                        a = tc("interr", f, g.toString()), d(a);
                    }
                }, p.exp = f, p.parts = t, p;
            }
            var g = b.length, h = a.length;
            return f.startSymbol = function() {
                return b;
            }, f.endSymbol = function() {
                return a;
            }, f;
        } ];
    }
    function Qd() {
        this.$get = [ "$rootScope", "$window", "$q", function(b, a, c) {
            function d(d, g, h, m) {
                var k = a.setInterval, l = a.clearInterval, n = c.defer(), q = n.promise, p = 0, t = u(m) && !m;
                return h = u(h) ? h : 0, q.then(null, null, d), q.$$intervalId = k(function() {
                    n.notify(p++), 0 < h && p >= h && (n.resolve(p), l(q.$$intervalId), delete e[q.$$intervalId]), 
                    t || b.$apply();
                }, g), e[q.$$intervalId] = n, q;
            }
            var e = {};
            return d.cancel = function(a) {
                return !!(a && a.$$intervalId in e) && (e[a.$$intervalId].reject("canceled"), clearInterval(a.$$intervalId), 
                delete e[a.$$intervalId], !0);
            }, d;
        } ];
    }
    function Zc() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [ {
                        minInt: 1,
                        minFrac: 0,
                        maxFrac: 3,
                        posPre: "",
                        posSuf: "",
                        negPre: "-",
                        negSuf: "",
                        gSize: 3,
                        lgSize: 3
                    }, {
                        minInt: 1,
                        minFrac: 2,
                        maxFrac: 2,
                        posPre: "¤",
                        posSuf: "",
                        negPre: "(¤",
                        negSuf: ")",
                        gSize: 3,
                        lgSize: 3
                    } ],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January February March April May June July August September October November December".split(" "),
                    SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                    DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                    SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                    AMPMS: [ "AM", "PM" ],
                    medium: "MMM d, y h:mm:ss a",
                    short: "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a"
                },
                pluralCat: function(b) {
                    return 1 === b ? "one" : "other";
                }
            };
        };
    }
    function uc(b) {
        b = b.split("/");
        for (var a = b.length; a--; ) b[a] = vb(b[a]);
        return b.join("/");
    }
    function vc(b, a, c) {
        b = pa(b, c), a.$$protocol = b.protocol, a.$$host = b.hostname, a.$$port = R(b.port) || se[b.protocol] || null;
    }
    function wc(b, a, c) {
        var d = "/" !== b.charAt(0);
        d && (b = "/" + b), b = pa(b, c), a.$$path = decodeURIComponent(d && "/" === b.pathname.charAt(0) ? b.pathname.substring(1) : b.pathname), 
        a.$$search = Wb(b.search), a.$$hash = decodeURIComponent(b.hash), a.$$path && "/" != a.$$path.charAt(0) && (a.$$path = "/" + a.$$path);
    }
    function ma(b, a) {
        if (0 === a.indexOf(b)) return a.substr(b.length);
    }
    function Xa(b) {
        var a = b.indexOf("#");
        return -1 == a ? b : b.substr(0, a);
    }
    function Hb(b) {
        return b.substr(0, Xa(b).lastIndexOf("/") + 1);
    }
    function xc(b, a) {
        this.$$html5 = !0, a = a || "";
        var c = Hb(b);
        vc(b, this, b), this.$$parse = function(a) {
            var e = ma(c, a);
            if (!x(e)) throw Ib("ipthprfx", a, c);
            wc(e, this, b), this.$$path || (this.$$path = "/"), this.$$compose();
        }, this.$$compose = function() {
            var a = Xb(this.$$search), b = this.$$hash ? "#" + vb(this.$$hash) : "";
            this.$$url = uc(this.$$path) + (a ? "?" + a : "") + b, this.$$absUrl = c + this.$$url.substr(1);
        }, this.$$rewrite = function(d) {
            var e;
            return (e = ma(b, d)) !== s ? (d = e, (e = ma(a, e)) !== s ? c + (ma("/", e) || e) : b + d) : (e = ma(c, d)) !== s ? c + e : c == d + "/" ? c : void 0;
        };
    }
    function Jb(b, a) {
        var c = Hb(b);
        vc(b, this, b), this.$$parse = function(d) {
            var e = ma(b, d) || ma(c, d), e = "#" == e.charAt(0) ? ma(a, e) : this.$$html5 ? e : "";
            if (!x(e)) throw Ib("ihshprfx", d, a);
            wc(e, this, b), d = this.$$path;
            var f = /^\/?.*?:(\/.*)/;
            0 === e.indexOf(b) && (e = e.replace(b, "")), f.exec(e) || (d = (e = f.exec(d)) ? e[1] : d), 
            this.$$path = d, this.$$compose();
        }, this.$$compose = function() {
            var c = Xb(this.$$search), e = this.$$hash ? "#" + vb(this.$$hash) : "";
            this.$$url = uc(this.$$path) + (c ? "?" + c : "") + e, this.$$absUrl = b + (this.$$url ? a + this.$$url : "");
        }, this.$$rewrite = function(a) {
            if (Xa(b) == Xa(a)) return a;
        };
    }
    function yc(b, a) {
        this.$$html5 = !0, Jb.apply(this, arguments);
        var c = Hb(b);
        this.$$rewrite = function(d) {
            var e;
            return b == Xa(d) ? d : (e = ma(c, d)) ? b + a + e : c === d + "/" ? c : void 0;
        };
    }
    function mb(b) {
        return function() {
            return this[b];
        };
    }
    function zc(b, a) {
        return function(c) {
            return E(c) ? this[b] : (this[b] = a(c), this.$$compose(), this);
        };
    }
    function Td() {
        var b = "", a = !1;
        this.hashPrefix = function(a) {
            return u(a) ? (b = a, this) : b;
        }, this.html5Mode = function(b) {
            return u(b) ? (a = b, this) : a;
        }, this.$get = [ "$rootScope", "$browser", "$sniffer", "$rootElement", function(c, d, e, f) {
            function g(a) {
                c.$broadcast("$locationChangeSuccess", h.absUrl(), a);
            }
            var h, m = d.baseHref(), k = d.url();
            a ? (m = k.substring(0, k.indexOf("/", k.indexOf("//") + 2)) + (m || "/"), e = e.history ? xc : yc) : (m = Xa(k), 
            e = Jb), h = new e(m, "#" + b), h.$$parse(h.$$rewrite(k)), f.on("click", function(a) {
                if (!a.ctrlKey && !a.metaKey && 2 != a.which) {
                    for (var b = w(a.target); "a" !== O(b[0].nodeName); ) if (b[0] === f[0] || !(b = b.parent())[0]) return;
                    var e = b.prop("href");
                    W(e) && "[object SVGAnimatedString]" === e.toString() && (e = pa(e.animVal).href);
                    var g = h.$$rewrite(e);
                    e && !b.attr("target") && g && !a.isDefaultPrevented() && (a.preventDefault(), g != d.url() && (h.$$parse(g), 
                    c.$apply(), Q.angular["ff-684208-preventDefault"] = !0));
                }
            }), h.absUrl() != k && d.url(h.absUrl(), !0), d.onUrlChange(function(a) {
                h.absUrl() != a && (c.$evalAsync(function() {
                    var b = h.absUrl();
                    h.$$parse(a), c.$broadcast("$locationChangeStart", a, b).defaultPrevented ? (h.$$parse(b), 
                    d.url(b)) : g(b);
                }), c.$$phase || c.$digest());
            });
            var l = 0;
            return c.$watch(function() {
                var a = d.url(), b = h.$$replace;
                return l && a == h.absUrl() || (l++, c.$evalAsync(function() {
                    c.$broadcast("$locationChangeStart", h.absUrl(), a).defaultPrevented ? h.$$parse(a) : (d.url(h.absUrl(), b), 
                    g(a));
                })), h.$$replace = !1, l;
            }), h;
        } ];
    }
    function Ud() {
        var b = !0, a = this;
        this.debugEnabled = function(a) {
            return u(a) ? (b = a, this) : b;
        }, this.$get = [ "$window", function(c) {
            function d(a) {
                return a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)), 
                a;
            }
            function e(a) {
                var b = c.console || {}, e = b[a] || b.log || B;
                a = !1;
                try {
                    a = !!e.apply;
                } catch (m) {}
                return a ? function() {
                    var a = [];
                    return r(arguments, function(b) {
                        a.push(d(b));
                    }), e.apply(b, a);
                } : function(a, b) {
                    e(a, null == b ? "" : b);
                };
            }
            return {
                log: e("log"),
                info: e("info"),
                warn: e("warn"),
                error: e("error"),
                debug: function() {
                    var c = e("debug");
                    return function() {
                        b && c.apply(a, arguments);
                    };
                }()
            };
        } ];
    }
    function da(b, a) {
        if ("constructor" === b) throw za("isecfld", a);
        return b;
    }
    function Ya(b, a) {
        if (b) {
            if (b.constructor === b) throw za("isecfn", a);
            if (b.document && b.location && b.alert && b.setInterval) throw za("isecwindow", a);
            if (b.children && (b.nodeName || b.prop && b.attr && b.find)) throw za("isecdom", a);
        }
        return b;
    }
    function nb(b, a, c, d, e) {
        e = e || {}, a = a.split(".");
        for (var f, g = 0; 1 < a.length; g++) {
            f = da(a.shift(), d);
            var h = b[f];
            h || (h = {}, b[f] = h), b = h, b.then && e.unwrapPromises && (qa(d), "$$v" in b || function(a) {
                a.then(function(b) {
                    a.$$v = b;
                });
            }(b), b.$$v === s && (b.$$v = {}), b = b.$$v);
        }
        return f = da(a.shift(), d), b[f] = c;
    }
    function Ac(b, a, c, d, e, f, g) {
        return da(b, f), da(a, f), da(c, f), da(d, f), da(e, f), g.unwrapPromises ? function(h, g) {
            var l, k = g && g.hasOwnProperty(b) ? g : h;
            return null == k ? k : ((k = k[b]) && k.then && (qa(f), "$$v" in k || (l = k, l.$$v = s, 
            l.then(function(a) {
                l.$$v = a;
            })), k = k.$$v), a ? null == k ? s : ((k = k[a]) && k.then && (qa(f), "$$v" in k || (l = k, 
            l.$$v = s, l.then(function(a) {
                l.$$v = a;
            })), k = k.$$v), c ? null == k ? s : ((k = k[c]) && k.then && (qa(f), "$$v" in k || (l = k, 
            l.$$v = s, l.then(function(a) {
                l.$$v = a;
            })), k = k.$$v), d ? null == k ? s : ((k = k[d]) && k.then && (qa(f), "$$v" in k || (l = k, 
            l.$$v = s, l.then(function(a) {
                l.$$v = a;
            })), k = k.$$v), e ? null == k ? s : ((k = k[e]) && k.then && (qa(f), "$$v" in k || (l = k, 
            l.$$v = s, l.then(function(a) {
                l.$$v = a;
            })), k = k.$$v), k) : k) : k) : k) : k);
        } : function(f, g) {
            var k = g && g.hasOwnProperty(b) ? g : f;
            return null == k ? k : (k = k[b], a ? null == k ? s : (k = k[a], c ? null == k ? s : (k = k[c], 
            d ? null == k ? s : (k = k[d], e ? null == k ? s : k = k[e] : k) : k) : k) : k);
        };
    }
    function te(b, a) {
        return da(b, a), function(a, d) {
            return null == a ? s : (d && d.hasOwnProperty(b) ? d : a)[b];
        };
    }
    function ue(b, a, c) {
        return da(b, c), da(a, c), function(c, e) {
            return null == c ? s : (c = (e && e.hasOwnProperty(b) ? e : c)[b], null == c ? s : c[a]);
        };
    }
    function Bc(b, a, c) {
        if (Kb.hasOwnProperty(b)) return Kb[b];
        var f, d = b.split("."), e = d.length;
        if (a.unwrapPromises || 1 !== e) if (a.unwrapPromises || 2 !== e) if (a.csp) f = 6 > e ? Ac(d[0], d[1], d[2], d[3], d[4], c, a) : function(b, f) {
            var g, h = 0;
            do g = Ac(d[h++], d[h++], d[h++], d[h++], d[h++], c, a)(b, f), f = s, b = g; while (h < e);
            return g;
        }; else {
            var g = "var p;\n";
            r(d, function(b, d) {
                da(b, c), g += "if(s == null) return undefined;\ns=" + (d ? "s" : '((k&&k.hasOwnProperty("' + b + '"))?k:s)') + '["' + b + '"];\n' + (a.unwrapPromises ? 'if (s && s.then) {\n pw("' + c.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n' : "");
            });
            var g = g + "return s;", h = new Function("s", "k", "pw", g);
            h.toString = Y(g), f = a.unwrapPromises ? function(a, b) {
                return h(a, b, qa);
            } : h;
        } else f = ue(d[0], d[1], c); else f = te(d[0], c);
        return "hasOwnProperty" !== b && (Kb[b] = f), f;
    }
    function Vd() {
        var b = {}, a = {
            csp: !1,
            unwrapPromises: !1,
            logPromiseWarnings: !0
        };
        this.unwrapPromises = function(b) {
            return u(b) ? (a.unwrapPromises = !!b, this) : a.unwrapPromises;
        }, this.logPromiseWarnings = function(b) {
            return u(b) ? (a.logPromiseWarnings = b, this) : a.logPromiseWarnings;
        }, this.$get = [ "$filter", "$sniffer", "$log", function(c, d, e) {
            return a.csp = d.csp, qa = function(b) {
                a.logPromiseWarnings && !Cc.hasOwnProperty(b) && (Cc[b] = !0, e.warn("[$parse] Promise found in the expression `" + b + "`. Automatic unwrapping of promises in Angular expressions is deprecated."));
            }, function(d) {
                var e;
                switch (typeof d) {
                  case "string":
                    return b.hasOwnProperty(d) ? b[d] : (e = new Lb(a), e = new Za(e, c, a).parse(d, !1), 
                    "hasOwnProperty" !== d && (b[d] = e), e);

                  case "function":
                    return d;

                  default:
                    return B;
                }
            };
        } ];
    }
    function Xd() {
        this.$get = [ "$rootScope", "$exceptionHandler", function(b, a) {
            return ve(function(a) {
                b.$evalAsync(a);
            }, a);
        } ];
    }
    function ve(b, a) {
        function c(a) {
            return a;
        }
        function d(a) {
            return g(a);
        }
        var e = function() {
            var k, l, g = [];
            return l = {
                resolve: function(a) {
                    if (g) {
                        var c = g;
                        g = s, k = f(a), c.length && b(function() {
                            for (var a, b = 0, d = c.length; b < d; b++) a = c[b], k.then(a[0], a[1], a[2]);
                        });
                    }
                },
                reject: function(a) {
                    l.resolve(h(a));
                },
                notify: function(a) {
                    if (g) {
                        var c = g;
                        g.length && b(function() {
                            for (var b, d = 0, e = c.length; d < e; d++) b = c[d], b[2](a);
                        });
                    }
                },
                promise: {
                    then: function(b, f, h) {
                        var l = e(), H = function(d) {
                            try {
                                l.resolve((D(b) ? b : c)(d));
                            } catch (e) {
                                l.reject(e), a(e);
                            }
                        }, C = function(b) {
                            try {
                                l.resolve((D(f) ? f : d)(b));
                            } catch (c) {
                                l.reject(c), a(c);
                            }
                        }, A = function(b) {
                            try {
                                l.notify((D(h) ? h : c)(b));
                            } catch (d) {
                                a(d);
                            }
                        };
                        return g ? g.push([ H, C, A ]) : k.then(H, C, A), l.promise;
                    },
                    catch: function(a) {
                        return this.then(null, a);
                    },
                    finally: function(a) {
                        function b(a, c) {
                            var d = e();
                            return c ? d.resolve(a) : d.reject(a), d.promise;
                        }
                        function d(e, f) {
                            var h = null;
                            try {
                                h = (a || c)();
                            } catch (g) {
                                return b(g, !1);
                            }
                            return h && D(h.then) ? h.then(function() {
                                return b(e, f);
                            }, function(a) {
                                return b(a, !1);
                            }) : b(e, f);
                        }
                        return this.then(function(a) {
                            return d(a, !0);
                        }, function(a) {
                            return d(a, !1);
                        });
                    }
                }
            };
        }, f = function(a) {
            return a && D(a.then) ? a : {
                then: function(c) {
                    var d = e();
                    return b(function() {
                        d.resolve(c(a));
                    }), d.promise;
                }
            };
        }, g = function(a) {
            var b = e();
            return b.reject(a), b.promise;
        }, h = function(c) {
            return {
                then: function(f, h) {
                    var g = e();
                    return b(function() {
                        try {
                            g.resolve((D(h) ? h : d)(c));
                        } catch (b) {
                            g.reject(b), a(b);
                        }
                    }), g.promise;
                }
            };
        };
        return {
            defer: e,
            reject: g,
            when: function(h, k, l, n) {
                var p, q = e(), t = function(b) {
                    try {
                        return (D(k) ? k : c)(b);
                    } catch (d) {
                        return a(d), g(d);
                    }
                }, H = function(b) {
                    try {
                        return (D(l) ? l : d)(b);
                    } catch (c) {
                        return a(c), g(c);
                    }
                }, C = function(b) {
                    try {
                        return (D(n) ? n : c)(b);
                    } catch (d) {
                        a(d);
                    }
                };
                return b(function() {
                    f(h).then(function(a) {
                        p || (p = !0, q.resolve(f(a).then(t, H, C)));
                    }, function(a) {
                        p || (p = !0, q.resolve(H(a)));
                    }, function(a) {
                        p || q.notify(C(a));
                    });
                }), q.promise;
            },
            all: function(a) {
                var b = e(), c = 0, d = M(a) ? [] : {};
                return r(a, function(a, e) {
                    c++, f(a).then(function(a) {
                        d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d));
                    }, function(a) {
                        d.hasOwnProperty(e) || b.reject(a);
                    });
                }), 0 === c && b.resolve(d), b.promise;
            }
        };
    }
    function de() {
        this.$get = [ "$window", "$timeout", function(b, a) {
            var c = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame, d = b.cancelAnimationFrame || b.webkitCancelAnimationFrame || b.mozCancelAnimationFrame || b.webkitCancelRequestAnimationFrame, e = !!c, f = e ? function(a) {
                var b = c(a);
                return function() {
                    d(b);
                };
            } : function(b) {
                var c = a(b, 16.66, !1);
                return function() {
                    a.cancel(c);
                };
            };
            return f.supported = e, f;
        } ];
    }
    function Wd() {
        var b = 10, a = z("$rootScope"), c = null;
        this.digestTtl = function(a) {
            return arguments.length && (b = a), b;
        }, this.$get = [ "$injector", "$exceptionHandler", "$parse", "$browser", function(d, e, f, g) {
            function h() {
                this.$id = ab(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, 
                this.this = this.$root = this, this.$$destroyed = !1, this.$$asyncQueue = [], this.$$postDigestQueue = [], 
                this.$$listeners = {}, this.$$listenerCount = {}, this.$$isolateBindings = {};
            }
            function m(b) {
                if (q.$$phase) throw a("inprog", q.$$phase);
                q.$$phase = b;
            }
            function k(a, b) {
                var c = f(a);
                return Qa(c, b), c;
            }
            function l(a, b, c) {
                do a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c]; while (a = a.$parent);
            }
            function n() {}
            h.prototype = {
                constructor: h,
                $new: function(a) {
                    return a ? (a = new h(), a.$root = this.$root, a.$$asyncQueue = this.$$asyncQueue, 
                    a.$$postDigestQueue = this.$$postDigestQueue) : (a = function() {}, a.prototype = this, 
                    a = new a(), a.$id = ab()), a.this = a, a.$$listeners = {}, a.$$listenerCount = {}, 
                    a.$parent = this, a.$$watchers = a.$$nextSibling = a.$$childHead = a.$$childTail = null, 
                    a.$$prevSibling = this.$$childTail, this.$$childHead ? this.$$childTail = this.$$childTail.$$nextSibling = a : this.$$childHead = this.$$childTail = a, 
                    a;
                },
                $watch: function(a, b, d) {
                    var e = k(a, "watch"), f = this.$$watchers, h = {
                        fn: b,
                        last: n,
                        get: e,
                        exp: a,
                        eq: !!d
                    };
                    if (c = null, !D(b)) {
                        var g = k(b || B, "listener");
                        h.fn = function(a, b, c) {
                            g(c);
                        };
                    }
                    if ("string" == typeof a && e.constant) {
                        var m = h.fn;
                        h.fn = function(a, b, c) {
                            m.call(this, a, b, c), Na(f, h);
                        };
                    }
                    return f || (f = this.$$watchers = []), f.unshift(h), function() {
                        Na(f, h), c = null;
                    };
                },
                $watchCollection: function(a, b) {
                    var d, e, h, c = this, g = 1 < b.length, k = 0, m = f(a), l = [], n = {}, q = !0, r = 0;
                    return this.$watch(function() {
                        d = m(c);
                        var a, b;
                        if (W(d)) if ($a(d)) for (e !== l && (e = l, r = e.length = 0, k++), a = d.length, 
                        r !== a && (k++, e.length = r = a), b = 0; b < a; b++) e[b] !== e[b] && d[b] !== d[b] || e[b] === d[b] || (k++, 
                        e[b] = d[b]); else {
                            e !== n && (e = n = {}, r = 0, k++), a = 0;
                            for (b in d) d.hasOwnProperty(b) && (a++, e.hasOwnProperty(b) ? e[b] !== d[b] && (k++, 
                            e[b] = d[b]) : (r++, e[b] = d[b], k++));
                            if (r > a) for (b in k++, e) e.hasOwnProperty(b) && !d.hasOwnProperty(b) && (r--, 
                            delete e[b]);
                        } else e !== d && (e = d, k++);
                        return k;
                    }, function() {
                        if (q ? (q = !1, b(d, d, c)) : b(d, h, c), g) if (W(d)) if ($a(d)) {
                            h = Array(d.length);
                            for (var a = 0; a < d.length; a++) h[a] = d[a];
                        } else for (a in h = {}, d) Dc.call(d, a) && (h[a] = d[a]); else h = d;
                    });
                },
                $digest: function() {
                    var d, f, h, g, r, y, S, u, v, I, k = this.$$asyncQueue, l = this.$$postDigestQueue, s = b, N = [];
                    m("$digest"), c = null;
                    do {
                        for (y = !1, S = this; k.length; ) {
                            try {
                                I = k.shift(), I.scope.$eval(I.expression);
                            } catch (w) {
                                q.$$phase = null, e(w);
                            }
                            c = null;
                        }
                        a: do {
                            if (g = S.$$watchers) for (r = g.length; r--; ) try {
                                if (d = g[r]) if ((f = d.get(S)) === (h = d.last) || (d.eq ? ua(f, h) : "number" == typeof f && "number" == typeof h && isNaN(f) && isNaN(h))) {
                                    if (d === c) {
                                        y = !1;
                                        break a;
                                    }
                                } else y = !0, c = d, d.last = d.eq ? $(f) : f, d.fn(f, h === n ? f : h, S), 5 > s && (u = 4 - s, 
                                N[u] || (N[u] = []), v = D(d.exp) ? "fn: " + (d.exp.name || d.exp.toString()) : d.exp, 
                                v += "; newVal: " + oa(f) + "; oldVal: " + oa(h), N[u].push(v));
                            } catch (x) {
                                q.$$phase = null, e(x);
                            }
                            if (!(g = S.$$childHead || S !== this && S.$$nextSibling)) for (;S !== this && !(g = S.$$nextSibling); ) S = S.$parent;
                        } while (S = g);
                        if ((y || k.length) && !s--) throw q.$$phase = null, a("infdig", b, oa(N));
                    } while (y || k.length);
                    for (q.$$phase = null; l.length; ) try {
                        l.shift()();
                    } catch (B) {
                        e(B);
                    }
                },
                $destroy: function() {
                    if (!this.$$destroyed) {
                        var a = this.$parent;
                        this.$broadcast("$destroy"), this.$$destroyed = !0, this !== q && (r(this.$$listenerCount, db(null, l, this)), 
                        a.$$childHead == this && (a.$$childHead = this.$$nextSibling), a.$$childTail == this && (a.$$childTail = this.$$prevSibling), 
                        this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), 
                        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null);
                    }
                },
                $eval: function(a, b) {
                    return f(a)(this, b);
                },
                $evalAsync: function(a) {
                    q.$$phase || q.$$asyncQueue.length || g.defer(function() {
                        q.$$asyncQueue.length && q.$digest();
                    }), this.$$asyncQueue.push({
                        scope: this,
                        expression: a
                    });
                },
                $$postDigest: function(a) {
                    this.$$postDigestQueue.push(a);
                },
                $apply: function(a) {
                    try {
                        return m("$apply"), this.$eval(a);
                    } catch (b) {
                        e(b);
                    } finally {
                        q.$$phase = null;
                        try {
                            q.$digest();
                        } catch (c) {
                            throw e(c), c;
                        }
                    }
                },
                $on: function(a, b) {
                    var c = this.$$listeners[a];
                    c || (this.$$listeners[a] = c = []), c.push(b);
                    var d = this;
                    do d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++; while (d = d.$parent);
                    var e = this;
                    return function() {
                        c[cb(c, b)] = null, l(e, 1, a);
                    };
                },
                $emit: function(a, b) {
                    var d, l, m, c = [], f = this, h = !1, g = {
                        name: a,
                        targetScope: f,
                        stopPropagation: function() {
                            h = !0;
                        },
                        preventDefault: function() {
                            g.defaultPrevented = !0;
                        },
                        defaultPrevented: !1
                    }, k = [ g ].concat(va.call(arguments, 1));
                    do {
                        for (d = f.$$listeners[a] || c, g.currentScope = f, l = 0, m = d.length; l < m; l++) if (d[l]) try {
                            d[l].apply(null, k);
                        } catch (n) {
                            e(n);
                        } else d.splice(l, 1), l--, m--;
                        if (h) break;
                        f = f.$parent;
                    } while (f);
                    return g;
                },
                $broadcast: function(a, b) {
                    for (var g, k, c = this, d = this, f = {
                        name: a,
                        targetScope: this,
                        preventDefault: function() {
                            f.defaultPrevented = !0;
                        },
                        defaultPrevented: !1
                    }, h = [ f ].concat(va.call(arguments, 1)); c = d; ) {
                        for (f.currentScope = c, d = c.$$listeners[a] || [], g = 0, k = d.length; g < k; g++) if (d[g]) try {
                            d[g].apply(null, h);
                        } catch (l) {
                            e(l);
                        } else d.splice(g, 1), g--, k--;
                        if (!(d = c.$$listenerCount[a] && c.$$childHead || c !== this && c.$$nextSibling)) for (;c !== this && !(d = c.$$nextSibling); ) c = c.$parent;
                    }
                    return f;
                }
            };
            var q = new h();
            return q;
        } ];
    }
    function $c() {
        var b = /^\s*(https?|ftp|mailto|tel|file):/, a = /^\s*(https?|ftp|file):|data:image\//;
        this.aHrefSanitizationWhitelist = function(a) {
            return u(a) ? (b = a, this) : b;
        }, this.imgSrcSanitizationWhitelist = function(b) {
            return u(b) ? (a = b, this) : a;
        }, this.$get = function() {
            return function(c, d) {
                var f, e = d ? a : b;
                return P && !(8 <= P) || (f = pa(c).href, "" === f || f.match(e)) ? c : "unsafe:" + f;
            };
        };
    }
    function we(b) {
        if ("self" === b) return b;
        if (x(b)) {
            if (-1 < b.indexOf("***")) throw ra("iwcard", b);
            return b = b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), 
            RegExp("^" + b + "$");
        }
        if (bb(b)) return RegExp("^" + b.source + "$");
        throw ra("imatcher");
    }
    function Ec(b) {
        var a = [];
        return u(b) && r(b, function(b) {
            a.push(we(b));
        }), a;
    }
    function Zd() {
        this.SCE_CONTEXTS = ea;
        var b = [ "self" ], a = [];
        this.resourceUrlWhitelist = function(a) {
            return arguments.length && (b = Ec(a)), b;
        }, this.resourceUrlBlacklist = function(b) {
            return arguments.length && (a = Ec(b)), a;
        }, this.$get = [ "$injector", function(c) {
            function d(a) {
                var b = function(a) {
                    this.$$unwrapTrustedValue = function() {
                        return a;
                    };
                };
                return a && (b.prototype = new a()), b.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue();
                }, b.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString();
                }, b;
            }
            var e = function(a) {
                throw ra("unsafe");
            };
            c.has("$sanitize") && (e = c.get("$sanitize"));
            var f = d(), g = {};
            return g[ea.HTML] = d(f), g[ea.CSS] = d(f), g[ea.URL] = d(f), g[ea.JS] = d(f), g[ea.RESOURCE_URL] = d(g[ea.URL]), 
            {
                trustAs: function(a, b) {
                    var c = g.hasOwnProperty(a) ? g[a] : null;
                    if (!c) throw ra("icontext", a, b);
                    if (null === b || b === s || "" === b) return b;
                    if ("string" != typeof b) throw ra("itype", a);
                    return new c(b);
                },
                getTrusted: function(c, d) {
                    if (null === d || d === s || "" === d) return d;
                    var f = g.hasOwnProperty(c) ? g[c] : null;
                    if (f && d instanceof f) return d.$$unwrapTrustedValue();
                    if (c === ea.RESOURCE_URL) {
                        var l, n, f = pa(d.toString()), q = !1;
                        for (l = 0, n = b.length; l < n; l++) if ("self" === b[l] ? Gb(f) : b[l].exec(f.href)) {
                            q = !0;
                            break;
                        }
                        if (q) for (l = 0, n = a.length; l < n; l++) if ("self" === a[l] ? Gb(f) : a[l].exec(f.href)) {
                            q = !1;
                            break;
                        }
                        if (q) return d;
                        throw ra("insecurl", d.toString());
                    }
                    if (c === ea.HTML) return e(d);
                    throw ra("unsafe");
                },
                valueOf: function(a) {
                    return a instanceof f ? a.$$unwrapTrustedValue() : a;
                }
            };
        } ];
    }
    function Yd() {
        var b = !0;
        this.enabled = function(a) {
            return arguments.length && (b = !!a), b;
        }, this.$get = [ "$parse", "$sniffer", "$sceDelegate", function(a, c, d) {
            if (b && c.msie && 8 > c.msieDocumentMode) throw ra("iequirks");
            var e = $(ea);
            e.isEnabled = function() {
                return b;
            }, e.trustAs = d.trustAs, e.getTrusted = d.getTrusted, e.valueOf = d.valueOf, b || (e.trustAs = e.getTrusted = function(a, b) {
                return b;
            }, e.valueOf = Ba), e.parseAs = function(b, c) {
                var d = a(c);
                return d.literal && d.constant ? d : function(a, c) {
                    return e.getTrusted(b, d(a, c));
                };
            };
            var f = e.parseAs, g = e.getTrusted, h = e.trustAs;
            return r(ea, function(a, b) {
                var c = O(b);
                e[Sa("parse_as_" + c)] = function(b) {
                    return f(a, b);
                }, e[Sa("get_trusted_" + c)] = function(b) {
                    return g(a, b);
                }, e[Sa("trust_as_" + c)] = function(b) {
                    return h(a, b);
                };
            }), e;
        } ];
    }
    function $d() {
        this.$get = [ "$window", "$document", function(b, a) {
            var h, c = {}, d = R((/android (\d+)/.exec(O((b.navigator || {}).userAgent)) || [])[1]), e = /Boxee/i.test((b.navigator || {}).userAgent), f = a[0] || {}, g = f.documentMode, m = /^(Moz|webkit|O|ms)(?=[A-Z])/, k = f.body && f.body.style, l = !1, n = !1;
            if (k) {
                for (var q in k) if (l = m.exec(q)) {
                    h = l[0], h = h.substr(0, 1).toUpperCase() + h.substr(1);
                    break;
                }
                h || (h = "WebkitOpacity" in k && "webkit"), l = !!("transition" in k || h + "Transition" in k), 
                n = !!("animation" in k || h + "Animation" in k), !d || l && n || (l = x(f.body.style.webkitTransition), 
                n = x(f.body.style.webkitAnimation));
            }
            return {
                history: !(!b.history || !b.history.pushState || 4 > d || e),
                hashchange: "onhashchange" in b && (!g || 7 < g),
                hasEvent: function(a) {
                    if ("input" == a && 9 == P) return !1;
                    if (E(c[a])) {
                        var b = f.createElement("div");
                        c[a] = "on" + a in b;
                    }
                    return c[a];
                },
                csp: Tb(),
                vendorPrefix: h,
                transitions: l,
                animations: n,
                android: d,
                msie: P,
                msieDocumentMode: g
            };
        } ];
    }
    function be() {
        this.$get = [ "$rootScope", "$browser", "$q", "$exceptionHandler", function(b, a, c, d) {
            function e(e, h, m) {
                var k = c.defer(), l = k.promise, n = u(m) && !m;
                return h = a.defer(function() {
                    try {
                        k.resolve(e());
                    } catch (a) {
                        k.reject(a), d(a);
                    } finally {
                        delete f[l.$$timeoutId];
                    }
                    n || b.$apply();
                }, h), l.$$timeoutId = h, f[h] = k, l;
            }
            var f = {};
            return e.cancel = function(b) {
                return !!(b && b.$$timeoutId in f) && (f[b.$$timeoutId].reject("canceled"), delete f[b.$$timeoutId], 
                a.defer.cancel(b.$$timeoutId));
            }, e;
        } ];
    }
    function pa(b, a) {
        var c = b;
        return P && (V.setAttribute("href", c), c = V.href), V.setAttribute("href", c), 
        {
            href: V.href,
            protocol: V.protocol ? V.protocol.replace(/:$/, "") : "",
            host: V.host,
            search: V.search ? V.search.replace(/^\?/, "") : "",
            hash: V.hash ? V.hash.replace(/^#/, "") : "",
            hostname: V.hostname,
            port: V.port,
            pathname: "/" === V.pathname.charAt(0) ? V.pathname : "/" + V.pathname
        };
    }
    function Gb(b) {
        return b = x(b) ? pa(b) : b, b.protocol === Fc.protocol && b.host === Fc.host;
    }
    function ce() {
        this.$get = Y(Q);
    }
    function ec(b) {
        function a(d, e) {
            if (W(d)) {
                var f = {};
                return r(d, function(b, c) {
                    f[c] = a(c, b);
                }), f;
            }
            return b.factory(d + c, e);
        }
        var c = "Filter";
        this.register = a, this.$get = [ "$injector", function(a) {
            return function(b) {
                return a.get(b + c);
            };
        } ], a("currency", Gc), a("date", Hc), a("filter", xe), a("json", ye), a("limitTo", ze), 
        a("lowercase", Ae), a("number", Ic), a("orderBy", Jc), a("uppercase", Be);
    }
    function xe() {
        return function(b, a, c) {
            if (!M(b)) return b;
            var d = typeof c, e = [];
            e.check = function(a) {
                for (var b = 0; b < e.length; b++) if (!e[b](a)) return !1;
                return !0;
            }, "function" !== d && (c = "boolean" === d && c ? function(a, b) {
                return Ca.equals(a, b);
            } : function(a, b) {
                if (a && b && "object" == typeof a && "object" == typeof b) {
                    for (var d in a) if ("$" !== d.charAt(0) && Dc.call(a, d) && c(a[d], b[d])) return !0;
                    return !1;
                }
                return b = ("" + b).toLowerCase(), -1 < ("" + a).toLowerCase().indexOf(b);
            });
            var f = function(a, b) {
                if ("string" == typeof b && "!" === b.charAt(0)) return !f(a, b.substr(1));
                switch (typeof a) {
                  case "boolean":
                  case "number":
                  case "string":
                    return c(a, b);

                  case "object":
                    switch (typeof b) {
                      case "object":
                        return c(a, b);

                      default:
                        for (var d in a) if ("$" !== d.charAt(0) && f(a[d], b)) return !0;
                    }
                    return !1;

                  case "array":
                    for (d = 0; d < a.length; d++) if (f(a[d], b)) return !0;
                    return !1;

                  default:
                    return !1;
                }
            };
            switch (typeof a) {
              case "boolean":
              case "number":
              case "string":
                a = {
                    $: a
                };

              case "object":
                for (var g in a) (function(b) {
                    "undefined" != typeof a[b] && e.push(function(c) {
                        return f("$" == b ? c : c && c[b], a[b]);
                    });
                })(g);
                break;

              case "function":
                e.push(a);
                break;

              default:
                return b;
            }
            for (d = [], g = 0; g < b.length; g++) {
                var h = b[g];
                e.check(h) && d.push(h);
            }
            return d;
        };
    }
    function Gc(b) {
        var a = b.NUMBER_FORMATS;
        return function(b, d) {
            return E(d) && (d = a.CURRENCY_SYM), Kc(b, a.PATTERNS[1], a.GROUP_SEP, a.DECIMAL_SEP, 2).replace(/\u00A4/g, d);
        };
    }
    function Ic(b) {
        var a = b.NUMBER_FORMATS;
        return function(b, d) {
            return Kc(b, a.PATTERNS[0], a.GROUP_SEP, a.DECIMAL_SEP, d);
        };
    }
    function Kc(b, a, c, d, e) {
        if (null == b || !isFinite(b) || W(b)) return "";
        var f = 0 > b;
        b = Math.abs(b);
        var g = b + "", h = "", m = [], k = !1;
        if (-1 !== g.indexOf("e")) {
            var l = g.match(/([\d\.]+)e(-?)(\d+)/);
            l && "-" == l[2] && l[3] > e + 1 ? g = "0" : (h = g, k = !0);
        }
        if (k) 0 < e && -1 < b && 1 > b && (h = b.toFixed(e)); else {
            g = (g.split(Lc)[1] || "").length, E(e) && (e = Math.min(Math.max(a.minFrac, g), a.maxFrac)), 
            g = Math.pow(10, e), b = Math.round(b * g) / g, b = ("" + b).split(Lc), g = b[0], 
            b = b[1] || "";
            var l = 0, n = a.lgSize, q = a.gSize;
            if (g.length >= n + q) for (l = g.length - n, k = 0; k < l; k++) 0 === (l - k) % q && 0 !== k && (h += c), 
            h += g.charAt(k);
            for (k = l; k < g.length; k++) 0 === (g.length - k) % n && 0 !== k && (h += c), 
            h += g.charAt(k);
            for (;b.length < e; ) b += "0";
            e && "0" !== e && (h += d + b.substr(0, e));
        }
        return m.push(f ? a.negPre : a.posPre), m.push(h), m.push(f ? a.negSuf : a.posSuf), 
        m.join("");
    }
    function Mb(b, a, c) {
        var d = "";
        for (0 > b && (d = "-", b = -b), b = "" + b; b.length < a; ) b = "0" + b;
        return c && (b = b.substr(b.length - a)), d + b;
    }
    function X(b, a, c, d) {
        return c = c || 0, function(e) {
            return e = e["get" + b](), (0 < c || e > -c) && (e += c), 0 === e && -12 == c && (e = 12), 
            Mb(e, a, d);
        };
    }
    function ob(b, a) {
        return function(c, d) {
            var e = c["get" + b](), f = Da(a ? "SHORT" + b : b);
            return d[f][e];
        };
    }
    function Hc(b) {
        function a(a) {
            var b;
            if (b = a.match(c)) {
                a = new Date(0);
                var f = 0, g = 0, h = b[8] ? a.setUTCFullYear : a.setFullYear, m = b[8] ? a.setUTCHours : a.setHours;
                b[9] && (f = R(b[9] + b[10]), g = R(b[9] + b[11])), h.call(a, R(b[1]), R(b[2]) - 1, R(b[3])), 
                f = R(b[4] || 0) - f, g = R(b[5] || 0) - g, h = R(b[6] || 0), b = Math.round(1e3 * parseFloat("0." + (b[7] || 0))), 
                m.call(a, f, g, h, b);
            }
            return a;
        }
        var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(c, e) {
            var h, m, f = "", g = [];
            if (e = e || "mediumDate", e = b.DATETIME_FORMATS[e] || e, x(c) && (c = Ce.test(c) ? R(c) : a(c)), 
            ub(c) && (c = new Date(c)), !Ma(c)) return c;
            for (;e; ) (m = De.exec(e)) ? (g = g.concat(va.call(m, 1)), e = g.pop()) : (g.push(e), 
            e = null);
            return r(g, function(a) {
                h = Ee[a], f += h ? h(c, b.DATETIME_FORMATS) : a.replace(/(^'|'$)/g, "").replace(/''/g, "'");
            }), f;
        };
    }
    function ye() {
        return function(b) {
            return oa(b, !0);
        };
    }
    function ze() {
        return function(b, a) {
            if (!M(b) && !x(b)) return b;
            if (a = R(a), x(b)) return a ? 0 <= a ? b.slice(0, a) : b.slice(a, b.length) : "";
            var d, e, c = [];
            for (a > b.length ? a = b.length : a < -b.length && (a = -b.length), 0 < a ? (d = 0, 
            e = a) : (d = b.length + a, e = b.length); d < e; d++) c.push(b[d]);
            return c;
        };
    }
    function Jc(b) {
        return function(a, c, d) {
            function e(a, b) {
                return Pa(b) ? function(b, c) {
                    return a(c, b);
                } : a;
            }
            function f(a, b) {
                var c = typeof a, d = typeof b;
                return c == d ? ("string" == c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : a < b ? -1 : 1) : c < d ? -1 : 1;
            }
            if (!M(a) || !c) return a;
            c = M(c) ? c : [ c ], c = Sc(c, function(a) {
                var c = !1, d = a || Ba;
                if (x(a) && ("+" != a.charAt(0) && "-" != a.charAt(0) || (c = "-" == a.charAt(0), 
                a = a.substring(1)), d = b(a), d.constant)) {
                    var h = d();
                    return e(function(a, b) {
                        return f(a[h], b[h]);
                    }, c);
                }
                return e(function(a, b) {
                    return f(d(a), d(b));
                }, c);
            });
            for (var g = [], h = 0; h < a.length; h++) g.push(a[h]);
            return g.sort(e(function(a, b) {
                for (var d = 0; d < c.length; d++) {
                    var e = c[d](a, b);
                    if (0 !== e) return e;
                }
                return 0;
            }, d));
        };
    }
    function sa(b) {
        return D(b) && (b = {
            link: b
        }), b.restrict = b.restrict || "AC", Y(b);
    }
    function Mc(b, a, c, d) {
        function e(a, c) {
            c = c ? "-" + eb(c, "-") : "", d.removeClass(b, (a ? pb : qb) + c), d.addClass(b, (a ? qb : pb) + c);
        }
        var f = this, g = b.parent().controller("form") || rb, h = 0, m = f.$error = {}, k = [];
        f.$name = a.name || a.ngForm, f.$dirty = !1, f.$pristine = !0, f.$valid = !0, f.$invalid = !1, 
        g.$addControl(f), b.addClass(Ka), e(!0), f.$addControl = function(a) {
            xa(a.$name, "input"), k.push(a), a.$name && (f[a.$name] = a);
        }, f.$removeControl = function(a) {
            a.$name && f[a.$name] === a && delete f[a.$name], r(m, function(b, c) {
                f.$setValidity(c, !0, a);
            }), Na(k, a);
        }, f.$setValidity = function(a, b, c) {
            var d = m[a];
            if (b) d && (Na(d, c), d.length || (h--, h || (e(b), f.$valid = !0, f.$invalid = !1), 
            m[a] = !1, e(!0, a), g.$setValidity(a, !0, f))); else {
                if (h || e(b), d) {
                    if (-1 != cb(d, c)) return;
                } else m[a] = d = [], h++, e(!1, a), g.$setValidity(a, !1, f);
                d.push(c), f.$valid = !1, f.$invalid = !0;
            }
        }, f.$setDirty = function() {
            d.removeClass(b, Ka), d.addClass(b, sb), f.$dirty = !0, f.$pristine = !1, g.$setDirty();
        }, f.$setPristine = function() {
            d.removeClass(b, sb), d.addClass(b, Ka), f.$dirty = !1, f.$pristine = !0, r(k, function(a) {
                a.$setPristine();
            });
        };
    }
    function na(b, a, c, d) {
        return b.$setValidity(a, c), c ? d : s;
    }
    function Fe(b, a, c) {
        var d = c.prop("validity");
        W(d) && (c = function(c) {
            return b.$error[a] || !(d.badInput || d.customError || d.typeMismatch) || d.valueMissing ? c : void b.$setValidity(a, !1);
        }, b.$parsers.push(c), b.$formatters.push(c));
    }
    function tb(b, a, c, d, e, f) {
        var g = a.prop("validity");
        if (!e.android) {
            var h = !1;
            a.on("compositionstart", function(a) {
                h = !0;
            }), a.on("compositionend", function() {
                h = !1, m();
            });
        }
        var m = function() {
            if (!h) {
                var e = a.val();
                Pa(c.ngTrim || "T") && (e = aa(e)), (d.$viewValue !== e || g && "" === e && !g.valueMissing) && (b.$$phase ? d.$setViewValue(e) : b.$apply(function() {
                    d.$setViewValue(e);
                }));
            }
        };
        if (e.hasEvent("input")) a.on("input", m); else {
            var k, l = function() {
                k || (k = f.defer(function() {
                    m(), k = null;
                }));
            };
            a.on("keydown", function(a) {
                a = a.keyCode, 91 === a || 15 < a && 19 > a || 37 <= a && 40 >= a || l();
            }), e.hasEvent("paste") && a.on("paste cut", l);
        }
        a.on("change", m), d.$render = function() {
            a.val(d.$isEmpty(d.$viewValue) ? "" : d.$viewValue);
        };
        var n = c.ngPattern;
        if (n && ((e = n.match(/^\/(.*)\/([gim]*)$/)) ? (n = RegExp(e[1], e[2]), e = function(a) {
            return na(d, "pattern", d.$isEmpty(a) || n.test(a), a);
        }) : e = function(c) {
            var e = b.$eval(n);
            if (!e || !e.test) throw z("ngPattern")("noregexp", n, e, fa(a));
            return na(d, "pattern", d.$isEmpty(c) || e.test(c), c);
        }, d.$formatters.push(e), d.$parsers.push(e)), c.ngMinlength) {
            var q = R(c.ngMinlength);
            e = function(a) {
                return na(d, "minlength", d.$isEmpty(a) || a.length >= q, a);
            }, d.$parsers.push(e), d.$formatters.push(e);
        }
        if (c.ngMaxlength) {
            var p = R(c.ngMaxlength);
            e = function(a) {
                return na(d, "maxlength", d.$isEmpty(a) || a.length <= p, a);
            }, d.$parsers.push(e), d.$formatters.push(e);
        }
    }
    function Nb(b, a) {
        return b = "ngClass" + b, function() {
            return {
                restrict: "AC",
                link: function(c, d, e) {
                    function f(b) {
                        if (!0 === a || c.$index % 2 === a) {
                            var d = g(b || "");
                            h ? ua(b, h) || e.$updateClass(d, g(h)) : e.$addClass(d);
                        }
                        h = $(b);
                    }
                    function g(a) {
                        if (M(a)) return a.join(" ");
                        if (W(a)) {
                            var b = [];
                            return r(a, function(a, c) {
                                a && b.push(c);
                            }), b.join(" ");
                        }
                        return a;
                    }
                    var h;
                    c.$watch(e[b], f, !0), e.$observe("class", function(a) {
                        f(c.$eval(e[b]));
                    }), "ngClass" !== b && c.$watch("$index", function(d, f) {
                        var h = 1 & d;
                        if (h !== f & 1) {
                            var n = g(c.$eval(e[b]));
                            h === a ? e.$addClass(n) : e.$removeClass(n);
                        }
                    });
                }
            };
        };
    }
    var P, w, Ea, Ra, Ia, O = function(b) {
        return x(b) ? b.toLowerCase() : b;
    }, Dc = Object.prototype.hasOwnProperty, Da = function(b) {
        return x(b) ? b.toUpperCase() : b;
    }, va = [].slice, Ge = [].push, ta = Object.prototype.toString, Oa = z("ng"), Ca = Q.angular || (Q.angular = {}), ia = [ "0", "0", "0" ];
    P = R((/msie (\d+)/.exec(O(navigator.userAgent)) || [])[1]), isNaN(P) && (P = R((/trident\/.*; rv:(\d+)/.exec(O(navigator.userAgent)) || [])[1])), 
    B.$inject = [], Ba.$inject = [];
    var aa = function() {
        return String.prototype.trim ? function(b) {
            return x(b) ? b.trim() : b;
        } : function(b) {
            return x(b) ? b.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : b;
        };
    }();
    Ia = 9 > P ? function(b) {
        return b = b.nodeName ? b : b[0], b.scopeName && "HTML" != b.scopeName ? Da(b.scopeName + ":" + b.nodeName) : b.nodeName;
    } : function(b) {
        return b.nodeName ? b.nodeName : b[0].nodeName;
    };
    var Vc = /[A-Z]/g, Yc = {
        full: "1.2.15",
        major: 1,
        minor: 2,
        dot: 15,
        codeName: "beer-underestimating"
    }, Ta = L.cache = {}, fb = L.expando = "ng-" + new Date().getTime(), he = 1, Nc = Q.document.addEventListener ? function(b, a, c) {
        b.addEventListener(a, c, !1);
    } : function(b, a, c) {
        b.attachEvent("on" + a, c);
    }, Db = Q.document.removeEventListener ? function(b, a, c) {
        b.removeEventListener(a, c, !1);
    } : function(b, a, c) {
        b.detachEvent("on" + a, c);
    };
    L._data = function(b) {
        return this.cache[b[this.expando]] || {};
    };
    var fe = /([\:\-\_]+(.))/g, ge = /^moz([A-Z])/, Ab = z("jqLite"), Ha = L.prototype = {
        ready: function(b) {
            function a() {
                c || (c = !0, b());
            }
            var c = !1;
            "complete" === T.readyState ? setTimeout(a) : (this.on("DOMContentLoaded", a), L(Q).on("load", a));
        },
        toString: function() {
            var b = [];
            return r(this, function(a) {
                b.push("" + a);
            }), "[" + b.join(", ") + "]";
        },
        eq: function(b) {
            return w(0 <= b ? this[b] : this[this.length + b]);
        },
        length: 0,
        push: Ge,
        sort: [].sort,
        splice: [].splice
    }, jb = {};
    r("multiple selected checked disabled readOnly required open".split(" "), function(b) {
        jb[O(b)] = b;
    });
    var lc = {};
    r("input select option textarea button form details".split(" "), function(b) {
        lc[Da(b)] = !0;
    }), r({
        data: hc,
        inheritedData: ib,
        scope: function(b) {
            return w(b).data("$scope") || ib(b.parentNode || b, [ "$isolateScope", "$scope" ]);
        },
        isolateScope: function(b) {
            return w(b).data("$isolateScope") || w(b).data("$isolateScopeNoTemplate");
        },
        controller: ic,
        injector: function(b) {
            return ib(b, "$injector");
        },
        removeAttr: function(b, a) {
            b.removeAttribute(a);
        },
        hasClass: Eb,
        css: function(b, a, c) {
            if (a = Sa(a), !u(c)) {
                var d;
                return 8 >= P && (d = b.currentStyle && b.currentStyle[a], "" === d && (d = "auto")), 
                d = d || b.style[a], 8 >= P && (d = "" === d ? s : d), d;
            }
            b.style[a] = c;
        },
        attr: function(b, a, c) {
            var d = O(a);
            if (jb[d]) {
                if (!u(c)) return b[a] || (b.attributes.getNamedItem(a) || B).specified ? d : s;
                c ? (b[a] = !0, b.setAttribute(a, d)) : (b[a] = !1, b.removeAttribute(d));
            } else if (u(c)) b.setAttribute(a, c); else if (b.getAttribute) return b = b.getAttribute(a, 2), 
            null === b ? s : b;
        },
        prop: function(b, a, c) {
            return u(c) ? void (b[a] = c) : b[a];
        },
        text: function() {
            function b(b, d) {
                var e = a[b.nodeType];
                return E(d) ? e ? b[e] : "" : void (b[e] = d);
            }
            var a = [];
            return 9 > P ? (a[1] = "innerText", a[3] = "nodeValue") : a[1] = a[3] = "textContent", 
            b.$dv = "", b;
        }(),
        val: function(b, a) {
            if (E(a)) {
                if ("SELECT" === Ia(b) && b.multiple) {
                    var c = [];
                    return r(b.options, function(a) {
                        a.selected && c.push(a.value || a.text);
                    }), 0 === c.length ? null : c;
                }
                return b.value;
            }
            b.value = a;
        },
        html: function(b, a) {
            if (E(a)) return b.innerHTML;
            for (var c = 0, d = b.childNodes; c < d.length; c++) Fa(d[c]);
            b.innerHTML = a;
        },
        empty: jc
    }, function(b, a) {
        L.prototype[a] = function(a, d) {
            var e, f;
            if (b !== jc && (2 == b.length && b !== Eb && b !== ic ? a : d) === s) {
                if (W(a)) {
                    for (e = 0; e < this.length; e++) if (b === hc) b(this[e], a); else for (f in a) b(this[e], f, a[f]);
                    return this;
                }
                e = b.$dv, f = e === s ? Math.min(this.length, 1) : this.length;
                for (var g = 0; g < f; g++) {
                    var h = b(this[g], a, d);
                    e = e ? e + h : h;
                }
                return e;
            }
            for (e = 0; e < this.length; e++) b(this[e], a, d);
            return this;
        };
    }), r({
        removeData: fc,
        dealoc: Fa,
        on: function a(c, d, e, f) {
            if (u(f)) throw Ab("onargs");
            var g = ja(c, "events"), h = ja(c, "handle");
            g || ja(c, "events", g = {}), h || ja(c, "handle", h = ie(c, g)), r(d.split(" "), function(d) {
                var f = g[d];
                if (!f) {
                    if ("mouseenter" == d || "mouseleave" == d) {
                        var l = T.body.contains || T.body.compareDocumentPosition ? function(a, c) {
                            var d = 9 === a.nodeType ? a.documentElement : a, e = c && c.parentNode;
                            return a === e || !(!e || 1 !== e.nodeType || !(d.contains ? d.contains(e) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(e)));
                        } : function(a, c) {
                            if (c) for (;c = c.parentNode; ) if (c === a) return !0;
                            return !1;
                        };
                        g[d] = [], a(c, {
                            mouseleave: "mouseout",
                            mouseenter: "mouseover"
                        }[d], function(a) {
                            var c = a.relatedTarget;
                            c && (c === this || l(this, c)) || h(a, d);
                        });
                    } else Nc(c, d, h), g[d] = [];
                    f = g[d];
                }
                f.push(e);
            });
        },
        off: gc,
        one: function(a, c, d) {
            a = w(a), a.on(c, function f() {
                a.off(c, d), a.off(c, f);
            }), a.on(c, d);
        },
        replaceWith: function(a, c) {
            var d, e = a.parentNode;
            Fa(a), r(new L(c), function(c) {
                d ? e.insertBefore(c, d.nextSibling) : e.replaceChild(c, a), d = c;
            });
        },
        children: function(a) {
            var c = [];
            return r(a.childNodes, function(a) {
                1 === a.nodeType && c.push(a);
            }), c;
        },
        contents: function(a) {
            return a.contentDocument || a.childNodes || [];
        },
        append: function(a, c) {
            r(new L(c), function(c) {
                1 !== a.nodeType && 11 !== a.nodeType || a.appendChild(c);
            });
        },
        prepend: function(a, c) {
            if (1 === a.nodeType) {
                var d = a.firstChild;
                r(new L(c), function(c) {
                    a.insertBefore(c, d);
                });
            }
        },
        wrap: function(a, c) {
            c = w(c)[0];
            var d = a.parentNode;
            d && d.replaceChild(c, a), c.appendChild(a);
        },
        remove: function(a) {
            Fa(a);
            var c = a.parentNode;
            c && c.removeChild(a);
        },
        after: function(a, c) {
            var d = a, e = a.parentNode;
            r(new L(c), function(a) {
                e.insertBefore(a, d.nextSibling), d = a;
            });
        },
        addClass: hb,
        removeClass: gb,
        toggleClass: function(a, c, d) {
            c && r(c.split(" "), function(c) {
                var f = d;
                E(f) && (f = !Eb(a, c)), (f ? hb : gb)(a, c);
            });
        },
        parent: function(a) {
            return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
        },
        next: function(a) {
            if (a.nextElementSibling) return a.nextElementSibling;
            for (a = a.nextSibling; null != a && 1 !== a.nodeType; ) a = a.nextSibling;
            return a;
        },
        find: function(a, c) {
            return a.getElementsByTagName ? a.getElementsByTagName(c) : [];
        },
        clone: Cb,
        triggerHandler: function(a, c, d) {
            c = (ja(a, "events") || {})[c], d = d || [];
            var e = [ {
                preventDefault: B,
                stopPropagation: B
            } ];
            r(c, function(c) {
                c.apply(a, e.concat(d));
            });
        }
    }, function(a, c) {
        L.prototype[c] = function(c, e, f) {
            for (var g, h = 0; h < this.length; h++) E(g) ? (g = a(this[h], c, e, f), u(g) && (g = w(g))) : Bb(g, a(this[h], c, e, f));
            return u(g) ? g : this;
        }, L.prototype.bind = L.prototype.on, L.prototype.unbind = L.prototype.off;
    }), Ua.prototype = {
        put: function(a, c) {
            this[Ga(a)] = c;
        },
        get: function(a) {
            return this[Ga(a)];
        },
        remove: function(a) {
            var c = this[a = Ga(a)];
            return delete this[a], c;
        }
    };
    var ke = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, le = /,/, me = /^\s*(_?)(\S+?)\1\s*$/, je = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, Va = z("$injector"), He = z("$animate"), Jd = [ "$provide", function(a) {
        this.$$selectors = {}, this.register = function(c, d) {
            var e = c + "-animation";
            if (c && "." != c.charAt(0)) throw He("notcsel", c);
            this.$$selectors[c.substr(1)] = e, a.factory(e, d);
        }, this.classNameFilter = function(a) {
            return 1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null), 
            this.$$classNameFilter;
        }, this.$get = [ "$timeout", "$$asyncCallback", function(a, d) {
            return {
                enter: function(a, c, g, h) {
                    g ? g.after(a) : (c && c[0] || (c = g.parent()), c.append(a)), h && d(h);
                },
                leave: function(a, c) {
                    a.remove(), c && d(c);
                },
                move: function(a, c, d, h) {
                    this.enter(a, c, d, h);
                },
                addClass: function(a, c, g) {
                    c = x(c) ? c : M(c) ? c.join(" ") : "", r(a, function(a) {
                        hb(a, c);
                    }), g && d(g);
                },
                removeClass: function(a, c, g) {
                    c = x(c) ? c : M(c) ? c.join(" ") : "", r(a, function(a) {
                        gb(a, c);
                    }), g && d(g);
                },
                setClass: function(a, c, g, h) {
                    r(a, function(a) {
                        hb(a, c), gb(a, g);
                    }), h && d(h);
                },
                enabled: B
            };
        } ];
    } ], ha = z("$compile");
    ac.$inject = [ "$provide", "$$sanitizeUriProvider" ];
    var pe = /^(x[\:\-_]|data[\:\-_])/i, tc = z("$interpolate"), Ie = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, se = {
        http: 80,
        https: 443,
        ftp: 21
    }, Ib = z("$location");
    yc.prototype = Jb.prototype = xc.prototype = {
        $$html5: !1,
        $$replace: !1,
        absUrl: mb("$$absUrl"),
        url: function(a, c) {
            if (E(a)) return this.$$url;
            var d = Ie.exec(a);
            return d[1] && this.path(decodeURIComponent(d[1])), (d[2] || d[1]) && this.search(d[3] || ""), 
            this.hash(d[5] || "", c), this;
        },
        protocol: mb("$$protocol"),
        host: mb("$$host"),
        port: mb("$$port"),
        path: zc("$$path", function(a) {
            return "/" == a.charAt(0) ? a : "/" + a;
        }),
        search: function(a, c) {
            switch (arguments.length) {
              case 0:
                return this.$$search;

              case 1:
                if (x(a)) this.$$search = Wb(a); else {
                    if (!W(a)) throw Ib("isrcharg");
                    this.$$search = a;
                }
                break;

              default:
                E(c) || null === c ? delete this.$$search[a] : this.$$search[a] = c;
            }
            return this.$$compose(), this;
        },
        hash: zc("$$hash", Ba),
        replace: function() {
            return this.$$replace = !0, this;
        }
    };
    var qa, za = z("$parse"), Cc = {}, La = {
        null: function() {
            return null;
        },
        true: function() {
            return !0;
        },
        false: function() {
            return !1;
        },
        undefined: B,
        "+": function(a, c, d, e) {
            return d = d(a, c), e = e(a, c), u(d) ? u(e) ? d + e : d : u(e) ? e : s;
        },
        "-": function(a, c, d, e) {
            return d = d(a, c), e = e(a, c), (u(d) ? d : 0) - (u(e) ? e : 0);
        },
        "*": function(a, c, d, e) {
            return d(a, c) * e(a, c);
        },
        "/": function(a, c, d, e) {
            return d(a, c) / e(a, c);
        },
        "%": function(a, c, d, e) {
            return d(a, c) % e(a, c);
        },
        "^": function(a, c, d, e) {
            return d(a, c) ^ e(a, c);
        },
        "=": B,
        "===": function(a, c, d, e) {
            return d(a, c) === e(a, c);
        },
        "!==": function(a, c, d, e) {
            return d(a, c) !== e(a, c);
        },
        "==": function(a, c, d, e) {
            return d(a, c) == e(a, c);
        },
        "!=": function(a, c, d, e) {
            return d(a, c) != e(a, c);
        },
        "<": function(a, c, d, e) {
            return d(a, c) < e(a, c);
        },
        ">": function(a, c, d, e) {
            return d(a, c) > e(a, c);
        },
        "<=": function(a, c, d, e) {
            return d(a, c) <= e(a, c);
        },
        ">=": function(a, c, d, e) {
            return d(a, c) >= e(a, c);
        },
        "&&": function(a, c, d, e) {
            return d(a, c) && e(a, c);
        },
        "||": function(a, c, d, e) {
            return d(a, c) || e(a, c);
        },
        "&": function(a, c, d, e) {
            return d(a, c) & e(a, c);
        },
        "|": function(a, c, d, e) {
            return e(a, c)(a, c, d(a, c));
        },
        "!": function(a, c, d) {
            return !d(a, c);
        }
    }, Je = {
        n: "\n",
        f: "\f",
        r: "\r",
        t: "\t",
        v: "\v",
        "'": "'",
        '"': '"'
    }, Lb = function(a) {
        this.options = a;
    };
    Lb.prototype = {
        constructor: Lb,
        lex: function(a) {
            this.text = a, this.index = 0, this.ch = s, this.lastCh = ":", this.tokens = [];
            var c;
            for (a = []; this.index < this.text.length; ) {
                if (this.ch = this.text.charAt(this.index), this.is("\"'")) this.readString(this.ch); else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) this.readNumber(); else if (this.isIdent(this.ch)) this.readIdent(), 
                this.was("{,") && "{" === a[0] && (c = this.tokens[this.tokens.length - 1]) && (c.json = -1 === c.text.indexOf(".")); else if (this.is("(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: this.ch,
                    json: this.was(":[,") && this.is("{[") || this.is("}]:,")
                }), this.is("{[") && a.unshift(this.ch), this.is("}]") && a.shift(), this.index++; else {
                    if (this.isWhitespace(this.ch)) {
                        this.index++;
                        continue;
                    }
                    var d = this.ch + this.peek(), e = d + this.peek(2), f = La[this.ch], g = La[d], h = La[e];
                    h ? (this.tokens.push({
                        index: this.index,
                        text: e,
                        fn: h
                    }), this.index += 3) : g ? (this.tokens.push({
                        index: this.index,
                        text: d,
                        fn: g
                    }), this.index += 2) : f ? (this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: f,
                        json: this.was("[,:") && this.is("+-")
                    }), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1);
                }
                this.lastCh = this.ch;
            }
            return this.tokens;
        },
        is: function(a) {
            return -1 !== a.indexOf(this.ch);
        },
        was: function(a) {
            return -1 !== a.indexOf(this.lastCh);
        },
        peek: function(a) {
            return a = a || 1, this.index + a < this.text.length && this.text.charAt(this.index + a);
        },
        isNumber: function(a) {
            return "0" <= a && "9" >= a;
        },
        isWhitespace: function(a) {
            return " " === a || "\r" === a || "\t" === a || "\n" === a || "\v" === a || " " === a;
        },
        isIdent: function(a) {
            return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a;
        },
        isExpOperator: function(a) {
            return "-" === a || "+" === a || this.isNumber(a);
        },
        throwError: function(a, c, d) {
            throw d = d || this.index, c = u(c) ? "s " + c + "-" + this.index + " [" + this.text.substring(c, d) + "]" : " " + d, 
            za("lexerr", a, c, this.text);
        },
        readNumber: function() {
            for (var a = "", c = this.index; this.index < this.text.length; ) {
                var d = O(this.text.charAt(this.index));
                if ("." == d || this.isNumber(d)) a += d; else {
                    var e = this.peek();
                    if ("e" == d && this.isExpOperator(e)) a += d; else if (this.isExpOperator(d) && e && this.isNumber(e) && "e" == a.charAt(a.length - 1)) a += d; else {
                        if (!this.isExpOperator(d) || e && this.isNumber(e) || "e" != a.charAt(a.length - 1)) break;
                        this.throwError("Invalid exponent");
                    }
                }
                this.index++;
            }
            a *= 1, this.tokens.push({
                index: c,
                text: a,
                json: !0,
                fn: function() {
                    return a;
                }
            });
        },
        readIdent: function() {
            for (var e, f, g, h, a = this, c = "", d = this.index; this.index < this.text.length && (h = this.text.charAt(this.index), 
            "." === h || this.isIdent(h) || this.isNumber(h)); ) "." === h && (e = this.index), 
            c += h, this.index++;
            if (e) for (f = this.index; f < this.text.length; ) {
                if (h = this.text.charAt(f), "(" === h) {
                    g = c.substr(e - d + 1), c = c.substr(0, e - d), this.index = f;
                    break;
                }
                if (!this.isWhitespace(h)) break;
                f++;
            }
            if (d = {
                index: d,
                text: c
            }, La.hasOwnProperty(c)) d.fn = La[c], d.json = La[c]; else {
                var m = Bc(c, this.options, this.text);
                d.fn = v(function(a, c) {
                    return m(a, c);
                }, {
                    assign: function(d, e) {
                        return nb(d, c, e, a.text, a.options);
                    }
                });
            }
            this.tokens.push(d), g && (this.tokens.push({
                index: e,
                text: ".",
                json: !1
            }), this.tokens.push({
                index: e + 1,
                text: g,
                json: !1
            }));
        },
        readString: function(a) {
            var c = this.index;
            this.index++;
            for (var d = "", e = a, f = !1; this.index < this.text.length; ) {
                var g = this.text.charAt(this.index), e = e + g;
                if (f) "u" === g ? (g = this.text.substring(this.index + 1, this.index + 5), g.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + g + "]"), 
                this.index += 4, d += String.fromCharCode(parseInt(g, 16))) : d = (f = Je[g]) ? d + f : d + g, 
                f = !1; else if ("\\" === g) f = !0; else {
                    if (g === a) return this.index++, void this.tokens.push({
                        index: c,
                        text: e,
                        string: d,
                        json: !0,
                        fn: function() {
                            return d;
                        }
                    });
                    d += g;
                }
                this.index++;
            }
            this.throwError("Unterminated quote", c);
        }
    };
    var Za = function(a, c, d) {
        this.lexer = a, this.$filter = c, this.options = d;
    };
    Za.ZERO = function() {
        return 0;
    }, Za.prototype = {
        constructor: Za,
        parse: function(a, c) {
            this.text = a, this.json = c, this.tokens = this.lexer.lex(a), c && (this.assignment = this.logicalOR, 
            this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function() {
                this.throwError("is not valid json", {
                    text: a,
                    index: 0
                });
            });
            var d = c ? this.primary() : this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), 
            d.literal = !!d.literal, d.constant = !!d.constant, d;
        },
        primary: function() {
            var a;
            if (this.expect("(")) a = this.filterChain(), this.consume(")"); else if (this.expect("[")) a = this.arrayDeclaration(); else if (this.expect("{")) a = this.object(); else {
                var c = this.expect();
                (a = c.fn) || this.throwError("not a primary expression", c), c.json && (a.constant = !0, 
                a.literal = !0);
            }
            for (var d; c = this.expect("(", "[", "."); ) "(" === c.text ? (a = this.functionCall(a, d), 
            d = null) : "[" === c.text ? (d = a, a = this.objectIndex(a)) : "." === c.text ? (d = a, 
            a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE");
            return a;
        },
        throwError: function(a, c) {
            throw za("syntax", c.text, a, c.index + 1, this.text, this.text.substring(c.index));
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw za("ueoe", this.text);
            return this.tokens[0];
        },
        peek: function(a, c, d, e) {
            if (0 < this.tokens.length) {
                var f = this.tokens[0], g = f.text;
                if (g === a || g === c || g === d || g === e || !(a || c || d || e)) return f;
            }
            return !1;
        },
        expect: function(a, c, d, e) {
            return !!(a = this.peek(a, c, d, e)) && (this.json && !a.json && this.throwError("is not valid json", a), 
            this.tokens.shift(), a);
        },
        consume: function(a) {
            this.expect(a) || this.throwError("is unexpected, expecting [" + a + "]", this.peek());
        },
        unaryFn: function(a, c) {
            return v(function(d, e) {
                return a(d, e, c);
            }, {
                constant: c.constant
            });
        },
        ternaryFn: function(a, c, d) {
            return v(function(e, f) {
                return a(e, f) ? c(e, f) : d(e, f);
            }, {
                constant: a.constant && c.constant && d.constant
            });
        },
        binaryFn: function(a, c, d) {
            return v(function(e, f) {
                return c(e, f, a, d);
            }, {
                constant: a.constant && d.constant
            });
        },
        statements: function() {
            for (var a = []; ;) if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), 
            !this.expect(";")) return 1 === a.length ? a[0] : function(c, d) {
                for (var e, f = 0; f < a.length; f++) {
                    var g = a[f];
                    g && (e = g(c, d));
                }
                return e;
            };
        },
        filterChain: function() {
            for (var c, a = this.expression(); ;) {
                if (!(c = this.expect("|"))) return a;
                a = this.binaryFn(a, c.fn, this.filter());
            }
        },
        filter: function() {
            for (var a = this.expect(), c = this.$filter(a.text), d = []; ;) {
                if (!(a = this.expect(":"))) {
                    var e = function(a, e, h) {
                        h = [ h ];
                        for (var m = 0; m < d.length; m++) h.push(d[m](a, e));
                        return c.apply(a, h);
                    };
                    return function() {
                        return e;
                    };
                }
                d.push(this.expression());
            }
        },
        expression: function() {
            return this.assignment();
        },
        assignment: function() {
            var c, d, a = this.ternary();
            return (d = this.expect("=")) ? (a.assign || this.throwError("implies assignment but [" + this.text.substring(0, d.index) + "] can not be assigned to", d), 
            c = this.ternary(), function(d, f) {
                return a.assign(d, c(d, f), f);
            }) : a;
        },
        ternary: function() {
            var c, d, a = this.logicalOR();
            return this.expect("?") ? (c = this.ternary(), (d = this.expect(":")) ? this.ternaryFn(a, c, this.ternary()) : void this.throwError("expected :", d)) : a;
        },
        logicalOR: function() {
            for (var c, a = this.logicalAND(); ;) {
                if (!(c = this.expect("||"))) return a;
                a = this.binaryFn(a, c.fn, this.logicalAND());
            }
        },
        logicalAND: function() {
            var c, a = this.equality();
            return (c = this.expect("&&")) && (a = this.binaryFn(a, c.fn, this.logicalAND())), 
            a;
        },
        equality: function() {
            var c, a = this.relational();
            return (c = this.expect("==", "!=", "===", "!==")) && (a = this.binaryFn(a, c.fn, this.equality())), 
            a;
        },
        relational: function() {
            var c, a = this.additive();
            return (c = this.expect("<", ">", "<=", ">=")) && (a = this.binaryFn(a, c.fn, this.relational())), 
            a;
        },
        additive: function() {
            for (var c, a = this.multiplicative(); c = this.expect("+", "-"); ) a = this.binaryFn(a, c.fn, this.multiplicative());
            return a;
        },
        multiplicative: function() {
            for (var c, a = this.unary(); c = this.expect("*", "/", "%"); ) a = this.binaryFn(a, c.fn, this.unary());
            return a;
        },
        unary: function() {
            var a;
            return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(Za.ZERO, a.fn, this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.fn, this.unary()) : this.primary();
        },
        fieldAccess: function(a) {
            var c = this, d = this.expect().text, e = Bc(d, this.options, this.text);
            return v(function(c, d, h) {
                return e(h || a(c, d));
            }, {
                assign: function(e, g, h) {
                    return nb(a(e, h), d, g, c.text, c.options);
                }
            });
        },
        objectIndex: function(a) {
            var c = this, d = this.expression();
            return this.consume("]"), v(function(e, f) {
                var m, g = a(e, f), h = d(e, f);
                return g ? ((g = Ya(g[h], c.text)) && g.then && c.options.unwrapPromises && (m = g, 
                "$$v" in g || (m.$$v = s, m.then(function(a) {
                    m.$$v = a;
                })), g = g.$$v), g) : s;
            }, {
                assign: function(e, f, g) {
                    var h = d(e, g);
                    return Ya(a(e, g), c.text)[h] = f;
                }
            });
        },
        functionCall: function(a, c) {
            var d = [];
            if (")" !== this.peekToken().text) do d.push(this.expression()); while (this.expect(","));
            this.consume(")");
            var e = this;
            return function(f, g) {
                for (var h = [], m = c ? c(f, g) : f, k = 0; k < d.length; k++) h.push(d[k](f, g));
                return k = a(f, g, m) || B, Ya(m, e.text), Ya(k, e.text), h = k.apply ? k.apply(m, h) : k(h[0], h[1], h[2], h[3], h[4]), 
                Ya(h, e.text);
            };
        },
        arrayDeclaration: function() {
            var a = [], c = !0;
            if ("]" !== this.peekToken().text) do {
                if (this.peek("]")) break;
                var d = this.expression();
                a.push(d), d.constant || (c = !1);
            } while (this.expect(","));
            return this.consume("]"), v(function(c, d) {
                for (var g = [], h = 0; h < a.length; h++) g.push(a[h](c, d));
                return g;
            }, {
                literal: !0,
                constant: c
            });
        },
        object: function() {
            var a = [], c = !0;
            if ("}" !== this.peekToken().text) do {
                if (this.peek("}")) break;
                var d = this.expect(), d = d.string || d.text;
                this.consume(":");
                var e = this.expression();
                a.push({
                    key: d,
                    value: e
                }), e.constant || (c = !1);
            } while (this.expect(","));
            return this.consume("}"), v(function(c, d) {
                for (var e = {}, m = 0; m < a.length; m++) {
                    var k = a[m];
                    e[k.key] = k.value(c, d);
                }
                return e;
            }, {
                literal: !0,
                constant: c
            });
        }
    };
    var Kb = {}, ra = z("$sce"), ea = {
        HTML: "html",
        CSS: "css",
        URL: "url",
        RESOURCE_URL: "resourceUrl",
        JS: "js"
    }, V = T.createElement("a"), Fc = pa(Q.location.href, !0);
    ec.$inject = [ "$provide" ], Gc.$inject = [ "$locale" ], Ic.$inject = [ "$locale" ];
    var Lc = ".", Ee = {
        yyyy: X("FullYear", 4),
        yy: X("FullYear", 2, 0, !0),
        y: X("FullYear", 1),
        MMMM: ob("Month"),
        MMM: ob("Month", !0),
        MM: X("Month", 2, 1),
        M: X("Month", 1, 1),
        dd: X("Date", 2),
        d: X("Date", 1),
        HH: X("Hours", 2),
        H: X("Hours", 1),
        hh: X("Hours", 2, -12),
        h: X("Hours", 1, -12),
        mm: X("Minutes", 2),
        m: X("Minutes", 1),
        ss: X("Seconds", 2),
        s: X("Seconds", 1),
        sss: X("Milliseconds", 3),
        EEEE: ob("Day"),
        EEE: ob("Day", !0),
        a: function(a, c) {
            return 12 > a.getHours() ? c.AMPMS[0] : c.AMPMS[1];
        },
        Z: function(a) {
            return a = -1 * a.getTimezoneOffset(), a = (0 <= a ? "+" : "") + (Mb(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + Mb(Math.abs(a % 60), 2));
        }
    }, De = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, Ce = /^\-?\d+$/;
    Hc.$inject = [ "$locale" ];
    var Ae = Y(O), Be = Y(Da);
    Jc.$inject = [ "$parse" ];
    var ad = Y({
        restrict: "E",
        compile: function(a, c) {
            if (8 >= P && (c.href || c.name || c.$set("href", ""), a.append(T.createComment("IE fix"))), 
            !c.href && !c.xlinkHref && !c.name) return function(a, c) {
                var f = "[object SVGAnimatedString]" === ta.call(c.prop("href")) ? "xlink:href" : "href";
                c.on("click", function(a) {
                    c.attr(f) || a.preventDefault();
                });
            };
        }
    }), yb = {};
    r(jb, function(a, c) {
        if ("multiple" != a) {
            var d = ka("ng-" + c);
            yb[d] = function() {
                return {
                    priority: 100,
                    link: function(a, f, g) {
                        a.$watch(g[d], function(a) {
                            g.$set(c, !!a);
                        });
                    }
                };
            };
        }
    }), r([ "src", "srcset", "href" ], function(a) {
        var c = ka("ng-" + a);
        yb[c] = function() {
            return {
                priority: 99,
                link: function(d, e, f) {
                    var g = a, h = a;
                    "href" === a && "[object SVGAnimatedString]" === ta.call(e.prop("href")) && (h = "xlinkHref", 
                    f.$attr[h] = "xlink:href", g = null), f.$observe(c, function(a) {
                        a && (f.$set(h, a), P && g && e.prop(g, f[h]));
                    });
                }
            };
        };
    });
    var rb = {
        $addControl: B,
        $removeControl: B,
        $setValidity: B,
        $setDirty: B,
        $setPristine: B
    };
    Mc.$inject = [ "$element", "$attrs", "$scope", "$animate" ];
    var Oc = function(a) {
        return [ "$timeout", function(c) {
            return {
                name: "form",
                restrict: a ? "EAC" : "E",
                controller: Mc,
                compile: function() {
                    return {
                        pre: function(a, e, f, g) {
                            if (!f.action) {
                                var h = function(a) {
                                    a.preventDefault ? a.preventDefault() : a.returnValue = !1;
                                };
                                Nc(e[0], "submit", h), e.on("$destroy", function() {
                                    c(function() {
                                        Db(e[0], "submit", h);
                                    }, 0, !1);
                                });
                            }
                            var m = e.parent().controller("form"), k = f.name || f.ngForm;
                            k && nb(a, k, g, k), m && e.on("$destroy", function() {
                                m.$removeControl(g), k && nb(a, k, s, k), v(g, rb);
                            });
                        }
                    };
                }
            };
        } ];
    }, bd = Oc(), od = Oc(!0), Ke = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, Le = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i, Me = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, Pc = {
        text: tb,
        number: function(a, c, d, e, f, g) {
            tb(a, c, d, e, f, g), e.$parsers.push(function(a) {
                var c = e.$isEmpty(a);
                return c || Me.test(a) ? (e.$setValidity("number", !0), "" === a ? null : c ? a : parseFloat(a)) : (e.$setValidity("number", !1), 
                s);
            }), Fe(e, "number", c), e.$formatters.push(function(a) {
                return e.$isEmpty(a) ? "" : "" + a;
            }), d.min && (a = function(a) {
                var c = parseFloat(d.min);
                return na(e, "min", e.$isEmpty(a) || a >= c, a);
            }, e.$parsers.push(a), e.$formatters.push(a)), d.max && (a = function(a) {
                var c = parseFloat(d.max);
                return na(e, "max", e.$isEmpty(a) || a <= c, a);
            }, e.$parsers.push(a), e.$formatters.push(a)), e.$formatters.push(function(a) {
                return na(e, "number", e.$isEmpty(a) || ub(a), a);
            });
        },
        url: function(a, c, d, e, f, g) {
            tb(a, c, d, e, f, g), a = function(a) {
                return na(e, "url", e.$isEmpty(a) || Ke.test(a), a);
            }, e.$formatters.push(a), e.$parsers.push(a);
        },
        email: function(a, c, d, e, f, g) {
            tb(a, c, d, e, f, g), a = function(a) {
                return na(e, "email", e.$isEmpty(a) || Le.test(a), a);
            }, e.$formatters.push(a), e.$parsers.push(a);
        },
        radio: function(a, c, d, e) {
            E(d.name) && c.attr("name", ab()), c.on("click", function() {
                c[0].checked && a.$apply(function() {
                    e.$setViewValue(d.value);
                });
            }), e.$render = function() {
                c[0].checked = d.value == e.$viewValue;
            }, d.$observe("value", e.$render);
        },
        checkbox: function(a, c, d, e) {
            var f = d.ngTrueValue, g = d.ngFalseValue;
            x(f) || (f = !0), x(g) || (g = !1), c.on("click", function() {
                a.$apply(function() {
                    e.$setViewValue(c[0].checked);
                });
            }), e.$render = function() {
                c[0].checked = e.$viewValue;
            }, e.$isEmpty = function(a) {
                return a !== f;
            }, e.$formatters.push(function(a) {
                return a === f;
            }), e.$parsers.push(function(a) {
                return a ? f : g;
            });
        },
        hidden: B,
        button: B,
        submit: B,
        reset: B,
        file: B
    }, bc = [ "$browser", "$sniffer", function(a, c) {
        return {
            restrict: "E",
            require: "?ngModel",
            link: function(d, e, f, g) {
                g && (Pc[O(f.type)] || Pc.text)(d, e, f, g, c, a);
            }
        };
    } ], qb = "ng-valid", pb = "ng-invalid", Ka = "ng-pristine", sb = "ng-dirty", Ne = [ "$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", function(a, c, d, e, f, g) {
        function h(a, c) {
            c = c ? "-" + eb(c, "-") : "", g.removeClass(e, (a ? pb : qb) + c), g.addClass(e, (a ? qb : pb) + c);
        }
        this.$modelValue = this.$viewValue = Number.NaN, this.$parsers = [], this.$formatters = [], 
        this.$viewChangeListeners = [], this.$pristine = !0, this.$dirty = !1, this.$valid = !0, 
        this.$invalid = !1, this.$name = d.name;
        var m = f(d.ngModel), k = m.assign;
        if (!k) throw z("ngModel")("nonassign", d.ngModel, fa(e));
        this.$render = B, this.$isEmpty = function(a) {
            return E(a) || "" === a || null === a || a !== a;
        };
        var l = e.inheritedData("$formController") || rb, n = 0, q = this.$error = {};
        e.addClass(Ka), h(!0), this.$setValidity = function(a, c) {
            q[a] !== !c && (c ? (q[a] && n--, n || (h(!0), this.$valid = !0, this.$invalid = !1)) : (h(!1), 
            this.$invalid = !0, this.$valid = !1, n++), q[a] = !c, h(c, a), l.$setValidity(a, c, this));
        }, this.$setPristine = function() {
            this.$dirty = !1, this.$pristine = !0, g.removeClass(e, sb), g.addClass(e, Ka);
        }, this.$setViewValue = function(d) {
            this.$viewValue = d, this.$pristine && (this.$dirty = !0, this.$pristine = !1, g.removeClass(e, Ka), 
            g.addClass(e, sb), l.$setDirty()), r(this.$parsers, function(a) {
                d = a(d);
            }), this.$modelValue !== d && (this.$modelValue = d, k(a, d), r(this.$viewChangeListeners, function(a) {
                try {
                    a();
                } catch (d) {
                    c(d);
                }
            }));
        };
        var p = this;
        a.$watch(function() {
            var c = m(a);
            if (p.$modelValue !== c) {
                var d = p.$formatters, e = d.length;
                for (p.$modelValue = c; e--; ) c = d[e](c);
                p.$viewValue !== c && (p.$viewValue = c, p.$render());
            }
            return c;
        });
    } ], Dd = function() {
        return {
            require: [ "ngModel", "^?form" ],
            controller: Ne,
            link: function(a, c, d, e) {
                var f = e[0], g = e[1] || rb;
                g.$addControl(f), a.$on("$destroy", function() {
                    g.$removeControl(f);
                });
            }
        };
    }, Fd = Y({
        require: "ngModel",
        link: function(a, c, d, e) {
            e.$viewChangeListeners.push(function() {
                a.$eval(d.ngChange);
            });
        }
    }), cc = function() {
        return {
            require: "?ngModel",
            link: function(a, c, d, e) {
                if (e) {
                    d.required = !0;
                    var f = function(a) {
                        return d.required && e.$isEmpty(a) ? void e.$setValidity("required", !1) : (e.$setValidity("required", !0), 
                        a);
                    };
                    e.$formatters.push(f), e.$parsers.unshift(f), d.$observe("required", function() {
                        f(e.$viewValue);
                    });
                }
            }
        };
    }, Ed = function() {
        return {
            require: "ngModel",
            link: function(a, c, d, e) {
                var f = (a = /\/(.*)\//.exec(d.ngList)) && RegExp(a[1]) || d.ngList || ",";
                e.$parsers.push(function(a) {
                    if (!E(a)) {
                        var c = [];
                        return a && r(a.split(f), function(a) {
                            a && c.push(aa(a));
                        }), c;
                    }
                }), e.$formatters.push(function(a) {
                    return M(a) ? a.join(", ") : s;
                }), e.$isEmpty = function(a) {
                    return !a || !a.length;
                };
            }
        };
    }, Oe = /^(true|false|\d+)$/, Gd = function() {
        return {
            priority: 100,
            compile: function(a, c) {
                return Oe.test(c.ngValue) ? function(a, c, f) {
                    f.$set("value", a.$eval(f.ngValue));
                } : function(a, c, f) {
                    a.$watch(f.ngValue, function(a) {
                        f.$set("value", a);
                    });
                };
            }
        };
    }, gd = sa(function(a, c, d) {
        c.addClass("ng-binding").data("$binding", d.ngBind), a.$watch(d.ngBind, function(a) {
            c.text(a == s ? "" : a);
        });
    }), id = [ "$interpolate", function(a) {
        return function(c, d, e) {
            c = a(d.attr(e.$attr.ngBindTemplate)), d.addClass("ng-binding").data("$binding", c), 
            e.$observe("ngBindTemplate", function(a) {
                d.text(a);
            });
        };
    } ], hd = [ "$sce", "$parse", function(a, c) {
        return function(d, e, f) {
            e.addClass("ng-binding").data("$binding", f.ngBindHtml);
            var g = c(f.ngBindHtml);
            d.$watch(function() {
                return (g(d) || "").toString();
            }, function(c) {
                e.html(a.getTrustedHtml(g(d)) || "");
            });
        };
    } ], jd = Nb("", !0), ld = Nb("Odd", 0), kd = Nb("Even", 1), md = sa({
        compile: function(a, c) {
            c.$set("ngCloak", s), a.removeClass("ng-cloak");
        }
    }), nd = [ function() {
        return {
            scope: !0,
            controller: "@",
            priority: 500
        };
    } ], dc = {};
    r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(a) {
        var c = ka("ng-" + a);
        dc[c] = [ "$parse", function(d) {
            return {
                compile: function(e, f) {
                    var g = d(f[c]);
                    return function(c, d, e) {
                        d.on(O(a), function(a) {
                            c.$apply(function() {
                                g(c, {
                                    $event: a
                                });
                            });
                        });
                    };
                }
            };
        } ];
    });
    var qd = [ "$animate", function(a) {
        return {
            transclude: "element",
            priority: 600,
            terminal: !0,
            restrict: "A",
            $$tlb: !0,
            link: function(c, d, e, f, g) {
                var h, m, k;
                c.$watch(e.ngIf, function(f) {
                    Pa(f) ? m || (m = c.$new(), g(m, function(c) {
                        c[c.length++] = T.createComment(" end ngIf: " + e.ngIf + " "), h = {
                            clone: c
                        }, a.enter(c, d.parent(), d);
                    })) : (k && (k.remove(), k = null), m && (m.$destroy(), m = null), h && (k = xb(h.clone), 
                    a.leave(k, function() {
                        k = null;
                    }), h = null));
                });
            }
        };
    } ], rd = [ "$http", "$templateCache", "$anchorScroll", "$animate", "$sce", function(a, c, d, e, f) {
        return {
            restrict: "ECA",
            priority: 400,
            terminal: !0,
            transclude: "element",
            controller: Ca.noop,
            compile: function(g, h) {
                var m = h.ngInclude || h.src, k = h.onload || "", l = h.autoscroll;
                return function(g, h, p, r, s) {
                    var A, w, F, v = 0, y = function() {
                        w && (w.remove(), w = null), A && (A.$destroy(), A = null), F && (e.leave(F, function() {
                            w = null;
                        }), w = F, F = null);
                    };
                    g.$watch(f.parseAsResourceUrl(m), function(f) {
                        var m = function() {
                            !u(l) || l && !g.$eval(l) || d();
                        }, p = ++v;
                        f ? (a.get(f, {
                            cache: c
                        }).success(function(a) {
                            if (p === v) {
                                var c = g.$new();
                                r.template = a, a = s(c, function(a) {
                                    y(), e.enter(a, null, h, m);
                                }), A = c, F = a, A.$emit("$includeContentLoaded"), g.$eval(k);
                            }
                        }).error(function() {
                            p === v && y();
                        }), g.$emit("$includeContentRequested")) : (y(), r.template = null);
                    });
                };
            }
        };
    } ], Hd = [ "$compile", function(a) {
        return {
            restrict: "ECA",
            priority: -400,
            require: "ngInclude",
            link: function(c, d, e, f) {
                d.html(f.template), a(d.contents())(c);
            }
        };
    } ], sd = sa({
        priority: 450,
        compile: function() {
            return {
                pre: function(a, c, d) {
                    a.$eval(d.ngInit);
                }
            };
        }
    }), td = sa({
        terminal: !0,
        priority: 1e3
    }), ud = [ "$locale", "$interpolate", function(a, c) {
        var d = /{}/g;
        return {
            restrict: "EA",
            link: function(e, f, g) {
                var h = g.count, m = g.$attr.when && f.attr(g.$attr.when), k = g.offset || 0, l = e.$eval(m) || {}, n = {}, q = c.startSymbol(), p = c.endSymbol(), t = /^when(Minus)?(.+)$/;
                r(g, function(a, c) {
                    t.test(c) && (l[O(c.replace("when", "").replace("Minus", "-"))] = f.attr(g.$attr[c]));
                }), r(l, function(a, e) {
                    n[e] = c(a.replace(d, q + h + "-" + k + p));
                }), e.$watch(function() {
                    var c = parseFloat(e.$eval(h));
                    return isNaN(c) ? "" : (c in l || (c = a.pluralCat(c - k)), n[c](e, f, !0));
                }, function(a) {
                    f.text(a);
                });
            }
        };
    } ], vd = [ "$parse", "$animate", function(a, c) {
        var d = z("ngRepeat");
        return {
            transclude: "element",
            priority: 1e3,
            terminal: !0,
            $$tlb: !0,
            link: function(e, f, g, h, m) {
                var n, q, p, t, s, v, k = g.ngRepeat, l = k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), u = {
                    $id: Ga
                };
                if (!l) throw d("iexp", k);
                if (g = l[1], h = l[2], (l = l[3]) ? (n = a(l), q = function(a, c, d) {
                    return v && (u[v] = a), u[s] = c, u.$index = d, n(e, u);
                }) : (p = function(a, c) {
                    return Ga(c);
                }, t = function(a) {
                    return a;
                }), l = g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !l) throw d("iidexp", g);
                s = l[3] || l[1], v = l[2];
                var J = {};
                e.$watchCollection(h, function(a) {
                    var g, h, n, A, I, x, B, E, K, l = f[0], u = {}, z = [];
                    if ($a(a)) E = a, n = q || p; else {
                        n = q || t, E = [];
                        for (x in a) a.hasOwnProperty(x) && "$" != x.charAt(0) && E.push(x);
                        E.sort();
                    }
                    for (A = E.length, h = z.length = E.length, g = 0; g < h; g++) if (x = a === E ? g : E[g], 
                    B = a[x], B = n(x, B, g), xa(B, "`track by` id"), J.hasOwnProperty(B)) K = J[B], 
                    delete J[B], u[B] = K, z[g] = K; else {
                        if (u.hasOwnProperty(B)) throw r(z, function(a) {
                            a && a.scope && (J[a.id] = a);
                        }), d("dupes", k, B);
                        z[g] = {
                            id: B
                        }, u[B] = !1;
                    }
                    for (x in J) J.hasOwnProperty(x) && (K = J[x], g = xb(K.clone), c.leave(g), r(g, function(a) {
                        a.$$NG_REMOVED = !0;
                    }), K.scope.$destroy());
                    for (g = 0, h = E.length; g < h; g++) {
                        if (x = a === E ? g : E[g], B = a[x], K = z[g], z[g - 1] && (l = z[g - 1].clone[z[g - 1].clone.length - 1]), 
                        K.scope) {
                            I = K.scope, n = l;
                            do n = n.nextSibling; while (n && n.$$NG_REMOVED);
                            K.clone[0] != n && c.move(xb(K.clone), null, w(l)), l = K.clone[K.clone.length - 1];
                        } else I = e.$new();
                        I[s] = B, v && (I[v] = x), I.$index = g, I.$first = 0 === g, I.$last = g === A - 1, 
                        I.$middle = !(I.$first || I.$last), I.$odd = !(I.$even = 0 === (1 & g)), K.scope || m(I, function(a) {
                            a[a.length++] = T.createComment(" end ngRepeat: " + k + " "), c.enter(a, null, w(l)), 
                            l = a, K.scope = I, K.clone = a, u[K.id] = K;
                        });
                    }
                    J = u;
                });
            }
        };
    } ], wd = [ "$animate", function(a) {
        return function(c, d, e) {
            c.$watch(e.ngShow, function(c) {
                a[Pa(c) ? "removeClass" : "addClass"](d, "ng-hide");
            });
        };
    } ], pd = [ "$animate", function(a) {
        return function(c, d, e) {
            c.$watch(e.ngHide, function(c) {
                a[Pa(c) ? "addClass" : "removeClass"](d, "ng-hide");
            });
        };
    } ], xd = sa(function(a, c, d) {
        a.$watch(d.ngStyle, function(a, d) {
            d && a !== d && r(d, function(a, d) {
                c.css(d, "");
            }), a && c.css(a);
        }, !0);
    }), yd = [ "$animate", function(a) {
        return {
            restrict: "EA",
            require: "ngSwitch",
            controller: [ "$scope", function() {
                this.cases = {};
            } ],
            link: function(c, d, e, f) {
                var g, h, m, k = [];
                c.$watch(e.ngSwitch || e.on, function(d) {
                    var n, q = k.length;
                    if (0 < q) {
                        if (m) {
                            for (n = 0; n < q; n++) m[n].remove();
                            m = null;
                        }
                        for (m = [], n = 0; n < q; n++) {
                            var p = h[n];
                            k[n].$destroy(), m[n] = p, a.leave(p, function() {
                                m.splice(n, 1), 0 === m.length && (m = null);
                            });
                        }
                    }
                    h = [], k = [], (g = f.cases["!" + d] || f.cases["?"]) && (c.$eval(e.change), r(g, function(d) {
                        var e = c.$new();
                        k.push(e), d.transclude(e, function(c) {
                            var e = d.element;
                            h.push(c), a.enter(c, e.parent(), e);
                        });
                    }));
                });
            }
        };
    } ], zd = sa({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        link: function(a, c, d, e, f) {
            e.cases["!" + d.ngSwitchWhen] = e.cases["!" + d.ngSwitchWhen] || [], e.cases["!" + d.ngSwitchWhen].push({
                transclude: f,
                element: c
            });
        }
    }), Ad = sa({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        link: function(a, c, d, e, f) {
            e.cases["?"] = e.cases["?"] || [], e.cases["?"].push({
                transclude: f,
                element: c
            });
        }
    }), Cd = sa({
        link: function(a, c, d, e, f) {
            if (!f) throw z("ngTransclude")("orphan", fa(c));
            f(function(a) {
                c.empty(), c.append(a);
            });
        }
    }), cd = [ "$templateCache", function(a) {
        return {
            restrict: "E",
            terminal: !0,
            compile: function(c, d) {
                "text/ng-template" == d.type && a.put(d.id, c[0].text);
            }
        };
    } ], Pe = z("ngOptions"), Bd = Y({
        terminal: !0
    }), dd = [ "$compile", "$parse", function(a, c) {
        var d = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, e = {
            $setViewValue: B
        };
        return {
            restrict: "E",
            require: [ "select", "?ngModel" ],
            controller: [ "$element", "$scope", "$attrs", function(a, c, d) {
                var n, m = this, k = {}, l = e;
                m.databound = d.ngModel, m.init = function(a, c, d) {
                    l = a, n = d;
                }, m.addOption = function(c) {
                    xa(c, '"option value"'), k[c] = !0, l.$viewValue == c && (a.val(c), n.parent() && n.remove());
                }, m.removeOption = function(a) {
                    this.hasOption(a) && (delete k[a], l.$viewValue == a && this.renderUnknownOption(a));
                }, m.renderUnknownOption = function(c) {
                    c = "? " + Ga(c) + " ?", n.val(c), a.prepend(n), a.val(c), n.prop("selected", !0);
                }, m.hasOption = function(a) {
                    return k.hasOwnProperty(a);
                }, c.$on("$destroy", function() {
                    m.renderUnknownOption = B;
                });
            } ],
            link: function(e, g, h, m) {
                function k(a, c, d, e) {
                    d.$render = function() {
                        var a = d.$viewValue;
                        e.hasOption(a) ? (z.parent() && z.remove(), c.val(a), "" === a && x.prop("selected", !0)) : E(a) && x ? c.val("") : e.renderUnknownOption(a);
                    }, c.on("change", function() {
                        a.$apply(function() {
                            z.parent() && z.remove(), d.$setViewValue(c.val());
                        });
                    });
                }
                function l(a, c, d) {
                    var e;
                    d.$render = function() {
                        var a = new Ua(d.$viewValue);
                        r(c.find("option"), function(c) {
                            c.selected = u(a.get(c.value));
                        });
                    }, a.$watch(function() {
                        ua(e, d.$viewValue) || (e = $(d.$viewValue), d.$render());
                    }), c.on("change", function() {
                        a.$apply(function() {
                            var a = [];
                            r(c.find("option"), function(c) {
                                c.selected && a.push(c.value);
                            }), d.$setViewValue(a);
                        });
                    });
                }
                function n(e, f, g) {
                    function h() {
                        var d, k, s, t, z, a = {
                            "": []
                        }, c = [ "" ];
                        t = g.$modelValue, z = y(e) || [];
                        var I, C, D, E = n ? Ob(z) : z;
                        C = {}, s = !1;
                        var F, L;
                        if (p) if (w && M(t)) for (s = new Ua([]), D = 0; D < t.length; D++) C[m] = t[D], 
                        s.put(w(e, C), t[D]); else s = new Ua(t);
                        for (D = 0; I = E.length, D < I; D++) {
                            if (k = D, n) {
                                if (k = E[D], "$" === k.charAt(0)) continue;
                                C[n] = k;
                            }
                            C[m] = z[k], d = q(e, C) || "", (k = a[d]) || (k = a[d] = [], c.push(d)), p ? d = u(s.remove(w ? w(e, C) : r(e, C))) : (w ? (d = {}, 
                            d[m] = t, d = w(e, d) === w(e, C)) : d = t === r(e, C), s = s || d), F = l(e, C), 
                            F = u(F) ? F : "", k.push({
                                id: w ? w(e, C) : n ? E[D] : D,
                                label: F,
                                selected: d
                            });
                        }
                        for (p || (v || null === t ? a[""].unshift({
                            id: "",
                            label: "",
                            selected: !s
                        }) : s || a[""].unshift({
                            id: "?",
                            label: "",
                            selected: !0
                        })), C = 0, E = c.length; C < E; C++) {
                            for (d = c[C], k = a[d], x.length <= C ? (t = {
                                element: B.clone().attr("label", d),
                                label: k.label
                            }, z = [ t ], x.push(z), f.append(t.element)) : (z = x[C], t = z[0], t.label != d && t.element.attr("label", t.label = d)), 
                            F = null, D = 0, I = k.length; D < I; D++) s = k[D], (d = z[D + 1]) ? (F = d.element, 
                            d.label !== s.label && F.text(d.label = s.label), d.id !== s.id && F.val(d.id = s.id), 
                            d.selected !== s.selected && F.prop("selected", d.selected = s.selected)) : ("" === s.id && v ? L = v : (L = A.clone()).val(s.id).attr("selected", s.selected).text(s.label), 
                            z.push({
                                element: L,
                                label: s.label,
                                id: s.id,
                                selected: s.selected
                            }), F ? F.after(L) : t.element.append(L), F = L);
                            for (D++; z.length > D; ) z.pop().element.remove();
                        }
                        for (;x.length > C; ) x.pop()[0].element.remove();
                    }
                    var k;
                    if (!(k = t.match(d))) throw Pe("iexp", t, fa(f));
                    var l = c(k[2] || k[1]), m = k[4] || k[6], n = k[5], q = c(k[3] || ""), r = c(k[2] ? k[1] : m), y = c(k[7]), w = k[8] ? c(k[8]) : null, x = [ [ {
                        element: f,
                        label: ""
                    } ] ];
                    v && (a(v)(e), v.removeClass("ng-scope"), v.remove()), f.empty(), f.on("change", function() {
                        e.$apply(function() {
                            var a, h, k, l, q, t, v, u, c = y(e) || [], d = {};
                            if (p) {
                                for (k = [], q = 0, v = x.length; q < v; q++) for (a = x[q], l = 1, t = a.length; l < t; l++) if ((h = a[l].element)[0].selected) {
                                    if (h = h.val(), n && (d[n] = h), w) for (u = 0; u < c.length && (d[m] = c[u], w(e, d) != h); u++) ; else d[m] = c[h];
                                    k.push(r(e, d));
                                }
                            } else {
                                if (h = f.val(), "?" == h) k = s; else if ("" === h) k = null; else if (w) {
                                    for (u = 0; u < c.length; u++) if (d[m] = c[u], w(e, d) == h) {
                                        k = r(e, d);
                                        break;
                                    }
                                } else d[m] = c[h], n && (d[n] = h), k = r(e, d);
                                1 < x[0].length && x[0][1].id !== h && (x[0][1].selected = !1);
                            }
                            g.$setViewValue(k);
                        });
                    }), g.$render = h, e.$watch(h);
                }
                if (m[1]) {
                    var q = m[0];
                    m = m[1];
                    var x, p = h.multiple, t = h.ngOptions, v = !1, A = w(T.createElement("option")), B = w(T.createElement("optgroup")), z = A.clone();
                    h = 0;
                    for (var y = g.children(), D = y.length; h < D; h++) if ("" === y[h].value) {
                        x = v = y.eq(h);
                        break;
                    }
                    q.init(m, v, z), p && (m.$isEmpty = function(a) {
                        return !a || 0 === a.length;
                    }), t ? n(e, g, m) : p ? l(e, g, m) : k(e, g, m, q);
                }
            }
        };
    } ], fd = [ "$interpolate", function(a) {
        var c = {
            addOption: B,
            removeOption: B
        };
        return {
            restrict: "E",
            priority: 100,
            compile: function(d, e) {
                if (E(e.value)) {
                    var f = a(d.text(), !0);
                    f || e.$set("value", d.text());
                }
                return function(a, d, e) {
                    var k = d.parent(), l = k.data("$selectController") || k.parent().data("$selectController");
                    l && l.databound ? d.prop("selected", !1) : l = c, f ? a.$watch(f, function(a, c) {
                        e.$set("value", a), a !== c && l.removeOption(c), l.addOption(a);
                    }) : l.addOption(e.value), d.on("$destroy", function() {
                        l.removeOption(e.value);
                    });
                };
            }
        };
    } ], ed = Y({
        restrict: "E",
        terminal: !0
    });
    Q.angular.bootstrap ? console.log("WARNING: Tried to load angular more than once.") : ((Ea = Q.jQuery) ? (w = Ea, 
    v(Ea.fn, {
        scope: Ha.scope,
        isolateScope: Ha.isolateScope,
        controller: Ha.controller,
        injector: Ha.injector,
        inheritedData: Ha.inheritedData
    }), zb("remove", !0, !0, !1), zb("empty", !1, !1, !1), zb("html", !1, !1, !0)) : w = L, 
    Ca.element = w, Xc(Ca), w(T).ready(function() {
        Uc(T, Yb);
    }));
}(window, document), !angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>'), 
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
function() {
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
        wpm: 300,
        wpmMS: function() {
            return 6e4 / $scope.settings.wpm;
        },
        pauseBetweenParagraphs: !0,
        pauseBetweenSentences: !0,
        enableMultiplier: !0,
        // Vary speed by word length
        nightMode: !0,
        text: "",
        highlightFocusPoint: !0,
        centerFocusPoint: !0,
        toast: "",
        useSerifFont: !0,
        pauseCountdown: 1,
        countDownInProgress: !1,
        showLoadingOverlay: !1,
        init: !1
    }, $scope.game = {
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
    }, $scope.modelsToAutoSave = [ "settings.wpm", "settings.pauseBetweenSentences", "settings.enableMultiplier", "settings.nightMode", "settings.text", "settings.highlightFocusPoint", "settings.centerFocusPoint", "settings.useSerifFont" ], 
    // Is called at bottom of controller
    $scope.init = function() {
        // $scope.autoSave.loadAll();
        // $scope.autoSave.setup();
        chrome.runtime.sendMessage({
            action: "getText"
        }, function(response) {
            $scope.$apply(function() {
                var newlineTags = [ "p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "hr" ], newlineRegexp = new RegExp("(</(?:" + newlineTags.join("|") + ")>)", "gim");
                // Remove all whitespace
                response = response.replace(/(\r\n|\n|\r)+/gm, ""), // Add newlines where appropriate
                response = response.replace(newlineRegexp, "\r\n"), // Remove all remaining HTML
                response = response.replace(/(<\/?.+?\/?>)/gim, ""), // Trim text
                response = response.betterTrim(), // Trim newlines
                response = response.replace(/(\r\n|\n|\r)+/gm, "\r\n\r\n"), // Decode HTML special characters
                response = response.decodeHtml(), $scope.settings.text = response, // Lastly, init app
                $scope.settings.init = !0;
            });
        });
    }, $scope.decodeURI = function(text) {
        var text = decodeURI(text), text = text.replaceAll("%0A", "\r\n");
        return text;
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
        $scope.settings.toast = "";
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
}, // Decodes HTML entities but keeps tags intact
String.prototype.decodeHtml = function() {
    var txt = document.createElement("textarea");
    return txt.innerHTML = this, txt.value;
}, String.prototype.replaceAll = function(stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    for (var temp = this, index = temp.indexOf(stringToFind); index != -1; ) temp = temp.replace(stringToFind, stringToReplace), 
    index = temp.indexOf(stringToFind);
    return temp;
};