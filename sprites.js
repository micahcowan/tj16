"use strict";
(function(){
    var G = (window.FireGame = window.FireGame || {});
    var sprites = G.sprites = {};

    var MG = MajicGame;
    var U = MajicUnits;

    sprites.Background = MG.makeSpriteClass({
        draw: G.art.drawBackground
    });

    sprites.Magnesium = MG.makeSpriteClass({
        x: 600
      , y: 500
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
      , initSprite: function() {
            var mags = G.art.magnesia.length;
            this.curSprite = Math.floor( Math.random() * mags );
            this.nextSprite = this.getNextSprite(this.curSprite);
            this.fadeAmt = U.units( 0 ).relax();

            this.behavior.push( this.doFade );
        }
      , doFade: function(delta) {
            this.fadeAmt = this.fadeAmt.add( this.fadeRate.mul(delta) ).relax();
            if (this.fadeAmt > 1) {
                this.fadeAmt = U.units( 0 ).relax();
                this.curSprite = this.nextSprite;
                this.nextSprite = this.getNextSprite(this.curSprite);
            }
        }
      , behavior: [
            // this.doFade (added by initSprite fn)
        ]
    });
})();
