"use strict";

(function(){
    var G = (window.FireGame = window.FireGame || {});
    var U = MajicUnits;
    var A = G.art = {};

    G.art.load = function(q) {
        var manifest = [
            {id: 'bkgnd', src: 'images/background.png'}
          , {id: 'dev:water', src: 'images/extinguisher_water_and_foam.png'}
          , {id: 'dev:powder', src: 'images/extinguisher_dry_powder.png'}
          , {id: 'dev:chem', src: 'images/extinguisher_dry_chemical.png'}
          , {id: 'lab', src: 'images/laboratory.png'}
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
        try {
        var w = img.width * (obj.scale? obj.scale : 1);
        } catch(e) {debugger;}
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
        var frames = G.art[this.spriteFrames];
        drawImageAt(this, s, frames[this.nextSprite]);
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

        var sel = G.state.selector;
        drawImageAt(this, s, sel.devices[sel.selected].tag);
    }

    G.art.drawSelector = function(s) {
        var ds = this.devices;
        var gfx = this.devices.map(
            function(d) {
                return G.queue.getResult(d.tag);
            }
        );
        var devSz = this.deviceSize.as( U.pixels );

        // Dimensions of panel
        var padding = 18;
        var cornerRad = padding; // 9;
        var h = devSz + padding;
        var t = G.game.height - h;
        var w = ds.length * devSz + ds.length * padding;
        var l = G.game.width - w;

        // device rectangle padding
        var drp = 8;

        // *** Fill path ***
        s.beginPath();
        // main rect
        s.rect(l, t, w, h);
        // left rect
        s.rect(l - padding, t, padding, h);
        // right rect
        s.rect(l, t - padding, w, padding);
        // corner
        //s.arc(l, t, cornerRad, pi, 3*pi/2);
        s.arc(l, t, cornerRad, 0, 2*Math.PI);

        s.globalAlpha = 0.5;
        s.fillStyle = 'white';
        s.fill();

        for (var i=0; i != gfx.length; ++i) {
            l = G.gm.width - (padding * (i+1) + devSz * (i+1));
            w = devSz;
            h = devSz;
            var g = gfx[i];
            if (g.width > g.height) {
                h = g.height * (w / g.width);
            }
            else {
                w = g.width * (h / g.height);
            }

            // opaque?
            if (this.selected == i) {
                var savedAlpha = s.globalAlpha;
                s.globalAlpha = 1;
            }

            s.beginPath();
            s.rect(l + drp, t + drp, devSz - 2*drp, devSz - 2*drp);
            s.fillStyle = ds[i].color;
            s.strokeStyle = '#222';
            s.lineWidth = 1;
            s.fill();
            //s.stroke();

            s.drawImage(g, l, t, w, h);

            // unopaque?
            if (this.selected == i) {
                var p = 4;
                s.strokeRect(l-p, t-p, devSz+2*p, devSz+2*p);
                s.globalAlpha = savedAlpha;
            }
        }

        s.globalAlpha = 1;
    };

    G.art.drawSpawnPoints = function(s) {
        var spawners = this.spawners;
        for (var i=0; i != spawners.length; ++i) {
            spawners[i].draw(s);
        }
    };

    G.art.drawSpawner = function(s) {
        if (this.gfx)
            drawImageAt(this, s, this.gfx);
        else if (false) {
            s.beginPath();
            var cam = G.state.camera;
            s.arc(cam.toCamX(this.x), cam.toCamY(this.y), 50, 0, 2*Math.PI);
            s.fill();
        }
    };
})();
