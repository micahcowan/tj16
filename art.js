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
        var img = G.queue.getResult('bkgnd');
        var tl = G.state.camera.getTL();
        var w = G.game.width;
        var h = G.game.height;
        s.drawImage( img, tl.x, tl.y, w, h, 0, 0, w, h);
    };
})();
