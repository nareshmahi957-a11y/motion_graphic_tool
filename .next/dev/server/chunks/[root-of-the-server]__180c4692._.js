module.exports = [
"[externals]/@remotion/bundler [external] (@remotion/bundler, cjs, [project]/node_modules/@remotion/bundler)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@remotion/bundler-181fc14e3a0072d9", () => require("@remotion/bundler-181fc14e3a0072d9"));

module.exports = mod;
}),
"[externals]/@remotion/renderer [external] (@remotion/renderer, esm_import, [project]/node_modules/@remotion/renderer)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@remotion/renderer-d1e931be07831567");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/readdir-glob/node_modules/minimatch/lib/path.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const isWindows = typeof process === 'object' && process && process.platform === 'win32';
module.exports = isWindows ? {
    sep: '\\'
} : {
    sep: '/'
};
}),
"[project]/node_modules/readdir-glob/node_modules/minimatch/minimatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const minimatch = module.exports = (p, pattern, options = {})=>{
    assertValidPattern(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
module.exports = minimatch;
const path = __turbopack_context__.r("[project]/node_modules/readdir-glob/node_modules/minimatch/lib/path.js [app-route] (ecmascript)");
minimatch.sep = path.sep;
const GLOBSTAR = Symbol('globstar **');
minimatch.GLOBSTAR = GLOBSTAR;
const expand = __turbopack_context__.r("[project]/node_modules/readdir-glob/node_modules/brace-expansion/index.js [app-route] (ecmascript)");
const plTypes = {
    '!': {
        open: '(?:(?!(?:',
        close: '))[^/]*?)'
    },
    '?': {
        open: '(?:',
        close: ')?'
    },
    '+': {
        open: '(?:',
        close: ')+'
    },
    '*': {
        open: '(?:',
        close: ')*'
    },
    '@': {
        open: '(?:',
        close: ')'
    }
};
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';
// "abc" -> { a:true, b:true, c:true }
const charSet = (s)=>s.split('').reduce((set, c)=>{
        set[c] = true;
        return set;
    }, {});
// characters that need to be escaped in RegExp.
const reSpecials = charSet('().*{}+?[]^$\\!');
// characters that indicate we have to add the pattern start
const addPatternStartSet = charSet('[.(');
// normalizes slashes.
const slashSplit = /\/+/;
minimatch.filter = (pattern, options = {})=>(p, i, list)=>minimatch(p, pattern, options);
const ext = (a, b = {})=>{
    const t = {};
    Object.keys(a).forEach((k)=>t[k] = a[k]);
    Object.keys(b).forEach((k)=>t[k] = b[k]);
    return t;
};
minimatch.defaults = (def)=>{
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return minimatch;
    }
    const orig = minimatch;
    const m = (p, pattern, options)=>orig(p, pattern, ext(def, options));
    m.Minimatch = class Minimatch extends orig.Minimatch {
        constructor(pattern, options){
            super(pattern, ext(def, options));
        }
    };
    m.Minimatch.defaults = (options)=>orig.defaults(ext(def, options)).Minimatch;
    m.filter = (pattern, options)=>orig.filter(pattern, ext(def, options));
    m.defaults = (options)=>orig.defaults(ext(def, options));
    m.makeRe = (pattern, options)=>orig.makeRe(pattern, ext(def, options));
    m.braceExpand = (pattern, options)=>orig.braceExpand(pattern, ext(def, options));
    m.match = (list, pattern, options)=>orig.match(list, pattern, ext(def, options));
    return m;
};
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = (pattern, options)=>braceExpand(pattern, options);
const braceExpand = (pattern, options = {})=>{
    assertValidPattern(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [
            pattern
        ];
    }
    return expand(pattern);
};
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern)=>{
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const SUBPARSE = Symbol('subparse');
minimatch.makeRe = (pattern, options)=>new Minimatch(pattern, options || {}).makeRe();
minimatch.match = (list, pattern, options = {})=>{
    const mm = new Minimatch(pattern, options);
    list = list.filter((f)=>mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
// replace stuff like \* with *
const globUnescape = (s)=>s.replace(/\\(.)/g, '$1');
const charUnescape = (s)=>s.replace(/\\([^-\]])/g, '$1');
const regExpEscape = (s)=>s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
const braExpEscape = (s)=>s.replace(/[[\]\\]/g, '\\$&');
class Minimatch {
    constructor(pattern, options){
        assertValidPattern(pattern);
        if (!options) options = {};
        this.options = options;
        this.maxGlobstarRecursion = options.maxGlobstarRecursion !== undefined ? options.maxGlobstarRecursion : 200;
        this.set = [];
        this.pattern = pattern;
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.regexp = null;
        this.negate = false;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        // make the set of regexps etc.
        this.make();
    }
    debug() {}
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        let set = this.globSet = this.braceExpand();
        if (options.debug) this.debug = (...args)=>console.error(...args);
        this.debug(this.pattern, set);
        // step 3: now we have a set, so turn each one into a series of path-portion
        // matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        set = this.globParts = set.map((s)=>s.split(slashSplit));
        this.debug(this.pattern, set);
        // glob --> regexps
        set = set.map((s, si, set)=>s.map(this.parse, this));
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        set = set.filter((s)=>s.indexOf(false) === -1);
        this.debug(this.pattern, set);
        this.set = set;
    }
    parseNegate() {
        if (this.options.nonegate) return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for(let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++){
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset) this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial) {
        if (pattern.indexOf(GLOBSTAR) !== -1) {
            return this._matchGlobstar(file, pattern, partial, 0, 0);
        }
        return this._matchOne(file, pattern, partial, 0, 0);
    }
    _matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
        // find first globstar from patternIndex
        let firstgs = -1;
        for(let i = patternIndex; i < pattern.length; i++){
            if (pattern[i] === GLOBSTAR) {
                firstgs = i;
                break;
            }
        }
        // find last globstar
        let lastgs = -1;
        for(let i = pattern.length - 1; i >= 0; i--){
            if (pattern[i] === GLOBSTAR) {
                lastgs = i;
                break;
            }
        }
        const head = pattern.slice(patternIndex, firstgs);
        const body = partial ? pattern.slice(firstgs + 1) : pattern.slice(firstgs + 1, lastgs);
        const tail = partial ? [] : pattern.slice(lastgs + 1);
        // check the head
        if (head.length) {
            const fileHead = file.slice(fileIndex, fileIndex + head.length);
            if (!this._matchOne(fileHead, head, partial, 0, 0)) {
                return false;
            }
            fileIndex += head.length;
        }
        // check the tail
        let fileTailMatch = 0;
        if (tail.length) {
            if (tail.length + fileIndex > file.length) return false;
            const tailStart = file.length - tail.length;
            if (this._matchOne(file, tail, partial, tailStart, 0)) {
                fileTailMatch = tail.length;
            } else {
                // affordance for stuff like a/**/* matching a/b/
                if (file[file.length - 1] !== '' || fileIndex + tail.length === file.length) {
                    return false;
                }
                if (!this._matchOne(file, tail, partial, tailStart - 1, 0)) {
                    return false;
                }
                fileTailMatch = tail.length + 1;
            }
        }
        // if body is empty (single ** between head and tail)
        if (!body.length) {
            let sawSome = !!fileTailMatch;
            for(let i = fileIndex; i < file.length - fileTailMatch; i++){
                const f = String(file[i]);
                sawSome = true;
                if (f === '.' || f === '..' || !this.options.dot && f.charAt(0) === '.') {
                    return false;
                }
            }
            return partial || sawSome;
        }
        // split body into segments at each GLOBSTAR
        const bodySegments = [
            [
                [],
                0
            ]
        ];
        let currentBody = bodySegments[0];
        let nonGsParts = 0;
        const nonGsPartsSums = [
            0
        ];
        for (const b of body){
            if (b === GLOBSTAR) {
                nonGsPartsSums.push(nonGsParts);
                currentBody = [
                    [],
                    0
                ];
                bodySegments.push(currentBody);
            } else {
                currentBody[0].push(b);
                nonGsParts++;
            }
        }
        let idx = bodySegments.length - 1;
        const fileLength = file.length - fileTailMatch;
        for (const b of bodySegments){
            b[1] = fileLength - (nonGsPartsSums[idx--] + b[0].length);
        }
        return !!this._matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
    }
    // return false for "nope, not matching"
    // return null for "not matching, cannot keep trying"
    _matchGlobStarBodySections(file, bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
        const bs = bodySegments[bodyIndex];
        if (!bs) {
            // just make sure there are no bad dots
            for(let i = fileIndex; i < file.length; i++){
                sawTail = true;
                const f = file[i];
                if (f === '.' || f === '..' || !this.options.dot && f.charAt(0) === '.') {
                    return false;
                }
            }
            return sawTail;
        }
        const [body, after] = bs;
        while(fileIndex <= after){
            const m = this._matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
            // if limit exceeded, no match. intentional false negative,
            // acceptable break in correctness for security.
            if (m && globStarDepth < this.maxGlobstarRecursion) {
                const sub = this._matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
                if (sub !== false) {
                    return sub;
                }
            }
            const f = file[fileIndex];
            if (f === '.' || f === '..' || !this.options.dot && f.charAt(0) === '.') {
                return false;
            }
            fileIndex++;
        }
        return partial || null;
    }
    _matchOne(file, pattern, partial, fileIndex, patternIndex) {
        let fi, pi, fl, pl;
        for(fi = fileIndex, pi = patternIndex, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++){
            this.debug('matchOne loop');
            const p = pattern[pi];
            const f = file[fi];
            this.debug(pattern, p, f);
            // should be impossible.
            // some invalid regexp stuff in the set.
            /* istanbul ignore if */ if (p === false || p === GLOBSTAR) return false;
            // something other than **
            // non-magic patterns just have to match exactly
            // patterns with magic have been turned into regexps.
            let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            } else {
                hit = f.match(p);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit) return false;
        }
        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
            // ran out of pattern and filename at the same time.
            // an exact hit!
            return true;
        } else if (fi === fl) {
            // ran out of file, but still had pattern left.
            // this is ok if we're doing the match as part of
            // a glob fs traversal.
            return partial;
        } else /* istanbul ignore else */ if (pi === pl) {
            // ran out of pattern, still have file left.
            // this is only acceptable if we're on the very last
            // empty segment of a file with a trailing slash.
            // a/* should match a/b/
            return fi === fl - 1 && file[fi] === '';
        }
        // should be unreachable.
        /* istanbul ignore next */ throw new Error('wtf?');
    }
    braceExpand() {
        return braceExpand(this.pattern, this.options);
    }
    parse(pattern, isSub) {
        assertValidPattern(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**') {
            if (!options.noglobstar) return GLOBSTAR;
            else pattern = '*';
        }
        if (pattern === '') return '';
        let re = '';
        let hasMagic = false;
        let escaping = false;
        // ? => one single character
        const patternListStack = [];
        const negativeLists = [];
        let stateChar;
        let inClass = false;
        let reClassStart = -1;
        let classStart = -1;
        let cs;
        let pl;
        let sp;
        // . and .. never match anything that doesn't start with .,
        // even when options.dot is set.  However, if the pattern
        // starts with ., then traversal patterns can match.
        let dotTravAllowed = pattern.charAt(0) === '.';
        let dotFileAllowed = options.dot || dotTravAllowed;
        const patternStart = ()=>dotTravAllowed ? '' : dotFileAllowed ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)';
        const subPatternStart = (p)=>p.charAt(0) === '.' ? '' : options.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)';
        const clearStateChar = ()=>{
            if (stateChar) {
                // we had some state-tracking character
                // that wasn't consumed by this pass.
                switch(stateChar){
                    case '*':
                        re += star;
                        hasMagic = true;
                        break;
                    case '?':
                        re += qmark;
                        hasMagic = true;
                        break;
                    default:
                        re += '\\' + stateChar;
                        break;
                }
                this.debug('clearStateChar %j %j', stateChar, re);
                stateChar = false;
            }
        };
        for(let i = 0, c; i < pattern.length && (c = pattern.charAt(i)); i++){
            this.debug('%s\t%s %s %j', pattern, i, re, c);
            // skip over any that are escaped.
            if (escaping) {
                /* istanbul ignore next - completely not allowed, even escaped. */ if (c === '/') {
                    return false;
                }
                if (reSpecials[c]) {
                    re += '\\';
                }
                re += c;
                escaping = false;
                continue;
            }
            switch(c){
                /* istanbul ignore next */ case '/':
                    {
                        // Should already be path-split by now.
                        return false;
                    }
                case '\\':
                    if (inClass && pattern.charAt(i + 1) === '-') {
                        re += c;
                        continue;
                    }
                    clearStateChar();
                    escaping = true;
                    continue;
                // the various stateChar values
                // for the "extglob" stuff.
                case '?':
                case '*':
                case '+':
                case '@':
                case '!':
                    this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);
                    // all of those are literals inside a class, except that
                    // the glob [!a] means [^a] in regexp
                    if (inClass) {
                        this.debug('  in class');
                        if (c === '!' && i === classStart + 1) c = '^';
                        re += c;
                        continue;
                    }
                    // coalesce consecutive non-globstar * characters
                    if (c === '*' && stateChar === '*') continue;
                    // if we already have a stateChar, then it means
                    // that there was something like ** or +? in there.
                    // Handle the stateChar, then proceed with this one.
                    this.debug('call clearStateChar %j', stateChar);
                    clearStateChar();
                    stateChar = c;
                    // if extglob is disabled, then +(asdf|foo) isn't a thing.
                    // just clear the statechar *now*, rather than even diving into
                    // the patternList stuff.
                    if (options.noext) clearStateChar();
                    continue;
                case '(':
                    {
                        if (inClass) {
                            re += '(';
                            continue;
                        }
                        if (!stateChar) {
                            re += '\\(';
                            continue;
                        }
                        const plEntry = {
                            type: stateChar,
                            start: i - 1,
                            reStart: re.length,
                            open: plTypes[stateChar].open,
                            close: plTypes[stateChar].close
                        };
                        this.debug(this.pattern, '\t', plEntry);
                        patternListStack.push(plEntry);
                        // negation is (?:(?!(?:js)(?:<rest>))[^/]*)
                        re += plEntry.open;
                        // next entry starts with a dot maybe?
                        if (plEntry.start === 0 && plEntry.type !== '!') {
                            dotTravAllowed = true;
                            re += subPatternStart(pattern.slice(i + 1));
                        }
                        this.debug('plType %j %j', stateChar, re);
                        stateChar = false;
                        continue;
                    }
                case ')':
                    {
                        const plEntry = patternListStack[patternListStack.length - 1];
                        if (inClass || !plEntry) {
                            re += '\\)';
                            continue;
                        }
                        patternListStack.pop();
                        // closing an extglob
                        clearStateChar();
                        hasMagic = true;
                        pl = plEntry;
                        // negation is (?:(?!js)[^/]*)
                        // The others are (?:<pattern>)<type>
                        re += pl.close;
                        if (pl.type === '!') {
                            negativeLists.push(Object.assign(pl, {
                                reEnd: re.length
                            }));
                        }
                        continue;
                    }
                case '|':
                    {
                        const plEntry = patternListStack[patternListStack.length - 1];
                        if (inClass || !plEntry) {
                            re += '\\|';
                            continue;
                        }
                        clearStateChar();
                        re += '|';
                        // next subpattern can start with a dot?
                        if (plEntry.start === 0 && plEntry.type !== '!') {
                            dotTravAllowed = true;
                            re += subPatternStart(pattern.slice(i + 1));
                        }
                        continue;
                    }
                // these are mostly the same in regexp and glob
                case '[':
                    // swallow any state-tracking char before the [
                    clearStateChar();
                    if (inClass) {
                        re += '\\' + c;
                        continue;
                    }
                    inClass = true;
                    classStart = i;
                    reClassStart = re.length;
                    re += c;
                    continue;
                case ']':
                    //  a right bracket shall lose its special
                    //  meaning and represent itself in
                    //  a bracket expression if it occurs
                    //  first in the list.  -- POSIX.2 2.8.3.2
                    if (i === classStart + 1 || !inClass) {
                        re += '\\' + c;
                        continue;
                    }
                    // split where the last [ was, make sure we don't have
                    // an invalid re. if so, re-walk the contents of the
                    // would-be class to re-translate any characters that
                    // were passed through as-is
                    // TODO: It would probably be faster to determine this
                    // without a try/catch and a new RegExp, but it's tricky
                    // to do safely.  For now, this is safe and works.
                    cs = pattern.substring(classStart + 1, i);
                    try {
                        RegExp('[' + braExpEscape(charUnescape(cs)) + ']');
                        // looks good, finish up the class.
                        re += c;
                    } catch (er) {
                        // out of order ranges in JS are errors, but in glob syntax,
                        // they're just a range that matches nothing.
                        re = re.substring(0, reClassStart) + '(?:$.)'; // match nothing ever
                    }
                    hasMagic = true;
                    inClass = false;
                    continue;
                default:
                    // swallow any state char that wasn't consumed
                    clearStateChar();
                    if (reSpecials[c] && !(c === '^' && inClass)) {
                        re += '\\';
                    }
                    re += c;
                    break;
            } // switch
        } // for
        // handle the case where we left a class open.
        // "[abc" is valid, equivalent to "\[abc"
        if (inClass) {
            // split where the last [ was, and escape it
            // this is a huge pita.  We now have to re-walk
            // the contents of the would-be class to re-translate
            // any characters that were passed through as-is
            cs = pattern.slice(classStart + 1);
            sp = this.parse(cs, SUBPARSE);
            re = re.substring(0, reClassStart) + '\\[' + sp[0];
            hasMagic = hasMagic || sp[1];
        }
        // handle the case where we had a +( thing at the *end*
        // of the pattern.
        // each pattern list stack adds 3 chars, and we need to go through
        // and escape any | chars that were passed through as-is for the regexp.
        // Go through and escape them, taking care not to double-escape any
        // | chars that were already escaped.
        for(pl = patternListStack.pop(); pl; pl = patternListStack.pop()){
            let tail;
            tail = re.slice(pl.reStart + pl.open.length);
            this.debug('setting tail', re, pl);
            // maybe some even number of \, then maybe 1 \, followed by a |
            tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2)=>{
                /* istanbul ignore else - should already be done */ if (!$2) {
                    // the | isn't already escaped, so escape it.
                    $2 = '\\';
                }
                // need to escape all those slashes *again*, without escaping the
                // one that we need for escaping the | character.  As it works out,
                // escaping an even number of slashes can be done by simply repeating
                // it exactly after itself.  That's why this trick works.
                //
                // I am sorry that you have to see this.
                return $1 + $1 + $2 + '|';
            });
            this.debug('tail=%j\n   %s', tail, tail, pl, re);
            const t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type;
            hasMagic = true;
            re = re.slice(0, pl.reStart) + t + '\\(' + tail;
        }
        // handle trailing things that only matter at the very end.
        clearStateChar();
        if (escaping) {
            // trailing \\
            re += '\\\\';
        }
        // only need to apply the nodot start if the re starts with
        // something that could conceivably capture a dot
        const addPatternStart = addPatternStartSet[re.charAt(0)];
        // Hack to work around lack of negative lookbehind in JS
        // A pattern like: *.!(x).!(y|z) needs to ensure that a name
        // like 'a.xyz.yz' doesn't match.  So, the first negative
        // lookahead, has to look ALL the way ahead, to the end of
        // the pattern.
        for(let n = negativeLists.length - 1; n > -1; n--){
            const nl = negativeLists[n];
            const nlBefore = re.slice(0, nl.reStart);
            const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
            let nlAfter = re.slice(nl.reEnd);
            const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
            // Handle nested stuff like *(*.js|!(*.json)), where open parens
            // mean that we should *not* include the ) in the bit that is considered
            // "after" the negated section.
            const closeParensBefore = nlBefore.split(')').length;
            const openParensBefore = nlBefore.split('(').length - closeParensBefore;
            let cleanAfter = nlAfter;
            for(let i = 0; i < openParensBefore; i++){
                cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
            }
            nlAfter = cleanAfter;
            const dollar = nlAfter === '' && isSub !== SUBPARSE ? '(?:$|\\/)' : '';
            re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        }
        // if the re is not "" at this point, then we need to make sure
        // it doesn't match against an empty path part.
        // Otherwise a/* will match a/, which it should not.
        if (re !== '' && hasMagic) {
            re = '(?=.)' + re;
        }
        if (addPatternStart) {
            re = patternStart() + re;
        }
        // parsing just a piece of a larger pattern.
        if (isSub === SUBPARSE) {
            return [
                re,
                hasMagic
            ];
        }
        // if it's nocase, and the lcase/uppercase don't match, it's magic
        if (options.nocase && !hasMagic) {
            hasMagic = pattern.toUpperCase() !== pattern.toLowerCase();
        }
        // skip the regexp for non-magical patterns
        // unescape anything in it, though, so that it'll be
        // an exact match against a file etc.
        if (!hasMagic) {
            return globUnescape(pattern);
        }
        const flags = options.nocase ? 'i' : '';
        try {
            return Object.assign(new RegExp('^' + re + '$', flags), {
                _glob: pattern,
                _src: re
            });
        } catch (er) /* istanbul ignore next - should be impossible */ {
            // If it was an invalid regular expression, then it can't match
            // anything.  This trick looks for a character after the end of
            // the string, which is of course impossible, except in multi-line
            // mode, but it's not a /m regex.
            return new RegExp('$.');
        }
    }
    makeRe() {
        if (this.regexp || this.regexp === false) return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags = options.nocase ? 'i' : '';
        // coalesce globstars and regexpify non-globstar patterns
        // if it's the only item, then we just do one twoStar
        // if it's the first, and there are more, prepend (\/|twoStar\/)? to next
        // if it's the last, append (\/twoStar|) to previous
        // if it's in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set.map((pattern)=>{
            pattern = pattern.map((p)=>typeof p === 'string' ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src).reduce((set, p)=>{
                if (!(set[set.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
                    set.push(p);
                }
                return set;
            }, []);
            pattern.forEach((p, i)=>{
                if (p !== GLOBSTAR || pattern[i - 1] === GLOBSTAR) {
                    return;
                }
                if (i === 0) {
                    if (pattern.length > 1) {
                        pattern[i + 1] = '(?:\\\/|' + twoStar + '\\\/)?' + pattern[i + 1];
                    } else {
                        pattern[i] = twoStar;
                    }
                } else if (i === pattern.length - 1) {
                    pattern[i - 1] += '(?:\\\/|' + twoStar + ')?';
                } else {
                    pattern[i - 1] += '(?:\\\/|\\\/' + twoStar + '\\\/)' + pattern[i + 1];
                    pattern[i + 1] = GLOBSTAR;
                }
            });
            return pattern.filter((p)=>p !== GLOBSTAR).join('/');
        }).join('|');
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^(?:' + re + ')$';
        // can match anything, as long as it's not this.
        if (this.negate) re = '^(?!' + re + ').*$';
        try {
            this.regexp = new RegExp(re, flags);
        } catch (ex) /* istanbul ignore next - should be impossible */ {
            this.regexp = false;
        }
        return this.regexp;
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) return false;
        if (this.empty) return f === '';
        if (f === '/' && partial) return true;
        const options = this.options;
        // windows: need to use /, not \
        if (path.sep !== '/') {
            f = f.split(path.sep).join('/');
        }
        // treat the test path as a set of pathparts.
        f = f.split(slashSplit);
        this.debug(this.pattern, 'split', f);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename;
        for(let i = f.length - 1; i >= 0; i--){
            filename = f[i];
            if (filename) break;
        }
        for(let i = 0; i < set.length; i++){
            const pattern = set[i];
            let file = f;
            if (options.matchBase && pattern.length === 1) {
                file = [
                    filename
                ];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) return true;
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) return false;
        return this.negate;
    }
    static defaults(def) {
        return minimatch.defaults(def).Minimatch;
    }
}
minimatch.Minimatch = Minimatch;
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/assert-valid-pattern.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assertValidPattern = void 0;
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern)=>{
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};
exports.assertValidPattern = assertValidPattern; //# sourceMappingURL=assert-valid-pattern.js.map
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/brace-expressions.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// translate the various posix character classes into unicode properties
// this works across all unicode locales
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseClass = void 0;
// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses = {
    '[:alnum:]': [
        '\\p{L}\\p{Nl}\\p{Nd}',
        true
    ],
    '[:alpha:]': [
        '\\p{L}\\p{Nl}',
        true
    ],
    '[:ascii:]': [
        '\\x' + '00-\\x' + '7f',
        false
    ],
    '[:blank:]': [
        '\\p{Zs}\\t',
        true
    ],
    '[:cntrl:]': [
        '\\p{Cc}',
        true
    ],
    '[:digit:]': [
        '\\p{Nd}',
        true
    ],
    '[:graph:]': [
        '\\p{Z}\\p{C}',
        true,
        true
    ],
    '[:lower:]': [
        '\\p{Ll}',
        true
    ],
    '[:print:]': [
        '\\p{C}',
        true
    ],
    '[:punct:]': [
        '\\p{P}',
        true
    ],
    '[:space:]': [
        '\\p{Z}\\t\\r\\n\\v\\f',
        true
    ],
    '[:upper:]': [
        '\\p{Lu}',
        true
    ],
    '[:word:]': [
        '\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}',
        true
    ],
    '[:xdigit:]': [
        'A-Fa-f0-9',
        false
    ]
};
// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s)=>s.replace(/[[\]\\-]/g, '\\$&');
// escape all regexp magic characters
const regexpEscape = (s)=>s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// everything has already been escaped, we just have to join
const rangesToString = (ranges)=>ranges.join('');
// takes a glob string at a posix brace expression, and returns
// an equivalent regular expression source, and boolean indicating
// whether the /u flag needs to be applied, and the number of chars
// consumed to parse the character class.
// This also removes out of order ranges, and returns ($.) if the
// entire class just no good.
const parseClass = (glob, position)=>{
    const pos = position;
    /* c8 ignore start */ if (glob.charAt(pos) !== '[') {
        throw new Error('not in a brace expression');
    }
    /* c8 ignore stop */ const ranges = [];
    const negs = [];
    let i = pos + 1;
    let sawStart = false;
    let uflag = false;
    let escaping = false;
    let negate = false;
    let endPos = pos;
    let rangeStart = '';
    WHILE: while(i < glob.length){
        const c = glob.charAt(i);
        if ((c === '!' || c === '^') && i === pos + 1) {
            negate = true;
            i++;
            continue;
        }
        if (c === ']' && sawStart && !escaping) {
            endPos = i + 1;
            break;
        }
        sawStart = true;
        if (c === '\\') {
            if (!escaping) {
                escaping = true;
                i++;
                continue;
            }
        // escaped \ char, fall through and treat like normal char
        }
        if (c === '[' && !escaping) {
            // either a posix class, a collation equivalent, or just a [
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)){
                if (glob.startsWith(cls, i)) {
                    // invalid, [a-[] is fine, but not [a-[:alpha]]
                    if (rangeStart) {
                        return [
                            '$.',
                            false,
                            glob.length - pos,
                            true
                        ];
                    }
                    i += cls.length;
                    if (neg) negs.push(unip);
                    else ranges.push(unip);
                    uflag = uflag || u;
                    continue WHILE;
                }
            }
        }
        // now it's just a normal character, effectively
        escaping = false;
        if (rangeStart) {
            // throw this range away if it's not valid, but others
            // can still match.
            if (c > rangeStart) {
                ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c));
            } else if (c === rangeStart) {
                ranges.push(braceEscape(c));
            }
            rangeStart = '';
            i++;
            continue;
        }
        // now might be the start of a range.
        // can be either c-d or c-] or c<more...>] or c] at this point
        if (glob.startsWith('-]', i + 1)) {
            ranges.push(braceEscape(c + '-'));
            i += 2;
            continue;
        }
        if (glob.startsWith('-', i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
        }
        // not the start of a range, just a single character
        ranges.push(braceEscape(c));
        i++;
    }
    if (endPos < i) {
        // didn't see the end of the class, not a valid class,
        // but might still be valid as a literal match.
        return [
            '',
            false,
            0,
            false
        ];
    }
    // if we got no ranges and no negates, then we have a range that
    // cannot possibly match anything, and that poisons the whole glob
    if (!ranges.length && !negs.length) {
        return [
            '$.',
            false,
            glob.length - pos,
            true
        ];
    }
    // if we got one positive range, and it's a single character, then that's
    // not actually a magic pattern, it's just that one literal character.
    // we should not treat that as "magic", we should just return the literal
    // character. [_] is a perfectly valid way to escape glob magic chars.
    if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [
            regexpEscape(r),
            false,
            endPos - pos,
            false
        ];
    }
    const sranges = '[' + (negate ? '^' : '') + rangesToString(ranges) + ']';
    const snegs = '[' + (negate ? '' : '^') + rangesToString(negs) + ']';
    const comb = ranges.length && negs.length ? '(' + sranges + '|' + snegs + ')' : ranges.length ? sranges : snegs;
    return [
        comb,
        uflag,
        endPos - pos,
        true
    ];
};
exports.parseClass = parseClass; //# sourceMappingURL=brace-expressions.js.map
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unescape = void 0;
/**
 * Un-escape a string that has been escaped with {@link escape}.
 *
 * If the {@link windowsPathsNoEscape} option is used, then square-brace
 * escapes are removed, but not backslash escapes.  For example, it will turn
 * the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
 * becuase `\` is a path separator in `windowsPathsNoEscape` mode.
 *
 * When `windowsPathsNoEscape` is not set, then both brace escapes and
 * backslash escapes are removed.
 *
 * Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
 * or unescaped.
 */ const unescape = (s, { windowsPathsNoEscape = false } = {})=>{
    return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, '$1') : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2').replace(/\\([^\/])/g, '$1');
};
exports.unescape = unescape; //# sourceMappingURL=unescape.js.map
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/ast.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// parse a single path portion
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AST = void 0;
const brace_expressions_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/brace-expressions.js [app-route] (ecmascript)");
const unescape_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js [app-route] (ecmascript)");
const types = new Set([
    '!',
    '?',
    '+',
    '*',
    '@'
]);
const isExtglobType = (c)=>types.has(c);
const isExtglobAST = (c)=>isExtglobType(c.type);
const adoptionMap = new Map([
    [
        '!',
        [
            '@'
        ]
    ],
    [
        '?',
        [
            '?',
            '@'
        ]
    ],
    [
        '@',
        [
            '@'
        ]
    ],
    [
        '*',
        [
            '*',
            '+',
            '?',
            '@'
        ]
    ],
    [
        '+',
        [
            '+',
            '@'
        ]
    ]
]);
const adoptionWithSpaceMap = new Map([
    [
        '!',
        [
            '?'
        ]
    ],
    [
        '@',
        [
            '?'
        ]
    ],
    [
        '+',
        [
            '?',
            '*'
        ]
    ]
]);
const adoptionAnyMap = new Map([
    [
        '!',
        [
            '?',
            '@'
        ]
    ],
    [
        '?',
        [
            '?',
            '@'
        ]
    ],
    [
        '@',
        [
            '?',
            '@'
        ]
    ],
    [
        '*',
        [
            '*',
            '+',
            '?',
            '@'
        ]
    ],
    [
        '+',
        [
            '+',
            '@',
            '?',
            '*'
        ]
    ]
]);
const usurpMap = new Map([
    [
        '!',
        new Map([
            [
                '!',
                '@'
            ]
        ])
    ],
    [
        '?',
        new Map([
            [
                '*',
                '*'
            ],
            [
                '+',
                '*'
            ]
        ])
    ],
    [
        '@',
        new Map([
            [
                '!',
                '!'
            ],
            [
                '?',
                '?'
            ],
            [
                '@',
                '@'
            ],
            [
                '*',
                '*'
            ],
            [
                '+',
                '+'
            ]
        ])
    ],
    [
        '+',
        new Map([
            [
                '?',
                '*'
            ],
            [
                '*',
                '*'
            ]
        ])
    ]
]);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set([
    '[',
    '.'
]);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set([
    '..',
    '.'
]);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape = (s)=>s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    constructor(type, parent, options = {}){
        this.type = type;
        // extglobs are inherently magical
        if (type) this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs) this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */ if (this.#hasMagic !== undefined) return this.#hasMagic;
        /* c8 ignore stop */ for (const p of this.#parts){
            if (typeof p === 'string') continue;
            if (p.type || p.hasMagic) return this.#hasMagic = true;
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined) return this.#toString;
        if (!this.type) {
            return this.#toString = this.#parts.map((p)=>String(p)).join('');
        } else {
            return this.#toString = this.type + '(' + this.#parts.map((p)=>String(p)).join('|') + ')';
        }
    }
    #fillNegs() {
        /* c8 ignore start */ if (this !== this.#root) throw new Error('should only call on root');
        if (this.#filledNegs) return this;
        /* c8 ignore stop */ // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while(n = this.#negs.pop()){
            if (n.type !== '!') continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while(pp){
                for(let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++){
                    for (const part of n.#parts){
                        /* c8 ignore start */ if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */ part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts){
            if (p === '') continue;
            /* c8 ignore start */ if (typeof p !== 'string' && !(p instanceof _a && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */ this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null ? this.#parts.slice().map((p)=>typeof p === 'string' ? p : p.toJSON()) : [
            this.type,
            ...this.#parts.map((p)=>p.toJSON())
        ];
        if (this.isStart() && !this.type) ret.unshift([]);
        if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === '!')) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this) return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart()) return false;
        if (this.#parentIndex === 0) return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for(let i = 0; i < this.#parentIndex; i++){
            const pp = p.#parts[i];
            if (!(pp instanceof _a && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this) return true;
        if (this.#parent?.type === '!') return true;
        if (!this.#parent?.isEnd()) return false;
        if (!this.type) return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */ const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */ return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string') this.push(part);
        else this.push(part.clone(this));
    }
    clone(parent) {
        const c = new _a(this.type, parent);
        for (const p of this.#parts){
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt, extDepth) {
        const maxDepth = opt.maxExtglobRecursion ?? 2;
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while(i < str.length){
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    } else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                } else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i) === '(' && extDepth <= maxDepth;
                if (doRecurse) {
                    ast.push(acc);
                    acc = '';
                    const ext = new _a(c, ast);
                    i = _a.#parseAST(str, ext, i, opt, extDepth + 1);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new _a(null, ast);
        const parts = [];
        let acc = '';
        while(i < str.length){
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                } else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            } else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            const doRecurse = isExtglobType(c) && str.charAt(i) === '(' && /* c8 ignore start - the maxDepth is sufficient here */ (extDepth <= maxDepth || ast && ast.#canAdoptType(c));
            /* c8 ignore stop */ if (doRecurse) {
                const depthAdd = ast && ast.#canAdoptType(c) ? 0 : 1;
                part.push(acc);
                acc = '';
                const ext = new _a(c, part);
                part.push(ext);
                i = _a.#parseAST(str, ext, i, opt, extDepth + depthAdd);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new _a(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [
            str.substring(pos - 1)
        ];
        return i;
    }
    #canAdoptWithSpace(child) {
        return this.#canAdopt(child, adoptionWithSpaceMap);
    }
    #canAdopt(child, map = adoptionMap) {
        if (!child || typeof child !== 'object' || child.type !== null || child.#parts.length !== 1 || this.type === null) {
            return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== 'object' || gc.type === null) {
            return false;
        }
        return this.#canAdoptType(gc.type, map);
    }
    #canAdoptType(c, map = adoptionAnyMap) {
        return !!map.get(this.type)?.includes(c);
    }
    #adoptWithSpace(child, index) {
        const gc = child.#parts[0];
        const blank = new _a(null, gc, this.options);
        blank.#parts.push('');
        gc.push(blank);
        this.#adopt(child, index);
    }
    #adopt(child, index) {
        const gc = child.#parts[0];
        this.#parts.splice(index, 1, ...gc.#parts);
        for (const p of gc.#parts){
            if (typeof p === 'object') p.#parent = this;
        }
        this.#toString = undefined;
    }
    #canUsurpType(c) {
        const m = usurpMap.get(this.type);
        return !!m?.has(c);
    }
    #canUsurp(child) {
        if (!child || typeof child !== 'object' || child.type !== null || child.#parts.length !== 1 || this.type === null || this.#parts.length !== 1) {
            return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== 'object' || gc.type === null) {
            return false;
        }
        return this.#canUsurpType(gc.type);
    }
    #usurp(child) {
        const m = usurpMap.get(this.type);
        const gc = child.#parts[0];
        const nt = m?.get(gc.type);
        /* c8 ignore start - impossible */ if (!nt) return false;
        /* c8 ignore stop */ this.#parts = gc.#parts;
        for (const p of this.#parts){
            if (typeof p === 'object') p.#parent = this;
        }
        this.type = nt;
        this.#toString = undefined;
        this.#emptyExt = false;
    }
    #flatten() {
        if (!isExtglobAST(this)) {
            for (const p of this.#parts){
                if (typeof p === 'object') p.#flatten();
            }
        } else {
            let iterations = 0;
            let done = false;
            do {
                done = true;
                for(let i = 0; i < this.#parts.length; i++){
                    const c = this.#parts[i];
                    if (typeof c === 'object') {
                        c.#flatten();
                        if (this.#canAdopt(c)) {
                            done = false;
                            this.#adopt(c, i);
                        } else if (this.#canAdoptWithSpace(c)) {
                            done = false;
                            this.#adoptWithSpace(c, i);
                        } else if (this.#canUsurp(c)) {
                            done = false;
                            this.#usurp(c);
                        }
                    }
                }
            }while (!done && ++iterations < 10)
        }
        this.#toString = undefined;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new _a(null, undefined, options);
        _a.#parseAST(pattern, ast, 0, options, 0);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */ if (this !== this.#root) return this.#root.toMMPattern();
        /* c8 ignore stop */ const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob.toUpperCase() !== glob.toLowerCase();
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob
        });
    }
    get options() {
        return this.#options;
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this) {
            this.#flatten();
            this.#fillNegs();
        }
        if (!isExtglobAST(this)) {
            const noEmpty = this.isStart() && this.isEnd();
            const src = this.#parts.map((p)=>{
                const [re, _, hasMagic, uflag] = typeof p === 'string' ? _a.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            }).join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:true is set.
                    const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
                    if (!dotTravAllowed) {
                        const aps = addPatternStart;
                        // check if we have a possibility of matching . or ..,
                        // and prevent that.
                        const needNoTrav = // dots are allowed, and the pattern starts with [ or .
                        dot && aps.has(src.charAt(0)) || src.startsWith('\\.') && aps.has(src.charAt(2)) || src.startsWith('\\.\\.') && aps.has(src.charAt(4));
                        // no need to prevent dots if it can't match a dot, or if a
                        // sub-pattern will be preventing it anyway.
                        const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                        start = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : '';
                    }
                }
            }
            // append the "end of path portion" pattern to negation tails
            let end = '';
            if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === '!') {
                end = '(?:$|\\/)';
            }
            const final = start + src + end;
            return [
                final,
                (0, unescape_js_1.unescape)(src),
                this.#hasMagic = !!this.#hasMagic,
                this.#uflag
            ];
        }
        // We need to calculate the body *twice* if it's a repeat pattern
        // at the start, once in nodot mode, then again in dot mode, so a
        // pattern like *(?) can match 'x.y'
        const repeated = this.type === '*' || this.type === '+';
        // some kind of extglob
        const start = this.type === '!' ? '(?:(?!(?:' : '(?:';
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== '!') {
            // invalid extglob, has to at least be *something* present, if it's
            // the entire path portion.
            const s = this.toString();
            const me = this;
            me.#parts = [
                s
            ];
            me.type = null;
            me.#hasMagic = undefined;
            return [
                s,
                (0, unescape_js_1.unescape)(this.toString()),
                false,
                false
            ];
        }
        // XXX abstract out this map method
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? '' : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
            bodyDotAllowed = '';
        }
        if (bodyDotAllowed) {
            body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        // an empty !() is exactly equivalent to a starNoEmpty
        let final = '';
        if (this.type === '!' && this.#emptyExt) {
            final = (this.isStart() && !dot ? startNoDot : '') + starNoEmpty;
        } else {
            const close = this.type === '!' ? '))' + (this.isStart() && !dot && !allowDot ? startNoDot : '') + star + ')' : this.type === '@' ? ')' : this.type === '?' ? ')?' : this.type === '+' && bodyDotAllowed ? ')' : this.type === '*' && bodyDotAllowed ? `)?` : `)${this.type}`;
            final = start + body + close;
        }
        return [
            final,
            (0, unescape_js_1.unescape)(body),
            this.#hasMagic = !!this.#hasMagic,
            this.#uflag
        ];
    }
    #partsToRegExp(dot) {
        return this.#parts.map((p)=>{
            // extglob ASTs should only contain parent ASTs
            /* c8 ignore start */ if (typeof p === 'string') {
                throw new Error('string type in extglob ast??');
            }
            /* c8 ignore stop */ // can ignore hasMagic, because extglobs are already always magic
            const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
            this.#uflag = this.#uflag || uflag;
            return re;
        }).filter((p)=>!(this.isStart() && this.isEnd()) || !!p).join('|');
    }
    static #parseGlob(glob, hasMagic, noEmpty = false) {
        let escaping = false;
        let re = '';
        let uflag = false;
        // multiple stars that aren't globstars coalesce into one *
        let inStar = false;
        for(let i = 0; i < glob.length; i++){
            const c = glob.charAt(i);
            if (escaping) {
                escaping = false;
                re += (reSpecials.has(c) ? '\\' : '') + c;
                inStar = false;
                continue;
            }
            if (c === '\\') {
                if (i === glob.length - 1) {
                    re += '\\\\';
                } else {
                    escaping = true;
                }
                continue;
            }
            if (c === '[') {
                const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
                if (consumed) {
                    re += src;
                    uflag = uflag || needUflag;
                    i += consumed - 1;
                    hasMagic = hasMagic || magic;
                    inStar = false;
                    continue;
                }
            }
            if (c === '*') {
                if (inStar) continue;
                inStar = true;
                re += noEmpty && /^[*]+$/.test(glob) ? starNoEmpty : star;
                hasMagic = true;
                continue;
            } else {
                inStar = false;
            }
            if (c === '?') {
                re += qmark;
                hasMagic = true;
                continue;
            }
            re += regExpEscape(c);
        }
        return [
            re,
            (0, unescape_js_1.unescape)(glob),
            !!hasMagic,
            uflag
        ];
    }
}
exports.AST = AST;
_a = AST; //# sourceMappingURL=ast.js.map
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/escape.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escape = void 0;
/**
 * Escape all magic characters in a glob pattern.
 *
 * If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
 * option is used, then characters are escaped by wrapping in `[]`, because
 * a magic character wrapped in a character class can only be satisfied by
 * that exact character.  In this mode, `\` is _not_ escaped, because it is
 * not interpreted as a magic character, but instead as a path separator.
 */ const escape = (s, { windowsPathsNoEscape = false } = {})=>{
    // don't need to escape +@! because we escape the parens
    // that make those magic, and escaping ! as [!] isn't valid,
    // because [!]] is a valid glob class meaning not ']'.
    return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, '[$&]') : s.replace(/[?*()[\]\\]/g, '\\$&');
};
exports.escape = escape; //# sourceMappingURL=escape.js.map
}),
"[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unescape = exports.escape = exports.AST = exports.Minimatch = exports.match = exports.makeRe = exports.braceExpand = exports.defaults = exports.filter = exports.GLOBSTAR = exports.sep = exports.minimatch = void 0;
const brace_expansion_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/glob/node_modules/brace-expansion/index.js [app-route] (ecmascript)"));
const assert_valid_pattern_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/assert-valid-pattern.js [app-route] (ecmascript)");
const ast_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/ast.js [app-route] (ecmascript)");
const escape_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/escape.js [app-route] (ecmascript)");
const unescape_js_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js [app-route] (ecmascript)");
const minimatch = (p, pattern, options = {})=>{
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
exports.minimatch = minimatch;
// Optimized checking for the most common glob patterns.
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext)=>(f)=>!f.startsWith('.') && f.endsWith(ext);
const starDotExtTestDot = (ext)=>(f)=>f.endsWith(ext);
const starDotExtTestNocase = (ext)=>{
    ext = ext.toLowerCase();
    return (f)=>!f.startsWith('.') && f.toLowerCase().endsWith(ext);
};
const starDotExtTestNocaseDot = (ext)=>{
    ext = ext.toLowerCase();
    return (f)=>f.toLowerCase().endsWith(ext);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f)=>!f.startsWith('.') && f.includes('.');
const starDotStarTestDot = (f)=>f !== '.' && f !== '..' && f.includes('.');
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f)=>f !== '.' && f !== '..' && f.startsWith('.');
const starRE = /^\*+$/;
const starTest = (f)=>f.length !== 0 && !f.startsWith('.');
const starTestDot = (f)=>f.length !== 0 && f !== '.' && f !== '..';
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext = ''])=>{
    const noext = qmarksTestNoExt([
        $0
    ]);
    if (!ext) return noext;
    ext = ext.toLowerCase();
    return (f)=>noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestNocaseDot = ([$0, ext = ''])=>{
    const noext = qmarksTestNoExtDot([
        $0
    ]);
    if (!ext) return noext;
    ext = ext.toLowerCase();
    return (f)=>noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestDot = ([$0, ext = ''])=>{
    const noext = qmarksTestNoExtDot([
        $0
    ]);
    return !ext ? noext : (f)=>noext(f) && f.endsWith(ext);
};
const qmarksTest = ([$0, ext = ''])=>{
    const noext = qmarksTestNoExt([
        $0
    ]);
    return !ext ? noext : (f)=>noext(f) && f.endsWith(ext);
};
const qmarksTestNoExt = ([$0])=>{
    const len = $0.length;
    return (f)=>f.length === len && !f.startsWith('.');
};
const qmarksTestNoExtDot = ([$0])=>{
    const len = $0.length;
    return (f)=>f.length === len && f !== '.' && f !== '..';
};
/* c8 ignore start */ const defaultPlatform = typeof process === 'object' && process ? typeof process.env === 'object' && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : 'posix';
const path = {
    win32: {
        sep: '\\'
    },
    posix: {
        sep: '/'
    }
};
/* c8 ignore stop */ exports.sep = defaultPlatform === 'win32' ? path.win32.sep : path.posix.sep;
exports.minimatch.sep = exports.sep;
exports.GLOBSTAR = Symbol('globstar **');
exports.minimatch.GLOBSTAR = exports.GLOBSTAR;
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?';
const filter = (pattern, options = {})=>(p)=>(0, exports.minimatch)(p, pattern, options);
exports.filter = filter;
exports.minimatch.filter = exports.filter;
const ext = (a, b = {})=>Object.assign({}, a, b);
const defaults = (def)=>{
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return exports.minimatch;
    }
    const orig = exports.minimatch;
    const m = (p, pattern, options = {})=>orig(p, pattern, ext(def, options));
    return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
            constructor(pattern, options = {}){
                super(pattern, ext(def, options));
            }
            static defaults(options) {
                return orig.defaults(ext(def, options)).Minimatch;
            }
        },
        AST: class AST extends orig.AST {
            /* c8 ignore start */ constructor(type, parent, options = {}){
                super(type, parent, ext(def, options));
            }
            /* c8 ignore stop */ static fromGlob(pattern, options = {}) {
                return orig.AST.fromGlob(pattern, ext(def, options));
            }
        },
        unescape: (s, options = {})=>orig.unescape(s, ext(def, options)),
        escape: (s, options = {})=>orig.escape(s, ext(def, options)),
        filter: (pattern, options = {})=>orig.filter(pattern, ext(def, options)),
        defaults: (options)=>orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {})=>orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {})=>orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {})=>orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports.GLOBSTAR
    });
};
exports.defaults = defaults;
exports.minimatch.defaults = exports.defaults;
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
const braceExpand = (pattern, options = {})=>{
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [
            pattern
        ];
    }
    return (0, brace_expansion_1.default)(pattern);
};
exports.braceExpand = braceExpand;
exports.minimatch.braceExpand = exports.braceExpand;
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const makeRe = (pattern, options = {})=>new Minimatch(pattern, options).makeRe();
exports.makeRe = makeRe;
exports.minimatch.makeRe = exports.makeRe;
const match = (list, pattern, options = {})=>{
    const mm = new Minimatch(pattern, options);
    list = list.filter((f)=>mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
exports.match = match;
exports.minimatch.match = exports.match;
// replace stuff like \* with *
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s)=>s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
class Minimatch {
    options;
    set;
    pattern;
    windowsPathsNoEscape;
    nonegate;
    negate;
    comment;
    empty;
    preserveMultipleSlashes;
    partial;
    globSet;
    globParts;
    nocase;
    isWindows;
    platform;
    windowsNoMagicRoot;
    maxGlobstarRecursion;
    regexp;
    constructor(pattern, options = {}){
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        options = options || {};
        this.options = options;
        this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? 200;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === 'win32';
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot = options.windowsNoMagicRoot !== undefined ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        // make the set of regexps etc.
        this.make();
    }
    hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
            return true;
        }
        for (const pattern of this.set){
            for (const part of pattern){
                if (typeof part !== 'string') return true;
            }
        }
        return false;
    }
    debug(..._) {}
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        this.globSet = [
            ...new Set(this.braceExpand())
        ];
        if (options.debug) {
            this.debug = (...args)=>console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        // step 3: now we have a set, so turn each one into a series of
        // path-portion matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        //
        // First, we preprocess to make the glob pattern sets a bit simpler
        // and deduped.  There are some perf-killing patterns that can cause
        // problems with a glob walk, but we can simplify them down a bit.
        const rawGlobParts = this.globSet.map((s)=>this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        // glob --> regexps
        let set = this.globParts.map((s, _, __)=>{
            if (this.isWindows && this.windowsNoMagicRoot) {
                // check if it's a drive or unc path.
                const isUNC = s[0] === '' && s[1] === '' && (s[2] === '?' || !globMagic.test(s[2])) && !globMagic.test(s[3]);
                const isDrive = /^[a-z]:/i.test(s[0]);
                if (isUNC) {
                    return [
                        ...s.slice(0, 4),
                        ...s.slice(4).map((ss)=>this.parse(ss))
                    ];
                } else if (isDrive) {
                    return [
                        s[0],
                        ...s.slice(1).map((ss)=>this.parse(ss))
                    ];
                }
            }
            return s.map((ss)=>this.parse(ss));
        });
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        this.set = set.filter((s)=>s.indexOf(false) === -1);
        // do not treat the ? in UNC paths as magic
        if (this.isWindows) {
            for(let i = 0; i < this.set.length; i++){
                const p = this.set[i];
                if (p[0] === '' && p[1] === '' && this.globParts[i][2] === '?' && typeof p[3] === 'string' && /^[a-z]:$/i.test(p[3])) {
                    p[2] = '?';
                }
            }
        }
        this.debug(this.pattern, this.set);
    }
    // various transforms to equivalent pattern sets that are
    // faster to process in a filesystem walk.  The goal is to
    // eliminate what we can, and push all ** patterns as far
    // to the right as possible, even if it increases the number
    // of patterns that we have to process.
    preprocess(globParts) {
        // if we're not in globstar mode, then turn all ** into *
        if (this.options.noglobstar) {
            for(let i = 0; i < globParts.length; i++){
                for(let j = 0; j < globParts[i].length; j++){
                    if (globParts[i][j] === '**') {
                        globParts[i][j] = '*';
                    }
                }
            }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            // aggressive optimization for the purpose of fs walking
            globParts = this.firstPhasePreProcess(globParts);
            globParts = this.secondPhasePreProcess(globParts);
        } else if (optimizationLevel >= 1) {
            // just basic optimizations to remove some .. parts
            globParts = this.levelOneOptimize(globParts);
        } else {
            // just collapse multiple ** portions into one
            globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
    }
    // just get rid of adjascent ** portions
    adjascentGlobstarOptimize(globParts) {
        return globParts.map((parts)=>{
            let gs = -1;
            while(-1 !== (gs = parts.indexOf('**', gs + 1))){
                let i = gs;
                while(parts[i + 1] === '**'){
                    i++;
                }
                if (i !== gs) {
                    parts.splice(gs, i - gs);
                }
            }
            return parts;
        });
    }
    // get rid of adjascent ** and resolve .. portions
    levelOneOptimize(globParts) {
        return globParts.map((parts)=>{
            parts = parts.reduce((set, part)=>{
                const prev = set[set.length - 1];
                if (part === '**' && prev === '**') {
                    return set;
                }
                if (part === '..') {
                    if (prev && prev !== '..' && prev !== '.' && prev !== '**') {
                        set.pop();
                        return set;
                    }
                }
                set.push(part);
                return set;
            }, []);
            return parts.length === 0 ? [
                ''
            ] : parts;
        });
    }
    levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
            parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/<e>/<rest> -> <pre>/<rest>
            if (!this.preserveMultipleSlashes) {
                for(let i = 1; i < parts.length - 1; i++){
                    const p = parts[i];
                    // don't squeeze out UNC patterns
                    if (i === 1 && p === '' && parts[0] === '') continue;
                    if (p === '.' || p === '') {
                        didSomething = true;
                        parts.splice(i, 1);
                        i--;
                    }
                }
                if (parts[0] === '.' && parts.length === 2 && (parts[1] === '.' || parts[1] === '')) {
                    didSomething = true;
                    parts.pop();
                }
            }
            // <pre>/<p>/../<rest> -> <pre>/<rest>
            let dd = 0;
            while(-1 !== (dd = parts.indexOf('..', dd + 1))){
                const p = parts[dd - 1];
                if (p && p !== '.' && p !== '..' && p !== '**') {
                    didSomething = true;
                    parts.splice(dd - 1, 2);
                    dd -= 2;
                }
            }
        }while (didSomething)
        return parts.length === 0 ? [
            ''
        ] : parts;
    }
    // First phase: single-pattern processing
    // <pre> is 1 or more portions
    // <rest> is 1 or more portions
    // <p> is any portion other than ., .., '', or **
    // <e> is . or ''
    //
    // **/.. is *brutal* for filesystem walking performance, because
    // it effectively resets the recursive walk each time it occurs,
    // and ** cannot be reduced out by a .. pattern part like a regexp
    // or most strings (other than .., ., and '') can be.
    //
    // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
    // <pre>/<e>/<rest> -> <pre>/<rest>
    // <pre>/<p>/../<rest> -> <pre>/<rest>
    // **/**/<rest> -> **/<rest>
    //
    // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
    // this WOULD be allowed if ** did follow symlinks, or * didn't
    firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
            for (let parts of globParts){
                let gs = -1;
                while(-1 !== (gs = parts.indexOf('**', gs + 1))){
                    let gss = gs;
                    while(parts[gss + 1] === '**'){
                        // <pre>/**/**/<rest> -> <pre>/**/<rest>
                        gss++;
                    }
                    // eg, if gs is 2 and gss is 4, that means we have 3 **
                    // parts, and can remove 2 of them.
                    if (gss > gs) {
                        parts.splice(gs + 1, gss - gs);
                    }
                    let next = parts[gs + 1];
                    const p = parts[gs + 2];
                    const p2 = parts[gs + 3];
                    if (next !== '..') continue;
                    if (!p || p === '.' || p === '..' || !p2 || p2 === '.' || p2 === '..') {
                        continue;
                    }
                    didSomething = true;
                    // edit parts in place, and push the new one
                    parts.splice(gs, 1);
                    const other = parts.slice(0);
                    other[gs] = '**';
                    globParts.push(other);
                    gs--;
                }
                // <pre>/<e>/<rest> -> <pre>/<rest>
                if (!this.preserveMultipleSlashes) {
                    for(let i = 1; i < parts.length - 1; i++){
                        const p = parts[i];
                        // don't squeeze out UNC patterns
                        if (i === 1 && p === '' && parts[0] === '') continue;
                        if (p === '.' || p === '') {
                            didSomething = true;
                            parts.splice(i, 1);
                            i--;
                        }
                    }
                    if (parts[0] === '.' && parts.length === 2 && (parts[1] === '.' || parts[1] === '')) {
                        didSomething = true;
                        parts.pop();
                    }
                }
                // <pre>/<p>/../<rest> -> <pre>/<rest>
                let dd = 0;
                while(-1 !== (dd = parts.indexOf('..', dd + 1))){
                    const p = parts[dd - 1];
                    if (p && p !== '.' && p !== '..' && p !== '**') {
                        didSomething = true;
                        const needDot = dd === 1 && parts[dd + 1] === '**';
                        const splin = needDot ? [
                            '.'
                        ] : [];
                        parts.splice(dd - 1, 2, ...splin);
                        if (parts.length === 0) parts.push('');
                        dd -= 2;
                    }
                }
            }
        }while (didSomething)
        return globParts;
    }
    // second phase: multi-pattern dedupes
    // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
    // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
    // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
    //
    // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
    // ^-- not valid because ** doens't follow symlinks
    secondPhasePreProcess(globParts) {
        for(let i = 0; i < globParts.length - 1; i++){
            for(let j = i + 1; j < globParts.length; j++){
                const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
                if (matched) {
                    globParts[i] = [];
                    globParts[j] = matched;
                    break;
                }
            }
        }
        return globParts.filter((gs)=>gs.length);
    }
    partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = '';
        while(ai < a.length && bi < b.length){
            if (a[ai] === b[bi]) {
                result.push(which === 'b' ? b[bi] : a[ai]);
                ai++;
                bi++;
            } else if (emptyGSMatch && a[ai] === '**' && b[bi] === a[ai + 1]) {
                result.push(a[ai]);
                ai++;
            } else if (emptyGSMatch && b[bi] === '**' && a[ai] === b[bi + 1]) {
                result.push(b[bi]);
                bi++;
            } else if (a[ai] === '*' && b[bi] && (this.options.dot || !b[bi].startsWith('.')) && b[bi] !== '**') {
                if (which === 'b') return false;
                which = 'a';
                result.push(a[ai]);
                ai++;
                bi++;
            } else if (b[bi] === '*' && a[ai] && (this.options.dot || !a[ai].startsWith('.')) && a[ai] !== '**') {
                if (which === 'a') return false;
                which = 'b';
                result.push(b[bi]);
                ai++;
                bi++;
            } else {
                return false;
            }
        }
        // if we fall out of the loop, it means they two are identical
        // as long as their lengths match
        return a.length === b.length && result;
    }
    parseNegate() {
        if (this.nonegate) return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for(let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++){
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset) this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial = false) {
        let fileStartIndex = 0;
        let patternStartIndex = 0;
        // UNC paths like //?/X:/... can match X:/... and vice versa
        // Drive letters in absolute drive or unc paths are always compared
        // case-insensitively.
        if (this.isWindows) {
            const fileDrive = typeof file[0] === 'string' && /^[a-z]:$/i.test(file[0]);
            const fileUNC = !fileDrive && file[0] === '' && file[1] === '' && file[2] === '?' && /^[a-z]:$/i.test(file[3]);
            const patternDrive = typeof pattern[0] === 'string' && /^[a-z]:$/i.test(pattern[0]);
            const patternUNC = !patternDrive && pattern[0] === '' && pattern[1] === '' && pattern[2] === '?' && typeof pattern[3] === 'string' && /^[a-z]:$/i.test(pattern[3]);
            const fdi = fileUNC ? 3 : fileDrive ? 0 : undefined;
            const pdi = patternUNC ? 3 : patternDrive ? 0 : undefined;
            if (typeof fdi === 'number' && typeof pdi === 'number') {
                const [fd, pd] = [
                    file[fdi],
                    pattern[pdi]
                ];
                if (fd.toLowerCase() === pd.toLowerCase()) {
                    pattern[pdi] = fd;
                    patternStartIndex = pdi;
                    fileStartIndex = fdi;
                }
            }
        }
        // resolve and reduce . and .. portions in the file as well.
        // dont' need to do the second phase, because it's only one string[]
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            file = this.levelTwoFileOptimize(file);
        }
        if (pattern.includes(exports.GLOBSTAR)) {
            return this.#matchGlobstar(file, pattern, partial, fileStartIndex, patternStartIndex);
        }
        return this.#matchOne(file, pattern, partial, fileStartIndex, patternStartIndex);
    }
    #matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
        const firstgs = pattern.indexOf(exports.GLOBSTAR, patternIndex);
        const lastgs = pattern.lastIndexOf(exports.GLOBSTAR);
        const [head, body, tail] = partial ? [
            pattern.slice(patternIndex, firstgs),
            pattern.slice(firstgs + 1),
            []
        ] : [
            pattern.slice(patternIndex, firstgs),
            pattern.slice(firstgs + 1, lastgs),
            pattern.slice(lastgs + 1)
        ];
        if (head.length) {
            const fileHead = file.slice(fileIndex, fileIndex + head.length);
            if (!this.#matchOne(fileHead, head, partial, 0, 0)) return false;
            fileIndex += head.length;
        }
        let fileTailMatch = 0;
        if (tail.length) {
            if (tail.length + fileIndex > file.length) return false;
            let tailStart = file.length - tail.length;
            if (this.#matchOne(file, tail, partial, tailStart, 0)) {
                fileTailMatch = tail.length;
            } else {
                if (file[file.length - 1] !== '' || fileIndex + tail.length === file.length) {
                    return false;
                }
                tailStart--;
                if (!this.#matchOne(file, tail, partial, tailStart, 0)) return false;
                fileTailMatch = tail.length + 1;
            }
        }
        if (!body.length) {
            let sawSome = !!fileTailMatch;
            for(let i = fileIndex; i < file.length - fileTailMatch; i++){
                const f = String(file[i]);
                sawSome = true;
                if (f === '.' || f === '..' || !this.options.dot && f.startsWith('.')) {
                    return false;
                }
            }
            return partial || sawSome;
        }
        const bodySegments = [
            [
                [],
                0
            ]
        ];
        let currentBody = bodySegments[0];
        let nonGsParts = 0;
        const nonGsPartsSums = [
            0
        ];
        for (const b of body){
            if (b === exports.GLOBSTAR) {
                nonGsPartsSums.push(nonGsParts);
                currentBody = [
                    [],
                    0
                ];
                bodySegments.push(currentBody);
            } else {
                currentBody[0].push(b);
                nonGsParts++;
            }
        }
        let i = bodySegments.length - 1;
        const fileLength = file.length - fileTailMatch;
        for (const b of bodySegments){
            b[1] = fileLength - (nonGsPartsSums[i--] + b[0].length);
        }
        return !!this.#matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
    }
    #matchGlobStarBodySections(file, bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
        const bs = bodySegments[bodyIndex];
        if (!bs) {
            for(let i = fileIndex; i < file.length; i++){
                sawTail = true;
                const f = file[i];
                if (f === '.' || f === '..' || !this.options.dot && f.startsWith('.')) {
                    return false;
                }
            }
            return sawTail;
        }
        const [body, after] = bs;
        while(fileIndex <= after){
            const m = this.#matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
            if (m && globStarDepth < this.maxGlobstarRecursion) {
                const sub = this.#matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
                if (sub !== false) return sub;
            }
            const f = file[fileIndex];
            if (f === '.' || f === '..' || !this.options.dot && f.startsWith('.')) {
                return false;
            }
            fileIndex++;
        }
        return partial || null;
    }
    #matchOne(file, pattern, partial, fileIndex, patternIndex) {
        let fi;
        let pi;
        let pl;
        let fl;
        for(fi = fileIndex, pi = patternIndex, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++){
            this.debug('matchOne loop');
            let p = pattern[pi];
            let f = file[fi];
            this.debug(pattern, p, f);
            /* c8 ignore start */ if (p === false || p === exports.GLOBSTAR) return false;
            /* c8 ignore stop */ let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            } else {
                hit = p.test(f);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit) return false;
        }
        if (fi === fl && pi === pl) {
            return true;
        } else if (fi === fl) {
            return partial;
        } else if (pi === pl) {
            return fi === fl - 1 && file[fi] === '';
        /* c8 ignore start */ } else {
            throw new Error('wtf?');
        }
    /* c8 ignore stop */ }
    braceExpand() {
        return (0, exports.braceExpand)(this.pattern, this.options);
    }
    parse(pattern) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**') return exports.GLOBSTAR;
        if (pattern === '') return '';
        // far and away, the most common glob pattern parts are
        // *, *.*, and *.<ext>  Add a fast check method for those.
        let m;
        let fastTest = null;
        if (m = pattern.match(starRE)) {
            fastTest = options.dot ? starTestDot : starTest;
        } else if (m = pattern.match(starDotExtRE)) {
            fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
        } else if (m = pattern.match(qmarksRE)) {
            fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
        } else if (m = pattern.match(starDotStarRE)) {
            fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        } else if (m = pattern.match(dotStarRE)) {
            fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern, this.options).toMMPattern();
        if (fastTest && typeof re === 'object') {
            // Avoids overriding in frozen environments
            Reflect.defineProperty(re, 'test', {
                value: fastTest
            });
        }
        return re;
    }
    makeRe() {
        if (this.regexp || this.regexp === false) return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags = new Set(options.nocase ? [
            'i'
        ] : []);
        // regexpify non-globstar patterns
        // if ** is only item, then we just do one twoStar
        // if ** is first, and there are more, prepend (\/|twoStar\/)? to next
        // if ** is last, append (\/twoStar|) to previous
        // if ** is in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set.map((pattern)=>{
            const pp = pattern.map((p)=>{
                if (p instanceof RegExp) {
                    for (const f of p.flags.split(''))flags.add(f);
                }
                return typeof p === 'string' ? regExpEscape(p) : p === exports.GLOBSTAR ? exports.GLOBSTAR : p._src;
            });
            pp.forEach((p, i)=>{
                const next = pp[i + 1];
                const prev = pp[i - 1];
                if (p !== exports.GLOBSTAR || prev === exports.GLOBSTAR) {
                    return;
                }
                if (prev === undefined) {
                    if (next !== undefined && next !== exports.GLOBSTAR) {
                        pp[i + 1] = '(?:\\/|' + twoStar + '\\/)?' + next;
                    } else {
                        pp[i] = twoStar;
                    }
                } else if (next === undefined) {
                    pp[i - 1] = prev + '(?:\\/|' + twoStar + ')?';
                } else if (next !== exports.GLOBSTAR) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + '\\/)' + next;
                    pp[i + 1] = exports.GLOBSTAR;
                }
            });
            return pp.filter((p)=>p !== exports.GLOBSTAR).join('/');
        }).join('|');
        // need to wrap in parens if we had more than one thing with |,
        // otherwise only the first will be anchored to ^ and the last to $
        const [open, close] = set.length > 1 ? [
            '(?:',
            ')'
        ] : [
            '',
            ''
        ];
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^' + open + re + close + '$';
        // can match anything, as long as it's not this.
        if (this.negate) re = '^(?!' + re + ').+$';
        try {
            this.regexp = new RegExp(re, [
                ...flags
            ].join(''));
        /* c8 ignore start */ } catch (ex) {
            // should be impossible
            this.regexp = false;
        }
        /* c8 ignore stop */ return this.regexp;
    }
    slashSplit(p) {
        // if p starts with // on windows, we preserve that
        // so that UNC paths aren't broken.  Otherwise, any number of
        // / characters are coalesced into one, unless
        // preserveMultipleSlashes is set to true.
        if (this.preserveMultipleSlashes) {
            return p.split('/');
        } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
            // add an extra '' for the one we lose
            return [
                '',
                ...p.split(/\/+/)
            ];
        } else {
            return p.split(/\/+/);
        }
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) {
            return false;
        }
        if (this.empty) {
            return f === '';
        }
        if (f === '/' && partial) {
            return true;
        }
        const options = this.options;
        // windows: need to use /, not \
        if (this.isWindows) {
            f = f.split('\\').join('/');
        }
        // treat the test path as a set of pathparts.
        const ff = this.slashSplit(f);
        this.debug(this.pattern, 'split', ff);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename = ff[ff.length - 1];
        if (!filename) {
            for(let i = ff.length - 2; !filename && i >= 0; i--){
                filename = ff[i];
            }
        }
        for(let i = 0; i < set.length; i++){
            const pattern = set[i];
            let file = ff;
            if (options.matchBase && pattern.length === 1) {
                file = [
                    filename
                ];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) {
                    return true;
                }
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) {
            return false;
        }
        return this.negate;
    }
    static defaults(def) {
        return exports.minimatch.defaults(def).Minimatch;
    }
}
exports.Minimatch = Minimatch;
/* c8 ignore start */ var ast_js_2 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/ast.js [app-route] (ecmascript)");
Object.defineProperty(exports, "AST", {
    enumerable: true,
    get: function() {
        return ast_js_2.AST;
    }
});
var escape_js_2 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/escape.js [app-route] (ecmascript)");
Object.defineProperty(exports, "escape", {
    enumerable: true,
    get: function() {
        return escape_js_2.escape;
    }
});
var unescape_js_2 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js [app-route] (ecmascript)");
Object.defineProperty(exports, "unescape", {
    enumerable: true,
    get: function() {
        return unescape_js_2.unescape;
    }
});
/* c8 ignore stop */ exports.minimatch.AST = ast_js_1.AST;
exports.minimatch.Minimatch = Minimatch;
exports.minimatch.escape = escape_js_1.escape;
exports.minimatch.unescape = unescape_js_1.unescape; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/balanced-match/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = balanced;
function balanced(a, b, str) {
    if (a instanceof RegExp) a = maybeMatch(a, str);
    if (b instanceof RegExp) b = maybeMatch(b, str);
    var r = range(a, b, str);
    return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
    };
}
function maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
}
balanced.range = range;
function range(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
        if (a === b) {
            return [
                ai,
                bi
            ];
        }
        begs = [];
        left = str.length;
        while(i >= 0 && !result){
            if (i == ai) {
                begs.push(i);
                ai = str.indexOf(a, i + 1);
            } else if (begs.length == 1) {
                result = [
                    begs.pop(),
                    bi
                ];
            } else {
                beg = begs.pop();
                if (beg < left) {
                    left = beg;
                    right = bi;
                }
                bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
            result = [
                left,
                right
            ];
        }
    }
    return result;
}
}),
"[project]/node_modules/readdir-glob/node_modules/brace-expansion/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var balanced = __turbopack_context__.r("[project]/node_modules/balanced-match/index.js [app-route] (ecmascript)");
module.exports = expandTop;
var escSlash = '\0SLASH' + Math.random() + '\0';
var escOpen = '\0OPEN' + Math.random() + '\0';
var escClose = '\0CLOSE' + Math.random() + '\0';
var escComma = '\0COMMA' + Math.random() + '\0';
var escPeriod = '\0PERIOD' + Math.random() + '\0';
function numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
    return str.split('\\\\').join(escSlash).split('\\{').join(escOpen).split('\\}').join(escClose).split('\\,').join(escComma).split('\\.').join(escPeriod);
}
function unescapeBraces(str) {
    return str.split(escSlash).join('\\').split(escOpen).join('{').split(escClose).join('}').split(escComma).join(',').split(escPeriod).join('.');
}
// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
    if (!str) return [
        ''
    ];
    var parts = [];
    var m = balanced('{', '}', str);
    if (!m) return str.split(',');
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(',');
    p[p.length - 1] += '{' + body + '}';
    var postParts = parseCommaParts(post);
    if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
}
function expandTop(str) {
    if (!str) return [];
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (str.substr(0, 2) === '{}') {
        str = '\\{\\}' + str.substr(2);
    }
    return expand(escapeBraces(str), true).map(unescapeBraces);
}
function embrace(str) {
    return '{' + str + '}';
}
function isPadded(el) {
    return /^-?0\d/.test(el);
}
function lte(i, y) {
    return i <= y;
}
function gte(i, y) {
    return i >= y;
}
function expand(str, isTop) {
    var expansions = [];
    var m = balanced('{', '}', str);
    if (!m) return [
        str
    ];
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [
        ''
    ];
    if (/\$$/.test(m.pre)) {
        for(var k = 0; k < post.length; k++){
            var expansion = pre + '{' + m.body + '}' + post[k];
            expansions.push(expansion);
        }
    } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(',') >= 0;
        if (!isSequence && !isOptions) {
            // {a},b}
            if (m.post.match(/,(?!,).*\}/)) {
                str = m.pre + '{' + m.body + escClose + m.post;
                return expand(str);
            }
            return [
                str
            ];
        }
        var n;
        if (isSequence) {
            n = m.body.split(/\.\./);
        } else {
            n = parseCommaParts(m.body);
            if (n.length === 1) {
                // x{{a,b}}y ==> x{a}y x{b}y
                n = expand(n[0], false).map(embrace);
                if (n.length === 1) {
                    return post.map(function(p) {
                        return m.pre + n[0] + p;
                    });
                }
            }
        }
        // at this point, n is the parts, and we know it's not a comma set
        // with a single entry.
        var N;
        if (isSequence) {
            var x = numeric(n[0]);
            var y = numeric(n[1]);
            var width = Math.max(n[0].length, n[1].length);
            var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
            var test = lte;
            var reverse = y < x;
            if (reverse) {
                incr *= -1;
                test = gte;
            }
            var pad = n.some(isPadded);
            N = [];
            for(var i = x; test(i, y); i += incr){
                var c;
                if (isAlphaSequence) {
                    c = String.fromCharCode(i);
                    if (c === '\\') c = '';
                } else {
                    c = String(i);
                    if (pad) {
                        var need = width - c.length;
                        if (need > 0) {
                            var z = new Array(need + 1).join('0');
                            if (i < 0) c = '-' + z + c.slice(1);
                            else c = z + c;
                        }
                    }
                }
                N.push(c);
            }
        } else {
            N = [];
            for(var j = 0; j < n.length; j++){
                N.push.apply(N, expand(n[j], false));
            }
        }
        for(var j = 0; j < N.length; j++){
            for(var k = 0; k < post.length; k++){
                var expansion = pre + N[j] + post[k];
                if (!isTop || isSequence || expansion) expansions.push(expansion);
            }
        }
    }
    return expansions;
}
}),
"[project]/node_modules/glob/node_modules/brace-expansion/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var balanced = __turbopack_context__.r("[project]/node_modules/balanced-match/index.js [app-route] (ecmascript)");
module.exports = expandTop;
var escSlash = '\0SLASH' + Math.random() + '\0';
var escOpen = '\0OPEN' + Math.random() + '\0';
var escClose = '\0CLOSE' + Math.random() + '\0';
var escComma = '\0COMMA' + Math.random() + '\0';
var escPeriod = '\0PERIOD' + Math.random() + '\0';
function numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
    return str.split('\\\\').join(escSlash).split('\\{').join(escOpen).split('\\}').join(escClose).split('\\,').join(escComma).split('\\.').join(escPeriod);
}
function unescapeBraces(str) {
    return str.split(escSlash).join('\\').split(escOpen).join('{').split(escClose).join('}').split(escComma).join(',').split(escPeriod).join('.');
}
// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
    if (!str) return [
        ''
    ];
    var parts = [];
    var m = balanced('{', '}', str);
    if (!m) return str.split(',');
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(',');
    p[p.length - 1] += '{' + body + '}';
    var postParts = parseCommaParts(post);
    if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
}
function expandTop(str) {
    if (!str) return [];
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (str.substr(0, 2) === '{}') {
        str = '\\{\\}' + str.substr(2);
    }
    return expand(escapeBraces(str), true).map(unescapeBraces);
}
function embrace(str) {
    return '{' + str + '}';
}
function isPadded(el) {
    return /^-?0\d/.test(el);
}
function lte(i, y) {
    return i <= y;
}
function gte(i, y) {
    return i >= y;
}
function expand(str, isTop) {
    var expansions = [];
    var m = balanced('{', '}', str);
    if (!m) return [
        str
    ];
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [
        ''
    ];
    if (/\$$/.test(m.pre)) {
        for(var k = 0; k < post.length; k++){
            var expansion = pre + '{' + m.body + '}' + post[k];
            expansions.push(expansion);
        }
    } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(',') >= 0;
        if (!isSequence && !isOptions) {
            // {a},b}
            if (m.post.match(/,(?!,).*\}/)) {
                str = m.pre + '{' + m.body + escClose + m.post;
                return expand(str);
            }
            return [
                str
            ];
        }
        var n;
        if (isSequence) {
            n = m.body.split(/\.\./);
        } else {
            n = parseCommaParts(m.body);
            if (n.length === 1) {
                // x{{a,b}}y ==> x{a}y x{b}y
                n = expand(n[0], false).map(embrace);
                if (n.length === 1) {
                    return post.map(function(p) {
                        return m.pre + n[0] + p;
                    });
                }
            }
        }
        // at this point, n is the parts, and we know it's not a comma set
        // with a single entry.
        var N;
        if (isSequence) {
            var x = numeric(n[0]);
            var y = numeric(n[1]);
            var width = Math.max(n[0].length, n[1].length);
            var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
            var test = lte;
            var reverse = y < x;
            if (reverse) {
                incr *= -1;
                test = gte;
            }
            var pad = n.some(isPadded);
            N = [];
            for(var i = x; test(i, y); i += incr){
                var c;
                if (isAlphaSequence) {
                    c = String.fromCharCode(i);
                    if (c === '\\') c = '';
                } else {
                    c = String(i);
                    if (pad) {
                        var need = width - c.length;
                        if (need > 0) {
                            var z = new Array(need + 1).join('0');
                            if (i < 0) c = '-' + z + c.slice(1);
                            else c = z + c;
                        }
                    }
                }
                N.push(c);
            }
        } else {
            N = [];
            for(var j = 0; j < n.length; j++){
                N.push.apply(N, expand(n[j], false));
            }
        }
        for(var j = 0; j < N.length; j++){
            for(var k = 0; k < post.length; k++){
                var expansion = pre + N[j] + post[k];
                if (!isTop || isSequence || expansion) expansions.push(expansion);
            }
        }
    }
    return expansions;
}
}),
"[project]/node_modules/readdir-glob/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = readdirGlob;
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const { EventEmitter } = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const { Minimatch } = __turbopack_context__.r("[project]/node_modules/readdir-glob/node_modules/minimatch/minimatch.js [app-route] (ecmascript)");
const { resolve } = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
function readdir(dir, strict) {
    return new Promise((resolve, reject)=>{
        fs.readdir(dir, {
            withFileTypes: true
        }, (err, files)=>{
            if (err) {
                switch(err.code){
                    case 'ENOTDIR':
                        if (strict) {
                            reject(err);
                        } else {
                            resolve([]);
                        }
                        break;
                    case 'ENOTSUP':
                    case 'ENOENT':
                    case 'ENAMETOOLONG':
                    case 'UNKNOWN':
                        resolve([]);
                        break;
                    case 'ELOOP':
                    default:
                        reject(err);
                        break;
                }
            } else {
                resolve(files);
            }
        });
    });
}
function stat(file, followSymlinks) {
    return new Promise((resolve, reject)=>{
        const statFunc = followSymlinks ? fs.stat : fs.lstat;
        statFunc(file, (err, stats)=>{
            if (err) {
                switch(err.code){
                    case 'ENOENT':
                        if (followSymlinks) {
                            // Fallback to lstat to handle broken links as files
                            resolve(stat(file, false));
                        } else {
                            resolve(null);
                        }
                        break;
                    default:
                        resolve(null);
                        break;
                }
            } else {
                resolve(stats);
            }
        });
    });
}
async function* exploreWalkAsync(dir, path, followSymlinks, useStat, shouldSkip, strict) {
    let files = await readdir(path + dir, strict);
    for (const file of files){
        let name = file.name;
        if (name === undefined) {
            // undefined file.name means the `withFileTypes` options is not supported by node
            // we have to call the stat function to know if file is directory or not.
            name = file;
            useStat = true;
        }
        const filename = dir + '/' + name;
        const relative = filename.slice(1); // Remove the leading /
        const absolute = path + '/' + relative;
        let stats = null;
        if (useStat || followSymlinks) {
            stats = await stat(absolute, followSymlinks);
        }
        if (!stats && file.name !== undefined) {
            stats = file;
        }
        if (stats === null) {
            stats = {
                isDirectory: ()=>false
            };
        }
        if (stats.isDirectory()) {
            if (!shouldSkip(relative)) {
                yield {
                    relative,
                    absolute,
                    stats
                };
                yield* exploreWalkAsync(filename, path, followSymlinks, useStat, shouldSkip, false);
            }
        } else {
            yield {
                relative,
                absolute,
                stats
            };
        }
    }
}
async function* explore(path, followSymlinks, useStat, shouldSkip) {
    yield* exploreWalkAsync('', path, followSymlinks, useStat, shouldSkip, true);
}
function readOptions(options) {
    return {
        pattern: options.pattern,
        dot: !!options.dot,
        noglobstar: !!options.noglobstar,
        matchBase: !!options.matchBase,
        nocase: !!options.nocase,
        ignore: options.ignore,
        skip: options.skip,
        follow: !!options.follow,
        stat: !!options.stat,
        nodir: !!options.nodir,
        mark: !!options.mark,
        silent: !!options.silent,
        absolute: !!options.absolute
    };
}
class ReaddirGlob extends EventEmitter {
    constructor(cwd, options, cb){
        super();
        if (typeof options === 'function') {
            cb = options;
            options = null;
        }
        this.options = readOptions(options || {});
        this.matchers = [];
        if (this.options.pattern) {
            const matchers = Array.isArray(this.options.pattern) ? this.options.pattern : [
                this.options.pattern
            ];
            this.matchers = matchers.map((m)=>new Minimatch(m, {
                    dot: this.options.dot,
                    noglobstar: this.options.noglobstar,
                    matchBase: this.options.matchBase,
                    nocase: this.options.nocase
                }));
        }
        this.ignoreMatchers = [];
        if (this.options.ignore) {
            const ignorePatterns = Array.isArray(this.options.ignore) ? this.options.ignore : [
                this.options.ignore
            ];
            this.ignoreMatchers = ignorePatterns.map((ignore)=>new Minimatch(ignore, {
                    dot: true
                }));
        }
        this.skipMatchers = [];
        if (this.options.skip) {
            const skipPatterns = Array.isArray(this.options.skip) ? this.options.skip : [
                this.options.skip
            ];
            this.skipMatchers = skipPatterns.map((skip)=>new Minimatch(skip, {
                    dot: true
                }));
        }
        this.iterator = explore(resolve(cwd || '.'), this.options.follow, this.options.stat, this._shouldSkipDirectory.bind(this));
        this.paused = false;
        this.inactive = false;
        this.aborted = false;
        if (cb) {
            this._matches = [];
            this.on('match', (match)=>this._matches.push(this.options.absolute ? match.absolute : match.relative));
            this.on('error', (err)=>cb(err));
            this.on('end', ()=>cb(null, this._matches));
        }
        setTimeout(()=>this._next(), 0);
    }
    _shouldSkipDirectory(relative) {
        //console.log(relative, this.skipMatchers.some(m => m.match(relative)));
        return this.skipMatchers.some((m)=>m.match(relative));
    }
    _fileMatches(relative, isDirectory) {
        const file = relative + (isDirectory ? '/' : '');
        return (this.matchers.length === 0 || this.matchers.some((m)=>m.match(file))) && !this.ignoreMatchers.some((m)=>m.match(file)) && (!this.options.nodir || !isDirectory);
    }
    _next() {
        if (!this.paused && !this.aborted) {
            this.iterator.next().then((obj)=>{
                if (!obj.done) {
                    const isDirectory = obj.value.stats.isDirectory();
                    if (this._fileMatches(obj.value.relative, isDirectory)) {
                        let relative = obj.value.relative;
                        let absolute = obj.value.absolute;
                        if (this.options.mark && isDirectory) {
                            relative += '/';
                            absolute += '/';
                        }
                        if (this.options.stat) {
                            this.emit('match', {
                                relative,
                                absolute,
                                stat: obj.value.stats
                            });
                        } else {
                            this.emit('match', {
                                relative,
                                absolute
                            });
                        }
                    }
                    this._next(this.iterator);
                } else {
                    this.emit('end');
                }
            }).catch((err)=>{
                this.abort();
                this.emit('error', err);
                if (!err.code && !this.options.silent) {
                    console.error(err);
                }
            });
        } else {
            this.inactive = true;
        }
    }
    abort() {
        this.aborted = true;
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
        if (this.inactive) {
            this.inactive = false;
            this._next();
        }
    }
}
function readdirGlob(pattern, options, cb) {
    return new ReaddirGlob(pattern, options, cb);
}
readdirGlob.ReaddirGlob = ReaddirGlob;
}),
"[project]/node_modules/graceful-fs/polyfills.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var constants = __turbopack_context__.r("[externals]/constants [external] (constants, cjs)");
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
    if (!cwd) cwd = origCwd.call(process);
    return cwd;
};
try {
    process.cwd();
} catch (er) {}
// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
    var chdir = process.chdir;
    process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
    };
    if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}
module.exports = patch;
function patch(fs) {
    // (re-)implement some things that are known busted or missing.
    // lchmod, broken prior to 0.6.2
    // back-port the fix here.
    if (constants.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs);
    }
    // lutimes implementation, or no-op
    if (!fs.lutimes) {
        patchLutimes(fs);
    }
    // https://github.com/isaacs/node-graceful-fs/issues/4
    // Chown should not fail on einval or eperm if non-root.
    // It should not fail on enosys ever, as this just indicates
    // that a fs doesn't support the intended operation.
    fs.chown = chownFix(fs.chown);
    fs.fchown = chownFix(fs.fchown);
    fs.lchown = chownFix(fs.lchown);
    fs.chmod = chmodFix(fs.chmod);
    fs.fchmod = chmodFix(fs.fchmod);
    fs.lchmod = chmodFix(fs.lchmod);
    fs.chownSync = chownFixSync(fs.chownSync);
    fs.fchownSync = chownFixSync(fs.fchownSync);
    fs.lchownSync = chownFixSync(fs.lchownSync);
    fs.chmodSync = chmodFixSync(fs.chmodSync);
    fs.fchmodSync = chmodFixSync(fs.fchmodSync);
    fs.lchmodSync = chmodFixSync(fs.lchmodSync);
    fs.stat = statFix(fs.stat);
    fs.fstat = statFix(fs.fstat);
    fs.lstat = statFix(fs.lstat);
    fs.statSync = statFixSync(fs.statSync);
    fs.fstatSync = statFixSync(fs.fstatSync);
    fs.lstatSync = statFixSync(fs.lstatSync);
    // if lchmod/lchown do not exist, then make them no-ops
    if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchmodSync = function() {};
    }
    if (fs.chown && !fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchownSync = function() {};
    }
    // on Windows, A/V software can lock the directory, causing this
    // to fail with an EACCES or EPERM if the directory contains newly
    // created files.  Try again on failure, for up to 60 seconds.
    // Set the timeout this long because some Windows Anti-Virus, such as Parity
    // bit9, may lock files for up to a minute, causing npm package install
    // failures. Also, take care to yield the scheduler. Windows scheduling gives
    // CPU to a busy looping process, which can cause the program causing the lock
    // contention to be starved of CPU by node, so the contention doesn't resolve.
    if (platform === "win32") {
        fs.rename = typeof fs.rename !== 'function' ? fs.rename : function(fs$rename) {
            function rename(from, to, cb) {
                var start = Date.now();
                var backoff = 0;
                fs$rename(from, to, function CB(er) {
                    if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 60000) {
                        setTimeout(function() {
                            fs.stat(to, function(stater, st) {
                                if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
                                else cb(er);
                            });
                        }, backoff);
                        if (backoff < 100) backoff += 10;
                        return;
                    }
                    if (cb) cb(er);
                });
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
            return rename;
        }(fs.rename);
    }
    // if read() returns EAGAIN, then just try it again.
    fs.read = typeof fs.read !== 'function' ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
            var callback;
            if (callback_ && typeof callback_ === 'function') {
                var eagCounter = 0;
                callback = function(er, _, __) {
                    if (er && er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                    }
                    callback_.apply(this, arguments);
                };
            }
            return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        // This ensures `util.promisify` works as it does for native `fs.read`.
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
    }(fs.read);
    fs.readSync = typeof fs.readSync !== 'function' ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
            var eagCounter = 0;
            while(true){
                try {
                    return fs$readSync.call(fs, fd, buffer, offset, length, position);
                } catch (er) {
                    if (er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        continue;
                    }
                    throw er;
                }
            }
        };
    }(fs.readSync);
    function patchLchmod(fs) {
        fs.lchmod = function(path, mode, callback) {
            fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                // prefer to return the chmod error, if one occurs,
                // but still try to close, and report closing errors if they occur.
                fs.fchmod(fd, mode, function(err) {
                    fs.close(fd, function(err2) {
                        if (callback) callback(err || err2);
                    });
                });
            });
        };
        fs.lchmodSync = function(path, mode) {
            var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
            // prefer to return the chmod error, if one occurs,
            // but still try to close, and report closing errors if they occur.
            var threw = true;
            var ret;
            try {
                ret = fs.fchmodSync(fd, mode);
                threw = false;
            } finally{
                if (threw) {
                    try {
                        fs.closeSync(fd);
                    } catch (er) {}
                } else {
                    fs.closeSync(fd);
                }
            }
            return ret;
        };
    }
    function patchLutimes(fs) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
            fs.lutimes = function(path, at, mt, cb) {
                fs.open(path, constants.O_SYMLINK, function(er, fd) {
                    if (er) {
                        if (cb) cb(er);
                        return;
                    }
                    fs.futimes(fd, at, mt, function(er) {
                        fs.close(fd, function(er2) {
                            if (cb) cb(er || er2);
                        });
                    });
                });
            };
            fs.lutimesSync = function(path, at, mt) {
                var fd = fs.openSync(path, constants.O_SYMLINK);
                var ret;
                var threw = true;
                try {
                    ret = fs.futimesSync(fd, at, mt);
                    threw = false;
                } finally{
                    if (threw) {
                        try {
                            fs.closeSync(fd);
                        } catch (er) {}
                    } else {
                        fs.closeSync(fd);
                    }
                }
                return ret;
            };
        } else if (fs.futimes) {
            fs.lutimes = function(_a, _b, _c, cb) {
                if (cb) process.nextTick(cb);
            };
            fs.lutimesSync = function() {};
        }
    }
    function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
            return orig.call(fs, target, mode, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
            try {
                return orig.call(fs, target, mode);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
            return orig.call(fs, target, uid, gid, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
            try {
                return orig.call(fs, target, uid, gid);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function statFix(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }
            function callback(er, stats) {
                if (stats) {
                    if (stats.uid < 0) stats.uid += 0x100000000;
                    if (stats.gid < 0) stats.gid += 0x100000000;
                }
                if (cb) cb.apply(this, arguments);
            }
            return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
    }
    function statFixSync(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options) {
            var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
            if (stats) {
                if (stats.uid < 0) stats.uid += 0x100000000;
                if (stats.gid < 0) stats.gid += 0x100000000;
            }
            return stats;
        };
    }
    // ENOSYS means that the fs doesn't support the op. Just ignore
    // that, because it doesn't matter.
    //
    // if there's no getuid, or if getuid() is something other
    // than 0, and the error is EINVAL or EPERM, then just ignore
    // it.
    //
    // This specific case is a silent failure in cp, install, tar,
    // and most other unix tools that manage permissions.
    //
    // When running as root, or if other types of errors are
    // encountered, then it's strict.
    function chownErOk(er) {
        if (!er) return true;
        if (er.code === "ENOSYS") return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
            if (er.code === "EINVAL" || er.code === "EPERM") return true;
        }
        return false;
    }
}
}),
"[project]/node_modules/graceful-fs/legacy-streams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
module.exports = legacy;
function legacy(fs) {
    return {
        ReadStream: ReadStream,
        WriteStream: WriteStream
    };
    //TURBOPACK unreachable
    ;
    function ReadStream(path, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path, options);
        Stream.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = 'r';
        this.mode = 438; /*=0666*/ 
        this.bufferSize = 64 * 1024;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.end === undefined) {
                this.end = Infinity;
            } else if ('number' !== typeof this.end) {
                throw TypeError('end must be a Number');
            }
            if (this.start > this.end) {
                throw new Error('start must be <= end');
            }
            this.pos = this.start;
        }
        if (this.fd !== null) {
            process.nextTick(function() {
                self._read();
            });
            return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
            if (err) {
                self.emit('error', err);
                self.readable = false;
                return;
            }
            self.fd = fd;
            self.emit('open', fd);
            self._read();
        });
    }
    function WriteStream(path, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path, options);
        Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = 'w';
        this.encoding = 'binary';
        this.mode = 438; /*=0666*/ 
        this.bytesWritten = 0;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.start < 0) {
                throw new Error('start must be >= zero');
            }
            this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
            this._open = fs.open;
            this._queue.push([
                this._open,
                this.path,
                this.flags,
                this.mode,
                undefined
            ]);
            this.flush();
        }
    }
}
}),
"[project]/node_modules/graceful-fs/clone.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = clone;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
};
function clone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Object) var copy = {
        __proto__: getPrototypeOf(obj)
    };
    else var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
}
}),
"[project]/node_modules/graceful-fs/graceful-fs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
var polyfills = __turbopack_context__.r("[project]/node_modules/graceful-fs/polyfills.js [app-route] (ecmascript)");
var legacy = __turbopack_context__.r("[project]/node_modules/graceful-fs/legacy-streams.js [app-route] (ecmascript)");
var clone = __turbopack_context__.r("[project]/node_modules/graceful-fs/clone.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/* istanbul ignore next - node 0.x polyfill */ var gracefulQueue;
var previousSymbol;
/* istanbul ignore else - node 0.x polyfill */ if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
    gracefulQueue = Symbol.for('graceful-fs.queue');
    // This is used in testing by future versions
    previousSymbol = Symbol.for('graceful-fs.previous');
} else {
    gracefulQueue = '___graceful-fs.queue';
    previousSymbol = '___graceful-fs.previous';
}
function noop() {}
function publishQueue(context, queue) {
    Object.defineProperty(context, gracefulQueue, {
        get: function() {
            return queue;
        }
    });
}
var debug = noop;
if (util.debuglog) debug = util.debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) debug = function() {
    var m = util.format.apply(util, arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
};
// Once time initialization
if (!fs[gracefulQueue]) {
    // This queue can be shared by multiple loaded instances
    var queue = /*TURBOPACK member replacement*/ __turbopack_context__.g[gracefulQueue] || [];
    publishQueue(fs, queue);
    // Patch fs.close/closeSync to shared queue version, because we need
    // to retry() whenever a close happens *anywhere* in the program.
    // This is essential when multiple graceful-fs instances are
    // in play at the same time.
    fs.close = function(fs$close) {
        function close(fd, cb) {
            return fs$close.call(fs, fd, function(err) {
                // This function uses the graceful-fs shared queue
                if (!err) {
                    resetQueue();
                }
                if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
        Object.defineProperty(close, previousSymbol, {
            value: fs$close
        });
        return close;
    }(fs.close);
    fs.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
            // This function uses the graceful-fs shared queue
            fs$closeSync.apply(fs, arguments);
            resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
            value: fs$closeSync
        });
        return closeSync;
    }(fs.closeSync);
    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
        process.on('exit', function() {
            debug(fs[gracefulQueue]);
            __turbopack_context__.r("[externals]/assert [external] (assert, cjs)").equal(fs[gracefulQueue].length, 0);
        });
    }
}
if (!/*TURBOPACK member replacement*/ __turbopack_context__.g[gracefulQueue]) {
    publishQueue(/*TURBOPACK member replacement*/ __turbopack_context__.g, fs[gracefulQueue]);
}
module.exports = patch(clone(fs));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs);
    fs.__patched = true;
}
function patch(fs) {
    // Everything that references the open() function needs to be in here
    polyfills(fs);
    fs.gracefulify = patch;
    fs.createReadStream = createReadStream;
    fs.createWriteStream = createWriteStream;
    var fs$readFile = fs.readFile;
    fs.readFile = readFile;
    function readFile(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$readFile(path, options, cb);
        //TURBOPACK unreachable
        ;
        function go$readFile(path, options, cb, startTime) {
            return fs$readFile(path, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$readFile,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$writeFile = fs.writeFile;
    fs.writeFile = writeFile;
    function writeFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$writeFile(path, data, options, cb);
        //TURBOPACK unreachable
        ;
        function go$writeFile(path, data, options, cb, startTime) {
            return fs$writeFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$writeFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$appendFile = fs.appendFile;
    if (fs$appendFile) fs.appendFile = appendFile;
    function appendFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$appendFile(path, data, options, cb);
        //TURBOPACK unreachable
        ;
        function go$appendFile(path, data, options, cb, startTime) {
            return fs$appendFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$appendFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$copyFile = fs.copyFile;
    if (fs$copyFile) fs.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
        if (typeof flags === 'function') {
            cb = flags;
            flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        //TURBOPACK unreachable
        ;
        function go$copyFile(src, dest, flags, cb, startTime) {
            return fs$copyFile(src, dest, flags, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$copyFile,
                    [
                        src,
                        dest,
                        flags,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$readdir = fs.readdir;
    fs.readdir = readdir;
    var noReaddirOptionVersions = /^v[0-5]\./;
    function readdir(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
        } : function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
        };
        return go$readdir(path, options, cb);
        //TURBOPACK unreachable
        ;
        function fs$readdirCallback(path, options, cb, startTime) {
            return function(err, files) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$readdir,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (files && files.sort) files.sort();
                    if (typeof cb === 'function') cb.call(this, err, files);
                }
            };
        }
    }
    if (process.version.substr(0, 4) === 'v0.8') {
        var legStreams = legacy(fs);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs.ReadStream;
    if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs.WriteStream;
    if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
    }
    Object.defineProperty(fs, 'ReadStream', {
        get: function() {
            return ReadStream;
        },
        set: function(val) {
            ReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fs, 'WriteStream', {
        get: function() {
            return WriteStream;
        },
        set: function(val) {
            WriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    // legacy names
    var FileReadStream = ReadStream;
    Object.defineProperty(fs, 'FileReadStream', {
        get: function() {
            return FileReadStream;
        },
        set: function(val) {
            FileReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs, 'FileWriteStream', {
        get: function() {
            return FileWriteStream;
        },
        set: function(val) {
            FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    function ReadStream(path, options) {
        if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
        else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                if (that.autoClose) that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
                that.read();
            }
        });
    }
    function WriteStream(path, options) {
        if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
        else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
            }
        });
    }
    function createReadStream(path, options) {
        return new fs.ReadStream(path, options);
    }
    function createWriteStream(path, options) {
        return new fs.WriteStream(path, options);
    }
    var fs$open = fs.open;
    fs.open = open;
    function open(path, flags, mode, cb) {
        if (typeof mode === 'function') cb = mode, mode = null;
        return go$open(path, flags, mode, cb);
        //TURBOPACK unreachable
        ;
        function go$open(path, flags, mode, cb, startTime) {
            return fs$open(path, flags, mode, function(err, fd) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$open,
                    [
                        path,
                        flags,
                        mode,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    return fs;
}
function enqueue(elem) {
    debug('ENQUEUE', elem[0].name, elem[1]);
    fs[gracefulQueue].push(elem);
    retry();
}
// keep track of the timeout between retry() calls
var retryTimer;
// reset the startTime and lastTime to now
// this resets the start of the 60 second overall timeout as well as the
// delay between attempts so that we'll retry these jobs sooner
function resetQueue() {
    var now = Date.now();
    for(var i = 0; i < fs[gracefulQueue].length; ++i){
        // entries that are only a length of 2 are from an older version, don't
        // bother modifying those since they'll be retried anyway.
        if (fs[gracefulQueue][i].length > 2) {
            fs[gracefulQueue][i][3] = now; // startTime
            fs[gracefulQueue][i][4] = now; // lastTime
        }
    }
    // call retry to make sure we're actively processing the queue
    retry();
}
function retry() {
    // clear the timer and remove it to help prevent unintended concurrency
    clearTimeout(retryTimer);
    retryTimer = undefined;
    if (fs[gracefulQueue].length === 0) return;
    var elem = fs[gracefulQueue].shift();
    var fn = elem[0];
    var args = elem[1];
    // these items may be unset if they were added by an older graceful-fs
    var err = elem[2];
    var startTime = elem[3];
    var lastTime = elem[4];
    // if we don't have a startTime we have no way of knowing if we've waited
    // long enough, so go ahead and retry this item now
    if (startTime === undefined) {
        debug('RETRY', fn.name, args);
        fn.apply(null, args);
    } else if (Date.now() - startTime >= 60000) {
        // it's been more than 60 seconds total, bail now
        debug('TIMEOUT', fn.name, args);
        var cb = args.pop();
        if (typeof cb === 'function') cb.call(null, err);
    } else {
        // the amount of time between the last attempt and right now
        var sinceAttempt = Date.now() - lastTime;
        // the amount of time between when we first tried, and when we last tried
        // rounded up to at least 1
        var sinceStart = Math.max(lastTime - startTime, 1);
        // backoff. wait longer than the total time we've been retrying, but only
        // up to a maximum of 100ms
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        // it's been long enough since the last retry, do it again
        if (sinceAttempt >= desiredDelay) {
            debug('RETRY', fn.name, args);
            fn.apply(null, args.concat([
                startTime
            ]));
        } else {
            // if we can't do this job yet, push it to the end of the queue
            // and let the next iteration check again
            fs[gracefulQueue].push(elem);
        }
    }
    // schedule our next run if one isn't already scheduled
    if (retryTimer === undefined) {
        retryTimer = setTimeout(retry, 0);
    }
}
}),
"[project]/node_modules/is-stream/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const isStream = (stream)=>stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
isStream.writable = (stream)=>isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
isStream.readable = (stream)=>isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
isStream.duplex = (stream)=>isStream.writable(stream) && isStream.readable(stream);
isStream.transform = (stream)=>isStream.duplex(stream) && typeof stream._transform === 'function';
module.exports = isStream;
}),
"[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if (typeof process === 'undefined' || !process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
    module.exports = {
        nextTick: nextTick
    };
} else {
    module.exports = process;
}
function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== 'function') {
        throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch(len){
        case 0:
        case 1:
            return process.nextTick(fn);
        case 2:
            return process.nextTick(function afterTickOne() {
                fn.call(null, arg1);
            });
        case 3:
            return process.nextTick(function afterTickTwo() {
                fn.call(null, arg1, arg2);
            });
        case 4:
            return process.nextTick(function afterTickThree() {
                fn.call(null, arg1, arg2, arg3);
            });
        default:
            args = new Array(len - 1);
            i = 0;
            while(i < args.length){
                args[i++] = arguments[i];
            }
            return process.nextTick(function afterTick() {
                fn.apply(null, args);
            });
    }
}
}),
"[project]/node_modules/isarray/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var toString = {}.toString;
module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
};
}),
"[project]/node_modules/lazystream/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg) {
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;
function isBoolean(arg) {
    return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;
function isNull(arg) {
    return arg === null;
}
exports.isNull = isNull;
function isNullOrUndefined(arg) {
    return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isNumber(arg) {
    return typeof arg === 'number';
}
exports.isNumber = isNumber;
function isString(arg) {
    return typeof arg === 'string';
}
exports.isString = isString;
function isSymbol(arg) {
    return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;
function isUndefined(arg) {
    return arg === void 0;
}
exports.isUndefined = isUndefined;
function isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;
function isDate(d) {
    return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
function isError(e) {
    return objectToString(e) === '[object Error]' || e instanceof Error;
}
exports.isError = isError;
function isFunction(arg) {
    return typeof arg === 'function';
}
exports.isFunction = isFunction;
function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
    typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;
exports.isBuffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer.isBuffer;
function objectToString(o) {
    return Object.prototype.toString.call(o);
}
}),
"[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        }
    };
} else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
    };
}
}),
"[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

try {
    var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
    /* istanbul ignore next */ if (typeof util.inherits !== 'function') throw '';
    module.exports = util.inherits;
} catch (e) {
    /* istanbul ignore next */ module.exports = __turbopack_context__.r("[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/util-deprecate/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * For Node.js, simply re-export the core `util.deprecate` function.
 */ module.exports = __turbopack_context__.r("[externals]/util [external] (util, cjs)").deprecate;
}),
"[project]/node_modules/lazystream/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/lazystream/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
/*</replacement>*/ var isEncoding = Buffer.isEncoding || function(encoding) {
    encoding = '' + encoding;
    switch(encoding && encoding.toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
            return true;
        default:
            return false;
    }
};
function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while(true){
        switch(enc){
            case 'utf8':
            case 'utf-8':
                return 'utf8';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return 'utf16le';
            case 'latin1':
            case 'binary':
                return 'latin1';
            case 'base64':
            case 'ascii':
            case 'hex':
                return enc;
            default:
                if (retried) return; // undefined
                enc = ('' + enc).toLowerCase();
                retried = true;
        }
    }
}
;
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
}
// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch(this.encoding){
        case 'utf16le':
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
        case 'utf8':
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
        case 'base64':
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
        default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
}
StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return '';
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
};
StringDecoder.prototype.end = utf8End;
// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;
// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
};
// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;
    else if (byte >> 5 === 0x06) return 2;
    else if (byte >> 4 === 0x0E) return 3;
    else if (byte >> 3 === 0x1E) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
        self.lastNeed = 0;
        return '\ufffd';
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1;
            return '\ufffd';
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
                self.lastNeed = 2;
                return '\ufffd';
            }
        }
    }
}
// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
}
// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd';
    return r;
}
// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
        var r = buf.toString('utf16le', i);
        if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 0xD800 && c <= 0xDBFF) {
                this.lastNeed = 2;
                this.lastTotal = 4;
                this.lastChar[0] = buf[buf.length - 2];
                this.lastChar[1] = buf[buf.length - 1];
                return r.slice(0, -1);
            }
        }
        return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
}
// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
}
function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
}
function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
}
// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
}
}),
"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
/*</replacement>*/ var isEncoding = Buffer.isEncoding || function(encoding) {
    encoding = '' + encoding;
    switch(encoding && encoding.toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
            return true;
        default:
            return false;
    }
};
function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while(true){
        switch(enc){
            case 'utf8':
            case 'utf-8':
                return 'utf8';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return 'utf16le';
            case 'latin1':
            case 'binary':
                return 'latin1';
            case 'base64':
            case 'ascii':
            case 'hex':
                return enc;
            default:
                if (retried) return; // undefined
                enc = ('' + enc).toLowerCase();
                retried = true;
        }
    }
}
;
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
}
// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch(this.encoding){
        case 'utf16le':
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
        case 'utf8':
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
        case 'base64':
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
        default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
}
StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return '';
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
};
StringDecoder.prototype.end = utf8End;
// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;
// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
};
// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;
    else if (byte >> 5 === 0x06) return 2;
    else if (byte >> 4 === 0x0E) return 3;
    else if (byte >> 3 === 0x1E) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
        self.lastNeed = 0;
        return '\ufffd';
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1;
            return '\ufffd';
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
                self.lastNeed = 2;
                return '\ufffd';
            }
        }
    }
}
// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
}
// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd';
    return r;
}
// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
        var r = buf.toString('utf16le', i);
        if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 0xD800 && c <= 0xDBFF) {
                this.lastNeed = 2;
                this.lastTotal = 4;
                this.lastChar[0] = buf[buf.length - 2];
                this.lastChar[1] = buf[buf.length - 1];
                return r.slice(0, -1);
            }
        }
        return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
}
// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
}
function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
}
function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
}
// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
}
}),
"[project]/node_modules/lazystream/lib/lazystream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var PassThrough = __turbopack_context__.r("[project]/node_modules/lazystream/node_modules/readable-stream/passthrough.js [app-route] (ecmascript)");
module.exports = {
    Readable: Readable,
    Writable: Writable
};
util.inherits(Readable, PassThrough);
util.inherits(Writable, PassThrough);
// Patch the given method of instance so that the callback
// is executed once, before the actual method is called the
// first time.
function beforeFirstCall(instance, method, callback) {
    instance[method] = function() {
        delete instance[method];
        callback.apply(this, arguments);
        return this[method].apply(this, arguments);
    };
}
function Readable(fn, options) {
    if (!(this instanceof Readable)) return new Readable(fn, options);
    PassThrough.call(this, options);
    beforeFirstCall(this, '_read', function() {
        var source = fn.call(this, options);
        var emit = this.emit.bind(this, 'error');
        source.on('error', emit);
        source.pipe(this);
    });
    this.emit('readable');
}
function Writable(fn, options) {
    if (!(this instanceof Writable)) return new Writable(fn, options);
    PassThrough.call(this, options);
    beforeFirstCall(this, '_write', function() {
        var destination = fn.call(this, options);
        var emit = this.emit.bind(this, 'error');
        destination.on('error', emit);
        this.pipe(destination);
    });
    this.emit('writable');
}
}),
"[project]/node_modules/normalize-path/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */ module.exports = function(path, stripTrailing) {
    if (typeof path !== 'string') {
        throw new TypeError('expected path to be a string');
    }
    if (path === '\\' || path === '/') return '/';
    var len = path.length;
    if (len <= 1) return path;
    // ensure that win32 namespaces has two leading slashes, so that the path is
    // handled properly by the win32 version of path.parse() after being normalized
    // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
    var prefix = '';
    if (len > 4 && path[3] === '\\') {
        var ch = path[2];
        if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
            path = path.slice(2);
            prefix = '//';
        }
    }
    var segs = path.split(/[/\\]+/);
    if (stripTrailing !== false && segs[segs.length - 1] === '') {
        segs.pop();
    }
    return prefix + segs.join('/');
};
}),
"[project]/node_modules/lodash/identity.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */ function identity(value) {
    return value;
}
module.exports = identity;
}),
"[project]/node_modules/lodash/_apply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */ function apply(func, thisArg, args) {
    switch(args.length){
        case 0:
            return func.call(thisArg);
        case 1:
            return func.call(thisArg, args[0]);
        case 2:
            return func.call(thisArg, args[0], args[1]);
        case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
}
module.exports = apply;
}),
"[project]/node_modules/lodash/_overRest.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var apply = __turbopack_context__.r("[project]/node_modules/lodash/_apply.js [app-route] (ecmascript)");
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeMax = Math.max;
/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */ function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while(++index < length){
            array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while(++index < start){
            otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
    };
}
module.exports = overRest;
}),
"[project]/node_modules/lodash/constant.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */ function constant(value) {
    return function() {
        return value;
    };
}
module.exports = constant;
}),
"[project]/node_modules/lodash/_freeGlobal.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Detect free variable `global` from Node.js. */ var freeGlobal = ("TURBOPACK compile-time value", "object") == 'object' && /*TURBOPACK member replacement*/ __turbopack_context__.g && /*TURBOPACK member replacement*/ __turbopack_context__.g.Object === Object && /*TURBOPACK member replacement*/ __turbopack_context__.g;
module.exports = freeGlobal;
}),
"[project]/node_modules/lodash/_root.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var freeGlobal = __turbopack_context__.r("[project]/node_modules/lodash/_freeGlobal.js [app-route] (ecmascript)");
/** Detect free variable `self`. */ var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function('return this')();
module.exports = root;
}),
"[project]/node_modules/lodash/_Symbol.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var root = __turbopack_context__.r("[project]/node_modules/lodash/_root.js [app-route] (ecmascript)");
/** Built-in value references. */ var Symbol = root.Symbol;
module.exports = Symbol;
}),
"[project]/node_modules/lodash/_getRawTag.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Symbol = __turbopack_context__.r("[project]/node_modules/lodash/_Symbol.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var nativeObjectToString = objectProto.toString;
/** Built-in value references. */ var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */ function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
        value[symToStringTag] = undefined;
        var unmasked = true;
    } catch (e) {}
    var result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        } else {
            delete value[symToStringTag];
        }
    }
    return result;
}
module.exports = getRawTag;
}),
"[project]/node_modules/lodash/_objectToString.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var nativeObjectToString = objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */ function objectToString(value) {
    return nativeObjectToString.call(value);
}
module.exports = objectToString;
}),
"[project]/node_modules/lodash/_baseGetTag.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Symbol = __turbopack_context__.r("[project]/node_modules/lodash/_Symbol.js [app-route] (ecmascript)"), getRawTag = __turbopack_context__.r("[project]/node_modules/lodash/_getRawTag.js [app-route] (ecmascript)"), objectToString = __turbopack_context__.r("[project]/node_modules/lodash/_objectToString.js [app-route] (ecmascript)");
/** `Object#toString` result references. */ var nullTag = '[object Null]', undefinedTag = '[object Undefined]';
/** Built-in value references. */ var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
module.exports = baseGetTag;
}),
"[project]/node_modules/lodash/isObject.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}
module.exports = isObject;
}),
"[project]/node_modules/lodash/isFunction.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseGetTag = __turbopack_context__.r("[project]/node_modules/lodash/_baseGetTag.js [app-route] (ecmascript)"), isObject = __turbopack_context__.r("[project]/node_modules/lodash/isObject.js [app-route] (ecmascript)");
/** `Object#toString` result references. */ var asyncTag = '[object AsyncFunction]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    if (!isObject(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
module.exports = isFunction;
}),
"[project]/node_modules/lodash/_coreJsData.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var root = __turbopack_context__.r("[project]/node_modules/lodash/_root.js [app-route] (ecmascript)");
/** Used to detect overreaching core-js shims. */ var coreJsData = root['__core-js_shared__'];
module.exports = coreJsData;
}),
"[project]/node_modules/lodash/_isMasked.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var coreJsData = __turbopack_context__.r("[project]/node_modules/lodash/_coreJsData.js [app-route] (ecmascript)");
/** Used to detect methods masquerading as native. */ var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */ function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}
module.exports = isMasked;
}),
"[project]/node_modules/lodash/_toSource.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used for built-in method references. */ var funcProto = Function.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */ function toSource(func) {
    if (func != null) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + '';
        } catch (e) {}
    }
    return '';
}
module.exports = toSource;
}),
"[project]/node_modules/lodash/_baseIsNative.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var isFunction = __turbopack_context__.r("[project]/node_modules/lodash/isFunction.js [app-route] (ecmascript)"), isMasked = __turbopack_context__.r("[project]/node_modules/lodash/_isMasked.js [app-route] (ecmascript)"), isObject = __turbopack_context__.r("[project]/node_modules/lodash/isObject.js [app-route] (ecmascript)"), toSource = __turbopack_context__.r("[project]/node_modules/lodash/_toSource.js [app-route] (ecmascript)");
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */ var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */ var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to detect if a method is native. */ var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */ function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
        return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
}
module.exports = baseIsNative;
}),
"[project]/node_modules/lodash/_getValue.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */ function getValue(object, key) {
    return object == null ? undefined : object[key];
}
module.exports = getValue;
}),
"[project]/node_modules/lodash/_getNative.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseIsNative = __turbopack_context__.r("[project]/node_modules/lodash/_baseIsNative.js [app-route] (ecmascript)"), getValue = __turbopack_context__.r("[project]/node_modules/lodash/_getValue.js [app-route] (ecmascript)");
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */ function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
}
module.exports = getNative;
}),
"[project]/node_modules/lodash/_defineProperty.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getNative = __turbopack_context__.r("[project]/node_modules/lodash/_getNative.js [app-route] (ecmascript)");
var defineProperty = function() {
    try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
    } catch (e) {}
}();
module.exports = defineProperty;
}),
"[project]/node_modules/lodash/_baseSetToString.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var constant = __turbopack_context__.r("[project]/node_modules/lodash/constant.js [app-route] (ecmascript)"), defineProperty = __turbopack_context__.r("[project]/node_modules/lodash/_defineProperty.js [app-route] (ecmascript)"), identity = __turbopack_context__.r("[project]/node_modules/lodash/identity.js [app-route] (ecmascript)");
/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */ var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
    });
};
module.exports = baseSetToString;
}),
"[project]/node_modules/lodash/_shortOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used to detect hot functions by number of calls within a span of milliseconds. */ var HOT_COUNT = 800, HOT_SPAN = 16;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeNow = Date.now;
/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */ function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
            if (++count >= HOT_COUNT) {
                return arguments[0];
            }
        } else {
            count = 0;
        }
        return func.apply(undefined, arguments);
    };
}
module.exports = shortOut;
}),
"[project]/node_modules/lodash/_setToString.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseSetToString = __turbopack_context__.r("[project]/node_modules/lodash/_baseSetToString.js [app-route] (ecmascript)"), shortOut = __turbopack_context__.r("[project]/node_modules/lodash/_shortOut.js [app-route] (ecmascript)");
/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */ var setToString = shortOut(baseSetToString);
module.exports = setToString;
}),
"[project]/node_modules/lodash/_baseRest.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var identity = __turbopack_context__.r("[project]/node_modules/lodash/identity.js [app-route] (ecmascript)"), overRest = __turbopack_context__.r("[project]/node_modules/lodash/_overRest.js [app-route] (ecmascript)"), setToString = __turbopack_context__.r("[project]/node_modules/lodash/_setToString.js [app-route] (ecmascript)");
/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */ function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
}
module.exports = baseRest;
}),
"[project]/node_modules/lodash/eq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */ function eq(value, other) {
    return value === other || value !== value && other !== other;
}
module.exports = eq;
}),
"[project]/node_modules/lodash/isLength.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used as references for various `Number` constants. */ var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
module.exports = isLength;
}),
"[project]/node_modules/lodash/isArrayLike.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var isFunction = __turbopack_context__.r("[project]/node_modules/lodash/isFunction.js [app-route] (ecmascript)"), isLength = __turbopack_context__.r("[project]/node_modules/lodash/isLength.js [app-route] (ecmascript)");
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
module.exports = isArrayLike;
}),
"[project]/node_modules/lodash/_isIndex.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used as references for various `Number` constants. */ var MAX_SAFE_INTEGER = 9007199254740991;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
module.exports = isIndex;
}),
"[project]/node_modules/lodash/_isIterateeCall.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var eq = __turbopack_context__.r("[project]/node_modules/lodash/eq.js [app-route] (ecmascript)"), isArrayLike = __turbopack_context__.r("[project]/node_modules/lodash/isArrayLike.js [app-route] (ecmascript)"), isIndex = __turbopack_context__.r("[project]/node_modules/lodash/_isIndex.js [app-route] (ecmascript)"), isObject = __turbopack_context__.r("[project]/node_modules/lodash/isObject.js [app-route] (ecmascript)");
/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */ function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
        return false;
    }
    var type = typeof index;
    if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
        return eq(object[index], value);
    }
    return false;
}
module.exports = isIterateeCall;
}),
"[project]/node_modules/lodash/_baseTimes.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
module.exports = baseTimes;
}),
"[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return value != null && typeof value == 'object';
}
module.exports = isObjectLike;
}),
"[project]/node_modules/lodash/_baseIsArguments.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseGetTag = __turbopack_context__.r("[project]/node_modules/lodash/_baseGetTag.js [app-route] (ecmascript)"), isObjectLike = __turbopack_context__.r("[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)");
/** `Object#toString` result references. */ var argsTag = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */ function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
}
module.exports = baseIsArguments;
}),
"[project]/node_modules/lodash/isArguments.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseIsArguments = __turbopack_context__.r("[project]/node_modules/lodash/_baseIsArguments.js [app-route] (ecmascript)"), isObjectLike = __turbopack_context__.r("[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Built-in value references. */ var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ var isArguments = baseIsArguments(function() {
    return arguments;
}()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
module.exports = isArguments;
}),
"[project]/node_modules/lodash/isArray.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
module.exports = isArray;
}),
"[project]/node_modules/lodash/stubFalse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */ function stubFalse() {
    return false;
}
module.exports = stubFalse;
}),
"[project]/node_modules/lodash/isBuffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var root = __turbopack_context__.r("[project]/node_modules/lodash/_root.js [app-route] (ecmascript)"), stubFalse = __turbopack_context__.r("[project]/node_modules/lodash/stubFalse.js [app-route] (ecmascript)");
/** Detect free variable `exports`. */ var freeExports = ("TURBOPACK compile-time value", "object") == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */ var freeModule = freeExports && ("TURBOPACK compile-time value", "object") == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */ var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */ var Buffer = moduleExports ? root.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */ var isBuffer = nativeIsBuffer || stubFalse;
module.exports = isBuffer;
}),
"[project]/node_modules/lodash/_baseIsTypedArray.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseGetTag = __turbopack_context__.r("[project]/node_modules/lodash/_baseGetTag.js [app-route] (ecmascript)"), isLength = __turbopack_context__.r("[project]/node_modules/lodash/isLength.js [app-route] (ecmascript)"), isObjectLike = __turbopack_context__.r("[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)");
/** `Object#toString` result references. */ var argsTag = '[object Arguments]', arrayTag = '[object Array]', boolTag = '[object Boolean]', dateTag = '[object Date]', errorTag = '[object Error]', funcTag = '[object Function]', mapTag = '[object Map]', numberTag = '[object Number]', objectTag = '[object Object]', regexpTag = '[object RegExp]', setTag = '[object Set]', stringTag = '[object String]', weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]', dataViewTag = '[object DataView]', float32Tag = '[object Float32Array]', float64Tag = '[object Float64Array]', int8Tag = '[object Int8Array]', int16Tag = '[object Int16Array]', int32Tag = '[object Int32Array]', uint8Tag = '[object Uint8Array]', uint8ClampedTag = '[object Uint8ClampedArray]', uint16Tag = '[object Uint16Array]', uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */ var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */ function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
module.exports = baseIsTypedArray;
}),
"[project]/node_modules/lodash/_baseUnary.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */ function baseUnary(func) {
    return function(value) {
        return func(value);
    };
}
module.exports = baseUnary;
}),
"[project]/node_modules/lodash/_nodeUtil.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var freeGlobal = __turbopack_context__.r("[project]/node_modules/lodash/_freeGlobal.js [app-route] (ecmascript)");
/** Detect free variable `exports`. */ var freeExports = ("TURBOPACK compile-time value", "object") == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */ var freeModule = freeExports && ("TURBOPACK compile-time value", "object") == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */ var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */ var freeProcess = moduleExports && freeGlobal.process;
/** Used to access faster Node.js helpers. */ var nodeUtil = function() {
    try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;
        if (types) {
            return types;
        }
        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
}();
module.exports = nodeUtil;
}),
"[project]/node_modules/lodash/isTypedArray.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseIsTypedArray = __turbopack_context__.r("[project]/node_modules/lodash/_baseIsTypedArray.js [app-route] (ecmascript)"), baseUnary = __turbopack_context__.r("[project]/node_modules/lodash/_baseUnary.js [app-route] (ecmascript)"), nodeUtil = __turbopack_context__.r("[project]/node_modules/lodash/_nodeUtil.js [app-route] (ecmascript)");
/* Node.js helper references. */ var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */ var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
module.exports = isTypedArray;
}),
"[project]/node_modules/lodash/_arrayLikeKeys.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseTimes = __turbopack_context__.r("[project]/node_modules/lodash/_baseTimes.js [app-route] (ecmascript)"), isArguments = __turbopack_context__.r("[project]/node_modules/lodash/isArguments.js [app-route] (ecmascript)"), isArray = __turbopack_context__.r("[project]/node_modules/lodash/isArray.js [app-route] (ecmascript)"), isBuffer = __turbopack_context__.r("[project]/node_modules/lodash/isBuffer.js [app-route] (ecmascript)"), isIndex = __turbopack_context__.r("[project]/node_modules/lodash/_isIndex.js [app-route] (ecmascript)"), isTypedArray = __turbopack_context__.r("[project]/node_modules/lodash/isTypedArray.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (// Safari 9 has enumerable `arguments.length` in strict mode.
        key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
        isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
module.exports = arrayLikeKeys;
}),
"[project]/node_modules/lodash/_isPrototype.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
}
module.exports = isPrototype;
}),
"[project]/node_modules/lodash/_nativeKeysIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
        for(var key in Object(object)){
            result.push(key);
        }
    }
    return result;
}
module.exports = nativeKeysIn;
}),
"[project]/node_modules/lodash/_baseKeysIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var isObject = __turbopack_context__.r("[project]/node_modules/lodash/isObject.js [app-route] (ecmascript)"), isPrototype = __turbopack_context__.r("[project]/node_modules/lodash/_isPrototype.js [app-route] (ecmascript)"), nativeKeysIn = __turbopack_context__.r("[project]/node_modules/lodash/_nativeKeysIn.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeysIn(object) {
    if (!isObject(object)) {
        return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for(var key in object){
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
            result.push(key);
        }
    }
    return result;
}
module.exports = baseKeysIn;
}),
"[project]/node_modules/lodash/keysIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var arrayLikeKeys = __turbopack_context__.r("[project]/node_modules/lodash/_arrayLikeKeys.js [app-route] (ecmascript)"), baseKeysIn = __turbopack_context__.r("[project]/node_modules/lodash/_baseKeysIn.js [app-route] (ecmascript)"), isArrayLike = __turbopack_context__.r("[project]/node_modules/lodash/isArrayLike.js [app-route] (ecmascript)");
/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */ function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
module.exports = keysIn;
}),
"[project]/node_modules/lodash/defaults.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseRest = __turbopack_context__.r("[project]/node_modules/lodash/_baseRest.js [app-route] (ecmascript)"), eq = __turbopack_context__.r("[project]/node_modules/lodash/eq.js [app-route] (ecmascript)"), isIterateeCall = __turbopack_context__.r("[project]/node_modules/lodash/_isIterateeCall.js [app-route] (ecmascript)"), keysIn = __turbopack_context__.r("[project]/node_modules/lodash/keysIn.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */ var defaults = baseRest(function(object, sources) {
    object = Object(object);
    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : undefined;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
    }
    while(++index < length){
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;
        while(++propsIndex < propsLength){
            var key = props[propsIndex];
            var value = object[key];
            if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                object[key] = source[key];
            }
        }
    }
    return object;
});
module.exports = defaults;
}),
"[project]/node_modules/lodash/_arrayPush.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */ function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while(++index < length){
        array[offset + index] = values[index];
    }
    return array;
}
module.exports = arrayPush;
}),
"[project]/node_modules/lodash/_isFlattenable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Symbol = __turbopack_context__.r("[project]/node_modules/lodash/_Symbol.js [app-route] (ecmascript)"), isArguments = __turbopack_context__.r("[project]/node_modules/lodash/isArguments.js [app-route] (ecmascript)"), isArray = __turbopack_context__.r("[project]/node_modules/lodash/isArray.js [app-route] (ecmascript)");
/** Built-in value references. */ var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */ function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
module.exports = isFlattenable;
}),
"[project]/node_modules/lodash/_baseFlatten.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var arrayPush = __turbopack_context__.r("[project]/node_modules/lodash/_arrayPush.js [app-route] (ecmascript)"), isFlattenable = __turbopack_context__.r("[project]/node_modules/lodash/_isFlattenable.js [app-route] (ecmascript)");
/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */ function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while(++index < length){
        var value = array[index];
        if (depth > 0 && predicate(value)) {
            if (depth > 1) {
                // Recursively flatten arrays (susceptible to call stack limits).
                baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
                arrayPush(result, value);
            }
        } else if (!isStrict) {
            result[result.length] = value;
        }
    }
    return result;
}
module.exports = baseFlatten;
}),
"[project]/node_modules/lodash/flatten.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseFlatten = __turbopack_context__.r("[project]/node_modules/lodash/_baseFlatten.js [app-route] (ecmascript)");
/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */ function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
}
module.exports = flatten;
}),
"[project]/node_modules/lodash/_nativeCreate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getNative = __turbopack_context__.r("[project]/node_modules/lodash/_getNative.js [app-route] (ecmascript)");
/* Built-in method references that are verified to be native. */ var nativeCreate = getNative(Object, 'create');
module.exports = nativeCreate;
}),
"[project]/node_modules/lodash/_hashClear.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var nativeCreate = __turbopack_context__.r("[project]/node_modules/lodash/_nativeCreate.js [app-route] (ecmascript)");
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */ function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
}
module.exports = hashClear;
}),
"[project]/node_modules/lodash/_hashDelete.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
}
module.exports = hashDelete;
}),
"[project]/node_modules/lodash/_hashGet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var nativeCreate = __turbopack_context__.r("[project]/node_modules/lodash/_nativeCreate.js [app-route] (ecmascript)");
/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = '__lodash_hash_undefined__';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
module.exports = hashGet;
}),
"[project]/node_modules/lodash/_hashHas.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var nativeCreate = __turbopack_context__.r("[project]/node_modules/lodash/_nativeCreate.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
module.exports = hashHas;
}),
"[project]/node_modules/lodash/_hashSet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var nativeCreate = __turbopack_context__.r("[project]/node_modules/lodash/_nativeCreate.js [app-route] (ecmascript)");
/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */ function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
}
module.exports = hashSet;
}),
"[project]/node_modules/lodash/_Hash.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var hashClear = __turbopack_context__.r("[project]/node_modules/lodash/_hashClear.js [app-route] (ecmascript)"), hashDelete = __turbopack_context__.r("[project]/node_modules/lodash/_hashDelete.js [app-route] (ecmascript)"), hashGet = __turbopack_context__.r("[project]/node_modules/lodash/_hashGet.js [app-route] (ecmascript)"), hashHas = __turbopack_context__.r("[project]/node_modules/lodash/_hashHas.js [app-route] (ecmascript)"), hashSet = __turbopack_context__.r("[project]/node_modules/lodash/_hashSet.js [app-route] (ecmascript)");
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
module.exports = Hash;
}),
"[project]/node_modules/lodash/_listCacheClear.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */ function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
}
module.exports = listCacheClear;
}),
"[project]/node_modules/lodash/_assocIndexOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var eq = __turbopack_context__.r("[project]/node_modules/lodash/eq.js [app-route] (ecmascript)");
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function assocIndexOf(array, key) {
    var length = array.length;
    while(length--){
        if (eq(array[length][0], key)) {
            return length;
        }
    }
    return -1;
}
module.exports = assocIndexOf;
}),
"[project]/node_modules/lodash/_listCacheDelete.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var assocIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_assocIndexOf.js [app-route] (ecmascript)");
/** Used for built-in method references. */ var arrayProto = Array.prototype;
/** Built-in value references. */ var splice = arrayProto.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
        return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
        data.pop();
    } else {
        splice.call(data, index, 1);
    }
    --this.size;
    return true;
}
module.exports = listCacheDelete;
}),
"[project]/node_modules/lodash/_listCacheGet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var assocIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_assocIndexOf.js [app-route] (ecmascript)");
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
}
module.exports = listCacheGet;
}),
"[project]/node_modules/lodash/_listCacheHas.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var assocIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_assocIndexOf.js [app-route] (ecmascript)");
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
}
module.exports = listCacheHas;
}),
"[project]/node_modules/lodash/_listCacheSet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var assocIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_assocIndexOf.js [app-route] (ecmascript)");
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */ function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
        ++this.size;
        data.push([
            key,
            value
        ]);
    } else {
        data[index][1] = value;
    }
    return this;
}
module.exports = listCacheSet;
}),
"[project]/node_modules/lodash/_ListCache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var listCacheClear = __turbopack_context__.r("[project]/node_modules/lodash/_listCacheClear.js [app-route] (ecmascript)"), listCacheDelete = __turbopack_context__.r("[project]/node_modules/lodash/_listCacheDelete.js [app-route] (ecmascript)"), listCacheGet = __turbopack_context__.r("[project]/node_modules/lodash/_listCacheGet.js [app-route] (ecmascript)"), listCacheHas = __turbopack_context__.r("[project]/node_modules/lodash/_listCacheHas.js [app-route] (ecmascript)"), listCacheSet = __turbopack_context__.r("[project]/node_modules/lodash/_listCacheSet.js [app-route] (ecmascript)");
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
module.exports = ListCache;
}),
"[project]/node_modules/lodash/_Map.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getNative = __turbopack_context__.r("[project]/node_modules/lodash/_getNative.js [app-route] (ecmascript)"), root = __turbopack_context__.r("[project]/node_modules/lodash/_root.js [app-route] (ecmascript)");
/* Built-in method references that are verified to be native. */ var Map = getNative(root, 'Map');
module.exports = Map;
}),
"[project]/node_modules/lodash/_mapCacheClear.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Hash = __turbopack_context__.r("[project]/node_modules/lodash/_Hash.js [app-route] (ecmascript)"), ListCache = __turbopack_context__.r("[project]/node_modules/lodash/_ListCache.js [app-route] (ecmascript)"), Map = __turbopack_context__.r("[project]/node_modules/lodash/_Map.js [app-route] (ecmascript)");
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */ function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
    };
}
module.exports = mapCacheClear;
}),
"[project]/node_modules/lodash/_isKeyable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */ function isKeyable(value) {
    var type = typeof value;
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
module.exports = isKeyable;
}),
"[project]/node_modules/lodash/_getMapData.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var isKeyable = __turbopack_context__.r("[project]/node_modules/lodash/_isKeyable.js [app-route] (ecmascript)");
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */ function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
module.exports = getMapData;
}),
"[project]/node_modules/lodash/_mapCacheDelete.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getMapData = __turbopack_context__.r("[project]/node_modules/lodash/_getMapData.js [app-route] (ecmascript)");
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
}
module.exports = mapCacheDelete;
}),
"[project]/node_modules/lodash/_mapCacheGet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getMapData = __turbopack_context__.r("[project]/node_modules/lodash/_getMapData.js [app-route] (ecmascript)");
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function mapCacheGet(key) {
    return getMapData(this, key).get(key);
}
module.exports = mapCacheGet;
}),
"[project]/node_modules/lodash/_mapCacheHas.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getMapData = __turbopack_context__.r("[project]/node_modules/lodash/_getMapData.js [app-route] (ecmascript)");
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function mapCacheHas(key) {
    return getMapData(this, key).has(key);
}
module.exports = mapCacheHas;
}),
"[project]/node_modules/lodash/_mapCacheSet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getMapData = __turbopack_context__.r("[project]/node_modules/lodash/_getMapData.js [app-route] (ecmascript)");
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */ function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
}
module.exports = mapCacheSet;
}),
"[project]/node_modules/lodash/_MapCache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var mapCacheClear = __turbopack_context__.r("[project]/node_modules/lodash/_mapCacheClear.js [app-route] (ecmascript)"), mapCacheDelete = __turbopack_context__.r("[project]/node_modules/lodash/_mapCacheDelete.js [app-route] (ecmascript)"), mapCacheGet = __turbopack_context__.r("[project]/node_modules/lodash/_mapCacheGet.js [app-route] (ecmascript)"), mapCacheHas = __turbopack_context__.r("[project]/node_modules/lodash/_mapCacheHas.js [app-route] (ecmascript)"), mapCacheSet = __turbopack_context__.r("[project]/node_modules/lodash/_mapCacheSet.js [app-route] (ecmascript)");
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
module.exports = MapCache;
}),
"[project]/node_modules/lodash/_setCacheAdd.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = '__lodash_hash_undefined__';
/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */ function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
}
module.exports = setCacheAdd;
}),
"[project]/node_modules/lodash/_setCacheHas.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */ function setCacheHas(value) {
    return this.__data__.has(value);
}
module.exports = setCacheHas;
}),
"[project]/node_modules/lodash/_SetCache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var MapCache = __turbopack_context__.r("[project]/node_modules/lodash/_MapCache.js [app-route] (ecmascript)"), setCacheAdd = __turbopack_context__.r("[project]/node_modules/lodash/_setCacheAdd.js [app-route] (ecmascript)"), setCacheHas = __turbopack_context__.r("[project]/node_modules/lodash/_setCacheHas.js [app-route] (ecmascript)");
/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */ function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache;
    while(++index < length){
        this.add(values[index]);
    }
}
// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
module.exports = SetCache;
}),
"[project]/node_modules/lodash/_baseFindIndex.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
module.exports = baseFindIndex;
}),
"[project]/node_modules/lodash/_baseIsNaN.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */ function baseIsNaN(value) {
    return value !== value;
}
module.exports = baseIsNaN;
}),
"[project]/node_modules/lodash/_strictIndexOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1, length = array.length;
    while(++index < length){
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
module.exports = strictIndexOf;
}),
"[project]/node_modules/lodash/_baseIndexOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseFindIndex = __turbopack_context__.r("[project]/node_modules/lodash/_baseFindIndex.js [app-route] (ecmascript)"), baseIsNaN = __turbopack_context__.r("[project]/node_modules/lodash/_baseIsNaN.js [app-route] (ecmascript)"), strictIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_strictIndexOf.js [app-route] (ecmascript)");
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
module.exports = baseIndexOf;
}),
"[project]/node_modules/lodash/_arrayIncludes.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseIndexOf = __turbopack_context__.r("[project]/node_modules/lodash/_baseIndexOf.js [app-route] (ecmascript)");
/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */ function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
}
module.exports = arrayIncludes;
}),
"[project]/node_modules/lodash/_arrayIncludesWith.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */ function arrayIncludesWith(array, value, comparator) {
    var index = -1, length = array == null ? 0 : array.length;
    while(++index < length){
        if (comparator(value, array[index])) {
            return true;
        }
    }
    return false;
}
module.exports = arrayIncludesWith;
}),
"[project]/node_modules/lodash/_arrayMap.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */ function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while(++index < length){
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
module.exports = arrayMap;
}),
"[project]/node_modules/lodash/_cacheHas.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function cacheHas(cache, key) {
    return cache.has(key);
}
module.exports = cacheHas;
}),
"[project]/node_modules/lodash/_baseDifference.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var SetCache = __turbopack_context__.r("[project]/node_modules/lodash/_SetCache.js [app-route] (ecmascript)"), arrayIncludes = __turbopack_context__.r("[project]/node_modules/lodash/_arrayIncludes.js [app-route] (ecmascript)"), arrayIncludesWith = __turbopack_context__.r("[project]/node_modules/lodash/_arrayIncludesWith.js [app-route] (ecmascript)"), arrayMap = __turbopack_context__.r("[project]/node_modules/lodash/_arrayMap.js [app-route] (ecmascript)"), baseUnary = __turbopack_context__.r("[project]/node_modules/lodash/_baseUnary.js [app-route] (ecmascript)"), cacheHas = __turbopack_context__.r("[project]/node_modules/lodash/_cacheHas.js [app-route] (ecmascript)");
/** Used as the size to enable large array optimizations. */ var LARGE_ARRAY_SIZE = 200;
/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */ function baseDifference(array, values, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
    if (!length) {
        return result;
    }
    if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
    }
    if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
    }
    outer: while(++index < length){
        var value = array[index], computed = iteratee == null ? value : iteratee(value);
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while(valuesIndex--){
                if (values[valuesIndex] === computed) {
                    continue outer;
                }
            }
            result.push(value);
        } else if (!includes(values, computed, comparator)) {
            result.push(value);
        }
    }
    return result;
}
module.exports = baseDifference;
}),
"[project]/node_modules/lodash/isArrayLikeObject.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var isArrayLike = __turbopack_context__.r("[project]/node_modules/lodash/isArrayLike.js [app-route] (ecmascript)"), isObjectLike = __turbopack_context__.r("[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)");
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
module.exports = isArrayLikeObject;
}),
"[project]/node_modules/lodash/difference.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseDifference = __turbopack_context__.r("[project]/node_modules/lodash/_baseDifference.js [app-route] (ecmascript)"), baseFlatten = __turbopack_context__.r("[project]/node_modules/lodash/_baseFlatten.js [app-route] (ecmascript)"), baseRest = __turbopack_context__.r("[project]/node_modules/lodash/_baseRest.js [app-route] (ecmascript)"), isArrayLikeObject = __turbopack_context__.r("[project]/node_modules/lodash/isArrayLikeObject.js [app-route] (ecmascript)");
/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */ var difference = baseRest(function(array, values) {
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
module.exports = difference;
}),
"[project]/node_modules/lodash/_Set.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getNative = __turbopack_context__.r("[project]/node_modules/lodash/_getNative.js [app-route] (ecmascript)"), root = __turbopack_context__.r("[project]/node_modules/lodash/_root.js [app-route] (ecmascript)");
/* Built-in method references that are verified to be native. */ var Set = getNative(root, 'Set');
module.exports = Set;
}),
"[project]/node_modules/lodash/noop.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */ function noop() {
// No operation performed.
}
module.exports = noop;
}),
"[project]/node_modules/lodash/_setToArray.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */ function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
        result[++index] = value;
    });
    return result;
}
module.exports = setToArray;
}),
"[project]/node_modules/lodash/_createSet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Set = __turbopack_context__.r("[project]/node_modules/lodash/_Set.js [app-route] (ecmascript)"), noop = __turbopack_context__.r("[project]/node_modules/lodash/noop.js [app-route] (ecmascript)"), setToArray = __turbopack_context__.r("[project]/node_modules/lodash/_setToArray.js [app-route] (ecmascript)");
/** Used as references for various `Number` constants. */ var INFINITY = 1 / 0;
/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */ var createSet = !(Set && 1 / setToArray(new Set([
    ,
    -0
]))[1] == INFINITY) ? noop : function(values) {
    return new Set(values);
};
module.exports = createSet;
}),
"[project]/node_modules/lodash/_baseUniq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var SetCache = __turbopack_context__.r("[project]/node_modules/lodash/_SetCache.js [app-route] (ecmascript)"), arrayIncludes = __turbopack_context__.r("[project]/node_modules/lodash/_arrayIncludes.js [app-route] (ecmascript)"), arrayIncludesWith = __turbopack_context__.r("[project]/node_modules/lodash/_arrayIncludesWith.js [app-route] (ecmascript)"), cacheHas = __turbopack_context__.r("[project]/node_modules/lodash/_cacheHas.js [app-route] (ecmascript)"), createSet = __turbopack_context__.r("[project]/node_modules/lodash/_createSet.js [app-route] (ecmascript)"), setToArray = __turbopack_context__.r("[project]/node_modules/lodash/_setToArray.js [app-route] (ecmascript)");
/** Used as the size to enable large array optimizations. */ var LARGE_ARRAY_SIZE = 200;
/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */ function baseUniq(array, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
    if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
    } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
            return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
    } else {
        seen = iteratee ? [] : result;
    }
    outer: while(++index < length){
        var value = array[index], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while(seenIndex--){
                if (seen[seenIndex] === computed) {
                    continue outer;
                }
            }
            if (iteratee) {
                seen.push(computed);
            }
            result.push(value);
        } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
                seen.push(computed);
            }
            result.push(value);
        }
    }
    return result;
}
module.exports = baseUniq;
}),
"[project]/node_modules/lodash/union.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseFlatten = __turbopack_context__.r("[project]/node_modules/lodash/_baseFlatten.js [app-route] (ecmascript)"), baseRest = __turbopack_context__.r("[project]/node_modules/lodash/_baseRest.js [app-route] (ecmascript)"), baseUniq = __turbopack_context__.r("[project]/node_modules/lodash/_baseUniq.js [app-route] (ecmascript)"), isArrayLikeObject = __turbopack_context__.r("[project]/node_modules/lodash/isArrayLikeObject.js [app-route] (ecmascript)");
/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */ var union = baseRest(function(arrays) {
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
module.exports = union;
}),
"[project]/node_modules/lodash/_overArg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
module.exports = overArg;
}),
"[project]/node_modules/lodash/_getPrototype.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var overArg = __turbopack_context__.r("[project]/node_modules/lodash/_overArg.js [app-route] (ecmascript)");
/** Built-in value references. */ var getPrototype = overArg(Object.getPrototypeOf, Object);
module.exports = getPrototype;
}),
"[project]/node_modules/lodash/isPlainObject.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var baseGetTag = __turbopack_context__.r("[project]/node_modules/lodash/_baseGetTag.js [app-route] (ecmascript)"), getPrototype = __turbopack_context__.r("[project]/node_modules/lodash/_getPrototype.js [app-route] (ecmascript)"), isObjectLike = __turbopack_context__.r("[project]/node_modules/lodash/isObjectLike.js [app-route] (ecmascript)");
/** `Object#toString` result references. */ var objectTag = '[object Object]';
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */ var objectCtorString = funcToString.call(Object);
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */ function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
module.exports = isPlainObject;
}),
"[project]/node_modules/process/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// for now just expose the builtin process global from node.js
module.exports = /*TURBOPACK member replacement*/ __turbopack_context__.g.process;
}),
"[project]/node_modules/event-target-shim/dist/event-target-shim.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */ Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation.
 * @property {boolean} immediateStopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */ /**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */ const privateData = new WeakMap();
/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */ const wrappers = new WeakMap();
/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */ function pd(event) {
    const retv = privateData.get(event);
    console.assert(retv != null, "'this' is expected an Event object, but got", event);
    return retv;
}
/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 * @param data {PrivateData} private data.
 */ function setCancelFlag(data) {
    if (data.passiveListener != null) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error("Unable to preventDefault inside passive event listener invocation.", data.passiveListener);
        }
        return;
    }
    if (!data.event.cancelable) {
        return;
    }
    data.canceled = true;
    if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
    }
}
/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */ /**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */ function Event(eventTarget, event) {
    privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now()
    });
    // https://heycam.github.io/webidl/#Unforgeable
    Object.defineProperty(this, "isTrusted", {
        value: false,
        enumerable: true
    });
    // Define accessors
    const keys = Object.keys(event);
    for(let i = 0; i < keys.length; ++i){
        const key = keys[i];
        if (!(key in this)) {
            Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
    }
}
// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
    /**
     * The type of this event.
     * @type {string}
     */ get type () {
        return pd(this).event.type;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     */ get target () {
        return pd(this).eventTarget;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     */ get currentTarget () {
        return pd(this).currentTarget;
    },
    /**
     * @returns {EventTarget[]} The composed path of this event.
     */ composedPath () {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
            return [];
        }
        return [
            currentTarget
        ];
    },
    /**
     * Constant of NONE.
     * @type {number}
     */ get NONE () {
        return 0;
    },
    /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */ get CAPTURING_PHASE () {
        return 1;
    },
    /**
     * Constant of AT_TARGET.
     * @type {number}
     */ get AT_TARGET () {
        return 2;
    },
    /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */ get BUBBLING_PHASE () {
        return 3;
    },
    /**
     * The target of this event.
     * @type {number}
     */ get eventPhase () {
        return pd(this).eventPhase;
    },
    /**
     * Stop event bubbling.
     * @returns {void}
     */ stopPropagation () {
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
            data.event.stopPropagation();
        }
    },
    /**
     * Stop event bubbling.
     * @returns {void}
     */ stopImmediatePropagation () {
        const data = pd(this);
        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
            data.event.stopImmediatePropagation();
        }
    },
    /**
     * The flag to be bubbling.
     * @type {boolean}
     */ get bubbles () {
        return Boolean(pd(this).event.bubbles);
    },
    /**
     * The flag to be cancelable.
     * @type {boolean}
     */ get cancelable () {
        return Boolean(pd(this).event.cancelable);
    },
    /**
     * Cancel this event.
     * @returns {void}
     */ preventDefault () {
        setCancelFlag(pd(this));
    },
    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */ get defaultPrevented () {
        return pd(this).canceled;
    },
    /**
     * The flag to be composed.
     * @type {boolean}
     */ get composed () {
        return Boolean(pd(this).event.composed);
    },
    /**
     * The unix time of this event.
     * @type {number}
     */ get timeStamp () {
        return pd(this).timeStamp;
    },
    /**
     * The target of this event.
     * @type {EventTarget}
     * @deprecated
     */ get srcElement () {
        return pd(this).eventTarget;
    },
    /**
     * The flag to stop event bubbling.
     * @type {boolean}
     * @deprecated
     */ get cancelBubble () {
        return pd(this).stopped;
    },
    set cancelBubble (value){
        if (!value) {
            return;
        }
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
            data.event.cancelBubble = true;
        }
    },
    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     * @deprecated
     */ get returnValue () {
        return !pd(this).canceled;
    },
    set returnValue (value){
        if (!value) {
            setCancelFlag(pd(this));
        }
    },
    /**
     * Initialize this event object. But do nothing under event dispatching.
     * @param {string} type The event type.
     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
     * @deprecated
     */ initEvent () {
    // Do nothing.
    }
};
// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, "constructor", {
    value: Event,
    configurable: true,
    writable: true
});
// Ensure `event instanceof window.Event` is `true`.
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */ function defineRedirectDescriptor(key) {
    return {
        get () {
            return pd(this).event[key];
        },
        set (value1) {
            pd(this).event[key] = value1;
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */ function defineCallDescriptor(key) {
    return {
        value () {
            const event = pd(this).event;
            return event[key].apply(event, arguments);
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */ function defineWrapper(BaseEvent, proto) {
    const keys = Object.keys(proto);
    if (keys.length === 0) {
        return BaseEvent;
    }
    /** CustomEvent */ function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
    }
    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: {
            value: CustomEvent,
            configurable: true,
            writable: true
        }
    });
    // Define accessors.
    for(let i = 0; i < keys.length; ++i){
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            const isFunc = typeof descriptor.value === "function";
            Object.defineProperty(CustomEvent.prototype, key, isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key));
        }
    }
    return CustomEvent;
}
/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */ function getWrapper(proto) {
    if (proto == null || proto === Object.prototype) {
        return Event;
    }
    let wrapper = wrappers.get(proto);
    if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
    }
    return wrapper;
}
/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */ function wrapEvent(eventTarget, event) {
    const Wrapper = getWrapper(Object.getPrototypeOf(event));
    return new Wrapper(eventTarget, event);
}
/**
 * Get the immediateStopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */ function isStopped(event) {
    return pd(event).immediateStopped;
}
/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */ function setEventPhase(event, eventPhase) {
    pd(event).eventPhase = eventPhase;
}
/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */ function setCurrentTarget(event, currentTarget) {
    pd(event).currentTarget = currentTarget;
}
/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */ function setPassiveListener(event, passiveListener) {
    pd(event).passiveListener = passiveListener;
}
/**
 * @typedef {object} ListenerNode
 * @property {Function} listener
 * @property {1|2|3} listenerType
 * @property {boolean} passive
 * @property {boolean} once
 * @property {ListenerNode|null} next
 * @private
 */ /**
 * @type {WeakMap<object, Map<string, ListenerNode>>}
 * @private
 */ const listenersMap = new WeakMap();
// Listener types
const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;
/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */ function isObject(x) {
    return x !== null && typeof x === "object" //eslint-disable-line no-restricted-syntax
    ;
}
/**
 * Get listeners.
 * @param {EventTarget} eventTarget The event target to get.
 * @returns {Map<string, ListenerNode>} The listeners.
 * @private
 */ function getListeners(eventTarget) {
    const listeners = listenersMap.get(eventTarget);
    if (listeners == null) {
        throw new TypeError("'this' is expected an EventTarget object, but got another value.");
    }
    return listeners;
}
/**
 * Get the property descriptor for the event attribute of a given event.
 * @param {string} eventName The event name to get property descriptor.
 * @returns {PropertyDescriptor} The property descriptor.
 * @private
 */ function defineEventAttributeDescriptor(eventName) {
    return {
        get () {
            const listeners = getListeners(this);
            let node = listeners.get(eventName);
            while(node != null){
                if (node.listenerType === ATTRIBUTE) {
                    return node.listener;
                }
                node = node.next;
            }
            return null;
        },
        set (listener) {
            if (typeof listener !== "function" && !isObject(listener)) {
                listener = null; // eslint-disable-line no-param-reassign
            }
            const listeners = getListeners(this);
            // Traverse to the tail while removing old value.
            let prev = null;
            let node = listeners.get(eventName);
            while(node != null){
                if (node.listenerType === ATTRIBUTE) {
                    // Remove old value.
                    if (prev !== null) {
                        prev.next = node.next;
                    } else if (node.next !== null) {
                        listeners.set(eventName, node.next);
                    } else {
                        listeners.delete(eventName);
                    }
                } else {
                    prev = node;
                }
                node = node.next;
            }
            // Add new value.
            if (listener !== null) {
                const newNode = {
                    listener,
                    listenerType: ATTRIBUTE,
                    passive: false,
                    once: false,
                    next: null
                };
                if (prev === null) {
                    listeners.set(eventName, newNode);
                } else {
                    prev.next = newNode;
                }
            }
        },
        configurable: true,
        enumerable: true
    };
}
/**
 * Define an event attribute (e.g. `eventTarget.onclick`).
 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
 * @param {string} eventName The event name to define.
 * @returns {void}
 */ function defineEventAttribute(eventTargetPrototype, eventName) {
    Object.defineProperty(eventTargetPrototype, `on${eventName}`, defineEventAttributeDescriptor(eventName));
}
/**
 * Define a custom EventTarget with event attributes.
 * @param {string[]} eventNames Event names for event attributes.
 * @returns {EventTarget} The custom EventTarget.
 * @private
 */ function defineCustomEventTarget(eventNames) {
    /** CustomEventTarget */ function CustomEventTarget() {
        EventTarget.call(this);
    }
    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
            value: CustomEventTarget,
            configurable: true,
            writable: true
        }
    });
    for(let i = 0; i < eventNames.length; ++i){
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
    }
    return CustomEventTarget;
}
/**
 * EventTarget.
 *
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 *
 * For example:
 *
 *     class A extends EventTarget {}
 *     class B extends EventTarget("message") {}
 *     class C extends EventTarget("message", "error") {}
 *     class D extends EventTarget(["message", "error"]) {}
 */ function EventTarget() {
    /*eslint-disable consistent-return */ if (this instanceof EventTarget) {
        listenersMap.set(this, new Map());
        return;
    }
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0]);
    }
    if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for(let i = 0; i < arguments.length; ++i){
            types[i] = arguments[i];
        }
        return defineCustomEventTarget(types);
    }
    throw new TypeError("Cannot call a class as a function");
/*eslint-enable consistent-return */ }
// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */ addEventListener (eventName, listener, options) {
        if (listener == null) {
            return;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.");
        }
        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null
        };
        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return;
        }
        // Traverse to the tail while checking duplication..
        let prev = null;
        while(node != null){
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return;
            }
            prev = node;
            node = node.next;
        }
        // Add it.
        prev.next = newNode;
    },
    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */ removeEventListener (eventName, listener, options) {
        if (listener == null) {
            return;
        }
        const listeners = getListeners(this);
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        let prev = null;
        let node = listeners.get(eventName);
        while(node != null){
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return;
            }
            prev = node;
            node = node.next;
        }
    },
    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */ dispatchEvent (event) {
        if (event == null || typeof event.type !== "string") {
            throw new TypeError('"event.type" should be a string.');
        }
        // If listeners aren't registered, terminate.
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
            return true;
        }
        // Since we cannot rewrite several properties, so wrap object.
        const wrappedEvent = wrapEvent(this, event);
        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null;
        while(node != null){
            // Remove this listener if it's once
            if (node.once) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }
            // Call this listener
            setPassiveListener(wrappedEvent, node.passive ? node.listener : null);
            if (typeof node.listener === "function") {
                try {
                    node.listener.call(this, wrappedEvent);
                } catch (err) {
                    if (typeof console !== "undefined" && typeof console.error === "function") {
                        console.error(err);
                    }
                }
            } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                node.listener.handleEvent(wrappedEvent);
            }
            // Break if `event.stopImmediatePropagation` was called.
            if (isStopped(wrappedEvent)) {
                break;
            }
            node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);
        return !wrappedEvent.defaultPrevented;
    }
};
// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", {
    value: EventTarget,
    configurable: true,
    writable: true
});
// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
exports.defineEventAttribute = defineEventAttribute;
exports.EventTarget = EventTarget;
exports.default = EventTarget;
module.exports = EventTarget;
module.exports.EventTarget = module.exports["default"] = EventTarget;
module.exports.defineEventAttribute = defineEventAttribute; //# sourceMappingURL=event-target-shim.js.map
}),
"[project]/node_modules/abort-controller/dist/abort-controller.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */ Object.defineProperty(exports, '__esModule', {
    value: true
});
var eventTargetShim = __turbopack_context__.r("[project]/node_modules/event-target-shim/dist/event-target-shim.js [app-route] (ecmascript)");
/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */ class AbortSignal extends eventTargetShim.EventTarget {
    /**
     * AbortSignal cannot be constructed directly.
     */ constructor(){
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
    }
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */ get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
    }
}
eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
/**
 * Create an AbortSignal object.
 */ function createAbortSignal() {
    const signal = Object.create(AbortSignal.prototype);
    eventTargetShim.EventTarget.call(signal);
    abortedFlags.set(signal, false);
    return signal;
}
/**
 * Abort a given signal.
 */ function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return;
    }
    abortedFlags.set(signal, true);
    signal.dispatchEvent({
        type: "abort"
    });
}
/**
 * Aborted flag for each instances.
 */ const abortedFlags = new WeakMap();
// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: {
        enumerable: true
    }
});
// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal"
    });
}
/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */ class AbortController {
    /**
     * Initialize this controller.
     */ constructor(){
        signals.set(this, createAbortSignal());
    }
    /**
     * Returns the `AbortSignal` object associated with this object.
     */ get signal() {
        return getSignal(this);
    }
    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */ abort() {
        abortSignal(getSignal(this));
    }
}
/**
 * Associated signals.
 */ const signals = new WeakMap();
/**
 * Get the associated signal of a given controller.
 */ function getSignal(controller) {
    const signal = signals.get(controller);
    if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
    }
    return signal;
}
// Properties should be enumerable.
Object.defineProperties(AbortController.prototype, {
    signal: {
        enumerable: true
    },
    abort: {
        enumerable: true
    }
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController"
    });
}
exports.AbortController = AbortController;
exports.AbortSignal = AbortSignal;
exports.default = AbortController;
module.exports = AbortController;
module.exports.AbortController = module.exports["default"] = AbortController;
module.exports.AbortSignal = AbortSignal; //# sourceMappingURL=abort-controller.js.map
}),
"[project]/node_modules/path-scurry/node_modules/lru-cache/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @module LRUCache
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LRUCache = void 0;
const perf = typeof performance === 'object' && performance && typeof performance.now === 'function' ? performance : Date;
const warned = new Set();
/* c8 ignore start */ const PROCESS = typeof process === 'object' && !!process ? process : {};
/* c8 ignore start */ const emitWarning = (msg, type, code, fn)=>{
    typeof PROCESS.emitWarning === 'function' ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */ if (typeof AC === 'undefined') {
    //@ts-ignore
    AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
            this._onabort.push(fn);
        }
    };
    //@ts-ignore
    AC = class AbortController {
        constructor(){
            warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
            if (this.signal.aborted) return;
            //@ts-ignore
            this.signal.reason = reason;
            //@ts-ignore
            this.signal.aborted = true;
            //@ts-ignore
            for (const fn of this.signal._onabort){
                fn(reason);
            }
            this.signal.onabort?.(reason);
        }
    };
    let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1';
    const warnACPolyfill = ()=>{
        if (!printACPolyfillWarning) return;
        printACPolyfillWarning = false;
        emitWarning('AbortController is not defined. If using lru-cache in ' + 'node 14, load an AbortController polyfill from the ' + '`node-abort-controller` package. A minimal polyfill is ' + 'provided for use by LRUCache.fetch(), but it should not be ' + 'relied upon in other contexts (eg, passing it to other APIs that ' + 'use AbortController/AbortSignal might have undesirable effects). ' + 'You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.', 'NO_ABORT_CONTROLLER', 'ENOTSUP', warnACPolyfill);
    };
}
/* c8 ignore stop */ const shouldWarn = (code)=>!warned.has(code);
const TYPE = Symbol('type');
const isPosInt = (n)=>n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */ // This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = (max)=>!isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
/* c8 ignore stop */ class ZeroArray extends Array {
    constructor(size){
        super(size);
        this.fill(0);
    }
}
class Stack {
    heap;
    length;
    // private constructor
    static #constructing = false;
    static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls) return [];
        Stack.#constructing = true;
        const s = new Stack(max, HeapCls);
        Stack.#constructing = false;
        return s;
    }
    constructor(max, HeapCls){
        /* c8 ignore start */ if (!Stack.#constructing) {
            throw new TypeError('instantiate Stack using Stack.create(n)');
        }
        /* c8 ignore stop */ this.heap = new HeapCls(max);
        this.length = 0;
    }
    push(n) {
        this.heap[this.length++] = n;
    }
    pop() {
        return this.heap[--this.length];
    }
}
/**
 * Default export, the thing you're using this module to get.
 *
 * The `K` and `V` types define the key and value types, respectively. The
 * optional `FC` type defines the type of the `context` object passed to
 * `cache.fetch()` and `cache.memo()`.
 *
 * Keys and values **must not** be `null` or `undefined`.
 *
 * All properties from the options object (with the exception of `max`,
 * `maxSize`, `fetchMethod`, `memoMethod`, `dispose` and `disposeAfter`) are
 * added as normal public members. (The listed options are read-only getters.)
 *
 * Changing any of these will alter the defaults for subsequent method calls.
 */ class LRUCache {
    // options that cannot be changed without disaster
    #max;
    #maxSize;
    #dispose;
    #disposeAfter;
    #fetchMethod;
    #memoMethod;
    /**
     * {@link LRUCache.OptionsBase.ttl}
     */ ttl;
    /**
     * {@link LRUCache.OptionsBase.ttlResolution}
     */ ttlResolution;
    /**
     * {@link LRUCache.OptionsBase.ttlAutopurge}
     */ ttlAutopurge;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnGet}
     */ updateAgeOnGet;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnHas}
     */ updateAgeOnHas;
    /**
     * {@link LRUCache.OptionsBase.allowStale}
     */ allowStale;
    /**
     * {@link LRUCache.OptionsBase.noDisposeOnSet}
     */ noDisposeOnSet;
    /**
     * {@link LRUCache.OptionsBase.noUpdateTTL}
     */ noUpdateTTL;
    /**
     * {@link LRUCache.OptionsBase.maxEntrySize}
     */ maxEntrySize;
    /**
     * {@link LRUCache.OptionsBase.sizeCalculation}
     */ sizeCalculation;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
     */ noDeleteOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
     */ noDeleteOnStaleGet;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
     */ allowStaleOnFetchAbort;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
     */ allowStaleOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.ignoreFetchAbort}
     */ ignoreFetchAbort;
    // computed properties
    #size;
    #calculatedSize;
    #keyMap;
    #keyList;
    #valList;
    #next;
    #prev;
    #head;
    #tail;
    #free;
    #disposed;
    #sizes;
    #starts;
    #ttls;
    #hasDispose;
    #hasFetchMethod;
    #hasDisposeAfter;
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */ static unsafeExposeInternals(c) {
        return {
            // properties
            starts: c.#starts,
            ttls: c.#ttls,
            sizes: c.#sizes,
            keyMap: c.#keyMap,
            keyList: c.#keyList,
            valList: c.#valList,
            next: c.#next,
            prev: c.#prev,
            get head () {
                return c.#head;
            },
            get tail () {
                return c.#tail;
            },
            free: c.#free,
            // methods
            isBackgroundFetch: (p)=>c.#isBackgroundFetch(p),
            backgroundFetch: (k, index, options, context)=>c.#backgroundFetch(k, index, options, context),
            moveToTail: (index)=>c.#moveToTail(index),
            indexes: (options)=>c.#indexes(options),
            rindexes: (options)=>c.#rindexes(options),
            isStale: (index)=>c.#isStale(index)
        };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */ get max() {
        return this.#max;
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */ get maxSize() {
        return this.#maxSize;
    }
    /**
     * The total computed size of items in the cache (read-only)
     */ get calculatedSize() {
        return this.#calculatedSize;
    }
    /**
     * The number of items stored in the cache (read-only)
     */ get size() {
        return this.#size;
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */ get fetchMethod() {
        return this.#fetchMethod;
    }
    get memoMethod() {
        return this.#memoMethod;
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */ get dispose() {
        return this.#dispose;
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */ get disposeAfter() {
        return this.#disposeAfter;
    }
    constructor(options){
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
        if (max !== 0 && !isPosInt(max)) {
            throw new TypeError('max option must be a nonnegative integer');
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
            throw new Error('invalid max value: ' + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
                throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize');
            }
            if (typeof this.sizeCalculation !== 'function') {
                throw new TypeError('sizeCalculation set to non-function');
            }
        }
        if (memoMethod !== undefined && typeof memoMethod !== 'function') {
            throw new TypeError('memoMethod must be a function if defined');
        }
        this.#memoMethod = memoMethod;
        if (fetchMethod !== undefined && typeof fetchMethod !== 'function') {
            throw new TypeError('fetchMethod must be a function if specified');
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = new Map();
        this.#keyList = new Array(max).fill(undefined);
        this.#valList = new Array(max).fill(undefined);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === 'function') {
            this.#dispose = dispose;
        }
        if (typeof disposeAfter === 'function') {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
        } else {
            this.#disposeAfter = undefined;
            this.#disposed = undefined;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        // NB: maxEntrySize is set to maxSize if it's set
        if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
                if (!isPosInt(this.#maxSize)) {
                    throw new TypeError('maxSize must be a positive integer if specified');
                }
            }
            if (!isPosInt(this.maxEntrySize)) {
                throw new TypeError('maxEntrySize must be a positive integer if specified');
            }
            this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
            if (!isPosInt(this.ttl)) {
                throw new TypeError('ttl must be a positive integer if specified');
            }
            this.#initializeTTLTracking();
        }
        // do not allow completely unbounded caches
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError('At least one of max, maxSize, or ttl is required');
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = 'LRU_CACHE_UNBOUNDED';
            if (shouldWarn(code)) {
                warned.add(code);
                const msg = 'TTL caching without ttlAutopurge, max, or maxSize can ' + 'result in unbounded memory consumption.';
                emitWarning(msg, 'UnboundedCacheWarning', code, LRUCache);
            }
        }
    }
    /**
     * Return the number of ms left in the item's TTL. If item is not in cache,
     * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
     */ getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
    }
    #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now())=>{
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
                const t = setTimeout(()=>{
                    if (this.#isStale(index)) {
                        this.#delete(this.#keyList[index], 'expire');
                    }
                }, ttl + 1);
                // unref() not supported on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
        };
        this.#updateItemAge = (index)=>{
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index)=>{
            if (ttls[index]) {
                const ttl = ttls[index];
                const start = starts[index];
                /* c8 ignore next */ if (!ttl || !start) return;
                status.ttl = ttl;
                status.start = start;
                status.now = cachedNow || getNow();
                const age = status.now - start;
                status.remainingTTL = ttl - age;
            }
        };
        // debounce calls to perf.now() to 1s so we're not hitting
        // that costly call repeatedly.
        let cachedNow = 0;
        const getNow = ()=>{
            const n = perf.now();
            if (this.ttlResolution > 0) {
                cachedNow = n;
                const t = setTimeout(()=>cachedNow = 0, this.ttlResolution);
                // not available on all platforms
                /* c8 ignore start */ if (t.unref) {
                    t.unref();
                }
            /* c8 ignore stop */ }
            return n;
        };
        this.getRemainingTTL = (key)=>{
            const index = this.#keyMap.get(key);
            if (index === undefined) {
                return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (!ttl || !start) {
                return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
        };
        this.#isStale = (index)=>{
            const s = starts[index];
            const t = ttls[index];
            return !!t && !!s && (cachedNow || getNow()) - s > t;
        };
    }
    // conditionally set private methods related to TTL
    #updateItemAge = ()=>{};
    #statusTTL = ()=>{};
    #setItemTTL = ()=>{};
    /* c8 ignore stop */ #isStale = ()=>false;
    #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = (index)=>{
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation)=>{
            // provisionally accept background fetches.
            // actual value size will be checked when they return.
            if (this.#isBackgroundFetch(v)) {
                return 0;
            }
            if (!isPosInt(size)) {
                if (sizeCalculation) {
                    if (typeof sizeCalculation !== 'function') {
                        throw new TypeError('sizeCalculation must be a function');
                    }
                    size = sizeCalculation(v, k);
                    if (!isPosInt(size)) {
                        throw new TypeError('sizeCalculation return invalid (expect positive integer)');
                    }
                } else {
                    throw new TypeError('invalid size value (must be positive integer). ' + 'When maxSize or maxEntrySize is used, sizeCalculation ' + 'or size must be set.');
                }
            }
            return size;
        };
        this.#addItemSize = (index, size, status)=>{
            sizes[index] = size;
            if (this.#maxSize) {
                const maxSize = this.#maxSize - sizes[index];
                while(this.#calculatedSize > maxSize){
                    this.#evict(true);
                }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
                status.entrySize = size;
                status.totalCalculatedSize = this.#calculatedSize;
            }
        };
    }
    #removeItemSize = (_i)=>{};
    #addItemSize = (_i, _s, _st)=>{};
    #requireSize = (_k, _v, size, sizeCalculation)=>{
        if (size || sizeCalculation) {
            throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache');
        }
        return 0;
    };
    *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#tail; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#head) {
                    break;
                } else {
                    i = this.#prev[i];
                }
            }
        }
    }
    *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for(let i = this.#head; true;){
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#tail) {
                    break;
                } else {
                    i = this.#next[i];
                }
            }
        }
    }
    #isValidIndex(index) {
        return index !== undefined && this.#keyMap.get(this.#keyList[index]) === index;
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */ *entries() {
        for (const i of this.#indexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */ *rentries() {
        for (const i of this.#rindexes()){
            if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield [
                    this.#keyList[i],
                    this.#valList[i]
                ];
            }
        }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */ *keys() {
        for (const i of this.#indexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */ *rkeys() {
        for (const i of this.#rindexes()){
            const k = this.#keyList[i];
            if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */ *values() {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */ *rvalues() {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */ [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * A String value that is used in the creation of the default string
     * description of an object. Called by the built-in method
     * `Object.prototype.toString`.
     */ [Symbol.toStringTag] = 'LRUCache';
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
     */ find(fn, getOptions = {}) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            if (fn(value, this.#keyList[i], this)) {
                return this.get(this.#keyList[i], getOptions);
            }
        }
    }
    /**
     * Call the supplied function on each item in the cache, in order from most
     * recently used to least recently used.
     *
     * `fn` is called as `fn(value, key, cache)`.
     *
     * If `thisp` is provided, function will be called in the `this`-context of
     * the provided object, or the cache if no `thisp` object is provided.
     *
     * Does not update age or recenty of use, or iterate over stale values.
     */ forEach(fn, thisp = this) {
        for (const i of this.#indexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */ rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()){
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined) continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */ purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({
            allowStale: true
        })){
            if (this.#isStale(i)) {
                this.#delete(this.#keyList[i], 'expire');
                deleted = true;
            }
        }
        return deleted;
    }
    /**
     * Get the extended info about a given entry, to get its value, size, and
     * TTL info simultaneously. Returns `undefined` if the key is not present.
     *
     * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
     * serialization, the `start` value is always the current timestamp, and the
     * `ttl` is a calculated remaining time to live (negative if expired).
     *
     * Always returns stale values, if their info is found in the cache, so be
     * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
     * if relevant.
     */ info(key) {
        const i = this.#keyMap.get(key);
        if (i === undefined) return undefined;
        const v = this.#valList[i];
        const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        if (value === undefined) return undefined;
        const entry = {
            value
        };
        if (this.#ttls && this.#starts) {
            const ttl = this.#ttls[i];
            const start = this.#starts[i];
            if (ttl && start) {
                const remain = ttl - (perf.now() - start);
                entry.ttl = remain;
                entry.start = Date.now();
            }
        }
        if (this.#sizes) {
            entry.size = this.#sizes[i];
        }
        return entry;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to {@link LRLUCache#load}.
     *
     * The `start` fields are calculated relative to a portable `Date.now()`
     * timestamp, even if `performance.now()` is available.
     *
     * Stale entries are always included in the `dump`, even if
     * {@link LRUCache.OptionsBase.allowStale} is false.
     *
     * Note: this returns an actual array, not a generator, so it can be more
     * easily passed around.
     */ dump() {
        const arr = [];
        for (const i of this.#indexes({
            allowStale: true
        })){
            const key = this.#keyList[i];
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
            if (value === undefined || key === undefined) continue;
            const entry = {
                value
            };
            if (this.#ttls && this.#starts) {
                entry.ttl = this.#ttls[i];
                // always dump the start relative to a portable timestamp
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = perf.now() - this.#starts[i];
                entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
                entry.size = this.#sizes[i];
            }
            arr.unshift([
                key,
                entry
            ]);
        }
        return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     *
     * The shape of the resulting cache may be different if the same options are
     * not used in both caches.
     *
     * The `start` fields are assumed to be calculated relative to a portable
     * `Date.now()` timestamp, even if `performance.now()` is available.
     */ load(arr) {
        this.clear();
        for (const [key, entry] of arr){
            if (entry.start) {
                // entry.start is a portable timestamp, but we may be using
                // node's performance.now(), so calculate the offset, so that
                // we get the intended remaining TTL, no matter how long it's
                // been on ice.
                //
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = Date.now() - entry.start;
                entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
        }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     *
     * Fields on the {@link LRUCache.SetOptions} options param will override
     * their corresponding values in the constructor options for the scope
     * of this single `set()` operation.
     *
     * If `start` is provided, then that will set the effective start
     * time for the TTL calculation. Note that this must be a previous
     * value of `performance.now()` if supported, or a previous value of
     * `Date.now()` if not.
     *
     * Options object may also include `size`, which will prevent
     * calling the `sizeCalculation` function and just use the specified
     * number if it is a positive integer, and `noDisposeOnSet` which
     * will prevent calling a `dispose` function in the case of
     * overwrites.
     *
     * If the `size` (or return value of `sizeCalculation`) for a given
     * entry is greater than `maxEntrySize`, then the item will not be
     * added to the cache.
     *
     * Will update the recency of the entry.
     *
     * If the value is `undefined`, then this is an alias for
     * `cache.delete(key)`. `undefined` is never stored in the cache.
     */ set(k, v, setOptions = {}) {
        if (v === undefined) {
            this.delete(k);
            return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        // if the item doesn't fit, don't do anything
        // NB: maxEntrySize set to maxSize by default
        if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
                status.set = 'miss';
                status.maxEntrySizeExceeded = true;
            }
            // have to delete, in case something is there already.
            this.#delete(k, 'set');
            return this;
        }
        let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
        if (index === undefined) {
            // addition
            index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
            this.#keyList[index] = k;
            this.#valList[index] = v;
            this.#keyMap.set(k, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status) status.set = 'add';
            noUpdateTTL = false;
        } else {
            // update
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v !== oldVal) {
                if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                    oldVal.__abortController.abort(new Error('replaced'));
                    const { __staleWhileFetching: s } = oldVal;
                    if (s !== undefined && !noDisposeOnSet) {
                        if (this.#hasDispose) {
                            this.#dispose?.(s, k, 'set');
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                s,
                                k,
                                'set'
                            ]);
                        }
                    }
                } else if (!noDisposeOnSet) {
                    if (this.#hasDispose) {
                        this.#dispose?.(oldVal, k, 'set');
                    }
                    if (this.#hasDisposeAfter) {
                        this.#disposed?.push([
                            oldVal,
                            k,
                            'set'
                        ]);
                    }
                }
                this.#removeItemSize(index);
                this.#addItemSize(index, size, status);
                this.#valList[index] = v;
                if (status) {
                    status.set = 'replace';
                    const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
                    if (oldValue !== undefined) status.oldValue = oldValue;
                }
            } else if (status) {
                status.set = 'update';
            }
        }
        if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
        }
        if (this.#ttls) {
            if (!noUpdateTTL) {
                this.#setItemTTL(index, ttl, start);
            }
            if (status) this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */ pop() {
        try {
            while(this.#size){
                const val = this.#valList[this.#head];
                this.#evict(true);
                if (this.#isBackgroundFetch(val)) {
                    if (val.__staleWhileFetching) {
                        return val.__staleWhileFetching;
                    }
                } else if (val !== undefined) {
                    return val;
                }
            }
        } finally{
            if (this.#hasDisposeAfter && this.#disposed) {
                const dt = this.#disposed;
                let task;
                while(task = dt?.shift()){
                    this.#disposeAfter?.(...task);
                }
            }
        }
    }
    #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error('evicted'));
        } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
                this.#dispose?.(v, k, 'evict');
            }
            if (this.#hasDisposeAfter) {
                this.#disposed?.push([
                    v,
                    k,
                    'evict'
                ]);
            }
        }
        this.#removeItemSize(head);
        // if we aren't about to use the index, then null these out
        if (free) {
            this.#keyList[head] = undefined;
            this.#valList[head] = undefined;
            this.#free.push(head);
        }
        if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
        } else {
            this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Check if a key is in the cache, without updating the recency of
     * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
     * to `true` in either the options or the constructor.
     *
     * Will return `false` if the item is stale, even though it is technically in
     * the cache. The difference can be determined (if it matters) by using a
     * `status` argument, and inspecting the `has` field.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */ has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === undefined) {
                return false;
            }
            if (!this.#isStale(index)) {
                if (updateAgeOnHas) {
                    this.#updateItemAge(index);
                }
                if (status) {
                    status.has = 'hit';
                    this.#statusTTL(status, index);
                }
                return true;
            } else if (status) {
                status.has = 'stale';
                this.#statusTTL(status, index);
            }
        } else if (status) {
            status.has = 'miss';
        }
        return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */ peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index === undefined || !allowStale && this.#isStale(index)) {
            return;
        }
        const v = this.#valList[index];
        // either stale and allowed, or forcing a refresh of non-stale value
        return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    }
    #backgroundFetch(k, index, options, context) {
        const v = index === undefined ? undefined : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
            return v;
        }
        const ac = new AC();
        const { signal } = options;
        // when/if our AC signals, then stop listening to theirs.
        signal?.addEventListener('abort', ()=>ac.abort(signal.reason), {
            signal: ac.signal
        });
        const fetchOpts = {
            signal: ac.signal,
            options,
            context
        };
        const cb = (v, updateCache = false)=>{
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
            if (options.status) {
                if (aborted && !updateCache) {
                    options.status.fetchAborted = true;
                    options.status.fetchError = ac.signal.reason;
                    if (ignoreAbort) options.status.fetchAbortIgnored = true;
                } else {
                    options.status.fetchResolved = true;
                }
            }
            if (aborted && !ignoreAbort && !updateCache) {
                return fetchFail(ac.signal.reason);
            }
            // either we didn't abort, and are still here, or we did, and ignored
            const bf = p;
            if (this.#valList[index] === p) {
                if (v === undefined) {
                    if (bf.__staleWhileFetching) {
                        this.#valList[index] = bf.__staleWhileFetching;
                    } else {
                        this.#delete(k, 'fetch');
                    }
                } else {
                    if (options.status) options.status.fetchUpdated = true;
                    this.set(k, v, fetchOpts.options);
                }
            }
            return v;
        };
        const eb = (er)=>{
            if (options.status) {
                options.status.fetchRejected = true;
                options.status.fetchError = er;
            }
            return fetchFail(er);
        };
        const fetchFail = (er)=>{
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf = p;
            if (this.#valList[index] === p) {
                // if we allow stale on fetch rejections, then we need to ensure that
                // the stale value is not removed from the cache when the fetch fails.
                const del = !noDelete || bf.__staleWhileFetching === undefined;
                if (del) {
                    this.#delete(k, 'fetch');
                } else if (!allowStaleAborted) {
                    // still replace the *promise* with the stale value,
                    // since we are done with the promise at this point.
                    // leave it untouched if we're still waiting for an
                    // aborted background fetch that hasn't yet returned.
                    this.#valList[index] = bf.__staleWhileFetching;
                }
            }
            if (allowStale) {
                if (options.status && bf.__staleWhileFetching !== undefined) {
                    options.status.returnedStale = true;
                }
                return bf.__staleWhileFetching;
            } else if (bf.__returned === bf) {
                throw er;
            }
        };
        const pcall = (res, rej)=>{
            const fmp = this.#fetchMethod?.(k, v, fetchOpts);
            if (fmp && fmp instanceof Promise) {
                fmp.then((v)=>res(v === undefined ? undefined : v), rej);
            }
            // ignored, we go until we finish, regardless.
            // defer check until we are actually aborting,
            // so fetchMethod can override.
            ac.signal.addEventListener('abort', ()=>{
                if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
                    res(undefined);
                    // when it eventually resolves, update the cache.
                    if (options.allowStaleOnFetchAbort) {
                        res = (v)=>cb(v, true);
                    }
                }
            });
        };
        if (options.status) options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
            __abortController: ac,
            __staleWhileFetching: v,
            __returned: undefined
        });
        if (index === undefined) {
            // internal, don't expose status.
            this.set(k, bf, {
                ...fetchOpts.options,
                status: undefined
            });
            index = this.#keyMap.get(k);
        } else {
            this.#valList[index] = bf;
        }
        return bf;
    }
    #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod) return false;
        const b = p;
        return !!b && b instanceof Promise && b.hasOwnProperty('__staleWhileFetching') && b.__abortController instanceof AC;
    }
    async fetch(k, fetchOptions = {}) {
        const { // get options
        allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, // set options
        ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal } = fetchOptions;
        if (!this.#hasFetchMethod) {
            if (status) status.fetch = 'get';
            return this.get(k, {
                allowStale,
                updateAgeOnGet,
                noDeleteOnStaleGet,
                status
            });
        }
        const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal
        };
        let index = this.#keyMap.get(k);
        if (index === undefined) {
            if (status) status.fetch = 'miss';
            const p = this.#backgroundFetch(k, index, options, context);
            return p.__returned = p;
        } else {
            // in cache, maybe already fetching
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                const stale = allowStale && v.__staleWhileFetching !== undefined;
                if (status) {
                    status.fetch = 'inflight';
                    if (stale) status.returnedStale = true;
                }
                return stale ? v.__staleWhileFetching : v.__returned = v;
            }
            // if we force a refresh, that means do NOT serve the cached value,
            // unless we are already in the process of refreshing the cache.
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
                if (status) status.fetch = 'hit';
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                if (status) this.#statusTTL(status, index);
                return v;
            }
            // ok, it is stale or a forced refresh, and not already fetching.
            // refresh the cache.
            const p = this.#backgroundFetch(k, index, options, context);
            const hasStale = p.__staleWhileFetching !== undefined;
            const staleVal = hasStale && allowStale;
            if (status) {
                status.fetch = isStale ? 'stale' : 'refresh';
                if (staleVal && isStale) status.returnedStale = true;
            }
            return staleVal ? p.__staleWhileFetching : p.__returned = p;
        }
    }
    async forceFetch(k, fetchOptions = {}) {
        const v = await this.fetch(k, fetchOptions);
        if (v === undefined) throw new Error('fetch() returned undefined');
        return v;
    }
    memo(k, memoOptions = {}) {
        const memoMethod = this.#memoMethod;
        if (!memoMethod) {
            throw new Error('no memoMethod provided to constructor');
        }
        const { context, forceRefresh, ...options } = memoOptions;
        const v = this.get(k, options);
        if (!forceRefresh && v !== undefined) return v;
        const vv = memoMethod(k, v, {
            options,
            context
        });
        this.set(k, vv, options);
        return vv;
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */ get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status) this.#statusTTL(status, index);
            if (this.#isStale(index)) {
                if (status) status.get = 'stale';
                // delete only if not an in-flight background fetch
                if (!fetching) {
                    if (!noDeleteOnStaleGet) {
                        this.#delete(k, 'expire');
                    }
                    if (status && allowStale) status.returnedStale = true;
                    return allowStale ? value : undefined;
                } else {
                    if (status && allowStale && value.__staleWhileFetching !== undefined) {
                        status.returnedStale = true;
                    }
                    return allowStale ? value.__staleWhileFetching : undefined;
                }
            } else {
                if (status) status.get = 'hit';
                // if we're currently fetching it, we don't actually have it yet
                // it's not stale, which means this isn't a staleWhileRefetching.
                // If it's not stale, and fetching, AND has a __staleWhileFetching
                // value, then that means the user fetched with {forceRefresh:true},
                // so it's safe to return that value.
                if (fetching) {
                    return value.__staleWhileFetching;
                }
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                return value;
            }
        } else if (status) {
            status.get = 'miss';
        }
    }
    #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
    }
    #moveToTail(index) {
        // if tail already, nothing to do
        // if head, move head to next[index]
        // else
        //   move next[prev[index]] to next[index] (head has no prev)
        //   move prev[next[index]] to prev[index]
        // prev[index] = tail
        // next[tail] = index
        // tail = index
        if (index !== this.#tail) {
            if (index === this.#head) {
                this.#head = this.#next[index];
            } else {
                this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
        }
    }
    /**
     * Deletes a key out of the cache.
     *
     * Returns true if the key was deleted, false otherwise.
     */ delete(k) {
        return this.#delete(k, 'delete');
    }
    #delete(k, reason) {
        let deleted = false;
        if (this.#size !== 0) {
            const index = this.#keyMap.get(k);
            if (index !== undefined) {
                deleted = true;
                if (this.#size === 1) {
                    this.#clear(reason);
                } else {
                    this.#removeItemSize(index);
                    const v = this.#valList[index];
                    if (this.#isBackgroundFetch(v)) {
                        v.__abortController.abort(new Error('deleted'));
                    } else if (this.#hasDispose || this.#hasDisposeAfter) {
                        if (this.#hasDispose) {
                            this.#dispose?.(v, k, reason);
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([
                                v,
                                k,
                                reason
                            ]);
                        }
                    }
                    this.#keyMap.delete(k);
                    this.#keyList[index] = undefined;
                    this.#valList[index] = undefined;
                    if (index === this.#tail) {
                        this.#tail = this.#prev[index];
                    } else if (index === this.#head) {
                        this.#head = this.#next[index];
                    } else {
                        const pi = this.#prev[index];
                        this.#next[pi] = this.#next[index];
                        const ni = this.#next[index];
                        this.#prev[ni] = this.#prev[index];
                    }
                    this.#size--;
                    this.#free.push(index);
                }
            }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
        return deleted;
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */ clear() {
        return this.#clear('delete');
    }
    #clear(reason) {
        for (const index of this.#rindexes({
            allowStale: true
        })){
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error('deleted'));
            } else {
                const k = this.#keyList[index];
                if (this.#hasDispose) {
                    this.#dispose?.(v, k, reason);
                }
                if (this.#hasDisposeAfter) {
                    this.#disposed?.push([
                        v,
                        k,
                        reason
                    ]);
                }
            }
        }
        this.#keyMap.clear();
        this.#valList.fill(undefined);
        this.#keyList.fill(undefined);
        if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
        }
        if (this.#sizes) {
            this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while(task = dt?.shift()){
                this.#disposeAfter?.(...task);
            }
        }
    }
}
exports.LRUCache = LRUCache; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/minipass/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Minipass = exports.isWritable = exports.isReadable = exports.isStream = void 0;
const proc = typeof process === 'object' && process ? process : {
    stdout: null,
    stderr: null
};
const node_events_1 = __turbopack_context__.r("[externals]/node:events [external] (node:events, cjs)");
const node_stream_1 = __importDefault(__turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)"));
const node_string_decoder_1 = __turbopack_context__.r("[externals]/node:string_decoder [external] (node:string_decoder, cjs)");
/**
 * Return true if the argument is a Minipass stream, Node stream, or something
 * else that Minipass can interact with.
 */ const isStream = (s)=>!!s && typeof s === 'object' && (s instanceof Minipass || s instanceof node_stream_1.default || (0, exports.isReadable)(s) || (0, exports.isWritable)(s));
exports.isStream = isStream;
/**
 * Return true if the argument is a valid {@link Minipass.Readable}
 */ const isReadable = (s)=>!!s && typeof s === 'object' && s instanceof node_events_1.EventEmitter && typeof s.pipe === 'function' && // node core Writable streams have a pipe() method, but it throws
    s.pipe !== node_stream_1.default.Writable.prototype.pipe;
exports.isReadable = isReadable;
/**
 * Return true if the argument is a valid {@link Minipass.Writable}
 */ const isWritable = (s)=>!!s && typeof s === 'object' && s instanceof node_events_1.EventEmitter && typeof s.write === 'function' && typeof s.end === 'function';
exports.isWritable = isWritable;
const EOF = Symbol('EOF');
const MAYBE_EMIT_END = Symbol('maybeEmitEnd');
const EMITTED_END = Symbol('emittedEnd');
const EMITTING_END = Symbol('emittingEnd');
const EMITTED_ERROR = Symbol('emittedError');
const CLOSED = Symbol('closed');
const READ = Symbol('read');
const FLUSH = Symbol('flush');
const FLUSHCHUNK = Symbol('flushChunk');
const ENCODING = Symbol('encoding');
const DECODER = Symbol('decoder');
const FLOWING = Symbol('flowing');
const PAUSED = Symbol('paused');
const RESUME = Symbol('resume');
const BUFFER = Symbol('buffer');
const PIPES = Symbol('pipes');
const BUFFERLENGTH = Symbol('bufferLength');
const BUFFERPUSH = Symbol('bufferPush');
const BUFFERSHIFT = Symbol('bufferShift');
const OBJECTMODE = Symbol('objectMode');
// internal event when stream is destroyed
const DESTROYED = Symbol('destroyed');
// internal event when stream has an error
const ERROR = Symbol('error');
const EMITDATA = Symbol('emitData');
const EMITEND = Symbol('emitEnd');
const EMITEND2 = Symbol('emitEnd2');
const ASYNC = Symbol('async');
const ABORT = Symbol('abort');
const ABORTED = Symbol('aborted');
const SIGNAL = Symbol('signal');
const DATALISTENERS = Symbol('dataListeners');
const DISCARDED = Symbol('discarded');
const defer = (fn)=>Promise.resolve().then(fn);
const nodefer = (fn)=>fn();
const isEndish = (ev)=>ev === 'end' || ev === 'finish' || ev === 'prefinish';
const isArrayBufferLike = (b)=>b instanceof ArrayBuffer || !!b && typeof b === 'object' && b.constructor && b.constructor.name === 'ArrayBuffer' && b.byteLength >= 0;
const isArrayBufferView = (b)=>!Buffer.isBuffer(b) && ArrayBuffer.isView(b);
/**
 * Internal class representing a pipe to a destination stream.
 *
 * @internal
 */ class Pipe {
    src;
    dest;
    opts;
    ondrain;
    constructor(src, dest, opts){
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = ()=>src[RESUME]();
        this.dest.on('drain', this.ondrain);
    }
    unpipe() {
        this.dest.removeListener('drain', this.ondrain);
    }
    // only here for the prototype
    /* c8 ignore start */ proxyErrors(_er) {}
    /* c8 ignore stop */ end() {
        this.unpipe();
        if (this.opts.end) this.dest.end();
    }
}
/**
 * Internal class representing a pipe to a destination stream where
 * errors are proxied.
 *
 * @internal
 */ class PipeProxyErrors extends Pipe {
    unpipe() {
        this.src.removeListener('error', this.proxyErrors);
        super.unpipe();
    }
    constructor(src, dest, opts){
        super(src, dest, opts);
        this.proxyErrors = (er)=>this.dest.emit('error', er);
        src.on('error', this.proxyErrors);
    }
}
const isObjectModeOptions = (o)=>!!o.objectMode;
const isEncodingOptions = (o)=>!o.objectMode && !!o.encoding && o.encoding !== 'buffer';
/**
 * Main export, the Minipass class
 *
 * `RType` is the type of data emitted, defaults to Buffer
 *
 * `WType` is the type of data to be written, if RType is buffer or string,
 * then any {@link Minipass.ContiguousData} is allowed.
 *
 * `Events` is the set of event handler signatures that this object
 * will emit, see {@link Minipass.Events}
 */ class Minipass extends node_events_1.EventEmitter {
    [FLOWING] = false;
    [PAUSED] = false;
    [PIPES] = [];
    [BUFFER] = [];
    [OBJECTMODE];
    [ENCODING];
    [ASYNC];
    [DECODER];
    [EOF] = false;
    [EMITTED_END] = false;
    [EMITTING_END] = false;
    [CLOSED] = false;
    [EMITTED_ERROR] = null;
    [BUFFERLENGTH] = 0;
    [DESTROYED] = false;
    [SIGNAL];
    [ABORTED] = false;
    [DATALISTENERS] = 0;
    [DISCARDED] = false;
    /**
     * true if the stream can be written
     */ writable = true;
    /**
     * true if the stream can be read
     */ readable = true;
    /**
     * If `RType` is Buffer, then options do not need to be provided.
     * Otherwise, an options object must be provided to specify either
     * {@link Minipass.SharedOptions.objectMode} or
     * {@link Minipass.SharedOptions.encoding}, as appropriate.
     */ constructor(...args){
        const options = args[0] || {};
        super();
        if (options.objectMode && typeof options.encoding === 'string') {
            throw new TypeError('Encoding and objectMode may not be used together');
        }
        if (isObjectModeOptions(options)) {
            this[OBJECTMODE] = true;
            this[ENCODING] = null;
        } else if (isEncodingOptions(options)) {
            this[ENCODING] = options.encoding;
            this[OBJECTMODE] = false;
        } else {
            this[OBJECTMODE] = false;
            this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING] ? new node_string_decoder_1.StringDecoder(this[ENCODING]) : null;
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposeBuffer === true) {
            Object.defineProperty(this, 'buffer', {
                get: ()=>this[BUFFER]
            });
        }
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposePipes === true) {
            Object.defineProperty(this, 'pipes', {
                get: ()=>this[PIPES]
            });
        }
        const { signal } = options;
        if (signal) {
            this[SIGNAL] = signal;
            if (signal.aborted) {
                this[ABORT]();
            } else {
                signal.addEventListener('abort', ()=>this[ABORT]());
            }
        }
    }
    /**
     * The amount of data stored in the buffer waiting to be read.
     *
     * For Buffer strings, this will be the total byte length.
     * For string encoding streams, this will be the string character length,
     * according to JavaScript's `string.length` logic.
     * For objectMode streams, this is a count of the items waiting to be
     * emitted.
     */ get bufferLength() {
        return this[BUFFERLENGTH];
    }
    /**
     * The `BufferEncoding` currently in use, or `null`
     */ get encoding() {
        return this[ENCODING];
    }
    /**
     * @deprecated - This is a read only property
     */ set encoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * @deprecated - Encoding may only be set at instantiation time
     */ setEncoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * True if this is an objectMode stream
     */ get objectMode() {
        return this[OBJECTMODE];
    }
    /**
     * @deprecated - This is a read-only property
     */ set objectMode(_om) {
        throw new Error('objectMode must be set at instantiation time');
    }
    /**
     * true if this is an async stream
     */ get ['async']() {
        return this[ASYNC];
    }
    /**
     * Set to true to make this stream async.
     *
     * Once set, it cannot be unset, as this would potentially cause incorrect
     * behavior.  Ie, a sync stream can be made async, but an async stream
     * cannot be safely made sync.
     */ set ['async'](a) {
        this[ASYNC] = this[ASYNC] || !!a;
    }
    // drop everything and get out of the flow completely
    [ABORT]() {
        this[ABORTED] = true;
        this.emit('abort', this[SIGNAL]?.reason);
        this.destroy(this[SIGNAL]?.reason);
    }
    /**
     * True if the stream has been aborted.
     */ get aborted() {
        return this[ABORTED];
    }
    /**
     * No-op setter. Stream aborted status is set via the AbortSignal provided
     * in the constructor options.
     */ set aborted(_) {}
    write(chunk, encoding, cb) {
        if (this[ABORTED]) return false;
        if (this[EOF]) throw new Error('write after end');
        if (this[DESTROYED]) {
            this.emit('error', Object.assign(new Error('Cannot call write after a stream was destroyed'), {
                code: 'ERR_STREAM_DESTROYED'
            }));
            return true;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (!encoding) encoding = 'utf8';
        const fn = this[ASYNC] ? defer : nodefer;
        // convert array buffers and typed array views into buffers
        // at some point in the future, we may want to do the opposite!
        // leave strings and buffers as-is
        // anything is only allowed if in object mode, so throw
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
            if (isArrayBufferView(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
            } else if (isArrayBufferLike(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk);
            } else if (typeof chunk !== 'string') {
                throw new Error('Non-contiguous data written to non-objectMode stream');
            }
        }
        // handle object mode up front, since it's simpler
        // this yields better performance, fewer checks later.
        if (this[OBJECTMODE]) {
            // maybe impossible?
            /* c8 ignore start */ if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
            /* c8 ignore stop */ if (this[FLOWING]) this.emit('data', chunk);
            else this[BUFFERPUSH](chunk);
            if (this[BUFFERLENGTH] !== 0) this.emit('readable');
            if (cb) fn(cb);
            return this[FLOWING];
        }
        // at this point the chunk is a buffer or string
        // don't buffer it up or send it to the decoder
        if (!chunk.length) {
            if (this[BUFFERLENGTH] !== 0) this.emit('readable');
            if (cb) fn(cb);
            return this[FLOWING];
        }
        // fast-path writing strings of same encoding to a stream with
        // an empty buffer, skipping the buffer/decoder dance
        if (typeof chunk === 'string' && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
            //@ts-ignore - sinful unsafe type change
            chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
            //@ts-ignore - sinful unsafe type change
            chunk = this[DECODER].write(chunk);
        }
        // Note: flushing CAN potentially switch us into not-flowing mode
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
        if (this[FLOWING]) this.emit('data', chunk);
        else this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0) this.emit('readable');
        if (cb) fn(cb);
        return this[FLOWING];
    }
    /**
     * Low-level explicit read method.
     *
     * In objectMode, the argument is ignored, and one item is returned if
     * available.
     *
     * `n` is the number of bytes (or in the case of encoding streams,
     * characters) to consume. If `n` is not provided, then the entire buffer
     * is returned, or `null` is returned if no data is available.
     *
     * If `n` is greater that the amount of data in the internal buffer,
     * then `null` is returned.
     */ read(n) {
        if (this[DESTROYED]) return null;
        this[DISCARDED] = false;
        if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
            this[MAYBE_EMIT_END]();
            return null;
        }
        if (this[OBJECTMODE]) n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
            // not object mode, so if we have an encoding, then RType is string
            // otherwise, must be Buffer
            this[BUFFER] = [
                this[ENCODING] ? this[BUFFER].join('') : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
            ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [READ](n, chunk) {
        if (this[OBJECTMODE]) this[BUFFERSHIFT]();
        else {
            const c = chunk;
            if (n === c.length || n === null) this[BUFFERSHIFT]();
            else if (typeof c === 'string') {
                this[BUFFER][0] = c.slice(n);
                chunk = c.slice(0, n);
                this[BUFFERLENGTH] -= n;
            } else {
                this[BUFFER][0] = c.subarray(n);
                chunk = c.subarray(0, n);
                this[BUFFERLENGTH] -= n;
            }
        }
        this.emit('data', chunk);
        if (!this[BUFFER].length && !this[EOF]) this.emit('drain');
        return chunk;
    }
    end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
            cb = chunk;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (chunk !== undefined) this.write(chunk, encoding);
        if (cb) this.once('end', cb);
        this[EOF] = true;
        this.writable = false;
        // if we haven't written anything, then go ahead and emit,
        // even if we're not reading.
        // we'll re-emit if a new 'end' listener is added anyway.
        // This makes MP more suitable to write-only use cases.
        if (this[FLOWING] || !this[PAUSED]) this[MAYBE_EMIT_END]();
        return this;
    }
    // don't let the internal resume be overwritten
    [RESUME]() {
        if (this[DESTROYED]) return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
            this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit('resume');
        if (this[BUFFER].length) this[FLUSH]();
        else if (this[EOF]) this[MAYBE_EMIT_END]();
        else this.emit('drain');
    }
    /**
     * Resume the stream if it is currently in a paused state
     *
     * If called when there are no pipe destinations or `data` event listeners,
     * this will place the stream in a "discarded" state, where all data will
     * be thrown away. The discarded state is removed if a pipe destination or
     * data handler is added, if pause() is called, or if any synchronous or
     * asynchronous iteration is started.
     */ resume() {
        return this[RESUME]();
    }
    /**
     * Pause the stream
     */ pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
    }
    /**
     * true if the stream has been forcibly destroyed
     */ get destroyed() {
        return this[DESTROYED];
    }
    /**
     * true if the stream is currently in a flowing state, meaning that
     * any writes will be immediately emitted.
     */ get flowing() {
        return this[FLOWING];
    }
    /**
     * true if the stream is currently in a paused state
     */ get paused() {
        return this[PAUSED];
    }
    [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE]) this[BUFFERLENGTH] += 1;
        else this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
    }
    [BUFFERSHIFT]() {
        if (this[OBJECTMODE]) this[BUFFERLENGTH] -= 1;
        else this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
    }
    [FLUSH](noDrain = false) {
        do {}while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length)
        if (!noDrain && !this[BUFFER].length && !this[EOF]) this.emit('drain');
    }
    [FLUSHCHUNK](chunk) {
        this.emit('data', chunk);
        return this[FLOWING];
    }
    /**
     * Pipe all data emitted by this stream into the destination provided.
     *
     * Triggers the flow of data.
     */ pipe(dest, opts) {
        if (this[DESTROYED]) return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr) opts.end = false;
        else opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        // piping an ended stream ends immediately
        if (ended) {
            if (opts.end) dest.end();
        } else {
            // "as" here just ignores the WType, which pipes don't care about,
            // since they're only consuming from us, and writing to the dest
            this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts));
            if (this[ASYNC]) defer(()=>this[RESUME]());
            else this[RESUME]();
        }
        return dest;
    }
    /**
     * Fully unhook a piped destination stream.
     *
     * If the destination stream was the only consumer of this stream (ie,
     * there are no other piped destinations or `'data'` event listeners)
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */ unpipe(dest) {
        const p = this[PIPES].find((p)=>p.dest === dest);
        if (p) {
            if (this[PIPES].length === 1) {
                if (this[FLOWING] && this[DATALISTENERS] === 0) {
                    this[FLOWING] = false;
                }
                this[PIPES] = [];
            } else this[PIPES].splice(this[PIPES].indexOf(p), 1);
            p.unpipe();
        }
    }
    /**
     * Alias for {@link Minipass#on}
     */ addListener(ev, handler) {
        return this.on(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.on`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * - Adding a 'data' event handler will trigger the flow of data
     *
     * - Adding a 'readable' event handler when there is data waiting to be read
     *   will cause 'readable' to be emitted immediately.
     *
     * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
     *   already passed will cause the event to be emitted immediately and all
     *   handlers removed.
     *
     * - Adding an 'error' event handler after an error has been emitted will
     *   cause the event to be re-emitted immediately with the error previously
     *   raised.
     */ on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === 'data') {
            this[DISCARDED] = false;
            this[DATALISTENERS]++;
            if (!this[PIPES].length && !this[FLOWING]) {
                this[RESUME]();
            }
        } else if (ev === 'readable' && this[BUFFERLENGTH] !== 0) {
            super.emit('readable');
        } else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
        } else if (ev === 'error' && this[EMITTED_ERROR]) {
            const h = handler;
            if (this[ASYNC]) defer(()=>h.call(this, this[EMITTED_ERROR]));
            else h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
    }
    /**
     * Alias for {@link Minipass#off}
     */ removeListener(ev, handler) {
        return this.off(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.off`
     *
     * If a 'data' event handler is removed, and it was the last consumer
     * (ie, there are no pipe destinations or other 'data' event listeners),
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */ off(ev, handler) {
        const ret = super.off(ev, handler);
        // if we previously had listeners, and now we don't, and we don't
        // have any pipes, then stop the flow, unless it's been explicitly
        // put in a discarded flowing state via stream.resume().
        if (ev === 'data') {
            this[DATALISTENERS] = this.listeners('data').length;
            if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * Mostly identical to `EventEmitter.removeAllListeners`
     *
     * If all 'data' event handlers are removed, and they were the last consumer
     * (ie, there are no pipe destinations), then the flow of data will stop
     * until there is another consumer or {@link Minipass#resume} is explicitly
     * called.
     */ removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === 'data' || ev === undefined) {
            this[DATALISTENERS] = 0;
            if (!this[DISCARDED] && !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * true if the 'end' event has been emitted
     */ get emittedEnd() {
        return this[EMITTED_END];
    }
    [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
            this[EMITTING_END] = true;
            this.emit('end');
            this.emit('prefinish');
            this.emit('finish');
            if (this[CLOSED]) this.emit('close');
            this[EMITTING_END] = false;
        }
    }
    /**
     * Mostly identical to `EventEmitter.emit`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * If the stream has been destroyed, and the event is something other
     * than 'close' or 'error', then `false` is returned and no handlers
     * are called.
     *
     * If the event is 'end', and has already been emitted, then the event
     * is ignored. If the stream is in a paused or non-flowing state, then
     * the event will be deferred until data flow resumes. If the stream is
     * async, then handlers will be called on the next tick rather than
     * immediately.
     *
     * If the event is 'close', and 'end' has not yet been emitted, then
     * the event will be deferred until after 'end' is emitted.
     *
     * If the event is 'error', and an AbortSignal was provided for the stream,
     * and there are no listeners, then the event is ignored, matching the
     * behavior of node core streams in the presense of an AbortSignal.
     *
     * If the event is 'finish' or 'prefinish', then all listeners will be
     * removed after emitting the event, to prevent double-firing.
     */ emit(ev, ...args) {
        const data = args[0];
        // error and close are only events allowed after calling destroy()
        if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED]) {
            return false;
        } else if (ev === 'data') {
            return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(()=>this[EMITDATA](data)), true) : this[EMITDATA](data);
        } else if (ev === 'end') {
            return this[EMITEND]();
        } else if (ev === 'close') {
            this[CLOSED] = true;
            // don't emit close before 'end' and 'finish'
            if (!this[EMITTED_END] && !this[DESTROYED]) return false;
            const ret = super.emit('close');
            this.removeAllListeners('close');
            return ret;
        } else if (ev === 'error') {
            this[EMITTED_ERROR] = data;
            super.emit(ERROR, data);
            const ret = !this[SIGNAL] || this.listeners('error').length ? super.emit('error', data) : false;
            this[MAYBE_EMIT_END]();
            return ret;
        } else if (ev === 'resume') {
            const ret = super.emit('resume');
            this[MAYBE_EMIT_END]();
            return ret;
        } else if (ev === 'finish' || ev === 'prefinish') {
            const ret = super.emit(ev);
            this.removeAllListeners(ev);
            return ret;
        }
        // Some other unknown event
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITDATA](data) {
        for (const p of this[PIPES]){
            if (p.dest.write(data) === false) this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit('data', data);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITEND]() {
        if (this[EMITTED_END]) return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC] ? (defer(()=>this[EMITEND2]()), true) : this[EMITEND2]();
    }
    [EMITEND2]() {
        if (this[DECODER]) {
            const data = this[DECODER].end();
            if (data) {
                for (const p of this[PIPES]){
                    p.dest.write(data);
                }
                if (!this[DISCARDED]) super.emit('data', data);
            }
        }
        for (const p of this[PIPES]){
            p.end();
        }
        const ret = super.emit('end');
        this.removeAllListeners('end');
        return ret;
    }
    /**
     * Return a Promise that resolves to an array of all emitted data once
     * the stream ends.
     */ async collect() {
        const buf = Object.assign([], {
            dataLength: 0
        });
        if (!this[OBJECTMODE]) buf.dataLength = 0;
        // set the promise first, in case an error is raised
        // by triggering the flow here.
        const p = this.promise();
        this.on('data', (c)=>{
            buf.push(c);
            if (!this[OBJECTMODE]) buf.dataLength += c.length;
        });
        await p;
        return buf;
    }
    /**
     * Return a Promise that resolves to the concatenation of all emitted data
     * once the stream ends.
     *
     * Not allowed on objectMode streams.
     */ async concat() {
        if (this[OBJECTMODE]) {
            throw new Error('cannot concat in objectMode');
        }
        const buf = await this.collect();
        return this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength);
    }
    /**
     * Return a void Promise that resolves once the stream ends.
     */ async promise() {
        return new Promise((resolve, reject)=>{
            this.on(DESTROYED, ()=>reject(new Error('stream destroyed')));
            this.on('error', (er)=>reject(er));
            this.on('end', ()=>resolve());
        });
    }
    /**
     * Asynchronous `for await of` iteration.
     *
     * This will continue emitting all chunks until the stream terminates.
     */ [Symbol.asyncIterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = async ()=>{
            this.pause();
            stopped = true;
            return {
                value: undefined,
                done: true
            };
        };
        const next = ()=>{
            if (stopped) return stop();
            const res = this.read();
            if (res !== null) return Promise.resolve({
                done: false,
                value: res
            });
            if (this[EOF]) return stop();
            let resolve;
            let reject;
            const onerr = (er)=>{
                this.off('data', ondata);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                stop();
                reject(er);
            };
            const ondata = (value)=>{
                this.off('error', onerr);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                this.pause();
                resolve({
                    value,
                    done: !!this[EOF]
                });
            };
            const onend = ()=>{
                this.off('error', onerr);
                this.off('data', ondata);
                this.off(DESTROYED, ondestroy);
                stop();
                resolve({
                    done: true,
                    value: undefined
                });
            };
            const ondestroy = ()=>onerr(new Error('stream destroyed'));
            return new Promise((res, rej)=>{
                reject = rej;
                resolve = res;
                this.once(DESTROYED, ondestroy);
                this.once('error', onerr);
                this.once('end', onend);
                this.once('data', ondata);
            });
        };
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.asyncIterator] () {
                return this;
            },
            [Symbol.asyncDispose]: async ()=>{}
        };
    }
    /**
     * Synchronous `for of` iteration.
     *
     * The iteration will terminate when the internal buffer runs out, even
     * if the stream has not yet terminated.
     */ [Symbol.iterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = ()=>{
            this.pause();
            this.off(ERROR, stop);
            this.off(DESTROYED, stop);
            this.off('end', stop);
            stopped = true;
            return {
                done: true,
                value: undefined
            };
        };
        const next = ()=>{
            if (stopped) return stop();
            const value = this.read();
            return value === null ? stop() : {
                done: false,
                value
            };
        };
        this.once('end', stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.iterator] () {
                return this;
            },
            [Symbol.dispose]: ()=>{}
        };
    }
    /**
     * Destroy a stream, preventing it from being used for any further purpose.
     *
     * If the stream has a `close()` method, then it will be called on
     * destruction.
     *
     * After destruction, any attempt to write data, read data, or emit most
     * events will be ignored.
     *
     * If an error argument is provided, then it will be emitted in an
     * 'error' event.
     */ destroy(er) {
        if (this[DESTROYED]) {
            if (er) this.emit('error', er);
            else this.emit(DESTROYED);
            return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        // throw away all buffered data, it's never coming out
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === 'function' && !this[CLOSED]) wc.close();
        if (er) this.emit('error', er);
        else this.emit(DESTROYED);
        return this;
    }
    /**
     * Alias for {@link isStream}
     *
     * Former export location, maintained for backwards compatibility.
     *
     * @deprecated
     */ static get isStream() {
        return exports.isStream;
    }
}
exports.Minipass = Minipass; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/path-scurry/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PathScurry = exports.Path = exports.PathScurryDarwin = exports.PathScurryPosix = exports.PathScurryWin32 = exports.PathScurryBase = exports.PathPosix = exports.PathWin32 = exports.PathBase = exports.ChildrenCache = exports.ResolveCache = void 0;
const lru_cache_1 = __turbopack_context__.r("[project]/node_modules/path-scurry/node_modules/lru-cache/dist/commonjs/index.js [app-route] (ecmascript)");
const node_path_1 = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
const node_url_1 = __turbopack_context__.r("[externals]/node:url [external] (node:url, cjs)");
const fs_1 = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const actualFS = __importStar(__turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)"));
const realpathSync = fs_1.realpathSync.native;
// TODO: test perf of fs/promises realpath vs realpathCB,
// since the promises one uses realpath.native
const promises_1 = __turbopack_context__.r("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
const minipass_1 = __turbopack_context__.r("[project]/node_modules/minipass/dist/commonjs/index.js [app-route] (ecmascript)");
const defaultFS = {
    lstatSync: fs_1.lstatSync,
    readdir: fs_1.readdir,
    readdirSync: fs_1.readdirSync,
    readlinkSync: fs_1.readlinkSync,
    realpathSync,
    promises: {
        lstat: promises_1.lstat,
        readdir: promises_1.readdir,
        readlink: promises_1.readlink,
        realpath: promises_1.realpath
    }
};
// if they just gave us require('fs') then use our default
const fsFromOption = (fsOption)=>!fsOption || fsOption === defaultFS || fsOption === actualFS ? defaultFS : {
        ...defaultFS,
        ...fsOption,
        promises: {
            ...defaultFS.promises,
            ...fsOption.promises || {}
        }
    };
// turn something like //?/c:/ into c:\
const uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
const uncToDrive = (rootPath)=>rootPath.replace(/\//g, '\\').replace(uncDriveRegexp, '$1\\');
// windows paths are separated by either / or \
const eitherSep = /[\\\/]/;
const UNKNOWN = 0; // may not even exist, for all we know
const IFIFO = 0b0001;
const IFCHR = 0b0010;
const IFDIR = 0b0100;
const IFBLK = 0b0110;
const IFREG = 0b1000;
const IFLNK = 0b1010;
const IFSOCK = 0b1100;
const IFMT = 0b1111;
// mask to unset low 4 bits
const IFMT_UNKNOWN = ~IFMT;
// set after successfully calling readdir() and getting entries.
const READDIR_CALLED = 0b0000_0001_0000;
// set after a successful lstat()
const LSTAT_CALLED = 0b0000_0010_0000;
// set if an entry (or one of its parents) is definitely not a dir
const ENOTDIR = 0b0000_0100_0000;
// set if an entry (or one of its parents) does not exist
// (can also be set on lstat errors like EACCES or ENAMETOOLONG)
const ENOENT = 0b0000_1000_0000;
// cannot have child entries -- also verify &IFMT is either IFDIR or IFLNK
// set if we fail to readlink
const ENOREADLINK = 0b0001_0000_0000;
// set if we know realpath() will fail
const ENOREALPATH = 0b0010_0000_0000;
const ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
const TYPEMASK = 0b0011_1111_1111;
const entToType = (s)=>s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN;
// normalize unicode path names
const normalizeCache = new Map();
const normalize = (s)=>{
    const c = normalizeCache.get(s);
    if (c) return c;
    const n = s.normalize('NFKD');
    normalizeCache.set(s, n);
    return n;
};
const normalizeNocaseCache = new Map();
const normalizeNocase = (s)=>{
    const c = normalizeNocaseCache.get(s);
    if (c) return c;
    const n = normalize(s.toLowerCase());
    normalizeNocaseCache.set(s, n);
    return n;
};
/**
 * An LRUCache for storing resolved path strings or Path objects.
 * @internal
 */ class ResolveCache extends lru_cache_1.LRUCache {
    constructor(){
        super({
            max: 256
        });
    }
}
exports.ResolveCache = ResolveCache;
// In order to prevent blowing out the js heap by allocating hundreds of
// thousands of Path entries when walking extremely large trees, the "children"
// in this tree are represented by storing an array of Path entries in an
// LRUCache, indexed by the parent.  At any time, Path.children() may return an
// empty array, indicating that it doesn't know about any of its children, and
// thus has to rebuild that cache.  This is fine, it just means that we don't
// benefit as much from having the cached entries, but huge directory walks
// don't blow out the stack, and smaller ones are still as fast as possible.
//
//It does impose some complexity when building up the readdir data, because we
//need to pass a reference to the children array that we started with.
/**
 * an LRUCache for storing child entries.
 * @internal
 */ class ChildrenCache extends lru_cache_1.LRUCache {
    constructor(maxSize = 16 * 1024){
        super({
            maxSize,
            // parent + children
            sizeCalculation: (a)=>a.length + 1
        });
    }
}
exports.ChildrenCache = ChildrenCache;
const setAsCwd = Symbol('PathScurry setAsCwd');
/**
 * Path objects are sort of like a super-powered
 * {@link https://nodejs.org/docs/latest/api/fs.html#class-fsdirent fs.Dirent}
 *
 * Each one represents a single filesystem entry on disk, which may or may not
 * exist. It includes methods for reading various types of information via
 * lstat, readlink, and readdir, and caches all information to the greatest
 * degree possible.
 *
 * Note that fs operations that would normally throw will instead return an
 * "empty" value. This is in order to prevent excessive overhead from error
 * stack traces.
 */ class PathBase {
    /**
     * the basename of this path
     *
     * **Important**: *always* test the path name against any test string
     * usingthe {@link isNamed} method, and not by directly comparing this
     * string. Otherwise, unicode path strings that the system sees as identical
     * will not be properly treated as the same path, leading to incorrect
     * behavior and possible security issues.
     */ name;
    /**
     * the Path entry corresponding to the path root.
     *
     * @internal
     */ root;
    /**
     * All roots found within the current PathScurry family
     *
     * @internal
     */ roots;
    /**
     * a reference to the parent path, or undefined in the case of root entries
     *
     * @internal
     */ parent;
    /**
     * boolean indicating whether paths are compared case-insensitively
     * @internal
     */ nocase;
    /**
     * boolean indicating that this path is the current working directory
     * of the PathScurry collection that contains it.
     */ isCWD = false;
    // potential default fs override
    #fs;
    // Stats fields
    #dev;
    get dev() {
        return this.#dev;
    }
    #mode;
    get mode() {
        return this.#mode;
    }
    #nlink;
    get nlink() {
        return this.#nlink;
    }
    #uid;
    get uid() {
        return this.#uid;
    }
    #gid;
    get gid() {
        return this.#gid;
    }
    #rdev;
    get rdev() {
        return this.#rdev;
    }
    #blksize;
    get blksize() {
        return this.#blksize;
    }
    #ino;
    get ino() {
        return this.#ino;
    }
    #size;
    get size() {
        return this.#size;
    }
    #blocks;
    get blocks() {
        return this.#blocks;
    }
    #atimeMs;
    get atimeMs() {
        return this.#atimeMs;
    }
    #mtimeMs;
    get mtimeMs() {
        return this.#mtimeMs;
    }
    #ctimeMs;
    get ctimeMs() {
        return this.#ctimeMs;
    }
    #birthtimeMs;
    get birthtimeMs() {
        return this.#birthtimeMs;
    }
    #atime;
    get atime() {
        return this.#atime;
    }
    #mtime;
    get mtime() {
        return this.#mtime;
    }
    #ctime;
    get ctime() {
        return this.#ctime;
    }
    #birthtime;
    get birthtime() {
        return this.#birthtime;
    }
    #matchName;
    #depth;
    #fullpath;
    #fullpathPosix;
    #relative;
    #relativePosix;
    #type;
    #children;
    #linkTarget;
    #realpath;
    /**
     * This property is for compatibility with the Dirent class as of
     * Node v20, where Dirent['parentPath'] refers to the path of the
     * directory that was passed to readdir. For root entries, it's the path
     * to the entry itself.
     */ get parentPath() {
        return (this.parent || this).fullpath();
    }
    /**
     * Deprecated alias for Dirent['parentPath'] Somewhat counterintuitively,
     * this property refers to the *parent* path, not the path object itself.
     */ get path() {
        return this.parentPath;
    }
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */ constructor(name, type = UNKNOWN, root, roots, nocase, children, opts){
        this.name = name;
        this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
        this.#type = type & TYPEMASK;
        this.nocase = nocase;
        this.roots = roots;
        this.root = root || this;
        this.#children = children;
        this.#fullpath = opts.fullpath;
        this.#relative = opts.relative;
        this.#relativePosix = opts.relativePosix;
        this.parent = opts.parent;
        if (this.parent) {
            this.#fs = this.parent.#fs;
        } else {
            this.#fs = fsFromOption(opts.fs);
        }
    }
    /**
     * Returns the depth of the Path object from its root.
     *
     * For example, a path at `/foo/bar` would have a depth of 2.
     */ depth() {
        if (this.#depth !== undefined) return this.#depth;
        if (!this.parent) return this.#depth = 0;
        return this.#depth = this.parent.depth() + 1;
    }
    /**
     * @internal
     */ childrenCache() {
        return this.#children;
    }
    /**
     * Get the Path object referenced by the string path, resolved from this Path
     */ resolve(path) {
        if (!path) {
            return this;
        }
        const rootPath = this.getRootString(path);
        const dir = path.substring(rootPath.length);
        const dirParts = dir.split(this.splitSep);
        const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
        return result;
    }
    #resolveParts(dirParts) {
        let p = this;
        for (const part of dirParts){
            p = p.child(part);
        }
        return p;
    }
    /**
     * Returns the cached children Path objects, if still available.  If they
     * have fallen out of the cache, then returns an empty array, and resets the
     * READDIR_CALLED bit, so that future calls to readdir() will require an fs
     * lookup.
     *
     * @internal
     */ children() {
        const cached = this.#children.get(this);
        if (cached) {
            return cached;
        }
        const children = Object.assign([], {
            provisional: 0
        });
        this.#children.set(this, children);
        this.#type &= ~READDIR_CALLED;
        return children;
    }
    /**
     * Resolves a path portion and returns or creates the child Path.
     *
     * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
     * `'..'`.
     *
     * This should not be called directly.  If `pathPart` contains any path
     * separators, it will lead to unsafe undefined behavior.
     *
     * Use `Path.resolve()` instead.
     *
     * @internal
     */ child(pathPart, opts) {
        if (pathPart === '' || pathPart === '.') {
            return this;
        }
        if (pathPart === '..') {
            return this.parent || this;
        }
        // find the child
        const children = this.children();
        const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
        for (const p of children){
            if (p.#matchName === name) {
                return p;
            }
        }
        // didn't find it, create provisional child, since it might not
        // actually exist.  If we know the parent isn't a dir, then
        // in fact it CAN'T exist.
        const s = this.parent ? this.sep : '';
        const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : undefined;
        const pchild = this.newChild(pathPart, UNKNOWN, {
            ...opts,
            parent: this,
            fullpath
        });
        if (!this.canReaddir()) {
            pchild.#type |= ENOENT;
        }
        // don't have to update provisional, because if we have real children,
        // then provisional is set to children.length, otherwise a lower number
        children.push(pchild);
        return pchild;
    }
    /**
     * The relative path from the cwd. If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpath()
     */ relative() {
        if (this.isCWD) return '';
        if (this.#relative !== undefined) {
            return this.#relative;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return this.#relative = this.name;
        }
        const pv = p.relative();
        return pv + (!pv || !p.parent ? '' : this.sep) + name;
    }
    /**
     * The relative path from the cwd, using / as the path separator.
     * If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpathPosix()
     * On posix systems, this is identical to relative().
     */ relativePosix() {
        if (this.sep === '/') return this.relative();
        if (this.isCWD) return '';
        if (this.#relativePosix !== undefined) return this.#relativePosix;
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return this.#relativePosix = this.fullpathPosix();
        }
        const pv = p.relativePosix();
        return pv + (!pv || !p.parent ? '' : '/') + name;
    }
    /**
     * The fully resolved path string for this Path entry
     */ fullpath() {
        if (this.#fullpath !== undefined) {
            return this.#fullpath;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return this.#fullpath = this.name;
        }
        const pv = p.fullpath();
        const fp = pv + (!p.parent ? '' : this.sep) + name;
        return this.#fullpath = fp;
    }
    /**
     * On platforms other than windows, this is identical to fullpath.
     *
     * On windows, this is overridden to return the forward-slash form of the
     * full UNC path.
     */ fullpathPosix() {
        if (this.#fullpathPosix !== undefined) return this.#fullpathPosix;
        if (this.sep === '/') return this.#fullpathPosix = this.fullpath();
        if (!this.parent) {
            const p = this.fullpath().replace(/\\/g, '/');
            if (/^[a-z]:\//i.test(p)) {
                return this.#fullpathPosix = `//?/${p}`;
            } else {
                return this.#fullpathPosix = p;
            }
        }
        const p = this.parent;
        const pfpp = p.fullpathPosix();
        const fpp = pfpp + (!pfpp || !p.parent ? '' : '/') + this.name;
        return this.#fullpathPosix = fpp;
    }
    /**
     * Is the Path of an unknown type?
     *
     * Note that we might know *something* about it if there has been a previous
     * filesystem operation, for example that it does not exist, or is not a
     * link, or whether it has child entries.
     */ isUnknown() {
        return (this.#type & IFMT) === UNKNOWN;
    }
    isType(type) {
        return this[`is${type}`]();
    }
    getType() {
        return this.isUnknown() ? 'Unknown' : this.isDirectory() ? 'Directory' : this.isFile() ? 'File' : this.isSymbolicLink() ? 'SymbolicLink' : this.isFIFO() ? 'FIFO' : this.isCharacterDevice() ? 'CharacterDevice' : this.isBlockDevice() ? 'BlockDevice' : /* c8 ignore start */ this.isSocket() ? 'Socket' : 'Unknown';
    /* c8 ignore stop */ }
    /**
     * Is the Path a regular file?
     */ isFile() {
        return (this.#type & IFMT) === IFREG;
    }
    /**
     * Is the Path a directory?
     */ isDirectory() {
        return (this.#type & IFMT) === IFDIR;
    }
    /**
     * Is the path a character device?
     */ isCharacterDevice() {
        return (this.#type & IFMT) === IFCHR;
    }
    /**
     * Is the path a block device?
     */ isBlockDevice() {
        return (this.#type & IFMT) === IFBLK;
    }
    /**
     * Is the path a FIFO pipe?
     */ isFIFO() {
        return (this.#type & IFMT) === IFIFO;
    }
    /**
     * Is the path a socket?
     */ isSocket() {
        return (this.#type & IFMT) === IFSOCK;
    }
    /**
     * Is the path a symbolic link?
     */ isSymbolicLink() {
        return (this.#type & IFLNK) === IFLNK;
    }
    /**
     * Return the entry if it has been subject of a successful lstat, or
     * undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* simply
     * mean that we haven't called lstat on it.
     */ lstatCached() {
        return this.#type & LSTAT_CALLED ? this : undefined;
    }
    /**
     * Return the cached link target if the entry has been the subject of a
     * successful readlink, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readlink() has been called at some point.
     */ readlinkCached() {
        return this.#linkTarget;
    }
    /**
     * Returns the cached realpath target if the entry has been the subject
     * of a successful realpath, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * realpath() has been called at some point.
     */ realpathCached() {
        return this.#realpath;
    }
    /**
     * Returns the cached child Path entries array if the entry has been the
     * subject of a successful readdir(), or [] otherwise.
     *
     * Does not read the filesystem, so an empty array *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readdir() has been called recently enough to still be valid.
     */ readdirCached() {
        const children = this.children();
        return children.slice(0, children.provisional);
    }
    /**
     * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
     * any indication that readlink will definitely fail.
     *
     * Returns false if the path is known to not be a symlink, if a previous
     * readlink failed, or if the entry does not exist.
     */ canReadlink() {
        if (this.#linkTarget) return true;
        if (!this.parent) return false;
        // cases where it cannot possibly succeed
        const ifmt = this.#type & IFMT;
        return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
    }
    /**
     * Return true if readdir has previously been successfully called on this
     * path, indicating that cachedReaddir() is likely valid.
     */ calledReaddir() {
        return !!(this.#type & READDIR_CALLED);
    }
    /**
     * Returns true if the path is known to not exist. That is, a previous lstat
     * or readdir failed to verify its existence when that would have been
     * expected, or a parent entry was marked either enoent or enotdir.
     */ isENOENT() {
        return !!(this.#type & ENOENT);
    }
    /**
     * Return true if the path is a match for the given path name.  This handles
     * case sensitivity and unicode normalization.
     *
     * Note: even on case-sensitive systems, it is **not** safe to test the
     * equality of the `.name` property to determine whether a given pathname
     * matches, due to unicode normalization mismatches.
     *
     * Always use this method instead of testing the `path.name` property
     * directly.
     */ isNamed(n) {
        return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
    }
    /**
     * Return the Path object corresponding to the target of a symbolic link.
     *
     * If the Path is not a symbolic link, or if the readlink call fails for any
     * reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     */ async readlink() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */ // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */ try {
            const read = await this.#fs.promises.readlink(this.fullpath());
            const linkTarget = (await this.parent.realpath())?.resolve(read);
            if (linkTarget) {
                return this.#linkTarget = linkTarget;
            }
        } catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    /**
     * Synchronous {@link PathBase.readlink}
     */ readlinkSync() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */ // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */ try {
            const read = this.#fs.readlinkSync(this.fullpath());
            const linkTarget = this.parent.realpathSync()?.resolve(read);
            if (linkTarget) {
                return this.#linkTarget = linkTarget;
            }
        } catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    #readdirSuccess(children) {
        // succeeded, mark readdir called bit
        this.#type |= READDIR_CALLED;
        // mark all remaining provisional children as ENOENT
        for(let p = children.provisional; p < children.length; p++){
            const c = children[p];
            if (c) c.#markENOENT();
        }
    }
    #markENOENT() {
        // mark as UNKNOWN and ENOENT
        if (this.#type & ENOENT) return;
        this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
        this.#markChildrenENOENT();
    }
    #markChildrenENOENT() {
        // all children are provisional and do not exist
        const children = this.children();
        children.provisional = 0;
        for (const p of children){
            p.#markENOENT();
        }
    }
    #markENOREALPATH() {
        this.#type |= ENOREALPATH;
        this.#markENOTDIR();
    }
    // save the information when we know the entry is not a dir
    #markENOTDIR() {
        // entry is not a directory, so any children can't exist.
        // this *should* be impossible, since any children created
        // after it's been marked ENOTDIR should be marked ENOENT,
        // so it won't even get to this point.
        /* c8 ignore start */ if (this.#type & ENOTDIR) return;
        /* c8 ignore stop */ let t = this.#type;
        // this could happen if we stat a dir, then delete it,
        // then try to read it or one of its children.
        if ((t & IFMT) === IFDIR) t &= IFMT_UNKNOWN;
        this.#type = t | ENOTDIR;
        this.#markChildrenENOENT();
    }
    #readdirFail(code = '') {
        // markENOTDIR and markENOENT also set provisional=0
        if (code === 'ENOTDIR' || code === 'EPERM') {
            this.#markENOTDIR();
        } else if (code === 'ENOENT') {
            this.#markENOENT();
        } else {
            this.children().provisional = 0;
        }
    }
    #lstatFail(code = '') {
        // Windows just raises ENOENT in this case, disable for win CI
        /* c8 ignore start */ if (code === 'ENOTDIR') {
            // already know it has a parent by this point
            const p = this.parent;
            p.#markENOTDIR();
        } else if (code === 'ENOENT') {
            /* c8 ignore stop */ this.#markENOENT();
        }
    }
    #readlinkFail(code = '') {
        let ter = this.#type;
        ter |= ENOREADLINK;
        if (code === 'ENOENT') ter |= ENOENT;
        // windows gets a weird error when you try to readlink a file
        if (code === 'EINVAL' || code === 'UNKNOWN') {
            // exists, but not a symlink, we don't know WHAT it is, so remove
            // all IFMT bits.
            ter &= IFMT_UNKNOWN;
        }
        this.#type = ter;
        // windows just gets ENOENT in this case.  We do cover the case,
        // just disabled because it's impossible on Windows CI
        /* c8 ignore start */ if (code === 'ENOTDIR' && this.parent) {
            this.parent.#markENOTDIR();
        }
    /* c8 ignore stop */ }
    #readdirAddChild(e, c) {
        return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
    }
    #readdirAddNewChild(e, c) {
        // alloc new entry at head, so it's never provisional
        const type = entToType(e);
        const child = this.newChild(e.name, type, {
            parent: this
        });
        const ifmt = child.#type & IFMT;
        if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
            child.#type |= ENOTDIR;
        }
        c.unshift(child);
        c.provisional++;
        return child;
    }
    #readdirMaybePromoteChild(e, c) {
        for(let p = c.provisional; p < c.length; p++){
            const pchild = c[p];
            const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
            if (name !== pchild.#matchName) {
                continue;
            }
            return this.#readdirPromoteChild(e, pchild, p, c);
        }
    }
    #readdirPromoteChild(e, p, index, c) {
        const v = p.name;
        // retain any other flags, but set ifmt from dirent
        p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
        // case sensitivity fixing when we learn the true name.
        if (v !== e.name) p.name = e.name;
        // just advance provisional index (potentially off the list),
        // otherwise we have to splice/pop it out and re-insert at head
        if (index !== c.provisional) {
            if (index === c.length - 1) c.pop();
            else c.splice(index, 1);
            c.unshift(p);
        }
        c.provisional++;
        return p;
    }
    /**
     * Call lstat() on this Path, and update all known information that can be
     * determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */ async lstat() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
                return this;
            } catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    /**
     * synchronous {@link PathBase.lstat}
     */ lstatSync() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(this.#fs.lstatSync(this.fullpath()));
                return this;
            } catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    #applyStat(st) {
        const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
        this.#atime = atime;
        this.#atimeMs = atimeMs;
        this.#birthtime = birthtime;
        this.#birthtimeMs = birthtimeMs;
        this.#blksize = blksize;
        this.#blocks = blocks;
        this.#ctime = ctime;
        this.#ctimeMs = ctimeMs;
        this.#dev = dev;
        this.#gid = gid;
        this.#ino = ino;
        this.#mode = mode;
        this.#mtime = mtime;
        this.#mtimeMs = mtimeMs;
        this.#nlink = nlink;
        this.#rdev = rdev;
        this.#size = size;
        this.#uid = uid;
        const ifmt = entToType(st);
        // retain any other flags, but set the ifmt
        this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
        if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
            this.#type |= ENOTDIR;
        }
    }
    #onReaddirCB = [];
    #readdirCBInFlight = false;
    #callOnReaddirCB(children) {
        this.#readdirCBInFlight = false;
        const cbs = this.#onReaddirCB.slice();
        this.#onReaddirCB.length = 0;
        cbs.forEach((cb)=>cb(null, children));
    }
    /**
     * Standard node-style callback interface to get list of directory entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     *
     * @param cb The callback called with (er, entries).  Note that the `er`
     * param is somewhat extraneous, as all readdir() errors are handled and
     * simply result in an empty set of entries being returned.
     * @param allowZalgo Boolean indicating that immediately known results should
     * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
     * zalgo at your peril, the dark pony lord is devious and unforgiving.
     */ readdirCB(cb, allowZalgo = false) {
        if (!this.canReaddir()) {
            if (allowZalgo) cb(null, []);
            else queueMicrotask(()=>cb(null, []));
            return;
        }
        const children = this.children();
        if (this.calledReaddir()) {
            const c = children.slice(0, children.provisional);
            if (allowZalgo) cb(null, c);
            else queueMicrotask(()=>cb(null, c));
            return;
        }
        // don't have to worry about zalgo at this point.
        this.#onReaddirCB.push(cb);
        if (this.#readdirCBInFlight) {
            return;
        }
        this.#readdirCBInFlight = true;
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        this.#fs.readdir(fullpath, {
            withFileTypes: true
        }, (er, entries)=>{
            if (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            } else {
                // if we didn't get an error, we always get entries.
                //@ts-ignore
                for (const e of entries){
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            }
            this.#callOnReaddirCB(children.slice(0, children.provisional));
            return;
        });
    }
    #asyncReaddirInFlight;
    /**
     * Return an array of known child entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */ async readdir() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        if (this.#asyncReaddirInFlight) {
            await this.#asyncReaddirInFlight;
        } else {
            /* c8 ignore start */ let resolve = ()=>{};
            /* c8 ignore stop */ this.#asyncReaddirInFlight = new Promise((res)=>resolve = res);
            try {
                for (const e of (await this.#fs.promises.readdir(fullpath, {
                    withFileTypes: true
                }))){
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            } catch (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            }
            this.#asyncReaddirInFlight = undefined;
            resolve();
        }
        return children.slice(0, children.provisional);
    }
    /**
     * synchronous {@link PathBase.readdir}
     */ readdirSync() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        try {
            for (const e of this.#fs.readdirSync(fullpath, {
                withFileTypes: true
            })){
                this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
        } catch (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
        }
        return children.slice(0, children.provisional);
    }
    canReaddir() {
        if (this.#type & ENOCHILD) return false;
        const ifmt = IFMT & this.#type;
        // we always set ENOTDIR when setting IFMT, so should be impossible
        /* c8 ignore start */ if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
            return false;
        }
        /* c8 ignore stop */ return true;
    }
    shouldWalk(dirs, walkFilter) {
        return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
    }
    /**
     * Return the Path object corresponding to path as resolved
     * by realpath(3).
     *
     * If the realpath call fails for any reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     * On success, returns a Path object.
     */ async realpath() {
        if (this.#realpath) return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type) return undefined;
        try {
            const rp = await this.#fs.promises.realpath(this.fullpath());
            return this.#realpath = this.resolve(rp);
        } catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Synchronous {@link realpath}
     */ realpathSync() {
        if (this.#realpath) return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type) return undefined;
        try {
            const rp = this.#fs.realpathSync(this.fullpath());
            return this.#realpath = this.resolve(rp);
        } catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Internal method to mark this Path object as the scurry cwd,
     * called by {@link PathScurry#chdir}
     *
     * @internal
     */ [setAsCwd](oldCwd) {
        if (oldCwd === this) return;
        oldCwd.isCWD = false;
        this.isCWD = true;
        const changed = new Set([]);
        let rp = [];
        let p = this;
        while(p && p.parent){
            changed.add(p);
            p.#relative = rp.join(this.sep);
            p.#relativePosix = rp.join('/');
            p = p.parent;
            rp.push('..');
        }
        // now un-memoize parents of old cwd
        p = oldCwd;
        while(p && p.parent && !changed.has(p)){
            p.#relative = undefined;
            p.#relativePosix = undefined;
            p = p.parent;
        }
    }
}
exports.PathBase = PathBase;
/**
 * Path class used on win32 systems
 *
 * Uses `'\\'` as the path separator for returned paths, either `'\\'` or `'/'`
 * as the path separator for parsing paths.
 */ class PathWin32 extends PathBase {
    /**
     * Separator for generating path strings.
     */ sep = '\\';
    /**
     * Separator for parsing path strings.
     */ splitSep = eitherSep;
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */ constructor(name, type = UNKNOWN, root, roots, nocase, children, opts){
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */ newChild(name, type = UNKNOWN, opts = {}) {
        return new PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
    /**
     * @internal
     */ getRootString(path) {
        return node_path_1.win32.parse(path).root;
    }
    /**
     * @internal
     */ getRoot(rootPath) {
        rootPath = uncToDrive(rootPath.toUpperCase());
        if (rootPath === this.root.name) {
            return this.root;
        }
        // ok, not that one, check if it matches another we know about
        for (const [compare, root] of Object.entries(this.roots)){
            if (this.sameRoot(rootPath, compare)) {
                return this.roots[rootPath] = root;
            }
        }
        // otherwise, have to create a new one.
        return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
    }
    /**
     * @internal
     */ sameRoot(rootPath, compare = this.root.name) {
        // windows can (rarely) have case-sensitive filesystem, but
        // UNC and drive letters are always case-insensitive, and canonically
        // represented uppercase.
        rootPath = rootPath.toUpperCase().replace(/\//g, '\\').replace(uncDriveRegexp, '$1\\');
        return rootPath === compare;
    }
}
exports.PathWin32 = PathWin32;
/**
 * Path class used on all posix systems.
 *
 * Uses `'/'` as the path separator.
 */ class PathPosix extends PathBase {
    /**
     * separator for parsing path strings
     */ splitSep = '/';
    /**
     * separator for generating path strings
     */ sep = '/';
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */ constructor(name, type = UNKNOWN, root, roots, nocase, children, opts){
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */ getRootString(path) {
        return path.startsWith('/') ? '/' : '';
    }
    /**
     * @internal
     */ getRoot(_rootPath) {
        return this.root;
    }
    /**
     * @internal
     */ newChild(name, type = UNKNOWN, opts = {}) {
        return new PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
}
exports.PathPosix = PathPosix;
/**
 * The base class for all PathScurry classes, providing the interface for path
 * resolution and filesystem operations.
 *
 * Typically, you should *not* instantiate this class directly, but rather one
 * of the platform-specific classes, or the exported {@link PathScurry} which
 * defaults to the current platform.
 */ class PathScurryBase {
    /**
     * The root Path entry for the current working directory of this Scurry
     */ root;
    /**
     * The string path for the root of this Scurry's current working directory
     */ rootPath;
    /**
     * A collection of all roots encountered, referenced by rootPath
     */ roots;
    /**
     * The Path entry corresponding to this PathScurry's current working directory.
     */ cwd;
    #resolveCache;
    #resolvePosixCache;
    #children;
    /**
     * Perform path comparisons case-insensitively.
     *
     * Defaults true on Darwin and Windows systems, false elsewhere.
     */ nocase;
    #fs;
    /**
     * This class should not be instantiated directly.
     *
     * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
     *
     * @internal
     */ constructor(cwd = process.cwd(), pathImpl, sep, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS } = {}){
        this.#fs = fsFromOption(fs);
        if (cwd instanceof URL || cwd.startsWith('file://')) {
            cwd = (0, node_url_1.fileURLToPath)(cwd);
        }
        // resolve and split root, and then add to the store.
        // this is the only time we call path.resolve()
        const cwdPath = pathImpl.resolve(cwd);
        this.roots = Object.create(null);
        this.rootPath = this.parseRootPath(cwdPath);
        this.#resolveCache = new ResolveCache();
        this.#resolvePosixCache = new ResolveCache();
        this.#children = new ChildrenCache(childrenCacheSize);
        const split = cwdPath.substring(this.rootPath.length).split(sep);
        // resolve('/') leaves '', splits to [''], we don't want that.
        if (split.length === 1 && !split[0]) {
            split.pop();
        }
        /* c8 ignore start */ if (nocase === undefined) {
            throw new TypeError('must provide nocase setting to PathScurryBase ctor');
        }
        /* c8 ignore stop */ this.nocase = nocase;
        this.root = this.newRoot(this.#fs);
        this.roots[this.rootPath] = this.root;
        let prev = this.root;
        let len = split.length - 1;
        const joinSep = pathImpl.sep;
        let abs = this.rootPath;
        let sawFirst = false;
        for (const part of split){
            const l = len--;
            prev = prev.child(part, {
                relative: new Array(l).fill('..').join(joinSep),
                relativePosix: new Array(l).fill('..').join('/'),
                fullpath: abs += (sawFirst ? '' : joinSep) + part
            });
            sawFirst = true;
        }
        this.cwd = prev;
    }
    /**
     * Get the depth of a provided path, string, or the cwd
     */ depth(path = this.cwd) {
        if (typeof path === 'string') {
            path = this.cwd.resolve(path);
        }
        return path.depth();
    }
    /**
     * Return the cache of child entries.  Exposed so subclasses can create
     * child Path objects in a platform-specific way.
     *
     * @internal
     */ childrenCache() {
        return this.#children;
    }
    /**
     * Resolve one or more path strings to a resolved string
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */ resolve(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for(let i = paths.length - 1; i >= 0; i--){
            const p = paths[i];
            if (!p || p === '.') continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolveCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpath();
        this.#resolveCache.set(r, result);
        return result;
    }
    /**
     * Resolve one or more path strings to a resolved string, returning
     * the posix path.  Identical to .resolve() on posix systems, but on
     * windows will return a forward-slash separated UNC path.
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */ resolvePosix(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for(let i = paths.length - 1; i >= 0; i--){
            const p = paths[i];
            if (!p || p === '.') continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolvePosixCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpathPosix();
        this.#resolvePosixCache.set(r, result);
        return result;
    }
    /**
     * find the relative path from the cwd to the supplied path string or entry
     */ relative(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relative();
    }
    /**
     * find the relative path from the cwd to the supplied path string or
     * entry, using / as the path delimiter, even on Windows.
     */ relativePosix(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relativePosix();
    }
    /**
     * Return the basename for the provided string or Path object
     */ basename(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.name;
    }
    /**
     * Return the dirname for the provided string or Path object
     */ dirname(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return (entry.parent || entry).fullpath();
    }
    async readdir(entry = this.cwd, opts = {
        withFileTypes: true
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes } = opts;
        if (!entry.canReaddir()) {
            return [];
        } else {
            const p = await entry.readdir();
            return withFileTypes ? p : p.map((e)=>e.name);
        }
    }
    readdirSync(entry = this.cwd, opts = {
        withFileTypes: true
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true } = opts;
        if (!entry.canReaddir()) {
            return [];
        } else if (withFileTypes) {
            return entry.readdirSync();
        } else {
            return entry.readdirSync().map((e)=>e.name);
        }
    }
    /**
     * Call lstat() on the string or Path object, and update all known
     * information that can be determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */ async lstat(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstat();
    }
    /**
     * synchronous {@link PathScurryBase.lstat}
     */ lstatSync(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstatSync();
    }
    async readlink(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.readlink();
        return withFileTypes ? e : e?.fullpath();
    }
    readlinkSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.readlinkSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async realpath(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.realpath();
        return withFileTypes ? e : e?.fullpath();
    }
    realpathSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.realpathSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async walk(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const walk = (dir, cb)=>{
            dirs.add(dir);
            dir.readdirCB((er, entries)=>{
                /* c8 ignore start */ if (er) {
                    return cb(er);
                }
                /* c8 ignore stop */ let len = entries.length;
                if (!len) return cb();
                const next = ()=>{
                    if (--len === 0) {
                        cb();
                    }
                };
                for (const e of entries){
                    if (!filter || filter(e)) {
                        results.push(withFileTypes ? e : e.fullpath());
                    }
                    if (follow && e.isSymbolicLink()) {
                        e.realpath().then((r)=>r?.isUnknown() ? r.lstat() : r).then((r)=>r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
                    } else {
                        if (e.shouldWalk(dirs, walkFilter)) {
                            walk(e, next);
                        } else {
                            next();
                        }
                    }
                }
            }, true); // zalgooooooo
        };
        const start = entry;
        return new Promise((res, rej)=>{
            walk(start, (er)=>{
                /* c8 ignore start */ if (er) return rej(er);
                /* c8 ignore stop */ res(results);
            });
        });
    }
    walkSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set([
            entry
        ]);
        for (const dir of dirs){
            const entries = dir.readdirSync();
            for (const e of entries){
                if (!filter || filter(e)) {
                    results.push(withFileTypes ? e : e.fullpath());
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync()))) continue;
                    if (r.isUnknown()) r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
        return results;
    }
    /**
     * Support for `for await`
     *
     * Alias for {@link PathScurryBase.iterate}
     *
     * Note: As of Node 19, this is very slow, compared to other methods of
     * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
     * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
     */ [Symbol.asyncIterator]() {
        return this.iterate();
    }
    iterate(entry = this.cwd, options = {}) {
        // iterating async over the stream is significantly more performant,
        // especially in the warm-cache scenario, because it buffers up directory
        // entries in the background instead of waiting for a yield for each one.
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            options = entry;
            entry = this.cwd;
        }
        return this.stream(entry, options)[Symbol.asyncIterator]();
    }
    /**
     * Iterating over a PathScurry performs a synchronous walk.
     *
     * Alias for {@link PathScurryBase.iterateSync}
     */ [Symbol.iterator]() {
        return this.iterateSync();
    }
    *iterateSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        if (!filter || filter(entry)) {
            yield withFileTypes ? entry : entry.fullpath();
        }
        const dirs = new Set([
            entry
        ]);
        for (const dir of dirs){
            const entries = dir.readdirSync();
            for (const e of entries){
                if (!filter || filter(e)) {
                    yield withFileTypes ? e : e.fullpath();
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync()))) continue;
                    if (r.isUnknown()) r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
    }
    stream(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({
            objectMode: true
        });
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const queue = [
            entry
        ];
        let processing = 0;
        const process1 = ()=>{
            let paused = false;
            while(!paused){
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0) results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const onReaddir = (er, entries, didRealpaths = false)=>{
                    /* c8 ignore start */ if (er) return results.emit('error', er);
                    /* c8 ignore stop */ if (follow && !didRealpaths) {
                        const promises = [];
                        for (const e of entries){
                            if (e.isSymbolicLink()) {
                                promises.push(e.realpath().then((r)=>r?.isUnknown() ? r.lstat() : r));
                            }
                        }
                        if (promises.length) {
                            Promise.all(promises).then(()=>onReaddir(null, entries, true));
                            return;
                        }
                    }
                    for (const e of entries){
                        if (e && (!filter || filter(e))) {
                            if (!results.write(withFileTypes ? e : e.fullpath())) {
                                paused = true;
                            }
                        }
                    }
                    processing--;
                    for (const e of entries){
                        const r = e.realpathCached() || e;
                        if (r.shouldWalk(dirs, walkFilter)) {
                            queue.push(r);
                        }
                    }
                    if (paused && !results.flowing) {
                        results.once('drain', process1);
                    } else if (!sync) {
                        process1();
                    }
                };
                // zalgo containment
                let sync = true;
                dir.readdirCB(onReaddir, true);
                sync = false;
            }
        };
        process1();
        return results;
    }
    streamSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({
            objectMode: true
        });
        const dirs = new Set();
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const queue = [
            entry
        ];
        let processing = 0;
        const process1 = ()=>{
            let paused = false;
            while(!paused){
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0) results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const entries = dir.readdirSync();
                for (const e of entries){
                    if (!filter || filter(e)) {
                        if (!results.write(withFileTypes ? e : e.fullpath())) {
                            paused = true;
                        }
                    }
                }
                processing--;
                for (const e of entries){
                    let r = e;
                    if (e.isSymbolicLink()) {
                        if (!(follow && (r = e.realpathSync()))) continue;
                        if (r.isUnknown()) r.lstatSync();
                    }
                    if (r.shouldWalk(dirs, walkFilter)) {
                        queue.push(r);
                    }
                }
            }
            if (paused && !results.flowing) results.once('drain', process1);
        };
        process1();
        return results;
    }
    chdir(path = this.cwd) {
        const oldCwd = this.cwd;
        this.cwd = typeof path === 'string' ? this.cwd.resolve(path) : path;
        this.cwd[setAsCwd](oldCwd);
    }
}
exports.PathScurryBase = PathScurryBase;
/**
 * Windows implementation of {@link PathScurryBase}
 *
 * Defaults to case insensitve, uses `'\\'` to generate path strings.  Uses
 * {@link PathWin32} for Path objects.
 */ class PathScurryWin32 extends PathScurryBase {
    /**
     * separator for generating path strings
     */ sep = '\\';
    constructor(cwd = process.cwd(), opts = {}){
        const { nocase = true } = opts;
        super(cwd, node_path_1.win32, '\\', {
            ...opts,
            nocase
        });
        this.nocase = nocase;
        for(let p = this.cwd; p; p = p.parent){
            p.nocase = this.nocase;
        }
    }
    /**
     * @internal
     */ parseRootPath(dir) {
        // if the path starts with a single separator, it's not a UNC, and we'll
        // just get separator as the root, and driveFromUNC will return \
        // In that case, mount \ on the root from the cwd.
        return node_path_1.win32.parse(dir).root.toUpperCase();
    }
    /**
     * @internal
     */ newRoot(fs) {
        return new PathWin32(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), {
            fs
        });
    }
    /**
     * Return true if the provided path string is an absolute path
     */ isAbsolute(p) {
        return p.startsWith('/') || p.startsWith('\\') || /^[a-z]:(\/|\\)/i.test(p);
    }
}
exports.PathScurryWin32 = PathScurryWin32;
/**
 * {@link PathScurryBase} implementation for all posix systems other than Darwin.
 *
 * Defaults to case-sensitive matching, uses `'/'` to generate path strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */ class PathScurryPosix extends PathScurryBase {
    /**
     * separator for generating path strings
     */ sep = '/';
    constructor(cwd = process.cwd(), opts = {}){
        const { nocase = false } = opts;
        super(cwd, node_path_1.posix, '/', {
            ...opts,
            nocase
        });
        this.nocase = nocase;
    }
    /**
     * @internal
     */ parseRootPath(_dir) {
        return '/';
    }
    /**
     * @internal
     */ newRoot(fs) {
        return new PathPosix(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), {
            fs
        });
    }
    /**
     * Return true if the provided path string is an absolute path
     */ isAbsolute(p) {
        return p.startsWith('/');
    }
}
exports.PathScurryPosix = PathScurryPosix;
/**
 * {@link PathScurryBase} implementation for Darwin (macOS) systems.
 *
 * Defaults to case-insensitive matching, uses `'/'` for generating path
 * strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */ class PathScurryDarwin extends PathScurryPosix {
    constructor(cwd = process.cwd(), opts = {}){
        const { nocase = true } = opts;
        super(cwd, {
            ...opts,
            nocase
        });
    }
}
exports.PathScurryDarwin = PathScurryDarwin;
/**
 * Default {@link PathBase} implementation for the current platform.
 *
 * {@link PathWin32} on Windows systems, {@link PathPosix} on all others.
 */ exports.Path = ("TURBOPACK compile-time truthy", 1) ? PathWin32 : "TURBOPACK unreachable";
/**
 * Default {@link PathScurryBase} implementation for the current platform.
 *
 * {@link PathScurryWin32} on Windows systems, {@link PathScurryDarwin} on
 * Darwin (macOS) systems, {@link PathScurryPosix} on all others.
 */ exports.PathScurry = ("TURBOPACK compile-time truthy", 1) ? PathScurryWin32 : "TURBOPACK unreachable"; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/glob/dist/commonjs/pattern.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// this is just a very light wrapper around 2 arrays with an offset index
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pattern = void 0;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
const isPatternList = (pl)=>pl.length >= 1;
const isGlobList = (gl)=>gl.length >= 1;
/**
 * An immutable-ish view on an array of glob parts and their parsed
 * results
 */ class Pattern {
    #patternList;
    #globList;
    #index;
    length;
    #platform;
    #rest;
    #globString;
    #isDrive;
    #isUNC;
    #isAbsolute;
    #followGlobstar = true;
    constructor(patternList, globList, index, platform){
        if (!isPatternList(patternList)) {
            throw new TypeError('empty pattern list');
        }
        if (!isGlobList(globList)) {
            throw new TypeError('empty glob list');
        }
        if (globList.length !== patternList.length) {
            throw new TypeError('mismatched pattern list and glob list lengths');
        }
        this.length = patternList.length;
        if (index < 0 || index >= this.length) {
            throw new TypeError('index out of range');
        }
        this.#patternList = patternList;
        this.#globList = globList;
        this.#index = index;
        this.#platform = platform;
        // normalize root entries of absolute patterns on initial creation.
        if (this.#index === 0) {
            // c: => ['c:/']
            // C:/ => ['C:/']
            // C:/x => ['C:/', 'x']
            // //host/share => ['//host/share/']
            // //host/share/ => ['//host/share/']
            // //host/share/x => ['//host/share/', 'x']
            // /etc => ['/', 'etc']
            // / => ['/']
            if (this.isUNC()) {
                // '' / '' / 'host' / 'share'
                const [p0, p1, p2, p3, ...prest] = this.#patternList;
                const [g0, g1, g2, g3, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = [
                    p0,
                    p1,
                    p2,
                    p3,
                    ''
                ].join('/');
                const g = [
                    g0,
                    g1,
                    g2,
                    g3,
                    ''
                ].join('/');
                this.#patternList = [
                    p,
                    ...prest
                ];
                this.#globList = [
                    g,
                    ...grest
                ];
                this.length = this.#patternList.length;
            } else if (this.isDrive() || this.isAbsolute()) {
                const [p1, ...prest] = this.#patternList;
                const [g1, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = p1 + '/';
                const g = g1 + '/';
                this.#patternList = [
                    p,
                    ...prest
                ];
                this.#globList = [
                    g,
                    ...grest
                ];
                this.length = this.#patternList.length;
            }
        }
    }
    /**
     * The first entry in the parsed list of patterns
     */ pattern() {
        return this.#patternList[this.#index];
    }
    /**
     * true of if pattern() returns a string
     */ isString() {
        return typeof this.#patternList[this.#index] === 'string';
    }
    /**
     * true of if pattern() returns GLOBSTAR
     */ isGlobstar() {
        return this.#patternList[this.#index] === minimatch_1.GLOBSTAR;
    }
    /**
     * true if pattern() returns a regexp
     */ isRegExp() {
        return this.#patternList[this.#index] instanceof RegExp;
    }
    /**
     * The /-joined set of glob parts that make up this pattern
     */ globString() {
        return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join('/') : this.#globList.join('/') : this.#globList.slice(this.#index).join('/'));
    }
    /**
     * true if there are more pattern parts after this one
     */ hasMore() {
        return this.length > this.#index + 1;
    }
    /**
     * The rest of the pattern after this part, or null if this is the end
     */ rest() {
        if (this.#rest !== undefined) return this.#rest;
        if (!this.hasMore()) return this.#rest = null;
        this.#rest = new Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
        this.#rest.#isAbsolute = this.#isAbsolute;
        this.#rest.#isUNC = this.#isUNC;
        this.#rest.#isDrive = this.#isDrive;
        return this.#rest;
    }
    /**
     * true if the pattern represents a //unc/path/ on windows
     */ isUNC() {
        const pl = this.#patternList;
        return this.#isUNC !== undefined ? this.#isUNC : this.#isUNC = this.#platform === 'win32' && this.#index === 0 && pl[0] === '' && pl[1] === '' && typeof pl[2] === 'string' && !!pl[2] && typeof pl[3] === 'string' && !!pl[3];
    }
    // pattern like C:/...
    // split = ['C:', ...]
    // XXX: would be nice to handle patterns like `c:*` to test the cwd
    // in c: for *, but I don't know of a way to even figure out what that
    // cwd is without actually chdir'ing into it?
    /**
     * True if the pattern starts with a drive letter on Windows
     */ isDrive() {
        const pl = this.#patternList;
        return this.#isDrive !== undefined ? this.#isDrive : this.#isDrive = this.#platform === 'win32' && this.#index === 0 && this.length > 1 && typeof pl[0] === 'string' && /^[a-z]:$/i.test(pl[0]);
    }
    // pattern = '/' or '/...' or '/x/...'
    // split = ['', ''] or ['', ...] or ['', 'x', ...]
    // Drive and UNC both considered absolute on windows
    /**
     * True if the pattern is rooted on an absolute path
     */ isAbsolute() {
        const pl = this.#patternList;
        return this.#isAbsolute !== undefined ? this.#isAbsolute : this.#isAbsolute = pl[0] === '' && pl.length > 1 || this.isDrive() || this.isUNC();
    }
    /**
     * consume the root of the pattern, and return it
     */ root() {
        const p = this.#patternList[0];
        return typeof p === 'string' && this.isAbsolute() && this.#index === 0 ? p : '';
    }
    /**
     * Check to see if the current globstar pattern is allowed to follow
     * a symbolic link.
     */ checkFollowGlobstar() {
        return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
    }
    /**
     * Mark that the current globstar pattern is following a symbolic link
     */ markFollowGlobstar() {
        if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar) return false;
        this.#followGlobstar = false;
        return true;
    }
}
exports.Pattern = Pattern; //# sourceMappingURL=pattern.js.map
}),
"[project]/node_modules/glob/dist/commonjs/ignore.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// give it a pattern, and it'll be able to tell you if
// a given path should be ignored.
// Ignoring a path ignores its children if the pattern ends in /**
// Ignores are always parsed in dot:true mode
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ignore = void 0;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
const pattern_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/pattern.js [app-route] (ecmascript)");
const defaultPlatform = typeof process === 'object' && process && typeof process.platform === 'string' ? process.platform : 'linux';
/**
 * Class used to process ignored patterns
 */ class Ignore {
    relative;
    relativeChildren;
    absolute;
    absoluteChildren;
    platform;
    mmopts;
    constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform }){
        this.relative = [];
        this.absolute = [];
        this.relativeChildren = [];
        this.absoluteChildren = [];
        this.platform = platform;
        this.mmopts = {
            dot: true,
            nobrace,
            nocase,
            noext,
            noglobstar,
            optimizationLevel: 2,
            platform,
            nocomment: true,
            nonegate: true
        };
        for (const ign of ignored)this.add(ign);
    }
    add(ign) {
        // this is a little weird, but it gives us a clean set of optimized
        // minimatch matchers, without getting tripped up if one of them
        // ends in /** inside a brace section, and it's only inefficient at
        // the start of the walk, not along it.
        // It'd be nice if the Pattern class just had a .test() method, but
        // handling globstars is a bit of a pita, and that code already lives
        // in minimatch anyway.
        // Another way would be if maybe Minimatch could take its set/globParts
        // as an option, and then we could at least just use Pattern to test
        // for absolute-ness.
        // Yet another way, Minimatch could take an array of glob strings, and
        // a cwd option, and do the right thing.
        const mm = new minimatch_1.Minimatch(ign, this.mmopts);
        for(let i = 0; i < mm.set.length; i++){
            const parsed = mm.set[i];
            const globParts = mm.globParts[i];
            /* c8 ignore start */ if (!parsed || !globParts) {
                throw new Error('invalid pattern object');
            }
            // strip off leading ./ portions
            // https://github.com/isaacs/node-glob/issues/570
            while(parsed[0] === '.' && globParts[0] === '.'){
                parsed.shift();
                globParts.shift();
            }
            /* c8 ignore stop */ const p = new pattern_js_1.Pattern(parsed, globParts, 0, this.platform);
            const m = new minimatch_1.Minimatch(p.globString(), this.mmopts);
            const children = globParts[globParts.length - 1] === '**';
            const absolute = p.isAbsolute();
            if (absolute) this.absolute.push(m);
            else this.relative.push(m);
            if (children) {
                if (absolute) this.absoluteChildren.push(m);
                else this.relativeChildren.push(m);
            }
        }
    }
    ignored(p) {
        const fullpath = p.fullpath();
        const fullpaths = `${fullpath}/`;
        const relative = p.relative() || '.';
        const relatives = `${relative}/`;
        for (const m of this.relative){
            if (m.match(relative) || m.match(relatives)) return true;
        }
        for (const m of this.absolute){
            if (m.match(fullpath) || m.match(fullpaths)) return true;
        }
        return false;
    }
    childrenIgnored(p) {
        const fullpath = p.fullpath() + '/';
        const relative = (p.relative() || '.') + '/';
        for (const m of this.relativeChildren){
            if (m.match(relative)) return true;
        }
        for (const m of this.absoluteChildren){
            if (m.match(fullpath)) return true;
        }
        return false;
    }
}
exports.Ignore = Ignore; //# sourceMappingURL=ignore.js.map
}),
"[project]/node_modules/glob/dist/commonjs/processor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// synchronous utility for filtering entries and calculating subwalks
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Processor = exports.SubWalks = exports.MatchRecord = exports.HasWalkedCache = void 0;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
/**
 * A cache of which patterns have been processed for a given Path
 */ class HasWalkedCache {
    store;
    constructor(store = new Map()){
        this.store = store;
    }
    copy() {
        return new HasWalkedCache(new Map(this.store));
    }
    hasWalked(target, pattern) {
        return this.store.get(target.fullpath())?.has(pattern.globString());
    }
    storeWalked(target, pattern) {
        const fullpath = target.fullpath();
        const cached = this.store.get(fullpath);
        if (cached) cached.add(pattern.globString());
        else this.store.set(fullpath, new Set([
            pattern.globString()
        ]));
    }
}
exports.HasWalkedCache = HasWalkedCache;
/**
 * A record of which paths have been matched in a given walk step,
 * and whether they only are considered a match if they are a directory,
 * and whether their absolute or relative path should be returned.
 */ class MatchRecord {
    store = new Map();
    add(target, absolute, ifDir) {
        const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
        const current = this.store.get(target);
        this.store.set(target, current === undefined ? n : n & current);
    }
    // match, absolute, ifdir
    entries() {
        return [
            ...this.store.entries()
        ].map(([path, n])=>[
                path,
                !!(n & 2),
                !!(n & 1)
            ]);
    }
}
exports.MatchRecord = MatchRecord;
/**
 * A collection of patterns that must be processed in a subsequent step
 * for a given path.
 */ class SubWalks {
    store = new Map();
    add(target, pattern) {
        if (!target.canReaddir()) {
            return;
        }
        const subs = this.store.get(target);
        if (subs) {
            if (!subs.find((p)=>p.globString() === pattern.globString())) {
                subs.push(pattern);
            }
        } else this.store.set(target, [
            pattern
        ]);
    }
    get(target) {
        const subs = this.store.get(target);
        /* c8 ignore start */ if (!subs) {
            throw new Error('attempting to walk unknown path');
        }
        /* c8 ignore stop */ return subs;
    }
    entries() {
        return this.keys().map((k)=>[
                k,
                this.store.get(k)
            ]);
    }
    keys() {
        return [
            ...this.store.keys()
        ].filter((t)=>t.canReaddir());
    }
}
exports.SubWalks = SubWalks;
/**
 * The class that processes patterns for a given path.
 *
 * Handles child entry filtering, and determining whether a path's
 * directory contents must be read.
 */ class Processor {
    hasWalkedCache;
    matches = new MatchRecord();
    subwalks = new SubWalks();
    patterns;
    follow;
    dot;
    opts;
    constructor(opts, hasWalkedCache){
        this.opts = opts;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
    }
    processPatterns(target, patterns) {
        this.patterns = patterns;
        const processingSet = patterns.map((p)=>[
                target,
                p
            ]);
        // map of paths to the magic-starting subwalks they need to walk
        // first item in patterns is the filter
        for (let [t, pattern] of processingSet){
            this.hasWalkedCache.storeWalked(t, pattern);
            const root = pattern.root();
            const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
            // start absolute patterns at root
            if (root) {
                t = t.resolve(root === '/' && this.opts.root !== undefined ? this.opts.root : root);
                const rest = pattern.rest();
                if (!rest) {
                    this.matches.add(t, true, false);
                    continue;
                } else {
                    pattern = rest;
                }
            }
            if (t.isENOENT()) continue;
            let p;
            let rest;
            let changed = false;
            while(typeof (p = pattern.pattern()) === 'string' && (rest = pattern.rest())){
                const c = t.resolve(p);
                t = c;
                pattern = rest;
                changed = true;
            }
            p = pattern.pattern();
            rest = pattern.rest();
            if (changed) {
                if (this.hasWalkedCache.hasWalked(t, pattern)) continue;
                this.hasWalkedCache.storeWalked(t, pattern);
            }
            // now we have either a final string for a known entry,
            // more strings for an unknown entry,
            // or a pattern starting with magic, mounted on t.
            if (typeof p === 'string') {
                // must not be final entry, otherwise we would have
                // concatenated it earlier.
                const ifDir = p === '..' || p === '' || p === '.';
                this.matches.add(t.resolve(p), absolute, ifDir);
                continue;
            } else if (p === minimatch_1.GLOBSTAR) {
                // if no rest, match and subwalk pattern
                // if rest, process rest and subwalk pattern
                // if it's a symlink, but we didn't get here by way of a
                // globstar match (meaning it's the first time THIS globstar
                // has traversed a symlink), then we follow it. Otherwise, stop.
                if (!t.isSymbolicLink() || this.follow || pattern.checkFollowGlobstar()) {
                    this.subwalks.add(t, pattern);
                }
                const rp = rest?.pattern();
                const rrest = rest?.rest();
                if (!rest || (rp === '' || rp === '.') && !rrest) {
                    // only HAS to be a dir if it ends in **/ or **/.
                    // but ending in ** will match files as well.
                    this.matches.add(t, absolute, rp === '' || rp === '.');
                } else {
                    if (rp === '..') {
                        // this would mean you're matching **/.. at the fs root,
                        // and no thanks, I'm not gonna test that specific case.
                        /* c8 ignore start */ const tp = t.parent || t;
                        /* c8 ignore stop */ if (!rrest) this.matches.add(tp, absolute, true);
                        else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
                            this.subwalks.add(tp, rrest);
                        }
                    }
                }
            } else if (p instanceof RegExp) {
                this.subwalks.add(t, pattern);
            }
        }
        return this;
    }
    subwalkTargets() {
        return this.subwalks.keys();
    }
    child() {
        return new Processor(this.opts, this.hasWalkedCache);
    }
    // return a new Processor containing the subwalks for each
    // child entry, and a set of matches, and
    // a hasWalkedCache that's a copy of this one
    // then we're going to call
    filterEntries(parent, entries) {
        const patterns = this.subwalks.get(parent);
        // put matches and entry walks into the results processor
        const results = this.child();
        for (const e of entries){
            for (const pattern of patterns){
                const absolute = pattern.isAbsolute();
                const p = pattern.pattern();
                const rest = pattern.rest();
                if (p === minimatch_1.GLOBSTAR) {
                    results.testGlobstar(e, pattern, rest, absolute);
                } else if (p instanceof RegExp) {
                    results.testRegExp(e, p, rest, absolute);
                } else {
                    results.testString(e, p, rest, absolute);
                }
            }
        }
        return results;
    }
    testGlobstar(e, pattern, rest, absolute) {
        if (this.dot || !e.name.startsWith('.')) {
            if (!pattern.hasMore()) {
                this.matches.add(e, absolute, false);
            }
            if (e.canReaddir()) {
                // if we're in follow mode or it's not a symlink, just keep
                // testing the same pattern. If there's more after the globstar,
                // then this symlink consumes the globstar. If not, then we can
                // follow at most ONE symlink along the way, so we mark it, which
                // also checks to ensure that it wasn't already marked.
                if (this.follow || !e.isSymbolicLink()) {
                    this.subwalks.add(e, pattern);
                } else if (e.isSymbolicLink()) {
                    if (rest && pattern.checkFollowGlobstar()) {
                        this.subwalks.add(e, rest);
                    } else if (pattern.markFollowGlobstar()) {
                        this.subwalks.add(e, pattern);
                    }
                }
            }
        }
        // if the NEXT thing matches this entry, then also add
        // the rest.
        if (rest) {
            const rp = rest.pattern();
            if (typeof rp === 'string' && // dots and empty were handled already
            rp !== '..' && rp !== '' && rp !== '.') {
                this.testString(e, rp, rest.rest(), absolute);
            } else if (rp === '..') {
                /* c8 ignore start */ const ep = e.parent || e;
                /* c8 ignore stop */ this.subwalks.add(ep, rest);
            } else if (rp instanceof RegExp) {
                this.testRegExp(e, rp, rest.rest(), absolute);
            }
        }
    }
    testRegExp(e, p, rest, absolute) {
        if (!p.test(e.name)) return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        } else {
            this.subwalks.add(e, rest);
        }
    }
    testString(e, p, rest, absolute) {
        // should never happen?
        if (!e.isNamed(p)) return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        } else {
            this.subwalks.add(e, rest);
        }
    }
}
exports.Processor = Processor; //# sourceMappingURL=processor.js.map
}),
"[project]/node_modules/glob/dist/commonjs/walker.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GlobStream = exports.GlobWalker = exports.GlobUtil = void 0;
/**
 * Single-use utility classes to provide functionality to the {@link Glob}
 * methods.
 *
 * @module
 */ const minipass_1 = __turbopack_context__.r("[project]/node_modules/minipass/dist/commonjs/index.js [app-route] (ecmascript)");
const ignore_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/ignore.js [app-route] (ecmascript)");
const processor_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/processor.js [app-route] (ecmascript)");
const makeIgnore = (ignore, opts)=>typeof ignore === 'string' ? new ignore_js_1.Ignore([
        ignore
    ], opts) : Array.isArray(ignore) ? new ignore_js_1.Ignore(ignore, opts) : ignore;
/**
 * basic walking utilities that all the glob walker types use
 */ class GlobUtil {
    path;
    patterns;
    opts;
    seen = new Set();
    paused = false;
    aborted = false;
    #onResume = [];
    #ignore;
    #sep;
    signal;
    maxDepth;
    includeChildMatches;
    constructor(patterns, path, opts){
        this.patterns = patterns;
        this.path = path;
        this.opts = opts;
        this.#sep = !opts.posix && opts.platform === 'win32' ? '\\' : '/';
        this.includeChildMatches = opts.includeChildMatches !== false;
        if (opts.ignore || !this.includeChildMatches) {
            this.#ignore = makeIgnore(opts.ignore ?? [], opts);
            if (!this.includeChildMatches && typeof this.#ignore.add !== 'function') {
                const m = 'cannot ignore child matches, ignore lacks add() method.';
                throw new Error(m);
            }
        }
        // ignore, always set with maxDepth, but it's optional on the
        // GlobOptions type
        /* c8 ignore start */ this.maxDepth = opts.maxDepth || Infinity;
        /* c8 ignore stop */ if (opts.signal) {
            this.signal = opts.signal;
            this.signal.addEventListener('abort', ()=>{
                this.#onResume.length = 0;
            });
        }
    }
    #ignored(path) {
        return this.seen.has(path) || !!this.#ignore?.ignored?.(path);
    }
    #childrenIgnored(path) {
        return !!this.#ignore?.childrenIgnored?.(path);
    }
    // backpressure mechanism
    pause() {
        this.paused = true;
    }
    resume() {
        /* c8 ignore start */ if (this.signal?.aborted) return;
        /* c8 ignore stop */ this.paused = false;
        let fn = undefined;
        while(!this.paused && (fn = this.#onResume.shift())){
            fn();
        }
    }
    onResume(fn) {
        if (this.signal?.aborted) return;
        /* c8 ignore start */ if (!this.paused) {
            fn();
        } else {
            /* c8 ignore stop */ this.#onResume.push(fn);
        }
    }
    // do the requisite realpath/stat checking, and return the path
    // to add or undefined to filter it out.
    async matchCheck(e, ifDir) {
        if (ifDir && this.opts.nodir) return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || await e.realpath();
            if (!rpc) return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        const s = needStat ? await e.lstat() : e;
        if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
            const target = await s.realpath();
            /* c8 ignore start */ if (target && (target.isUnknown() || this.opts.stat)) {
                await target.lstat();
            }
        /* c8 ignore stop */ }
        return this.matchCheckTest(s, ifDir);
    }
    matchCheckTest(e, ifDir) {
        return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && (!this.opts.nodir || !this.opts.follow || !e.isSymbolicLink() || !e.realpathCached()?.isDirectory()) && !this.#ignored(e) ? e : undefined;
    }
    matchCheckSync(e, ifDir) {
        if (ifDir && this.opts.nodir) return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || e.realpathSync();
            if (!rpc) return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        const s = needStat ? e.lstatSync() : e;
        if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
            const target = s.realpathSync();
            if (target && (target?.isUnknown() || this.opts.stat)) {
                target.lstatSync();
            }
        }
        return this.matchCheckTest(s, ifDir);
    }
    matchFinish(e, absolute) {
        if (this.#ignored(e)) return;
        // we know we have an ignore if this is false, but TS doesn't
        if (!this.includeChildMatches && this.#ignore?.add) {
            const ign = `${e.relativePosix()}/**`;
            this.#ignore.add(ign);
        }
        const abs = this.opts.absolute === undefined ? absolute : this.opts.absolute;
        this.seen.add(e);
        const mark = this.opts.mark && e.isDirectory() ? this.#sep : '';
        // ok, we have what we need!
        if (this.opts.withFileTypes) {
            this.matchEmit(e);
        } else if (abs) {
            const abs = this.opts.posix ? e.fullpathPosix() : e.fullpath();
            this.matchEmit(abs + mark);
        } else {
            const rel = this.opts.posix ? e.relativePosix() : e.relative();
            const pre = this.opts.dotRelative && !rel.startsWith('..' + this.#sep) ? '.' + this.#sep : '';
            this.matchEmit(!rel ? '.' + mark : pre + rel + mark);
        }
    }
    async match(e, absolute, ifDir) {
        const p = await this.matchCheck(e, ifDir);
        if (p) this.matchFinish(p, absolute);
    }
    matchSync(e, absolute, ifDir) {
        const p = this.matchCheckSync(e, ifDir);
        if (p) this.matchFinish(p, absolute);
    }
    walkCB(target, patterns, cb) {
        /* c8 ignore start */ if (this.signal?.aborted) cb();
        /* c8 ignore stop */ this.walkCB2(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target)) return cb();
        if (this.signal?.aborted) cb();
        if (this.paused) {
            this.onResume(()=>this.walkCB2(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = ()=>{
            if (--tasks === 0) cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()){
            if (this.#ignored(m)) continue;
            tasks++;
            this.match(m, absolute, ifDir).then(()=>next());
        }
        for (const t of processor.subwalkTargets()){
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const childrenCached = t.readdirCached();
            if (t.calledReaddir()) this.walkCB3(t, childrenCached, processor, next);
            else {
                t.readdirCB((_, entries)=>this.walkCB3(t, entries, processor, next), true);
            }
        }
        next();
    }
    walkCB3(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = ()=>{
            if (--tasks === 0) cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()){
            if (this.#ignored(m)) continue;
            tasks++;
            this.match(m, absolute, ifDir).then(()=>next());
        }
        for (const [target, patterns] of processor.subwalks.entries()){
            tasks++;
            this.walkCB2(target, patterns, processor.child(), next);
        }
        next();
    }
    walkCBSync(target, patterns, cb) {
        /* c8 ignore start */ if (this.signal?.aborted) cb();
        /* c8 ignore stop */ this.walkCB2Sync(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2Sync(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target)) return cb();
        if (this.signal?.aborted) cb();
        if (this.paused) {
            this.onResume(()=>this.walkCB2Sync(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = ()=>{
            if (--tasks === 0) cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()){
            if (this.#ignored(m)) continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const t of processor.subwalkTargets()){
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const children = t.readdirSync();
            this.walkCB3Sync(t, children, processor, next);
        }
        next();
    }
    walkCB3Sync(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = ()=>{
            if (--tasks === 0) cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()){
            if (this.#ignored(m)) continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const [target, patterns] of processor.subwalks.entries()){
            tasks++;
            this.walkCB2Sync(target, patterns, processor.child(), next);
        }
        next();
    }
}
exports.GlobUtil = GlobUtil;
class GlobWalker extends GlobUtil {
    matches = new Set();
    constructor(patterns, path, opts){
        super(patterns, path, opts);
    }
    matchEmit(e) {
        this.matches.add(e);
    }
    async walk() {
        if (this.signal?.aborted) throw this.signal.reason;
        if (this.path.isUnknown()) {
            await this.path.lstat();
        }
        await new Promise((res, rej)=>{
            this.walkCB(this.path, this.patterns, ()=>{
                if (this.signal?.aborted) {
                    rej(this.signal.reason);
                } else {
                    res(this.matches);
                }
            });
        });
        return this.matches;
    }
    walkSync() {
        if (this.signal?.aborted) throw this.signal.reason;
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        // nothing for the callback to do, because this never pauses
        this.walkCBSync(this.path, this.patterns, ()=>{
            if (this.signal?.aborted) throw this.signal.reason;
        });
        return this.matches;
    }
}
exports.GlobWalker = GlobWalker;
class GlobStream extends GlobUtil {
    results;
    constructor(patterns, path, opts){
        super(patterns, path, opts);
        this.results = new minipass_1.Minipass({
            signal: this.signal,
            objectMode: true
        });
        this.results.on('drain', ()=>this.resume());
        this.results.on('resume', ()=>this.resume());
    }
    matchEmit(e) {
        this.results.write(e);
        if (!this.results.flowing) this.pause();
    }
    stream() {
        const target = this.path;
        if (target.isUnknown()) {
            target.lstat().then(()=>{
                this.walkCB(target, this.patterns, ()=>this.results.end());
            });
        } else {
            this.walkCB(target, this.patterns, ()=>this.results.end());
        }
        return this.results;
    }
    streamSync() {
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, ()=>this.results.end());
        return this.results;
    }
}
exports.GlobStream = GlobStream; //# sourceMappingURL=walker.js.map
}),
"[project]/node_modules/glob/dist/commonjs/glob.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Glob = void 0;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
const node_url_1 = __turbopack_context__.r("[externals]/node:url [external] (node:url, cjs)");
const path_scurry_1 = __turbopack_context__.r("[project]/node_modules/path-scurry/dist/commonjs/index.js [app-route] (ecmascript)");
const pattern_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/pattern.js [app-route] (ecmascript)");
const walker_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/walker.js [app-route] (ecmascript)");
// if no process global, just call it linux.
// so we default to case-sensitive, / separators
const defaultPlatform = typeof process === 'object' && process && typeof process.platform === 'string' ? process.platform : 'linux';
/**
 * An object that can perform glob pattern traversals.
 */ class Glob {
    absolute;
    cwd;
    root;
    dot;
    dotRelative;
    follow;
    ignore;
    magicalBraces;
    mark;
    matchBase;
    maxDepth;
    nobrace;
    nocase;
    nodir;
    noext;
    noglobstar;
    pattern;
    platform;
    realpath;
    scurry;
    stat;
    signal;
    windowsPathsNoEscape;
    withFileTypes;
    includeChildMatches;
    /**
     * The options provided to the constructor.
     */ opts;
    /**
     * An array of parsed immutable {@link Pattern} objects.
     */ patterns;
    /**
     * All options are stored as properties on the `Glob` object.
     *
     * See {@link GlobOptions} for full options descriptions.
     *
     * Note that a previous `Glob` object can be passed as the
     * `GlobOptions` to another `Glob` instantiation to re-use settings
     * and caches with a new pattern.
     *
     * Traversal functions can be called multiple times to run the walk
     * again.
     */ constructor(pattern, opts){
        /* c8 ignore start */ if (!opts) throw new TypeError('glob options required');
        /* c8 ignore stop */ this.withFileTypes = !!opts.withFileTypes;
        this.signal = opts.signal;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.dotRelative = !!opts.dotRelative;
        this.nodir = !!opts.nodir;
        this.mark = !!opts.mark;
        if (!opts.cwd) {
            this.cwd = '';
        } else if (opts.cwd instanceof URL || opts.cwd.startsWith('file://')) {
            opts.cwd = (0, node_url_1.fileURLToPath)(opts.cwd);
        }
        this.cwd = opts.cwd || '';
        this.root = opts.root;
        this.magicalBraces = !!opts.magicalBraces;
        this.nobrace = !!opts.nobrace;
        this.noext = !!opts.noext;
        this.realpath = !!opts.realpath;
        this.absolute = opts.absolute;
        this.includeChildMatches = opts.includeChildMatches !== false;
        this.noglobstar = !!opts.noglobstar;
        this.matchBase = !!opts.matchBase;
        this.maxDepth = typeof opts.maxDepth === 'number' ? opts.maxDepth : Infinity;
        this.stat = !!opts.stat;
        this.ignore = opts.ignore;
        if (this.withFileTypes && this.absolute !== undefined) {
            throw new Error('cannot set absolute and withFileTypes:true');
        }
        if (typeof pattern === 'string') {
            pattern = [
                pattern
            ];
        }
        this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            pattern = pattern.map((p)=>p.replace(/\\/g, '/'));
        }
        if (this.matchBase) {
            if (opts.noglobstar) {
                throw new TypeError('base matching requires globstar');
            }
            pattern = pattern.map((p)=>p.includes('/') ? p : `./**/${p}`);
        }
        this.pattern = pattern;
        this.platform = opts.platform || defaultPlatform;
        this.opts = {
            ...opts,
            platform: this.platform
        };
        if (opts.scurry) {
            this.scurry = opts.scurry;
            if (opts.nocase !== undefined && opts.nocase !== opts.scurry.nocase) {
                throw new Error('nocase option contradicts provided scurry option');
            }
        } else {
            const Scurry = opts.platform === 'win32' ? path_scurry_1.PathScurryWin32 : opts.platform === 'darwin' ? path_scurry_1.PathScurryDarwin : opts.platform ? path_scurry_1.PathScurryPosix : path_scurry_1.PathScurry;
            this.scurry = new Scurry(this.cwd, {
                nocase: opts.nocase,
                fs: opts.fs
            });
        }
        this.nocase = this.scurry.nocase;
        // If you do nocase:true on a case-sensitive file system, then
        // we need to use regexps instead of strings for non-magic
        // path portions, because statting `aBc` won't return results
        // for the file `AbC` for example.
        const nocaseMagicOnly = this.platform === 'darwin' || this.platform === 'win32';
        const mmo = {
            // default nocase based on platform
            ...opts,
            dot: this.dot,
            matchBase: this.matchBase,
            nobrace: this.nobrace,
            nocase: this.nocase,
            nocaseMagicOnly,
            nocomment: true,
            noext: this.noext,
            nonegate: true,
            optimizationLevel: 2,
            platform: this.platform,
            windowsPathsNoEscape: this.windowsPathsNoEscape,
            debug: !!this.opts.debug
        };
        const mms = this.pattern.map((p)=>new minimatch_1.Minimatch(p, mmo));
        const [matchSet, globParts] = mms.reduce((set, m)=>{
            set[0].push(...m.set);
            set[1].push(...m.globParts);
            return set;
        }, [
            [],
            []
        ]);
        this.patterns = matchSet.map((set, i)=>{
            const g = globParts[i];
            /* c8 ignore start */ if (!g) throw new Error('invalid pattern object');
            /* c8 ignore stop */ return new pattern_js_1.Pattern(set, g, 0, this.platform);
        });
    }
    async walk() {
        // Walkers always return array of Path objects, so we just have to
        // coerce them into the right shape.  It will have already called
        // realpath() if the option was set to do so, so we know that's cached.
        // start out knowing the cwd, at least
        return [
            ...await new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                platform: this.platform,
                nocase: this.nocase,
                includeChildMatches: this.includeChildMatches
            }).walk()
        ];
    }
    walkSync() {
        return [
            ...new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
                platform: this.platform,
                nocase: this.nocase,
                includeChildMatches: this.includeChildMatches
            }).walkSync()
        ];
    }
    stream() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase,
            includeChildMatches: this.includeChildMatches
        }).stream();
    }
    streamSync() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase,
            includeChildMatches: this.includeChildMatches
        }).streamSync();
    }
    /**
     * Default sync iteration function. Returns a Generator that
     * iterates over the results.
     */ iterateSync() {
        return this.streamSync()[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.iterateSync();
    }
    /**
     * Default async iteration function. Returns an AsyncGenerator that
     * iterates over the results.
     */ iterate() {
        return this.stream()[Symbol.asyncIterator]();
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
}
exports.Glob = Glob; //# sourceMappingURL=glob.js.map
}),
"[project]/node_modules/glob/dist/commonjs/has-magic.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasMagic = void 0;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
/**
 * Return true if the patterns provided contain any magic glob characters,
 * given the options provided.
 *
 * Brace expansion is not considered "magic" unless the `magicalBraces` option
 * is set, as brace expansion just turns one string into an array of strings.
 * So a pattern like `'x{a,b}y'` would return `false`, because `'xay'` and
 * `'xby'` both do not contain any magic glob characters, and it's treated the
 * same as if you had called it on `['xay', 'xby']`. When `magicalBraces:true`
 * is in the options, brace expansion _is_ treated as a pattern having magic.
 */ const hasMagic = (pattern, options = {})=>{
    if (!Array.isArray(pattern)) {
        pattern = [
            pattern
        ];
    }
    for (const p of pattern){
        if (new minimatch_1.Minimatch(p, options).hasMagic()) return true;
    }
    return false;
};
exports.hasMagic = hasMagic; //# sourceMappingURL=has-magic.js.map
}),
"[project]/node_modules/glob/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.glob = exports.sync = exports.iterate = exports.iterateSync = exports.stream = exports.streamSync = exports.Ignore = exports.hasMagic = exports.Glob = exports.unescape = exports.escape = void 0;
exports.globStreamSync = globStreamSync;
exports.globStream = globStream;
exports.globSync = globSync;
exports.globIterateSync = globIterateSync;
exports.globIterate = globIterate;
const minimatch_1 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
const glob_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/glob.js [app-route] (ecmascript)");
const has_magic_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/has-magic.js [app-route] (ecmascript)");
var minimatch_2 = __turbopack_context__.r("[project]/node_modules/glob/node_modules/minimatch/dist/commonjs/index.js [app-route] (ecmascript)");
Object.defineProperty(exports, "escape", {
    enumerable: true,
    get: function() {
        return minimatch_2.escape;
    }
});
Object.defineProperty(exports, "unescape", {
    enumerable: true,
    get: function() {
        return minimatch_2.unescape;
    }
});
var glob_js_2 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/glob.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Glob", {
    enumerable: true,
    get: function() {
        return glob_js_2.Glob;
    }
});
var has_magic_js_2 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/has-magic.js [app-route] (ecmascript)");
Object.defineProperty(exports, "hasMagic", {
    enumerable: true,
    get: function() {
        return has_magic_js_2.hasMagic;
    }
});
var ignore_js_1 = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/ignore.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Ignore", {
    enumerable: true,
    get: function() {
        return ignore_js_1.Ignore;
    }
});
function globStreamSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).streamSync();
}
function globStream(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).stream();
}
function globSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walkSync();
}
async function glob_(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walk();
}
function globIterateSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterateSync();
}
function globIterate(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterate();
}
// aliases: glob.sync.stream() glob.stream.sync() glob.sync() etc
exports.streamSync = globStreamSync;
exports.stream = Object.assign(globStream, {
    sync: globStreamSync
});
exports.iterateSync = globIterateSync;
exports.iterate = Object.assign(globIterate, {
    sync: globIterateSync
});
exports.sync = Object.assign(globSync, {
    stream: globStreamSync,
    iterate: globIterateSync
});
exports.glob = Object.assign(glob_, {
    glob: glob_,
    globSync,
    sync: exports.sync,
    globStream,
    stream: exports.stream,
    globStreamSync,
    streamSync: exports.streamSync,
    globIterate,
    iterate: exports.iterate,
    globIterateSync,
    iterateSync: exports.iterateSync,
    Glob: glob_js_1.Glob,
    hasMagic: has_magic_js_1.hasMagic,
    escape: minimatch_1.escape,
    unescape: minimatch_1.unescape
});
exports.glob.glob = exports.glob; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/archiver-utils/file.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * archiver-utils
 *
 * Copyright (c) 2012-2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-archiver/blob/master/LICENSE-MIT
 */ var fs = __turbopack_context__.r("[project]/node_modules/graceful-fs/graceful-fs.js [app-route] (ecmascript)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var flatten = __turbopack_context__.r("[project]/node_modules/lodash/flatten.js [app-route] (ecmascript)");
var difference = __turbopack_context__.r("[project]/node_modules/lodash/difference.js [app-route] (ecmascript)");
var union = __turbopack_context__.r("[project]/node_modules/lodash/union.js [app-route] (ecmascript)");
var isPlainObject = __turbopack_context__.r("[project]/node_modules/lodash/isPlainObject.js [app-route] (ecmascript)");
var glob = __turbopack_context__.r("[project]/node_modules/glob/dist/commonjs/index.js [app-route] (ecmascript)");
var file = module.exports = {};
var pathSeparatorRe = /[\/\\]/g;
// Process specified wildcard glob patterns or filenames against a
// callback, excluding and uniquing files in the result set.
var processPatterns = function(patterns, fn) {
    // Filepaths to return.
    var result = [];
    // Iterate over flattened patterns array.
    flatten(patterns).forEach(function(pattern) {
        // If the first character is ! it should be omitted
        var exclusion = pattern.indexOf('!') === 0;
        // If the pattern is an exclusion, remove the !
        if (exclusion) {
            pattern = pattern.slice(1);
        }
        // Find all matching files for this pattern.
        var matches = fn(pattern);
        if (exclusion) {
            // If an exclusion, remove matching files.
            result = difference(result, matches);
        } else {
            // Otherwise add matching files.
            result = union(result, matches);
        }
    });
    return result;
};
// True if the file path exists.
file.exists = function() {
    var filepath = path.join.apply(path, arguments);
    return fs.existsSync(filepath);
};
// Return an array of all file paths that match the given wildcard patterns.
file.expand = function(...args) {
    // If the first argument is an options object, save those options to pass
    // into the File.prototype.glob.sync method.
    var options = isPlainObject(args[0]) ? args.shift() : {};
    // Use the first argument if it's an Array, otherwise convert the arguments
    // object to an array and use that.
    var patterns = Array.isArray(args[0]) ? args[0] : args;
    // Return empty set if there are no patterns or filepaths.
    if (patterns.length === 0) {
        return [];
    }
    // Return all matching filepaths.
    var matches = processPatterns(patterns, function(pattern) {
        // Find all matching files for this pattern.
        return glob.sync(pattern, options);
    });
    // Filter result set?
    if (options.filter) {
        matches = matches.filter(function(filepath) {
            filepath = path.join(options.cwd || '', filepath);
            try {
                if (typeof options.filter === 'function') {
                    return options.filter(filepath);
                } else {
                    // If the file is of the right type and exists, this should work.
                    return fs.statSync(filepath)[options.filter]();
                }
            } catch (e) {
                // Otherwise, it's probably not the right type.
                return false;
            }
        });
    }
    return matches;
};
// Build a multi task "files" object dynamically.
file.expandMapping = function(patterns, destBase, options) {
    options = Object.assign({
        rename: function(destBase, destPath) {
            return path.join(destBase || '', destPath);
        }
    }, options);
    var files = [];
    var fileByDest = {};
    // Find all files matching pattern, using passed-in options.
    file.expand(options, patterns).forEach(function(src) {
        var destPath = src;
        // Flatten?
        if (options.flatten) {
            destPath = path.basename(destPath);
        }
        // Change the extension?
        if (options.ext) {
            destPath = destPath.replace(/(\.[^\/]*)?$/, options.ext);
        }
        // Generate destination filename.
        var dest = options.rename(destBase, destPath, options);
        // Prepend cwd to src path if necessary.
        if (options.cwd) {
            src = path.join(options.cwd, src);
        }
        // Normalize filepaths to be unix-style.
        dest = dest.replace(pathSeparatorRe, '/');
        src = src.replace(pathSeparatorRe, '/');
        // Map correct src path to dest path.
        if (fileByDest[dest]) {
            // If dest already exists, push this src onto that dest's src array.
            fileByDest[dest].src.push(src);
        } else {
            // Otherwise create a new src-dest file mapping object.
            files.push({
                src: [
                    src
                ],
                dest: dest
            });
            // And store a reference for later use.
            fileByDest[dest] = files[files.length - 1];
        }
    });
    return files;
};
// reusing bits of grunt's multi-task source normalization
file.normalizeFilesArray = function(data) {
    var files = [];
    data.forEach(function(obj) {
        var prop;
        if ('src' in obj || 'dest' in obj) {
            files.push(obj);
        }
    });
    if (files.length === 0) {
        return [];
    }
    files = _(files).chain().forEach(function(obj) {
        if (!('src' in obj) || !obj.src) {
            return;
        }
        // Normalize .src properties to flattened array.
        if (Array.isArray(obj.src)) {
            obj.src = flatten(obj.src);
        } else {
            obj.src = [
                obj.src
            ];
        }
    }).map(function(obj) {
        // Build options object, removing unwanted properties.
        var expandOptions = Object.assign({}, obj);
        delete expandOptions.src;
        delete expandOptions.dest;
        // Expand file mappings.
        if (obj.expand) {
            return file.expandMapping(obj.src, obj.dest, expandOptions).map(function(mapObj) {
                // Copy obj properties to result.
                var result = Object.assign({}, obj);
                // Make a clone of the orig obj available.
                result.orig = Object.assign({}, obj);
                // Set .src and .dest, processing both as templates.
                result.src = mapObj.src;
                result.dest = mapObj.dest;
                // Remove unwanted properties.
                [
                    'expand',
                    'cwd',
                    'flatten',
                    'rename',
                    'ext'
                ].forEach(function(prop) {
                    delete result[prop];
                });
                return result;
            });
        }
        // Copy obj properties to result, adding an .orig property.
        var result = Object.assign({}, obj);
        // Make a clone of the orig obj available.
        result.orig = Object.assign({}, obj);
        if ('src' in result) {
            // Expose an expand-on-demand getter method as .src.
            Object.defineProperty(result, 'src', {
                enumerable: true,
                get: function fn() {
                    var src;
                    if (!('result' in fn)) {
                        src = obj.src;
                        // If src is an array, flatten it. Otherwise, make it into an array.
                        src = Array.isArray(src) ? flatten(src) : [
                            src
                        ];
                        // Expand src files, memoizing result.
                        fn.result = file.expand(expandOptions, src);
                    }
                    return fn.result;
                }
            });
        }
        if ('dest' in result) {
            result.dest = obj.dest;
        }
        return result;
    }).flatten().value();
    return files;
};
}),
"[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * archiver-utils
 *
 * Copyright (c) 2015 Chris Talkington.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/archiver-utils/blob/master/LICENSE
 */ var fs = __turbopack_context__.r("[project]/node_modules/graceful-fs/graceful-fs.js [app-route] (ecmascript)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var isStream = __turbopack_context__.r("[project]/node_modules/is-stream/index.js [app-route] (ecmascript)");
var lazystream = __turbopack_context__.r("[project]/node_modules/lazystream/lib/lazystream.js [app-route] (ecmascript)");
var normalizePath = __turbopack_context__.r("[project]/node_modules/normalize-path/index.js [app-route] (ecmascript)");
var defaults = __turbopack_context__.r("[project]/node_modules/lodash/defaults.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var PassThrough = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").PassThrough;
var utils = module.exports = {};
utils.file = __turbopack_context__.r("[project]/node_modules/archiver-utils/file.js [app-route] (ecmascript)");
utils.collectStream = function(source, callback) {
    var collection = [];
    var size = 0;
    source.on('error', callback);
    source.on('data', function(chunk) {
        collection.push(chunk);
        size += chunk.length;
    });
    source.on('end', function() {
        var buf = Buffer.alloc(size);
        var offset = 0;
        collection.forEach(function(data) {
            data.copy(buf, offset);
            offset += data.length;
        });
        callback(null, buf);
    });
};
utils.dateify = function(dateish) {
    dateish = dateish || new Date();
    if (dateish instanceof Date) {
        dateish = dateish;
    } else if (typeof dateish === 'string') {
        dateish = new Date(dateish);
    } else {
        dateish = new Date();
    }
    return dateish;
};
// this is slightly different from lodash version
utils.defaults = function(object, source, guard) {
    var args = arguments;
    args[0] = args[0] || {};
    return defaults(...args);
};
utils.isStream = function(source) {
    return isStream(source);
};
utils.lazyReadStream = function(filepath) {
    return new lazystream.Readable(function() {
        return fs.createReadStream(filepath);
    });
};
utils.normalizeInputSource = function(source) {
    if (source === null) {
        return Buffer.alloc(0);
    } else if (typeof source === 'string') {
        return Buffer.from(source);
    } else if (utils.isStream(source)) {
        // Always pipe through a PassThrough stream to guarantee pausing the stream if it's already flowing,
        // since it will only be processed in a (distant) future iteration of the event loop, and will lose
        // data if already flowing now.
        return source.pipe(new PassThrough());
    }
    return source;
};
utils.sanitizePath = function(filepath) {
    return normalizePath(filepath, false).replace(/^\w+:/, '').replace(/^(\.\.\/|\/)+/, '');
};
utils.trailingSlashIt = function(str) {
    return str.slice(-1) !== '/' ? str + '/' : str;
};
utils.unixifyPath = function(filepath) {
    return normalizePath(filepath, false).replace(/^\w+:/, '');
};
utils.walkdir = function(dirpath, base, callback) {
    var results = [];
    if (typeof base === 'function') {
        callback = base;
        base = dirpath;
    }
    fs.readdir(dirpath, function(err, list) {
        var i = 0;
        var file;
        var filepath;
        if (err) {
            return callback(err);
        }
        (function next() {
            file = list[i++];
            if (!file) {
                return callback(null, results);
            }
            filepath = path.join(dirpath, file);
            fs.stat(filepath, function(err, stats) {
                results.push({
                    path: filepath,
                    relative: path.relative(base, filepath).replace(/\\/g, '/'),
                    stats: stats
                });
                if (stats && stats.isDirectory()) {
                    utils.walkdir(filepath, base, function(err, res) {
                        if (err) {
                            return callback(err);
                        }
                        res.forEach(function(dirEntry) {
                            results.push(dirEntry);
                        });
                        next();
                    });
                } else {
                    next();
                }
            });
        })();
    });
};
}),
"[project]/node_modules/archiver/lib/error.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Archiver Core
 *
 * @ignore
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
const ERROR_CODES = {
    'ABORTED': 'archive was aborted',
    'DIRECTORYDIRPATHREQUIRED': 'diretory dirpath argument must be a non-empty string value',
    'DIRECTORYFUNCTIONINVALIDDATA': 'invalid data returned by directory custom data function',
    'ENTRYNAMEREQUIRED': 'entry name must be a non-empty string value',
    'FILEFILEPATHREQUIRED': 'file filepath argument must be a non-empty string value',
    'FINALIZING': 'archive already finalizing',
    'QUEUECLOSED': 'queue closed',
    'NOENDMETHOD': 'no suitable finalize/end method defined by module',
    'DIRECTORYNOTSUPPORTED': 'support for directory entries not defined by module',
    'FORMATSET': 'archive format already set',
    'INPUTSTEAMBUFFERREQUIRED': 'input source must be valid Stream or Buffer instance',
    'MODULESET': 'module already set',
    'SYMLINKNOTSUPPORTED': 'support for symlink entries not defined by module',
    'SYMLINKFILEPATHREQUIRED': 'symlink filepath argument must be a non-empty string value',
    'SYMLINKTARGETREQUIRED': 'symlink target argument must be a non-empty string value',
    'ENTRYNOTSUPPORTED': 'entry not supported'
};
function ArchiverError(code, data) {
    Error.captureStackTrace(this, this.constructor);
    //this.name = this.constructor.name;
    this.message = ERROR_CODES[code] || code;
    this.code = code;
    this.data = data;
}
util.inherits(ArchiverError, Error);
exports = module.exports = ArchiverError;
}),
"[project]/node_modules/archiver/lib/core.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Archiver Core
 *
 * @ignore
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
var glob = __turbopack_context__.r("[project]/node_modules/readdir-glob/index.js [app-route] (ecmascript)");
var async = __turbopack_context__.r("[project]/node_modules/async/dist/async.mjs [app-route] (ecmascript)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var util = __turbopack_context__.r("[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)");
var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var ArchiverError = __turbopack_context__.r("[project]/node_modules/archiver/lib/error.js [app-route] (ecmascript)");
var Transform = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").Transform;
var win32 = process.platform === 'win32';
/**
 * @constructor
 * @param {String} format The archive format to use.
 * @param {(CoreOptions|TransformOptions)} options See also {@link ZipOptions} and {@link TarOptions}.
 */ var Archiver = function(format, options) {
    if (!(this instanceof Archiver)) {
        return new Archiver(format, options);
    }
    if (typeof format !== 'string') {
        options = format;
        format = 'zip';
    }
    options = this.options = util.defaults(options, {
        highWaterMark: 1024 * 1024,
        statConcurrency: 4
    });
    Transform.call(this, options);
    this._format = false;
    this._module = false;
    this._pending = 0;
    this._pointer = 0;
    this._entriesCount = 0;
    this._entriesProcessedCount = 0;
    this._fsEntriesTotalBytes = 0;
    this._fsEntriesProcessedBytes = 0;
    this._queue = async.queue(this._onQueueTask.bind(this), 1);
    this._queue.drain(this._onQueueDrain.bind(this));
    this._statQueue = async.queue(this._onStatQueueTask.bind(this), options.statConcurrency);
    this._statQueue.drain(this._onQueueDrain.bind(this));
    this._state = {
        aborted: false,
        finalize: false,
        finalizing: false,
        finalized: false,
        modulePiped: false
    };
    this._streams = [];
};
inherits(Archiver, Transform);
/**
 * Internal logic for `abort`.
 *
 * @private
 * @return void
 */ Archiver.prototype._abort = function() {
    this._state.aborted = true;
    this._queue.kill();
    this._statQueue.kill();
    if (this._queue.idle()) {
        this._shutdown();
    }
};
/**
 * Internal helper for appending files.
 *
 * @private
 * @param  {String} filepath The source filepath.
 * @param  {EntryData} data The entry data.
 * @return void
 */ Archiver.prototype._append = function(filepath, data) {
    data = data || {};
    var task = {
        source: null,
        filepath: filepath
    };
    if (!data.name) {
        data.name = filepath;
    }
    data.sourcePath = filepath;
    task.data = data;
    this._entriesCount++;
    if (data.stats && data.stats instanceof fs.Stats) {
        task = this._updateQueueTaskWithStats(task, data.stats);
        if (task) {
            if (data.stats.size) {
                this._fsEntriesTotalBytes += data.stats.size;
            }
            this._queue.push(task);
        }
    } else {
        this._statQueue.push(task);
    }
};
/**
 * Internal logic for `finalize`.
 *
 * @private
 * @return void
 */ Archiver.prototype._finalize = function() {
    if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return;
    }
    this._state.finalizing = true;
    this._moduleFinalize();
    this._state.finalizing = false;
    this._state.finalized = true;
};
/**
 * Checks the various state variables to determine if we can `finalize`.
 *
 * @private
 * @return {Boolean}
 */ Archiver.prototype._maybeFinalize = function() {
    if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return false;
    }
    if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
        return true;
    }
    return false;
};
/**
 * Appends an entry to the module.
 *
 * @private
 * @fires  Archiver#entry
 * @param  {(Buffer|Stream)} source
 * @param  {EntryData} data
 * @param  {Function} callback
 * @return void
 */ Archiver.prototype._moduleAppend = function(source, data, callback) {
    if (this._state.aborted) {
        callback();
        return;
    }
    this._module.append(source, data, (function(err) {
        this._task = null;
        if (this._state.aborted) {
            this._shutdown();
            return;
        }
        if (err) {
            this.emit('error', err);
            setImmediate(callback);
            return;
        }
        /**
     * Fires when the entry's input has been processed and appended to the archive.
     *
     * @event Archiver#entry
     * @type {EntryData}
     */ this.emit('entry', data);
        this._entriesProcessedCount++;
        if (data.stats && data.stats.size) {
            this._fsEntriesProcessedBytes += data.stats.size;
        }
        /**
     * @event Archiver#progress
     * @type {ProgressData}
     */ this.emit('progress', {
            entries: {
                total: this._entriesCount,
                processed: this._entriesProcessedCount
            },
            fs: {
                totalBytes: this._fsEntriesTotalBytes,
                processedBytes: this._fsEntriesProcessedBytes
            }
        });
        setImmediate(callback);
    }).bind(this));
};
/**
 * Finalizes the module.
 *
 * @private
 * @return void
 */ Archiver.prototype._moduleFinalize = function() {
    if (typeof this._module.finalize === 'function') {
        this._module.finalize();
    } else if (typeof this._module.end === 'function') {
        this._module.end();
    } else {
        this.emit('error', new ArchiverError('NOENDMETHOD'));
    }
};
/**
 * Pipes the module to our internal stream with error bubbling.
 *
 * @private
 * @return void
 */ Archiver.prototype._modulePipe = function() {
    this._module.on('error', this._onModuleError.bind(this));
    this._module.pipe(this);
    this._state.modulePiped = true;
};
/**
 * Determines if the current module supports a defined feature.
 *
 * @private
 * @param  {String} key
 * @return {Boolean}
 */ Archiver.prototype._moduleSupports = function(key) {
    if (!this._module.supports || !this._module.supports[key]) {
        return false;
    }
    return this._module.supports[key];
};
/**
 * Unpipes the module from our internal stream.
 *
 * @private
 * @return void
 */ Archiver.prototype._moduleUnpipe = function() {
    this._module.unpipe(this);
    this._state.modulePiped = false;
};
/**
 * Normalizes entry data with fallbacks for key properties.
 *
 * @private
 * @param  {Object} data
 * @param  {fs.Stats} stats
 * @return {Object}
 */ Archiver.prototype._normalizeEntryData = function(data, stats) {
    data = util.defaults(data, {
        type: 'file',
        name: null,
        date: null,
        mode: null,
        prefix: null,
        sourcePath: null,
        stats: false
    });
    if (stats && data.stats === false) {
        data.stats = stats;
    }
    var isDir = data.type === 'directory';
    if (data.name) {
        if (typeof data.prefix === 'string' && '' !== data.prefix) {
            data.name = data.prefix + '/' + data.name;
            data.prefix = null;
        }
        data.name = util.sanitizePath(data.name);
        if (data.type !== 'symlink' && data.name.slice(-1) === '/') {
            isDir = true;
            data.type = 'directory';
        } else if (isDir) {
            data.name += '/';
        }
    }
    // 511 === 0777; 493 === 0755; 438 === 0666; 420 === 0644
    if (typeof data.mode === 'number') {
        if ("TURBOPACK compile-time truthy", 1) {
            data.mode &= 511;
        } else //TURBOPACK unreachable
        ;
    } else if (data.stats && data.mode === null) {
        if ("TURBOPACK compile-time truthy", 1) {
            data.mode = data.stats.mode & 511;
        } else //TURBOPACK unreachable
        ;
        // stat isn't reliable on windows; force 0755 for dir
        if (win32 && isDir) {
            data.mode = 493;
        }
    } else if (data.mode === null) {
        data.mode = isDir ? 493 : 420;
    }
    if (data.stats && data.date === null) {
        data.date = data.stats.mtime;
    } else {
        data.date = util.dateify(data.date);
    }
    return data;
};
/**
 * Error listener that re-emits error on to our internal stream.
 *
 * @private
 * @param  {Error} err
 * @return void
 */ Archiver.prototype._onModuleError = function(err) {
    /**
   * @event Archiver#error
   * @type {ErrorData}
   */ this.emit('error', err);
};
/**
 * Checks the various state variables after queue has drained to determine if
 * we need to `finalize`.
 *
 * @private
 * @return void
 */ Archiver.prototype._onQueueDrain = function() {
    if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return;
    }
    if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
    }
};
/**
 * Appends each queue task to the module.
 *
 * @private
 * @param  {Object} task
 * @param  {Function} callback
 * @return void
 */ Archiver.prototype._onQueueTask = function(task, callback) {
    var fullCallback = ()=>{
        if (task.data.callback) {
            task.data.callback();
        }
        callback();
    };
    if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        fullCallback();
        return;
    }
    this._task = task;
    this._moduleAppend(task.source, task.data, fullCallback);
};
/**
 * Performs a file stat and reinjects the task back into the queue.
 *
 * @private
 * @param  {Object} task
 * @param  {Function} callback
 * @return void
 */ Archiver.prototype._onStatQueueTask = function(task, callback) {
    if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        callback();
        return;
    }
    fs.lstat(task.filepath, (function(err, stats) {
        if (this._state.aborted) {
            setImmediate(callback);
            return;
        }
        if (err) {
            this._entriesCount--;
            /**
       * @event Archiver#warning
       * @type {ErrorData}
       */ this.emit('warning', err);
            setImmediate(callback);
            return;
        }
        task = this._updateQueueTaskWithStats(task, stats);
        if (task) {
            if (stats.size) {
                this._fsEntriesTotalBytes += stats.size;
            }
            this._queue.push(task);
        }
        setImmediate(callback);
    }).bind(this));
};
/**
 * Unpipes the module and ends our internal stream.
 *
 * @private
 * @return void
 */ Archiver.prototype._shutdown = function() {
    this._moduleUnpipe();
    this.end();
};
/**
 * Tracks the bytes emitted by our internal stream.
 *
 * @private
 * @param  {Buffer} chunk
 * @param  {String} encoding
 * @param  {Function} callback
 * @return void
 */ Archiver.prototype._transform = function(chunk, encoding, callback) {
    if (chunk) {
        this._pointer += chunk.length;
    }
    callback(null, chunk);
};
/**
 * Updates and normalizes a queue task using stats data.
 *
 * @private
 * @param  {Object} task
 * @param  {fs.Stats} stats
 * @return {Object}
 */ Archiver.prototype._updateQueueTaskWithStats = function(task, stats) {
    if (stats.isFile()) {
        task.data.type = 'file';
        task.data.sourceType = 'stream';
        task.source = util.lazyReadStream(task.filepath);
    } else if (stats.isDirectory() && this._moduleSupports('directory')) {
        task.data.name = util.trailingSlashIt(task.data.name);
        task.data.type = 'directory';
        task.data.sourcePath = util.trailingSlashIt(task.filepath);
        task.data.sourceType = 'buffer';
        task.source = Buffer.concat([]);
    } else if (stats.isSymbolicLink() && this._moduleSupports('symlink')) {
        var linkPath = fs.readlinkSync(task.filepath);
        var dirName = path.dirname(task.filepath);
        task.data.type = 'symlink';
        task.data.linkname = path.relative(dirName, path.resolve(dirName, linkPath));
        task.data.sourceType = 'buffer';
        task.source = Buffer.concat([]);
    } else {
        if (stats.isDirectory()) {
            this.emit('warning', new ArchiverError('DIRECTORYNOTSUPPORTED', task.data));
        } else if (stats.isSymbolicLink()) {
            this.emit('warning', new ArchiverError('SYMLINKNOTSUPPORTED', task.data));
        } else {
            this.emit('warning', new ArchiverError('ENTRYNOTSUPPORTED', task.data));
        }
        return null;
    }
    task.data = this._normalizeEntryData(task.data, stats);
    return task;
};
/**
 * Aborts the archiving process, taking a best-effort approach, by:
 *
 * - removing any pending queue tasks
 * - allowing any active queue workers to finish
 * - detaching internal module pipes
 * - ending both sides of the Transform stream
 *
 * It will NOT drain any remaining sources.
 *
 * @return {this}
 */ Archiver.prototype.abort = function() {
    if (this._state.aborted || this._state.finalized) {
        return this;
    }
    this._abort();
    return this;
};
/**
 * Appends an input source (text string, buffer, or stream) to the instance.
 *
 * When the instance has received, processed, and emitted the input, the `entry`
 * event is fired.
 *
 * @fires  Archiver#entry
 * @param  {(Buffer|Stream|String)} source The input source.
 * @param  {EntryData} data See also {@link ZipEntryData} and {@link TarEntryData}.
 * @return {this}
 */ Archiver.prototype.append = function(source, data) {
    if (this._state.finalize || this._state.aborted) {
        this.emit('error', new ArchiverError('QUEUECLOSED'));
        return this;
    }
    data = this._normalizeEntryData(data);
    if (typeof data.name !== 'string' || data.name.length === 0) {
        this.emit('error', new ArchiverError('ENTRYNAMEREQUIRED'));
        return this;
    }
    if (data.type === 'directory' && !this._moduleSupports('directory')) {
        this.emit('error', new ArchiverError('DIRECTORYNOTSUPPORTED', {
            name: data.name
        }));
        return this;
    }
    source = util.normalizeInputSource(source);
    if (Buffer.isBuffer(source)) {
        data.sourceType = 'buffer';
    } else if (util.isStream(source)) {
        data.sourceType = 'stream';
    } else {
        this.emit('error', new ArchiverError('INPUTSTEAMBUFFERREQUIRED', {
            name: data.name
        }));
        return this;
    }
    this._entriesCount++;
    this._queue.push({
        data: data,
        source: source
    });
    return this;
};
/**
 * Appends a directory and its files, recursively, given its dirpath.
 *
 * @param  {String} dirpath The source directory path.
 * @param  {String} destpath The destination path within the archive.
 * @param  {(EntryData|Function)} data See also [ZipEntryData]{@link ZipEntryData} and
 * [TarEntryData]{@link TarEntryData}.
 * @return {this}
 */ Archiver.prototype.directory = function(dirpath, destpath, data) {
    if (this._state.finalize || this._state.aborted) {
        this.emit('error', new ArchiverError('QUEUECLOSED'));
        return this;
    }
    if (typeof dirpath !== 'string' || dirpath.length === 0) {
        this.emit('error', new ArchiverError('DIRECTORYDIRPATHREQUIRED'));
        return this;
    }
    this._pending++;
    if (destpath === false) {
        destpath = '';
    } else if (typeof destpath !== 'string') {
        destpath = dirpath;
    }
    var dataFunction = false;
    if (typeof data === 'function') {
        dataFunction = data;
        data = {};
    } else if (typeof data !== 'object') {
        data = {};
    }
    var globOptions = {
        stat: true,
        dot: true
    };
    function onGlobEnd() {
        this._pending--;
        this._maybeFinalize();
    }
    function onGlobError(err) {
        this.emit('error', err);
    }
    function onGlobMatch(match) {
        globber.pause();
        var ignoreMatch = false;
        var entryData = Object.assign({}, data);
        entryData.name = match.relative;
        entryData.prefix = destpath;
        entryData.stats = match.stat;
        entryData.callback = globber.resume.bind(globber);
        try {
            if (dataFunction) {
                entryData = dataFunction(entryData);
                if (entryData === false) {
                    ignoreMatch = true;
                } else if (typeof entryData !== 'object') {
                    throw new ArchiverError('DIRECTORYFUNCTIONINVALIDDATA', {
                        dirpath: dirpath
                    });
                }
            }
        } catch (e) {
            this.emit('error', e);
            return;
        }
        if (ignoreMatch) {
            globber.resume();
            return;
        }
        this._append(match.absolute, entryData);
    }
    var globber = glob(dirpath, globOptions);
    globber.on('error', onGlobError.bind(this));
    globber.on('match', onGlobMatch.bind(this));
    globber.on('end', onGlobEnd.bind(this));
    return this;
};
/**
 * Appends a file given its filepath using a
 * [lazystream]{@link https://github.com/jpommerening/node-lazystream} wrapper to
 * prevent issues with open file limits.
 *
 * When the instance has received, processed, and emitted the file, the `entry`
 * event is fired.
 *
 * @param  {String} filepath The source filepath.
 * @param  {EntryData} data See also [ZipEntryData]{@link ZipEntryData} and
 * [TarEntryData]{@link TarEntryData}.
 * @return {this}
 */ Archiver.prototype.file = function(filepath, data) {
    if (this._state.finalize || this._state.aborted) {
        this.emit('error', new ArchiverError('QUEUECLOSED'));
        return this;
    }
    if (typeof filepath !== 'string' || filepath.length === 0) {
        this.emit('error', new ArchiverError('FILEFILEPATHREQUIRED'));
        return this;
    }
    this._append(filepath, data);
    return this;
};
/**
 * Appends multiple files that match a glob pattern.
 *
 * @param  {String} pattern The [glob pattern]{@link https://github.com/isaacs/minimatch} to match.
 * @param  {Object} options See [node-readdir-glob]{@link https://github.com/yqnn/node-readdir-glob#options}.
 * @param  {EntryData} data See also [ZipEntryData]{@link ZipEntryData} and
 * [TarEntryData]{@link TarEntryData}.
 * @return {this}
 */ Archiver.prototype.glob = function(pattern, options, data) {
    this._pending++;
    options = util.defaults(options, {
        stat: true,
        pattern: pattern
    });
    function onGlobEnd() {
        this._pending--;
        this._maybeFinalize();
    }
    function onGlobError(err) {
        this.emit('error', err);
    }
    function onGlobMatch(match) {
        globber.pause();
        var entryData = Object.assign({}, data);
        entryData.callback = globber.resume.bind(globber);
        entryData.stats = match.stat;
        entryData.name = match.relative;
        this._append(match.absolute, entryData);
    }
    var globber = glob(options.cwd || '.', options);
    globber.on('error', onGlobError.bind(this));
    globber.on('match', onGlobMatch.bind(this));
    globber.on('end', onGlobEnd.bind(this));
    return this;
};
/**
 * Finalizes the instance and prevents further appending to the archive
 * structure (queue will continue til drained).
 *
 * The `end`, `close` or `finish` events on the destination stream may fire
 * right after calling this method so you should set listeners beforehand to
 * properly detect stream completion.
 *
 * @return {Promise}
 */ Archiver.prototype.finalize = function() {
    if (this._state.aborted) {
        var abortedError = new ArchiverError('ABORTED');
        this.emit('error', abortedError);
        return Promise.reject(abortedError);
    }
    if (this._state.finalize) {
        var finalizingError = new ArchiverError('FINALIZING');
        this.emit('error', finalizingError);
        return Promise.reject(finalizingError);
    }
    this._state.finalize = true;
    if (this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
    }
    var self = this;
    return new Promise(function(resolve, reject) {
        var errored;
        self._module.on('end', function() {
            if (!errored) {
                resolve();
            }
        });
        self._module.on('error', function(err) {
            errored = true;
            reject(err);
        });
    });
};
/**
 * Sets the module format name used for archiving.
 *
 * @param {String} format The name of the format.
 * @return {this}
 */ Archiver.prototype.setFormat = function(format) {
    if (this._format) {
        this.emit('error', new ArchiverError('FORMATSET'));
        return this;
    }
    this._format = format;
    return this;
};
/**
 * Sets the module used for archiving.
 *
 * @param {Function} module The function for archiver to interact with.
 * @return {this}
 */ Archiver.prototype.setModule = function(module1) {
    if (this._state.aborted) {
        this.emit('error', new ArchiverError('ABORTED'));
        return this;
    }
    if (this._state.module) {
        this.emit('error', new ArchiverError('MODULESET'));
        return this;
    }
    this._module = module1;
    this._modulePipe();
    return this;
};
/**
 * Appends a symlink to the instance.
 *
 * This does NOT interact with filesystem and is used for programmatically creating symlinks.
 *
 * @param  {String} filepath The symlink path (within archive).
 * @param  {String} target The target path (within archive).
 * @param  {Number} mode Sets the entry permissions.
 * @return {this}
 */ Archiver.prototype.symlink = function(filepath, target, mode) {
    if (this._state.finalize || this._state.aborted) {
        this.emit('error', new ArchiverError('QUEUECLOSED'));
        return this;
    }
    if (typeof filepath !== 'string' || filepath.length === 0) {
        this.emit('error', new ArchiverError('SYMLINKFILEPATHREQUIRED'));
        return this;
    }
    if (typeof target !== 'string' || target.length === 0) {
        this.emit('error', new ArchiverError('SYMLINKTARGETREQUIRED', {
            filepath: filepath
        }));
        return this;
    }
    if (!this._moduleSupports('symlink')) {
        this.emit('error', new ArchiverError('SYMLINKNOTSUPPORTED', {
            filepath: filepath
        }));
        return this;
    }
    var data = {};
    data.type = 'symlink';
    data.name = filepath.replace(/\\/g, '/');
    data.linkname = target.replace(/\\/g, '/');
    data.sourceType = 'buffer';
    if (typeof mode === "number") {
        data.mode = mode;
    }
    this._entriesCount++;
    this._queue.push({
        data: data,
        source: Buffer.concat([])
    });
    return this;
};
/**
 * Returns the current length (in bytes) that has been emitted.
 *
 * @return {Number}
 */ Archiver.prototype.pointer = function() {
    return this._pointer;
};
/**
 * Middleware-like helper that has yet to be fully implemented.
 *
 * @private
 * @param  {Function} plugin
 * @return {this}
 */ Archiver.prototype.use = function(plugin) {
    this._streams.push(plugin);
    return this;
};
module.exports = Archiver; /**
 * @typedef {Object} CoreOptions
 * @global
 * @property {Number} [statConcurrency=4] Sets the number of workers used to
 * process the internal fs stat queue.
 */  /**
 * @typedef {Object} TransformOptions
 * @property {Boolean} [allowHalfOpen=true] If set to false, then the stream
 * will automatically end the readable side when the writable side ends and vice
 * versa.
 * @property {Boolean} [readableObjectMode=false] Sets objectMode for readable
 * side of the stream. Has no effect if objectMode is true.
 * @property {Boolean} [writableObjectMode=false] Sets objectMode for writable
 * side of the stream. Has no effect if objectMode is true.
 * @property {Boolean} [decodeStrings=true] Whether or not to decode strings
 * into Buffers before passing them to _write(). `Writable`
 * @property {String} [encoding=NULL] If specified, then buffers will be decoded
 * to strings using the specified encoding. `Readable`
 * @property {Number} [highWaterMark=16kb] The maximum number of bytes to store
 * in the internal buffer before ceasing to read from the underlying resource.
 * `Readable` `Writable`
 * @property {Boolean} [objectMode=false] Whether this stream should behave as a
 * stream of objects. Meaning that stream.read(n) returns a single value instead
 * of a Buffer of size n. `Readable` `Writable`
 */  /**
 * @typedef {Object} EntryData
 * @property {String} name Sets the entry name including internal path.
 * @property {(String|Date)} [date=NOW()] Sets the entry date.
 * @property {Number} [mode=D:0755/F:0644] Sets the entry permissions.
 * @property {String} [prefix] Sets a path prefix for the entry name. Useful
 * when working with methods like `directory` or `glob`.
 * @property {fs.Stats} [stats] Sets the fs stat data for this entry allowing
 * for reduction of fs stat calls when stat data is already known.
 */  /**
 * @typedef {Object} ErrorData
 * @property {String} message The message of the error.
 * @property {String} code The error code assigned to this error.
 * @property {String} data Additional data provided for reporting or debugging (where available).
 */  /**
 * @typedef {Object} ProgressData
 * @property {Object} entries
 * @property {Number} entries.total Number of entries that have been appended.
 * @property {Number} entries.processed Number of entries that have been processed.
 * @property {Object} fs
 * @property {Number} fs.totalBytes Number of bytes that have been appended. Calculated asynchronously and might not be accurate: it growth while entries are added. (based on fs.Stats)
 * @property {Number} fs.processedBytes Number of bytes that have been processed. (based on fs.Stats)
 */ 
}),
"[project]/node_modules/archiver/lib/plugins/zip.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * ZIP Format Plugin
 *
 * @module plugins/zip
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var engine = __turbopack_context__.r("[project]/node_modules/zip-stream/index.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)");
/**
 * @constructor
 * @param {ZipOptions} [options]
 * @param {String} [options.comment] Sets the zip archive comment.
 * @param {Boolean} [options.forceLocalTime=false] Forces the archive to contain local file times instead of UTC.
 * @param {Boolean} [options.forceZip64=false] Forces the archive to contain ZIP64 headers.
 * @param {Boolean} [options.namePrependSlash=false] Prepends a forward slash to archive file paths.
 * @param {Boolean} [options.store=false] Sets the compression method to STORE.
 * @param {Object} [options.zlib] Passed to [zlib]{@link https://nodejs.org/api/zlib.html#zlib_class_options}
 */ var Zip = function(options) {
    if (!(this instanceof Zip)) {
        return new Zip(options);
    }
    options = this.options = util.defaults(options, {
        comment: '',
        forceUTC: false,
        namePrependSlash: false,
        store: false
    });
    this.supports = {
        directory: true,
        symlink: true
    };
    this.engine = new engine(options);
};
/**
 * @param  {(Buffer|Stream)} source
 * @param  {ZipEntryData} data
 * @param  {String} data.name Sets the entry name including internal path.
 * @param  {(String|Date)} [data.date=NOW()] Sets the entry date.
 * @param  {Number} [data.mode=D:0755/F:0644] Sets the entry permissions.
 * @param  {String} [data.prefix] Sets a path prefix for the entry name. Useful
 * when working with methods like `directory` or `glob`.
 * @param  {fs.Stats} [data.stats] Sets the fs stat data for this entry allowing
 * for reduction of fs stat calls when stat data is already known.
 * @param  {Boolean} [data.store=ZipOptions.store] Sets the compression method to STORE.
 * @param  {Function} callback
 * @return void
 */ Zip.prototype.append = function(source, data, callback) {
    this.engine.entry(source, data, callback);
};
/**
 * @return void
 */ Zip.prototype.finalize = function() {
    this.engine.finalize();
};
/**
 * @return this.engine
 */ Zip.prototype.on = function() {
    return this.engine.on.apply(this.engine, arguments);
};
/**
 * @return this.engine
 */ Zip.prototype.pipe = function() {
    return this.engine.pipe.apply(this.engine, arguments);
};
/**
 * @return this.engine
 */ Zip.prototype.unpipe = function() {
    return this.engine.unpipe.apply(this.engine, arguments);
};
module.exports = Zip; /**
 * @typedef {Object} ZipOptions
 * @global
 * @property {String} [comment] Sets the zip archive comment.
 * @property {Boolean} [forceLocalTime=false] Forces the archive to contain local file times instead of UTC.
 * @property {Boolean} [forceZip64=false] Forces the archive to contain ZIP64 headers.
 * @prpperty {Boolean} [namePrependSlash=false] Prepends a forward slash to archive file paths.
 * @property {Boolean} [store=false] Sets the compression method to STORE.
 * @property {Object} [zlib] Passed to [zlib]{@link https://nodejs.org/api/zlib.html#zlib_class_options}
 * to control compression.
 * @property {*} [*] See [zip-stream]{@link https://archiverjs.com/zip-stream/ZipStream.html} documentation for current list of properties.
 */  /**
 * @typedef {Object} ZipEntryData
 * @global
 * @property {String} name Sets the entry name including internal path.
 * @property {(String|Date)} [date=NOW()] Sets the entry date.
 * @property {Number} [mode=D:0755/F:0644] Sets the entry permissions.
 * @property {Boolean} [namePrependSlash=ZipOptions.namePrependSlash] Prepends a forward slash to archive file paths.
 * @property {String} [prefix] Sets a path prefix for the entry name. Useful
 * when working with methods like `directory` or `glob`.
 * @property {fs.Stats} [stats] Sets the fs stat data for this entry allowing
 * for reduction of fs stat calls when stat data is already known.
 * @property {Boolean} [store=ZipOptions.store] Sets the compression method to STORE.
 */  /**
 * ZipStream Module
 * @external ZipStream
 * @see {@link https://www.archiverjs.com/zip-stream/ZipStream.html}
 */ 
}),
"[project]/node_modules/archiver/lib/plugins/tar.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * TAR Format Plugin
 *
 * @module plugins/tar
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var zlib = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
var engine = __turbopack_context__.r("[project]/node_modules/tar-stream/index.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)");
/**
 * @constructor
 * @param {TarOptions} options
 */ var Tar = function(options) {
    if (!(this instanceof Tar)) {
        return new Tar(options);
    }
    options = this.options = util.defaults(options, {
        gzip: false
    });
    if (typeof options.gzipOptions !== 'object') {
        options.gzipOptions = {};
    }
    this.supports = {
        directory: true,
        symlink: true
    };
    this.engine = engine.pack(options);
    this.compressor = false;
    if (options.gzip) {
        this.compressor = zlib.createGzip(options.gzipOptions);
        this.compressor.on('error', this._onCompressorError.bind(this));
    }
};
/**
 * [_onCompressorError description]
 *
 * @private
 * @param  {Error} err
 * @return void
 */ Tar.prototype._onCompressorError = function(err) {
    this.engine.emit('error', err);
};
/**
 * [append description]
 *
 * @param  {(Buffer|Stream)} source
 * @param  {TarEntryData} data
 * @param  {Function} callback
 * @return void
 */ Tar.prototype.append = function(source, data, callback) {
    var self = this;
    data.mtime = data.date;
    function append(err, sourceBuffer) {
        if (err) {
            callback(err);
            return;
        }
        self.engine.entry(data, sourceBuffer, function(err) {
            callback(err, data);
        });
    }
    if (data.sourceType === 'buffer') {
        append(null, source);
    } else if (data.sourceType === 'stream' && data.stats) {
        data.size = data.stats.size;
        var entry = self.engine.entry(data, function(err) {
            callback(err, data);
        });
        source.pipe(entry);
    } else if (data.sourceType === 'stream') {
        util.collectStream(source, append);
    }
};
/**
 * [finalize description]
 *
 * @return void
 */ Tar.prototype.finalize = function() {
    this.engine.finalize();
};
/**
 * [on description]
 *
 * @return this.engine
 */ Tar.prototype.on = function() {
    return this.engine.on.apply(this.engine, arguments);
};
/**
 * [pipe description]
 *
 * @param  {String} destination
 * @param  {Object} options
 * @return this.engine
 */ Tar.prototype.pipe = function(destination, options) {
    if (this.compressor) {
        return this.engine.pipe.apply(this.engine, [
            this.compressor
        ]).pipe(destination, options);
    } else {
        return this.engine.pipe.apply(this.engine, arguments);
    }
};
/**
 * [unpipe description]
 *
 * @return this.engine
 */ Tar.prototype.unpipe = function() {
    if (this.compressor) {
        return this.compressor.unpipe.apply(this.compressor, arguments);
    } else {
        return this.engine.unpipe.apply(this.engine, arguments);
    }
};
module.exports = Tar; /**
 * @typedef {Object} TarOptions
 * @global
 * @property {Boolean} [gzip=false] Compress the tar archive using gzip.
 * @property {Object} [gzipOptions] Passed to [zlib]{@link https://nodejs.org/api/zlib.html#zlib_class_options}
 * to control compression.
 * @property {*} [*] See [tar-stream]{@link https://github.com/mafintosh/tar-stream} documentation for additional properties.
 */  /**
 * @typedef {Object} TarEntryData
 * @global
 * @property {String} name Sets the entry name including internal path.
 * @property {(String|Date)} [date=NOW()] Sets the entry date.
 * @property {Number} [mode=D:0755/F:0644] Sets the entry permissions.
 * @property {String} [prefix] Sets a path prefix for the entry name. Useful
 * when working with methods like `directory` or `glob`.
 * @property {fs.Stats} [stats] Sets the fs stat data for this entry allowing
 * for reduction of fs stat calls when stat data is already known.
 */  /**
 * TarStream Module
 * @external TarStream
 * @see {@link https://github.com/mafintosh/tar-stream}
 */ 
}),
"[project]/node_modules/archiver/lib/plugins/json.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * JSON Format Plugin
 *
 * @module plugins/json
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var Transform = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").Transform;
var crc32 = __turbopack_context__.r("[project]/node_modules/archiver/node_modules/buffer-crc32/dist/index.cjs [app-route] (ecmascript)");
var util = __turbopack_context__.r("[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)");
/**
 * @constructor
 * @param {(JsonOptions|TransformOptions)} options
 */ var Json = function(options) {
    if (!(this instanceof Json)) {
        return new Json(options);
    }
    options = this.options = util.defaults(options, {});
    Transform.call(this, options);
    this.supports = {
        directory: true,
        symlink: true
    };
    this.files = [];
};
inherits(Json, Transform);
/**
 * [_transform description]
 *
 * @private
 * @param  {Buffer}   chunk
 * @param  {String}   encoding
 * @param  {Function} callback
 * @return void
 */ Json.prototype._transform = function(chunk, encoding, callback) {
    callback(null, chunk);
};
/**
 * [_writeStringified description]
 *
 * @private
 * @return void
 */ Json.prototype._writeStringified = function() {
    var fileString = JSON.stringify(this.files);
    this.write(fileString);
};
/**
 * [append description]
 *
 * @param  {(Buffer|Stream)}   source
 * @param  {EntryData}   data
 * @param  {Function} callback
 * @return void
 */ Json.prototype.append = function(source, data, callback) {
    var self = this;
    data.crc32 = 0;
    function onend(err, sourceBuffer) {
        if (err) {
            callback(err);
            return;
        }
        data.size = sourceBuffer.length || 0;
        data.crc32 = crc32.unsigned(sourceBuffer);
        self.files.push(data);
        callback(null, data);
    }
    if (data.sourceType === 'buffer') {
        onend(null, source);
    } else if (data.sourceType === 'stream') {
        util.collectStream(source, onend);
    }
};
/**
 * [finalize description]
 *
 * @return void
 */ Json.prototype.finalize = function() {
    this._writeStringified();
    this.end();
};
module.exports = Json; /**
 * @typedef {Object} JsonOptions
 * @global
 */ 
}),
"[project]/node_modules/archiver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Archiver Vending
 *
 * @ignore
 * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
 * @copyright (c) 2012-2014 Chris Talkington, contributors.
 */ var Archiver = __turbopack_context__.r("[project]/node_modules/archiver/lib/core.js [app-route] (ecmascript)");
var formats = {};
/**
 * Dispenses a new Archiver instance.
 *
 * @constructor
 * @param  {String} format The archive format to use.
 * @param  {Object} options See [Archiver]{@link Archiver}
 * @return {Archiver}
 */ var vending = function(format, options) {
    return vending.create(format, options);
};
/**
 * Creates a new Archiver instance.
 *
 * @param  {String} format The archive format to use.
 * @param  {Object} options See [Archiver]{@link Archiver}
 * @return {Archiver}
 */ vending.create = function(format, options) {
    if (formats[format]) {
        var instance = new Archiver(format, options);
        instance.setFormat(format);
        instance.setModule(new formats[format](options));
        return instance;
    } else {
        throw new Error('create(' + format + '): format not registered');
    }
};
/**
 * Registers a format for use with archiver.
 *
 * @param  {String} format The name of the format.
 * @param  {Function} module The function for archiver to interact with.
 * @return void
 */ vending.registerFormat = function(format, module1) {
    if (formats[format]) {
        throw new Error('register(' + format + '): format already registered');
    }
    if (typeof module1 !== 'function') {
        throw new Error('register(' + format + '): format module invalid');
    }
    if (typeof module1.prototype.append !== 'function' || typeof module1.prototype.finalize !== 'function') {
        throw new Error('register(' + format + '): format module missing methods');
    }
    formats[format] = module1;
};
/**
 * Check if the format is already registered.
 * 
 * @param {String} format the name of the format.
 * @return boolean
 */ vending.isRegisteredFormat = function(format) {
    if (formats[format]) {
        return true;
    }
    return false;
};
vending.registerFormat('zip', __turbopack_context__.r("[project]/node_modules/archiver/lib/plugins/zip.js [app-route] (ecmascript)"));
vending.registerFormat('tar', __turbopack_context__.r("[project]/node_modules/archiver/lib/plugins/tar.js [app-route] (ecmascript)"));
vending.registerFormat('json', __turbopack_context__.r("[project]/node_modules/archiver/lib/plugins/json.js [app-route] (ecmascript)"));
module.exports = vending;
}),
"[project]/node_modules/compress-commons/lib/archivers/archive-entry.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var ArchiveEntry = module.exports = function() {};
ArchiveEntry.prototype.getName = function() {};
ArchiveEntry.prototype.getSize = function() {};
ArchiveEntry.prototype.getLastModifiedDate = function() {};
ArchiveEntry.prototype.isDirectory = function() {};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var util = module.exports = {};
util.dateToDos = function(d, forceLocalTime) {
    forceLocalTime = forceLocalTime || false;
    var year = forceLocalTime ? d.getFullYear() : d.getUTCFullYear();
    if (year < 1980) {
        return 2162688; // 1980-1-1 00:00:00
    } else if (year >= 2044) {
        return 2141175677; // 2043-12-31 23:59:58
    }
    var val = {
        year: year,
        month: forceLocalTime ? d.getMonth() : d.getUTCMonth(),
        date: forceLocalTime ? d.getDate() : d.getUTCDate(),
        hours: forceLocalTime ? d.getHours() : d.getUTCHours(),
        minutes: forceLocalTime ? d.getMinutes() : d.getUTCMinutes(),
        seconds: forceLocalTime ? d.getSeconds() : d.getUTCSeconds()
    };
    return val.year - 1980 << 25 | val.month + 1 << 21 | val.date << 16 | val.hours << 11 | val.minutes << 5 | val.seconds / 2;
};
util.dosToDate = function(dos) {
    return new Date((dos >> 25 & 0x7f) + 1980, (dos >> 21 & 0x0f) - 1, dos >> 16 & 0x1f, dos >> 11 & 0x1f, dos >> 5 & 0x3f, (dos & 0x1f) << 1);
};
util.fromDosTime = function(buf) {
    return util.dosToDate(buf.readUInt32LE(0));
};
util.getEightBytes = function(v) {
    var buf = Buffer.alloc(8);
    buf.writeUInt32LE(v % 0x0100000000, 0);
    buf.writeUInt32LE(v / 0x0100000000 | 0, 4);
    return buf;
};
util.getShortBytes = function(v) {
    var buf = Buffer.alloc(2);
    buf.writeUInt16LE((v & 0xFFFF) >>> 0, 0);
    return buf;
};
util.getShortBytesValue = function(buf, offset) {
    return buf.readUInt16LE(offset);
};
util.getLongBytes = function(v) {
    var buf = Buffer.alloc(4);
    buf.writeUInt32LE((v & 0xFFFFFFFF) >>> 0, 0);
    return buf;
};
util.getLongBytesValue = function(buf, offset) {
    return buf.readUInt32LE(offset);
};
util.toDosTime = function(d) {
    return util.getLongBytes(util.dateToDos(d));
};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/general-purpose-bit.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var zipUtil = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/util.js [app-route] (ecmascript)");
var DATA_DESCRIPTOR_FLAG = 1 << 3;
var ENCRYPTION_FLAG = 1 << 0;
var NUMBER_OF_SHANNON_FANO_TREES_FLAG = 1 << 2;
var SLIDING_DICTIONARY_SIZE_FLAG = 1 << 1;
var STRONG_ENCRYPTION_FLAG = 1 << 6;
var UFT8_NAMES_FLAG = 1 << 11;
var GeneralPurposeBit = module.exports = function() {
    if (!(this instanceof GeneralPurposeBit)) {
        return new GeneralPurposeBit();
    }
    this.descriptor = false;
    this.encryption = false;
    this.utf8 = false;
    this.numberOfShannonFanoTrees = 0;
    this.strongEncryption = false;
    this.slidingDictionarySize = 0;
    return this;
};
GeneralPurposeBit.prototype.encode = function() {
    return zipUtil.getShortBytes((this.descriptor ? DATA_DESCRIPTOR_FLAG : 0) | (this.utf8 ? UFT8_NAMES_FLAG : 0) | (this.encryption ? ENCRYPTION_FLAG : 0) | (this.strongEncryption ? STRONG_ENCRYPTION_FLAG : 0));
};
GeneralPurposeBit.prototype.parse = function(buf, offset) {
    var flag = zipUtil.getShortBytesValue(buf, offset);
    var gbp = new GeneralPurposeBit();
    gbp.useDataDescriptor((flag & DATA_DESCRIPTOR_FLAG) !== 0);
    gbp.useUTF8ForNames((flag & UFT8_NAMES_FLAG) !== 0);
    gbp.useStrongEncryption((flag & STRONG_ENCRYPTION_FLAG) !== 0);
    gbp.useEncryption((flag & ENCRYPTION_FLAG) !== 0);
    gbp.setSlidingDictionarySize((flag & SLIDING_DICTIONARY_SIZE_FLAG) !== 0 ? 8192 : 4096);
    gbp.setNumberOfShannonFanoTrees((flag & NUMBER_OF_SHANNON_FANO_TREES_FLAG) !== 0 ? 3 : 2);
    return gbp;
};
GeneralPurposeBit.prototype.setNumberOfShannonFanoTrees = function(n) {
    this.numberOfShannonFanoTrees = n;
};
GeneralPurposeBit.prototype.getNumberOfShannonFanoTrees = function() {
    return this.numberOfShannonFanoTrees;
};
GeneralPurposeBit.prototype.setSlidingDictionarySize = function(n) {
    this.slidingDictionarySize = n;
};
GeneralPurposeBit.prototype.getSlidingDictionarySize = function() {
    return this.slidingDictionarySize;
};
GeneralPurposeBit.prototype.useDataDescriptor = function(b) {
    this.descriptor = b;
};
GeneralPurposeBit.prototype.usesDataDescriptor = function() {
    return this.descriptor;
};
GeneralPurposeBit.prototype.useEncryption = function(b) {
    this.encryption = b;
};
GeneralPurposeBit.prototype.usesEncryption = function() {
    return this.encryption;
};
GeneralPurposeBit.prototype.useStrongEncryption = function(b) {
    this.strongEncryption = b;
};
GeneralPurposeBit.prototype.usesStrongEncryption = function() {
    return this.strongEncryption;
};
GeneralPurposeBit.prototype.useUTF8ForNames = function(b) {
    this.utf8 = b;
};
GeneralPurposeBit.prototype.usesUTF8ForNames = function() {
    return this.utf8;
};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/unix-stat.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ module.exports = {
    /**
     * Bits used for permissions (and sticky bit)
     */ PERM_MASK: 4095,
    /**
     * Bits used to indicate the filesystem object type.
     */ FILE_TYPE_FLAG: 61440,
    /**
     * Indicates symbolic links.
     */ LINK_FLAG: 40960,
    /**
     * Indicates plain files.
     */ FILE_FLAG: 32768,
    /**
     * Indicates directories.
     */ DIR_FLAG: 16384,
    // ----------------------------------------------------------
    // somewhat arbitrary choices that are quite common for shared
    // installations
    // -----------------------------------------------------------
    /**
     * Default permissions for symbolic links.
     */ DEFAULT_LINK_PERM: 511,
    /**
     * Default permissions for directories.
     */ DEFAULT_DIR_PERM: 493,
    /**
     * Default permissions for plain files.
     */ DEFAULT_FILE_PERM: 420 // 0644
};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ module.exports = {
    WORD: 4,
    DWORD: 8,
    EMPTY: Buffer.alloc(0),
    SHORT: 2,
    SHORT_MASK: 0xffff,
    SHORT_SHIFT: 16,
    SHORT_ZERO: Buffer.from(Array(2)),
    LONG: 4,
    LONG_ZERO: Buffer.from(Array(4)),
    MIN_VERSION_INITIAL: 10,
    MIN_VERSION_DATA_DESCRIPTOR: 20,
    MIN_VERSION_ZIP64: 45,
    VERSION_MADEBY: 45,
    METHOD_STORED: 0,
    METHOD_DEFLATED: 8,
    PLATFORM_UNIX: 3,
    PLATFORM_FAT: 0,
    SIG_LFH: 0x04034b50,
    SIG_DD: 0x08074b50,
    SIG_CFH: 0x02014b50,
    SIG_EOCD: 0x06054b50,
    SIG_ZIP64_EOCD: 0x06064B50,
    SIG_ZIP64_EOCD_LOC: 0x07064B50,
    ZIP64_MAGIC_SHORT: 0xffff,
    ZIP64_MAGIC: 0xffffffff,
    ZIP64_EXTRA_ID: 0x0001,
    ZLIB_NO_COMPRESSION: 0,
    ZLIB_BEST_SPEED: 1,
    ZLIB_BEST_COMPRESSION: 9,
    ZLIB_DEFAULT_COMPRESSION: -1,
    MODE_MASK: 0xFFF,
    DEFAULT_FILE_MODE: 33188,
    DEFAULT_DIR_MODE: 16877,
    EXT_FILE_ATTR_DIR: 1106051088,
    EXT_FILE_ATTR_FILE: 2175008800,
    // Unix file types
    S_IFMT: 61440,
    S_IFIFO: 4096,
    S_IFCHR: 8192,
    S_IFDIR: 16384,
    S_IFBLK: 24576,
    S_IFREG: 32768,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    // DOS file type flags
    S_DOS_A: 32,
    S_DOS_D: 16,
    S_DOS_V: 8,
    S_DOS_S: 4,
    S_DOS_H: 2,
    S_DOS_R: 1 // 01 Read Only
};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/zip-archive-entry.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var normalizePath = __turbopack_context__.r("[project]/node_modules/normalize-path/index.js [app-route] (ecmascript)");
var ArchiveEntry = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/archive-entry.js [app-route] (ecmascript)");
var GeneralPurposeBit = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/general-purpose-bit.js [app-route] (ecmascript)");
var UnixStat = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/unix-stat.js [app-route] (ecmascript)");
var constants = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/constants.js [app-route] (ecmascript)");
var zipUtil = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/util.js [app-route] (ecmascript)");
var ZipArchiveEntry = module.exports = function(name) {
    if (!(this instanceof ZipArchiveEntry)) {
        return new ZipArchiveEntry(name);
    }
    ArchiveEntry.call(this);
    this.platform = constants.PLATFORM_FAT;
    this.method = -1;
    this.name = null;
    this.size = 0;
    this.csize = 0;
    this.gpb = new GeneralPurposeBit();
    this.crc = 0;
    this.time = -1;
    this.minver = constants.MIN_VERSION_INITIAL;
    this.mode = -1;
    this.extra = null;
    this.exattr = 0;
    this.inattr = 0;
    this.comment = null;
    if (name) {
        this.setName(name);
    }
};
inherits(ZipArchiveEntry, ArchiveEntry);
/**
 * Returns the extra fields related to the entry.
 *
 * @returns {Buffer}
 */ ZipArchiveEntry.prototype.getCentralDirectoryExtra = function() {
    return this.getExtra();
};
/**
 * Returns the comment set for the entry.
 *
 * @returns {string}
 */ ZipArchiveEntry.prototype.getComment = function() {
    return this.comment !== null ? this.comment : '';
};
/**
 * Returns the compressed size of the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getCompressedSize = function() {
    return this.csize;
};
/**
 * Returns the CRC32 digest for the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getCrc = function() {
    return this.crc;
};
/**
 * Returns the external file attributes for the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getExternalAttributes = function() {
    return this.exattr;
};
/**
 * Returns the extra fields related to the entry.
 *
 * @returns {Buffer}
 */ ZipArchiveEntry.prototype.getExtra = function() {
    return this.extra !== null ? this.extra : constants.EMPTY;
};
/**
 * Returns the general purpose bits related to the entry.
 *
 * @returns {GeneralPurposeBit}
 */ ZipArchiveEntry.prototype.getGeneralPurposeBit = function() {
    return this.gpb;
};
/**
 * Returns the internal file attributes for the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getInternalAttributes = function() {
    return this.inattr;
};
/**
 * Returns the last modified date of the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getLastModifiedDate = function() {
    return this.getTime();
};
/**
 * Returns the extra fields related to the entry.
 *
 * @returns {Buffer}
 */ ZipArchiveEntry.prototype.getLocalFileDataExtra = function() {
    return this.getExtra();
};
/**
 * Returns the compression method used on the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getMethod = function() {
    return this.method;
};
/**
 * Returns the filename of the entry.
 *
 * @returns {string}
 */ ZipArchiveEntry.prototype.getName = function() {
    return this.name;
};
/**
 * Returns the platform on which the entry was made.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getPlatform = function() {
    return this.platform;
};
/**
 * Returns the size of the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getSize = function() {
    return this.size;
};
/**
 * Returns a date object representing the last modified date of the entry.
 *
 * @returns {number|Date}
 */ ZipArchiveEntry.prototype.getTime = function() {
    return this.time !== -1 ? zipUtil.dosToDate(this.time) : -1;
};
/**
 * Returns the DOS timestamp for the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getTimeDos = function() {
    return this.time !== -1 ? this.time : 0;
};
/**
 * Returns the UNIX file permissions for the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getUnixMode = function() {
    return this.platform !== constants.PLATFORM_UNIX ? 0 : this.getExternalAttributes() >> constants.SHORT_SHIFT & constants.SHORT_MASK;
};
/**
 * Returns the version of ZIP needed to extract the entry.
 *
 * @returns {number}
 */ ZipArchiveEntry.prototype.getVersionNeededToExtract = function() {
    return this.minver;
};
/**
 * Sets the comment of the entry.
 *
 * @param comment
 */ ZipArchiveEntry.prototype.setComment = function(comment) {
    if (Buffer.byteLength(comment) !== comment.length) {
        this.getGeneralPurposeBit().useUTF8ForNames(true);
    }
    this.comment = comment;
};
/**
 * Sets the compressed size of the entry.
 *
 * @param size
 */ ZipArchiveEntry.prototype.setCompressedSize = function(size) {
    if (size < 0) {
        throw new Error('invalid entry compressed size');
    }
    this.csize = size;
};
/**
 * Sets the checksum of the entry.
 *
 * @param crc
 */ ZipArchiveEntry.prototype.setCrc = function(crc) {
    if (crc < 0) {
        throw new Error('invalid entry crc32');
    }
    this.crc = crc;
};
/**
 * Sets the external file attributes of the entry.
 *
 * @param attr
 */ ZipArchiveEntry.prototype.setExternalAttributes = function(attr) {
    this.exattr = attr >>> 0;
};
/**
 * Sets the extra fields related to the entry.
 *
 * @param extra
 */ ZipArchiveEntry.prototype.setExtra = function(extra) {
    this.extra = extra;
};
/**
 * Sets the general purpose bits related to the entry.
 *
 * @param gpb
 */ ZipArchiveEntry.prototype.setGeneralPurposeBit = function(gpb) {
    if (!(gpb instanceof GeneralPurposeBit)) {
        throw new Error('invalid entry GeneralPurposeBit');
    }
    this.gpb = gpb;
};
/**
 * Sets the internal file attributes of the entry.
 *
 * @param attr
 */ ZipArchiveEntry.prototype.setInternalAttributes = function(attr) {
    this.inattr = attr;
};
/**
 * Sets the compression method of the entry.
 *
 * @param method
 */ ZipArchiveEntry.prototype.setMethod = function(method) {
    if (method < 0) {
        throw new Error('invalid entry compression method');
    }
    this.method = method;
};
/**
 * Sets the name of the entry.
 *
 * @param name
 * @param prependSlash
 */ ZipArchiveEntry.prototype.setName = function(name, prependSlash = false) {
    name = normalizePath(name, false).replace(/^\w+:/, '').replace(/^(\.\.\/|\/)+/, '');
    if (prependSlash) {
        name = `/${name}`;
    }
    if (Buffer.byteLength(name) !== name.length) {
        this.getGeneralPurposeBit().useUTF8ForNames(true);
    }
    this.name = name;
};
/**
 * Sets the platform on which the entry was made.
 *
 * @param platform
 */ ZipArchiveEntry.prototype.setPlatform = function(platform) {
    this.platform = platform;
};
/**
 * Sets the size of the entry.
 *
 * @param size
 */ ZipArchiveEntry.prototype.setSize = function(size) {
    if (size < 0) {
        throw new Error('invalid entry size');
    }
    this.size = size;
};
/**
 * Sets the time of the entry.
 *
 * @param time
 * @param forceLocalTime
 */ ZipArchiveEntry.prototype.setTime = function(time, forceLocalTime) {
    if (!(time instanceof Date)) {
        throw new Error('invalid entry time');
    }
    this.time = zipUtil.dateToDos(time, forceLocalTime);
};
/**
 * Sets the UNIX file permissions for the entry.
 *
 * @param mode
 */ ZipArchiveEntry.prototype.setUnixMode = function(mode) {
    mode |= this.isDirectory() ? constants.S_IFDIR : constants.S_IFREG;
    var extattr = 0;
    extattr |= mode << constants.SHORT_SHIFT | (this.isDirectory() ? constants.S_DOS_D : constants.S_DOS_A);
    this.setExternalAttributes(extattr);
    this.mode = mode & constants.MODE_MASK;
    this.platform = constants.PLATFORM_UNIX;
};
/**
 * Sets the version of ZIP needed to extract this entry.
 *
 * @param minver
 */ ZipArchiveEntry.prototype.setVersionNeededToExtract = function(minver) {
    this.minver = minver;
};
/**
 * Returns true if this entry represents a directory.
 *
 * @returns {boolean}
 */ ZipArchiveEntry.prototype.isDirectory = function() {
    return this.getName().slice(-1) === '/';
};
/**
 * Returns true if this entry represents a unix symlink,
 * in which case the entry's content contains the target path
 * for the symlink.
 *
 * @returns {boolean}
 */ ZipArchiveEntry.prototype.isUnixSymlink = function() {
    return (this.getUnixMode() & UnixStat.FILE_TYPE_FLAG) === UnixStat.LINK_FLAG;
};
/**
 * Returns true if this entry is using the ZIP64 extension of ZIP.
 *
 * @returns {boolean}
 */ ZipArchiveEntry.prototype.isZip64 = function() {
    return this.csize > constants.ZIP64_MAGIC || this.size > constants.ZIP64_MAGIC;
};
}),
"[project]/node_modules/compress-commons/lib/util/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var PassThrough = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").PassThrough;
var isStream = __turbopack_context__.r("[project]/node_modules/is-stream/index.js [app-route] (ecmascript)");
var util = module.exports = {};
util.normalizeInputSource = function(source) {
    if (source === null) {
        return Buffer.alloc(0);
    } else if (typeof source === 'string') {
        return Buffer.from(source);
    } else if (isStream(source) && !source._readableState) {
        var normalized = new PassThrough();
        source.pipe(normalized);
        return normalized;
    }
    return source;
};
}),
"[project]/node_modules/compress-commons/lib/archivers/archive-output-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var isStream = __turbopack_context__.r("[project]/node_modules/is-stream/index.js [app-route] (ecmascript)");
var Transform = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)").Transform;
var ArchiveEntry = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/archive-entry.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/util/index.js [app-route] (ecmascript)");
var ArchiveOutputStream = module.exports = function(options) {
    if (!(this instanceof ArchiveOutputStream)) {
        return new ArchiveOutputStream(options);
    }
    Transform.call(this, options);
    this.offset = 0;
    this._archive = {
        finish: false,
        finished: false,
        processing: false
    };
};
inherits(ArchiveOutputStream, Transform);
ArchiveOutputStream.prototype._appendBuffer = function(zae, source, callback) {
// scaffold only
};
ArchiveOutputStream.prototype._appendStream = function(zae, source, callback) {
// scaffold only
};
ArchiveOutputStream.prototype._emitErrorCallback = function(err) {
    if (err) {
        this.emit('error', err);
    }
};
ArchiveOutputStream.prototype._finish = function(ae) {
// scaffold only
};
ArchiveOutputStream.prototype._normalizeEntry = function(ae) {
// scaffold only
};
ArchiveOutputStream.prototype._transform = function(chunk, encoding, callback) {
    callback(null, chunk);
};
ArchiveOutputStream.prototype.entry = function(ae, source, callback) {
    source = source || null;
    if (typeof callback !== 'function') {
        callback = this._emitErrorCallback.bind(this);
    }
    if (!(ae instanceof ArchiveEntry)) {
        callback(new Error('not a valid instance of ArchiveEntry'));
        return;
    }
    if (this._archive.finish || this._archive.finished) {
        callback(new Error('unacceptable entry after finish'));
        return;
    }
    if (this._archive.processing) {
        callback(new Error('already processing an entry'));
        return;
    }
    this._archive.processing = true;
    this._normalizeEntry(ae);
    this._entry = ae;
    source = util.normalizeInputSource(source);
    if (Buffer.isBuffer(source)) {
        this._appendBuffer(ae, source, callback);
    } else if (isStream(source)) {
        this._appendStream(ae, source, callback);
    } else {
        this._archive.processing = false;
        callback(new Error('input source must be valid Stream or Buffer instance'));
        return;
    }
    return this;
};
ArchiveOutputStream.prototype.finish = function() {
    if (this._archive.processing) {
        this._archive.finish = true;
        return;
    }
    this._finish();
};
ArchiveOutputStream.prototype.getBytesWritten = function() {
    return this.offset;
};
ArchiveOutputStream.prototype.write = function(chunk, cb) {
    if (chunk) {
        this.offset += chunk.length;
    }
    return Transform.prototype.write.call(this, chunk, cb);
};
}),
"[project]/node_modules/compress-commons/lib/archivers/zip/zip-archive-output-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var crc32 = __turbopack_context__.r("[project]/node_modules/crc-32/crc32.js [app-route] (ecmascript)");
var { CRC32Stream } = __turbopack_context__.r("[project]/node_modules/crc32-stream/lib/index.js [app-route] (ecmascript)");
var { DeflateCRC32Stream } = __turbopack_context__.r("[project]/node_modules/crc32-stream/lib/index.js [app-route] (ecmascript)");
var ArchiveOutputStream = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/archive-output-stream.js [app-route] (ecmascript)");
var ZipArchiveEntry = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/zip-archive-entry.js [app-route] (ecmascript)");
var GeneralPurposeBit = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/general-purpose-bit.js [app-route] (ecmascript)");
var constants = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/constants.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/util/index.js [app-route] (ecmascript)");
var zipUtil = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/util.js [app-route] (ecmascript)");
var ZipArchiveOutputStream = module.exports = function(options) {
    if (!(this instanceof ZipArchiveOutputStream)) {
        return new ZipArchiveOutputStream(options);
    }
    options = this.options = this._defaults(options);
    ArchiveOutputStream.call(this, options);
    this._entry = null;
    this._entries = [];
    this._archive = {
        centralLength: 0,
        centralOffset: 0,
        comment: '',
        finish: false,
        finished: false,
        processing: false,
        forceZip64: options.forceZip64,
        forceLocalTime: options.forceLocalTime
    };
};
inherits(ZipArchiveOutputStream, ArchiveOutputStream);
ZipArchiveOutputStream.prototype._afterAppend = function(ae) {
    this._entries.push(ae);
    if (ae.getGeneralPurposeBit().usesDataDescriptor()) {
        this._writeDataDescriptor(ae);
    }
    this._archive.processing = false;
    this._entry = null;
    if (this._archive.finish && !this._archive.finished) {
        this._finish();
    }
};
ZipArchiveOutputStream.prototype._appendBuffer = function(ae, source, callback) {
    if (source.length === 0) {
        ae.setMethod(constants.METHOD_STORED);
    }
    var method = ae.getMethod();
    if (method === constants.METHOD_STORED) {
        ae.setSize(source.length);
        ae.setCompressedSize(source.length);
        ae.setCrc(crc32.buf(source) >>> 0);
    }
    this._writeLocalFileHeader(ae);
    if (method === constants.METHOD_STORED) {
        this.write(source);
        this._afterAppend(ae);
        callback(null, ae);
        return;
    } else if (method === constants.METHOD_DEFLATED) {
        this._smartStream(ae, callback).end(source);
        return;
    } else {
        callback(new Error('compression method ' + method + ' not implemented'));
        return;
    }
};
ZipArchiveOutputStream.prototype._appendStream = function(ae, source, callback) {
    ae.getGeneralPurposeBit().useDataDescriptor(true);
    ae.setVersionNeededToExtract(constants.MIN_VERSION_DATA_DESCRIPTOR);
    this._writeLocalFileHeader(ae);
    var smart = this._smartStream(ae, callback);
    source.once('error', function(err) {
        smart.emit('error', err);
        smart.end();
    });
    source.pipe(smart);
};
ZipArchiveOutputStream.prototype._defaults = function(o) {
    if (typeof o !== 'object') {
        o = {};
    }
    if (typeof o.zlib !== 'object') {
        o.zlib = {};
    }
    if (typeof o.zlib.level !== 'number') {
        o.zlib.level = constants.ZLIB_BEST_SPEED;
    }
    o.forceZip64 = !!o.forceZip64;
    o.forceLocalTime = !!o.forceLocalTime;
    return o;
};
ZipArchiveOutputStream.prototype._finish = function() {
    this._archive.centralOffset = this.offset;
    this._entries.forEach((function(ae) {
        this._writeCentralFileHeader(ae);
    }).bind(this));
    this._archive.centralLength = this.offset - this._archive.centralOffset;
    if (this.isZip64()) {
        this._writeCentralDirectoryZip64();
    }
    this._writeCentralDirectoryEnd();
    this._archive.processing = false;
    this._archive.finish = true;
    this._archive.finished = true;
    this.end();
};
ZipArchiveOutputStream.prototype._normalizeEntry = function(ae) {
    if (ae.getMethod() === -1) {
        ae.setMethod(constants.METHOD_DEFLATED);
    }
    if (ae.getMethod() === constants.METHOD_DEFLATED) {
        ae.getGeneralPurposeBit().useDataDescriptor(true);
        ae.setVersionNeededToExtract(constants.MIN_VERSION_DATA_DESCRIPTOR);
    }
    if (ae.getTime() === -1) {
        ae.setTime(new Date(), this._archive.forceLocalTime);
    }
    ae._offsets = {
        file: 0,
        data: 0,
        contents: 0
    };
};
ZipArchiveOutputStream.prototype._smartStream = function(ae, callback) {
    var deflate = ae.getMethod() === constants.METHOD_DEFLATED;
    var process = deflate ? new DeflateCRC32Stream(this.options.zlib) : new CRC32Stream();
    var error = null;
    function handleStuff() {
        var digest = process.digest().readUInt32BE(0);
        ae.setCrc(digest);
        ae.setSize(process.size());
        ae.setCompressedSize(process.size(true));
        this._afterAppend(ae);
        callback(error, ae);
    }
    process.once('end', handleStuff.bind(this));
    process.once('error', function(err) {
        error = err;
    });
    process.pipe(this, {
        end: false
    });
    return process;
};
ZipArchiveOutputStream.prototype._writeCentralDirectoryEnd = function() {
    var records = this._entries.length;
    var size = this._archive.centralLength;
    var offset = this._archive.centralOffset;
    if (this.isZip64()) {
        records = constants.ZIP64_MAGIC_SHORT;
        size = constants.ZIP64_MAGIC;
        offset = constants.ZIP64_MAGIC;
    }
    // signature
    this.write(zipUtil.getLongBytes(constants.SIG_EOCD));
    // disk numbers
    this.write(constants.SHORT_ZERO);
    this.write(constants.SHORT_ZERO);
    // number of entries
    this.write(zipUtil.getShortBytes(records));
    this.write(zipUtil.getShortBytes(records));
    // length and location of CD
    this.write(zipUtil.getLongBytes(size));
    this.write(zipUtil.getLongBytes(offset));
    // archive comment
    var comment = this.getComment();
    var commentLength = Buffer.byteLength(comment);
    this.write(zipUtil.getShortBytes(commentLength));
    this.write(comment);
};
ZipArchiveOutputStream.prototype._writeCentralDirectoryZip64 = function() {
    // signature
    this.write(zipUtil.getLongBytes(constants.SIG_ZIP64_EOCD));
    // size of the ZIP64 EOCD record
    this.write(zipUtil.getEightBytes(44));
    // version made by
    this.write(zipUtil.getShortBytes(constants.MIN_VERSION_ZIP64));
    // version to extract
    this.write(zipUtil.getShortBytes(constants.MIN_VERSION_ZIP64));
    // disk numbers
    this.write(constants.LONG_ZERO);
    this.write(constants.LONG_ZERO);
    // number of entries
    this.write(zipUtil.getEightBytes(this._entries.length));
    this.write(zipUtil.getEightBytes(this._entries.length));
    // length and location of CD
    this.write(zipUtil.getEightBytes(this._archive.centralLength));
    this.write(zipUtil.getEightBytes(this._archive.centralOffset));
    // extensible data sector
    // not implemented at this time
    // end of central directory locator
    this.write(zipUtil.getLongBytes(constants.SIG_ZIP64_EOCD_LOC));
    // disk number holding the ZIP64 EOCD record
    this.write(constants.LONG_ZERO);
    // relative offset of the ZIP64 EOCD record
    this.write(zipUtil.getEightBytes(this._archive.centralOffset + this._archive.centralLength));
    // total number of disks
    this.write(zipUtil.getLongBytes(1));
};
ZipArchiveOutputStream.prototype._writeCentralFileHeader = function(ae) {
    var gpb = ae.getGeneralPurposeBit();
    var method = ae.getMethod();
    var fileOffset = ae._offsets.file;
    var size = ae.getSize();
    var compressedSize = ae.getCompressedSize();
    if (ae.isZip64() || fileOffset > constants.ZIP64_MAGIC) {
        size = constants.ZIP64_MAGIC;
        compressedSize = constants.ZIP64_MAGIC;
        fileOffset = constants.ZIP64_MAGIC;
        ae.setVersionNeededToExtract(constants.MIN_VERSION_ZIP64);
        var extraBuf = Buffer.concat([
            zipUtil.getShortBytes(constants.ZIP64_EXTRA_ID),
            zipUtil.getShortBytes(24),
            zipUtil.getEightBytes(ae.getSize()),
            zipUtil.getEightBytes(ae.getCompressedSize()),
            zipUtil.getEightBytes(ae._offsets.file)
        ], 28);
        ae.setExtra(extraBuf);
    }
    // signature
    this.write(zipUtil.getLongBytes(constants.SIG_CFH));
    // version made by
    this.write(zipUtil.getShortBytes(ae.getPlatform() << 8 | constants.VERSION_MADEBY));
    // version to extract and general bit flag
    this.write(zipUtil.getShortBytes(ae.getVersionNeededToExtract()));
    this.write(gpb.encode());
    // compression method
    this.write(zipUtil.getShortBytes(method));
    // datetime
    this.write(zipUtil.getLongBytes(ae.getTimeDos()));
    // crc32 checksum
    this.write(zipUtil.getLongBytes(ae.getCrc()));
    // sizes
    this.write(zipUtil.getLongBytes(compressedSize));
    this.write(zipUtil.getLongBytes(size));
    var name = ae.getName();
    var comment = ae.getComment();
    var extra = ae.getCentralDirectoryExtra();
    if (gpb.usesUTF8ForNames()) {
        name = Buffer.from(name);
        comment = Buffer.from(comment);
    }
    // name length
    this.write(zipUtil.getShortBytes(name.length));
    // extra length
    this.write(zipUtil.getShortBytes(extra.length));
    // comments length
    this.write(zipUtil.getShortBytes(comment.length));
    // disk number start
    this.write(constants.SHORT_ZERO);
    // internal attributes
    this.write(zipUtil.getShortBytes(ae.getInternalAttributes()));
    // external attributes
    this.write(zipUtil.getLongBytes(ae.getExternalAttributes()));
    // relative offset of LFH
    this.write(zipUtil.getLongBytes(fileOffset));
    // name
    this.write(name);
    // extra
    this.write(extra);
    // comment
    this.write(comment);
};
ZipArchiveOutputStream.prototype._writeDataDescriptor = function(ae) {
    // signature
    this.write(zipUtil.getLongBytes(constants.SIG_DD));
    // crc32 checksum
    this.write(zipUtil.getLongBytes(ae.getCrc()));
    // sizes
    if (ae.isZip64()) {
        this.write(zipUtil.getEightBytes(ae.getCompressedSize()));
        this.write(zipUtil.getEightBytes(ae.getSize()));
    } else {
        this.write(zipUtil.getLongBytes(ae.getCompressedSize()));
        this.write(zipUtil.getLongBytes(ae.getSize()));
    }
};
ZipArchiveOutputStream.prototype._writeLocalFileHeader = function(ae) {
    var gpb = ae.getGeneralPurposeBit();
    var method = ae.getMethod();
    var name = ae.getName();
    var extra = ae.getLocalFileDataExtra();
    if (ae.isZip64()) {
        gpb.useDataDescriptor(true);
        ae.setVersionNeededToExtract(constants.MIN_VERSION_ZIP64);
    }
    if (gpb.usesUTF8ForNames()) {
        name = Buffer.from(name);
    }
    ae._offsets.file = this.offset;
    // signature
    this.write(zipUtil.getLongBytes(constants.SIG_LFH));
    // version to extract and general bit flag
    this.write(zipUtil.getShortBytes(ae.getVersionNeededToExtract()));
    this.write(gpb.encode());
    // compression method
    this.write(zipUtil.getShortBytes(method));
    // datetime
    this.write(zipUtil.getLongBytes(ae.getTimeDos()));
    ae._offsets.data = this.offset;
    // crc32 checksum and sizes
    if (gpb.usesDataDescriptor()) {
        this.write(constants.LONG_ZERO);
        this.write(constants.LONG_ZERO);
        this.write(constants.LONG_ZERO);
    } else {
        this.write(zipUtil.getLongBytes(ae.getCrc()));
        this.write(zipUtil.getLongBytes(ae.getCompressedSize()));
        this.write(zipUtil.getLongBytes(ae.getSize()));
    }
    // name length
    this.write(zipUtil.getShortBytes(name.length));
    // extra length
    this.write(zipUtil.getShortBytes(extra.length));
    // name
    this.write(name);
    // extra
    this.write(extra);
    ae._offsets.contents = this.offset;
};
ZipArchiveOutputStream.prototype.getComment = function(comment) {
    return this._archive.comment !== null ? this._archive.comment : '';
};
ZipArchiveOutputStream.prototype.isZip64 = function() {
    return this._archive.forceZip64 || this._entries.length > constants.ZIP64_MAGIC_SHORT || this._archive.centralLength > constants.ZIP64_MAGIC || this._archive.centralOffset > constants.ZIP64_MAGIC;
};
ZipArchiveOutputStream.prototype.setComment = function(comment) {
    this._archive.comment = comment;
};
}),
"[project]/node_modules/compress-commons/lib/compress-commons.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */ module.exports = {
    ArchiveEntry: __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/archive-entry.js [app-route] (ecmascript)"),
    ZipArchiveEntry: __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/zip-archive-entry.js [app-route] (ecmascript)"),
    ArchiveOutputStream: __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/archive-output-stream.js [app-route] (ecmascript)"),
    ZipArchiveOutputStream: __turbopack_context__.r("[project]/node_modules/compress-commons/lib/archivers/zip/zip-archive-output-stream.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/crc-32/crc32.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */ /* vim: set ts=2: */ /*exported CRC32 */ var CRC32;
(function(factory) {
    /*jshint ignore:start */ /*eslint-disable */ if (typeof DO_NOT_EXPORT_CRC === 'undefined') {
        if ("TURBOPACK compile-time truthy", 1) {
            factory(exports);
        } else //TURBOPACK unreachable
        ;
    } else {
        factory(CRC32 = {});
    }
/*eslint-enable */ /*jshint ignore:end */ })(function(CRC32) {
    CRC32.version = '1.2.2';
    /*global Int32Array */ function signed_crc_table() {
        var c = 0, table = new Array(256);
        for(var n = 0; n != 256; ++n){
            c = n;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            table[n] = c;
        }
        return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
    }
    var T0 = signed_crc_table();
    function slice_by_16_tables(T) {
        var c = 0, v = 0, n = 0, table = typeof Int32Array !== 'undefined' ? new Int32Array(4096) : new Array(4096);
        for(n = 0; n != 256; ++n)table[n] = T[n];
        for(n = 0; n != 256; ++n){
            v = T[n];
            for(c = 256 + n; c < 4096; c += 256)v = table[c] = v >>> 8 ^ T[v & 0xFF];
        }
        var out = [];
        for(n = 1; n != 16; ++n)out[n - 1] = typeof Int32Array !== 'undefined' ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
        return out;
    }
    var TT = slice_by_16_tables(T0);
    var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
    var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
    var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
    function crc32_bstr(bstr, seed) {
        var C = seed ^ -1;
        for(var i = 0, L = bstr.length; i < L;)C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 0xFF];
        return ~C;
    }
    function crc32_buf(B, seed) {
        var C = seed ^ -1, L = B.length - 15, i = 0;
        for(; i < L;)C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
        L += 15;
        while(i < L)C = C >>> 8 ^ T0[(C ^ B[i++]) & 0xFF];
        return ~C;
    }
    function crc32_str(str, seed) {
        var C = seed ^ -1;
        for(var i = 0, L = str.length, c = 0, d = 0; i < L;){
            c = str.charCodeAt(i++);
            if (c < 0x80) {
                C = C >>> 8 ^ T0[(C ^ c) & 0xFF];
            } else if (c < 0x800) {
                C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 0xFF];
            } else if (c >= 0xD800 && c < 0xE000) {
                c = (c & 1023) + 64;
                d = str.charCodeAt(i++) & 1023;
                C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 0xFF];
            } else {
                C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 0xFF];
                C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 0xFF];
            }
        }
        return ~C;
    }
    CRC32.table = T0;
    // $FlowIgnore
    CRC32.bstr = crc32_bstr;
    // $FlowIgnore
    CRC32.buf = crc32_buf;
    // $FlowIgnore
    CRC32.str = crc32_str;
});
}),
"[project]/node_modules/crc32-stream/lib/crc32-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */ const { Transform } = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/ours/index.js [app-route] (ecmascript)");
const crc32 = __turbopack_context__.r("[project]/node_modules/crc-32/crc32.js [app-route] (ecmascript)");
class CRC32Stream extends Transform {
    constructor(options){
        super(options);
        this.checksum = Buffer.allocUnsafe(4);
        this.checksum.writeInt32BE(0, 0);
        this.rawSize = 0;
    }
    _transform(chunk, encoding, callback) {
        if (chunk) {
            this.checksum = crc32.buf(chunk, this.checksum) >>> 0;
            this.rawSize += chunk.length;
        }
        callback(null, chunk);
    }
    digest(encoding) {
        const checksum = Buffer.allocUnsafe(4);
        checksum.writeUInt32BE(this.checksum >>> 0, 0);
        return encoding ? checksum.toString(encoding) : checksum;
    }
    hex() {
        return this.digest('hex').toUpperCase();
    }
    size() {
        return this.rawSize;
    }
}
module.exports = CRC32Stream;
}),
"[project]/node_modules/crc32-stream/lib/deflate-crc32-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */ const { DeflateRaw } = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
const crc32 = __turbopack_context__.r("[project]/node_modules/crc-32/crc32.js [app-route] (ecmascript)");
class DeflateCRC32Stream extends DeflateRaw {
    constructor(options){
        super(options);
        this.checksum = Buffer.allocUnsafe(4);
        this.checksum.writeInt32BE(0, 0);
        this.rawSize = 0;
        this.compressedSize = 0;
    }
    push(chunk, encoding) {
        if (chunk) {
            this.compressedSize += chunk.length;
        }
        return super.push(chunk, encoding);
    }
    _transform(chunk, encoding, callback) {
        if (chunk) {
            this.checksum = crc32.buf(chunk, this.checksum) >>> 0;
            this.rawSize += chunk.length;
        }
        super._transform(chunk, encoding, callback);
    }
    digest(encoding) {
        const checksum = Buffer.allocUnsafe(4);
        checksum.writeUInt32BE(this.checksum >>> 0, 0);
        return encoding ? checksum.toString(encoding) : checksum;
    }
    hex() {
        return this.digest('hex').toUpperCase();
    }
    size(compressed = false) {
        if (compressed) {
            return this.compressedSize;
        } else {
            return this.rawSize;
        }
    }
}
module.exports = DeflateCRC32Stream;
}),
"[project]/node_modules/crc32-stream/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */ module.exports = {
    CRC32Stream: __turbopack_context__.r("[project]/node_modules/crc32-stream/lib/crc32-stream.js [app-route] (ecmascript)"),
    DeflateCRC32Stream: __turbopack_context__.r("[project]/node_modules/crc32-stream/lib/deflate-crc32-stream.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/zip-stream/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * ZipStream
 *
 * @ignore
 * @license [MIT]{@link https://github.com/archiverjs/node-zip-stream/blob/master/LICENSE}
 * @copyright (c) 2014 Chris Talkington, contributors.
 */ var inherits = __turbopack_context__.r("[externals]/util [external] (util, cjs)").inherits;
var ZipArchiveOutputStream = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/compress-commons.js [app-route] (ecmascript)").ZipArchiveOutputStream;
var ZipArchiveEntry = __turbopack_context__.r("[project]/node_modules/compress-commons/lib/compress-commons.js [app-route] (ecmascript)").ZipArchiveEntry;
var util = __turbopack_context__.r("[project]/node_modules/archiver-utils/index.js [app-route] (ecmascript)");
/**
 * @constructor
 * @extends external:ZipArchiveOutputStream
 * @param {Object} [options]
 * @param {String} [options.comment] Sets the zip archive comment.
 * @param {Boolean} [options.forceLocalTime=false] Forces the archive to contain local file times instead of UTC.
 * @param {Boolean} [options.forceZip64=false] Forces the archive to contain ZIP64 headers.
 * @param {Boolean} [options.store=false] Sets the compression method to STORE.
 * @param {Object} [options.zlib] Passed to [zlib]{@link https://nodejs.org/api/zlib.html#zlib_class_options}
 * to control compression.
 */ var ZipStream = module.exports = function(options) {
    if (!(this instanceof ZipStream)) {
        return new ZipStream(options);
    }
    options = this.options = options || {};
    options.zlib = options.zlib || {};
    ZipArchiveOutputStream.call(this, options);
    if (typeof options.level === 'number' && options.level >= 0) {
        options.zlib.level = options.level;
        delete options.level;
    }
    if (!options.forceZip64 && typeof options.zlib.level === 'number' && options.zlib.level === 0) {
        options.store = true;
    }
    options.namePrependSlash = options.namePrependSlash || false;
    if (options.comment && options.comment.length > 0) {
        this.setComment(options.comment);
    }
};
inherits(ZipStream, ZipArchiveOutputStream);
/**
 * Normalizes entry data with fallbacks for key properties.
 *
 * @private
 * @param  {Object} data
 * @return {Object}
 */ ZipStream.prototype._normalizeFileData = function(data) {
    data = util.defaults(data, {
        type: 'file',
        name: null,
        namePrependSlash: this.options.namePrependSlash,
        linkname: null,
        date: null,
        mode: null,
        store: this.options.store,
        comment: ''
    });
    var isDir = data.type === 'directory';
    var isSymlink = data.type === 'symlink';
    if (data.name) {
        data.name = util.sanitizePath(data.name);
        if (!isSymlink && data.name.slice(-1) === '/') {
            isDir = true;
            data.type = 'directory';
        } else if (isDir) {
            data.name += '/';
        }
    }
    if (isDir || isSymlink) {
        data.store = true;
    }
    data.date = util.dateify(data.date);
    return data;
};
/**
 * Appends an entry given an input source (text string, buffer, or stream).
 *
 * @param  {(Buffer|Stream|String)} source The input source.
 * @param  {Object} data
 * @param  {String} data.name Sets the entry name including internal path.
 * @param  {String} [data.comment] Sets the entry comment.
 * @param  {(String|Date)} [data.date=NOW()] Sets the entry date.
 * @param  {Number} [data.mode=D:0755/F:0644] Sets the entry permissions.
 * @param  {Boolean} [data.store=options.store] Sets the compression method to STORE.
 * @param  {String} [data.type=file] Sets the entry type. Defaults to `directory`
 * if name ends with trailing slash.
 * @param  {Function} callback
 * @return this
 */ ZipStream.prototype.entry = function(source, data, callback) {
    if (typeof callback !== 'function') {
        callback = this._emitErrorCallback.bind(this);
    }
    data = this._normalizeFileData(data);
    if (data.type !== 'file' && data.type !== 'directory' && data.type !== 'symlink') {
        callback(new Error(data.type + ' entries not currently supported'));
        return;
    }
    if (typeof data.name !== 'string' || data.name.length === 0) {
        callback(new Error('entry name must be a non-empty string value'));
        return;
    }
    if (data.type === 'symlink' && typeof data.linkname !== 'string') {
        callback(new Error('entry linkname must be a non-empty string value when type equals symlink'));
        return;
    }
    var entry = new ZipArchiveEntry(data.name);
    entry.setTime(data.date, this.options.forceLocalTime);
    if (data.namePrependSlash) {
        entry.setName(data.name, true);
    }
    if (data.store) {
        entry.setMethod(0);
    }
    if (data.comment.length > 0) {
        entry.setComment(data.comment);
    }
    if (data.type === 'symlink' && typeof data.mode !== 'number') {
        data.mode = 40960; // 0120000
    }
    if (typeof data.mode === 'number') {
        if (data.type === 'symlink') {
            data.mode |= 40960;
        }
        entry.setUnixMode(data.mode);
    }
    if (data.type === 'symlink' && typeof data.linkname === 'string') {
        source = Buffer.from(data.linkname);
    }
    return ZipArchiveOutputStream.prototype.entry.call(this, entry, source, callback);
};
/**
 * Finalizes the instance and prevents further appending to the archive
 * structure (queue will continue til drained).
 *
 * @return void
 */ ZipStream.prototype.finalize = function() {
    this.finish();
}; /**
 * Returns the current number of bytes written to this stream.
 * @function ZipStream#getBytesWritten
 * @returns {Number}
 */  /**
 * Compress Commons ZipArchiveOutputStream
 * @external ZipArchiveOutputStream
 * @see {@link https://github.com/archiverjs/node-compress-commons}
 */ 
}),
"[project]/node_modules/events-universal/default.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
}),
"[project]/node_modules/fast-fifo/fixed-size.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = class FixedFIFO {
    constructor(hwm){
        if (!(hwm > 0) || (hwm - 1 & hwm) !== 0) throw new Error('Max size for a FixedFIFO should be a power of two');
        this.buffer = new Array(hwm);
        this.mask = hwm - 1;
        this.top = 0;
        this.btm = 0;
        this.next = null;
    }
    clear() {
        this.top = this.btm = 0;
        this.next = null;
        this.buffer.fill(undefined);
    }
    push(data) {
        if (this.buffer[this.top] !== undefined) return false;
        this.buffer[this.top] = data;
        this.top = this.top + 1 & this.mask;
        return true;
    }
    shift() {
        const last = this.buffer[this.btm];
        if (last === undefined) return undefined;
        this.buffer[this.btm] = undefined;
        this.btm = this.btm + 1 & this.mask;
        return last;
    }
    peek() {
        return this.buffer[this.btm];
    }
    isEmpty() {
        return this.buffer[this.btm] === undefined;
    }
};
}),
"[project]/node_modules/fast-fifo/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const FixedFIFO = __turbopack_context__.r("[project]/node_modules/fast-fifo/fixed-size.js [app-route] (ecmascript)");
module.exports = class FastFIFO {
    constructor(hwm){
        this.hwm = hwm || 16;
        this.head = new FixedFIFO(this.hwm);
        this.tail = this.head;
        this.length = 0;
    }
    clear() {
        this.head = this.tail;
        this.head.clear();
        this.length = 0;
    }
    push(val) {
        this.length++;
        if (!this.head.push(val)) {
            const prev = this.head;
            this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
            this.head.push(val);
        }
    }
    shift() {
        if (this.length !== 0) this.length--;
        const val = this.tail.shift();
        if (val === undefined && this.tail.next) {
            const next = this.tail.next;
            this.tail.next = null;
            this.tail = next;
            return this.tail.shift();
        }
        return val;
    }
    peek() {
        const val = this.tail.peek();
        if (val === undefined && this.tail.next) return this.tail.next.peek();
        return val;
    }
    isEmpty() {
        return this.length === 0;
    }
};
}),
"[project]/node_modules/b4a/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

function isBuffer(value) {
    return Buffer.isBuffer(value) || value instanceof Uint8Array;
}
function isEncoding(encoding) {
    return Buffer.isEncoding(encoding);
}
function alloc(size, fill, encoding) {
    return Buffer.alloc(size, fill, encoding);
}
function allocUnsafe(size) {
    return Buffer.allocUnsafe(size);
}
function allocUnsafeSlow(size) {
    return Buffer.allocUnsafeSlow(size);
}
function byteLength(string, encoding) {
    return Buffer.byteLength(string, encoding);
}
function compare(a, b) {
    return Buffer.compare(a, b);
}
function concat(buffers, totalLength) {
    return Buffer.concat(buffers, totalLength);
}
function copy(source, target, targetStart, start, end) {
    return toBuffer(source).copy(target, targetStart, start, end);
}
function equals(a, b) {
    return toBuffer(a).equals(b);
}
function fill(buffer, value, offset, end, encoding) {
    return toBuffer(buffer).fill(value, offset, end, encoding);
}
function from(value, encodingOrOffset, length) {
    return Buffer.from(value, encodingOrOffset, length);
}
function includes(buffer, value, byteOffset, encoding) {
    return toBuffer(buffer).includes(value, byteOffset, encoding);
}
function indexOf(buffer, value, byfeOffset, encoding) {
    return toBuffer(buffer).indexOf(value, byfeOffset, encoding);
}
function lastIndexOf(buffer, value, byteOffset, encoding) {
    return toBuffer(buffer).lastIndexOf(value, byteOffset, encoding);
}
function swap16(buffer) {
    return toBuffer(buffer).swap16();
}
function swap32(buffer) {
    return toBuffer(buffer).swap32();
}
function swap64(buffer) {
    return toBuffer(buffer).swap64();
}
function toBuffer(buffer) {
    if (Buffer.isBuffer(buffer)) return buffer;
    return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
function toString(buffer, encoding, start, end) {
    return toBuffer(buffer).toString(encoding, start, end);
}
function write(buffer, string, offset, length, encoding) {
    return toBuffer(buffer).write(string, offset, length, encoding);
}
function readDoubleBE(buffer, offset) {
    return toBuffer(buffer).readDoubleBE(offset);
}
function readDoubleLE(buffer, offset) {
    return toBuffer(buffer).readDoubleLE(offset);
}
function readFloatBE(buffer, offset) {
    return toBuffer(buffer).readFloatBE(offset);
}
function readFloatLE(buffer, offset) {
    return toBuffer(buffer).readFloatLE(offset);
}
function readInt32BE(buffer, offset) {
    return toBuffer(buffer).readInt32BE(offset);
}
function readInt32LE(buffer, offset) {
    return toBuffer(buffer).readInt32LE(offset);
}
function readUInt32BE(buffer, offset) {
    return toBuffer(buffer).readUInt32BE(offset);
}
function readUInt32LE(buffer, offset) {
    return toBuffer(buffer).readUInt32LE(offset);
}
function writeDoubleBE(buffer, value, offset) {
    return toBuffer(buffer).writeDoubleBE(value, offset);
}
function writeDoubleLE(buffer, value, offset) {
    return toBuffer(buffer).writeDoubleLE(value, offset);
}
function writeFloatBE(buffer, value, offset) {
    return toBuffer(buffer).writeFloatBE(value, offset);
}
function writeFloatLE(buffer, value, offset) {
    return toBuffer(buffer).writeFloatLE(value, offset);
}
function writeInt32BE(buffer, value, offset) {
    return toBuffer(buffer).writeInt32BE(value, offset);
}
function writeInt32LE(buffer, value, offset) {
    return toBuffer(buffer).writeInt32LE(value, offset);
}
function writeUInt32BE(buffer, value, offset) {
    return toBuffer(buffer).writeUInt32BE(value, offset);
}
function writeUInt32LE(buffer, value, offset) {
    return toBuffer(buffer).writeUInt32LE(value, offset);
}
module.exports = {
    isBuffer,
    isEncoding,
    alloc,
    allocUnsafe,
    allocUnsafeSlow,
    byteLength,
    compare,
    concat,
    copy,
    equals,
    fill,
    from,
    includes,
    indexOf,
    lastIndexOf,
    swap16,
    swap32,
    swap64,
    toBuffer,
    toString,
    write,
    readDoubleBE,
    readDoubleLE,
    readFloatBE,
    readFloatLE,
    readInt32BE,
    readInt32LE,
    readUInt32BE,
    readUInt32LE,
    writeDoubleBE,
    writeDoubleLE,
    writeFloatBE,
    writeFloatLE,
    writeInt32BE,
    writeInt32LE,
    writeUInt32BE,
    writeUInt32LE
};
}),
"[project]/node_modules/text-decoder/lib/pass-through-decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const b4a = __turbopack_context__.r("[project]/node_modules/b4a/index.js [app-route] (ecmascript)");
module.exports = class PassThroughDecoder {
    constructor(encoding){
        this.encoding = encoding;
    }
    get remaining() {
        return 0;
    }
    decode(data) {
        return b4a.toString(data, this.encoding);
    }
    flush() {
        return '';
    }
};
}),
"[project]/node_modules/text-decoder/lib/utf8-decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const b4a = __turbopack_context__.r("[project]/node_modules/b4a/index.js [app-route] (ecmascript)");
/**
 * https://encoding.spec.whatwg.org/#utf-8-decoder
 */ module.exports = class UTF8Decoder {
    constructor(){
        this._reset();
    }
    get remaining() {
        return this.bytesSeen;
    }
    decode(data) {
        if (data.byteLength === 0) return '';
        if (this.bytesNeeded === 0 && trailingIncomplete(data, 0) === 0) {
            this.bytesSeen = trailingBytesSeen(data);
            return b4a.toString(data, 'utf8');
        }
        let result = '';
        let start = 0;
        if (this.bytesNeeded > 0) {
            while(start < data.byteLength){
                const byte = data[start];
                if (byte < this.lowerBoundary || byte > this.upperBoundary) {
                    result += '\ufffd';
                    this._reset();
                    break;
                }
                this.lowerBoundary = 0x80;
                this.upperBoundary = 0xbf;
                this.codePoint = this.codePoint << 6 | byte & 0x3f;
                this.bytesSeen++;
                start++;
                if (this.bytesSeen === this.bytesNeeded) {
                    result += String.fromCodePoint(this.codePoint);
                    this._reset();
                    break;
                }
            }
            if (this.bytesNeeded > 0) return result;
        }
        const trailing = trailingIncomplete(data, start);
        const end = data.byteLength - trailing;
        if (end > start) result += b4a.toString(data, 'utf8', start, end);
        for(let i = end; i < data.byteLength; i++){
            const byte = data[i];
            if (this.bytesNeeded === 0) {
                if (byte <= 0x7f) {
                    this.bytesSeen = 0;
                    result += String.fromCharCode(byte);
                } else if (byte >= 0xc2 && byte <= 0xdf) {
                    this.bytesNeeded = 2;
                    this.bytesSeen = 1;
                    this.codePoint = byte & 0x1f;
                } else if (byte >= 0xe0 && byte <= 0xef) {
                    if (byte === 0xe0) this.lowerBoundary = 0xa0;
                    else if (byte === 0xed) this.upperBoundary = 0x9f;
                    this.bytesNeeded = 3;
                    this.bytesSeen = 1;
                    this.codePoint = byte & 0xf;
                } else if (byte >= 0xf0 && byte <= 0xf4) {
                    if (byte === 0xf0) this.lowerBoundary = 0x90;
                    else if (byte === 0xf4) this.upperBoundary = 0x8f;
                    this.bytesNeeded = 4;
                    this.bytesSeen = 1;
                    this.codePoint = byte & 0x7;
                } else {
                    this.bytesSeen = 1;
                    result += '\ufffd';
                }
                continue;
            }
            if (byte < this.lowerBoundary || byte > this.upperBoundary) {
                result += '\ufffd';
                i--;
                this._reset();
                continue;
            }
            this.lowerBoundary = 0x80;
            this.upperBoundary = 0xbf;
            this.codePoint = this.codePoint << 6 | byte & 0x3f;
            this.bytesSeen++;
            if (this.bytesSeen === this.bytesNeeded) {
                result += String.fromCodePoint(this.codePoint);
                this._reset();
            }
        }
        return result;
    }
    flush() {
        const result = this.bytesNeeded > 0 ? '\ufffd' : '';
        this._reset();
        return result;
    }
    _reset() {
        this.codePoint = 0;
        this.bytesNeeded = 0;
        this.bytesSeen = 0;
        this.lowerBoundary = 0x80;
        this.upperBoundary = 0xbf;
    }
};
function trailingIncomplete(data, start) {
    const len = data.byteLength;
    if (len <= start) return 0;
    const limit = Math.max(start, len - 4);
    let i = len - 1;
    while(i > limit && (data[i] & 0xc0) === 0x80)i--;
    if (i < start) return 0;
    const byte = data[i];
    let needed;
    if (byte <= 0x7f) return 0;
    if (byte >= 0xc2 && byte <= 0xdf) needed = 2;
    else if (byte >= 0xe0 && byte <= 0xef) needed = 3;
    else if (byte >= 0xf0 && byte <= 0xf4) needed = 4;
    else return 0;
    const available = len - i;
    return available < needed ? available : 0;
}
function trailingBytesSeen(data) {
    const len = data.byteLength;
    if (len === 0) return 0;
    const last = data[len - 1];
    if (last <= 0x7f) return 0;
    if ((last & 0xc0) !== 0x80) return 1;
    const limit = Math.max(0, len - 4);
    let i = len - 2;
    while(i >= limit && (data[i] & 0xc0) === 0x80)i--;
    if (i < 0) return 1;
    const first = data[i];
    let needed;
    if (first >= 0xc2 && first <= 0xdf) needed = 2;
    else if (first >= 0xe0 && first <= 0xef) needed = 3;
    else if (first >= 0xf0 && first <= 0xf4) needed = 4;
    else return 1;
    if (len - i !== needed) return 1;
    if (needed >= 3) {
        const second = data[i + 1];
        if (first === 0xe0 && second < 0xa0) return 1;
        if (first === 0xed && second > 0x9f) return 1;
        if (first === 0xf0 && second < 0x90) return 1;
        if (first === 0xf4 && second > 0x8f) return 1;
    }
    return 0;
}
}),
"[project]/node_modules/text-decoder/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PassThroughDecoder = __turbopack_context__.r("[project]/node_modules/text-decoder/lib/pass-through-decoder.js [app-route] (ecmascript)");
const UTF8Decoder = __turbopack_context__.r("[project]/node_modules/text-decoder/lib/utf8-decoder.js [app-route] (ecmascript)");
module.exports = class TextDecoder {
    constructor(encoding = 'utf8'){
        this.encoding = normalizeEncoding(encoding);
        switch(this.encoding){
            case 'utf8':
                this.decoder = new UTF8Decoder();
                break;
            case 'utf16le':
            case 'base64':
                throw new Error('Unsupported encoding: ' + this.encoding);
            default:
                this.decoder = new PassThroughDecoder(this.encoding);
        }
    }
    get remaining() {
        return this.decoder.remaining;
    }
    push(data) {
        if (typeof data === 'string') return data;
        return this.decoder.decode(data);
    }
    // For Node.js compatibility
    write(data) {
        return this.push(data);
    }
    end(data) {
        let result = '';
        if (data) result = this.push(data);
        result += this.decoder.flush();
        return result;
    }
};
function normalizeEncoding(encoding) {
    encoding = encoding.toLowerCase();
    switch(encoding){
        case 'utf8':
        case 'utf-8':
            return 'utf8';
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return 'utf16le';
        case 'latin1':
        case 'binary':
            return 'latin1';
        case 'base64':
        case 'ascii':
        case 'hex':
            return encoding;
        default:
            throw new Error('Unknown encoding: ' + encoding);
    }
}
}),
"[project]/node_modules/streamx/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { EventEmitter } = __turbopack_context__.r("[project]/node_modules/events-universal/default.js [app-route] (ecmascript)");
const STREAM_DESTROYED = new Error('Stream was destroyed');
const PREMATURE_CLOSE = new Error('Premature close');
const FIFO = __turbopack_context__.r("[project]/node_modules/fast-fifo/index.js [app-route] (ecmascript)");
const TextDecoder = __turbopack_context__.r("[project]/node_modules/text-decoder/index.js [app-route] (ecmascript)");
// if we do a future major, expect queue microtask to be there always, for now a bit defensive
const qmt = typeof queueMicrotask === 'undefined' ? (fn)=>/*TURBOPACK member replacement*/ __turbopack_context__.g.process.nextTick(fn) : queueMicrotask;
/* eslint-disable no-multi-spaces */ // 29 bits used total (4 from shared, 14 from read, and 11 from write)
const MAX = (1 << 29) - 1;
// Shared state
const OPENING = 0b0001;
const PREDESTROYING = 0b0010;
const DESTROYING = 0b0100;
const DESTROYED = 0b1000;
const NOT_OPENING = MAX ^ OPENING;
const NOT_PREDESTROYING = MAX ^ PREDESTROYING;
// Read state (4 bit offset from shared state)
const READ_ACTIVE = 0b00000000000001 << 4;
const READ_UPDATING = 0b00000000000010 << 4;
const READ_PRIMARY = 0b00000000000100 << 4;
const READ_QUEUED = 0b00000000001000 << 4;
const READ_RESUMED = 0b00000000010000 << 4;
const READ_PIPE_DRAINED = 0b00000000100000 << 4;
const READ_ENDING = 0b00000001000000 << 4;
const READ_EMIT_DATA = 0b00000010000000 << 4;
const READ_EMIT_READABLE = 0b00000100000000 << 4;
const READ_EMITTED_READABLE = 0b00001000000000 << 4;
const READ_DONE = 0b00010000000000 << 4;
const READ_NEXT_TICK = 0b00100000000000 << 4;
const READ_NEEDS_PUSH = 0b01000000000000 << 4;
const READ_READ_AHEAD = 0b10000000000000 << 4;
// Combined read state
const READ_FLOWING = READ_RESUMED | READ_PIPE_DRAINED;
const READ_ACTIVE_AND_NEEDS_PUSH = READ_ACTIVE | READ_NEEDS_PUSH;
const READ_PRIMARY_AND_ACTIVE = READ_PRIMARY | READ_ACTIVE;
const READ_EMIT_READABLE_AND_QUEUED = READ_EMIT_READABLE | READ_QUEUED;
const READ_RESUMED_READ_AHEAD = READ_RESUMED | READ_READ_AHEAD;
const READ_NOT_ACTIVE = MAX ^ READ_ACTIVE;
const READ_NON_PRIMARY = MAX ^ READ_PRIMARY;
const READ_NON_PRIMARY_AND_PUSHED = MAX ^ (READ_PRIMARY | READ_NEEDS_PUSH);
const READ_PUSHED = MAX ^ READ_NEEDS_PUSH;
const READ_PAUSED = MAX ^ READ_RESUMED;
const READ_NOT_QUEUED = MAX ^ (READ_QUEUED | READ_EMITTED_READABLE);
const READ_NOT_ENDING = MAX ^ READ_ENDING;
const READ_PIPE_NOT_DRAINED = MAX ^ READ_FLOWING;
const READ_NOT_NEXT_TICK = MAX ^ READ_NEXT_TICK;
const READ_NOT_UPDATING = MAX ^ READ_UPDATING;
const READ_NO_READ_AHEAD = MAX ^ READ_READ_AHEAD;
const READ_PAUSED_NO_READ_AHEAD = MAX ^ READ_RESUMED_READ_AHEAD;
// Write state (18 bit offset, 4 bit offset from shared state and 14 from read state)
const WRITE_ACTIVE = 0b00000000001 << 18;
const WRITE_UPDATING = 0b00000000010 << 18;
const WRITE_PRIMARY = 0b00000000100 << 18;
const WRITE_QUEUED = 0b00000001000 << 18;
const WRITE_UNDRAINED = 0b00000010000 << 18;
const WRITE_DONE = 0b00000100000 << 18;
const WRITE_EMIT_DRAIN = 0b00001000000 << 18;
const WRITE_NEXT_TICK = 0b00010000000 << 18;
const WRITE_WRITING = 0b00100000000 << 18;
const WRITE_FINISHING = 0b01000000000 << 18;
const WRITE_CORKED = 0b10000000000 << 18;
const WRITE_NOT_ACTIVE = MAX ^ (WRITE_ACTIVE | WRITE_WRITING);
const WRITE_NON_PRIMARY = MAX ^ WRITE_PRIMARY;
const WRITE_NOT_FINISHING = MAX ^ (WRITE_ACTIVE | WRITE_FINISHING);
const WRITE_DRAINED = MAX ^ WRITE_UNDRAINED;
const WRITE_NOT_QUEUED = MAX ^ WRITE_QUEUED;
const WRITE_NOT_NEXT_TICK = MAX ^ WRITE_NEXT_TICK;
const WRITE_NOT_UPDATING = MAX ^ WRITE_UPDATING;
const WRITE_NOT_CORKED = MAX ^ WRITE_CORKED;
// Combined shared state
const ACTIVE = READ_ACTIVE | WRITE_ACTIVE;
const NOT_ACTIVE = MAX ^ ACTIVE;
const DONE = READ_DONE | WRITE_DONE;
const DESTROY_STATUS = DESTROYING | DESTROYED | PREDESTROYING;
const OPEN_STATUS = DESTROY_STATUS | OPENING;
const AUTO_DESTROY = DESTROY_STATUS | DONE;
const NON_PRIMARY = WRITE_NON_PRIMARY & READ_NON_PRIMARY;
const ACTIVE_OR_TICKING = WRITE_NEXT_TICK | READ_NEXT_TICK;
const TICKING = ACTIVE_OR_TICKING & NOT_ACTIVE;
const IS_OPENING = OPEN_STATUS | TICKING;
// Combined shared state and read state
const READ_PRIMARY_STATUS = OPEN_STATUS | READ_ENDING | READ_DONE;
const READ_STATUS = OPEN_STATUS | READ_DONE | READ_QUEUED;
const READ_ENDING_STATUS = OPEN_STATUS | READ_ENDING | READ_QUEUED;
const READ_READABLE_STATUS = OPEN_STATUS | READ_EMIT_READABLE | READ_QUEUED | READ_EMITTED_READABLE;
const SHOULD_NOT_READ = OPEN_STATUS | READ_ACTIVE | READ_ENDING | READ_DONE | READ_NEEDS_PUSH | READ_READ_AHEAD;
const READ_BACKPRESSURE_STATUS = DESTROY_STATUS | READ_ENDING | READ_DONE;
const READ_UPDATE_SYNC_STATUS = READ_UPDATING | OPEN_STATUS | READ_NEXT_TICK | READ_PRIMARY;
const READ_NEXT_TICK_OR_OPENING = READ_NEXT_TICK | OPENING;
// Combined write state
const WRITE_PRIMARY_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_DONE;
const WRITE_QUEUED_AND_UNDRAINED = WRITE_QUEUED | WRITE_UNDRAINED;
const WRITE_QUEUED_AND_ACTIVE = WRITE_QUEUED | WRITE_ACTIVE;
const WRITE_DRAIN_STATUS = WRITE_QUEUED | WRITE_UNDRAINED | OPEN_STATUS | WRITE_ACTIVE;
const WRITE_STATUS = OPEN_STATUS | WRITE_ACTIVE | WRITE_QUEUED | WRITE_CORKED;
const WRITE_PRIMARY_AND_ACTIVE = WRITE_PRIMARY | WRITE_ACTIVE;
const WRITE_ACTIVE_AND_WRITING = WRITE_ACTIVE | WRITE_WRITING;
const WRITE_FINISHING_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_QUEUED_AND_ACTIVE | WRITE_DONE;
const WRITE_BACKPRESSURE_STATUS = WRITE_UNDRAINED | DESTROY_STATUS | WRITE_FINISHING | WRITE_DONE;
const WRITE_UPDATE_SYNC_STATUS = WRITE_UPDATING | OPEN_STATUS | WRITE_NEXT_TICK | WRITE_PRIMARY;
const WRITE_DROP_DATA = WRITE_FINISHING | WRITE_DONE | DESTROY_STATUS;
const asyncIterator = Symbol.asyncIterator || Symbol('asyncIterator');
class WritableState {
    constructor(stream, { highWaterMark = 16384, map = null, mapWritable, byteLength, byteLengthWritable } = {}){
        this.stream = stream;
        this.queue = new FIFO();
        this.highWaterMark = highWaterMark;
        this.buffered = 0;
        this.error = null;
        this.pipeline = null;
        this.drains = null; // if we add more seldomly used helpers we might them into a subobject so its a single ptr
        this.byteLength = byteLengthWritable || byteLength || defaultByteLength;
        this.map = mapWritable || map;
        this.afterWrite = afterWrite.bind(this);
        this.afterUpdateNextTick = updateWriteNT.bind(this);
    }
    get ended() {
        return (this.stream._duplexState & WRITE_DONE) !== 0;
    }
    push(data) {
        if ((this.stream._duplexState & WRITE_DROP_DATA) !== 0) return false;
        if (this.map !== null) data = this.map(data);
        this.buffered += this.byteLength(data);
        this.queue.push(data);
        if (this.buffered < this.highWaterMark) {
            this.stream._duplexState |= WRITE_QUEUED;
            return true;
        }
        this.stream._duplexState |= WRITE_QUEUED_AND_UNDRAINED;
        return false;
    }
    shift() {
        const data = this.queue.shift();
        this.buffered -= this.byteLength(data);
        if (this.buffered === 0) this.stream._duplexState &= WRITE_NOT_QUEUED;
        return data;
    }
    end(data) {
        if (typeof data === 'function') this.stream.once('finish', data);
        else if (data !== undefined && data !== null) this.push(data);
        this.stream._duplexState = (this.stream._duplexState | WRITE_FINISHING) & WRITE_NON_PRIMARY;
    }
    autoBatch(data, cb) {
        const buffer = [];
        const stream = this.stream;
        buffer.push(data);
        while((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED_AND_ACTIVE){
            buffer.push(stream._writableState.shift());
        }
        if ((stream._duplexState & OPEN_STATUS) !== 0) return cb(null);
        stream._writev(buffer, cb);
    }
    update() {
        const stream = this.stream;
        stream._duplexState |= WRITE_UPDATING;
        do {
            while((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED){
                const data = this.shift();
                stream._duplexState |= WRITE_ACTIVE_AND_WRITING;
                stream._write(data, this.afterWrite);
            }
            if ((stream._duplexState & WRITE_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary();
        }while (this.continueUpdate() === true)
        stream._duplexState &= WRITE_NOT_UPDATING;
    }
    updateNonPrimary() {
        const stream = this.stream;
        if ((stream._duplexState & WRITE_FINISHING_STATUS) === WRITE_FINISHING) {
            stream._duplexState = stream._duplexState | WRITE_ACTIVE;
            stream._final(afterFinal.bind(this));
            return;
        }
        if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
            if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
                stream._duplexState |= ACTIVE;
                stream._destroy(afterDestroy.bind(this));
            }
            return;
        }
        if ((stream._duplexState & IS_OPENING) === OPENING) {
            stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING;
            stream._open(afterOpen.bind(this));
        }
    }
    continueUpdate() {
        if ((this.stream._duplexState & WRITE_NEXT_TICK) === 0) return false;
        this.stream._duplexState &= WRITE_NOT_NEXT_TICK;
        return true;
    }
    updateCallback() {
        if ((this.stream._duplexState & WRITE_UPDATE_SYNC_STATUS) === WRITE_PRIMARY) this.update();
        else this.updateNextTick();
    }
    updateNextTick() {
        if ((this.stream._duplexState & WRITE_NEXT_TICK) !== 0) return;
        this.stream._duplexState |= WRITE_NEXT_TICK;
        if ((this.stream._duplexState & WRITE_UPDATING) === 0) qmt(this.afterUpdateNextTick);
    }
}
class ReadableState {
    constructor(stream, { highWaterMark = 16384, map = null, mapReadable, byteLength, byteLengthReadable } = {}){
        this.stream = stream;
        this.queue = new FIFO();
        this.highWaterMark = highWaterMark === 0 ? 1 : highWaterMark;
        this.buffered = 0;
        this.readAhead = highWaterMark > 0;
        this.error = null;
        this.pipeline = null;
        this.byteLength = byteLengthReadable || byteLength || defaultByteLength;
        this.map = mapReadable || map;
        this.pipeTo = null;
        this.afterRead = afterRead.bind(this);
        this.afterUpdateNextTick = updateReadNT.bind(this);
    }
    get ended() {
        return (this.stream._duplexState & READ_DONE) !== 0;
    }
    pipe(pipeTo, cb) {
        if (this.pipeTo !== null) throw new Error('Can only pipe to one destination');
        if (typeof cb !== 'function') cb = null;
        this.stream._duplexState |= READ_PIPE_DRAINED;
        this.pipeTo = pipeTo;
        this.pipeline = new Pipeline(this.stream, pipeTo, cb);
        if (cb) this.stream.on('error', noop); // We already error handle this so supress crashes
        if (isStreamx(pipeTo)) {
            pipeTo._writableState.pipeline = this.pipeline;
            if (cb) pipeTo.on('error', noop); // We already error handle this so supress crashes
            pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline)); // TODO: just call finished from pipeTo itself
        } else {
            const onerror = this.pipeline.done.bind(this.pipeline, pipeTo);
            const onclose = this.pipeline.done.bind(this.pipeline, pipeTo, null) // onclose has a weird bool arg
            ;
            pipeTo.on('error', onerror);
            pipeTo.on('close', onclose);
            pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline));
        }
        pipeTo.on('drain', afterDrain.bind(this));
        this.stream.emit('piping', pipeTo);
        pipeTo.emit('pipe', this.stream);
    }
    push(data) {
        const stream = this.stream;
        if (data === null) {
            this.highWaterMark = 0;
            stream._duplexState = (stream._duplexState | READ_ENDING) & READ_NON_PRIMARY_AND_PUSHED;
            return false;
        }
        if (this.map !== null) {
            data = this.map(data);
            if (data === null) {
                stream._duplexState &= READ_PUSHED;
                return this.buffered < this.highWaterMark;
            }
        }
        this.buffered += this.byteLength(data);
        this.queue.push(data);
        stream._duplexState = (stream._duplexState | READ_QUEUED) & READ_PUSHED;
        return this.buffered < this.highWaterMark;
    }
    shift() {
        const data = this.queue.shift();
        this.buffered -= this.byteLength(data);
        if (this.buffered === 0) this.stream._duplexState &= READ_NOT_QUEUED;
        return data;
    }
    unshift(data) {
        const pending = [
            this.map !== null ? this.map(data) : data
        ];
        while(this.buffered > 0)pending.push(this.shift());
        for(let i = 0; i < pending.length - 1; i++){
            const data = pending[i];
            this.buffered += this.byteLength(data);
            this.queue.push(data);
        }
        this.push(pending[pending.length - 1]);
    }
    read() {
        const stream = this.stream;
        if ((stream._duplexState & READ_STATUS) === READ_QUEUED) {
            const data = this.shift();
            if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED;
            if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data);
            return data;
        }
        if (this.readAhead === false) {
            stream._duplexState |= READ_READ_AHEAD;
            this.updateNextTick();
        }
        return null;
    }
    drain() {
        const stream = this.stream;
        while((stream._duplexState & READ_STATUS) === READ_QUEUED && (stream._duplexState & READ_FLOWING) !== 0){
            const data = this.shift();
            if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED;
            if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data);
        }
    }
    update() {
        const stream = this.stream;
        stream._duplexState |= READ_UPDATING;
        do {
            this.drain();
            while(this.buffered < this.highWaterMark && (stream._duplexState & SHOULD_NOT_READ) === READ_READ_AHEAD){
                stream._duplexState |= READ_ACTIVE_AND_NEEDS_PUSH;
                stream._read(this.afterRead);
                this.drain();
            }
            if ((stream._duplexState & READ_READABLE_STATUS) === READ_EMIT_READABLE_AND_QUEUED) {
                stream._duplexState |= READ_EMITTED_READABLE;
                stream.emit('readable');
            }
            if ((stream._duplexState & READ_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary();
        }while (this.continueUpdate() === true)
        stream._duplexState &= READ_NOT_UPDATING;
    }
    updateNonPrimary() {
        const stream = this.stream;
        if ((stream._duplexState & READ_ENDING_STATUS) === READ_ENDING) {
            stream._duplexState = (stream._duplexState | READ_DONE) & READ_NOT_ENDING;
            stream.emit('end');
            if ((stream._duplexState & AUTO_DESTROY) === DONE) stream._duplexState |= DESTROYING;
            if (this.pipeTo !== null) this.pipeTo.end();
        }
        if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
            if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
                stream._duplexState |= ACTIVE;
                stream._destroy(afterDestroy.bind(this));
            }
            return;
        }
        if ((stream._duplexState & IS_OPENING) === OPENING) {
            stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING;
            stream._open(afterOpen.bind(this));
        }
    }
    continueUpdate() {
        if ((this.stream._duplexState & READ_NEXT_TICK) === 0) return false;
        this.stream._duplexState &= READ_NOT_NEXT_TICK;
        return true;
    }
    updateCallback() {
        if ((this.stream._duplexState & READ_UPDATE_SYNC_STATUS) === READ_PRIMARY) this.update();
        else this.updateNextTick();
    }
    updateNextTickIfOpen() {
        if ((this.stream._duplexState & READ_NEXT_TICK_OR_OPENING) !== 0) return;
        this.stream._duplexState |= READ_NEXT_TICK;
        if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick);
    }
    updateNextTick() {
        if ((this.stream._duplexState & READ_NEXT_TICK) !== 0) return;
        this.stream._duplexState |= READ_NEXT_TICK;
        if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick);
    }
}
class TransformState {
    constructor(stream){
        this.data = null;
        this.afterTransform = afterTransform.bind(stream);
        this.afterFinal = null;
    }
}
class Pipeline {
    constructor(src, dst, cb){
        this.from = src;
        this.to = dst;
        this.afterPipe = cb;
        this.error = null;
        this.pipeToFinished = false;
    }
    finished() {
        this.pipeToFinished = true;
    }
    done(stream, err) {
        if (err) this.error = err;
        if (stream === this.to) {
            this.to = null;
            if (this.from !== null) {
                if ((this.from._duplexState & READ_DONE) === 0 || !this.pipeToFinished) {
                    this.from.destroy(this.error || new Error('Writable stream closed prematurely'));
                }
                return;
            }
        }
        if (stream === this.from) {
            this.from = null;
            if (this.to !== null) {
                if ((stream._duplexState & READ_DONE) === 0) {
                    this.to.destroy(this.error || new Error('Readable stream closed before ending'));
                }
                return;
            }
        }
        if (this.afterPipe !== null) this.afterPipe(this.error);
        this.to = this.from = this.afterPipe = null;
    }
}
function afterDrain() {
    this.stream._duplexState |= READ_PIPE_DRAINED;
    this.updateCallback();
}
function afterFinal(err) {
    const stream = this.stream;
    if (err) stream.destroy(err);
    if ((stream._duplexState & DESTROY_STATUS) === 0) {
        stream._duplexState |= WRITE_DONE;
        stream.emit('finish');
    }
    if ((stream._duplexState & AUTO_DESTROY) === DONE) {
        stream._duplexState |= DESTROYING;
    }
    stream._duplexState &= WRITE_NOT_FINISHING;
    // no need to wait the extra tick here, so we short circuit that
    if ((stream._duplexState & WRITE_UPDATING) === 0) this.update();
    else this.updateNextTick();
}
function afterDestroy(err) {
    const stream = this.stream;
    if (!err && this.error !== STREAM_DESTROYED) err = this.error;
    if (err) stream.emit('error', err);
    stream._duplexState |= DESTROYED;
    stream.emit('close');
    const rs = stream._readableState;
    const ws = stream._writableState;
    if (rs !== null && rs.pipeline !== null) rs.pipeline.done(stream, err);
    if (ws !== null) {
        while(ws.drains !== null && ws.drains.length > 0)ws.drains.shift().resolve(false);
        if (ws.pipeline !== null) ws.pipeline.done(stream, err);
    }
}
function afterWrite(err) {
    const stream = this.stream;
    if (err) stream.destroy(err);
    stream._duplexState &= WRITE_NOT_ACTIVE;
    if (this.drains !== null) tickDrains(this.drains);
    if ((stream._duplexState & WRITE_DRAIN_STATUS) === WRITE_UNDRAINED) {
        stream._duplexState &= WRITE_DRAINED;
        if ((stream._duplexState & WRITE_EMIT_DRAIN) === WRITE_EMIT_DRAIN) {
            stream.emit('drain');
        }
    }
    this.updateCallback();
}
function afterRead(err) {
    if (err) this.stream.destroy(err);
    this.stream._duplexState &= READ_NOT_ACTIVE;
    if (this.readAhead === false && (this.stream._duplexState & READ_RESUMED) === 0) this.stream._duplexState &= READ_NO_READ_AHEAD;
    this.updateCallback();
}
function updateReadNT() {
    if ((this.stream._duplexState & READ_UPDATING) === 0) {
        this.stream._duplexState &= READ_NOT_NEXT_TICK;
        this.update();
    }
}
function updateWriteNT() {
    if ((this.stream._duplexState & WRITE_UPDATING) === 0) {
        this.stream._duplexState &= WRITE_NOT_NEXT_TICK;
        this.update();
    }
}
function tickDrains(drains) {
    for(let i = 0; i < drains.length; i++){
        // drains.writes are monotonic, so if one is 0 its always the first one
        if (--drains[i].writes === 0) {
            drains.shift().resolve(true);
            i--;
        }
    }
}
function afterOpen(err) {
    const stream = this.stream;
    if (err) stream.destroy(err);
    if ((stream._duplexState & DESTROYING) === 0) {
        if ((stream._duplexState & READ_PRIMARY_STATUS) === 0) stream._duplexState |= READ_PRIMARY;
        if ((stream._duplexState & WRITE_PRIMARY_STATUS) === 0) stream._duplexState |= WRITE_PRIMARY;
        stream.emit('open');
    }
    stream._duplexState &= NOT_ACTIVE;
    if (stream._writableState !== null) {
        stream._writableState.updateCallback();
    }
    if (stream._readableState !== null) {
        stream._readableState.updateCallback();
    }
}
function afterTransform(err, data) {
    if (data !== undefined && data !== null) this.push(data);
    this._writableState.afterWrite(err);
}
function newListener(name) {
    if (this._readableState !== null) {
        if (name === 'data') {
            this._duplexState |= READ_EMIT_DATA | READ_RESUMED_READ_AHEAD;
            this._readableState.updateNextTick();
        }
        if (name === 'readable') {
            this._duplexState |= READ_EMIT_READABLE;
            this._readableState.updateNextTick();
        }
    }
    if (this._writableState !== null) {
        if (name === 'drain') {
            this._duplexState |= WRITE_EMIT_DRAIN;
            this._writableState.updateNextTick();
        }
    }
}
class Stream extends EventEmitter {
    constructor(opts){
        super();
        this._duplexState = 0;
        this._readableState = null;
        this._writableState = null;
        if (opts) {
            if (opts.open) this._open = opts.open;
            if (opts.destroy) this._destroy = opts.destroy;
            if (opts.predestroy) this._predestroy = opts.predestroy;
            if (opts.signal) {
                opts.signal.addEventListener('abort', abort.bind(this));
            }
        }
        this.on('newListener', newListener);
    }
    _open(cb) {
        cb(null);
    }
    _destroy(cb) {
        cb(null);
    }
    _predestroy() {
    // does nothing
    }
    get readable() {
        return this._readableState !== null ? true : undefined;
    }
    get writable() {
        return this._writableState !== null ? true : undefined;
    }
    get destroyed() {
        return (this._duplexState & DESTROYED) !== 0;
    }
    get destroying() {
        return (this._duplexState & DESTROY_STATUS) !== 0;
    }
    destroy(err) {
        if ((this._duplexState & DESTROY_STATUS) === 0) {
            if (!err) err = STREAM_DESTROYED;
            this._duplexState = (this._duplexState | DESTROYING) & NON_PRIMARY;
            if (this._readableState !== null) {
                this._readableState.highWaterMark = 0;
                this._readableState.error = err;
            }
            if (this._writableState !== null) {
                this._writableState.highWaterMark = 0;
                this._writableState.error = err;
            }
            this._duplexState |= PREDESTROYING;
            this._predestroy();
            this._duplexState &= NOT_PREDESTROYING;
            if (this._readableState !== null) this._readableState.updateNextTick();
            if (this._writableState !== null) this._writableState.updateNextTick();
        }
    }
}
class Readable extends Stream {
    constructor(opts){
        super(opts);
        this._duplexState |= OPENING | WRITE_DONE | READ_READ_AHEAD;
        this._readableState = new ReadableState(this, opts);
        if (opts) {
            if (this._readableState.readAhead === false) this._duplexState &= READ_NO_READ_AHEAD;
            if (opts.read) this._read = opts.read;
            if (opts.eagerOpen) this._readableState.updateNextTick();
            if (opts.encoding) this.setEncoding(opts.encoding);
        }
    }
    setEncoding(encoding) {
        const dec = new TextDecoder(encoding);
        const map = this._readableState.map || echo;
        this._readableState.map = mapOrSkip;
        return this;
        //TURBOPACK unreachable
        ;
        function mapOrSkip(data) {
            const next = dec.push(data);
            return next === '' && (data.byteLength !== 0 || dec.remaining > 0) ? null : map(next);
        }
    }
    _read(cb) {
        cb(null);
    }
    pipe(dest, cb) {
        this._readableState.updateNextTick();
        this._readableState.pipe(dest, cb);
        return dest;
    }
    read() {
        this._readableState.updateNextTick();
        return this._readableState.read();
    }
    push(data) {
        this._readableState.updateNextTickIfOpen();
        return this._readableState.push(data);
    }
    unshift(data) {
        this._readableState.updateNextTickIfOpen();
        return this._readableState.unshift(data);
    }
    resume() {
        this._duplexState |= READ_RESUMED_READ_AHEAD;
        this._readableState.updateNextTick();
        return this;
    }
    pause() {
        this._duplexState &= this._readableState.readAhead === false ? READ_PAUSED_NO_READ_AHEAD : READ_PAUSED;
        return this;
    }
    static _fromAsyncIterator(ite, opts) {
        let destroy;
        const rs = new Readable({
            ...opts,
            read (cb) {
                ite.next().then(push).then(cb.bind(null, null)).catch(cb);
            },
            predestroy () {
                destroy = ite.return();
            },
            destroy (cb) {
                if (!destroy) return cb(null);
                destroy.then(cb.bind(null, null)).catch(cb);
            }
        });
        return rs;
        //TURBOPACK unreachable
        ;
        function push(data) {
            if (data.done) rs.push(null);
            else rs.push(data.value);
        }
    }
    static from(data, opts) {
        if (isReadStreamx(data)) return data;
        if (data[asyncIterator]) return this._fromAsyncIterator(data[asyncIterator](), opts);
        if (!Array.isArray(data)) data = data === undefined ? [] : [
            data
        ];
        let i = 0;
        return new Readable({
            ...opts,
            read (cb) {
                this.push(i === data.length ? null : data[i++]);
                cb(null);
            }
        });
    }
    static isBackpressured(rs) {
        return (rs._duplexState & READ_BACKPRESSURE_STATUS) !== 0 || rs._readableState.buffered >= rs._readableState.highWaterMark;
    }
    static isPaused(rs) {
        return (rs._duplexState & READ_RESUMED) === 0;
    }
    [asyncIterator]() {
        const stream = this;
        let error = null;
        let promiseResolve = null;
        let promiseReject = null;
        this.on('error', (err)=>{
            error = err;
        });
        this.on('readable', onreadable);
        this.on('close', onclose);
        return {
            [asyncIterator] () {
                return this;
            },
            next () {
                return new Promise(function(resolve, reject) {
                    promiseResolve = resolve;
                    promiseReject = reject;
                    const data = stream.read();
                    if (data !== null) ondata(data);
                    else if ((stream._duplexState & DESTROYED) !== 0) ondata(null);
                });
            },
            return () {
                return destroy(null);
            },
            throw (err) {
                return destroy(err);
            }
        };
        //TURBOPACK unreachable
        ;
        function onreadable() {
            if (promiseResolve !== null) ondata(stream.read());
        }
        function onclose() {
            if (promiseResolve !== null) ondata(null);
        }
        function ondata(data) {
            if (promiseReject === null) return;
            if (error) promiseReject(error);
            else if (data === null && (stream._duplexState & READ_DONE) === 0) promiseReject(STREAM_DESTROYED);
            else promiseResolve({
                value: data,
                done: data === null
            });
            promiseReject = promiseResolve = null;
        }
        function destroy(err) {
            stream.destroy(err);
            return new Promise((resolve, reject)=>{
                if (stream._duplexState & DESTROYED) return resolve({
                    value: undefined,
                    done: true
                });
                stream.once('close', function() {
                    if (err) reject(err);
                    else resolve({
                        value: undefined,
                        done: true
                    });
                });
            });
        }
    }
}
class Writable extends Stream {
    constructor(opts){
        super(opts);
        this._duplexState |= OPENING | READ_DONE;
        this._writableState = new WritableState(this, opts);
        if (opts) {
            if (opts.writev) this._writev = opts.writev;
            if (opts.write) this._write = opts.write;
            if (opts.final) this._final = opts.final;
            if (opts.eagerOpen) this._writableState.updateNextTick();
        }
    }
    cork() {
        this._duplexState |= WRITE_CORKED;
    }
    uncork() {
        this._duplexState &= WRITE_NOT_CORKED;
        this._writableState.updateNextTick();
    }
    _writev(batch, cb) {
        cb(null);
    }
    _write(data, cb) {
        this._writableState.autoBatch(data, cb);
    }
    _final(cb) {
        cb(null);
    }
    static isBackpressured(ws) {
        return (ws._duplexState & WRITE_BACKPRESSURE_STATUS) !== 0;
    }
    static drained(ws) {
        if (ws.destroyed) return Promise.resolve(false);
        const state = ws._writableState;
        const pending = isWritev(ws) ? Math.min(1, state.queue.length) : state.queue.length;
        const writes = pending + (ws._duplexState & WRITE_WRITING ? 1 : 0);
        if (writes === 0) return Promise.resolve(true);
        if (state.drains === null) state.drains = [];
        return new Promise((resolve)=>{
            state.drains.push({
                writes,
                resolve
            });
        });
    }
    write(data) {
        this._writableState.updateNextTick();
        return this._writableState.push(data);
    }
    end(data) {
        this._writableState.updateNextTick();
        this._writableState.end(data);
        return this;
    }
}
class Duplex extends Readable {
    constructor(opts){
        super(opts);
        this._duplexState = OPENING | this._duplexState & READ_READ_AHEAD;
        this._writableState = new WritableState(this, opts);
        if (opts) {
            if (opts.writev) this._writev = opts.writev;
            if (opts.write) this._write = opts.write;
            if (opts.final) this._final = opts.final;
        }
    }
    cork() {
        this._duplexState |= WRITE_CORKED;
    }
    uncork() {
        this._duplexState &= WRITE_NOT_CORKED;
        this._writableState.updateNextTick();
    }
    _writev(batch, cb) {
        cb(null);
    }
    _write(data, cb) {
        this._writableState.autoBatch(data, cb);
    }
    _final(cb) {
        cb(null);
    }
    write(data) {
        this._writableState.updateNextTick();
        return this._writableState.push(data);
    }
    end(data) {
        this._writableState.updateNextTick();
        this._writableState.end(data);
        return this;
    }
}
class Transform extends Duplex {
    constructor(opts){
        super(opts);
        this._transformState = new TransformState(this);
        if (opts) {
            if (opts.transform) this._transform = opts.transform;
            if (opts.flush) this._flush = opts.flush;
        }
    }
    _write(data, cb) {
        if (this._readableState.buffered >= this._readableState.highWaterMark) {
            this._transformState.data = data;
        } else {
            this._transform(data, this._transformState.afterTransform);
        }
    }
    _read(cb) {
        if (this._transformState.data !== null) {
            const data = this._transformState.data;
            this._transformState.data = null;
            cb(null);
            this._transform(data, this._transformState.afterTransform);
        } else {
            cb(null);
        }
    }
    destroy(err) {
        super.destroy(err);
        if (this._transformState.data !== null) {
            this._transformState.data = null;
            this._transformState.afterTransform();
        }
    }
    _transform(data, cb) {
        cb(null, data);
    }
    _flush(cb) {
        cb(null);
    }
    _final(cb) {
        this._transformState.afterFinal = cb;
        this._flush(transformAfterFlush.bind(this));
    }
}
class PassThrough extends Transform {
}
function transformAfterFlush(err, data) {
    const cb = this._transformState.afterFinal;
    if (err) return cb(err);
    if (data !== null && data !== undefined) this.push(data);
    this.push(null);
    cb(null);
}
function pipelinePromise(...streams) {
    return new Promise((resolve, reject)=>{
        return pipeline(...streams, (err)=>{
            if (err) return reject(err);
            resolve();
        });
    });
}
function pipeline(stream, ...streams) {
    const all = Array.isArray(stream) ? [
        ...stream,
        ...streams
    ] : [
        stream,
        ...streams
    ];
    const done = all.length && typeof all[all.length - 1] === 'function' ? all.pop() : null;
    if (all.length < 2) throw new Error('Pipeline requires at least 2 streams');
    let src = all[0];
    let dest = null;
    let error = null;
    for(let i = 1; i < all.length; i++){
        dest = all[i];
        if (isStreamx(src)) {
            src.pipe(dest, onerror);
        } else {
            errorHandle(src, true, i > 1, onerror);
            src.pipe(dest);
        }
        src = dest;
    }
    if (done) {
        let fin = false;
        const autoDestroy = isStreamx(dest) || !!(dest._writableState && dest._writableState.autoDestroy);
        dest.on('error', (err)=>{
            if (error === null) error = err;
        });
        dest.on('finish', ()=>{
            fin = true;
            if (!autoDestroy) done(error);
        });
        if (autoDestroy) {
            dest.on('close', ()=>done(error || (fin ? null : PREMATURE_CLOSE)));
        }
    }
    return dest;
    //TURBOPACK unreachable
    ;
    function errorHandle(s, rd, wr, onerror) {
        s.on('error', onerror);
        s.on('close', onclose);
        function onclose() {
            if (rd && s._readableState && !s._readableState.ended) return onerror(PREMATURE_CLOSE);
            if (wr && s._writableState && !s._writableState.ended) return onerror(PREMATURE_CLOSE);
        }
    }
    function onerror(err) {
        if (!err || error) return;
        error = err;
        for (const s of all){
            s.destroy(err);
        }
    }
}
function echo(s) {
    return s;
}
function isStream(stream) {
    return !!stream._readableState || !!stream._writableState;
}
function isStreamx(stream) {
    return typeof stream._duplexState === 'number' && isStream(stream);
}
function isEnded(stream) {
    return !!stream._readableState && stream._readableState.ended;
}
function isFinished(stream) {
    return !!stream._writableState && stream._writableState.ended;
}
function getStreamError(stream, opts = {}) {
    const err = stream._readableState && stream._readableState.error || stream._writableState && stream._writableState.error;
    // avoid implicit errors by default
    return !opts.all && err === STREAM_DESTROYED ? null : err;
}
function isReadStreamx(stream) {
    return isStreamx(stream) && stream.readable;
}
function isDisturbed(stream) {
    return (stream._duplexState & OPENING) !== OPENING || (stream._duplexState & ACTIVE_OR_TICKING) !== 0;
}
function isTypedArray(data) {
    return typeof data === 'object' && data !== null && typeof data.byteLength === 'number';
}
function defaultByteLength(data) {
    return isTypedArray(data) ? data.byteLength : 1024;
}
function noop() {}
function abort() {
    this.destroy(new Error('Stream aborted.'));
}
function isWritev(s) {
    return s._writev !== Writable.prototype._writev && s._writev !== Duplex.prototype._writev;
}
module.exports = {
    pipeline,
    pipelinePromise,
    isStream,
    isStreamx,
    isEnded,
    isFinished,
    isDisturbed,
    getStreamError,
    Stream,
    Writable,
    Readable,
    Duplex,
    Transform,
    // Export PassThrough for compatibility with Node.js core's stream module
    PassThrough
};
}),
"[project]/node_modules/tar-stream/headers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const b4a = __turbopack_context__.r("[project]/node_modules/b4a/index.js [app-route] (ecmascript)");
const ZEROS = '0000000000000000000';
const SEVENS = '7777777777777777777';
const ZERO_OFFSET = '0'.charCodeAt(0);
const USTAR_MAGIC = b4a.from([
    0x75,
    0x73,
    0x74,
    0x61,
    0x72,
    0x00
]) // ustar\x00
;
const USTAR_VER = b4a.from([
    ZERO_OFFSET,
    ZERO_OFFSET
]);
const GNU_MAGIC = b4a.from([
    0x75,
    0x73,
    0x74,
    0x61,
    0x72,
    0x20
]) // ustar\x20
;
const GNU_VER = b4a.from([
    0x20,
    0x00
]);
const MASK = 0o7777;
const MAGIC_OFFSET = 257;
const VERSION_OFFSET = 263;
exports.decodeLongPath = function decodeLongPath(buf, encoding) {
    return decodeStr(buf, 0, buf.length, encoding);
};
exports.encodePax = function encodePax(opts) {
    let result = '';
    if (opts.name) result += addLength(' path=' + opts.name + '\n');
    if (opts.linkname) result += addLength(' linkpath=' + opts.linkname + '\n');
    const pax = opts.pax;
    if (pax) {
        for(const key in pax){
            result += addLength(' ' + key + '=' + pax[key] + '\n');
        }
    }
    return b4a.from(result);
};
exports.decodePax = function decodePax(buf) {
    const result = {};
    while(buf.length){
        let i = 0;
        while(i < buf.length && buf[i] !== 32)i++;
        const len = parseInt(b4a.toString(buf.subarray(0, i)), 10);
        if (!len) return result;
        const b = b4a.toString(buf.subarray(i + 1, len - 1));
        const keyIndex = b.indexOf('=');
        if (keyIndex === -1) return result;
        result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1);
        buf = buf.subarray(len);
    }
    return result;
};
exports.encode = function encode(opts) {
    const buf = b4a.alloc(512);
    let name = opts.name;
    let prefix = '';
    if (opts.typeflag === 5 && name[name.length - 1] !== '/') name += '/';
    if (b4a.byteLength(name) !== name.length) return null // utf-8
    ;
    while(b4a.byteLength(name) > 100){
        const i = name.indexOf('/');
        if (i === -1) return null;
        prefix += prefix ? '/' + name.slice(0, i) : name.slice(0, i);
        name = name.slice(i + 1);
    }
    if (b4a.byteLength(name) > 100 || b4a.byteLength(prefix) > 155) return null;
    if (opts.linkname && b4a.byteLength(opts.linkname) > 100) return null;
    b4a.write(buf, name);
    b4a.write(buf, encodeOct(opts.mode & MASK, 6), 100);
    b4a.write(buf, encodeOct(opts.uid, 6), 108);
    b4a.write(buf, encodeOct(opts.gid, 6), 116);
    encodeSize(opts.size, buf, 124);
    b4a.write(buf, encodeOct(opts.mtime.getTime() / 1000 | 0, 11), 136);
    buf[156] = ZERO_OFFSET + toTypeflag(opts.type);
    if (opts.linkname) b4a.write(buf, opts.linkname, 157);
    b4a.copy(USTAR_MAGIC, buf, MAGIC_OFFSET);
    b4a.copy(USTAR_VER, buf, VERSION_OFFSET);
    if (opts.uname) b4a.write(buf, opts.uname, 265);
    if (opts.gname) b4a.write(buf, opts.gname, 297);
    b4a.write(buf, encodeOct(opts.devmajor || 0, 6), 329);
    b4a.write(buf, encodeOct(opts.devminor || 0, 6), 337);
    if (prefix) b4a.write(buf, prefix, 345);
    b4a.write(buf, encodeOct(cksum(buf), 6), 148);
    return buf;
};
exports.decode = function decode(buf, filenameEncoding, allowUnknownFormat) {
    let typeflag = buf[156] === 0 ? 0 : buf[156] - ZERO_OFFSET;
    let name = decodeStr(buf, 0, 100, filenameEncoding);
    const mode = decodeOct(buf, 100, 8);
    const uid = decodeOct(buf, 108, 8);
    const gid = decodeOct(buf, 116, 8);
    const size = decodeOct(buf, 124, 12);
    const mtime = decodeOct(buf, 136, 12);
    const type = toType(typeflag);
    const linkname = buf[157] === 0 ? null : decodeStr(buf, 157, 100, filenameEncoding);
    const uname = decodeStr(buf, 265, 32);
    const gname = decodeStr(buf, 297, 32);
    const devmajor = decodeOct(buf, 329, 8);
    const devminor = decodeOct(buf, 337, 8);
    const c = cksum(buf);
    // checksum is still initial value if header was null.
    if (c === 8 * 32) return null;
    // valid checksum
    if (c !== decodeOct(buf, 148, 8)) throw new Error('Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?');
    if (isUSTAR(buf)) {
        // ustar (posix) format.
        // prepend prefix, if present.
        if (buf[345]) name = decodeStr(buf, 345, 155, filenameEncoding) + '/' + name;
    } else if (isGNU(buf)) {
    // 'gnu'/'oldgnu' format. Similar to ustar, but has support for incremental and
    // multi-volume tarballs.
    } else {
        if (!allowUnknownFormat) {
            throw new Error('Invalid tar header: unknown format.');
        }
    }
    // to support old tar versions that use trailing / to indicate dirs
    if (typeflag === 0 && name && name[name.length - 1] === '/') typeflag = 5;
    return {
        name,
        mode,
        uid,
        gid,
        size,
        mtime: new Date(1000 * mtime),
        type,
        linkname,
        uname,
        gname,
        devmajor,
        devminor,
        pax: null
    };
};
function isUSTAR(buf) {
    return b4a.equals(USTAR_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6));
}
function isGNU(buf) {
    return b4a.equals(GNU_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6)) && b4a.equals(GNU_VER, buf.subarray(VERSION_OFFSET, VERSION_OFFSET + 2));
}
function clamp(index, len, defaultValue) {
    if (typeof index !== 'number') return defaultValue;
    index = ~~index; // Coerce to integer.
    if (index >= len) return len;
    if (index >= 0) return index;
    index += len;
    if (index >= 0) return index;
    return 0;
}
function toType(flag) {
    switch(flag){
        case 0:
            return 'file';
        case 1:
            return 'link';
        case 2:
            return 'symlink';
        case 3:
            return 'character-device';
        case 4:
            return 'block-device';
        case 5:
            return 'directory';
        case 6:
            return 'fifo';
        case 7:
            return 'contiguous-file';
        case 72:
            return 'pax-header';
        case 55:
            return 'pax-global-header';
        case 27:
            return 'gnu-long-link-path';
        case 28:
        case 30:
            return 'gnu-long-path';
    }
    return null;
}
function toTypeflag(flag) {
    switch(flag){
        case 'file':
            return 0;
        case 'link':
            return 1;
        case 'symlink':
            return 2;
        case 'character-device':
            return 3;
        case 'block-device':
            return 4;
        case 'directory':
            return 5;
        case 'fifo':
            return 6;
        case 'contiguous-file':
            return 7;
        case 'pax-header':
            return 72;
    }
    return 0;
}
function indexOf(block, num, offset, end) {
    for(; offset < end; offset++){
        if (block[offset] === num) return offset;
    }
    return end;
}
function cksum(block) {
    let sum = 8 * 32;
    for(let i = 0; i < 148; i++)sum += block[i];
    for(let j = 156; j < 512; j++)sum += block[j];
    return sum;
}
function encodeOct(val, n) {
    val = val.toString(8);
    if (val.length > n) return SEVENS.slice(0, n) + ' ';
    return ZEROS.slice(0, n - val.length) + val + ' ';
}
function encodeSizeBin(num, buf, off) {
    buf[off] = 0x80;
    for(let i = 11; i > 0; i--){
        buf[off + i] = num & 0xff;
        num = Math.floor(num / 0x100);
    }
}
function encodeSize(num, buf, off) {
    if (num.toString(8).length > 11) {
        encodeSizeBin(num, buf, off);
    } else {
        b4a.write(buf, encodeOct(num, 11), off);
    }
}
/* Copied from the node-tar repo and modified to meet
 * tar-stream coding standard.
 *
 * Source: https://github.com/npm/node-tar/blob/51b6627a1f357d2eb433e7378e5f05e83b7aa6cd/lib/header.js#L349
 */ function parse256(buf) {
    // first byte MUST be either 80 or FF
    // 80 for positive, FF for 2's comp
    let positive;
    if (buf[0] === 0x80) positive = true;
    else if (buf[0] === 0xFF) positive = false;
    else return null;
    // build up a base-256 tuple from the least sig to the highest
    const tuple = [];
    let i;
    for(i = buf.length - 1; i > 0; i--){
        const byte = buf[i];
        if (positive) tuple.push(byte);
        else tuple.push(0xFF - byte);
    }
    let sum = 0;
    const l = tuple.length;
    for(i = 0; i < l; i++){
        sum += tuple[i] * Math.pow(256, i);
    }
    return positive ? sum : -1 * sum;
}
function decodeOct(val, offset, length) {
    val = val.subarray(offset, offset + length);
    offset = 0;
    // If prefixed with 0x80 then parse as a base-256 integer
    if (val[offset] & 0x80) {
        return parse256(val);
    } else {
        // Older versions of tar can prefix with spaces
        while(offset < val.length && val[offset] === 32)offset++;
        const end = clamp(indexOf(val, 32, offset, val.length), val.length, val.length);
        while(offset < end && val[offset] === 0)offset++;
        if (end === offset) return 0;
        return parseInt(b4a.toString(val.subarray(offset, end)), 8);
    }
}
function decodeStr(val, offset, length, encoding) {
    return b4a.toString(val.subarray(offset, indexOf(val, 0, offset, offset + length)), encoding);
}
function addLength(str) {
    const len = b4a.byteLength(str);
    let digits = Math.floor(Math.log(len) / Math.log(10)) + 1;
    if (len + digits >= Math.pow(10, digits)) digits++;
    return len + digits + str;
}
}),
"[project]/node_modules/tar-stream/extract.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { Writable, Readable, getStreamError } = __turbopack_context__.r("[project]/node_modules/streamx/index.js [app-route] (ecmascript)");
const FIFO = __turbopack_context__.r("[project]/node_modules/fast-fifo/index.js [app-route] (ecmascript)");
const b4a = __turbopack_context__.r("[project]/node_modules/b4a/index.js [app-route] (ecmascript)");
const headers = __turbopack_context__.r("[project]/node_modules/tar-stream/headers.js [app-route] (ecmascript)");
const EMPTY = b4a.alloc(0);
class BufferList {
    constructor(){
        this.buffered = 0;
        this.shifted = 0;
        this.queue = new FIFO();
        this._offset = 0;
    }
    push(buffer) {
        this.buffered += buffer.byteLength;
        this.queue.push(buffer);
    }
    shiftFirst(size) {
        return this._buffered === 0 ? null : this._next(size);
    }
    shift(size) {
        if (size > this.buffered) return null;
        if (size === 0) return EMPTY;
        let chunk = this._next(size);
        if (size === chunk.byteLength) return chunk // likely case
        ;
        const chunks = [
            chunk
        ];
        while((size -= chunk.byteLength) > 0){
            chunk = this._next(size);
            chunks.push(chunk);
        }
        return b4a.concat(chunks);
    }
    _next(size) {
        const buf = this.queue.peek();
        const rem = buf.byteLength - this._offset;
        if (size >= rem) {
            const sub = this._offset ? buf.subarray(this._offset, buf.byteLength) : buf;
            this.queue.shift();
            this._offset = 0;
            this.buffered -= rem;
            this.shifted += rem;
            return sub;
        }
        this.buffered -= size;
        this.shifted += size;
        return buf.subarray(this._offset, this._offset += size);
    }
}
class Source extends Readable {
    constructor(self, header, offset){
        super();
        this.header = header;
        this.offset = offset;
        this._parent = self;
    }
    _read(cb) {
        if (this.header.size === 0) {
            this.push(null);
        }
        if (this._parent._stream === this) {
            this._parent._update();
        }
        cb(null);
    }
    _predestroy() {
        this._parent.destroy(getStreamError(this));
    }
    _detach() {
        if (this._parent._stream === this) {
            this._parent._stream = null;
            this._parent._missing = overflow(this.header.size);
            this._parent._update();
        }
    }
    _destroy(cb) {
        this._detach();
        cb(null);
    }
}
class Extract extends Writable {
    constructor(opts){
        super(opts);
        if (!opts) opts = {};
        this._buffer = new BufferList();
        this._offset = 0;
        this._header = null;
        this._stream = null;
        this._missing = 0;
        this._longHeader = false;
        this._callback = noop;
        this._locked = false;
        this._finished = false;
        this._pax = null;
        this._paxGlobal = null;
        this._gnuLongPath = null;
        this._gnuLongLinkPath = null;
        this._filenameEncoding = opts.filenameEncoding || 'utf-8';
        this._allowUnknownFormat = !!opts.allowUnknownFormat;
        this._unlockBound = this._unlock.bind(this);
    }
    _unlock(err) {
        this._locked = false;
        if (err) {
            this.destroy(err);
            this._continueWrite(err);
            return;
        }
        this._update();
    }
    _consumeHeader() {
        if (this._locked) return false;
        this._offset = this._buffer.shifted;
        try {
            this._header = headers.decode(this._buffer.shift(512), this._filenameEncoding, this._allowUnknownFormat);
        } catch (err) {
            this._continueWrite(err);
            return false;
        }
        if (!this._header) return true;
        switch(this._header.type){
            case 'gnu-long-path':
            case 'gnu-long-link-path':
            case 'pax-global-header':
            case 'pax-header':
                this._longHeader = true;
                this._missing = this._header.size;
                return true;
        }
        this._locked = true;
        this._applyLongHeaders();
        if (this._header.size === 0 || this._header.type === 'directory') {
            this.emit('entry', this._header, this._createStream(), this._unlockBound);
            return true;
        }
        this._stream = this._createStream();
        this._missing = this._header.size;
        this.emit('entry', this._header, this._stream, this._unlockBound);
        return true;
    }
    _applyLongHeaders() {
        if (this._gnuLongPath) {
            this._header.name = this._gnuLongPath;
            this._gnuLongPath = null;
        }
        if (this._gnuLongLinkPath) {
            this._header.linkname = this._gnuLongLinkPath;
            this._gnuLongLinkPath = null;
        }
        if (this._pax) {
            if (this._pax.path) this._header.name = this._pax.path;
            if (this._pax.linkpath) this._header.linkname = this._pax.linkpath;
            if (this._pax.size) this._header.size = parseInt(this._pax.size, 10);
            this._header.pax = this._pax;
            this._pax = null;
        }
    }
    _decodeLongHeader(buf) {
        switch(this._header.type){
            case 'gnu-long-path':
                this._gnuLongPath = headers.decodeLongPath(buf, this._filenameEncoding);
                break;
            case 'gnu-long-link-path':
                this._gnuLongLinkPath = headers.decodeLongPath(buf, this._filenameEncoding);
                break;
            case 'pax-global-header':
                this._paxGlobal = headers.decodePax(buf);
                break;
            case 'pax-header':
                this._pax = this._paxGlobal === null ? headers.decodePax(buf) : Object.assign({}, this._paxGlobal, headers.decodePax(buf));
                break;
        }
    }
    _consumeLongHeader() {
        this._longHeader = false;
        this._missing = overflow(this._header.size);
        const buf = this._buffer.shift(this._header.size);
        try {
            this._decodeLongHeader(buf);
        } catch (err) {
            this._continueWrite(err);
            return false;
        }
        return true;
    }
    _consumeStream() {
        const buf = this._buffer.shiftFirst(this._missing);
        if (buf === null) return false;
        this._missing -= buf.byteLength;
        const drained = this._stream.push(buf);
        if (this._missing === 0) {
            this._stream.push(null);
            if (drained) this._stream._detach();
            return drained && this._locked === false;
        }
        return drained;
    }
    _createStream() {
        return new Source(this, this._header, this._offset);
    }
    _update() {
        while(this._buffer.buffered > 0 && !this.destroying){
            if (this._missing > 0) {
                if (this._stream !== null) {
                    if (this._consumeStream() === false) return;
                    continue;
                }
                if (this._longHeader === true) {
                    if (this._missing > this._buffer.buffered) break;
                    if (this._consumeLongHeader() === false) return false;
                    continue;
                }
                const ignore = this._buffer.shiftFirst(this._missing);
                if (ignore !== null) this._missing -= ignore.byteLength;
                continue;
            }
            if (this._buffer.buffered < 512) break;
            if (this._stream !== null || this._consumeHeader() === false) return;
        }
        this._continueWrite(null);
    }
    _continueWrite(err) {
        const cb = this._callback;
        this._callback = noop;
        cb(err);
    }
    _write(data, cb) {
        this._callback = cb;
        this._buffer.push(data);
        this._update();
    }
    _final(cb) {
        this._finished = this._missing === 0 && this._buffer.buffered === 0;
        cb(this._finished ? null : new Error('Unexpected end of data'));
    }
    _predestroy() {
        this._continueWrite(null);
    }
    _destroy(cb) {
        if (this._stream) this._stream.destroy(getStreamError(this));
        cb(null);
    }
    [Symbol.asyncIterator]() {
        let error = null;
        let promiseResolve = null;
        let promiseReject = null;
        let entryStream = null;
        let entryCallback = null;
        const extract = this;
        this.on('entry', onentry);
        this.on('error', (err)=>{
            error = err;
        });
        this.on('close', onclose);
        return {
            [Symbol.asyncIterator] () {
                return this;
            },
            next () {
                return new Promise(onnext);
            },
            return () {
                return destroy(null);
            },
            throw (err) {
                return destroy(err);
            }
        };
        //TURBOPACK unreachable
        ;
        function consumeCallback(err) {
            if (!entryCallback) return;
            const cb = entryCallback;
            entryCallback = null;
            cb(err);
        }
        function onnext(resolve, reject) {
            if (error) {
                return reject(error);
            }
            if (entryStream) {
                resolve({
                    value: entryStream,
                    done: false
                });
                entryStream = null;
                return;
            }
            promiseResolve = resolve;
            promiseReject = reject;
            consumeCallback(null);
            if (extract._finished && promiseResolve) {
                promiseResolve({
                    value: undefined,
                    done: true
                });
                promiseResolve = promiseReject = null;
            }
        }
        function onentry(header, stream, callback) {
            entryCallback = callback;
            stream.on('error', noop); // no way around this due to tick sillyness
            if (promiseResolve) {
                promiseResolve({
                    value: stream,
                    done: false
                });
                promiseResolve = promiseReject = null;
            } else {
                entryStream = stream;
            }
        }
        function onclose() {
            consumeCallback(error);
            if (!promiseResolve) return;
            if (error) promiseReject(error);
            else promiseResolve({
                value: undefined,
                done: true
            });
            promiseResolve = promiseReject = null;
        }
        function destroy(err) {
            extract.destroy(err);
            consumeCallback(err);
            return new Promise((resolve, reject)=>{
                if (extract.destroyed) return resolve({
                    value: undefined,
                    done: true
                });
                extract.once('close', function() {
                    if (err) reject(err);
                    else resolve({
                        value: undefined,
                        done: true
                    });
                });
            });
        }
    }
}
module.exports = function extract(opts) {
    return new Extract(opts);
};
function noop() {}
function overflow(size) {
    size &= 511;
    return size && 512 - size;
}
}),
"[project]/node_modules/tar-stream/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const constants = {
    S_IFMT: 61440,
    S_IFDIR: 16384,
    S_IFCHR: 8192,
    S_IFBLK: 24576,
    S_IFIFO: 4096,
    S_IFLNK: 40960
};
try {
    module.exports = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)").constants || constants;
} catch  {
    module.exports = constants;
}
}),
"[project]/node_modules/tar-stream/pack.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { Readable, Writable, getStreamError } = __turbopack_context__.r("[project]/node_modules/streamx/index.js [app-route] (ecmascript)");
const b4a = __turbopack_context__.r("[project]/node_modules/b4a/index.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/tar-stream/constants.js [app-route] (ecmascript)");
const headers = __turbopack_context__.r("[project]/node_modules/tar-stream/headers.js [app-route] (ecmascript)");
const DMODE = 0o755;
const FMODE = 0o644;
const END_OF_TAR = b4a.alloc(1024);
class Sink extends Writable {
    constructor(pack, header, callback){
        super({
            mapWritable,
            eagerOpen: true
        });
        this.written = 0;
        this.header = header;
        this._callback = callback;
        this._linkname = null;
        this._isLinkname = header.type === 'symlink' && !header.linkname;
        this._isVoid = header.type !== 'file' && header.type !== 'contiguous-file';
        this._finished = false;
        this._pack = pack;
        this._openCallback = null;
        if (this._pack._stream === null) this._pack._stream = this;
        else this._pack._pending.push(this);
    }
    _open(cb) {
        this._openCallback = cb;
        if (this._pack._stream === this) this._continueOpen();
    }
    _continuePack(err) {
        if (this._callback === null) return;
        const callback = this._callback;
        this._callback = null;
        callback(err);
    }
    _continueOpen() {
        if (this._pack._stream === null) this._pack._stream = this;
        const cb = this._openCallback;
        this._openCallback = null;
        if (cb === null) return;
        if (this._pack.destroying) return cb(new Error('pack stream destroyed'));
        if (this._pack._finalized) return cb(new Error('pack stream is already finalized'));
        this._pack._stream = this;
        if (!this._isLinkname) {
            this._pack._encode(this.header);
        }
        if (this._isVoid) {
            this._finish();
            this._continuePack(null);
        }
        cb(null);
    }
    _write(data, cb) {
        if (this._isLinkname) {
            this._linkname = this._linkname ? b4a.concat([
                this._linkname,
                data
            ]) : data;
            return cb(null);
        }
        if (this._isVoid) {
            if (data.byteLength > 0) {
                return cb(new Error('No body allowed for this entry'));
            }
            return cb();
        }
        this.written += data.byteLength;
        if (this._pack.push(data)) return cb();
        this._pack._drain = cb;
    }
    _finish() {
        if (this._finished) return;
        this._finished = true;
        if (this._isLinkname) {
            this.header.linkname = this._linkname ? b4a.toString(this._linkname, 'utf-8') : '';
            this._pack._encode(this.header);
        }
        overflow(this._pack, this.header.size);
        this._pack._done(this);
    }
    _final(cb) {
        if (this.written !== this.header.size) {
            return cb(new Error('Size mismatch'));
        }
        this._finish();
        cb(null);
    }
    _getError() {
        return getStreamError(this) || new Error('tar entry destroyed');
    }
    _predestroy() {
        this._pack.destroy(this._getError());
    }
    _destroy(cb) {
        this._pack._done(this);
        this._continuePack(this._finished ? null : this._getError());
        cb();
    }
}
class Pack extends Readable {
    constructor(opts){
        super(opts);
        this._drain = noop;
        this._finalized = false;
        this._finalizing = false;
        this._pending = [];
        this._stream = null;
    }
    entry(header, buffer, callback) {
        if (this._finalized || this.destroying) throw new Error('already finalized or destroyed');
        if (typeof buffer === 'function') {
            callback = buffer;
            buffer = null;
        }
        if (!callback) callback = noop;
        if (!header.size || header.type === 'symlink') header.size = 0;
        if (!header.type) header.type = modeToType(header.mode);
        if (!header.mode) header.mode = header.type === 'directory' ? DMODE : FMODE;
        if (!header.uid) header.uid = 0;
        if (!header.gid) header.gid = 0;
        if (!header.mtime) header.mtime = new Date();
        if (typeof buffer === 'string') buffer = b4a.from(buffer);
        const sink = new Sink(this, header, callback);
        if (b4a.isBuffer(buffer)) {
            header.size = buffer.byteLength;
            sink.write(buffer);
            sink.end();
            return sink;
        }
        if (sink._isVoid) {
            return sink;
        }
        return sink;
    }
    finalize() {
        if (this._stream || this._pending.length > 0) {
            this._finalizing = true;
            return;
        }
        if (this._finalized) return;
        this._finalized = true;
        this.push(END_OF_TAR);
        this.push(null);
    }
    _done(stream) {
        if (stream !== this._stream) return;
        this._stream = null;
        if (this._finalizing) this.finalize();
        if (this._pending.length) this._pending.shift()._continueOpen();
    }
    _encode(header) {
        if (!header.pax) {
            const buf = headers.encode(header);
            if (buf) {
                this.push(buf);
                return;
            }
        }
        this._encodePax(header);
    }
    _encodePax(header) {
        const paxHeader = headers.encodePax({
            name: header.name,
            linkname: header.linkname,
            pax: header.pax
        });
        const newHeader = {
            name: 'PaxHeader',
            mode: header.mode,
            uid: header.uid,
            gid: header.gid,
            size: paxHeader.byteLength,
            mtime: header.mtime,
            type: 'pax-header',
            linkname: header.linkname && 'PaxHeader',
            uname: header.uname,
            gname: header.gname,
            devmajor: header.devmajor,
            devminor: header.devminor
        };
        this.push(headers.encode(newHeader));
        this.push(paxHeader);
        overflow(this, paxHeader.byteLength);
        newHeader.size = header.size;
        newHeader.type = header.type;
        this.push(headers.encode(newHeader));
    }
    _doDrain() {
        const drain = this._drain;
        this._drain = noop;
        drain();
    }
    _predestroy() {
        const err = getStreamError(this);
        if (this._stream) this._stream.destroy(err);
        while(this._pending.length){
            const stream = this._pending.shift();
            stream.destroy(err);
            stream._continueOpen();
        }
        this._doDrain();
    }
    _read(cb) {
        this._doDrain();
        cb();
    }
}
module.exports = function pack(opts) {
    return new Pack(opts);
};
function modeToType(mode) {
    switch(mode & constants.S_IFMT){
        case constants.S_IFBLK:
            return 'block-device';
        case constants.S_IFCHR:
            return 'character-device';
        case constants.S_IFDIR:
            return 'directory';
        case constants.S_IFIFO:
            return 'fifo';
        case constants.S_IFLNK:
            return 'symlink';
    }
    return 'file';
}
function noop() {}
function overflow(self, size) {
    size &= 511;
    if (size) self.push(END_OF_TAR.subarray(0, 512 - size));
}
function mapWritable(buf) {
    return b4a.isBuffer(buf) ? buf : b4a.from(buf);
}
}),
"[project]/node_modules/tar-stream/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.extract = __turbopack_context__.r("[project]/node_modules/tar-stream/extract.js [app-route] (ecmascript)");
exports.pack = __turbopack_context__.r("[project]/node_modules/tar-stream/pack.js [app-route] (ecmascript)");
}),
"[project]/node_modules/archiver/node_modules/buffer-crc32/dist/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}
const CRC_TABLE = new Int32Array([
    0,
    1996959894,
    3993919788,
    2567524794,
    124634137,
    1886057615,
    3915621685,
    2657392035,
    249268274,
    2044508324,
    3772115230,
    2547177864,
    162941995,
    2125561021,
    3887607047,
    2428444049,
    498536548,
    1789927666,
    4089016648,
    2227061214,
    450548861,
    1843258603,
    4107580753,
    2211677639,
    325883990,
    1684777152,
    4251122042,
    2321926636,
    335633487,
    1661365465,
    4195302755,
    2366115317,
    997073096,
    1281953886,
    3579855332,
    2724688242,
    1006888145,
    1258607687,
    3524101629,
    2768942443,
    901097722,
    1119000684,
    3686517206,
    2898065728,
    853044451,
    1172266101,
    3705015759,
    2882616665,
    651767980,
    1373503546,
    3369554304,
    3218104598,
    565507253,
    1454621731,
    3485111705,
    3099436303,
    671266974,
    1594198024,
    3322730930,
    2970347812,
    795835527,
    1483230225,
    3244367275,
    3060149565,
    1994146192,
    31158534,
    2563907772,
    4023717930,
    1907459465,
    112637215,
    2680153253,
    3904427059,
    2013776290,
    251722036,
    2517215374,
    3775830040,
    2137656763,
    141376813,
    2439277719,
    3865271297,
    1802195444,
    476864866,
    2238001368,
    4066508878,
    1812370925,
    453092731,
    2181625025,
    4111451223,
    1706088902,
    314042704,
    2344532202,
    4240017532,
    1658658271,
    366619977,
    2362670323,
    4224994405,
    1303535960,
    984961486,
    2747007092,
    3569037538,
    1256170817,
    1037604311,
    2765210733,
    3554079995,
    1131014506,
    879679996,
    2909243462,
    3663771856,
    1141124467,
    855842277,
    2852801631,
    3708648649,
    1342533948,
    654459306,
    3188396048,
    3373015174,
    1466479909,
    544179635,
    3110523913,
    3462522015,
    1591671054,
    702138776,
    2966460450,
    3352799412,
    1504918807,
    783551873,
    3082640443,
    3233442989,
    3988292384,
    2596254646,
    62317068,
    1957810842,
    3939845945,
    2647816111,
    81470997,
    1943803523,
    3814918930,
    2489596804,
    225274430,
    2053790376,
    3826175755,
    2466906013,
    167816743,
    2097651377,
    4027552580,
    2265490386,
    503444072,
    1762050814,
    4150417245,
    2154129355,
    426522225,
    1852507879,
    4275313526,
    2312317920,
    282753626,
    1742555852,
    4189708143,
    2394877945,
    397917763,
    1622183637,
    3604390888,
    2714866558,
    953729732,
    1340076626,
    3518719985,
    2797360999,
    1068828381,
    1219638859,
    3624741850,
    2936675148,
    906185462,
    1090812512,
    3747672003,
    2825379669,
    829329135,
    1181335161,
    3412177804,
    3160834842,
    628085408,
    1382605366,
    3423369109,
    3138078467,
    570562233,
    1426400815,
    3317316542,
    2998733608,
    733239954,
    1555261956,
    3268935591,
    3050360625,
    752459403,
    1541320221,
    2607071920,
    3965973030,
    1969922972,
    40735498,
    2617837225,
    3943577151,
    1913087877,
    83908371,
    2512341634,
    3803740692,
    2075208622,
    213261112,
    2463272603,
    3855990285,
    2094854071,
    198958881,
    2262029012,
    4057260610,
    1759359992,
    534414190,
    2176718541,
    4139329115,
    1873836001,
    414664567,
    2282248934,
    4279200368,
    1711684554,
    285281116,
    2405801727,
    4167216745,
    1634467795,
    376229701,
    2685067896,
    3608007406,
    1308918612,
    956543938,
    2808555105,
    3495958263,
    1231636301,
    1047427035,
    2932959818,
    3654703836,
    1088359270,
    936918e3,
    2847714899,
    3736837829,
    1202900863,
    817233897,
    3183342108,
    3401237130,
    1404277552,
    615818150,
    3134207493,
    3453421203,
    1423857449,
    601450431,
    3009837614,
    3294710456,
    1567103746,
    711928724,
    3020668471,
    3272380065,
    1510334235,
    755167117
]);
function ensureBuffer(input) {
    if (Buffer.isBuffer(input)) {
        return input;
    }
    if (typeof input === "number") {
        return Buffer.alloc(input);
    } else if (typeof input === "string") {
        return Buffer.from(input);
    } else {
        throw new Error("input must be buffer, number, or string, received " + typeof input);
    }
}
function bufferizeInt(num) {
    const tmp = ensureBuffer(4);
    tmp.writeInt32BE(num, 0);
    return tmp;
}
function _crc32(buf, previous) {
    buf = ensureBuffer(buf);
    if (Buffer.isBuffer(previous)) {
        previous = previous.readUInt32BE(0);
    }
    let crc = ~~previous ^ -1;
    for(var n = 0; n < buf.length; n++){
        crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
    }
    return crc ^ -1;
}
function crc32() {
    return bufferizeInt(_crc32.apply(null, arguments));
}
crc32.signed = function() {
    return _crc32.apply(null, arguments);
};
crc32.unsigned = function() {
    return _crc32.apply(null, arguments) >>> 0;
};
var bufferCrc32 = crc32;
const index = /*@__PURE__*/ getDefaultExportFromCjs(bufferCrc32);
module.exports = index;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__180c4692._.js.map