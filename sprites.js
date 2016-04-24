"use strict";
(function(){
    var G = (window.FireGame = window.FireGame || {});
    var sprites = G.sprites = {};

    var MG = MajicGame;
    var U = MajicUnits;
    var Bh = MG.behavior;

    sprites.Background = MG.makeSpriteClass({
        draw: G.art.drawBackground
    });

    sprites.Magnesium = MG.makeSpriteClass({
        x: 600
      , y: 500
      , revolveRate: U.radians( 2 * Math.PI ).div( U.seconds( 8 ) )
      , hRad: U.pixels( 200 )
      , vRad: U.pixels( 50 )
      , draw: G.art.drawMagnesium
      , fadeRate: U.units( 20 ).per.second
      , getNextSprite: function(avoid) {
            var mags = G.art.magnesia.length;
            return (avoid + 1) % mags;
            // Avoid the same sprite
            var ret = Math.floor( Math.random() * (mags-1) );
            if (ret >= avoid) ++ret;
            return ret;
        }
      , initSprite: function(x, y) {
            this.cX = this.x = x;
            this.cY = this.y = y;
            var mags = G.art.magnesia.length;
            this.curSprite = Math.floor( Math.random() * mags );
            this.nextSprite = this.getNextSprite(this.curSprite);
            this.fadeAmt = U.units( 0 ).relax();

            this.behavior.push( this.doFade );
            this.behavior.push( this.pace );
        }
      , doFade: function(delta) {
            this.fadeAmt = this.fadeAmt.add( this.fadeRate.mul(delta) ).relax();
            if (this.fadeAmt > 1) {
                this.fadeAmt = U.units( 0 ).relax();
                this.curSprite = this.nextSprite;
                this.nextSprite = this.getNextSprite(this.curSprite);
            }
        }
      , pace: function(delta) {
          var rad = this.revolveRate.mul( G.gm.timeElapsed ).as( U.radians );
          this.x = this.cX.add(this.hRad.mul( Math.sin(rad) ));
          this.y = this.cY.add(this.vRad.mul( Math.cos(rad) ));
        }
      , behavior: [
            // Added by initSprite fn:
            //      doFade
            //      pace
        ]
    });

    sprites.Player = MG.makeSpriteClass({
        height: 65
      , width: 50
      , draw: G.art.drawPlayer
      , behavior: [
            Bh.momentum
          , Bh.thrustKeys(
                {
                  forward: ['w', 'ArrowUp']
                , back: ['s', 'ArrowDown']
                , left: ['a', 'ArrowLeft']
                , right: ['d', 'ArrowRight']
                }
              , U.pixels( 300 ).per.second.per.second
            )
          , Bh.friction(  U.pixels( 100 ).per.second.per.second  )
          , Bh.speedLimited( U.pixels( 240 ).per.second )
        ]
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
    });
})();
