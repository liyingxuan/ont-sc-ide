define("ace/snippets/lisp",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText =undefined;
exports.scope = "lisp";

});
                (function() {
                    window.require(["ace/snippets/lisp"], function(m) {
                        if (typeof module == "object") {
                            module.exports = m;
                        }
                    });
                })();
            