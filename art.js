"use strict";

(function(){
    var G = (window.FireGame = window.FireGame || {});
    var U = MajicUnits;
    var A = G.art = {};

    G.art.load = function(q) {
        var manifest = [
            {id: 'bkgnd', src: 'images/background.png'}
        ];
        G.art.magnesia = [];
        for (var i=0; i<6; ++i) {
            G.art.magnesia.push('images/magnesium0' + (i+1) + '.png');
        }
        manifest = manifest.concat(G.art.magnesia);

        q.loadManifest(manifest);
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

    G.art.drawMagnesium = function(s) {
        var img1 = G.queue.getResult( A.magnesia[this.curSprite] );
        var img2 = G.queue.getResult( A.magnesia[this.nextSprite] );
        var cam = G.state.camera;
        var w = img1.width;
        var h = img1.height;
        w/=2;
        h/=2;
        var x = cam.toCamX(this.x) - w/2;
        var y = cam.toCamY(this.y) - h/2;
        /*
        s.globalAlpha = 1 - this.fadeAmt;
        s.drawImage(img1, x, y);
        s.globalAlpha = this.fadeAmt;
        */
        s.drawImage(img2, x, y, w, h);
        s.globalAlpha = 1;
    };
})();
