"use strict";

(function(){
    var G = (window.FireGame = window.FireGame || {});
    var U = MajicUnits;
    G.art = {};

    G.art.load = function(q) {
        q.loadFile({id: 'bkgnd', src: 'background.png'});
    };

    // NOTE: In all the draw*() functions below, "this" refers to
    // whatever object has adopted it as a method, and NOT the
    // surrounding context.

    G.art.drawBackground = function(s) {
        s.drawImage( G.queue.getResult('bkgnd'), 0, 0 );
    };
})();
