define("ace/snippets/lucene",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText =undefined;
exports.scope = "lucene";

});
                (function() {
                    window.require(["ace/snippets/lucene"], function(m) {
                        if (typeof module == "object") {
                            module.exports = m;
                        }
                    });
                })();
            