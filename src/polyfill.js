//polyfill for ie9
if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var id = window.setTimeout(function() { callback(); }, 
              16);
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}