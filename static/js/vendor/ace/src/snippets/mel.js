define("ace/snippets/mel",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText =undefined;
exports.scope = "mel";

});
                (function() {
                    window.require(["ace/snippets/mel"], function(m) {
                        if (typeof module == "object") {
                            module.exports = m;
                        }
                    });
                })();
            