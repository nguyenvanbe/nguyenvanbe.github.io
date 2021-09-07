window.fcStorage = {};

function gameMenu(e) {
    if (e.key == "ArrowDown" || e.key == "ArrowRight") {
        $(".move:focus").next().focus();
    }
    if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
        $(".move:focus").prev().focus();
    }
    if (!$(':focus').length) {
        // console.log("No focus set, now focusing back")
        $("#char-images img")[0].focus();
    }
    if( (e.key == "Enter" || e.key == "SoftRight") && $(':focus').length){
        charSelect($(':focus')[0]);
    }
}

function initGamelayout() {
	
    var characterList = ["angrybird", "bigfish", "lion", "cat", "snake", "chameleon", "tiger", "fox", "eagle"];
	
    characterList.forEach(e => {
        $("#char-images").append('<img class="move hunter" tabindex="0" data-image="' + e + '" src="img/' + e + '.png">');
    })
    $("#char-images").append(
        '<div class="game-over">'+
        '<span>Game over!</span><br>'+
        'Score: <span id=game-score>0</span><br>'+
        'Top Score: <span id=game-topscore>0</span>'+
        '</div>'
        );
    $(".game-over").hide();
    document.addEventListener("keydown", gameMenu);
    $("#hunter-prey").fadeOut('slow');
    mainChain(); // start the game in baground;
}

function showGameLayout(score){
    $("#hunter-prey").fadeOut('slow');
    $("#gamemenu").fadeIn('slow');
    $(".game-over").fadeIn('slow');
    $("#game-score").html(score);
    $("#game-topscore").html(window.topScore);
    document.addEventListener("keydown", gameMenu);
}

function afterCharSelect() {
    $("#gamemenu").fadeOut('slow');
    window.inithunter(true);
    $("#hunter-prey").fadeIn('slow');
    document.removeEventListener("keydown", gameMenu);
}

function charSelect(element) {
    fcStorage.hunter = element.getAttribute("data-image");
    console.log("You're playing with: ", fcStorage.hunter);
    afterCharSelect();
}

initGamelayout();