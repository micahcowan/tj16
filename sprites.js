"use strict";
(function(){
    var G = (window.FireGame = window.FireGame || {});
    var sprites = G.sprites = {};

    var MG = MajicGame;

    sprites.Background = MG.makeSpriteClass({
        draw: G.art.drawBackground
    });
})();
