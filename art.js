"use strict";

(function(){
    var G = (window.FireGame = window.FireGame || {});
    var U = MajicUnits;
    var A = G.art = {};

    G.art.load = function(q) {
        var manifest = [
            {id: 'bkgnd', src: 'images/background.png'}
          , {id: 'dev:water', src: 'images/extinguisher_water_and_foam.png'}
        ];

        G.art.magnesia = [];
        for (var i=1; i<=6; ++i) {
            G.art.magnesia.push('images/magnesium0' + i + '.png');
        }
        manifest = manifest.concat(G.art.magnesia);

        G.art.infantry = [];
        for (var i=1; i<=18; ++i) {
            G.art.infantry.push('images/infantry' + (i<10? '0' : '') + i + '.png');
        }
        manifest = manifest.concat(G.art.infantry);

        G.art.sparky = [];
        for (var i=1; i<=18; ++i) {
            G.art.sparky.push('images/sparky_fire_' + (i<10? '0' : '') + i + '.png');
        }
        manifest = manifest.concat(G.art.sparky);

        q.loadManifest(manifest);
    };

    // Util fns
    function drawImageAt(obj, s, tag) {
        var img = G.queue.getResult( tag );
        var cam = G.state.camera;
        var w = img.width * (obj.scale? obj.scale : 1);
        var h = img.height * (obj.scale? obj.scale : 1);
        var x = cam.toCamX(obj.x) - w/2; var y = cam.toCamY(obj.y) - h/2; s.drawImage(img, x, y, w, h);
    }


    /**** Draw Functions ****/
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

    G.art.drawFloater = function(s) {
        drawImageAt(this, s, this.spriteFrames[this.nextSprite]);
    };

    G.art.drawPlayer = function(s) {
        /*  Placeholder square:
        var cam = G.state.camera;
        s.save();
        s.translate( cam.toCamX(this.x), cam.toCamY(this.y) );
        var w = this.width;
        var h = this.height;
        s.fillStyle = 'green';
        s.fillRect(-w/2, -h/2, w, h);
        s.strokeRect(-w/2, -h/2, w, h);
        s.restore(); */

        drawImageAt(this, s, 'dev:water');
    }
})();
