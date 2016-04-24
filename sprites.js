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

    sprites.Floater = MG.makeSpriteClass({
        x: 600
      , y: 500
      , revolveTime: U.seconds( 8 )
      , hRadius: U.pixels( 200 )
      , vRadius: U.pixels( 50 )
      , draw: G.art.drawFloater
      , fadeRate: U.units( 20 ).per.second
      , initSprite: function(obj) {
            this.mergeData(obj);
            this.cX = this.x;
            this.cY = this.y;
            this.numSpriteFrames = this.spriteFrames.length;
        }
      , behavior: [
            GBh.fadeSpriteFrames
          , GBh.pace
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
              , U.pixels( 1200 ).per.second.per.second
            )
          , Bh.friction(  U.pixels( 440 ).per.second.per.second  )
          , Bh.speedLimited( U.pixels( 260 ).per.second )
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
