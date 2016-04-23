"use strict";

addEventListener('load', function(){
    var G = (window.FireGame = window.FireGame || {});
    var MG = G.mg = new MajicGame(document.getElementById('game'));
    G.soundPlayer = function(name) {
        return createjs.Sound.play.bind(createjs.Sound, name);
    }
    var Sp = G.sprites;

    function newGame() {
        var S = G.state = {};
        S.background = new Sp.Background;
        MG.resetSprites(
            S.background
        );
    }

    var queue = G.queue = new createjs.LoadQueue();
    queue.on('complete', newGame);
    G.art.load(queue);

    MG.start();
})
