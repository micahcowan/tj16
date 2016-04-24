"use strict";

addEventListener('load', function(){
    var G = (window.FireGame = window.FireGame || {});
    var MG = G.gm = G.game = new MajicGame(document.getElementById('game'));
    var U = MajicUnits;
    G.soundPlayer = function(name) {
        return createjs.Sound.play.bind(createjs.Sound, name);
    }
    var Sp = G.sprites;

    var sounds = [
        'bullet'
      , 'drychem'
      , 'drypowder'
      , 'fwoosh'
      , 'waterfoam'
    ];
    for (var i=0; i != sounds.length; ++i) {
        var s = sounds[i];
        createjs.Sound.registerSound('sounds/' + s + '.mp3', s);
    }

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
        S.player = new Sp.Player({x: S.center.x, y: S.center.y});
        S.selector = new Sp.DeviceSelector;
        MG.resetSprites(
            S.camera
          , S.background
            // Magnesium:
          , new Sp.Floater({
                x: S.center.x
              , y: S.center.y
              , spriteFrames: G.art.magnesia
              , fadeRate: U.units( 15 ).per.second
              //, scale: 0.5
            })
            // Infantry:
          , new Sp.Floater({
                x: S.center.x.add( U.pixels( 100 ) )
              , y: S.center.y.add( U.pixels( 200 ) )
              , revolveTime: U.seconds(15)
              , spriteFrames: G.art.infantry
              , fadeRate: U.units( 10 ).per.second
              //, scale: 0.12
              , hRadius: U.pixels( 50 )
              , randomSpriteFrames: false
            })
            // Sparky
          , new Sp.Floater({
                x: S.center.x.sub( U.pixels( 100 ) )
              , y: S.center.y.add( U.pixels( 200 ) )
              , revolveTime: U.seconds(30)
              , fadeRate: U.units( 10 ).per.second
              , spriteFrames: G.art.sparky
              //, scale: 0.12
              , hRadius: U.pixels( 50 )
              , randomSpriteFrames: false
            })
          , S.player
          , S.selector
        );
    }

    var queue = G.queue = new createjs.LoadQueue();
    queue.on('complete', function() { newGame(); MG.start(); });
    //queue.on('fileerror', function(e){  console.log("error: " + e.toString()); debugger; })
    G.art.load(queue);
})
