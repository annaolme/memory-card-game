var emojis = ['🐶', '🐱', '🐸', '🦊', '🐻', '🐼', '🦁', '🐨'];
var cards = [];
var flippedCards = [];
var matchedPairs = 0;
var moves = 0;
var timerInterval = null;
var seconds = 0;
var gameStarted = false;

function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
}

function createBoard() {
    var pairs = emojis.concat(emojis);
    cards = shuffle(pairs);
    var grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (var i = 0; i < cards.length; i++) {
        var card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-index', i);
        card.addEventListener('click', function() { flipCard(this); });
        grid.appendChild(card);
    }
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    document.getElementById('win-screen').style.display = 'none';
    if (timerInterval) clearInterval(timerInterval);
}

function flipCard(el) {
    var idx = parseInt(el.getAttribute('data-index'));
    if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(function() {
            seconds++;
            var m = Math.floor(seconds / 60);
            var s = seconds % 60;
            document.getElementById('time').textContent = m + ':' + (s < 10 ? '0' : '') + s;
        }, 1000);
    }

    el.classList.add('flipped');
    el.textContent = cards[idx];
    flippedCards.push({ el: el, idx: idx });

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        if (cards[flippedCards[0].idx] === cards[flippedCards[1].idx]) {
            flippedCards[0].el.classList.add('matched');
            flippedCards[1].el.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            if (matchedPairs === emojis.length) {
                clearInterval(timerInterval);
                setTimeout(showWin, 500);
            }
        } else {
            var f = flippedCards;
            setTimeout(function() {
                f[0].el.classList.remove('flipped');
                f[0].el.textContent = '';
                f[1].el.classList.remove('flipped');
                f[1].el.textContent = '';
            }, 1000);
            flippedCards = [];
        }
    }
}

function showWin() {
    document.getElementById('win-screen').style.display = 'block';
    document.getElementById('final-moves').textContent = moves;
    document.getElementById('final-time').textContent = document.getElementById('time').textContent;
}

createBoard();
