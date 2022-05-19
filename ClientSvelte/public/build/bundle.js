
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$2 } = globals;

    // (251:0) {:else}
    function create_else_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params$1 = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params$1.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params$1.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params: params$1,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const auth = writable(false);
    const errorMSG = writable([]);
    const infoMSG = writable([]);
    const selectedBudget=writable([]);
    const avaliableCategories = writable([]);
    const avaliableCurrency = writable([]);
    const userDetails = writable({});

    const LocalStorage = {
        Get: (key) => {
            const item = localStorage.getItem(key);
            if (item) {
                return item;
            } else {
                if (key == "jwt") {
                    auth.set(false);
                }
                return null;
            }
        },
        Set: (key, value) => {
            localStorage.setItem(key, value);
            if (key == "jwt") {
                auth.set(value != null);
            }
        }
    };

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.CanceledError = CanceledError_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;
    axios$1.toFormData = toFormData_1;

    // Expose AxiosError class
    axios$1.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios$1.Cancel = axios$1.CanceledError;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    const api = "https://localhost:7070/api";

    const Request = async (path = `/`, method = `get`, data = null, params = null) => {
        try {
            const res = await axios({
                url: `${api}${path}`,
                method: method,
                data: data,
                params: params,
                headers: {
                    'Authorization': `bearer ${LocalStorage.Get(`jwt`)}`
                }
            });

            if (res.data?.succeeded === false) {
                return Promise.reject({...res.data, status: res.status});
            }

            return Promise.resolve({...res.data});
        } catch (err) {
            if (err.response.status === 401) {
                LocalStorage.Set("jwt", null);
            }

            return Promise.reject({...err.response.data, status: err.response.status});
        }
    };


    //TODO: check 
    var Request$1 = {
        status: {
            ping: () => Request(`/status/ping/`, `get`),
            status: () => Request(`/status/`, `get`)
        },
        user: {
            me: () => Request(`/user/me/`, `get`),
            login: ({Email, Password}) => Request(`/user/login/`, `post`, {Email, Password}),
            register: ({Email, Password, Firstname, Lastname}) => Request(`/user/register/`, `post`, {
                Email,
                Password,
                Firstname,
                Lastname
            }),
        },
        budget: {
            join: ({InviteToken}) => Request(`/budget/join/${InviteToken}`, `patch`),
            getList: () => Request(`/budget/`, `get`),
            get: ({BudgetID}) => Request(`/budget/${BudgetID}`, `get`),
            create: ({Name, InviteToken = null, Currency}) => Request(`/budget/`, `post`, {Name, InviteToken, Currency}),
            update: ({
                         BudgetID,
                         Name = null,
                         InviteToken = null,
                         Currency = null
                     }) => Request(`/budget/`, `patch`, {BudgetID, Name, InviteToken, Currency}),
            leave: ({BudgetID}) => Request(`/budget/leave/`, `delete`, {BudgetID}),
            generateInviteToken: ({BudgetID}) => Request(`/budget/token/`, `patch`, {BudgetID}),
            deactivateInviteToken: ({BudgetID}) => Request(`/budget/token/`, `delete`, {BudgetID}),
        },
        plannedBudget: {
            getList: ({BudgetID}) => Request(`/plannedBudget/${BudgetID}`, `get`),
            create: ({
                         BudgetID,
                         Title,
                         PlannedAmount,
                         DateStart=null,
                         DateEnd=null,
                         Desctiption = null,
                         Currency = null,
                         CategoryID=null
                     }) => Request(`/plannedBudget/${BudgetID}`, `post`, {
                DateStart,
                DateEnd,
                Title,
                Desctiption,
                PlannedAmount,
                Currency,
                CategoryID
            }),
            setAmount: ({
                            BudgetID,
                            PlannedBudgetID,
                            PlannedAmount
                        }) => Request(`/plannedBudget/${BudgetID}/amount`, `patch`, {PlannedBudgetID, PlannedAmount}),
            delete: ({BudgetID, PlannedBudgetID}) => Request(`/plannedBudget/${BudgetID}`, `delete`, {PlannedBudgetID}),
        },
        transaction: {
            getList: ({BudgetID}) => Request(`/TransactionDescription/${BudgetID}`, `get`),
            getListUnderDays: ({BudgetID, Days}) => Request(`/TransactionDescription/${BudgetID}/${Days}`, `get`),
            create: ({
                         BudgetID,
                         Date = null,
                         Notes = null,
                         RecepitUrl = null,
                         Amount,
                         Currency = null,
                         CategoryID
                     }) => Request(`/TransactionDescription/${BudgetID}`, `post`, {
                Date,
                Notes,
                RecepitUrl,
                Amount,
                Currency,
                CategoryID
            }),
            delete: ({BudgetID, TransactionID}) => Request(`/TransactionDescription/${BudgetID}`, `delete`, {TransactionID})
        },
        category: {
            getList: ({BudgetID}) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `get`),
            get: ({BudgetID, CategoryID}) => Request(`/TransactionDescriptionCategory/${BudgetID}/${CategoryID}`, `get`),
            create: ({
                         BudgetID,
                         Name,
                         Income = null,
                         Color,
                     }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `post`, {Name, Income, Color}),
            update: ({
                         BudgetID,
                         Name = null,
                         Income = null,
                         Color = null,
                     }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `patch`, {Name, Income, Color}),
            delete: ({
                         BudgetID,
                         CategoryID
                     }) => Request(`/TransactionDescriptionCategory/${BudgetID}`, `delete`, {CategoryID}),
        },
        exchange: {
            all: () => Request(`/OldExchanger/all/`, `get`),
            avaliableCurrency: () => Request(`/OldExchanger/available/`, `get`),
            getCurrency: ({from, to}) => Request(`/OldExchanger/one`, `get`, null, {from, to}),
            convert: ({from, to, amount}) => Request(`/OldExchanger/convert`, `get`, null, {from, to, amount}),
        },
        photo: {
            get: async (keyWord) => (await axios({
                url: `https://api.pexels.com/v1/search?query=${keyWord}`,
                headers: {'Authorization': `563492ad6f91700001000001fcfc7adab515422e997cdd57f04b5853`}
            })).data.photos[Math.floor(Math.random() * 15)].src.original
        }
    };

    const ErrorWrapper = (response, clearMSG_Timeout = 2000) => {
        if (!response.succeeded) {
            if (response.data && (
                (Array.isArray(response.data) && response.data?.length > 0) || (!Array.isArray(response.data))
            )) {
                let errors = [];
                let keys = Object.keys(response.data);
                for (let i = 0; i < keys.length; i++) {
                    if (Array.isArray(response.data[keys[i]])) {
                        for (let j = 0; j < response.data[keys[i]].length; j++)
                            errors.push(response.data[keys[i]][j]);
                    } else {
                        errors.push(response.data[keys[i]]);
                    }
                }
                errorMSG.set(errors);
            } else if (response.messages?.length > 0) {
                errorMSG.set(response.messages);
            } else if (response.exception) {
                errorMSG.set([response.exception]);
            }
            setTimeout(() => errorMSG.set([]), clearMSG_Timeout);
        } else {
            return response;
        }
    };

    /* src\components\budget\ModalCreateBudget.svelte generated by Svelte v3.48.0 */
    const file$k = "src\\components\\budget\\ModalCreateBudget.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (47:20) {#each $avaliableCurrency as currency}
    function create_each_block$6(ctx) {
    	let option;
    	let t_value = /*currency*/ ctx[8] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*currency*/ ctx[8];
    			option.value = option.__value;
    			add_location(option, file$k, 47, 24, 1707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$avaliableCurrency*/ 4 && t_value !== (t_value = /*currency*/ ctx[8] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$avaliableCurrency*/ 4 && option_value_value !== (option_value_value = /*currency*/ ctx[8])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(47:20) {#each $avaliableCurrency as currency}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let input0;
    	let t0;
    	let div5;
    	let div4;
    	let label0;
    	let t1;
    	let t2;
    	let form;
    	let div0;
    	let label1;
    	let span0;
    	let t4;
    	let input1;
    	let t5;
    	let div1;
    	let label2;
    	let span1;
    	let t7;
    	let select;
    	let t8;
    	let div2;
    	let label3;
    	let span2;
    	let t10;
    	let input2;
    	let t11;
    	let br;
    	let t12;
    	let div3;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*$avaliableCurrency*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			label0 = element("label");
    			t1 = text("✕");
    			t2 = space();
    			form = element("form");
    			div0 = element("div");
    			label1 = element("label");
    			span0 = element("span");
    			span0.textContent = "Budget name";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label2 = element("label");
    			span1 = element("span");
    			span1.textContent = "Select currency:";
    			t7 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			label3 = element("label");
    			span2 = element("span");
    			span2.textContent = "Generate `invite token`";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			br = element("br");
    			t12 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", /*ID*/ ctx[0]);
    			attr_dev(input0, "class", "modal-toggle");
    			add_location(input0, file$k, 28, 0, 760);
    			attr_dev(label0, "for", /*ID*/ ctx[0]);
    			attr_dev(label0, "class", "btn btn-sm btn-circle absolute right-2 top-2");
    			add_location(label0, file$k, 31, 8, 882);
    			attr_dev(span0, "class", "label-text");
    			add_location(span0, file$k, 35, 20, 1111);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file$k, 34, 16, 1068);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Budget name");
    			attr_dev(input1, "class", "input input-bordered");
    			add_location(input1, file$k, 37, 16, 1198);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file$k, 33, 12, 1024);
    			attr_dev(span1, "class", "label-text");
    			add_location(span1, file$k, 43, 20, 1453);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file$k, 42, 16, 1410);
    			attr_dev(select, "class", "select select-bordered");
    			if (/*modelToRequest*/ ctx[1].Currency === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			add_location(select, file$k, 45, 16, 1545);
    			attr_dev(div1, "class", "form-control");
    			add_location(div1, file$k, 41, 12, 1366);
    			attr_dev(span2, "class", "label-text");
    			add_location(span2, file$k, 53, 20, 1926);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "toggle");
    			add_location(input2, file$k, 54, 20, 2003);
    			attr_dev(label3, "class", "label cursor-pointer");
    			add_location(label3, file$k, 52, 16, 1868);
    			attr_dev(div2, "class", "form-control");
    			add_location(div2, file$k, 51, 12, 1824);
    			add_location(br, file$k, 57, 12, 2144);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$k, 59, 16, 2207);
    			attr_dev(div3, "class", "form-control");
    			add_location(div3, file$k, 58, 12, 2163);
    			add_location(form, file$k, 32, 8, 970);
    			attr_dev(div4, "class", "modal-box relative");
    			add_location(div4, file$k, 30, 4, 840);
    			attr_dev(div5, "class", "modal");
    			add_location(div5, file$k, 29, 0, 815);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, label0);
    			append_dev(label0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, form);
    			append_dev(form, div0);
    			append_dev(div0, label1);
    			append_dev(label1, span0);
    			append_dev(div0, t4);
    			append_dev(div0, input1);
    			set_input_value(input1, /*modelToRequest*/ ctx[1].Name);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, label2);
    			append_dev(label2, span1);
    			append_dev(div1, t7);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*modelToRequest*/ ctx[1].Currency);
    			append_dev(form, t8);
    			append_dev(form, div2);
    			append_dev(div2, label3);
    			append_dev(label3, span2);
    			append_dev(label3, t10);
    			append_dev(label3, input2);
    			input2.checked = /*modelToRequest*/ ctx[1].InviteToken;
    			append_dev(form, t11);
    			append_dev(form, br);
    			append_dev(form, t12);
    			append_dev(form, div3);
    			append_dev(div3, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[6]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7]),
    					listen_dev(form, "submit", prevent_default(/*create*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ID*/ 1) {
    				attr_dev(input0, "id", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*ID*/ 1) {
    				attr_dev(label0, "for", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 6 && input1.value !== /*modelToRequest*/ ctx[1].Name) {
    				set_input_value(input1, /*modelToRequest*/ ctx[1].Name);
    			}

    			if (dirty & /*$avaliableCurrency*/ 4) {
    				each_value = /*$avaliableCurrency*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 6) {
    				select_option(select, /*modelToRequest*/ ctx[1].Currency);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 6) {
    				input2.checked = /*modelToRequest*/ ctx[1].InviteToken;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $avaliableCurrency;
    	validate_store(avaliableCurrency, 'avaliableCurrency');
    	component_subscribe($$self, avaliableCurrency, $$value => $$invalidate(2, $avaliableCurrency = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalCreateBudget', slots, []);

    	let modelToRequest = {
    		Name: "",
    		InviteToken: false,
    		Currency: "UAH"
    	};

    	const create = async () => {
    		try {
    			let res = await Request$1.budget.create(modelToRequest);
    			await SuccessAction();

    			try {
    				document.getElementById(ID).click(); //to close.
    			} catch {
    				
    			}
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	let { ID = "budget-create-modal" } = $$props;

    	let { SuccessAction = () => {
    		
    	} } = $$props;

    	const writable_props = ['ID', 'SuccessAction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalCreateBudget> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		modelToRequest.Name = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function select_change_handler() {
    		modelToRequest.Currency = select_value(this);
    		$$invalidate(1, modelToRequest);
    	}

    	function input2_change_handler() {
    		modelToRequest.InviteToken = this.checked;
    		$$invalidate(1, modelToRequest);
    	}

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('SuccessAction' in $$props) $$invalidate(4, SuccessAction = $$props.SuccessAction);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		avaliableCurrency,
    		ErrorWrapper,
    		modelToRequest,
    		create,
    		ID,
    		SuccessAction,
    		$avaliableCurrency
    	});

    	$$self.$inject_state = $$props => {
    		if ('modelToRequest' in $$props) $$invalidate(1, modelToRequest = $$props.modelToRequest);
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('SuccessAction' in $$props) $$invalidate(4, SuccessAction = $$props.SuccessAction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ID,
    		modelToRequest,
    		$avaliableCurrency,
    		create,
    		SuccessAction,
    		input1_input_handler,
    		select_change_handler,
    		input2_change_handler
    	];
    }

    class ModalCreateBudget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { ID: 0, SuccessAction: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalCreateBudget",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get ID() {
    		throw new Error("<ModalCreateBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<ModalCreateBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get SuccessAction() {
    		throw new Error("<ModalCreateBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SuccessAction(value) {
    		throw new Error("<ModalCreateBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\budget\ModalJoinBudget.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\components\\budget\\ModalJoinBudget.svelte";

    function create_fragment$j(ctx) {
    	let input0;
    	let t0;
    	let label1;
    	let div;
    	let input1;
    	let t1;
    	let br;
    	let t2;
    	let label0;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			label1 = element("label");
    			div = element("div");
    			input1 = element("input");
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			label0 = element("label");
    			t3 = text("Join");
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", /*ID*/ ctx[0]);
    			attr_dev(input0, "class", "modal-toggle");
    			add_location(input0, file$j, 30, 0, 793);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "invite token");
    			attr_dev(input1, "class", "input input-bordered input-lg");
    			add_location(input1, file$j, 33, 8, 958);
    			add_location(br, file$j, 35, 8, 1109);
    			attr_dev(label0, "for", /*ID*/ ctx[0]);
    			attr_dev(label0, "class", "btn btn-outline btn-secondary");
    			add_location(label0, file$j, 36, 8, 1124);
    			attr_dev(div, "class", "modal-box relative form-control");
    			add_location(div, file$j, 32, 4, 903);
    			attr_dev(label1, "for", /*ID*/ ctx[0]);
    			attr_dev(label1, "class", "modal cursor-pointer");
    			add_location(label1, file$j, 31, 0, 850);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, div);
    			append_dev(div, input1);
    			set_input_value(input1, /*modelToRequest*/ ctx[1].InviteToken);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, label0);
    			append_dev(label0, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(label0, "click", /*join*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ID*/ 1) {
    				attr_dev(input0, "id", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*modelToRequest*/ 2 && input1.value !== /*modelToRequest*/ ctx[1].InviteToken) {
    				set_input_value(input1, /*modelToRequest*/ ctx[1].InviteToken);
    			}

    			if (dirty & /*ID*/ 1) {
    				attr_dev(label0, "for", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*ID*/ 1) {
    				attr_dev(label1, "for", /*ID*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalJoinBudget', slots, []);
    	let modelToRequest = { InviteToken: "" };

    	const join = async () => {
    		if (modelToRequest.InviteToken === "") {
    			$$invalidate(1, modelToRequest.InviteToken = "1", modelToRequest);
    		}

    		try {
    			await Request$1.budget.join(modelToRequest);
    			await SuccessAction();

    			try {
    				document.getElementById(ID).click(); //to close.
    			} catch {
    				
    			}
    		} catch(err) {
    			ErrorWrapper(err);
    		}

    		$$invalidate(1, modelToRequest.InviteToken = "", modelToRequest);
    	};

    	let { ID = "budget-join-modal" } = $$props;

    	let { SuccessAction = () => {
    		
    	} } = $$props;

    	const writable_props = ['ID', 'SuccessAction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalJoinBudget> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		modelToRequest.InviteToken = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('SuccessAction' in $$props) $$invalidate(3, SuccessAction = $$props.SuccessAction);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		ErrorWrapper,
    		modelToRequest,
    		join,
    		ID,
    		SuccessAction
    	});

    	$$self.$inject_state = $$props => {
    		if ('modelToRequest' in $$props) $$invalidate(1, modelToRequest = $$props.modelToRequest);
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('SuccessAction' in $$props) $$invalidate(3, SuccessAction = $$props.SuccessAction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ID, modelToRequest, join, SuccessAction, input1_input_handler];
    }

    class ModalJoinBudget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { ID: 0, SuccessAction: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalJoinBudget",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get ID() {
    		throw new Error("<ModalJoinBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<ModalJoinBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get SuccessAction() {
    		throw new Error("<ModalJoinBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SuccessAction(value) {
    		throw new Error("<ModalJoinBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Dialog.svelte generated by Svelte v3.48.0 */

    const file$i = "src\\components\\Dialog.svelte";

    function create_fragment$i(ctx) {
    	let input;
    	let t0;
    	let div3;
    	let div2;
    	let div1;
    	let t1;
    	let br;
    	let t2;
    	let div0;
    	let button0;
    	let t3;
    	let t4;
    	let button1;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t3 = text(/*ConfirmButtonText*/ ctx[1]);
    			t4 = space();
    			button1 = element("button");
    			t5 = text(/*CancelButtonText*/ ctx[2]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", /*ModalID*/ ctx[0]);
    			attr_dev(input, "class", "modal-toggle");
    			add_location(input, file$i, 27, 0, 828);
    			add_location(br, file$i, 32, 12, 1030);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2");
    			add_location(button0, file$i, 34, 16, 1093);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600");
    			add_location(button1, file$i, 38, 16, 1458);
    			attr_dev(div0, "class", "modal-bottom");
    			add_location(div0, file$i, 33, 12, 1049);
    			attr_dev(div1, "class", "p-1 text-center");
    			add_location(div1, file$i, 30, 8, 966);
    			attr_dev(div2, "class", "modal-box relative max-w-xs");
    			add_location(div2, file$i, 29, 4, 915);
    			attr_dev(div3, "class", "modal");
    			add_location(div3, file$i, 28, 0, 890);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, br);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, t5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*ConfirmAction*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*CancelAction*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*ModalID*/ 1) {
    				attr_dev(input, "id", /*ModalID*/ ctx[0]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*ConfirmButtonText*/ 2) set_data_dev(t3, /*ConfirmButtonText*/ ctx[1]);
    			if (!current || dirty & /*CancelButtonText*/ 4) set_data_dev(t5, /*CancelButtonText*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, ['default']);

    	const ConfirmAction = async () => {
    		await ConfirmFunction(ConfirmFunctionParams);

    		try {
    			document.getElementById(ModalID).click(); //close modal
    		} catch {
    			
    		}
    	};

    	const CancelAction = async () => {
    		await CancelFunction(CancelFunctionParams);

    		try {
    			document.getElementById(ModalID).click(); //close modal
    		} catch {
    			
    		}
    	};

    	let { ModalID = "Modal" } = $$props;
    	let { ConfirmButtonText = "Yes, I'm sure" } = $$props;
    	let { CancelButtonText = "Cancel" } = $$props;
    	let { ConfirmFunctionParams = {} } = $$props;

    	let { ConfirmFunction = async ConfirmFunctionParams => {
    		
    	} } = $$props;

    	let { CancelFunctionParams = {} } = $$props;

    	let { CancelFunction = async CancelFunctionParams => {
    		
    	} } = $$props;

    	const writable_props = [
    		'ModalID',
    		'ConfirmButtonText',
    		'CancelButtonText',
    		'ConfirmFunctionParams',
    		'ConfirmFunction',
    		'CancelFunctionParams',
    		'CancelFunction'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ModalID' in $$props) $$invalidate(0, ModalID = $$props.ModalID);
    		if ('ConfirmButtonText' in $$props) $$invalidate(1, ConfirmButtonText = $$props.ConfirmButtonText);
    		if ('CancelButtonText' in $$props) $$invalidate(2, CancelButtonText = $$props.CancelButtonText);
    		if ('ConfirmFunctionParams' in $$props) $$invalidate(5, ConfirmFunctionParams = $$props.ConfirmFunctionParams);
    		if ('ConfirmFunction' in $$props) $$invalidate(6, ConfirmFunction = $$props.ConfirmFunction);
    		if ('CancelFunctionParams' in $$props) $$invalidate(7, CancelFunctionParams = $$props.CancelFunctionParams);
    		if ('CancelFunction' in $$props) $$invalidate(8, CancelFunction = $$props.CancelFunction);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ConfirmAction,
    		CancelAction,
    		ModalID,
    		ConfirmButtonText,
    		CancelButtonText,
    		ConfirmFunctionParams,
    		ConfirmFunction,
    		CancelFunctionParams,
    		CancelFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('ModalID' in $$props) $$invalidate(0, ModalID = $$props.ModalID);
    		if ('ConfirmButtonText' in $$props) $$invalidate(1, ConfirmButtonText = $$props.ConfirmButtonText);
    		if ('CancelButtonText' in $$props) $$invalidate(2, CancelButtonText = $$props.CancelButtonText);
    		if ('ConfirmFunctionParams' in $$props) $$invalidate(5, ConfirmFunctionParams = $$props.ConfirmFunctionParams);
    		if ('ConfirmFunction' in $$props) $$invalidate(6, ConfirmFunction = $$props.ConfirmFunction);
    		if ('CancelFunctionParams' in $$props) $$invalidate(7, CancelFunctionParams = $$props.CancelFunctionParams);
    		if ('CancelFunction' in $$props) $$invalidate(8, CancelFunction = $$props.CancelFunction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ModalID,
    		ConfirmButtonText,
    		CancelButtonText,
    		ConfirmAction,
    		CancelAction,
    		ConfirmFunctionParams,
    		ConfirmFunction,
    		CancelFunctionParams,
    		CancelFunction,
    		$$scope,
    		slots
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			ModalID: 0,
    			ConfirmButtonText: 1,
    			CancelButtonText: 2,
    			ConfirmFunctionParams: 5,
    			ConfirmFunction: 6,
    			CancelFunctionParams: 7,
    			CancelFunction: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get ModalID() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ModalID(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ConfirmButtonText() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ConfirmButtonText(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get CancelButtonText() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set CancelButtonText(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ConfirmFunctionParams() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ConfirmFunctionParams(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ConfirmFunction() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ConfirmFunction(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get CancelFunctionParams() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set CancelFunctionParams(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get CancelFunction() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set CancelFunction(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\budget\BudgetList.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\budget\\BudgetList.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (72:4) {:else}
    function create_else_block_1$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Not contains budgets.";
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$h, 72, 8, 2837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(72:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:8) <Dialog ModalID="modal_leve_{budget.id}" ConfirmFunction={ActionToLeave} ConfirmFunctionParams={{id:budget.id}}>
    function create_default_slot$2(ctx) {
    	let h1;
    	let t0;
    	let br;
    	let b;
    	let t1_value = /*budget*/ ctx[6].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("You really want to leave from ");
    			br = element("br");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = text(" budget?");
    			add_location(br, file$h, 32, 46, 1059);
    			add_location(b, file$h, 32, 51, 1064);
    			add_location(h1, file$h, 32, 12, 1025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, br);
    			append_dev(h1, b);
    			append_dev(b, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*budgets*/ 1 && t1_value !== (t1_value = /*budget*/ ctx[6].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(32:8) <Dialog ModalID=\\\"modal_leve_{budget.id}\\\" ConfirmFunction={ActionToLeave} ConfirmFunctionParams={{id:budget.id}}>",
    		ctx
    	});

    	return block;
    }

    // (57:24) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Invite token";
    			attr_dev(button, "class", "btn btn-sm btn-ghost btn-active");
    			button.disabled = true;
    			add_location(button, file$h, 58, 32, 2315);
    			add_location(div, file$h, 57, 28, 2276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(57:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:24) {#if nullOrEmpty(budget.inviteToken)}
    function create_if_block$3(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Invite token";
    			attr_dev(button, "class", "btn btn-sm btn-ghost btn-active");
    			add_location(button, file$h, 51, 32, 1948);
    			attr_dev(div, "class", "tooltip");
    			attr_dev(div, "data-tip", "Press to Copy!");
    			add_location(div, file$h, 50, 28, 1867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*copyToClipboard*/ ctx[2](/*budget*/ ctx[6].inviteToken))) /*copyToClipboard*/ ctx[2](/*budget*/ ctx[6].inviteToken).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(50:24) {#if nullOrEmpty(budget.inviteToken)}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#each budgets as budget}
    function create_each_block$5(ctx) {
    	let dialog;
    	let t0;
    	let div5;
    	let div4;
    	let h2;
    	let div0;
    	let b;
    	let t1_value = /*budget*/ ctx[6].name + "";
    	let t1;
    	let div0_data_tip_value;
    	let t2;
    	let div1;
    	let t3_value = /*budget*/ ctx[6].balance.currency + "";
    	let t3;
    	let t4;
    	let br0;
    	let t5;
    	let div3;
    	let label;
    	let t6;
    	let label_for_value;
    	let t7;
    	let div2;
    	let show_if;
    	let t8;
    	let button;
    	let t10;
    	let br1;
    	let current;
    	let mounted;
    	let dispose;

    	dialog = new Dialog({
    			props: {
    				ModalID: "modal_leve_" + /*budget*/ ctx[6].id,
    				ConfirmFunction: /*ActionToLeave*/ ctx[1],
    				ConfirmFunctionParams: { id: /*budget*/ ctx[6].id },
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*budgets*/ 1) show_if = null;
    		if (show_if == null) show_if = !!/*nullOrEmpty*/ ctx[3](/*budget*/ ctx[6].inviteToken);
    		if (show_if) return create_if_block$3;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*budget*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h2 = element("h2");
    			div0 = element("div");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			div3 = element("div");
    			label = element("label");
    			t6 = text("leave");
    			t7 = space();
    			div2 = element("div");
    			if_block.c();
    			t8 = space();
    			button = element("button");
    			button.textContent = "Open";
    			t10 = space();
    			br1 = element("br");
    			add_location(b, file$h, 39, 24, 1407);
    			attr_dev(div0, "class", "tooltip");
    			attr_dev(div0, "data-tip", div0_data_tip_value = "" + (/*budget*/ ctx[6].users?.length + " user" + (/*budget*/ ctx[6].users?.length > 1 ? 's' : '')));
    			add_location(div0, file$h, 38, 20, 1284);
    			attr_dev(div1, "class", "badge badge-outline");
    			add_location(div1, file$h, 41, 20, 1477);
    			attr_dev(h2, "class", "card-title");
    			add_location(h2, file$h, 37, 16, 1239);
    			add_location(br0, file$h, 44, 16, 1584);
    			attr_dev(label, "class", "btn btn-sm btn-error");
    			attr_dev(label, "for", label_for_value = "modal_leve_" + /*budget*/ ctx[6].id);
    			add_location(label, file$h, 47, 20, 1669);
    			add_location(div2, file$h, 48, 20, 1769);
    			attr_dev(button, "class", "btn btn-sm btn-accent");
    			add_location(button, file$h, 64, 20, 2582);
    			attr_dev(div3, "class", "card-actions justify-end");
    			add_location(div3, file$h, 46, 16, 1609);
    			attr_dev(div4, "class", "card-body");
    			add_location(div4, file$h, 36, 12, 1198);
    			attr_dev(div5, "class", "card w-96 bg-base-100 shadow card-bordered");
    			add_location(div5, file$h, 35, 8, 1128);
    			add_location(br1, file$h, 70, 8, 2809);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, h2);
    			append_dev(h2, div0);
    			append_dev(div0, b);
    			append_dev(b, t1);
    			append_dev(h2, t2);
    			append_dev(h2, div1);
    			append_dev(div1, t3);
    			append_dev(div4, t4);
    			append_dev(div4, br0);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, label);
    			append_dev(label, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			if_block.m(div2, null);
    			append_dev(div3, t8);
    			append_dev(div3, button);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const dialog_changes = {};
    			if (dirty & /*budgets*/ 1) dialog_changes.ModalID = "modal_leve_" + /*budget*/ ctx[6].id;
    			if (dirty & /*budgets*/ 1) dialog_changes.ConfirmFunctionParams = { id: /*budget*/ ctx[6].id };

    			if (dirty & /*$$scope, budgets*/ 513) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    			if ((!current || dirty & /*budgets*/ 1) && t1_value !== (t1_value = /*budget*/ ctx[6].name + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*budgets*/ 1 && div0_data_tip_value !== (div0_data_tip_value = "" + (/*budget*/ ctx[6].users?.length + " user" + (/*budget*/ ctx[6].users?.length > 1 ? 's' : '')))) {
    				attr_dev(div0, "data-tip", div0_data_tip_value);
    			}

    			if ((!current || dirty & /*budgets*/ 1) && t3_value !== (t3_value = /*budget*/ ctx[6].balance.currency + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*budgets*/ 1 && label_for_value !== (label_for_value = "modal_leve_" + /*budget*/ ctx[6].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if_block.d();
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(31:4) {#each budgets as budget}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let current;
    	let each_value = /*budgets*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(div, file$h, 29, 0, 853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*push, budgets, copyToClipboard, nullOrEmpty, ActionToLeave*/ 15) {
    				each_value = /*budgets*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1$1(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BudgetList', slots, []);
    	let { budgets = [] } = $$props;

    	const ActionToLeave = async ({ id }) => {
    		try {
    			await Request$1.budget.leave({ BudgetID: id });
    			await UpdateBudgets();
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	const UpdateBudgets = async () => {
    		try {
    			$$invalidate(0, budgets = (await Request$1.budget.getList()).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	const copyToClipboard = data => navigator.clipboard.writeText(data);
    	const nullOrEmpty = data => data != null && data !== "" && data !== undefined;
    	const writable_props = ['budgets'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BudgetList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = async budget => await push(`#/budget/${budget.id}`);

    	$$self.$$set = $$props => {
    		if ('budgets' in $$props) $$invalidate(0, budgets = $$props.budgets);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		Dialog,
    		Request: Request$1,
    		ErrorWrapper,
    		budgets,
    		ActionToLeave,
    		UpdateBudgets,
    		copyToClipboard,
    		nullOrEmpty
    	});

    	$$self.$inject_state = $$props => {
    		if ('budgets' in $$props) $$invalidate(0, budgets = $$props.budgets);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [budgets, ActionToLeave, copyToClipboard, nullOrEmpty, click_handler];
    }

    class BudgetList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { budgets: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BudgetList",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get budgets() {
    		throw new Error("<BudgetList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set budgets(value) {
    		throw new Error("<BudgetList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Budgets.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\views\\Budgets.svelte";

    function create_fragment$g(ctx) {
    	let modaljoinbudget;
    	let t0;
    	let modalcreatebudget;
    	let t1;
    	let div1;
    	let div0;
    	let label0;
    	let t2;
    	let t3;
    	let label1;
    	let t4;
    	let t5;
    	let br;
    	let t6;
    	let budgetlist;
    	let current;

    	modaljoinbudget = new ModalJoinBudget({
    			props: {
    				ID: JoinBudgetModalID,
    				SuccessAction: /*UpdateBudgets*/ ctx[1]
    			},
    			$$inline: true
    		});

    	modalcreatebudget = new ModalCreateBudget({
    			props: {
    				ID: CreateBudgetModalID,
    				SuccessAction: /*UpdateBudgets*/ ctx[1]
    			},
    			$$inline: true
    		});

    	budgetlist = new BudgetList({
    			props: { budgets: /*budgets*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modaljoinbudget.$$.fragment);
    			t0 = space();
    			create_component(modalcreatebudget.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t2 = text("Join Budget");
    			t3 = space();
    			label1 = element("label");
    			t4 = text("Create Budget");
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			create_component(budgetlist.$$.fragment);
    			attr_dev(label0, "class", "btn btn-wide");
    			attr_dev(label0, "for", JoinBudgetModalID);
    			add_location(label0, file$g, 31, 8, 1031);
    			attr_dev(label1, "class", "btn btn-wide");
    			attr_dev(label1, "for", CreateBudgetModalID);
    			add_location(label1, file$g, 32, 8, 1112);
    			attr_dev(div0, "class", "btn-group");
    			add_location(div0, file$g, 30, 4, 998);
    			add_location(br, file$g, 34, 4, 1205);
    			attr_dev(div1, "class", "center_content");
    			add_location(div1, file$g, 29, 0, 964);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modaljoinbudget, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalcreatebudget, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, label1);
    			append_dev(label1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, br);
    			append_dev(div1, t6);
    			mount_component(budgetlist, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const budgetlist_changes = {};
    			if (dirty & /*budgets*/ 1) budgetlist_changes.budgets = /*budgets*/ ctx[0];
    			budgetlist.$set(budgetlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modaljoinbudget.$$.fragment, local);
    			transition_in(modalcreatebudget.$$.fragment, local);
    			transition_in(budgetlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modaljoinbudget.$$.fragment, local);
    			transition_out(modalcreatebudget.$$.fragment, local);
    			transition_out(budgetlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modaljoinbudget, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalcreatebudget, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(budgetlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const JoinBudgetModalID = "budget-join-modal";
    const CreateBudgetModalID = "budget-create-modal";

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Budgets', slots, []);
    	let budgets = [];

    	onMount(async () => {
    		await UpdateBudgets();
    	});

    	const UpdateBudgets = async () => {
    		try {
    			$$invalidate(0, budgets = (await Request$1.budget.getList()).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Budgets> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		ModalCreateBudget,
    		ModalJoinBudget,
    		BudgetList,
    		Request: Request$1,
    		ErrorWrapper,
    		budgets,
    		UpdateBudgets,
    		JoinBudgetModalID,
    		CreateBudgetModalID
    	});

    	$$self.$inject_state = $$props => {
    		if ('budgets' in $$props) $$invalidate(0, budgets = $$props.budgets);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [budgets, UpdateBudgets];
    }

    class Budgets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Budgets",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\auth\SignIn.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$f = "src\\components\\auth\\SignIn.svelte";

    function create_fragment$f(ctx) {
    	let div4;
    	let div3;
    	let form;
    	let div0;
    	let label0;
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let label2;
    	let a;
    	let t7;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "Email";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "Password";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			label2 = element("label");
    			a = element("a");
    			a.textContent = "Forgot password?";
    			t7 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Login";
    			attr_dev(span0, "class", "label-text");
    			add_location(span0, file$f, 31, 20, 960);
    			attr_dev(label0, "class", "label");
    			add_location(label0, file$f, 30, 16, 917);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "placeholder", "email");
    			attr_dev(input0, "class", "input input-bordered");
    			add_location(input0, file$f, 33, 16, 1041);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file$f, 29, 12, 873);
    			attr_dev(span1, "class", "label-text");
    			add_location(span1, file$f, 37, 20, 1256);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file$f, 36, 16, 1213);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "password");
    			attr_dev(input1, "class", "input input-bordered");
    			add_location(input1, file$f, 39, 16, 1340);
    			attr_dev(a, "href", "#todo");
    			attr_dev(a, "class", "label-text-alt link link-hover");
    			add_location(a, file$f, 41, 20, 1504);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file$f, 40, 16, 1461);
    			attr_dev(div1, "class", "form-control");
    			add_location(div1, file$f, 35, 12, 1169);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$f, 45, 16, 1688);
    			attr_dev(div2, "class", "form-control mt-6");
    			add_location(div2, file$f, 44, 12, 1639);
    			add_location(form, file$f, 28, 8, 820);
    			attr_dev(div3, "class", "card-body");
    			add_location(div3, file$f, 27, 4, 787);
    			attr_dev(div4, "class", "card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100");
    			add_location(div4, file$f, 26, 0, 710);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(label0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*user*/ ctx[0].Email);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(label1, span1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*user*/ ctx[0].Password);
    			append_dev(div1, t5);
    			append_dev(div1, label2);
    			append_dev(label2, a);
    			append_dev(form, t7);
    			append_dev(form, div2);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", prevent_default(/*login*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0].Email) {
    				set_input_value(input0, /*user*/ ctx[0].Email);
    			}

    			if (dirty & /*user*/ 1 && input1.value !== /*user*/ ctx[0].Password) {
    				set_input_value(input1, /*user*/ ctx[0].Password);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $userDetails;
    	validate_store(userDetails, 'userDetails');
    	component_subscribe($$self, userDetails, $$value => $$invalidate(4, $userDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SignIn', slots, []);

    	let user = {
    		Email: "testtest2@test.test",
    		Password: "testtest",
    		Firstname: "",
    		Lastname: ""
    	};

    	async function login() {
    		try {
    			LocalStorage.Set("jwt", null);
    			const res = await Request$1.user.login(user);
    			LocalStorage.Set("jwt", res.data.token);
    			set_store_value(userDetails, $userDetails = (await Request$1.user.me()).data, $userDetails);
    		} catch(err) {
    			console.log(err);
    			ErrorWrapper(err);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SignIn> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user.Email = this.value;
    		$$invalidate(0, user);
    	}

    	function input1_input_handler() {
    		user.Password = this.value;
    		$$invalidate(0, user);
    	}

    	$$self.$capture_state = () => ({
    		LS: LocalStorage,
    		userDetails,
    		Request: Request$1,
    		ErrorWrapper,
    		user,
    		login,
    		$userDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, login, input0_input_handler, input1_input_handler];
    }

    class SignIn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignIn",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\auth\SignUp.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\components\\auth\\SignUp.svelte";

    function create_fragment$e(ctx) {
    	let div10;
    	let div9;
    	let form;
    	let div5;
    	let div4;
    	let div1;
    	let div0;
    	let label0;
    	let span0;
    	let t1;
    	let input0;
    	let t2;
    	let div3;
    	let div2;
    	let label1;
    	let span1;
    	let t4;
    	let input1;
    	let t5;
    	let div6;
    	let label2;
    	let span2;
    	let t7;
    	let input2;
    	let t8;
    	let div7;
    	let label3;
    	let span3;
    	let t10;
    	let input3;
    	let t11;
    	let div8;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			form = element("form");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "Firstname:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "Lastname:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div6 = element("div");
    			label2 = element("label");
    			span2 = element("span");
    			span2.textContent = "Email";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div7 = element("div");
    			label3 = element("label");
    			span3 = element("span");
    			span3.textContent = "Password";
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			div8 = element("div");
    			button = element("button");
    			button.textContent = "Register";
    			attr_dev(span0, "class", "label-text");
    			add_location(span0, file$e, 31, 32, 1041);
    			attr_dev(label0, "class", "label");
    			add_location(label0, file$e, 30, 28, 986);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Firstname");
    			attr_dev(input0, "class", "input input-bordered input-sm w-32");
    			add_location(input0, file$e, 33, 28, 1151);
    			attr_dev(div0, "class", "");
    			add_location(div0, file$e, 29, 24, 942);
    			attr_dev(div1, "class", "flex w-full pr-2");
    			add_location(div1, file$e, 28, 20, 886);
    			attr_dev(span1, "class", "label-text");
    			add_location(span1, file$e, 40, 32, 1539);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file$e, 39, 28, 1484);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Lastname");
    			attr_dev(input1, "class", "input input-bordered input-sm w-32");
    			add_location(input1, file$e, 42, 28, 1648);
    			attr_dev(div2, "class", "");
    			add_location(div2, file$e, 38, 24, 1440);
    			attr_dev(div3, "class", "flex w-full pl-2");
    			add_location(div3, file$e, 37, 20, 1384);
    			attr_dev(div4, "class", "flex w-full");
    			add_location(div4, file$e, 27, 16, 839);
    			attr_dev(div5, "class", "form-control");
    			add_location(div5, file$e, 26, 12, 795);
    			attr_dev(span2, "class", "label-text");
    			add_location(span2, file$e, 51, 20, 2009);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file$e, 50, 16, 1966);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "email");
    			attr_dev(input2, "class", "input input-bordered");
    			add_location(input2, file$e, 53, 16, 2090);
    			attr_dev(div6, "class", "form-control mt-2");
    			add_location(div6, file$e, 49, 12, 1917);
    			attr_dev(span3, "class", "label-text");
    			add_location(span3, file$e, 57, 20, 2310);
    			attr_dev(label3, "class", "label");
    			add_location(label3, file$e, 56, 16, 2267);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "password");
    			attr_dev(input3, "class", "input input-bordered");
    			add_location(input3, file$e, 59, 16, 2394);
    			attr_dev(div7, "class", "form-control mt-2");
    			add_location(div7, file$e, 55, 12, 2218);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$e, 62, 16, 2580);
    			attr_dev(div8, "class", "form-control mt-8");
    			add_location(div8, file$e, 61, 12, 2531);
    			add_location(form, file$e, 25, 8, 739);
    			attr_dev(div9, "class", "card-body");
    			add_location(div9, file$e, 24, 4, 706);
    			attr_dev(div10, "class", "card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100");
    			add_location(div10, file$e, 23, 0, 629);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, form);
    			append_dev(form, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*user*/ ctx[0].Firstname);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, span1);
    			append_dev(div2, t4);
    			append_dev(div2, input1);
    			set_input_value(input1, /*user*/ ctx[0].Lastname);
    			append_dev(form, t5);
    			append_dev(form, div6);
    			append_dev(div6, label2);
    			append_dev(label2, span2);
    			append_dev(div6, t7);
    			append_dev(div6, input2);
    			set_input_value(input2, /*user*/ ctx[0].Email);
    			append_dev(form, t8);
    			append_dev(form, div7);
    			append_dev(div7, label3);
    			append_dev(label3, span3);
    			append_dev(div7, t10);
    			append_dev(div7, input3);
    			set_input_value(input3, /*user*/ ctx[0].Password);
    			append_dev(form, t11);
    			append_dev(form, div8);
    			append_dev(div8, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[4]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*register*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0].Firstname) {
    				set_input_value(input0, /*user*/ ctx[0].Firstname);
    			}

    			if (dirty & /*user*/ 1 && input1.value !== /*user*/ ctx[0].Lastname) {
    				set_input_value(input1, /*user*/ ctx[0].Lastname);
    			}

    			if (dirty & /*user*/ 1 && input2.value !== /*user*/ ctx[0].Email) {
    				set_input_value(input2, /*user*/ ctx[0].Email);
    			}

    			if (dirty & /*user*/ 1 && input3.value !== /*user*/ ctx[0].Password) {
    				set_input_value(input3, /*user*/ ctx[0].Password);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $userDetails;
    	validate_store(userDetails, 'userDetails');
    	component_subscribe($$self, userDetails, $$value => $$invalidate(6, $userDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SignUp', slots, []);

    	let user = {
    		Email: "",
    		Password: "",
    		Firstname: "",
    		Lastname: ""
    	};

    	async function register() {
    		try {
    			LocalStorage.Set("jwt", null);
    			LocalStorage.Set("jwt", (await Request$1.user.register(user)).data.token);
    			set_store_value(userDetails, $userDetails = (await Request$1.user.me()).data, $userDetails);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SignUp> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user.Firstname = this.value;
    		$$invalidate(0, user);
    	}

    	function input1_input_handler() {
    		user.Lastname = this.value;
    		$$invalidate(0, user);
    	}

    	function input2_input_handler() {
    		user.Email = this.value;
    		$$invalidate(0, user);
    	}

    	function input3_input_handler() {
    		user.Password = this.value;
    		$$invalidate(0, user);
    	}

    	$$self.$capture_state = () => ({
    		LS: LocalStorage,
    		userDetails,
    		Request: Request$1,
    		ErrorWrapper,
    		user,
    		register,
    		$userDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		user,
    		register,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class SignUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignUp",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z$4 = ".root.svelte-1u3jrhf.svelte-1u3jrhf{flex-grow:1;height:100vh;display:flex}.root__illustration.svelte-1u3jrhf.svelte-1u3jrhf{flex:3 1 0px;background-image:url(\"/budgetfrog.png\");background-size:contain;background-position:center;background-repeat:no-repeat;padding:50px 80px}.root__container.svelte-1u3jrhf.svelte-1u3jrhf{flex:2 1 0px;background:white;display:flex;padding:50px 80px;justify-content:center;align-items:center}.root__container.svelte-1u3jrhf div.svelte-1u3jrhf{max-width:500px}";
    styleInject(css_248z$4);

    /* src\views\Root.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\views\\Root.svelte";

    // (27:0) {:else}
    function create_else_block_1(ctx) {
    	let budgets;
    	let current;
    	budgets = new Budgets({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(budgets.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(budgets, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(budgets.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(budgets.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(budgets, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(27:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:0) {#if !$auth}
    function create_if_block$2(ctx) {
    	let div3;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*registrationField*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "root__illustration svelte-1u3jrhf");
    			add_location(div0, file$d, 13, 8, 387);
    			attr_dev(div1, "class", "svelte-1u3jrhf");
    			add_location(div1, file$d, 15, 12, 473);
    			attr_dev(div2, "class", "root__container svelte-1u3jrhf");
    			add_location(div2, file$d, 14, 8, 430);
    			attr_dev(div3, "class", "root svelte-1u3jrhf");
    			add_location(div3, file$d, 12, 4, 359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:0) {#if !$auth}",
    		ctx
    	});

    	return block;
    }

    // (20:16) {:else}
    function create_else_block$3(ctx) {
    	let signup;
    	let t0;
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	signup = new SignUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signup.$$.fragment);
    			t0 = space();
    			label = element("label");
    			label.textContent = "Sign in already have account";
    			attr_dev(label, "class", "label-text text-center");
    			add_location(label, file$d, 21, 20, 750);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signup, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(label, "click", /*switchRegField*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signup, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(20:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:16) {#if !registrationField}
    function create_if_block_1$1(ctx) {
    	let signin;
    	let t0;
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	signin = new SignIn({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signin.$$.fragment);
    			t0 = space();
    			label = element("label");
    			label.textContent = "Sign up for a new account";
    			attr_dev(label, "class", "label-text text-center");
    			add_location(label, file$d, 18, 20, 573);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signin, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(label, "click", /*switchRegField*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signin, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(17:16) {#if !registrationField}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$auth*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $auth;
    	validate_store(auth, 'auth');
    	component_subscribe($$self, auth, $$value => $$invalidate(1, $auth = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Root', slots, []);
    	let registrationField = false;
    	const switchRegField = () => $$invalidate(0, registrationField = !registrationField);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Root> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		auth,
    		Budgets,
    		SignIn,
    		SignUp,
    		registrationField,
    		switchRegField,
    		$auth
    	});

    	$$self.$inject_state = $$props => {
    		if ('registrationField' in $$props) $$invalidate(0, registrationField = $$props.registrationField);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [registrationField, $auth, switchRegField];
    }

    class Root extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Root",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var css_248z$3 = "video.svelte-1difd9v{min-width:200px;width:50%;height:auto;margin-left:auto;margin-right:auto;display:block}";
    styleInject(css_248z$3);

    /* src\views\NotFound.svelte generated by Svelte v3.48.0 */

    const file$c = "src\\views\\NotFound.svelte";

    function create_fragment$c(ctx) {
    	let video;
    	let video_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			if (!src_url_equal(video.src, video_src_value = "404.mp4")) attr_dev(video, "src", video_src_value);
    			video.autoplay = true;
    			video.muted = true;
    			video.loop = true;
    			attr_dev(video, "class", "svelte-1difd9v");
    			add_location(video, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\views\Profile.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\views\\Profile.svelte";

    function create_fragment$b(ctx) {
    	let div2;
    	let div1;
    	let figure;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let p0;
    	let t1_value = /*$userDetails*/ ctx[0].firstName + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3_value = /*$userDetails*/ ctx[0].lastName + "";
    	let t3;
    	let t4;
    	let p2;
    	let t5_value = /*$userDetails*/ ctx[0].email + "";
    	let t5;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			t5 = text(t5_value);
    			if (!src_url_equal(img.src, img_src_value = "https://random.imagecdn.app/250/250")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Avatar");
    			add_location(img, file$b, 17, 16, 453);
    			add_location(figure, file$b, 17, 8, 445);
    			attr_dev(p0, "class", "card-title");
    			add_location(p0, file$b, 19, 12, 569);
    			attr_dev(p1, "class", "card-title");
    			add_location(p1, file$b, 20, 12, 633);
    			attr_dev(p2, "class", "card-title");
    			add_location(p2, file$b, 21, 12, 696);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$b, 18, 8, 532);
    			attr_dev(div1, "class", "card w-96 glass");
    			add_location(div1, file$b, 16, 4, 406);
    			attr_dev(div2, "class", "center_content");
    			add_location(div2, file$b, 15, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, figure);
    			append_dev(figure, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			append_dev(p1, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p2);
    			append_dev(p2, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$userDetails*/ 1 && t1_value !== (t1_value = /*$userDetails*/ ctx[0].firstName + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$userDetails*/ 1 && t3_value !== (t3_value = /*$userDetails*/ ctx[0].lastName + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$userDetails*/ 1 && t5_value !== (t5_value = /*$userDetails*/ ctx[0].email + "")) set_data_dev(t5, t5_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $userDetails;
    	validate_store(userDetails, 'userDetails');
    	component_subscribe($$self, userDetails, $$value => $$invalidate(0, $userDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);

    	onMount(async () => {
    		try {
    			let reqMe = await Request$1.user.me();
    			set_store_value(userDetails, $userDetails = reqMe.data, $userDetails);
    		} catch(err) {
    			set_store_value(userDetails, $userDetails = {}, $userDetails);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		userDetails,
    		Request: Request$1,
    		$userDetails
    	});

    	return [$userDetails];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\transaction\TransactionList.svelte generated by Svelte v3.48.0 */

    const file$a = "src\\components\\transaction\\TransactionList.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (21:4) {:else}
    function create_else_block$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Not contains transactions.";
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$a, 21, 8, 918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each transactions as transaction}
    function create_each_block$4(ctx) {
    	let div;
    	let h40;
    	let t0_value = /*transaction*/ ctx[1].transactionDescriptionCategory?.name + "";
    	let t0;
    	let t1;
    	let h3;

    	let t2_value = ((/*transaction*/ ctx[1].transactionDescriptionCategory?.income)
    	? "+"
    	: "-") + "";

    	let t2;
    	let t3_value = /*transaction*/ ctx[1].balance?.amount + "";
    	let t3;
    	let t4;
    	let t5_value = /*transaction*/ ctx[1].balance?.currency + "";
    	let t5;
    	let t6;
    	let t7;
    	let h41;
    	let t8_value = /*transaction*/ ctx[1]?.notes + "";
    	let t8;
    	let t9;
    	let br;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = text("\r\n                (");
    			t5 = text(t5_value);
    			t6 = text(")");
    			t7 = space();
    			h41 = element("h4");
    			t8 = text(t8_value);
    			t9 = space();
    			br = element("br");
    			attr_dev(h40, "class", "text-center");
    			set_style(h40, "color", /*transaction*/ ctx[1].transactionDescriptionCategory?.color);
    			add_location(h40, file$a, 10, 12, 324);
    			attr_dev(h3, "class", "text-center");

    			set_style(h3, "color", (/*transaction*/ ctx[1].transactionDescriptionCategory?.income)
    			? 'green'
    			: 'red');

    			add_location(h3, file$a, 13, 12, 515);
    			attr_dev(h41, "class", "text-center");
    			add_location(h41, file$a, 17, 12, 815);
    			attr_dev(div, "class", "card card-bordered w-96 bg-base-100 shadow");
    			add_location(div, file$a, 9, 8, 254);
    			add_location(br, file$a, 19, 8, 890);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(h40, t0);
    			append_dev(div, t1);
    			append_dev(div, h3);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			append_dev(h3, t6);
    			append_dev(div, t7);
    			append_dev(div, h41);
    			append_dev(h41, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*transactions*/ 1 && t0_value !== (t0_value = /*transaction*/ ctx[1].transactionDescriptionCategory?.name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*transactions*/ 1) {
    				set_style(h40, "color", /*transaction*/ ctx[1].transactionDescriptionCategory?.color);
    			}

    			if (dirty & /*transactions*/ 1 && t2_value !== (t2_value = ((/*transaction*/ ctx[1].transactionDescriptionCategory?.income)
    			? "+"
    			: "-") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*transactions*/ 1 && t3_value !== (t3_value = /*transaction*/ ctx[1].balance?.amount + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*transactions*/ 1 && t5_value !== (t5_value = /*transaction*/ ctx[1].balance?.currency + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*transactions*/ 1) {
    				set_style(h3, "color", (/*transaction*/ ctx[1].transactionDescriptionCategory?.income)
    				? 'green'
    				: 'red');
    			}

    			if (dirty & /*transactions*/ 1 && t8_value !== (t8_value = /*transaction*/ ctx[1]?.notes + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(9:4) {#each transactions as transaction}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let each_value = /*transactions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$2(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(div, file$a, 7, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*transactions*/ 1) {
    				each_value = /*transactions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$2(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TransactionList', slots, []);
    	let { transactions = [] } = $$props;
    	const writable_props = ['transactions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TransactionList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('transactions' in $$props) $$invalidate(0, transactions = $$props.transactions);
    	};

    	$$self.$capture_state = () => ({ transactions });

    	$$self.$inject_state = $$props => {
    		if ('transactions' in $$props) $$invalidate(0, transactions = $$props.transactions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [transactions];
    }

    class TransactionList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { transactions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TransactionList",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get transactions() {
    		throw new Error("<TransactionList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transactions(value) {
    		throw new Error("<TransactionList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\BudgetDetails.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\views\\BudgetDetails.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let transactionlist;
    	let current;

    	transactionlist = new TransactionList({
    			props: { transactions: /*transactions*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(transactionlist.$$.fragment);
    			attr_dev(div, "class", "center_content");
    			add_location(div, file$9, 21, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(transactionlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const transactionlist_changes = {};
    			if (dirty & /*transactions*/ 1) transactionlist_changes.transactions = /*transactions*/ ctx[0];
    			transactionlist.$set(transactionlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(transactionlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(transactionlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(transactionlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BudgetDetails', slots, []);
    	let { params = {} } = $$props;
    	let transactions = [];

    	onMount(async () => {
    		try {
    			const BudgetID = params.budgetID;
    			$$invalidate(0, transactions = (await Request$1.transaction.getList({ BudgetID })).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	});

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BudgetDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Request: Request$1,
    		TransactionList,
    		ErrorWrapper,
    		params,
    		transactions
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('transactions' in $$props) $$invalidate(0, transactions = $$props.transactions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [transactions, params];
    }

    class BudgetDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BudgetDetails",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get params() {
    		throw new Error("<BudgetDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<BudgetDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\category\CategoryList.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\components\\category\\CategoryList.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (54:4) {:else}
    function create_else_block$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Not contains categories.";
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$8, 54, 8, 1966);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(54:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:8) <Dialog ModalID="modal_remove_{category.id}" ConfirmFunction={ActionToRemove}                  ConfirmFunctionParams={{id:category.id}}>
    function create_default_slot$1(ctx) {
    	let h1;
    	let t0;
    	let br;
    	let b;
    	let t1_value = /*category*/ ctx[4].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("You really want to remove ");
    			br = element("br");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = text(" category?");
    			add_location(br, file$8, 30, 42, 967);
    			add_location(b, file$8, 30, 47, 972);
    			add_location(h1, file$8, 30, 12, 937);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, br);
    			append_dev(h1, b);
    			append_dev(b, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 1 && t1_value !== (t1_value = /*category*/ ctx[4].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(29:8) <Dialog ModalID=\\\"modal_remove_{category.id}\\\" ConfirmFunction={ActionToRemove}                  ConfirmFunctionParams={{id:category.id}}>",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#each categories as category}
    function create_each_block$3(ctx) {
    	let dialog;
    	let t0;
    	let div;
    	let label;
    	let t1;
    	let label_for_value;
    	let t2;
    	let h4;
    	let t3_value = /*category*/ ctx[4].name + "";
    	let t3;
    	let t4;
    	let figure;
    	let t5;
    	let h3;
    	let t6_value = (/*category*/ ctx[4].income ? "income" : "outcome") + "";
    	let t6;
    	let t7;
    	let br;
    	let current;

    	dialog = new Dialog({
    			props: {
    				ModalID: "modal_remove_" + /*category*/ ctx[4].id,
    				ConfirmFunction: /*ActionToRemove*/ ctx[1],
    				ConfirmFunctionParams: { id: /*category*/ ctx[4].id },
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    			t0 = space();
    			div = element("div");
    			label = element("label");
    			t1 = text("✕");
    			t2 = space();
    			h4 = element("h4");
    			t3 = text(t3_value);
    			t4 = space();
    			figure = element("figure");
    			t5 = space();
    			h3 = element("h3");
    			t6 = text(t6_value);
    			t7 = space();
    			br = element("br");
    			attr_dev(label, "for", label_for_value = "modal_remove_" + /*category*/ ctx[4].id);
    			attr_dev(label, "class", "btn btn-outline btn-sm btn-circle absolute right-2 top-2");
    			add_location(label, file$8, 33, 12, 1108);
    			attr_dev(h4, "class", "text-center px-2 pt-2");
    			set_style(h4, "color", /*category*/ ctx[4].color);
    			add_location(h4, file$8, 37, 12, 1288);
    			attr_dev(figure, "class", "px-2 pt-2");
    			add_location(figure, file$8, 40, 12, 1419);
    			attr_dev(h3, "class", "text-center");
    			set_style(h3, "color", /*category*/ ctx[4].income ? 'green' : 'red');
    			add_location(h3, file$8, 48, 12, 1763);
    			attr_dev(div, "class", "card card-bordered w-96 bg-base-100 shadow");
    			add_location(div, file$8, 32, 8, 1038);
    			add_location(br, file$8, 52, 8, 1938);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(div, t2);
    			append_dev(div, h4);
    			append_dev(h4, t3);
    			append_dev(div, t4);
    			append_dev(div, figure);
    			append_dev(div, t5);
    			append_dev(div, h3);
    			append_dev(h3, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty & /*categories*/ 1) dialog_changes.ModalID = "modal_remove_" + /*category*/ ctx[4].id;
    			if (dirty & /*categories*/ 1) dialog_changes.ConfirmFunctionParams = { id: /*category*/ ctx[4].id };

    			if (dirty & /*$$scope, categories*/ 129) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);

    			if (!current || dirty & /*categories*/ 1 && label_for_value !== (label_for_value = "modal_remove_" + /*category*/ ctx[4].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if ((!current || dirty & /*categories*/ 1) && t3_value !== (t3_value = /*category*/ ctx[4].name + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*categories*/ 1) {
    				set_style(h4, "color", /*category*/ ctx[4].color);
    			}

    			if ((!current || dirty & /*categories*/ 1) && t6_value !== (t6_value = (/*category*/ ctx[4].income ? "income" : "outcome") + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*categories*/ 1) {
    				set_style(h3, "color", /*category*/ ctx[4].income ? 'green' : 'red');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(28:4) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current;
    	let each_value = /*categories*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(div, file$8, 26, 0, 736);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories, ActionToRemove*/ 3) {
    				each_value = /*categories*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CategoryList', slots, []);

    	const ActionToRemove = async ({ id }) => {
    		try {
    			await Request$1.category.delete({ BudgetID: budgetID, CategoryID: id });
    			await UpdateCategories();
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	const UpdateCategories = async () => {
    		try {
    			$$invalidate(0, categories = (await Request$1.category.getList({ BudgetID: budgetID })).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	let { categories = [] } = $$props;
    	let { budgetID } = $$props;
    	const writable_props = ['categories', 'budgetID'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CategoryList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('budgetID' in $$props) $$invalidate(2, budgetID = $$props.budgetID);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		ErrorWrapper,
    		Dialog,
    		ActionToRemove,
    		UpdateCategories,
    		categories,
    		budgetID
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('budgetID' in $$props) $$invalidate(2, budgetID = $$props.budgetID);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [categories, ActionToRemove, budgetID];
    }

    class CategoryList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { categories: 0, budgetID: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CategoryList",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*budgetID*/ ctx[2] === undefined && !('budgetID' in props)) {
    			console.warn("<CategoryList> was created without expected prop 'budgetID'");
    		}
    	}

    	get categories() {
    		throw new Error("<CategoryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<CategoryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get budgetID() {
    		throw new Error("<CategoryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set budgetID(value) {
    		throw new Error("<CategoryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\category\ModalCreateCategory.svelte generated by Svelte v3.48.0 */
    const file$7 = "src\\components\\category\\ModalCreateCategory.svelte";

    function create_fragment$7(ctx) {
    	let input0;
    	let t0;
    	let div7;
    	let div6;
    	let label0;
    	let t1;
    	let t2;
    	let form;
    	let div0;
    	let label1;
    	let span0;
    	let t4;
    	let input1;
    	let t5;
    	let div4;
    	let label2;
    	let span1;
    	let t7;
    	let div3;
    	let div1;
    	let input2;
    	let t8;
    	let input3;
    	let t9;
    	let div2;
    	let label3;
    	let span2;

    	let t10_value = (/*modelToRequest*/ ctx[1].Income
    	? 'income '
    	: 'outcome ') + "";

    	let t10;
    	let t11;
    	let input4;
    	let t12;
    	let br;
    	let t13;
    	let div5;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			t1 = text("✕");
    			t2 = space();
    			form = element("form");
    			div0 = element("div");
    			label1 = element("label");
    			span0 = element("span");
    			span0.textContent = "Category name";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div4 = element("div");
    			label2 = element("label");
    			span1 = element("span");
    			span1.textContent = "Input color (hex):";
    			t7 = space();
    			div3 = element("div");
    			div1 = element("div");
    			input2 = element("input");
    			t8 = space();
    			input3 = element("input");
    			t9 = space();
    			div2 = element("div");
    			label3 = element("label");
    			span2 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			input4 = element("input");
    			t12 = space();
    			br = element("br");
    			t13 = space();
    			div5 = element("div");
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", /*ID*/ ctx[0]);
    			attr_dev(input0, "class", "modal-toggle");
    			add_location(input0, file$7, 29, 0, 790);
    			attr_dev(label0, "for", /*ID*/ ctx[0]);
    			attr_dev(label0, "class", "btn btn-sm btn-circle absolute right-2 top-2");
    			add_location(label0, file$7, 32, 8, 912);
    			attr_dev(span0, "class", "label-text");
    			add_location(span0, file$7, 36, 20, 1141);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file$7, 35, 16, 1098);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Category name");
    			attr_dev(input1, "class", "input input-bordered");
    			add_location(input1, file$7, 38, 16, 1230);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file$7, 34, 12, 1054);
    			attr_dev(span1, "class", "label-text");
    			add_location(span1, file$7, 43, 20, 1485);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file$7, 42, 16, 1442);
    			attr_dev(input2, "type", "color");
    			set_style(input2, "height", "50px");
    			add_location(input2, file$7, 47, 24, 1687);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "#FFFFFF");
    			attr_dev(input3, "class", "input input-bordered");
    			add_location(input3, file$7, 48, 24, 1789);
    			attr_dev(div1, "class", "input-group flex-grow");
    			add_location(div1, file$7, 46, 20, 1626);
    			attr_dev(span2, "class", "label-text text-lg");
    			set_style(span2, "color", /*modelToRequest*/ ctx[1].Income ? 'green' : 'red');
    			add_location(span2, file$7, 53, 28, 2095);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "class", "toggle p-2");
    			add_location(input4, file$7, 56, 28, 2330);
    			attr_dev(label3, "class", "label cursor-pointer p-2");
    			add_location(label3, file$7, 52, 24, 2025);
    			attr_dev(div2, "class", "flex-grow");
    			add_location(div2, file$7, 51, 20, 1976);
    			attr_dev(div3, "class", "flex w-full");
    			add_location(div3, file$7, 45, 16, 1579);
    			attr_dev(div4, "class", "form-control");
    			add_location(div4, file$7, 41, 12, 1398);
    			add_location(br, file$7, 61, 12, 2530);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$7, 63, 16, 2593);
    			attr_dev(div5, "class", "form-control");
    			add_location(div5, file$7, 62, 12, 2549);
    			add_location(form, file$7, 33, 8, 1000);
    			attr_dev(div6, "class", "modal-box relative");
    			add_location(div6, file$7, 31, 4, 870);
    			attr_dev(div7, "class", "modal");
    			add_location(div7, file$7, 30, 0, 845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(label0, t1);
    			append_dev(div6, t2);
    			append_dev(div6, form);
    			append_dev(form, div0);
    			append_dev(div0, label1);
    			append_dev(label1, span0);
    			append_dev(div0, t4);
    			append_dev(div0, input1);
    			set_input_value(input1, /*modelToRequest*/ ctx[1].Name);
    			append_dev(form, t5);
    			append_dev(form, div4);
    			append_dev(div4, label2);
    			append_dev(label2, span1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, input2);
    			set_input_value(input2, /*modelToRequest*/ ctx[1].Color);
    			append_dev(div1, t8);
    			append_dev(div1, input3);
    			set_input_value(input3, /*modelToRequest*/ ctx[1].Color);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, label3);
    			append_dev(label3, span2);
    			append_dev(span2, t10);
    			append_dev(label3, t11);
    			append_dev(label3, input4);
    			input4.checked = /*modelToRequest*/ ctx[1].Income;
    			append_dev(form, t12);
    			append_dev(form, br);
    			append_dev(form, t13);
    			append_dev(form, div5);
    			append_dev(div5, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[7]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[8]),
    					listen_dev(form, "submit", prevent_default(/*create*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ID*/ 1) {
    				attr_dev(input0, "id", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*ID*/ 1) {
    				attr_dev(label0, "for", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*modelToRequest*/ 2 && input1.value !== /*modelToRequest*/ ctx[1].Name) {
    				set_input_value(input1, /*modelToRequest*/ ctx[1].Name);
    			}

    			if (dirty & /*modelToRequest*/ 2) {
    				set_input_value(input2, /*modelToRequest*/ ctx[1].Color);
    			}

    			if (dirty & /*modelToRequest*/ 2 && input3.value !== /*modelToRequest*/ ctx[1].Color) {
    				set_input_value(input3, /*modelToRequest*/ ctx[1].Color);
    			}

    			if (dirty & /*modelToRequest*/ 2 && t10_value !== (t10_value = (/*modelToRequest*/ ctx[1].Income
    			? 'income '
    			: 'outcome ') + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*modelToRequest*/ 2) {
    				set_style(span2, "color", /*modelToRequest*/ ctx[1].Income ? 'green' : 'red');
    			}

    			if (dirty & /*modelToRequest*/ 2) {
    				input4.checked = /*modelToRequest*/ ctx[1].Income;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalCreateCategory', slots, []);

    	const create = async () => {
    		try {
    			$$invalidate(1, modelToRequest.BudgetID = budgetID, modelToRequest);
    			await Request$1.category.create(modelToRequest);
    			await SuccessAction();

    			try {
    				document.getElementById(ID).click(); //to close.
    			} catch {
    				
    			}
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	let { ID = "budget-create-modal" } = $$props;
    	let { budgetID } = $$props;

    	let { SuccessAction = () => {
    		
    	} } = $$props;

    	let modelToRequest = {
    		BudgetID: "",
    		Name: "",
    		Income: false,
    		Color: "#000000"
    	};

    	const writable_props = ['ID', 'budgetID', 'SuccessAction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalCreateCategory> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		modelToRequest.Name = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input2_input_handler() {
    		modelToRequest.Color = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input3_input_handler() {
    		modelToRequest.Color = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input4_change_handler() {
    		modelToRequest.Income = this.checked;
    		$$invalidate(1, modelToRequest);
    	}

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('budgetID' in $$props) $$invalidate(3, budgetID = $$props.budgetID);
    		if ('SuccessAction' in $$props) $$invalidate(4, SuccessAction = $$props.SuccessAction);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		ErrorWrapper,
    		create,
    		ID,
    		budgetID,
    		SuccessAction,
    		modelToRequest
    	});

    	$$self.$inject_state = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('budgetID' in $$props) $$invalidate(3, budgetID = $$props.budgetID);
    		if ('SuccessAction' in $$props) $$invalidate(4, SuccessAction = $$props.SuccessAction);
    		if ('modelToRequest' in $$props) $$invalidate(1, modelToRequest = $$props.modelToRequest);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ID,
    		modelToRequest,
    		create,
    		budgetID,
    		SuccessAction,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_change_handler
    	];
    }

    class ModalCreateCategory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { ID: 0, budgetID: 3, SuccessAction: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalCreateCategory",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*budgetID*/ ctx[3] === undefined && !('budgetID' in props)) {
    			console.warn("<ModalCreateCategory> was created without expected prop 'budgetID'");
    		}
    	}

    	get ID() {
    		throw new Error("<ModalCreateCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<ModalCreateCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get budgetID() {
    		throw new Error("<ModalCreateCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set budgetID(value) {
    		throw new Error("<ModalCreateCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get SuccessAction() {
    		throw new Error("<ModalCreateCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SuccessAction(value) {
    		throw new Error("<ModalCreateCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$2 = ".fixed-btn.svelte-zv83we{position:fixed;bottom:20px;right:30px}";
    styleInject(css_248z$2);

    /* src\views\BudgetCategories.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\views\\BudgetCategories.svelte";

    function create_fragment$6(ctx) {
    	let modalcreatecategory;
    	let t0;
    	let div;
    	let categorylist;
    	let t1;
    	let label;
    	let svg;
    	let path;
    	let current;

    	modalcreatecategory = new ModalCreateCategory({
    			props: {
    				ID: CreateCategoryModalID,
    				budgetID: /*params*/ ctx[0].budgetID,
    				SuccessAction: /*UpdateCategories*/ ctx[2]
    			},
    			$$inline: true
    		});

    	categorylist = new CategoryList({
    			props: {
    				categories: /*categories*/ ctx[1],
    				budgetID: /*params*/ ctx[0].budgetID
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalcreatecategory.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(categorylist.$$.fragment);
    			t1 = space();
    			label = element("label");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div, "class", "center_content");
    			add_location(div, file$6, 28, 0, 895);
    			attr_dev(path, "d", "M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z");
    			add_location(path, file$6, 34, 8, 1180);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "46");
    			attr_dev(svg, "height", "46");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$6, 33, 4, 1087);
    			attr_dev(label, "class", "fixed-btn btn-ghost btn-circle svelte-zv83we");
    			attr_dev(label, "for", CreateCategoryModalID);
    			add_location(label, file$6, 32, 0, 1007);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalcreatecategory, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(categorylist, div, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, svg);
    			append_dev(svg, path);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modalcreatecategory_changes = {};
    			if (dirty & /*params*/ 1) modalcreatecategory_changes.budgetID = /*params*/ ctx[0].budgetID;
    			modalcreatecategory.$set(modalcreatecategory_changes);
    			const categorylist_changes = {};
    			if (dirty & /*categories*/ 2) categorylist_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*params*/ 1) categorylist_changes.budgetID = /*params*/ ctx[0].budgetID;
    			categorylist.$set(categorylist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalcreatecategory.$$.fragment, local);
    			transition_in(categorylist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalcreatecategory.$$.fragment, local);
    			transition_out(categorylist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalcreatecategory, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(categorylist);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const CreateCategoryModalID = "category-create-modal";

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BudgetCategories', slots, []);

    	const UpdateCategories = async () => {
    		try {
    			$$invalidate(1, categories = (await Request$1.category.getList({ BudgetID: params.budgetID })).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	onMount(async () => {
    		await UpdateCategories();
    	});

    	let { params = {} } = $$props;
    	let categories = [];
    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BudgetCategories> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Request: Request$1,
    		CategoryList,
    		ErrorWrapper,
    		ModalCreateCategory,
    		UpdateCategories,
    		params,
    		categories,
    		CreateCategoryModalID
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, categories, UpdateCategories];
    }

    class BudgetCategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BudgetCategories",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get params() {
    		throw new Error("<BudgetCategories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<BudgetCategories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ShowInfo = (message,duration=2000)=>{
        infoMSG.set([message]);
        setTimeout(() => infoMSG.set([]), duration);
    };

    /* src\components\plannedBudget\ModalCreatePlannedBudget.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    const file$5 = "src\\components\\plannedBudget\\ModalCreatePlannedBudget.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (95:28) {#each $avaliableCurrency as currency}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*currency*/ ctx[21] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*currency*/ ctx[21];
    			option.value = option.__value;
    			add_location(option, file$5, 95, 32, 3836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$avaliableCurrency*/ 8 && t_value !== (t_value = /*currency*/ ctx[21] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$avaliableCurrency*/ 8 && option_value_value !== (option_value_value = /*currency*/ ctx[21])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(95:28) {#each $avaliableCurrency as currency}",
    		ctx
    	});

    	return block;
    }

    // (110:24) {#each $avaliableCategories as category}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*category*/ ctx[18].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*category*/ ctx[18].id;
    			option.value = option.__value;
    			add_location(option, file$5, 110, 28, 4486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$avaliableCategories*/ 16 && t_value !== (t_value = /*category*/ ctx[18].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$avaliableCategories*/ 16 && option_value_value !== (option_value_value = /*category*/ ctx[18].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(110:24) {#each $avaliableCategories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let input0;
    	let t0;
    	let div13;
    	let div12;
    	let label0;
    	let t1;
    	let t2;
    	let form;
    	let div0;
    	let label1;
    	let span0;
    	let t4;
    	let input1;
    	let t5;
    	let div1;
    	let textarea;
    	let t6;
    	let div5;
    	let div4;
    	let div2;
    	let label2;
    	let span1;
    	let t8;
    	let input2;
    	let t9;
    	let div3;
    	let label3;
    	let span2;
    	let t11;
    	let input3;
    	let t12;
    	let div9;
    	let label4;
    	let span3;
    	let t14;
    	let div8;
    	let div6;
    	let input4;
    	let t15;
    	let div7;
    	let select0;
    	let t16;
    	let div10;
    	let label5;
    	let span4;
    	let t18;
    	let label6;
    	let select1;
    	let t19;
    	let span5;
    	let input5;
    	let t20;
    	let br;
    	let t21;
    	let div11;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$avaliableCurrency*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*$avaliableCategories*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			div13 = element("div");
    			div12 = element("div");
    			label0 = element("label");
    			t1 = text("✕");
    			t2 = space();
    			form = element("form");
    			div0 = element("div");
    			label1 = element("label");
    			span0 = element("span");
    			span0.textContent = "Planned budget title:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div1 = element("div");
    			textarea = element("textarea");
    			t6 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			label2 = element("label");
    			span1 = element("span");
    			span1.textContent = "Start:";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			div3 = element("div");
    			label3 = element("label");
    			span2 = element("span");
    			span2.textContent = "Close:";
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			div9 = element("div");
    			label4 = element("label");
    			span3 = element("span");
    			span3.textContent = "Enter planned balance:";
    			t14 = space();
    			div8 = element("div");
    			div6 = element("div");
    			input4 = element("input");
    			t15 = space();
    			div7 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t16 = space();
    			div10 = element("div");
    			label5 = element("label");
    			span4 = element("span");
    			span4.textContent = "Select category";
    			t18 = space();
    			label6 = element("label");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t19 = space();
    			span5 = element("span");
    			input5 = element("input");
    			t20 = space();
    			br = element("br");
    			t21 = space();
    			div11 = element("div");
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", /*ID*/ ctx[0]);
    			attr_dev(input0, "class", "modal-toggle");
    			add_location(input0, file$5, 48, 0, 1512);
    			attr_dev(label0, "for", /*ID*/ ctx[0]);
    			attr_dev(label0, "class", "btn btn-sm btn-circle absolute right-2 top-2");
    			add_location(label0, file$5, 51, 8, 1634);
    			attr_dev(span0, "class", "label-text");
    			add_location(span0, file$5, 55, 20, 1863);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file$5, 54, 16, 1820);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Title");
    			attr_dev(input1, "class", "input input-bordered");
    			add_location(input1, file$5, 57, 16, 1960);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file$5, 53, 12, 1776);
    			attr_dev(textarea, "class", "textarea textarea-bordered");
    			attr_dev(textarea, "placeholder", "Descriptions");
    			add_location(textarea, file$5, 62, 16, 2172);
    			attr_dev(div1, "class", "form-control my-4");
    			add_location(div1, file$5, 61, 12, 2123);
    			attr_dev(span1, "class", "label-text");
    			add_location(span1, file$5, 70, 28, 2555);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file$5, 69, 24, 2504);
    			attr_dev(input2, "type", "date");
    			attr_dev(input2, "class", "input");
    			add_location(input2, file$5, 72, 24, 2653);
    			attr_dev(div2, "class", "flex w-full p-2");
    			add_location(div2, file$5, 68, 20, 2449);
    			attr_dev(span2, "class", "label-text");
    			add_location(span2, file$5, 76, 28, 2881);
    			attr_dev(label3, "class", "label");
    			add_location(label3, file$5, 75, 24, 2830);
    			attr_dev(input3, "type", "date");
    			attr_dev(input3, "class", "input");
    			add_location(input3, file$5, 78, 24, 2979);
    			attr_dev(div3, "class", "flex w-full p-2");
    			add_location(div3, file$5, 74, 20, 2775);
    			attr_dev(div4, "class", "flex w-full");
    			add_location(div4, file$5, 67, 16, 2402);
    			attr_dev(div5, "class", "form-control");
    			add_location(div5, file$5, 66, 12, 2358);
    			attr_dev(span3, "class", "label-text");
    			add_location(span3, file$5, 85, 20, 3224);
    			attr_dev(label4, "class", "label");
    			add_location(label4, file$5, 84, 16, 3181);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "amount");
    			attr_dev(input4, "class", "input input-bordered");
    			add_location(input4, file$5, 89, 24, 3413);
    			attr_dev(div6, "class", "pr-5");
    			add_location(div6, file$5, 88, 20, 3369);
    			attr_dev(select0, "class", "select select-bordered");
    			if (/*modelToRequest*/ ctx[1].Currency === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
    			add_location(select0, file$5, 93, 24, 3658);
    			attr_dev(div7, "class", "flex-grow");
    			add_location(div7, file$5, 92, 20, 3609);
    			attr_dev(div8, "class", "flex w-full");
    			add_location(div8, file$5, 87, 16, 3322);
    			attr_dev(div9, "class", "form-control");
    			add_location(div9, file$5, 83, 12, 3137);
    			attr_dev(span4, "class", "label-text");
    			add_location(span4, file$5, 104, 20, 4110);
    			attr_dev(label5, "class", "label");
    			add_location(label5, file$5, 103, 16, 4067);
    			attr_dev(select1, "class", "select select-bordered btn-wide");
    			select1.disabled = /*CategoryNull*/ ctx[2];
    			if (/*modelToRequest*/ ctx[1].CategoryID === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$5, 107, 20, 4250);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "class", "toggle toggle-md");
    			add_location(input5, file$5, 114, 24, 4656);
    			add_location(span5, file$5, 113, 20, 4624);
    			attr_dev(label6, "class", "input-group");
    			add_location(label6, file$5, 106, 16, 4201);
    			attr_dev(div10, "class", "form-control");
    			add_location(div10, file$5, 102, 12, 4023);
    			add_location(br, file$5, 121, 12, 4923);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$5, 124, 16, 4988);
    			attr_dev(div11, "class", "form-control");
    			add_location(div11, file$5, 123, 12, 4944);
    			add_location(form, file$5, 52, 8, 1722);
    			attr_dev(div12, "class", "modal-box relative");
    			add_location(div12, file$5, 50, 4, 1592);
    			attr_dev(div13, "class", "modal");
    			add_location(div13, file$5, 49, 0, 1567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div12);
    			append_dev(div12, label0);
    			append_dev(label0, t1);
    			append_dev(div12, t2);
    			append_dev(div12, form);
    			append_dev(form, div0);
    			append_dev(div0, label1);
    			append_dev(label1, span0);
    			append_dev(div0, t4);
    			append_dev(div0, input1);
    			set_input_value(input1, /*modelToRequest*/ ctx[1].Title);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*modelToRequest*/ ctx[1].Desctiption);
    			append_dev(form, t6);
    			append_dev(form, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label2);
    			append_dev(label2, span1);
    			append_dev(div2, t8);
    			append_dev(div2, input2);
    			set_input_value(input2, /*modelToRequest*/ ctx[1].DateStart);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, label3);
    			append_dev(label3, span2);
    			append_dev(div3, t11);
    			append_dev(div3, input3);
    			set_input_value(input3, /*modelToRequest*/ ctx[1].DateEnd);
    			append_dev(form, t12);
    			append_dev(form, div9);
    			append_dev(div9, label4);
    			append_dev(label4, span3);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, input4);
    			set_input_value(input4, /*modelToRequest*/ ctx[1].PlannedAmount);
    			append_dev(div8, t15);
    			append_dev(div8, div7);
    			append_dev(div7, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*modelToRequest*/ ctx[1].Currency);
    			append_dev(form, t16);
    			append_dev(form, div10);
    			append_dev(div10, label5);
    			append_dev(label5, span4);
    			append_dev(div10, t18);
    			append_dev(div10, label6);
    			append_dev(label6, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*modelToRequest*/ ctx[1].CategoryID);
    			append_dev(label6, t19);
    			append_dev(label6, span5);
    			append_dev(span5, input5);
    			input5.checked = /*CategoryNull*/ ctx[2];
    			append_dev(form, t20);
    			append_dev(form, br);
    			append_dev(form, t21);
    			append_dev(form, div11);
    			append_dev(div11, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[9]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[15]),
    					listen_dev(input5, "change", /*change_handler*/ ctx[16], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*create*/ ctx[5]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ID*/ 1) {
    				attr_dev(input0, "id", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*ID*/ 1) {
    				attr_dev(label0, "for", /*ID*/ ctx[0]);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10 && input1.value !== /*modelToRequest*/ ctx[1].Title) {
    				set_input_value(input1, /*modelToRequest*/ ctx[1].Title);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10) {
    				set_input_value(textarea, /*modelToRequest*/ ctx[1].Desctiption);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10) {
    				set_input_value(input2, /*modelToRequest*/ ctx[1].DateStart);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10) {
    				set_input_value(input3, /*modelToRequest*/ ctx[1].DateEnd);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10 && to_number(input4.value) !== /*modelToRequest*/ ctx[1].PlannedAmount) {
    				set_input_value(input4, /*modelToRequest*/ ctx[1].PlannedAmount);
    			}

    			if (dirty & /*$avaliableCurrency*/ 8) {
    				each_value_1 = /*$avaliableCurrency*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10) {
    				select_option(select0, /*modelToRequest*/ ctx[1].Currency);
    			}

    			if (dirty & /*$avaliableCategories*/ 16) {
    				each_value = /*$avaliableCategories*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*CategoryNull*/ 4) {
    				prop_dev(select1, "disabled", /*CategoryNull*/ ctx[2]);
    			}

    			if (dirty & /*modelToRequest, $avaliableCurrency*/ 10) {
    				select_option(select1, /*modelToRequest*/ ctx[1].CategoryID);
    			}

    			if (dirty & /*CategoryNull*/ 4) {
    				input5.checked = /*CategoryNull*/ ctx[2];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div13);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $selectedBudget;
    	let $avaliableCurrency;
    	let $avaliableCategories;
    	validate_store(selectedBudget, 'selectedBudget');
    	component_subscribe($$self, selectedBudget, $$value => $$invalidate(17, $selectedBudget = $$value));
    	validate_store(avaliableCurrency, 'avaliableCurrency');
    	component_subscribe($$self, avaliableCurrency, $$value => $$invalidate(3, $avaliableCurrency = $$value));
    	validate_store(avaliableCategories, 'avaliableCategories');
    	component_subscribe($$self, avaliableCategories, $$value => $$invalidate(4, $avaliableCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalCreatePlannedBudget', slots, []);

    	const create = async () => {
    		console.log(modelToRequest);

    		try {
    			$$invalidate(1, modelToRequest.BudgetID = budgetID, modelToRequest);
    			await Request$1.plannedBudget.create(modelToRequest);
    			await SuccessAction();

    			try {
    				document.getElementById(ID).click(); //to close.
    			} catch {
    				
    			}

    			$$invalidate(1, modelToRequest = {
    				BudgetID: "",
    				DateStart: new Date(),
    				DateEnd: new Date(),
    				Title: "",
    				Desctiption: "",
    				PlannedAmount: 100,
    				Currency: $selectedBudget?.balance?.currency || "UAH",
    				CategoryID: null
    			});
    		} catch(err) {
    			console.log(err);
    			ErrorWrapper(err);
    		}
    	};

    	let { ID = "planned-budget-create-modal" } = $$props;
    	let { budgetID } = $$props;

    	let { SuccessAction = () => {
    		
    	} } = $$props;

    	let modelToRequest = {
    		BudgetID: "",
    		DateStart: new Date(),
    		DateEnd: new Date(),
    		Title: "",
    		Desctiption: "",
    		PlannedAmount: 100,
    		Currency: $selectedBudget?.balance?.currency || "UAH",
    		CategoryID: null
    	};

    	let CategoryNull = true;
    	const writable_props = ['ID', 'budgetID', 'SuccessAction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ModalCreatePlannedBudget> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		modelToRequest.Title = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function textarea_input_handler() {
    		modelToRequest.Desctiption = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input2_input_handler() {
    		modelToRequest.DateStart = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input3_input_handler() {
    		modelToRequest.DateEnd = this.value;
    		$$invalidate(1, modelToRequest);
    	}

    	function input4_input_handler() {
    		modelToRequest.PlannedAmount = to_number(this.value);
    		$$invalidate(1, modelToRequest);
    	}

    	function select0_change_handler() {
    		modelToRequest.Currency = select_value(this);
    		$$invalidate(1, modelToRequest);
    	}

    	function select1_change_handler() {
    		modelToRequest.CategoryID = select_value(this);
    		$$invalidate(1, modelToRequest);
    	}

    	function input5_change_handler() {
    		CategoryNull = this.checked;
    		$$invalidate(2, CategoryNull);
    	}

    	const change_handler = () => {
    		if (CategoryNull) $$invalidate(1, modelToRequest.CategoryID = null, modelToRequest);
    	};

    	$$self.$$set = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('budgetID' in $$props) $$invalidate(6, budgetID = $$props.budgetID);
    		if ('SuccessAction' in $$props) $$invalidate(7, SuccessAction = $$props.SuccessAction);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		ErrorWrapper,
    		avaliableCategories,
    		avaliableCurrency,
    		selectedBudget,
    		create,
    		ID,
    		budgetID,
    		SuccessAction,
    		modelToRequest,
    		CategoryNull,
    		$selectedBudget,
    		$avaliableCurrency,
    		$avaliableCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('ID' in $$props) $$invalidate(0, ID = $$props.ID);
    		if ('budgetID' in $$props) $$invalidate(6, budgetID = $$props.budgetID);
    		if ('SuccessAction' in $$props) $$invalidate(7, SuccessAction = $$props.SuccessAction);
    		if ('modelToRequest' in $$props) $$invalidate(1, modelToRequest = $$props.modelToRequest);
    		if ('CategoryNull' in $$props) $$invalidate(2, CategoryNull = $$props.CategoryNull);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ID,
    		modelToRequest,
    		CategoryNull,
    		$avaliableCurrency,
    		$avaliableCategories,
    		create,
    		budgetID,
    		SuccessAction,
    		input1_input_handler,
    		textarea_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input5_change_handler,
    		change_handler
    	];
    }

    class ModalCreatePlannedBudget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { ID: 0, budgetID: 6, SuccessAction: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalCreatePlannedBudget",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*budgetID*/ ctx[6] === undefined && !('budgetID' in props)) {
    			console_1.warn("<ModalCreatePlannedBudget> was created without expected prop 'budgetID'");
    		}
    	}

    	get ID() {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ID(value) {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get budgetID() {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set budgetID(value) {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get SuccessAction() {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SuccessAction(value) {
    		throw new Error("<ModalCreatePlannedBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\plannedBudget\PlannedBudgetList.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\plannedBudget\\PlannedBudgetList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[9] = list;
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (75:12) <Dialog ModalID="modal_remove_PB_{plannedBudget.id}" ConfirmFunction={ActionToRemove}                      ConfirmFunctionParams={{id:plannedBudget.id}}>
    function create_default_slot(ctx) {
    	let h1;
    	let t0;
    	let br;
    	let b;
    	let t1_value = /*plannedBudget*/ ctx[8].title + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("You really want to delete ");
    			br = element("br");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = text(" planned budget?");
    			add_location(br, file$4, 76, 46, 3015);
    			add_location(b, file$4, 76, 51, 3020);
    			add_location(h1, file$4, 76, 16, 2985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, br);
    			append_dev(h1, b);
    			append_dev(b, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*plannedBudgets*/ 1 && t1_value !== (t1_value = /*plannedBudget*/ ctx[8].title + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(75:12) <Dialog ModalID=\\\"modal_remove_PB_{plannedBudget.id}\\\" ConfirmFunction={ActionToRemove}                      ConfirmFunctionParams={{id:plannedBudget.id}}>",
    		ctx
    	});

    	return block;
    }

    // (119:16) {:else}
    function create_else_block(ctx) {
    	let td0;
    	let input0;
    	let input0_class_value;
    	let td0_class_value;
    	let t0;
    	let td1;
    	let div;
    	let input1;
    	let input1_max_value;
    	let td1_class_value;
    	let t1;
    	let td2;
    	let t2_value = /*plannedBudget*/ ctx[8].plannedBalance.amount + "";
    	let t2;
    	let td2_class_value;
    	let t3;
    	let td3;
    	let t4;
    	let td3_class_value;
    	let t5;
    	let td4;
    	let label;
    	let t6;
    	let label_for_value;
    	let t7;
    	let button;
    	let td4_class_value;
    	let mounted;
    	let dispose;

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[6].call(input0, /*each_value*/ ctx[9], /*plannedBudget_index*/ ctx[10]);
    	}

    	function input1_change_input_handler() {
    		/*input1_change_input_handler*/ ctx[7].call(input1, /*each_value*/ ctx[9], /*plannedBudget_index*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			input0 = element("input");
    			t0 = space();
    			td1 = element("td");
    			div = element("div");
    			input1 = element("input");
    			t1 = space();
    			td2 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td3 = element("td");
    			t4 = text("Not bound");
    			t5 = space();
    			td4 = element("td");
    			label = element("label");
    			t6 = text("Delete");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Save";
    			attr_dev(input0, "class", input0_class_value = "input input-sm text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(input0, file$4, 120, 24, 5440);
    			attr_dev(td0, "class", td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td0, file$4, 119, 20, 5359);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", input1_max_value = /*plannedBudget*/ ctx[8].plannedBalance.amount);
    			attr_dev(input1, "class", "range range-sm range-accent");
    			add_location(input1, file$4, 125, 28, 5778);
    			attr_dev(div, "class", "ml-2 mr-2");
    			add_location(div, file$4, 124, 24, 5725);
    			attr_dev(td1, "class", td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td1, file$4, 123, 20, 5644);
    			attr_dev(td2, "class", td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td2, file$4, 130, 20, 6089);
    			attr_dev(td3, "class", td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td3, file$4, 133, 20, 6256);
    			attr_dev(label, "for", label_for_value = "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id);
    			attr_dev(label, "class", "btn btn-ghost btn-xs");
    			add_location(label, file$4, 135, 24, 6416);
    			attr_dev(button, "class", "btn btn-ghost btn-xs");
    			add_location(button, file$4, 138, 24, 6589);
    			attr_dev(td4, "class", td4_class_value = /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td4, file$4, 134, 20, 6347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, input0);
    			set_input_value(input0, /*plannedBudget*/ ctx[8].realizeBalance.amount);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, div);
    			append_dev(div, input1);
    			set_input_value(input1, /*plannedBudget*/ ctx[8].realizeBalance.amount);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, td2, anchor);
    			append_dev(td2, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, td3, anchor);
    			append_dev(td3, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, td4, anchor);
    			append_dev(td4, label);
    			append_dev(label, t6);
    			append_dev(td4, t7);
    			append_dev(td4, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(input1, "change", input1_change_input_handler),
    					listen_dev(input1, "input", input1_change_input_handler),
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*SaveAction*/ ctx[4](/*plannedBudget*/ ctx[8].id, /*plannedBudget*/ ctx[8].realizeBalance.amount))) /*SaveAction*/ ctx[4](/*plannedBudget*/ ctx[8].id, /*plannedBudget*/ ctx[8].realizeBalance.amount).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*plannedBudgets*/ 1 && input0_class_value !== (input0_class_value = "input input-sm text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(input0, "class", input0_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && input0.value !== /*plannedBudget*/ ctx[8].realizeBalance.amount) {
    				set_input_value(input0, /*plannedBudget*/ ctx[8].realizeBalance.amount);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td0_class_value !== (td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td0, "class", td0_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && input1_max_value !== (input1_max_value = /*plannedBudget*/ ctx[8].plannedBalance.amount)) {
    				attr_dev(input1, "max", input1_max_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1) {
    				set_input_value(input1, /*plannedBudget*/ ctx[8].realizeBalance.amount);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td1_class_value !== (td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && t2_value !== (t2_value = /*plannedBudget*/ ctx[8].plannedBalance.amount + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*plannedBudgets*/ 1 && td2_class_value !== (td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td3_class_value !== (td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td3, "class", td3_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && label_for_value !== (label_for_value = "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td4_class_value !== (td4_class_value = /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td4, "class", td4_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(td1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(td2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(td3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(td4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(119:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (95:16) {#if plannedBudget.transactionDescriptionCategory}
    function create_if_block$1(ctx) {
    	let td0;
    	let t0_value = /*plannedBudget*/ ctx[8].realizeBalance.amount + "";
    	let t0;
    	let td0_class_value;
    	let t1;
    	let td1;
    	let div;
    	let input;
    	let input_max_value;
    	let input_value_value;
    	let td1_class_value;
    	let t2;
    	let td2;
    	let t3_value = /*plannedBudget*/ ctx[8].plannedBalance.amount + "";
    	let t3;
    	let td2_class_value;
    	let t4;
    	let td3;
    	let t5_value = /*plannedBudget*/ ctx[8].transactionDescriptionCategory.name + "";
    	let t5;
    	let td3_class_value;
    	let t6;
    	let td4;
    	let label;
    	let t7;
    	let label_for_value;
    	let td4_class_value;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			div = element("div");
    			input = element("input");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			label = element("label");
    			t7 = text("Delete");
    			attr_dev(td0, "class", td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td0, file$4, 95, 20, 3975);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", input_max_value = /*plannedBudget*/ ctx[8].plannedBalance.amount);
    			input.value = input_value_value = /*plannedBudget*/ ctx[8].realizeBalance.amount;
    			attr_dev(input, "class", "range range-sm range-accent");
    			input.disabled = true;
    			add_location(input, file$4, 100, 28, 4276);
    			attr_dev(div, "class", "ml-2 mr-2");
    			add_location(div, file$4, 99, 24, 4223);
    			attr_dev(td1, "class", td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td1, file$4, 98, 20, 4142);
    			attr_dev(td2, "class", td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td2, file$4, 106, 20, 4629);
    			attr_dev(td3, "class", td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			set_style(td3, "color", /*plannedBudget*/ ctx[8].transactionDescriptionCategory.color);
    			add_location(td3, file$4, 109, 20, 4796);
    			attr_dev(label, "for", label_for_value = "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id);
    			attr_dev(label, "class", "btn btn-ghost btn-xs");
    			add_location(label, file$4, 114, 24, 5138);
    			attr_dev(td4, "class", td4_class_value = /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td4, file$4, 113, 20, 5069);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, div);
    			append_dev(div, input);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, td2, anchor);
    			append_dev(td2, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, td3, anchor);
    			append_dev(td3, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, td4, anchor);
    			append_dev(td4, label);
    			append_dev(label, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*plannedBudgets*/ 1 && t0_value !== (t0_value = /*plannedBudget*/ ctx[8].realizeBalance.amount + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*plannedBudgets*/ 1 && td0_class_value !== (td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td0, "class", td0_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && input_max_value !== (input_max_value = /*plannedBudget*/ ctx[8].plannedBalance.amount)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && input_value_value !== (input_value_value = /*plannedBudget*/ ctx[8].realizeBalance.amount)) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td1_class_value !== (td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && t3_value !== (t3_value = /*plannedBudget*/ ctx[8].plannedBalance.amount + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*plannedBudgets*/ 1 && td2_class_value !== (td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && t5_value !== (t5_value = /*plannedBudget*/ ctx[8].transactionDescriptionCategory.name + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*plannedBudgets*/ 1 && td3_class_value !== (td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td3, "class", td3_class_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1) {
    				set_style(td3, "color", /*plannedBudget*/ ctx[8].transactionDescriptionCategory.color);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && label_for_value !== (label_for_value = "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*plannedBudgets*/ 1 && td4_class_value !== (td4_class_value = /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td4, "class", td4_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(td1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(td2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(td3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(td4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(95:16) {#if plannedBudget.transactionDescriptionCategory}",
    		ctx
    	});

    	return block;
    }

    // (74:8) {#each plannedBudgets as plannedBudget}
    function create_each_block$1(ctx) {
    	let dialog;
    	let t0;
    	let tr;
    	let td0;
    	let label;
    	let b;
    	let t1_value = /*plannedBudget*/ ctx[8].title + "";
    	let t1;
    	let td0_class_value;
    	let t2;
    	let td1;
    	let t3_value = /*plannedBudget*/ ctx[8].desctiption + "";
    	let t3;
    	let td1_class_value;
    	let t4;
    	let td2;
    	let t5_value = /*plannedBudget*/ ctx[8].dateStart.split("T")[0] + "";
    	let t5;
    	let td2_class_value;
    	let t6;
    	let td3;
    	let t7_value = /*plannedBudget*/ ctx[8].dateEnd.split("T")[0] + "";
    	let t7;
    	let td3_class_value;
    	let t8;
    	let td4;
    	let t9_value = /*plannedBudget*/ ctx[8].plannedBalance.currency + "";
    	let t9;
    	let td4_class_value;
    	let t10;
    	let t11;
    	let current;

    	dialog = new Dialog({
    			props: {
    				ModalID: "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id,
    				ConfirmFunction: /*ActionToRemove*/ ctx[3],
    				ConfirmFunctionParams: { id: /*plannedBudget*/ ctx[8].id },
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*plannedBudget*/ ctx[8].transactionDescriptionCategory) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    			t0 = space();
    			tr = element("tr");
    			td0 = element("td");
    			label = element("label");
    			b = element("b");
    			t1 = text(t1_value);
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			if_block.c();
    			t11 = space();
    			add_location(b, file$4, 80, 27, 3212);
    			add_location(label, file$4, 80, 20, 3205);
    			attr_dev(td0, "class", td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td0, file$4, 79, 16, 3128);
    			attr_dev(td1, "class", td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td1, file$4, 82, 16, 3289);
    			attr_dev(td2, "class", td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td2, file$4, 85, 16, 3434);
    			attr_dev(td3, "class", td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td3, file$4, 88, 16, 3591);
    			attr_dev(td4, "class", td4_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]));
    			add_location(td4, file$4, 91, 16, 3746);
    			add_location(tr, file$4, 78, 12, 3106);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, label);
    			append_dev(label, b);
    			append_dev(b, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, t9);
    			append_dev(tr, t10);
    			if_block.m(tr, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty & /*plannedBudgets*/ 1) dialog_changes.ModalID = "modal_remove_PB_" + /*plannedBudget*/ ctx[8].id;
    			if (dirty & /*plannedBudgets*/ 1) dialog_changes.ConfirmFunctionParams = { id: /*plannedBudget*/ ctx[8].id };

    			if (dirty & /*$$scope, plannedBudgets*/ 2049) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    			if ((!current || dirty & /*plannedBudgets*/ 1) && t1_value !== (t1_value = /*plannedBudget*/ ctx[8].title + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*plannedBudgets*/ 1 && td0_class_value !== (td0_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td0, "class", td0_class_value);
    			}

    			if ((!current || dirty & /*plannedBudgets*/ 1) && t3_value !== (t3_value = /*plannedBudget*/ ctx[8].desctiption + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*plannedBudgets*/ 1 && td1_class_value !== (td1_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if ((!current || dirty & /*plannedBudgets*/ 1) && t5_value !== (t5_value = /*plannedBudget*/ ctx[8].dateStart.split("T")[0] + "")) set_data_dev(t5, t5_value);

    			if (!current || dirty & /*plannedBudgets*/ 1 && td2_class_value !== (td2_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if ((!current || dirty & /*plannedBudgets*/ 1) && t7_value !== (t7_value = /*plannedBudget*/ ctx[8].dateEnd.split("T")[0] + "")) set_data_dev(t7, t7_value);

    			if (!current || dirty & /*plannedBudgets*/ 1 && td3_class_value !== (td3_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td3, "class", td3_class_value);
    			}

    			if ((!current || dirty & /*plannedBudgets*/ 1) && t9_value !== (t9_value = /*plannedBudget*/ ctx[8].plannedBalance.currency + "")) set_data_dev(t9, t9_value);

    			if (!current || dirty & /*plannedBudgets*/ 1 && td4_class_value !== (td4_class_value = "text-center " + /*style*/ ctx[5].bgColor(/*plannedBudget*/ ctx[8]))) {
    				attr_dev(td4, "class", td4_class_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t11);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(tr);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(74:8) {#each plannedBudgets as plannedBudget}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let modalcreateplannedbudget;
    	let t0;
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let th4;
    	let t10;
    	let th5;
    	let t12;
    	let th6;
    	let t14;
    	let th7;
    	let t16;
    	let th8;
    	let t18;
    	let th9;
    	let label;
    	let t19;
    	let t20;
    	let tbody;
    	let current;

    	modalcreateplannedbudget = new ModalCreatePlannedBudget({
    			props: {
    				ID: CreatePlannedBudgetModalID,
    				budgetID: /*budgetID*/ ctx[2],
    				SuccessAction: /*UpdatePlannedBudgets*/ ctx[1]
    			},
    			$$inline: true
    		});

    	let each_value = /*plannedBudgets*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(modalcreateplannedbudget.$$.fragment);
    			t0 = space();
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Title";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "Description";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "Start";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "Close";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "Currency";
    			t10 = space();
    			th5 = element("th");
    			th5.textContent = "Completed";
    			t12 = space();
    			th6 = element("th");
    			th6.textContent = "Progress";
    			t14 = space();
    			th7 = element("th");
    			th7.textContent = "Planned";
    			t16 = space();
    			th8 = element("th");
    			th8.textContent = "Category";
    			t18 = space();
    			th9 = element("th");
    			label = element("label");
    			t19 = text("Add");
    			t20 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "text-center");
    			add_location(th0, file$4, 57, 12, 2028);
    			attr_dev(th1, "class", "text-center");
    			add_location(th1, file$4, 58, 12, 2076);
    			attr_dev(th2, "class", "text-center");
    			add_location(th2, file$4, 59, 12, 2130);
    			attr_dev(th3, "class", "text-center");
    			add_location(th3, file$4, 60, 12, 2178);
    			attr_dev(th4, "class", "text-center");
    			add_location(th4, file$4, 61, 12, 2226);
    			attr_dev(th5, "class", "text-center");
    			add_location(th5, file$4, 62, 12, 2277);
    			attr_dev(th6, "class", "text-center");
    			add_location(th6, file$4, 63, 12, 2329);
    			attr_dev(th7, "class", "text-center");
    			add_location(th7, file$4, 64, 12, 2380);
    			attr_dev(th8, "class", "text-center");
    			add_location(th8, file$4, 65, 12, 2430);
    			attr_dev(label, "for", CreatePlannedBudgetModalID);
    			attr_dev(label, "class", "btn btn-sm btn-outline");
    			add_location(label, file$4, 67, 16, 2523);
    			attr_dev(th9, "class", "text-center");
    			add_location(th9, file$4, 66, 12, 2481);
    			add_location(tr, file$4, 56, 8, 2010);
    			add_location(thead, file$4, 55, 8, 1993);
    			add_location(tbody, file$4, 71, 8, 2667);
    			attr_dev(table, "class", "table w-full");
    			add_location(table, file$4, 54, 4, 1955);
    			attr_dev(div, "class", "overflow-x-auto");
    			add_location(div, file$4, 53, 0, 1920);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalcreateplannedbudget, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    			append_dev(tr, t10);
    			append_dev(tr, th5);
    			append_dev(tr, t12);
    			append_dev(tr, th6);
    			append_dev(tr, t14);
    			append_dev(tr, th7);
    			append_dev(tr, t16);
    			append_dev(tr, th8);
    			append_dev(tr, t18);
    			append_dev(tr, th9);
    			append_dev(th9, label);
    			append_dev(label, t19);
    			append_dev(table, t20);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modalcreateplannedbudget_changes = {};
    			if (dirty & /*budgetID*/ 4) modalcreateplannedbudget_changes.budgetID = /*budgetID*/ ctx[2];
    			if (dirty & /*UpdatePlannedBudgets*/ 2) modalcreateplannedbudget_changes.SuccessAction = /*UpdatePlannedBudgets*/ ctx[1];
    			modalcreateplannedbudget.$set(modalcreateplannedbudget_changes);

    			if (dirty & /*style, plannedBudgets, SaveAction, ActionToRemove*/ 57) {
    				each_value = /*plannedBudgets*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalcreateplannedbudget.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalcreateplannedbudget.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalcreateplannedbudget, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const CreatePlannedBudgetModalID = "planned-budget-create-modal";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlannedBudgetList', slots, []);

    	const ActionToRemove = async ({ id }) => {
    		try {
    			await Request$1.plannedBudget.delete({ BudgetID: budgetID, PlannedBudgetID: id });
    			await UpdatePlannedBudgets();
    			ShowInfo("Planned budget deleted.");
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	let { UpdatePlannedBudgets = async () => {
    		try {
    			$$invalidate(0, plannedBudgets = (await Request$1.plannedBudget.getList({ BudgetID: params.budgetID })).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	} } = $$props;

    	const SaveAction = async (PlannedBudgetID, PlannedAmount) => {
    		try {
    			await Request$1.plannedBudget.setAmount({
    				BudgetID: budgetID,
    				PlannedBudgetID,
    				PlannedAmount
    			});

    			ShowInfo("Planned budget saved.");
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	const style = {
    		bgColor: plannedBudget => {
    			if (Date.now() > Date.parse(plannedBudget.dateEnd) && plannedBudget.realizeBalance.amount < plannedBudget.plannedBalance.amount) return 'bg-red-100'; else if (plannedBudget.realizeBalance.amount >= plannedBudget.plannedBalance.amount) {
    				return 'bg-green-100';
    			}

    			return '';
    		}
    	};

    	let { plannedBudgets = [] } = $$props;
    	let { budgetID } = $$props;
    	const writable_props = ['UpdatePlannedBudgets', 'plannedBudgets', 'budgetID'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlannedBudgetList> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler(each_value, plannedBudget_index) {
    		each_value[plannedBudget_index].realizeBalance.amount = this.value;
    		$$invalidate(0, plannedBudgets);
    	}

    	function input1_change_input_handler(each_value, plannedBudget_index) {
    		each_value[plannedBudget_index].realizeBalance.amount = to_number(this.value);
    		$$invalidate(0, plannedBudgets);
    	}

    	$$self.$$set = $$props => {
    		if ('UpdatePlannedBudgets' in $$props) $$invalidate(1, UpdatePlannedBudgets = $$props.UpdatePlannedBudgets);
    		if ('plannedBudgets' in $$props) $$invalidate(0, plannedBudgets = $$props.plannedBudgets);
    		if ('budgetID' in $$props) $$invalidate(2, budgetID = $$props.budgetID);
    	};

    	$$self.$capture_state = () => ({
    		Request: Request$1,
    		ErrorWrapper,
    		ShowInfo,
    		Dialog,
    		ModalCreatePlannedBudget,
    		ActionToRemove,
    		UpdatePlannedBudgets,
    		SaveAction,
    		style,
    		plannedBudgets,
    		budgetID,
    		CreatePlannedBudgetModalID
    	});

    	$$self.$inject_state = $$props => {
    		if ('UpdatePlannedBudgets' in $$props) $$invalidate(1, UpdatePlannedBudgets = $$props.UpdatePlannedBudgets);
    		if ('plannedBudgets' in $$props) $$invalidate(0, plannedBudgets = $$props.plannedBudgets);
    		if ('budgetID' in $$props) $$invalidate(2, budgetID = $$props.budgetID);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		plannedBudgets,
    		UpdatePlannedBudgets,
    		budgetID,
    		ActionToRemove,
    		SaveAction,
    		style,
    		input0_input_handler,
    		input1_change_input_handler
    	];
    }

    class PlannedBudgetList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			UpdatePlannedBudgets: 1,
    			plannedBudgets: 0,
    			budgetID: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlannedBudgetList",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*budgetID*/ ctx[2] === undefined && !('budgetID' in props)) {
    			console.warn("<PlannedBudgetList> was created without expected prop 'budgetID'");
    		}
    	}

    	get UpdatePlannedBudgets() {
    		throw new Error("<PlannedBudgetList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set UpdatePlannedBudgets(value) {
    		throw new Error("<PlannedBudgetList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plannedBudgets() {
    		throw new Error("<PlannedBudgetList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plannedBudgets(value) {
    		throw new Error("<PlannedBudgetList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get budgetID() {
    		throw new Error("<PlannedBudgetList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set budgetID(value) {
    		throw new Error("<PlannedBudgetList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\PlannedBudget.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\views\\PlannedBudget.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let plannedbudgetlist;
    	let current;

    	plannedbudgetlist = new PlannedBudgetList({
    			props: {
    				plannedBudgets: /*plannedBudgets*/ ctx[1],
    				budgetID: /*params*/ ctx[0].budgetID,
    				UpdatePlannedBudgets: /*UpdatePlannedBudgets*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(plannedbudgetlist.$$.fragment);
    			attr_dev(div, "class", "center_content");
    			add_location(div, file$3, 30, 0, 974);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(plannedbudgetlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const plannedbudgetlist_changes = {};
    			if (dirty & /*plannedBudgets*/ 2) plannedbudgetlist_changes.plannedBudgets = /*plannedBudgets*/ ctx[1];
    			if (dirty & /*params*/ 1) plannedbudgetlist_changes.budgetID = /*params*/ ctx[0].budgetID;
    			plannedbudgetlist.$set(plannedbudgetlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plannedbudgetlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plannedbudgetlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(plannedbudgetlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const CreatePlannedBudgetsModalID = "category-planned-budget-modal";

    function instance$3($$self, $$props, $$invalidate) {
    	let $avaliableCategories;
    	validate_store(avaliableCategories, 'avaliableCategories');
    	component_subscribe($$self, avaliableCategories, $$value => $$invalidate(3, $avaliableCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlannedBudget', slots, []);

    	const UpdatePlannedBudgets = async () => {
    		try {
    			$$invalidate(1, plannedBudgets = (await Request$1.plannedBudget.getList({ BudgetID: params.budgetID })).data);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	};

    	onMount(async () => {
    		await UpdatePlannedBudgets();

    		try {
    			set_store_value(avaliableCategories, $avaliableCategories = (await Request$1.category.getList({ BudgetID: params.budgetID })).data, $avaliableCategories);
    		} catch(err) {
    			ErrorWrapper(err);
    		}
    	});

    	let { params = {} } = $$props;
    	let plannedBudgets = [];
    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlannedBudget> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		PlannedBudgetList,
    		Request: Request$1,
    		ErrorWrapper,
    		avaliableCategories,
    		UpdatePlannedBudgets,
    		params,
    		plannedBudgets,
    		CreatePlannedBudgetsModalID,
    		$avaliableCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('plannedBudgets' in $$props) $$invalidate(1, plannedBudgets = $$props.plannedBudgets);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, plannedBudgets, UpdatePlannedBudgets];
    }

    class PlannedBudget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlannedBudget",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get params() {
    		throw new Error("<PlannedBudget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<PlannedBudget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var routes = {
        "/budget/:budgetID/planned": PlannedBudget,
        "/budget/:budgetID/category": BudgetCategories,
        "/budget/:budgetID": BudgetDetails,
        "/": Root,
        "/profile": Profile,
        "*": NotFound,
    };

    /* src\components\layout\Header.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\components\\layout\\Header.svelte";

    function create_fragment$2(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let label;
    	let svg0;
    	let path0;
    	let t0;
    	let ul;
    	let li0;
    	let a0;
    	let t2;
    	let li1;
    	let a1;
    	let t4;
    	let div2;
    	let a2;
    	let t6;
    	let div3;
    	let a3;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Profile";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Logout";
    			t4 = space();
    			div2 = element("div");
    			a2 = element("a");
    			a2.textContent = "BudgetFrog";
    			t6 = space();
    			div3 = element("div");
    			a3 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h16M4 18h7");
    			add_location(path0, file$2, 22, 20, 667);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-5 w-5");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			add_location(svg0, file$2, 20, 16, 513);
    			attr_dev(label, "tabindex", "0");
    			attr_dev(label, "class", "btn btn-ghost btn-circle");
    			add_location(label, file$2, 19, 12, 442);
    			attr_dev(a0, "href", "/#/profile");
    			add_location(a0, file$2, 26, 20, 952);
    			add_location(li0, file$2, 26, 16, 948);
    			attr_dev(a1, "href", "/#/");
    			add_location(a1, file$2, 27, 20, 1011);
    			add_location(li1, file$2, 27, 16, 1007);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52");
    			add_location(ul, file$2, 25, 12, 825);
    			attr_dev(div0, "class", "dropdown");
    			add_location(div0, file$2, 18, 8, 406);
    			attr_dev(div1, "class", "navbar-start");
    			add_location(div1, file$2, 17, 4, 370);
    			attr_dev(a2, "href", "/#/");
    			attr_dev(a2, "class", "btn btn-ghost normal-case text-xl");
    			add_location(a2, file$2, 32, 8, 1148);
    			attr_dev(div2, "class", "navbar-center");
    			add_location(div2, file$2, 31, 4, 1111);
    			attr_dev(path1, "d", "M256,32C132.3,32,32,134.9,32,261.7c0,101.5,64.2,187.5,153.2,217.9a17.56,17.56,0,0,0,3.8.4c8.3,0,11.5-6.1,11.5-11.4,0-5.5-.2-19.9-.3-39.1a102.4,102.4,0,0,1-22.6,2.7c-43.1,0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1,1.4-14.1h.1c22.5,2,34.3,23.8,34.3,23.8,11.2,19.6,26.2,25.1,39.6,25.1a63,63,0,0,0,25.6-6c2-14.8,7.8-24.9,14.2-30.7-49.7-5.8-102-25.5-102-113.5,0-25.1,8.7-45.6,23-61.6-2.3-5.8-10-29.2,2.2-60.8a18.64,18.64,0,0,1,5-.5c8.1,0,26.4,3.1,56.6,24.1a208.21,208.21,0,0,1,112.2,0c30.2-21,48.5-24.1,56.6-24.1a18.64,18.64,0,0,1,5,.5c12.2,31.6,4.5,55,2.2,60.8,14.3,16.1,23,36.6,23,61.6,0,88.2-52.4,107.6-102.3,113.3,8,7.1,15.2,21.1,15.2,42.5,0,30.7-.3,55.5-.3,63,0,5.4,3.1,11.5,11.4,11.5a19.35,19.35,0,0,0,4-.4C415.9,449.2,480,363.1,480,261.7,480,134.9,379.7,32,256,32Z");
    			add_location(path1, file$2, 39, 16, 1631);
    			attr_dev(svg1, "width", "20");
    			attr_dev(svg1, "height", "20");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "class", "inline-block h-5 w-5 fill-current md:h-6 md:w-6");
    			add_location(svg1, file$2, 37, 12, 1454);
    			attr_dev(a3, "aria-label", "Github");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "https://github.com/MeinLiX/BudgetFrog");
    			attr_dev(a3, "rel", "noopener");
    			attr_dev(a3, "class", "btn btn-ghost drawer-button btn-square normal-case");
    			add_location(a3, file$2, 35, 8, 1270);
    			attr_dev(div3, "class", "navbar-end");
    			add_location(div3, file$2, 34, 4, 1236);
    			attr_dev(div4, "class", "navbar bg-indigo-100");
    			add_location(div4, file$2, 16, 0, 330);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, a2);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			append_dev(a3, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = listen_dev(a1, "click", /*logout*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);

    	function logout() {
    		LocalStorage.Set("jwt", null);
    		push("/");
    	}

    	let isOpen = false;

    	function handleUpdate(event) {
    		isOpen = event.detail.isOpen;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		push,
    		LS: LocalStorage,
    		userDetails,
    		logout,
    		isOpen,
    		handleUpdate
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) isOpen = $$props.isOpen;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [logout];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\budget\BudgetHeader.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\budget\\BudgetHeader.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div0;
    	let a0;
    	let b0;
    	let t0_value = /*$selectedBudget*/ ctx[0].name + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let a1;
    	let t2;
    	let a1_href_value;
    	let t3;
    	let div2;
    	let div1;
    	let span;
    	let t4_value = /*$selectedBudget*/ ctx[0].balance?.currency + "";
    	let t4;
    	let t5;
    	let b1;
    	let t6_value = /*$selectedBudget*/ ctx[0].balance?.amount + "";
    	let t6;
    	let t7;
    	let div3;
    	let a2;
    	let t8;
    	let a2_href_value;
    	let t9;
    	let a3;
    	let t10;
    	let a3_href_value;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			b0 = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			a1 = element("a");
    			t2 = text("Statistic");
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			b1 = element("b");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			a2 = element("a");
    			t8 = text("Planned");
    			t9 = space();
    			a3 = element("a");
    			t10 = text("Categories");
    			add_location(b0, file$1, 25, 12, 981);
    			attr_dev(a0, "class", "btn btn-ghost normal-case text-xl");
    			attr_dev(a0, "href", a0_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id);
    			add_location(a0, file$1, 24, 8, 884);
    			attr_dev(a1, "class", "btn btn-ghost normal-case");
    			attr_dev(a1, "href", a1_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/statistic/");
    			add_location(a1, file$1, 27, 8, 1034);
    			attr_dev(div0, "class", "navbar-start");
    			add_location(div0, file$1, 23, 4, 848);
    			attr_dev(span, "class", "indicator-item badge badge-outline");
    			add_location(span, file$1, 33, 12, 1266);
    			add_location(b1, file$1, 36, 12, 1404);
    			attr_dev(div1, "class", "text-xl indicator p-1 mt-3");
    			add_location(div1, file$1, 32, 8, 1212);
    			attr_dev(div2, "class", "navbar-center");
    			add_location(div2, file$1, 31, 4, 1175);
    			attr_dev(a2, "class", "btn btn-ghost normal-case");
    			attr_dev(a2, "href", a2_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/planned/");
    			add_location(a2, file$1, 40, 8, 1512);
    			attr_dev(a3, "class", "btn btn-ghost normal-case");
    			attr_dev(a3, "href", a3_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/category/");
    			add_location(a3, file$1, 43, 8, 1641);
    			attr_dev(div3, "class", "navbar-end");
    			add_location(div3, file$1, 39, 4, 1478);
    			attr_dev(div4, "class", "navbar bg-yellow-100 ");
    			add_location(div4, file$1, 22, 0, 807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, a0);
    			append_dev(a0, b0);
    			append_dev(b0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(a1, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(span, t4);
    			append_dev(div1, t5);
    			append_dev(div1, b1);
    			append_dev(b1, t6);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, a2);
    			append_dev(a2, t8);
    			append_dev(div3, t9);
    			append_dev(div3, a3);
    			append_dev(a3, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$selectedBudget*/ 1 && t0_value !== (t0_value = /*$selectedBudget*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$selectedBudget*/ 1 && a0_href_value !== (a0_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*$selectedBudget*/ 1 && a1_href_value !== (a1_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/statistic/")) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*$selectedBudget*/ 1 && t4_value !== (t4_value = /*$selectedBudget*/ ctx[0].balance?.currency + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$selectedBudget*/ 1 && t6_value !== (t6_value = /*$selectedBudget*/ ctx[0].balance?.amount + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*$selectedBudget*/ 1 && a2_href_value !== (a2_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/planned/")) {
    				attr_dev(a2, "href", a2_href_value);
    			}

    			if (dirty & /*$selectedBudget*/ 1 && a3_href_value !== (a3_href_value = "/#/budget/" + /*$selectedBudget*/ ctx[0].id + "/category/")) {
    				attr_dev(a3, "href", a3_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $selectedBudget;
    	validate_store(selectedBudget, 'selectedBudget');
    	component_subscribe($$self, selectedBudget, $$value => $$invalidate(0, $selectedBudget = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BudgetHeader', slots, []);

    	onMount(async () => {
    		location.subscribe(async newLocation => {
    			if (newLocation.includes("budget")) {
    				newLocation += "/";
    				let BudgetID = newLocation.substring(newLocation.indexOf("/", 1) + 1, newLocation.indexOf("/", 8));

    				try {
    					set_store_value(selectedBudget, $selectedBudget = (await Request$1.budget.get({ BudgetID })).data, $selectedBudget);
    				} catch(err) {
    					ErrorWrapper(err);
    				}
    			}
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BudgetHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		location,
    		ErrorWrapper,
    		Request: Request$1,
    		selectedBudget,
    		$selectedBudget
    	});

    	return [$selectedBudget];
    }

    class BudgetHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BudgetHeader",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var css_248z$1 = "#app{min-height:80vh}a{text-decoration:none !important}";
    styleInject(css_248z$1);

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (38:4) {#if $auth}
    function create_if_block(ctx) {
    	let header;
    	let t;
    	let show_if = /*$location*/ ctx[1].includes("budget");
    	let if_block_anchor;
    	let current;
    	header = new Header({ $$inline: true });
    	let if_block = show_if && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 2) show_if = /*$location*/ ctx[1].includes("budget");

    			if (show_if) {
    				if (if_block) {
    					if (dirty & /*$location*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(38:4) {#if $auth}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#if $location.includes("budget")}
    function create_if_block_1(ctx) {
    	let budgetheader;
    	let current;
    	budgetheader = new BudgetHeader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(budgetheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(budgetheader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(budgetheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(budgetheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(budgetheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(40:8) {#if $location.includes(\\\"budget\\\")}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {#each $errorMSG as message}
    function create_each_block_1(ctx) {
    	let label;
    	let div;
    	let span;
    	let t_value = /*message*/ ctx[6] + "";
    	let t;
    	let label_transition;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file, 48, 20, 1346);
    			attr_dev(div, "class", "alert alert-error");
    			add_location(div, file, 47, 16, 1293);
    			attr_dev(label, "class", "label");
    			add_location(label, file, 46, 12, 1238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, span);
    			append_dev(span, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$errorMSG*/ 4) && t_value !== (t_value = /*message*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!label_transition) label_transition = create_bidirectional_transition(label, fade, {}, true);
    				label_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!label_transition) label_transition = create_bidirectional_transition(label, fade, {}, false);
    			label_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_transition) label_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(46:8) {#each $errorMSG as message}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#each $infoMSG as message}
    function create_each_block(ctx) {
    	let label;
    	let div;
    	let span;
    	let t0_value = /*message*/ ctx[6] + "";
    	let t0;
    	let t1;
    	let label_transition;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(span, file, 55, 20, 1588);
    			attr_dev(div, "class", "alert shadow-lg");
    			add_location(div, file, 54, 16, 1537);
    			attr_dev(label, "class", "label");
    			add_location(label, file, 53, 12, 1482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(label, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$infoMSG*/ 8) && t0_value !== (t0_value = /*message*/ ctx[6] + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!label_transition) label_transition = create_bidirectional_transition(label, fade, {}, true);
    				label_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!label_transition) label_transition = create_bidirectional_transition(label, fade, {}, false);
    			label_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_transition) label_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(53:8) {#each $infoMSG as message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let router;
    	let current;
    	let if_block = /*$auth*/ ctx[0] && create_if_block(ctx);
    	let each_value_1 = /*$errorMSG*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$infoMSG*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(router.$$.fragment);
    			attr_dev(div0, "class", "fixed w-96");
    			set_style(div0, "z-index", "999");
    			add_location(div0, file, 44, 4, 1141);
    			attr_dev(div1, "id", "app");
    			add_location(div1, file, 36, 0, 984);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t2);
    			mount_component(router, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$auth*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$auth*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$errorMSG*/ 4) {
    				each_value_1 = /*$errorMSG*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$infoMSG*/ 8) {
    				each_value = /*$infoMSG*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $auth;
    	let $avaliableCurrency;
    	let $userDetails;
    	let $location;
    	let $errorMSG;
    	let $infoMSG;
    	validate_store(auth, 'auth');
    	component_subscribe($$self, auth, $$value => $$invalidate(0, $auth = $$value));
    	validate_store(avaliableCurrency, 'avaliableCurrency');
    	component_subscribe($$self, avaliableCurrency, $$value => $$invalidate(4, $avaliableCurrency = $$value));
    	validate_store(userDetails, 'userDetails');
    	component_subscribe($$self, userDetails, $$value => $$invalidate(5, $userDetails = $$value));
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(1, $location = $$value));
    	validate_store(errorMSG, 'errorMSG');
    	component_subscribe($$self, errorMSG, $$value => $$invalidate(2, $errorMSG = $$value));
    	validate_store(infoMSG, 'infoMSG');
    	component_subscribe($$self, infoMSG, $$value => $$invalidate(3, $infoMSG = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(async () => {
    		try {
    			set_store_value(userDetails, $userDetails = (await Request$1.user.me()).data, $userDetails);
    			set_store_value(auth, $auth = true, $auth);
    		} catch {
    			set_store_value(userDetails, $userDetails = {}, $userDetails);
    			set_store_value(auth, $auth = false, $auth);
    		}

    		try {
    			set_store_value(avaliableCurrency, $avaliableCurrency = (await Request$1.exchange.avaliableCurrency()).data.currencies, $avaliableCurrency);
    		} catch {
    			
    		}

    		if (!$auth) {
    			await push("#/");
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		Router,
    		push,
    		location,
    		routes,
    		Header,
    		BudgetHeader,
    		Request: Request$1,
    		auth,
    		userDetails,
    		avaliableCurrency,
    		errorMSG,
    		infoMSG,
    		$auth,
    		$avaliableCurrency,
    		$userDetails,
    		$location,
    		$errorMSG,
    		$infoMSG
    	});

    	return [$auth, $location, $errorMSG, $infoMSG];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var css_248z = "/*\n! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/*\nEnsure the default browser behavior of the `hidden` attribute.\n*/\n\n[hidden] {\n  display: none;\n}\n\n:root,\n[data-theme] {\n  background-color: hsla(var(--b1) / var(--tw-bg-opacity, 1));\n  color: hsla(var(--bc) / var(--tw-text-opacity, 1));\n}\n\nhtml {\n  -webkit-tap-highlight-color: transparent;\n}\n\n:root {\n  --p: 259 94% 51%;\n  --pf: 259 94% 41%;\n  --sf: 314 100% 38%;\n  --af: 174 60% 41%;\n  --nf: 219 14% 22%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 0 0% 100%;\n  --s: 314 100% 47%;\n  --sc: 0 0% 100%;\n  --a: 174 60% 51%;\n  --ac: 175 44% 15%;\n  --n: 219 14% 28%;\n  --nc: 0 0% 100%;\n  --b1: 0 0% 100%;\n  --b2: 0 0% 95%;\n  --b3: 180 2% 90%;\n  --bc: 215 28% 17%;\n}\n\n@media (prefers-color-scheme: dark) {\n\n  :root {\n    --p: 262 80% 50%;\n    --pf: 262 80% 40%;\n    --sf: 316 70% 40%;\n    --af: 175 70% 33%;\n    --in: 198 93% 60%;\n    --su: 158 64% 52%;\n    --wa: 43 96% 56%;\n    --er: 0 91% 71%;\n    --inc: 198 100% 12%;\n    --suc: 158 100% 10%;\n    --wac: 43 100% 11%;\n    --erc: 0 100% 14%;\n    --rounded-box: 1rem;\n    --rounded-btn: 0.5rem;\n    --rounded-badge: 1.9rem;\n    --animation-btn: 0.25s;\n    --animation-input: .2s;\n    --btn-text-case: uppercase;\n    --btn-focus-scale: 0.95;\n    --border-btn: 1px;\n    --tab-border: 1px;\n    --tab-radius: 0.5rem;\n    --pc: 0 0% 100%;\n    --s: 316 70% 50%;\n    --sc: 0 0% 100%;\n    --a: 175 70% 41%;\n    --ac: 0 0% 100%;\n    --n: 218 18% 12%;\n    --nf: 223 17% 8%;\n    --nc: 220 13% 69%;\n    --b1: 220 18% 20%;\n    --b2: 220 17% 17%;\n    --b3: 219 18% 15%;\n    --bc: 220 13% 69%;\n  }\n}\n\n[data-theme=light] {\n  --p: 259 94% 51%;\n  --pf: 259 94% 41%;\n  --sf: 314 100% 38%;\n  --af: 174 60% 41%;\n  --nf: 219 14% 22%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 0 0% 100%;\n  --s: 314 100% 47%;\n  --sc: 0 0% 100%;\n  --a: 174 60% 51%;\n  --ac: 175 44% 15%;\n  --n: 219 14% 28%;\n  --nc: 0 0% 100%;\n  --b1: 0 0% 100%;\n  --b2: 0 0% 95%;\n  --b3: 180 2% 90%;\n  --bc: 215 28% 17%;\n}\n\n[data-theme=dark] {\n  --p: 262 80% 50%;\n  --pf: 262 80% 40%;\n  --sf: 316 70% 40%;\n  --af: 175 70% 33%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 0 0% 100%;\n  --s: 316 70% 50%;\n  --sc: 0 0% 100%;\n  --a: 175 70% 41%;\n  --ac: 0 0% 100%;\n  --n: 218 18% 12%;\n  --nf: 223 17% 8%;\n  --nc: 220 13% 69%;\n  --b1: 220 18% 20%;\n  --b2: 220 17% 17%;\n  --b3: 219 18% 15%;\n  --bc: 220 13% 69%;\n}\n\n[data-theme=cupcake] {\n  --p: 183 47% 59%;\n  --pf: 183 47% 47%;\n  --sf: 338 71% 62%;\n  --af: 39 84% 46%;\n  --nf: 280 46% 11%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --pc: 183 100% 12%;\n  --sc: 338 100% 16%;\n  --ac: 39 100% 12%;\n  --nc: 280 83% 83%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --s: 338 71% 78%;\n  --a: 39 84% 58%;\n  --n: 280 46% 14%;\n  --b1: 24 33% 97%;\n  --b2: 27 22% 92%;\n  --b3: 22 14% 89%;\n  --bc: 280 46% 14%;\n  --rounded-btn: 1.9rem;\n  --tab-border: 2px;\n  --tab-radius: .5rem;\n}\n\n[data-theme=bumblebee] {\n  --p: 41 74% 53%;\n  --pf: 41 74% 42%;\n  --sf: 50 94% 46%;\n  --af: 240 33% 11%;\n  --nf: 240 33% 11%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --bc: 0 0% 20%;\n  --ac: 240 60% 83%;\n  --nc: 240 60% 83%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 240 33% 14%;\n  --s: 50 94% 58%;\n  --sc: 240 33% 14%;\n  --a: 240 33% 14%;\n  --n: 240 33% 14%;\n  --b1: 0 0% 100%;\n}\n\n[data-theme=emerald] {\n  --p: 141 50% 60%;\n  --pf: 141 50% 48%;\n  --sf: 219 96% 48%;\n  --af: 10 81% 45%;\n  --nf: 219 20% 20%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --btn-text-case: uppercase;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 151 28% 19%;\n  --s: 219 96% 60%;\n  --sc: 210 20% 98%;\n  --a: 10 81% 56%;\n  --ac: 210 20% 98%;\n  --n: 219 20% 25%;\n  --nc: 210 20% 98%;\n  --b1: 0 0% 100%;\n  --bc: 219 20% 25%;\n  --animation-btn: 0;\n  --animation-input: 0;\n  --btn-focus-scale: 1;\n}\n\n[data-theme=corporate] {\n  --p: 229 96% 64%;\n  --pf: 229 96% 51%;\n  --sf: 215 26% 47%;\n  --af: 154 49% 48%;\n  --nf: 233 27% 10%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --pc: 229 100% 93%;\n  --sc: 215 100% 12%;\n  --ac: 154 100% 12%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --btn-text-case: uppercase;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 215 26% 59%;\n  --a: 154 49% 60%;\n  --n: 233 27% 13%;\n  --nc: 210 38% 95%;\n  --b1: 0 0% 100%;\n  --bc: 233 27% 13%;\n  --rounded-box: 0.25rem;\n  --rounded-btn: .125rem;\n  --rounded-badge: .125rem;\n  --animation-btn: 0;\n  --animation-input: 0;\n  --btn-focus-scale: 1;\n}\n\n[data-theme=synthwave] {\n  --p: 321 70% 69%;\n  --pf: 321 70% 55%;\n  --sf: 197 87% 52%;\n  --af: 48 89% 46%;\n  --nf: 253 61% 15%;\n  --b2: 254 59% 23%;\n  --b3: 254 59% 21%;\n  --pc: 321 100% 14%;\n  --sc: 197 100% 13%;\n  --ac: 48 100% 11%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 197 87% 65%;\n  --a: 48 89% 57%;\n  --n: 253 61% 19%;\n  --nc: 260 60% 98%;\n  --b1: 254 59% 26%;\n  --bc: 260 60% 98%;\n  --in: 199 87% 64%;\n  --inc: 257 63% 17%;\n  --su: 168 74% 68%;\n  --suc: 257 63% 17%;\n  --wa: 48 89% 57%;\n  --wac: 257 63% 17%;\n  --er: 352 74% 57%;\n  --erc: 260 60% 98%;\n}\n\n[data-theme=retro] {\n  --p: 3 74% 76%;\n  --pf: 3 74% 61%;\n  --sf: 145 27% 58%;\n  --af: 49 67% 61%;\n  --nf: 42 17% 34%;\n  --inc: 221 100% 91%;\n  --suc: 142 100% 87%;\n  --wac: 32 100% 9%;\n  --erc: 0 100% 90%;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 345 5% 15%;\n  --s: 145 27% 72%;\n  --sc: 345 5% 15%;\n  --a: 49 67% 76%;\n  --ac: 345 5% 15%;\n  --n: 42 17% 42%;\n  --nc: 45 47% 80%;\n  --b1: 45 47% 80%;\n  --b2: 45 37% 72%;\n  --b3: 42 36% 65%;\n  --bc: 345 5% 15%;\n  --in: 221 83% 53%;\n  --su: 142 76% 36%;\n  --wa: 32 95% 44%;\n  --er: 0 72% 51%;\n  --rounded-box: 0.4rem;\n  --rounded-btn: 0.4rem;\n  --rounded-badge: 0.4rem;\n}\n\n[data-theme=cyberpunk] {\n  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;\n  --pf: 345 100% 58%;\n  --sf: 195 80% 56%;\n  --af: 276 74% 57%;\n  --nf: 57 100% 10%;\n  --b2: 56 100% 45%;\n  --b3: 56 100% 41%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --bc: 56 100% 10%;\n  --pc: 345 100% 15%;\n  --sc: 195 100% 14%;\n  --ac: 276 100% 14%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --p: 345 100% 73%;\n  --s: 195 80% 70%;\n  --a: 276 74% 71%;\n  --n: 57 100% 13%;\n  --nc: 56 100% 50%;\n  --b1: 56 100% 50%;\n  --rounded-box: 0;\n  --rounded-btn: 0;\n  --rounded-badge: 0;\n  --tab-radius: 0;\n}\n\n[data-theme=valentine] {\n  --p: 353 74% 67%;\n  --pf: 353 74% 54%;\n  --sf: 254 86% 61%;\n  --af: 181 56% 56%;\n  --nf: 336 43% 38%;\n  --b2: 318 46% 80%;\n  --b3: 318 46% 72%;\n  --pc: 353 100% 13%;\n  --sc: 254 100% 15%;\n  --ac: 181 100% 14%;\n  --inc: 221 100% 91%;\n  --suc: 142 100% 87%;\n  --wac: 32 100% 9%;\n  --erc: 0 100% 90%;\n  --rounded-box: 1rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 254 86% 77%;\n  --a: 181 56% 70%;\n  --n: 336 43% 48%;\n  --nc: 318 46% 89%;\n  --b1: 318 46% 89%;\n  --bc: 344 38% 28%;\n  --in: 221 83% 53%;\n  --su: 142 76% 36%;\n  --wa: 32 95% 44%;\n  --er: 0 72% 51%;\n  --rounded-btn: 1.9rem;\n}\n\n[data-theme=halloween] {\n  --p: 32 89% 52%;\n  --pf: 32 89% 42%;\n  --sf: 271 46% 34%;\n  --af: 91 100% 26%;\n  --nf: 180 4% 9%;\n  --b2: 0 0% 12%;\n  --b3: 0 0% 10%;\n  --bc: 0 0% 83%;\n  --sc: 271 100% 88%;\n  --ac: 91 100% 7%;\n  --nc: 180 5% 82%;\n  --inc: 221 100% 91%;\n  --suc: 142 100% 87%;\n  --wac: 32 100% 9%;\n  --erc: 0 100% 90%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 180 7% 8%;\n  --s: 271 46% 42%;\n  --a: 91 100% 33%;\n  --n: 180 4% 11%;\n  --b1: 0 0% 13%;\n  --in: 221 83% 53%;\n  --su: 142 76% 36%;\n  --wa: 32 95% 44%;\n  --er: 0 72% 51%;\n}\n\n[data-theme=garden] {\n  --p: 139 16% 43%;\n  --pf: 139 16% 34%;\n  --sf: 97 37% 75%;\n  --af: 0 68% 75%;\n  --nf: 0 4% 28%;\n  --b2: 0 4% 82%;\n  --b3: 0 4% 74%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --pc: 139 100% 89%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 97 37% 93%;\n  --sc: 96 32% 15%;\n  --a: 0 68% 94%;\n  --ac: 0 22% 16%;\n  --n: 0 4% 35%;\n  --nc: 0 4% 91%;\n  --b1: 0 4% 91%;\n  --bc: 0 3% 6%;\n}\n\n[data-theme=forest] {\n  --p: 141 72% 42%;\n  --pf: 141 72% 34%;\n  --sf: 141 75% 38%;\n  --af: 35 69% 42%;\n  --nf: 0 10% 5%;\n  --b2: 0 12% 7%;\n  --b3: 0 12% 7%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --bc: 0 12% 82%;\n  --pc: 141 100% 8%;\n  --sc: 141 100% 10%;\n  --ac: 35 100% 10%;\n  --nc: 0 7% 81%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 141 75% 48%;\n  --a: 35 69% 52%;\n  --n: 0 10% 6%;\n  --b1: 0 12% 8%;\n  --rounded-btn: 1.9rem;\n}\n\n[data-theme=aqua] {\n  --p: 182 93% 49%;\n  --pf: 182 93% 40%;\n  --sf: 274 31% 45%;\n  --af: 47 100% 64%;\n  --nf: 205 54% 40%;\n  --b2: 219 53% 39%;\n  --b3: 219 53% 35%;\n  --bc: 219 100% 89%;\n  --sc: 274 100% 91%;\n  --ac: 47 100% 16%;\n  --nc: 205 100% 90%;\n  --inc: 221 100% 91%;\n  --suc: 142 100% 87%;\n  --wac: 32 100% 9%;\n  --erc: 0 100% 90%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --pc: 181 100% 17%;\n  --s: 274 31% 57%;\n  --a: 47 100% 80%;\n  --n: 205 54% 50%;\n  --b1: 219 53% 43%;\n  --in: 221 83% 53%;\n  --su: 142 76% 36%;\n  --wa: 32 95% 44%;\n  --er: 0 72% 51%;\n}\n\n[data-theme=lofi] {\n  --p: 0 0% 5%;\n  --pf: 0 0% 4%;\n  --sf: 0 2% 8%;\n  --af: 0 0% 12%;\n  --nf: 0 0% 0%;\n  --btn-text-case: uppercase;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --pc: 0 0% 100%;\n  --s: 0 2% 10%;\n  --sc: 0 0% 100%;\n  --a: 0 0% 15%;\n  --ac: 0 0% 100%;\n  --n: 0 0% 0%;\n  --nc: 0 0% 100%;\n  --b1: 0 0% 100%;\n  --b2: 0 0% 95%;\n  --b3: 0 2% 90%;\n  --bc: 0 0% 0%;\n  --in: 212 100% 48%;\n  --inc: 0 0% 100%;\n  --su: 137 72% 46%;\n  --suc: 0 0% 100%;\n  --wa: 5 100% 66%;\n  --wac: 0 0% 100%;\n  --er: 325 78% 49%;\n  --erc: 0 0% 100%;\n  --rounded-box: 0.25rem;\n  --rounded-btn: 0.125rem;\n  --rounded-badge: 0.125rem;\n  --animation-btn: 0;\n  --animation-input: 0;\n  --btn-focus-scale: 1;\n  --tab-radius: 0;\n}\n\n[data-theme=pastel] {\n  --p: 284 22% 80%;\n  --pf: 284 22% 64%;\n  --sf: 352 70% 70%;\n  --af: 158 55% 65%;\n  --nf: 199 44% 49%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --bc: 0 0% 20%;\n  --pc: 284 59% 16%;\n  --sc: 352 100% 18%;\n  --ac: 158 100% 16%;\n  --nc: 199 100% 12%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 352 70% 88%;\n  --a: 158 55% 81%;\n  --n: 199 44% 61%;\n  --b1: 0 0% 100%;\n  --b2: 210 20% 98%;\n  --b3: 216 12% 84%;\n  --rounded-btn: 1.9rem;\n}\n\n[data-theme=fantasy] {\n  --p: 296 83% 25%;\n  --pf: 296 83% 20%;\n  --sf: 200 100% 30%;\n  --af: 31 94% 41%;\n  --nf: 215 28% 13%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --in: 198 93% 60%;\n  --su: 158 64% 52%;\n  --wa: 43 96% 56%;\n  --er: 0 91% 71%;\n  --pc: 296 100% 85%;\n  --sc: 200 100% 87%;\n  --ac: 31 100% 10%;\n  --nc: 215 62% 83%;\n  --inc: 198 100% 12%;\n  --suc: 158 100% 10%;\n  --wac: 43 100% 11%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 200 100% 37%;\n  --a: 31 94% 51%;\n  --n: 215 28% 17%;\n  --b1: 0 0% 100%;\n  --bc: 215 28% 17%;\n}\n\n[data-theme=wireframe] {\n  font-family: Chalkboard,comic sans ms,\"sanssecondaryerif\";\n  --pf: 0 0% 58%;\n  --sf: 0 0% 58%;\n  --af: 0 0% 58%;\n  --nf: 0 0% 74%;\n  --bc: 0 0% 20%;\n  --pc: 0 0% 14%;\n  --sc: 0 0% 14%;\n  --ac: 0 0% 14%;\n  --nc: 0 0% 18%;\n  --inc: 240 100% 90%;\n  --suc: 120 100% 85%;\n  --wac: 60 100% 10%;\n  --erc: 0 100% 90%;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --p: 0 0% 72%;\n  --s: 0 0% 72%;\n  --a: 0 0% 72%;\n  --n: 0 0% 92%;\n  --b1: 0 0% 100%;\n  --b2: 0 0% 93%;\n  --b3: 0 0% 87%;\n  --in: 240 100% 50%;\n  --su: 120 100% 25%;\n  --wa: 60 30% 50%;\n  --er: 0 100% 50%;\n  --rounded-box: 0.2rem;\n  --rounded-btn: 0.2rem;\n  --rounded-badge: 0.2rem;\n  --tab-radius: 0.2rem;\n}\n\n[data-theme=black] {\n  --p: 0 2% 20%;\n  --pf: 0 2% 16%;\n  --sf: 0 2% 16%;\n  --af: 0 2% 16%;\n  --bc: 0 0% 80%;\n  --pc: 0 5% 84%;\n  --sc: 0 5% 84%;\n  --ac: 0 5% 84%;\n  --nc: 0 3% 83%;\n  --inc: 240 100% 90%;\n  --suc: 120 100% 85%;\n  --wac: 60 100% 10%;\n  --erc: 0 100% 90%;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --s: 0 2% 20%;\n  --a: 0 2% 20%;\n  --b1: 0 0% 0%;\n  --b2: 0 0% 5%;\n  --b3: 0 2% 10%;\n  --n: 0 1% 15%;\n  --nf: 0 2% 20%;\n  --in: 240 100% 50%;\n  --su: 120 100% 25%;\n  --wa: 60 100% 50%;\n  --er: 0 100% 50%;\n  --rounded-box: 0;\n  --rounded-btn: 0;\n  --rounded-badge: 0;\n  --animation-btn: 0;\n  --animation-input: 0;\n  --btn-text-case: lowercase;\n  --btn-focus-scale: 1;\n  --tab-radius: 0;\n}\n\n[data-theme=luxury] {\n  --p: 0 0% 100%;\n  --pf: 0 0% 80%;\n  --sf: 218 54% 14%;\n  --af: 319 22% 21%;\n  --nf: 270 4% 7%;\n  --pc: 0 0% 20%;\n  --sc: 218 100% 84%;\n  --ac: 319 85% 85%;\n  --inc: 202 100% 14%;\n  --suc: 89 100% 10%;\n  --wac: 54 100% 13%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 218 54% 18%;\n  --a: 319 22% 26%;\n  --n: 270 4% 9%;\n  --nc: 37 67% 58%;\n  --b1: 240 10% 4%;\n  --b2: 270 4% 9%;\n  --b3: 270 2% 18%;\n  --bc: 37 67% 58%;\n  --in: 202 100% 70%;\n  --su: 89 62% 52%;\n  --wa: 54 69% 64%;\n  --er: 0 100% 72%;\n}\n\n[data-theme=dracula] {\n  --p: 326 100% 74%;\n  --pf: 326 100% 59%;\n  --sf: 265 89% 62%;\n  --af: 31 100% 57%;\n  --nf: 230 15% 24%;\n  --b2: 231 15% 17%;\n  --b3: 231 15% 15%;\n  --pc: 326 100% 15%;\n  --sc: 265 100% 16%;\n  --ac: 31 100% 14%;\n  --nc: 230 71% 86%;\n  --inc: 191 100% 15%;\n  --suc: 135 100% 13%;\n  --wac: 65 100% 15%;\n  --erc: 0 100% 93%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 265 89% 78%;\n  --a: 31 100% 71%;\n  --n: 230 15% 30%;\n  --b1: 231 15% 18%;\n  --bc: 60 30% 96%;\n  --in: 191 97% 77%;\n  --su: 135 94% 65%;\n  --wa: 65 92% 76%;\n  --er: 0 100% 67%;\n}\n\n[data-theme=cmyk] {\n  --p: 203 83% 60%;\n  --pf: 203 83% 48%;\n  --sf: 335 78% 48%;\n  --af: 56 100% 48%;\n  --nf: 0 0% 8%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --bc: 0 0% 20%;\n  --pc: 203 100% 12%;\n  --sc: 335 100% 92%;\n  --ac: 56 100% 12%;\n  --nc: 0 0% 82%;\n  --inc: 192 100% 10%;\n  --suc: 291 100% 88%;\n  --wac: 25 100% 11%;\n  --erc: 4 100% 91%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 335 78% 60%;\n  --a: 56 100% 60%;\n  --n: 0 0% 10%;\n  --b1: 0 0% 100%;\n  --in: 192 48% 52%;\n  --su: 291 48% 38%;\n  --wa: 25 85% 57%;\n  --er: 4 81% 56%;\n}\n\n[data-theme=autumn] {\n  --p: 344 96% 28%;\n  --pf: 344 96% 22%;\n  --sf: 0 63% 47%;\n  --af: 27 56% 50%;\n  --nf: 22 17% 35%;\n  --b2: 0 0% 85%;\n  --b3: 0 0% 77%;\n  --bc: 0 0% 19%;\n  --pc: 344 100% 86%;\n  --sc: 0 100% 92%;\n  --ac: 27 100% 13%;\n  --nc: 22 100% 89%;\n  --inc: 187 100% 10%;\n  --suc: 165 100% 9%;\n  --wac: 30 100% 10%;\n  --erc: 354 100% 90%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 0 63% 58%;\n  --a: 27 56% 63%;\n  --n: 22 17% 44%;\n  --b1: 0 0% 95%;\n  --in: 187 48% 50%;\n  --su: 165 34% 43%;\n  --wa: 30 84% 50%;\n  --er: 354 79% 49%;\n}\n\n[data-theme=business] {\n  --p: 210 64% 31%;\n  --pf: 210 64% 24%;\n  --sf: 200 13% 44%;\n  --af: 13 80% 48%;\n  --nf: 213 14% 13%;\n  --b2: 0 0% 11%;\n  --b3: 0 0% 10%;\n  --bc: 0 0% 83%;\n  --pc: 210 100% 86%;\n  --sc: 200 100% 11%;\n  --ac: 13 100% 12%;\n  --nc: 213 28% 83%;\n  --inc: 199 100% 88%;\n  --suc: 144 100% 11%;\n  --wac: 39 100% 12%;\n  --erc: 6 100% 89%;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 200 13% 55%;\n  --a: 13 80% 60%;\n  --n: 213 14% 16%;\n  --b1: 0 0% 13%;\n  --in: 199 100% 42%;\n  --su: 144 31% 56%;\n  --wa: 39 64% 60%;\n  --er: 6 56% 43%;\n  --rounded-box: 0.25rem;\n  --rounded-btn: .125rem;\n  --rounded-badge: .125rem;\n}\n\n[data-theme=acid] {\n  --p: 303 100% 50%;\n  --pf: 303 100% 40%;\n  --sf: 27 100% 40%;\n  --af: 72 98% 40%;\n  --nf: 238 43% 14%;\n  --b2: 0 0% 88%;\n  --b3: 0 0% 79%;\n  --bc: 0 0% 20%;\n  --pc: 303 100% 90%;\n  --sc: 27 100% 10%;\n  --ac: 72 100% 10%;\n  --nc: 238 99% 83%;\n  --inc: 210 100% 12%;\n  --suc: 149 100% 12%;\n  --wac: 53 100% 11%;\n  --erc: 1 100% 89%;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 27 100% 50%;\n  --a: 72 98% 50%;\n  --n: 238 43% 17%;\n  --b1: 0 0% 98%;\n  --in: 210 92% 58%;\n  --su: 149 50% 58%;\n  --wa: 53 93% 57%;\n  --er: 1 100% 45%;\n  --rounded-box: 1.25rem;\n  --rounded-btn: 1rem;\n  --rounded-badge: 1rem;\n}\n\n[data-theme=lemonade] {\n  --p: 89 96% 31%;\n  --pf: 89 96% 24%;\n  --sf: 60 81% 44%;\n  --af: 63 80% 71%;\n  --nf: 238 43% 14%;\n  --b2: 0 0% 90%;\n  --b3: 0 0% 81%;\n  --bc: 0 0% 20%;\n  --pc: 89 100% 86%;\n  --sc: 60 100% 11%;\n  --ac: 63 100% 18%;\n  --nc: 238 99% 83%;\n  --inc: 192 79% 17%;\n  --suc: 74 100% 16%;\n  --wac: 50 100% 15%;\n  --erc: 1 100% 17%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 60 81% 55%;\n  --a: 63 80% 88%;\n  --n: 238 43% 17%;\n  --b1: 0 0% 100%;\n  --in: 192 39% 85%;\n  --su: 74 76% 79%;\n  --wa: 50 87% 75%;\n  --er: 1 70% 83%;\n}\n\n[data-theme=night] {\n  --p: 198 93% 60%;\n  --pf: 198 93% 48%;\n  --sf: 234 89% 59%;\n  --af: 329 86% 56%;\n  --b2: 222 47% 10%;\n  --b3: 222 47% 9%;\n  --bc: 222 66% 82%;\n  --pc: 198 100% 12%;\n  --sc: 234 100% 15%;\n  --ac: 329 100% 14%;\n  --nc: 217 76% 83%;\n  --inc: 198 100% 10%;\n  --suc: 172 100% 10%;\n  --wac: 41 100% 13%;\n  --erc: 351 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 234 89% 74%;\n  --a: 329 86% 70%;\n  --n: 217 33% 17%;\n  --nf: 217 30% 22%;\n  --b1: 222 47% 11%;\n  --in: 198 90% 48%;\n  --su: 172 66% 50%;\n  --wa: 41 88% 64%;\n  --er: 351 95% 71%;\n}\n\n[data-theme=coffee] {\n  --p: 30 67% 58%;\n  --pf: 30 67% 46%;\n  --sf: 182 25% 16%;\n  --af: 194 74% 20%;\n  --nf: 300 20% 5%;\n  --b2: 306 19% 10%;\n  --b3: 306 19% 9%;\n  --pc: 30 100% 12%;\n  --sc: 182 67% 84%;\n  --ac: 194 100% 85%;\n  --nc: 300 14% 81%;\n  --inc: 171 100% 13%;\n  --suc: 93 100% 12%;\n  --wac: 43 100% 14%;\n  --erc: 10 100% 15%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 182 25% 20%;\n  --a: 194 74% 25%;\n  --n: 300 20% 6%;\n  --b1: 306 19% 11%;\n  --bc: 37 8% 42%;\n  --in: 171 37% 67%;\n  --su: 93 25% 62%;\n  --wa: 43 100% 69%;\n  --er: 10 95% 75%;\n}\n\n[data-theme=winter] {\n  --p: 212 100% 51%;\n  --pf: 212 100% 41%;\n  --sf: 247 47% 35%;\n  --af: 310 49% 42%;\n  --nf: 217 92% 8%;\n  --pc: 212 100% 90%;\n  --sc: 247 100% 89%;\n  --ac: 310 100% 90%;\n  --nc: 217 100% 82%;\n  --inc: 192 100% 16%;\n  --suc: 182 100% 13%;\n  --wac: 32 100% 17%;\n  --erc: 0 100% 14%;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-text-case: uppercase;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --s: 247 47% 43%;\n  --a: 310 49% 52%;\n  --n: 217 92% 10%;\n  --b1: 0 0% 100%;\n  --b2: 217 100% 97%;\n  --b3: 219 44% 92%;\n  --bc: 214 30% 32%;\n  --in: 192 93% 78%;\n  --su: 182 47% 66%;\n  --wa: 32 62% 84%;\n  --er: 0 63% 72%;\n}\n\n*, ::before, ::after {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\r\n.alert {\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  padding: 1rem;\n  border-radius: var(--rounded-box, 1rem);\n}\r\n.alert > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\r\n@media (min-width: 768px) {\n\n  .alert {\n    flex-direction: row;\n  }\n\n  .alert > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0px * var(--tw-space-y-reverse));\n  }\n}\r\n.alert > :where(*) {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\r\n.avatar.placeholder > div {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\r\n.badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  height: 1.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding-left: 0.563rem;\n  padding-right: 0.563rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--n) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--n) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--nc) / var(--tw-text-opacity));\n  border-radius: var(--rounded-badge, 1.9rem);\n}\r\n.btn {\n  display: inline-flex;\n  flex-shrink: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  border-color: transparent;\n  border-color: hsl(var(--n) / var(--tw-border-opacity));\n  text-align: center;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  border-radius: var(--rounded-btn, 0.5rem);\n  height: 3rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  line-height: 1em;\n  min-height: 3rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  text-transform: var(--btn-text-case, uppercase);\n  -webkit-text-decoration-line: none;\n          text-decoration-line: none;\n  border-width: var(--border-btn, 1px);\n  -webkit-animation: button-pop var(--animation-btn, 0.25s) ease-out;\n          animation: button-pop var(--animation-btn, 0.25s) ease-out;\n  --tw-border-opacity: 1;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--n) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--nc) / var(--tw-text-opacity));\n}\r\n.btn-disabled, .btn[disabled] {\n  pointer-events: none;\n}\r\n.btn-square {\n  height: 3rem;\n  width: 3rem;\n  padding: 0px;\n}\r\n.btn-circle {\n  height: 3rem;\n  width: 3rem;\n  border-radius: 9999px;\n  padding: 0px;\n}\r\n.btn.loading, .btn.loading:hover {\n  pointer-events: none;\n}\r\n.btn.loading:before {\n  margin-right: 0.5rem;\n  height: 1rem;\n  width: 1rem;\n  border-radius: 9999px;\n  border-width: 2px;\n  -webkit-animation: spin 2s linear infinite;\n          animation: spin 2s linear infinite;\n  content: \"\";\n  border-top-color: transparent;\n  border-left-color: transparent;\n  border-bottom-color: currentColor;\n  border-right-color: currentColor;\n}\r\n@media (prefers-reduced-motion: reduce) {\n\n  .btn.loading:before {\n    -webkit-animation: spin 10s linear infinite;\n            animation: spin 10s linear infinite;\n  }\n}\r\n@-webkit-keyframes spin {\n\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\r\n@keyframes spin {\n\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\r\n.btn-group {\n  display: flex;\n  flex-wrap: wrap;\n}\r\n.btn-group > input[type=\"radio\"].btn {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\r\n.btn-group > input[type=\"radio\"].btn:before {\n  content: attr(data-title);\n}\r\n.card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  border-radius: var(--rounded-box, 1rem);\n}\r\n.card:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.card-body {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  padding: var(--padding-card, 2rem);\n  gap: 0.5rem;\n}\r\n.card-body :where(p) {\n  flex-grow: 1;\n}\r\n.card-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  gap: 0.5rem;\n}\r\n.card figure {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\r\n.card.image-full {\n  display: grid;\n}\r\n.card.image-full:before {\n  position: relative;\n  content: \"\";\n  z-index: 10;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--n) / var(--tw-bg-opacity));\n  opacity: 0.75;\n  border-radius: var(--rounded-box, 1rem);\n}\r\n.card.image-full:before, .card.image-full > * {\n  grid-column-start: 1;\n  grid-row-start: 1;\n}\r\n.card.image-full > figure img {\n  height: 100%;\n  -o-object-fit: cover;\n     object-fit: cover;\n}\r\n.card.image-full > .card-body {\n  position: relative;\n  z-index: 20;\n  --tw-text-opacity: 1;\n  color: hsl(var(--nc) / var(--tw-text-opacity));\n}\r\n.checkbox {\n  flex-shrink: 0;\n  --chkbg: var(--bc);\n  --chkfg: var(--b1);\n  height: 1.5rem;\n  width: 1.5rem;\n  cursor: pointer;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  border-width: 1px;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-border-opacity: 0.2;\n  border-radius: var(--rounded-btn, 0.5rem);\n}\r\n.dropdown {\n  position: relative;\n  display: inline-block;\n}\r\n.dropdown > *:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.dropdown .dropdown-content {\n  visibility: hidden;\n  position: absolute;\n  z-index: 50;\n  opacity: 0;\n  transform-origin: top;\n  --tw-scale-x: .95;\n  --tw-scale-y: .95;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\r\n.dropdown-end .dropdown-content {\n  right: 0px;\n}\r\n.dropdown-left .dropdown-content {\n  top: 0px;\n  right: 100%;\n  bottom: auto;\n  transform-origin: right;\n}\r\n.dropdown-right .dropdown-content {\n  left: 100%;\n  top: 0px;\n  bottom: auto;\n  transform-origin: left;\n}\r\n.dropdown-top .dropdown-content {\n  bottom: 100%;\n  top: auto;\n  transform-origin: bottom;\n}\r\n.dropdown-end.dropdown-right .dropdown-content {\n  bottom: 0px;\n  top: auto;\n}\r\n.dropdown-end.dropdown-left .dropdown-content {\n  bottom: 0px;\n  top: auto;\n}\r\n.dropdown.dropdown-open .dropdown-content, .dropdown.dropdown-hover:hover .dropdown-content, .dropdown:not(.dropdown-hover):focus .dropdown-content, .dropdown:not(.dropdown-hover):focus-within .dropdown-content {\n  visibility: visible;\n  opacity: 1;\n}\r\n.footer {\n  display: grid;\n  width: 100%;\n  grid-auto-flow: row;\n  place-items: start;\n  row-gap: 2.5rem;\n  -moz-column-gap: 1rem;\n       column-gap: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.footer > * {\n  display: grid;\n  place-items: start;\n  gap: 0.5rem;\n}\r\n@media (min-width: 48rem) {\n\n  .footer {\n    grid-auto-flow: column;\n  }\n\n  .footer-center {\n    grid-auto-flow: row dense;\n  }\n}\r\n.form-control {\n  display: flex;\n  flex-direction: column;\n}\r\n.label {\n  display: flex;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\r\n.indicator {\n  position: relative;\n  display: inline-flex;\n  width: -webkit-max-content;\n  width: -moz-max-content;\n  width: max-content;\n}\r\n.indicator :where(.indicator-item) {\n  z-index: 1;\n  position: absolute;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.input {\n  flex-shrink: 1;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  height: 3rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  line-height: 2;\n  border-width: 1px;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-border-opacity: 0;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n  border-radius: var(--rounded-btn, 0.5rem);\n}\r\n.input-group {\n  display: flex;\n  width: 100%;\n  align-items: stretch;\n}\r\n.input-group > *, .input-group > .input {\n  border-radius: 0px;\n}\r\n.input-group :where(span) {\n  display: flex;\n  align-items: center;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity));\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\r\n.input-group :first-child {\n  border-top-left-radius: var(--rounded-btn, 0.5rem);\n  border-top-right-radius: 0;\n  border-bottom-left-radius: var(--rounded-btn, 0.5rem);\n  border-bottom-right-radius: 0;\n}\r\n.input-group :last-child {\n  border-top-left-radius: 0;\n  border-top-right-radius: var(--rounded-btn, 0.5rem);\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: var(--rounded-btn, 0.5rem);\n}\r\n.link {\n  cursor: pointer;\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\r\n.link-hover {\n  -webkit-text-decoration-line: none;\n          text-decoration-line: none;\n}\r\n.link-hover:hover {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\r\n.menu {\n  display: flex;\n  flex-direction: column;\n}\r\n.menu.horizontal {\n  display: inline-flex;\n  flex-direction: row;\n}\r\n.menu.horizontal :where(li) {\n  flex-direction: row;\n}\r\n.menu :where(li) {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n  align-items: stretch;\n}\r\n.menu :where(li:not(.menu-title)) > :where(*:not(ul)) {\n  display: flex;\n}\r\n.menu :where(li:not(.disabled):not(.menu-title)) > :where(*:not(ul)) {\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  align-items: center;\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.menu > :where(li > *:not(ul):focus) {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.menu > :where(li.disabled > *:not(ul):focus) {\n  cursor: auto;\n}\r\n.menu > :where(li) :where(ul) {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n}\r\n.menu > :where(li) > :where(ul) {\n  position: absolute;\n  display: none;\n  top: initial;\n  left: 100%;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\r\n.menu > :where(li:hover) > :where(ul) {\n  display: flex;\n}\r\n.menu > :where(li:focus) > :where(ul) {\n  display: flex;\n}\r\n.modal {\n  pointer-events: none;\n  visibility: hidden;\n  position: fixed;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  display: flex;\n  justify-content: center;\n  opacity: 0;\n  z-index: 999;\n  background-color: hsl(var(--nf, var(--n)) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.4;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-property: transform, opacity;\n  overflow-y: hidden;\n  -ms-scroll-chaining: none;\n      overscroll-behavior: contain;\n}\r\n:where(.modal) {\n  align-items: center;\n}\r\n.modal-box {\n  max-height: calc(100vh - 5em);\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n  padding: 1.5rem;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  width: 91.666667%;\n  max-width: 32rem;\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-top-left-radius: var(--rounded-box, 1rem);\n  border-top-right-radius: var(--rounded-box, 1rem);\n  border-bottom-left-radius: var(--rounded-box, 1rem);\n  border-bottom-right-radius: var(--rounded-box, 1rem);\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n  overflow-y: auto;\n  -ms-scroll-chaining: none;\n      overscroll-behavior: contain;\n}\r\n.modal-open, .modal:target, .modal-toggle:checked + .modal {\n  pointer-events: auto;\n  visibility: visible;\n  opacity: 1;\n}\r\n.modal-toggle {\n  position: fixed;\n  height: 0px;\n  width: 0px;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  opacity: 0;\n}\r\n.navbar {\n  display: flex;\n  align-items: center;\n  padding: var(--navbar-padding, 0.5rem);\n  min-height: 4rem;\n  width: 100%;\n}\r\n:where(.navbar > *) {\n  display: inline-flex;\n  align-items: center;\n}\r\n.navbar-start {\n  width: 50%;\n  justify-content: flex-start;\n}\r\n.navbar-center {\n  flex-shrink: 0;\n}\r\n.navbar-end {\n  width: 50%;\n  justify-content: flex-end;\n}\r\n.range {\n  height: 1.5rem;\n  width: 100%;\n  cursor: pointer;\n  -webkit-appearance: none;\n  --range-shdw: var(--bc);\n  overflow: hidden;\n  background-color: transparent;\n  border-radius: var(--rounded-box, 1rem);\n}\r\n.range:focus {\n  outline: none;\n}\r\n.select {\n  display: inline-flex;\n  flex-shrink: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  height: 3rem;\n  padding-left: 1rem;\n  padding-right: 2.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  line-height: 2;\n  min-height: 3rem;\n  border-width: 1px;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-border-opacity: 0;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n  font-weight: 600;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  border-radius: var(--rounded-btn, 0.5rem);\n  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);\n  background-position: calc(100% - 20px) calc(1px + 50%), calc(100% - 16px) calc(1px + 50%);\n  background-size: 4px 4px, 4px 4px;\n  background-repeat: no-repeat;\n}\r\n.select-disabled, .select[disabled] {\n  pointer-events: none;\n  cursor: not-allowed;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 0.2;\n}\r\n.table {\n  position: relative;\n  text-align: left;\n}\r\n.table th:first-child {\n  position: sticky;\n  position: -webkit-sticky;\n  left: 0px;\n  z-index: 11;\n}\r\n.textarea {\n  flex-shrink: 1;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  line-height: 2;\n  min-height: 3rem;\n  border-width: 1px;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-border-opacity: 0;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n  border-radius: var(--rounded-btn, 0.5rem);\n}\r\n.toggle {\n  flex-shrink: 0;\n  --chkbg: hsla(var(--bc) / 0.2);\n  --handleoffset: 1.5rem;\n  height: 1.5rem;\n  width: 3rem;\n  cursor: pointer;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  border-width: 1px;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-border-opacity: 0.2;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  border-radius: var(--rounded-badge, 1.9rem);\n  transition: background, box-shadow var(--animation-input, 0.2s) ease-in-out;\n  box-shadow: calc(var(--handleoffset) * -1) 0 0 2px hsl(var(--b1)) inset, 0 0 0 2px hsl(var(--b1)) inset;\n}\r\n.tooltip {\n  position: relative;\n  display: inline-block;\n  --tooltip-offset: calc(100% + 1px + var(--tooltip-tail, 0px));\n  text-align: center;\n  --tooltip-tail: 3px;\n  --tooltip-color: hsl(var(--n));\n  --tooltip-text-color: hsl(var(--nc));\n  --tooltip-tail-offset: calc(100% + 1px - var(--tooltip-tail));\n}\r\n.tooltip:before {\n  position: absolute;\n  pointer-events: none;\n  content: attr(data-tip);\n  transform: translateX(-50%);\n  top: auto;\n  left: 50%;\n  right: auto;\n  bottom: var(--tooltip-offset);\n  max-width: 20rem;\n  border-radius: 0.25rem;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  background-color: var(--tooltip-color);\n  color: var(--tooltip-text-color);\n  width: -webkit-max-content;\n  width: -moz-max-content;\n  width: max-content;\n}\r\n.btn-outline .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--nf, var(--n)) / var(--tw-border-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--nc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-primary .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--p) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--s) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--s) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--sc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--a) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--a) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--ac) / var(--tw-text-opacity));\n}\r\n.btn-outline .badge.outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--nf, var(--n)) / var(--tw-border-opacity));\n  background-color: transparent;\n}\r\n.btn-outline.btn-primary .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--p) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--s) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--s) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--a) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--a) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-info .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--in) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--in) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-success .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--su) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--su) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-warning .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--wa) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--wa) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-error .badge-outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--er) / var(--tw-border-opacity));\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--er) / var(--tw-text-opacity));\n}\r\n.btn-outline:hover .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n}\r\n.btn-outline:hover .badge.outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--nc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-primary:hover .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--pc) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--pc) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--p) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-primary:hover .badge.outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--pc) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--pf, var(--p)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary:hover .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--sc) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--sc) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--s) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary:hover .badge.outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--sc) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--sf, var(--s)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--sc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent:hover .badge {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--ac) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--ac) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--a) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent:hover .badge.outline {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--ac) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--af, var(--a)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--ac) / var(--tw-text-opacity));\n}\r\n.btn:active:hover,\n  .btn:active:focus {\n  -webkit-animation: none;\n          animation: none;\n  transform: scale(var(--btn-focus-scale, 0.95));\n}\r\n.btn:hover, .btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--nf, var(--n)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--nf, var(--n)) / var(--tw-bg-opacity));\n}\r\n.btn:focus-visible {\n  outline: 2px solid hsl(var(--nf));\n  outline-offset: 2px;\n}\r\n.btn-primary {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--p) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.btn-primary:hover, .btn-primary.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--pf, var(--p)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--pf, var(--p)) / var(--tw-bg-opacity));\n}\r\n.btn-primary:focus-visible {\n  outline: 2px solid hsl(var(--p));\n}\r\n.btn-secondary {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--s) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--s) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--sc) / var(--tw-text-opacity));\n}\r\n.btn-secondary:hover, .btn-secondary.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--sf, var(--s)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--sf, var(--s)) / var(--tw-bg-opacity));\n}\r\n.btn-secondary:focus-visible {\n  outline: 2px solid hsl(var(--s));\n}\r\n.btn-accent {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--a) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--a) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--ac) / var(--tw-text-opacity));\n}\r\n.btn-accent:hover, .btn-accent.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--af, var(--a)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--af, var(--a)) / var(--tw-bg-opacity));\n}\r\n.btn-accent:focus-visible {\n  outline: 2px solid hsl(var(--a));\n}\r\n.btn-info:hover, .btn-info.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--in) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--in) / var(--tw-bg-opacity));\n}\r\n.btn-success:hover, .btn-success.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--su) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--su) / var(--tw-bg-opacity));\n}\r\n.btn-warning:hover, .btn-warning.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--wa) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--wa) / var(--tw-bg-opacity));\n}\r\n.btn-error {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--er) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--er) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--erc, var(--nc)) / var(--tw-text-opacity));\n}\r\n.btn-error:hover, .btn-error.btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--er) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--er) / var(--tw-bg-opacity));\n}\r\n.btn-error:focus-visible {\n  outline: 2px solid hsl(var(--er));\n}\r\n.btn.glass:hover,\n    .btn.glass.btn-active {\n  --glass-opacity: 25%;\n  --glass-border-opacity: 15%;\n}\r\n.btn.glass:focus-visible {\n  outline: 2px solid 0 0 2px currentColor;\n}\r\n.btn-ghost {\n  border-width: 1px;\n  border-color: transparent;\n  background-color: transparent;\n  color: currentColor;\n}\r\n.btn-ghost:hover, .btn-ghost.btn-active {\n  --tw-border-opacity: 0;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n}\r\n.btn-ghost:focus-visible {\n  outline: 2px solid 0 0 2px currentColor;\n}\r\n.btn-link:hover, .btn-link.btn-active {\n  border-color: transparent;\n  background-color: transparent;\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\r\n.btn-outline {\n  border-color: currentColor;\n  background-color: transparent;\n  --tw-text-opacity: 1;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n}\r\n.btn-outline:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--bc) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--b1) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-primary {\n  --tw-text-opacity: 1;\n  color: hsl(var(--p) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-primary:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--pf, var(--p)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--pf, var(--p)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary {\n  --tw-text-opacity: 1;\n  color: hsl(var(--s) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-secondary:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--sf, var(--s)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--sf, var(--s)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--sc) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent {\n  --tw-text-opacity: 1;\n  color: hsl(var(--a) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-accent:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--af, var(--a)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--af, var(--a)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--ac) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-success {\n  --tw-text-opacity: 1;\n  color: hsl(var(--su) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-success:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--su) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--su) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--suc, var(--nc)) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-info {\n  --tw-text-opacity: 1;\n  color: hsl(var(--in) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-info:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--in) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--in) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--inc, var(--nc)) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-warning {\n  --tw-text-opacity: 1;\n  color: hsl(var(--wa) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-warning:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--wa) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--wa) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--wac, var(--nc)) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-error {\n  --tw-text-opacity: 1;\n  color: hsl(var(--er) / var(--tw-text-opacity));\n}\r\n.btn-outline.btn-error:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--er) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--er) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--erc, var(--nc)) / var(--tw-text-opacity));\n}\r\n.btn-disabled, .btn-disabled:hover, .btn[disabled], .btn[disabled]:hover {\n  --tw-border-opacity: 0;\n  background-color: hsl(var(--n) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n  --tw-text-opacity: 0.2;\n}\r\n.btn.loading.btn-square:before, .btn.loading.btn-circle:before {\n  margin-right: 0px;\n}\r\n.btn.loading.btn-xl:before, .btn.loading.btn-lg:before {\n  height: 1.25rem;\n  width: 1.25rem;\n}\r\n.btn.loading.btn-sm:before, .btn.loading.btn-xs:before {\n  height: 0.75rem;\n  width: 0.75rem;\n}\r\n.btn-group > input[type=\"radio\"]:checked.btn, .btn-group > .btn-active {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--p) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.btn-group > input[type=\"radio\"]:checked.btn:focus-visible, .btn-group > .btn-active:focus-visible {\n  outline: 2px solid hsl(var(--p));\n}\r\n.btn-group > .btn:not(:first-of-type) {\n  margin-left: -1px;\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\r\n.btn-group > .btn:not(:last-of-type) {\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n}\r\n@-webkit-keyframes button-pop {\n\n  0% {\n    transform: scale(var(--btn-focus-scale, 0.95));\n  }\n\n  40% {\n    transform: scale(1.02);\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\r\n@keyframes button-pop {\n\n  0% {\n    transform: scale(var(--btn-focus-scale, 0.95));\n  }\n\n  40% {\n    transform: scale(1.02);\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\r\n.card:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\r\n.card.bordered {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n}\r\n.card-bordered {\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n}\r\n.card.compact .card-body {\n  padding: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.card-title {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n  font-weight: 600;\n}\r\n.checkbox:focus-visible {\n  outline: 2px solid hsl(var(--bc));\n  outline-offset: 2px;\n}\r\n.checkbox:checked, .checkbox[checked=\"true\"] {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  background-repeat: no-repeat;\n  -webkit-animation: checkmark var(--animation-input, 0.2s) ease-in-out;\n          animation: checkmark var(--animation-input, 0.2s) ease-in-out;\n  background-image: linear-gradient(-45deg, transparent 65%, hsl(var(--chkbg)) 65.99%), linear-gradient(45deg, transparent 75%, hsl(var(--chkbg)) 75.99%), linear-gradient(-45deg, hsl(var(--chkbg)) 40%, transparent 40.99%), linear-gradient(45deg, hsl(var(--chkbg)) 30%, hsl(var(--chkfg)) 30.99%, hsl(var(--chkfg)) 40%, transparent 40.99%), linear-gradient(-45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);\n}\r\n.checkbox:indeterminate {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  background-repeat: no-repeat;\n  -webkit-animation: checkmark var(--animation-input, 0.2s) ease-in-out;\n          animation: checkmark var(--animation-input, 0.2s) ease-in-out;\n  background-image: linear-gradient(90deg, transparent 80%, hsl(var(--chkbg)) 80%), linear-gradient(-90deg, transparent 80%, hsl(var(--chkbg)) 80%), linear-gradient(0deg, hsl(var(--chkbg)) 43%, hsl(var(--chkfg)) 43%, hsl(var(--chkfg)) 57%, hsl(var(--chkbg)) 57%);\n}\r\n.checkbox:disabled {\n  cursor: not-allowed;\n  border-color: transparent;\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  opacity: 0.2;\n}\r\n@-webkit-keyframes checkmark {\n\n  0% {\n    background-position-y: 5px;\n  }\n\n  50% {\n    background-position-y: -2px;\n  }\n\n  100% {\n    background-position-y: 0;\n  }\n}\r\n@keyframes checkmark {\n\n  0% {\n    background-position-y: 5px;\n  }\n\n  50% {\n    background-position-y: -2px;\n  }\n\n  100% {\n    background-position-y: 0;\n  }\n}\r\nbody[dir=\"rtl\"] .checkbox {\n  --chkbg: var(--bc);\n  --chkfg: var(--b1);\n}\r\nbody[dir=\"rtl\"] .checkbox:checked,\n    body[dir=\"rtl\"] .checkbox[checked=\"true\"] {\n  background-image: linear-gradient(45deg, transparent 65%, hsl(var(--chkbg)) 65.99%), linear-gradient(-45deg, transparent 75%, hsl(var(--chkbg)) 75.99%), linear-gradient(45deg, hsl(var(--chkbg)) 40%, transparent 40.99%), linear-gradient(-45deg, hsl(var(--chkbg)) 30%, hsl(var(--chkfg)) 30.99%, hsl(var(--chkfg)) 40%, transparent 40.99%), linear-gradient(45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button {\n  outline: 2px solid hsl(var(--nf));\n  outline-offset: 2px;\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-primary {\n  outline: 2px solid hsl(var(--p));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-secondary {\n  outline: 2px solid hsl(var(--s));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-accent {\n  outline: 2px solid hsl(var(--a));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-info {\n  outline: 2px solid hsl(var(--in));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-success {\n  outline: 2px solid hsl(var(--su));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-warning {\n  outline: 2px solid hsl(var(--wa));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-error {\n  outline: 2px solid hsl(var(--er));\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.glass {\n  outline: 2px solid currentColor;\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-ghost {\n  outline: 2px solid currentColor;\n}\r\n.drawer-toggle:focus-visible ~ .drawer-content .drawer-button.btn-link {\n  outline: 2px solid currentColor;\n}\r\n.dropdown.dropdown-open .dropdown-content, .dropdown.dropdown-hover:hover .dropdown-content, .dropdown:focus .dropdown-content, .dropdown:focus-within .dropdown-content {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.label-text {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n}\r\n.label-text-alt {\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n}\r\n.label a:hover {\n  --tw-text-opacity: 1;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n}\r\n.input[list]::-webkit-calendar-picker-indicator {\n  line-height: 1em;\n}\r\n.input-bordered {\n  --tw-border-opacity: 0.2;\n}\r\n.input:focus {\n  outline: 2px solid hsla(var(--bc) / 0.2);\n  outline-offset: 2px;\n}\r\n.input-disabled, .input[disabled] {\n  cursor: not-allowed;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 0.2;\n}\r\n.input-disabled::-moz-placeholder, .input[disabled]::-moz-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.input-disabled:-ms-input-placeholder, .input[disabled]:-ms-input-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.input-disabled::placeholder, .input[disabled]::placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.link:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n.link:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\r\n.menu.horizontal li.bordered > a, .menu.horizontal li.bordered > button, .menu.horizontal li.bordered > span {\n  border-left-width: 0px;\n  border-bottom-width: 4px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n}\r\n.menu[class*=\" p-\"] li > *, .menu[class^=\"p-\"] li > * {\n  border-radius: var(--rounded-btn, 0.5rem);\n}\r\n.menu :where(li.bordered > *) {\n  border-left-width: 4px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n}\r\n.menu :where(li) > :where(*:not(ul)) {\n  gap: 0.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: currentColor;\n}\r\n.menu :where(li:not(.menu-title):not(:empty)) > :where(*:not(ul):focus), .menu :where(li:not(.menu-title):not(:empty)) > :where(*:not(ul):hover) {\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.1;\n}\r\n.menu :where(li:not(.menu-title):not(:empty)) > :where(:not(ul).active), .menu :where(li:not(.menu-title):not(:empty)) > :where(*:not(ul):active) {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--p) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--pc) / var(--tw-text-opacity));\n}\r\n.menu :where(li:empty) {\n  margin-left: 1rem;\n  margin-right: 1rem;\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n  height: 1px;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.1;\n}\r\n.menu li.disabled > * {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n  --tw-text-opacity: 0.2;\n}\r\n.menu li.disabled > *:hover {\n  background-color: transparent;\n}\r\n.menu li.hover-bordered a {\n  border-left-width: 4px;\n  border-color: transparent;\n}\r\n.menu li.hover-bordered a:hover {\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--p) / var(--tw-border-opacity));\n}\r\n.menu.compact li > a, .menu.compact li > span {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.menu .menu-title > * {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 700;\n  color: hsl(var(--bc) / var(--tw-text-opacity));\n  --tw-text-opacity: 0.4;\n}\r\n.menu :where(li:not(.disabled)) > :where(*:not(ul)) {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\r\n.menu > :where(li:first-child) {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: unset;\n  border-bottom-left-radius: unset;\n}\r\n.menu > :where(li:first-child) > :where(:not(ul)) {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: unset;\n  border-bottom-left-radius: unset;\n}\r\n.menu > :where(li:last-child) {\n  border-top-left-radius: unset;\n  border-top-right-radius: unset;\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\r\n.menu > :where(li:last-child) > :where(:not(ul)) {\n  border-top-left-radius: unset;\n  border-top-right-radius: unset;\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\r\n.menu > :where(li) > :where(ul) :where(li) {\n  width: 100%;\n  white-space: nowrap;\n}\r\n.menu > :where(li) > :where(ul) :where(li) :where(ul) {\n  padding-left: 1rem;\n}\r\n.menu > :where(li) > :where(ul) :where(li) > :where(:not(ul)) {\n  width: 100%;\n  white-space: nowrap;\n}\r\n.menu > :where(li) > :where(ul) > :where(li:first-child) {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: unset;\n  border-bottom-left-radius: unset;\n}\r\n.menu > :where(li) > :where(ul) > :where(li:first-child) > :where(:not(ul)) {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: unset;\n  border-bottom-left-radius: unset;\n}\r\n.menu > :where(li) > :where(ul) > :where(li:last-child) {\n  border-top-left-radius: unset;\n  border-top-right-radius: unset;\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\r\n.menu > :where(li) > :where(ul) > :where(li:last-child) > :where(:not(ul)) {\n  border-top-left-radius: unset;\n  border-top-right-radius: unset;\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\r\n.mockup-phone .display {\n  overflow: hidden;\n  border-radius: 40px;\n  margin-top: -25px;\n}\r\n.modal-open .modal-box, .modal-toggle:checked + .modal .modal-box, .modal:target .modal-box {\n  --tw-translate-y: 0px;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n@-webkit-keyframes progress-loading {\n\n  50% {\n    left: 107%;\n  }\n}\r\n@keyframes progress-loading {\n\n  50% {\n    left: 107%;\n  }\n}\r\n@-webkit-keyframes radiomark {\n\n  0% {\n    box-shadow: 0 0 0 12px hsl(var(--b1)) inset, 0 0 0 12px hsl(var(--b1)) inset;\n  }\n\n  50% {\n    box-shadow: 0 0 0 3px hsl(var(--b1)) inset, 0 0 0 3px hsl(var(--b1)) inset;\n  }\n\n  100% {\n    box-shadow: 0 0 0 4px hsl(var(--b1)) inset, 0 0 0 4px hsl(var(--b1)) inset;\n  }\n}\r\n@keyframes radiomark {\n\n  0% {\n    box-shadow: 0 0 0 12px hsl(var(--b1)) inset, 0 0 0 12px hsl(var(--b1)) inset;\n  }\n\n  50% {\n    box-shadow: 0 0 0 3px hsl(var(--b1)) inset, 0 0 0 3px hsl(var(--b1)) inset;\n  }\n\n  100% {\n    box-shadow: 0 0 0 4px hsl(var(--b1)) inset, 0 0 0 4px hsl(var(--b1)) inset;\n  }\n}\r\n.range:focus-visible::-webkit-slider-thumb {\n  --focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset;\n}\r\n.range:focus-visible::-moz-range-thumb {\n  --focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset;\n}\r\n.range::-webkit-slider-runnable-track {\n  height: 0.5rem;\n  width: 100%;\n  border-radius: var(--rounded-box, 1rem);\n  background-color: hsla(var(--bc) / 0.1);\n}\r\n.range::-moz-range-track {\n  height: 0.5rem;\n  width: 100%;\n  border-radius: var(--rounded-box, 1rem);\n  background-color: hsla(var(--bc) / 0.1);\n}\r\n.range::-webkit-slider-thumb {\n  background-color: hsl(var(--b1));\n  position: relative;\n  height: 1.5rem;\n  width: 1.5rem;\n  border-style: none;\n  border-radius: var(--rounded-box, 1rem);\n  -webkit-appearance: none;\n  top: 50%;\n  color: hsl(var(--range-shdw));\n  transform: translateY(-50%);\n  --filler-size: 100rem;\n  --filler-offset: 0.6rem;\n  box-shadow: 0 0 0 3px hsl(var(--range-shdw)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);\n}\r\n.range::-moz-range-thumb {\n  background-color: hsl(var(--b1));\n  position: relative;\n  height: 1.5rem;\n  width: 1.5rem;\n  border-style: none;\n  border-radius: var(--rounded-box, 1rem);\n  top: 50%;\n  color: hsl(var(--range-shdw));\n  --filler-size: 100rem;\n  --filler-offset: 0.5rem;\n  box-shadow: 0 0 0 3px hsl(var(--range-shdw)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);\n}\r\n.range-accent {\n  --range-shdw: var(--a);\n}\r\n@-webkit-keyframes rating-pop {\n\n  0% {\n    transform: translateY(-0.125em);\n  }\n\n  40% {\n    transform: translateY(-0.125em);\n  }\n\n  100% {\n    transform: translateY(0);\n  }\n}\r\n@keyframes rating-pop {\n\n  0% {\n    transform: translateY(-0.125em);\n  }\n\n  40% {\n    transform: translateY(-0.125em);\n  }\n\n  100% {\n    transform: translateY(0);\n  }\n}\r\n.select-bordered {\n  --tw-border-opacity: 0.2;\n}\r\n.select:focus {\n  outline: 2px solid hsla(var(--bc) / 0.2);\n  outline-offset: 2px;\n}\r\n.select-disabled::-moz-placeholder, .select[disabled]::-moz-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.select-disabled:-ms-input-placeholder, .select[disabled]:-ms-input-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.select-disabled::placeholder, .select[disabled]::placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.select-multiple, .select[multiple], .select[size].select:not([size=\"1\"]) {\n  background-image: none;\n  padding-right: 1rem;\n}\r\n.table :where(th, td) {\n  white-space: nowrap;\n  padding: 1rem;\n  vertical-align: middle;\n}\r\n.table tr.active th, .table tr.active td, .table tr.active:nth-child(even) th, .table tr.active:nth-child(even) td {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity));\n}\r\n.table tr.hover:hover th, .table tr.hover:hover td, .table tr.hover:nth-child(even):hover th, .table tr.hover:nth-child(even):hover td {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity));\n}\r\n.table:where(:not(.table-zebra)) :where(thead, tbody, tfoot) :where(tr:not(:last-child) :where(th, td)) {\n  border-bottom-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n}\r\n.table :where(thead, tfoot) :where(th, td) {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\r\n.table :where(:first-child) :where(:first-child) :where(th, td):first-child {\n  border-top-left-radius: 0.5rem;\n}\r\n.table :where(:first-child) :where(:first-child) :where(th, td):last-child {\n  border-top-right-radius: 0.5rem;\n}\r\n.table :where(:last-child) :where(:last-child) :where(th, td):first-child {\n  border-bottom-left-radius: 0.5rem;\n}\r\n.table :where(:last-child) :where(:last-child) :where(th, td):last-child {\n  border-bottom-right-radius: 0.5rem;\n}\r\n.table :where(tbody th, tbody td) {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n}\r\n.textarea-bordered {\n  --tw-border-opacity: 0.2;\n}\r\n.textarea:focus {\n  outline: 2px solid hsla(var(--bc) / 0.2);\n  outline-offset: 2px;\n}\r\n.textarea-disabled, .textarea[disabled] {\n  cursor: not-allowed;\n  --tw-border-opacity: 1;\n  border-color: hsl(var(--b2, var(--b1)) / var(--tw-border-opacity));\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));\n  --tw-text-opacity: 0.2;\n}\r\n.textarea-disabled::-moz-placeholder, .textarea[disabled]::-moz-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.textarea-disabled:-ms-input-placeholder, .textarea[disabled]:-ms-input-placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.textarea-disabled::placeholder, .textarea[disabled]::placeholder {\n  color: hsl(var(--bc) / var(--tw-placeholder-opacity));\n  --tw-placeholder-opacity: 0.2;\n}\r\n.toggle:focus-visible {\n  outline: 2px solid hsl(var(--bc));\n  outline-offset: 2px;\n}\r\n.toggle:checked,\n  .toggle[checked=\"true\"] {\n  --chkbg: hsl(var(--bc));\n  --tw-border-opacity: 1;\n  --tw-bg-opacity: 1;\n  box-shadow: var(--handleoffset) 0 0 2px hsl(var(--b1)) inset, 0 0 0 2px hsl(var(--b1)) inset;\n}\r\n[dir=\"rtl\"] .toggle:checked, [dir=\"rtl\"] .toggle[checked=\"true\"] {\n  box-shadow: calc(var(--handleoffset) * 1) 0 0 2px hsl(var(--b1)) inset, 0 0 0 2px hsl(var(--b1)) inset;\n}\r\n.toggle:indeterminate {\n  --chkbg: hsl(var(--bc));\n  --tw-border-opacity: 1;\n  --tw-bg-opacity: 1;\n  box-shadow: calc(var(--handleoffset) / 2) 0 0 2px hsl(var(--b1)) inset, calc(var(--handleoffset) / -2) 0 0 2px hsl(var(--b1)) inset, 0 0 0 2px hsl(var(--b1)) inset;\n}\r\n[dir=\"rtl\"] .toggle:indeterminate {\n  box-shadow: calc(var(--handleoffset) / 2) 0 0 2px hsl(var(--b1)) inset, calc(var(--handleoffset) / -2) 0 0 2px hsl(var(--b1)) inset, 0 0 0 2px hsl(var(--b1)) inset;\n}\r\n.toggle:disabled {\n  cursor: not-allowed;\n  border-color: transparent;\n  background-color: hsl(var(--bc) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 0.2;\n}\r\n.tooltip:before, .tooltip:after {\n  opacity: 0;\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-delay: 100ms;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\r\n.tooltip:after {\n  position: absolute;\n  content: \"\";\n  border-style: solid;\n  border-width: var(--tooltip-tail, 0);\n  width: 0;\n  height: 0;\n  display: block;\n  transform: translateX(-50%);\n  border-color: var(--tooltip-color) transparent transparent transparent;\n  top: auto;\n  left: 50%;\n  right: auto;\n  bottom: var(--tooltip-tail-offset);\n}\r\n.tooltip.tooltip-open:before, .tooltip.tooltip-open:after, .tooltip:hover:before, .tooltip:hover:after {\n  opacity: 1;\n  transition-delay: 75ms;\n}\r\n.rounded-box {\n  border-radius: var(--rounded-box, 1rem);\n}\r\n.glass,\n  .glass:hover,\n  .glass.btn-active {\n  border: none;\n  -webkit-backdrop-filter: blur(var(--glass-blur, 40px));\n          backdrop-filter: blur(var(--glass-blur, 40px));\n  background-color: transparent;\n  background-image: linear-gradient(\n        135deg,\n        rgb(255 255 255 / var(--glass-opacity, 30%)) 0%,\n        rgb(0 0 0 / 0%) 100%\n      ),\n      linear-gradient(\n        var(--glass-reflex-degree, 100deg),\n        rgb(255 255 255 / var(--glass-reflex-opacity, 10%)) 25%,\n        rgb(0 0 0 / 0%) 25%\n      );\n  box-shadow: 0 0 0 1px rgb(255 255 255 / var(--glass-border-opacity, 10%))\n        inset,\n      0 0 0 2px rgb(0 0 0 / 5%);\n  text-shadow: 0 1px rgb(0 0 0 / var(--glass-text-shadow-opacity, 5%));\n}\r\n.btn-xs {\n  height: 1.5rem;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  min-height: 1.5rem;\n  font-size: 0.75rem;\n}\r\n.btn-sm {\n  height: 2rem;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  min-height: 2rem;\n  font-size: 0.875rem;\n}\r\n.btn-wide {\n  width: 16rem;\n}\r\n.btn-square:where(.btn-xs) {\n  height: 1.5rem;\n  width: 1.5rem;\n  padding: 0px;\n}\r\n.btn-square:where(.btn-sm) {\n  height: 2rem;\n  width: 2rem;\n  padding: 0px;\n}\r\n.btn-square:where(.btn-md) {\n  height: 3rem;\n  width: 3rem;\n  padding: 0px;\n}\r\n.btn-square:where(.btn-lg) {\n  height: 4rem;\n  width: 4rem;\n  padding: 0px;\n}\r\n.btn-circle:where(.btn-xs) {\n  height: 1.5rem;\n  width: 1.5rem;\n  border-radius: 9999px;\n  padding: 0px;\n}\r\n.btn-circle:where(.btn-sm) {\n  height: 2rem;\n  width: 2rem;\n  border-radius: 9999px;\n  padding: 0px;\n}\r\n.btn-circle:where(.btn-md) {\n  height: 3rem;\n  width: 3rem;\n  border-radius: 9999px;\n  padding: 0px;\n}\r\n.btn-circle:where(.btn-lg) {\n  height: 4rem;\n  width: 4rem;\n  border-radius: 9999px;\n  padding: 0px;\n}\r\n.indicator :where(.indicator-item) {\n  right: 0px;\n  left: auto;\n  top: 0px;\n  bottom: auto;\n  --tw-translate-x: 50%;\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-start) {\n  right: auto;\n  left: 0px;\n  --tw-translate-x: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-center) {\n  right: 50%;\n  left: 50%;\n  --tw-translate-x: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-end) {\n  right: 0px;\n  left: auto;\n  --tw-translate-x: 50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-bottom) {\n  top: auto;\n  bottom: 0px;\n  --tw-translate-y: 50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-middle) {\n  top: 50%;\n  bottom: 50%;\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.indicator :where(.indicator-item.indicator-top) {\n  top: 0px;\n  bottom: auto;\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n.input-lg {\n  height: 4rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n  line-height: 2;\n}\r\n.input-sm {\n  height: 2rem;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 2rem;\n}\r\n.modal-bottom {\n  align-items: flex-end;\n}\r\n.range-sm {\n  height: 1.25rem;\n}\r\n.range-sm::-webkit-slider-runnable-track {\n  height: 0.25rem;\n}\r\n.range-sm::-moz-range-track {\n  height: 0.25rem;\n}\r\n.range-sm::-webkit-slider-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  --filler-offset: 0.5rem;\n}\r\n.range-sm::-moz-range-thumb {\n  height: 1.25rem;\n  width: 1.25rem;\n  --filler-offset: 0.5rem;\n}\r\n.toggle-md {\n  --handleoffset: 1.5rem;\n  height: 1.5rem;\n  width: 3rem;\n}\r\n.alert-error {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--er) / var(--tw-bg-opacity));\n  --tw-text-opacity: 1;\n  color: hsl(var(--erc, var(--nc)) / var(--tw-text-opacity));\n}\r\n.badge-outline {\n  border-color: currentColor;\n  --tw-border-opacity: 0.5;\n  background-color: transparent;\n  color: currentColor;\n}\r\n.badge-outline.badge-primary {\n  --tw-text-opacity: 1;\n  color: hsl(var(--p) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-secondary {\n  --tw-text-opacity: 1;\n  color: hsl(var(--s) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-accent {\n  --tw-text-opacity: 1;\n  color: hsl(var(--a) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-info {\n  --tw-text-opacity: 1;\n  color: hsl(var(--in) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-success {\n  --tw-text-opacity: 1;\n  color: hsl(var(--su) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-warning {\n  --tw-text-opacity: 1;\n  color: hsl(var(--wa) / var(--tw-text-opacity));\n}\r\n.badge-outline.badge-error {\n  --tw-text-opacity: 1;\n  color: hsl(var(--er) / var(--tw-text-opacity));\n}\r\n.card-compact .card-body {\n  padding: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.card-compact .card-title {\n  margin-bottom: 0.25rem;\n}\r\n.card-normal .card-body {\n  padding: var(--padding-card, 2rem);\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\r\n.card-normal .card-title {\n  margin-bottom: 0.75rem;\n}\r\n.menu-compact :where(li > *) {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.modal-bottom :where(.modal-box) {\n  width: 100%;\n  max-width: none;\n  --tw-translate-y: 2.5rem;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-bottom-right-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\r\n.modal-middle :where(.modal-box) {\n  width: 91.666667%;\n  max-width: 32rem;\n  --tw-translate-y: 0px;\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-bottom-left-radius: var(--rounded-box, 1rem);\n  border-bottom-right-radius: var(--rounded-box, 1rem);\n}\r\n.fixed {\n  position: fixed;\n}\r\n.absolute {\n  position: absolute;\n}\r\n.relative {\n  position: relative;\n}\r\n.right-2 {\n  right: 0.5rem;\n}\r\n.top-2 {\n  top: 0.5rem;\n}\r\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\r\n.mr-2 {\n  margin-right: 0.5rem;\n}\r\n.mt-6 {\n  margin-top: 1.5rem;\n}\r\n.mt-3 {\n  margin-top: 0.75rem;\n}\r\n.ml-2 {\n  margin-left: 0.5rem;\n}\r\n.mt-5 {\n  margin-top: 1.25rem;\n}\r\n.mt-2 {\n  margin-top: 0.5rem;\n}\r\n.mt-10 {\n  margin-top: 2.5rem;\n}\r\n.mt-8 {\n  margin-top: 2rem;\n}\r\n.inline-block {\n  display: inline-block;\n}\r\n.flex {\n  display: flex;\n}\r\n.inline-flex {\n  display: inline-flex;\n}\r\n.table {\n  display: table;\n}\r\n.h-5 {\n  height: 1.25rem;\n}\r\n.w-96 {\n  width: 24rem;\n}\r\n.w-full {\n  width: 100%;\n}\r\n.w-5 {\n  width: 1.25rem;\n}\r\n.w-52 {\n  width: 13rem;\n}\r\n.w-10 {\n  width: 2.5rem;\n}\r\n.w-20 {\n  width: 5rem;\n}\r\n.w-32 {\n  width: 8rem;\n}\r\n.max-w-xs {\n  max-width: 20rem;\n}\r\n.max-w-sm {\n  max-width: 24rem;\n}\r\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\r\n.flex-grow {\n  flex-grow: 1;\n}\r\n.cursor-pointer {\n  cursor: pointer;\n}\r\n.items-center {\n  align-items: center;\n}\r\n.justify-end {\n  justify-content: flex-end;\n}\r\n.overflow-x-auto {\n  overflow-x: auto;\n}\r\n.rounded-lg {\n  border-radius: 0.5rem;\n}\r\n.rounded-xl {\n  border-radius: 0.75rem;\n}\r\n.border {\n  border-width: 1px;\n}\r\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity));\n}\r\n.bg-red-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity));\n}\r\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\r\n.bg-base-100 {\n  --tw-bg-opacity: 1;\n  background-color: hsl(var(--b1) / var(--tw-bg-opacity));\n}\r\n.bg-yellow-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 249 195 / var(--tw-bg-opacity));\n}\r\n.bg-indigo-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 231 255 / var(--tw-bg-opacity));\n}\r\n.bg-red-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 226 226 / var(--tw-bg-opacity));\n}\r\n.bg-green-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 252 231 / var(--tw-bg-opacity));\n}\r\n.fill-current {\n  fill: currentColor;\n}\r\n.p-1 {\n  padding: 0.25rem;\n}\r\n.p-2 {\n  padding: 0.5rem;\n}\r\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\r\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\r\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\r\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\r\n.pt-2 {\n  padding-top: 0.5rem;\n}\r\n.pr-5 {\n  padding-right: 1.25rem;\n}\r\n.pl-2 {\n  padding-left: 0.5rem;\n}\r\n.pr-2 {\n  padding-right: 0.5rem;\n}\r\n.text-center {\n  text-align: center;\n}\r\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\r\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\r\n.font-medium {\n  font-weight: 500;\n}\r\n.normal-case {\n  text-transform: none;\n}\r\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\r\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\r\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.shadow-2xl {\n  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n\r\n.center_content{\r\n    margin-top: 1%;\r\n    display: flex;\r\n    align-items: center;\r\n    flex-direction: column;\r\n}\r\n\r\n.hover\\:bg-red-800:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(153 27 27 / var(--tw-bg-opacity));\n}\r\n\r\n.hover\\:bg-gray-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\r\n\r\n.hover\\:text-gray-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\r\n\r\n.focus\\:z-10:focus {\n  z-index: 10;\n}\r\n\r\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\r\n\r\n.focus\\:ring-4:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\r\n\r\n.focus\\:ring-red-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(252 165 165 / var(--tw-ring-opacity));\n}\r\n\r\n.focus\\:ring-gray-200:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity));\n}\r\n\r\n@media (prefers-color-scheme: dark) {\n\n  .dark\\:border-gray-500 {\n    --tw-border-opacity: 1;\n    border-color: rgb(107 114 128 / var(--tw-border-opacity));\n  }\n\n  .dark\\:bg-gray-700 {\n    --tw-bg-opacity: 1;\n    background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n  }\n\n  .dark\\:text-gray-300 {\n    --tw-text-opacity: 1;\n    color: rgb(209 213 219 / var(--tw-text-opacity));\n  }\n\n  .dark\\:hover\\:bg-gray-600:hover {\n    --tw-bg-opacity: 1;\n    background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n  }\n\n  .dark\\:hover\\:text-white:hover {\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity));\n  }\n\n  .dark\\:focus\\:ring-red-800:focus {\n    --tw-ring-opacity: 1;\n    --tw-ring-color: rgb(153 27 27 / var(--tw-ring-opacity));\n  }\n\n  .dark\\:focus\\:ring-gray-600:focus {\n    --tw-ring-opacity: 1;\n    --tw-ring-color: rgb(75 85 99 / var(--tw-ring-opacity));\n  }\n}\r\n\r\n@media (min-width: 768px) {\n\n  .md\\:h-6 {\n    height: 1.5rem;\n  }\n\n  .md\\:w-6 {\n    width: 1.5rem;\n  }\n}\r\n";
    styleInject(css_248z);

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
