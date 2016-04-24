"use strict";
(function(){
    var G = (window.FireGame = window.FireGame || {});
    var sprites = G.sprites = {};

    var MG = MajicGame;
    var U = MajicUnits;
    var Bh = MG.behavior;
    var GBh = G.behavior;

    sprites.Background = MG.makeSpriteClass({
        draw: G.art.drawBackground
    });

    var aR = G.areaRect;

    sprites.Floater = MG.makeSpriteClass({
        x: U.pixels( 600 ).relax()
      , y: U.pixels( 500 ).relax()
      , speed: U.pixels( 100 ).per.second
      , draw: G.art.drawFloater
      , fadeRate: U.units( 20 ).per.second
      , initSprite: function(obj) {
            this.mergeData(obj);
            this.cX = this.x;
            this.cY = this.y;
        }
      , spawn: function() {
            // Point at player
            var p = G.state.player;
            var rot = Math.atan2(p.x - this.x, p.y - this.y);
            this.h = this.speed.mul( Math.sin(rot) );
            this.v = this.speed.mul( Math.cos(rot) );
        }
      , onDie: function(handler) {
            this.deathListeners = this.deathListeners || [];
            this.deathListeners.push(handler);
        }
      , behavior: [
            GBh.fadeSpriteFrames
          //, GBh.pace
          , Bh.momentum
          , Bh.bouncingBounds(aR)
        ]
    });

    sprites.Magnesium = MG.makeSpriteClass({
        spriteFrames: 'magnesia'
      , fadeRate: U.units( 15 ).per.second
    }, sprites.Floater);

    sprites.Infantry = MG.makeSpriteClass({
        spriteFrames: 'infantry'
      , fadeRate: U.units( 10 ).per.second
    }, sprites.Floater);

    sprites.GreaseFire = MG.makeSpriteClass({
        spriteFrames: 'sparky'
      , fadeRate: U.units( 10 ).per.second
    }, sprites.Floater);

    sprites.Player = MG.makeSpriteClass({
        height: 80
      , width: 80
      , draw: G.art.drawPlayer
      , scale: 80/96
      , initSprite: function(config) {
            this.mergeData(config);
            var bounds = {
                t: U.pixels( this.height/2 ).relax()
              , l: U.pixels( this.width/2 ).relax()
              , b: U.pixels( G.state.area.h - this.height/2 ).relax()
              , r: U.pixels( G.state.area.w - this.width/2 ).relax()
            };
            this.behavior.push( Bh.boundsStop(bounds) );
        }
      , behavior: [
            Bh.momentum
          , Bh.thrustKeys(
                {
                  forward: ['w', 'ArrowUp']
                , back: ['s', 'ArrowDown']
                , left: ['a', 'ArrowLeft']
                , right: ['d', 'ArrowRight']
                }
              , U.pixels( 1200 ).per.second.per.second
            )
          , Bh.friction(  U.pixels( 440 ).per.second.per.second  )
          , Bh.speedLimited( U.pixels( 260 ).per.second )
        ]
    });

    sprites.Particle = MG.makeSpriteClass({
        size: U.pixels(15)
      , speed: U.pixels( 500 ).per.second
      , color: 'blue'
      , startFade: U.seconds(1)
      , fadeTime: U.seconds(0.2)
      , initSprite: function(fromPos, atPos) {
            var x1 = fromPos.x.as( U.pixels );
            var y1 = fromPos.y.as( U.pixels );
            var x2 = atPos.x.as( U.pixels );
            var y2 = atPos.y.as( U.pixels );
            var rot = Math.atan2(x2-x1, y2-y1);
            this.h = this.speed.mul( Math.cos(rot) );
            this.v = this.speed.mul( Math.sin(rot) );
            this.x = x1;
            this.y = y1;

            this.started = G.gm.timeElapsed;
        }
      , behavior: [
            Bh.momentum
          , GBh.particleFade
        ]
    });

    sprites.DeviceSelector = MG.makeSpriteClass({
        draw: G.art.drawSelector
      , deviceSize: U.pixels( 60 )
      , devices: [
            {tag: 'dev:water', color: 'green', sound: 'waterfoam'}
          , {tag: 'dev:powder', color: 'white', sound: 'drypowder'}
          , {tag: 'dev:chem', color: 'blue', sound: 'drychem'}
        ]
      , selected: 0
      , behavior: [
            GBh.selectKey('Tab')
        ]
    });

    sprites.Spawner = MG.makeSpriteClass({
        draw: G.art.drawSpawner
      , handles: function(classIn) {
            return (classIn == this.spawnClass);
        }
    });

    sprites.SpawnPoints = MG.makeSpriteClass({
        draw: G.art.drawSpawnPoints
      , spawners: [
            // Infantry
            new sprites.Spawner({
                x: U.pixels( 300 ).relax()
              , y: U.pixels( 500 ).relax()
              , spawnClass: sprites.Infantry
              //, gfx: 'lab'
              //, scale: 0.4
            })
            // GreaseFire
          , new sprites.Spawner({
                x: U.pixels( 600 ).relax()
              , y: U.pixels( 700 ).relax()
              , spawnClass: sprites.GreaseFire
              , gfx: 'kitchen'
              , scale: 0.4
            })
            // Magnesium
          , new sprites.Spawner({
                x: U.pixels( 850 ).relax()
              , y: U.pixels( 300 ).relax()
              , spawnClass: sprites.Magnesium
              , gfx: 'lab'
              , scale: 0.4
            })
        ]
      , behavior: [
            GBh.spawning
        ]
      , initSprite(obj) {
            this.mergeData(obj);

            var mk = new MajicKeys;
            mk.onDown('\b', handler);
            var self = this;
            function handler() {
                if (self.spriteCollection && self.spriteCollection.length != 0) {
                    self.spriteCollection.shift();
                }
            }
        }
    });
})();
