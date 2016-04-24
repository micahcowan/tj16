"use strict";

(function(){
    var G = (window.FireGame = window.FireGame || {});
    var U = MajicUnits;
    var MG = MajicGame;
    var Bh = MG.behavior;
    var GBh = G.behavior;

    // G.areaRect: "smart" global object that acts as a proxy for the
    // area rect in the current state object.
    G.areaRect = {
        t: 0
      , l: 0
      , get b() {
            return G.state.area.h;
        }
      , get r() {
            return G.state.area.w;
        }
    };
    // G.playerPos: "smart" global object that acts as a proxy for
    // the player's position.
    G.playerPos = {
        get x() {
            return G.state.player.x.relax();
        }
      , get y() {
            return G.state.player.y.relax();
        }
    }
    // Ditto for camera
    G.cameraRect = {
        get t() {
            var cam = G.state.camera;
            return cam.getTL().y;
        }
      , get l() {
            var cam = G.state.camera;
            return cam.getTL().x;
        }
      , get b() {
            var cam = G.state.camera;
            return cam.getBR().y;
        }
      , get r() {
            var cam = G.state.camera;
            return cam.getBR().x;
        }
    };
    // Tighter rect for player in camera
    var cameraPadding = U.pixels( 160 );
    G.playerCameraRect = {
        get t() {
            return G.cameraRect.t.add(cameraPadding).relax();
        }
      , get l() {
            return G.cameraRect.l.add(cameraPadding).relax();
        }
      , get b() {
            return G.cameraRect.b.sub(cameraPadding).relax();
        }
      , get r() {
            return G.cameraRect.r.sub(cameraPadding).relax();
        }
    };

    // Camera (sprite-like)
    G.Camera = function(x, y) {
        var mg = G.game;
        this.x = x;
        this.y = y;

        function _getAsPx(px) {
            return px instanceof U.UnitValue? px.mul( 1 ) : U.pixels( px ).relax();
        }

        Object.defineProperty(this, 'pos', {
            get: function() {
                return { x: this.x.mul(1), y: this.y.mul(1) };
            }
        });

        this.getTL = function() {
            return {
                x: this.x.sub( mg.center.x ).relax()
              , y: this.y.sub( mg.center.y ).relax()
            };
        };

        this.getBR = function() {
            return {
                x: this.x.add( mg.center.x ).relax()
              , y: this.y.add( mg.center.y ).relax()
            };
        };

        this.toCamX = function(x) {
            x = _getAsPx(x);
            return x.sub( this.getTL().x ).relax();
        }

        this.toCamY = function(y) {
            // Convert to U.pixels if necessary
            y = _getAsPx(y);
            return y.sub( this.getTL().y ).relax();
        }

        this.toGameX = function(x) {
            x = _getAsPx(x);
            return x.add( this.getTL().x ).relax();
        }

        this.toGameY = function(y) {
            // Convert to U.pixels if necessary
            y = _getAsPx(y);
            return y.add( this.getTL().y ).relax();
        }

        function boundsCheck() {
            // FIXME: Unify this as a generic bounds-checking behavior
            // in MajicGame, to which you can pass a function that is
            // called when bounds are exceeded.
            // Adjust for player-in-view, and out-of-bounds
            var tl = this.getTL();
            var br = this.getBR();
            var tDiff = tl.y
            var lDiff = tl.x
            var bDiff = br.y.sub( G.state.area.h ).relax();
            var rDiff = br.x.sub( G.state.area.w ).relax();
            if (bDiff > 0) {
                this.y = this.y.sub(bDiff);
                this.v = U.pixels( 0 ).per.second;
            }
            if (rDiff > 0) {
                this.x = this.x.sub(rDiff);
                this.h = U.pixels( 0 ).per.second;
            }
            if (tDiff < 0) {
                this.y = this.y.sub(tDiff);
                this.v = U.pixels( 0 ).per.second;
            }
            if (lDiff < 0) {
                this.x = this.x.sub(lDiff);
                this.h = U.pixels( 0 ).per.second;
            }
        };

        this.behavior = [
            Bh.momentum
            /*
          , Bh.thrustKeys(
                {
                  forward: ['w', 'ArrowUp']
                , back: ['s', 'ArrowDown']
                , left: ['a', 'ArrowLeft']
                , right: ['d', 'ArrowRight']
                }
              , U.pixels( 300 ).per.second.per.second
            )
            */
          , Bh.friction(  U.pixels( 100 ).per.second.per.second  )
          , Bh.speedLimited( U.pixels( 240 ).per.second )
          // bounds check for player in camera
          , Bh.bounds(G.playerPos
                    , G.playerCameraRect
                    ,
                // handle player out of camera
                function(exceed) {
                    var cam = G.state.camera;
                    // We're moving the "rect" instead of the player's
                    // exceeded position, so subtract, not add:
                    cam.x = cam.x.sub(exceed.x);
                    cam.y = cam.y.sub(exceed.y);
                }
            )
          // bounds check for camera in gameplay area
           , boundsCheck // (defined above)
        ];
    };
    G.Camera.prototype = MG.spritePrototype;

    // Behaviors
    var GBh = G.behavior = {};

    // (not a behavior, util function for fadeSpriteFrames)
    function getNextSprite() {
        var len = G.art[this.spriteFrames].length;
        if (false && !this.randomSpriteFrames)
            return (this.curSprite + 1) % len;
        else {
            var ret = this.shuffledFrames.shift();
            if (this.shuffledFrames.length == 0)
                shuffleFrames.call(this);
            return ret;
        }
    }

    // (not a behavior, util function for fadeSpriteFrames)
    function shuffleFrames() {
        var list = [];
        try{
        for (var i=0; i < G.art[this.spriteFrames].length;  ++i) {
            list.push(i);
        }
        } catch (e) { debugger; }
        // shuffle
        this.shuffledFrames = [];
        while (list.length > 0) {
            this.shuffledFrames.push(
                list.splice(
                    Math.floor( Math.random() * list.length ),
                    1
                )[0]
            );
        }
    }
    
    // Requires: 
    //           fadeRate
    // Optional: randomSpriteFrames
    GBh.fadeSpriteFrames = function(delta) {
        // init
        if (!('fadeAmt' in this)) {
            this.fadeAmt = U.units( 0 ).relax();
            var nums

            shuffleFrames.call(this);
            this.curSprite = getNextSprite.call(this);
            this.nextSprite = getNextSprite.call(this);
        }
        this.fadeAmt = this.fadeAmt.add( this.fadeRate.mul(delta) ).relax();
        if (this.fadeAmt > 1) {
            this.fadeAmt = U.units( 0 ).relax();
            this.curSprite = this.nextSprite;
            this.nextSprite = getNextSprite.call(this);
        }
    };

    // Requires: revolveTime
    //           hRadius
    //           vRadius
    GBh.pace = function(delta) {
        var revolveRate = this.revolveTime.inverse;
        var rad = revolveRate.mul( G.gm.timeElapsed ) * Math.PI*2;
        this.x = this.cX.add(this.hRadius.mul( Math.sin(rad) ));
        this.y = this.cY.add(this.vRadius.mul( Math.cos(rad) ));
    };

    GBh.particleFade = function(delta) {
    };

    // rotateKeys and thrustKeys have too much in common. Farm
    // it out (probably mostly into MajicKeys?)
    GBh.selectKey = function(keys) {
        var mk = new MajicKeys;
        var select;
        function handler() {
            select = true;
        }
        mk.onDown(keys, handler);
        var playing;
        function donePlaying() {
            playing = false;
        }
        function play(s) {
            var inst = createjs.Sound.play(s);
            playing = true;
            inst.on('complete', donePlaying);
        }
        var retval = function(delta) {
            if (select) {
                select = false;
                if (playing) return;
                this.selected = (this.selected + 1) % this.devices.length;
                play(this.devices[this.selected].sound);
            }
        };
        retval.destroy = mk.destroy.bind(mk);
        return retval;
    };

    function getSpawnerForType(badClass) {
        var spawners = this.spawners;
        var okay = [];
        for (var i=0; i != spawners.length; ++i) {
            var s = spawners[i];
            if (s.handles(badClass)) {
                okay.push(s);
            }
        }
        return okay[ Math.floor( Math.random() * okay.length ) ];
    }
    GBh.spawning = function(delta) {
        if (this.length < this.max) {
            if (this.deathTime === undefined) {
                this.deathTime = G.game.timeElapsed;
            }
            if (G.game.timeElapsed
                    .sub( this.deathTime )
                    .sub( this.spawnWait ).as( U.seconds )
                > 0) {
                // Spawn a baddie;
                var badClass = this.pool.pop();
                var spawner = getSpawnerForType.call(this, badClass);
                var baddie = new badClass({x: spawner.x, y: spawner.y});
                var self = (this.spriteCollection = this.spriteCollection || []);
                baddie.onDie(function(b) {
                    for (var i=0; i != self.length; ++i) {
                        if (self[i] === b) {
                            self.splice(i, 1);
                        }
                    }
                });
                this.spriteCollection.push(baddie);
            }
        }
    };
})();
