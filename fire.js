"use strict";

addEventListener('load', function(){
    var G = (window.FireGame = window.FireGame || {});
    var MG = G.gm = G.game = new MajicGame(document.getElementById('game'));
    var U = MajicUnits;
    G.soundPlayer = function(name) {
        return createjs.Sound.play.bind(createjs.Sound, name);
    }
    var Sp = G.sprites;

    function newGame() {
        var S = G.state = { };
        S.area = {
            w: U.pixels( 1200 ).relax()
          , h: U.pixels( 1000 ).relax()
        };
        S.center = {
            x: S.area.w.div(2).relax()
          , y: S.area.h.div(2).relax()
        };
        S.camera = new G.Camera(S.center.x, S.center.y);
        S.background = new Sp.Background;
        MG.resetSprites(
            S.camera
          , S.background
          , new Sp.Magnesium(S.center.x, S.center.y)
        );
    }

    var queue = G.queue = new createjs.LoadQueue();
    queue.on('complete', function() { newGame(); MG.start(); });
    G.art.load(queue);
})
