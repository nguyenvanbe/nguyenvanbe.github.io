/* Phaser.IO game example */

var mainChain = function() {

    /* JIO SDK 2.0 integration */
    var jioConf = { "autoControl": ["volume", "exit"], "gameName": "foodchain", "gameVersion": "1.0.1" };
    window.jioSDK = new Jiogames(jioConf);
    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(e) {
        switch (e.key) {
            case "0":
                if (game.paused) {
                    console.log("gameResumed");
                    banner.setText("");
                    music && music.play();
                    game && game.gameResumed();
                } else {
                    console.log("gamePaused");
                    banner.setText("Game paused");
                    music && music.pause();
                    game && game.gamePaused();
                }
                break;
            default:
                break;
        }
    }
    /* JIO ads related code */
    window.cacheAds = function() {
        VMAX.jioSDK_adId = "foodchain"; // <ins ads id in index.html
        VMAX.jioSDK_adReady = false;
        console.log("calling cache Jio Ad")
        VMAX.cacheAd(VMAX.jioSDK_adId);
        VMAX.onAdReady = function(AdPlacementId) {
            VMAX.jioSDK_adReady = true;
            console.log("VMAX: onAdReady");
        }
        VMAX.onAdError = function(AdPlacementId, errorCode) {
            console.log("VMAX: onAdError: ", errorCode);
            VMAX.jioSDK_adReady = false;
        }
        VMAX.onAdClose = function(AdPlacementId) {
            console.log("onAdClose");
            setTimeout(function() {
                console.log("VMAX: onAdClose");
                cacheAds(); // call cache on every ad close and get prepared for next ad
            }, 3000);
        }
    }

    window.showAds = function() { // use this showAds func in your game levels/game over or maintain your ad frequency when to show ads
		console.log("call window.showAds");
        if(VMAX.jioSDK_adReady){
            VMAX.showAd(VMAX.jioSDK_adId);
            console.log("showing ads on id: ", VMAX.jioSDK_adId);
        }
    }
	
	setTimeout(() => {
        cacheAds(); // cache once on page load
    }, 3000);
    // cacheAds(); // cache once on page load

    /* JIO SDK integration ends */

    var head, cursors, music, hunter, gameText, playerDirection;
    window.tail = null, window.prey = null; window.canLoop=false;
    var directions = Object.freeze({ up: 0, down: 1, right: 2, left: 3 });
    /* hack to get post and exit working in browser, !!! Game developers don't need to include this!!! */
    !/kaios/i.test(navigator.userAgent) && (jioSDK.iframeHost = window.location.origin);

    var canvasWidth = 256,
        canvasHeight = 320,
        banner;
    var playerSize = 32;
    var x = 32,
        y = 0;
    var frameCounter = 0;
    var gameSpeed = 20;
    var score = 0;

    var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, 'hunter-prey', { preload: preload, create: create, update: update });
    window.mygame = game;
    /* random play */
    var hunterList = ["angrybird", "bigfish", "lion", "cat", "snake", "chameleon", "tiger", "fox", "eagle"];
    // var hunterList = ["angrybird"];
    // var preyList = ["cock"];
    var preyList = ["zoo1", "foxbat", "rat", "cock", "chick", "parrot", "monkey", "hummingbird", "crane", "frog", "goat", "squirrel", "squirrel2", "bird", "insect", "fly", "fly2", "butterfly", "duck", "bug", "fish", "bunny", "deer"];
    /* set one hunter till games ends */
    var initialHunter;
    var unusedPrey = [].concat(preyList);
    var unusedHunter = [].concat(hunterList);
    var lastusedPrey;
    var lastusedHunter;
    var whoinChain = "hunter";

    function setHunter() {
        if (fcStorage.hunter) {
            initialHunter = fcStorage.hunter;
            return;
        }
        var randomPick = hunterList[Math.floor(Math.random() * hunterList.length)];
        initialHunter = randomPick;
        var index = hunterList.indexOf(randomPick);
        hunterList.splice(index, 1);
        if (!hunterList.length) {
            hunterList = [].concat(unusedHunter);
            console.log("refilling hunterList");
        }
    }
    setHunter();

    function getPrey() {
        var randomPick = preyList[Math.floor(Math.random() * preyList.length)];
        var index = preyList.indexOf(randomPick);
        preyList.splice(index, 1);
        if (!preyList.length) {
            preyList = [].concat(unusedPrey);
            console.log("refilling preyList");
        }
        lastusedPrey = randomPick;
        return randomPick;
    }

    function preload() {
        game.load.crossOrigin = 'anonymous';
        game.stage.backgroundColor = '#1B2631';
        game.load.onLoadStart.add(onLoadStart, this);
        game.load.onLoadComplete.add(onLoadComplete, this);
        game.load.audio('fsound', 'sound/forest.mp3');
        game.load.image('house', 'img/house.png');

        game.load.image('cat', 'img/cat.png');
        game.load.image('snake', 'img/snake.png');
        game.load.image('chameleon', 'img/chameleon.png');
        game.load.image('fox', 'img/fox.png');
        game.load.image('tiger', 'img/tiger.png');
        game.load.image('eagle', 'img/eagle.png');
        game.load.image('bigfish', 'img/bigfish.png');
        game.load.image('lion', 'img/lion.png');
        game.load.image('angrybird', 'img/angrybird.png');

        game.load.image('deer', 'img/deer.png');
        game.load.image('chick', 'img/chick.png');
        game.load.image('crane', 'img/crane.png');
        game.load.image('monkey', 'img/monkey.png');
        game.load.image('hummingbird', 'img/hummingbird.png');
        game.load.image('goat', 'img/goat.png');
        game.load.image('frog', 'img/frog.png');
        game.load.image('squirrel', 'img/squirrel.png');
        game.load.image('squirrel2', 'img/squirrel2.png');
        game.load.image('fish', 'img/fish.png');
        game.load.image('bunny', 'img/bunny.png');
        game.load.image('insect', 'img/insect.png');
        game.load.image('bird', 'img/bird.png');
        game.load.image('duck', 'img/duck.png');
        game.load.image('butterfly', 'img/butterfly.png');
        game.load.image('fly', 'img/fly.png');
        game.load.image('fly2', 'img/fly2.png');
        game.load.image('bug', 'img/bug.png');
        game.load.image('parrot', 'img/parrot.png');
        game.load.image('zoo1', 'img/zoo1.png');
        game.load.image('cock', 'img/cock.png');
        game.load.image('rat', 'img/rat.png');
        game.load.image('foxbat', 'img/foxbat.png');

    }
    // window.createUpdate = function(){
    //     game.state.add('mystate', {create:create, update: update});
    //     game.state.start('mystate');
    // }

    function create() {
        gameText = game.add.text((game.width - 32), 0, "0", {
            font: "10px Arial",
            fill: "white"
        });
        gameText.anchor.setTo(1, 0);

        banner = game.add.text(game.world.centerX, game.world.centerY, "Arrow keys to start!\n", {
            font: "15px Arial",
            fill: "white",
            align: "center"
        });
        banner.anchor.setTo(0.5, 0.5);
        setTimeout(e => {
            banner.setText("");
        }, 3000)

        // inithunter();
        // placeRandomprey();

        /* play audio */
        music = game.add.audio('fsound');
        window.music = music;
        music.loop = true;
        music.play();
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        if(!canLoop){
            return;
        }
        gameText.text = score;
        updateDirection();
        frameCounter++;
        if (frameCounter == gameSpeed) {
            movePlayer();
            if (playerCollidesWithSelf()) {
                /* JIO SDK post top score */
                (topScore < score) && (topScore = score) && jioSDK.postScore(score);
                game.gamePaused();
                console.log("game over, gamePaused");
                navigator.vibrate && navigator.vibrate([100, 200, 300]);
                window.canLoop = false;
                setTimeout((score) => {
                    // game.gameResumed();
                    showGameLayout(score);
                    showAds();
                }, 2000, score);
                // deletehunter();
                // inithunter();
                score = 0;
                gameSpeed = 20;
                playerDirection = undefined;
                x = 32;
                y = 0;
                gameText.text = "";
            }
            if (preyCollidesWithHunter()) {
                score++;
                if (whoinChain == "hunter") {
                    // console.log("initialHunter",initialHunter);
                    lastusedHunter = initialHunter;
                    // console.log("lastusedPrey",lastusedPrey);
                    initialHunter = lastusedPrey;
                    whoinChain = "prey";
                    prey.destroy();
                    placeRandomprey("house");
                } else {
                    initialHunter = lastusedHunter;
                    whoinChain = "hunter";
                    prey.destroy();
                    placeRandomprey();
                }
                // prey.destroy();
                // placeRandomprey();
                gameSpeed--;
                if (gameSpeed <= 8) gameSpeed = 10;
            } else if (playerDirection != undefined) {
                removeTail();
            }
            frameCounter = 0;
        }
    }

    function onLoadStart() {
        console.log("onLoadStart");
    }

    function onLoadComplete() {
        console.log("onLoadComplete");
        setTimeout(function() {
            game.gamePaused();
            console.log("gamePaused ", game.paused);
        }, 1000);
    }

    window.inithunter = function(resume) {
        console.log("init hunter");
        deletehunter();
        setHunter();
        head = new Object();
        newHead(0, 0);
        tail = head;
        newHead(32, 0);
        // newHead(64, 0);
        if (resume) {
            game.gameResumed();
            !music.isPlaying && music.play();
            console.log("Resuming game");
        }else{
            game.gamePaused();
        }
        placeRandomprey();
        window.canLoop=true;
    }

    function deletehunter() {
        while (tail != null) {
            tail.image.destroy();
            tail = tail.next;
        }
        head = null;
    }

    function placeRandomprey(useThisPrey) {

        if (prey != undefined) prey.destroy();
        if (useThisPrey) {
            console.log("useThisPrey", useThisPrey);
            prey = game.add.image(0, 0, useThisPrey);;
        } else {
            prey = game.add.image(0, 0, getPrey());
        }
        do {
            var widthPoints = (canvasWidth - 32) / 32; //canvasWidth-32 is a hack
            var heightPoints = canvasHeight / 32;
            prey.position.x = Math.round(Math.random() * (widthPoints - 1)) * 32;
            prey.position.y = Math.round(Math.random() * (heightPoints - 1)) * 32;


        } while (preyCollidesWithHunter());
    }

    // linked list functions

    function newHead(x, y) {
        var newHead = new Object();
        newHead.image = game.add.image(x, y, initialHunter);
        newHead.next = null;
        head.next = newHead;
        head = newHead;
    }

    function removeTail(x, y) {
        tail.image.destroy();
        tail = tail.next;
    }

    // collision functions

    function preyCollidesWithHunter() {
        // traverse the linked list, starting at the tail
        var needle = tail;
        var collides = false;
        var numTimes = 0;
        while (needle != null) {
            numTimes++;
            // console.log("prey.position.x: ",prey.position.x,"needle.image.position.x: ",needle.image.position.x)
            // console.log("prey.position.y: ",prey.position.y,"needle.image.position.y: ",needle.image.position.y)
            if (prey.position.x == needle.image.position.x &&
                prey.position.y == needle.image.position.y) {
                collides = true;
            }
            needle = needle.next;
        }
        return collides;
    }

    function playerCollidesWithSelf() {
        // check if the head has collided with any other body part, starting at the tail
        var needle = tail;
        var collides = false;
        while (needle.next != head) {
            if (needle.image.position.x == head.image.position.x &&
                needle.image.position.y == head.image.position.y) {
                collides = true;
                whoinChain = "hunter" // reset
                // placeRandomprey();
            }
            needle = needle.next;
        }
        return collides;
    }

    // movement functions

    function updateDirection() {
        if (cursors.right.isDown && playerDirection != directions.left) {
            playerDirection = directions.right;
        }
        if (cursors.left.isDown && playerDirection != directions.right) {
            playerDirection = directions.left;
        }
        if (cursors.up.isDown && playerDirection != directions.down) {
            playerDirection = directions.up;
        }
        if (cursors.down.isDown && playerDirection != directions.up) {
            playerDirection = directions.down;
        }
    }

    function movePlayer() {
        if (playerDirection == directions.right) {
            x += playerSize;
        } else if (playerDirection == directions.left) {
            x -= playerSize;
        } else if (playerDirection == directions.up) {
            y -= playerSize;
        } else if (playerDirection == directions.down) {
            y += playerSize;
        }
        if (x <= 0 - playerSize) {
            x = game.width - playerSize;
        } else if (x >= game.width) {
            x = 0;
        } else if (y <= 0 - playerSize) {
            y = game.height - playerSize;
        } else if (y >= game.height) {
            y = 0;
        }
        if (playerDirection != undefined) {
            newHead(x, y);
        }
    }
};