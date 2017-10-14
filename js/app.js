$(function () {
  /*
  * Create a list that holds all of your cards
  */
  let cardsIcons = ['heart-o', 'hashtag', 'gift', 'legal', 'navicon', 'futbol-o', 'life-ring', 'folder'];
  let cards = []; // Cards deck
  let clickList = []; // List of clicked cards
  let moves = 1; // Moves made
  let starsCounter = 1; // Count stars
  let matchedCards = 0; // How many cards matched
  let currentPlayer = ''; // Current player name
  let twoClicks = false; // Check if there was done two clicks
  let timer; // The timer variable
  let playerStars = 3; // Player stars number

  // Copy two times the same value of an array into another array
  let fillArrayTwoTimes = (target, source) => {
    for (index of source) {
      target.push(index);
      target.push(index);
    }
  };

  // Shuffle function from http://stackoverflow.com/a/2450976
  let shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  // Create the HTML block for the card
  let createCardHTML = (card) => {
    $('.deck').empty();
    let content = '';

    // Loop each card to create the HTML block
    for (card of cards) {
      content += '<li class="card"><i class="fa fa-' + card + '"></i></li>';
    };

    $('.deck').append(content);
  };

  // Display or close the card
  let toggleOpen = (card) => {
    // Get the index of the clikced card
    let index = $('.deck').children().index(card);

    // Add to the ID to click list
    clickList.push(index);

    // Toggle the card
    $(card).toggleClass('open show');
  };

  // Open and lock the card in position
  let toggleMatch = (cardID) => {
    // Add match class
    let card = $('.deck').children().eq(cardID);
    let cardWidth = card.width();
    let animWidthIn = cardWidth * 0.9;
    let animMarginIn = cardWidth * 0.1 / 2;

    // Shrink match animation
    let animMatchIn = {
      width: animWidthIn,
      height: animWidthIn,
      margin: animMarginIn,
    };

    // Stretch match atnimation
    let animMathcOut = {
      width: cardWidth,
      height: cardWidth,
      margin: 0,
    };

    // Card set properties
    card.attr('class', 'card match');
    card.animate(animMatchIn, 300);
    card.animate(animMathcOut, 300);
  };
  // Check match cards
  let matchCard = () => {
    // Set local vars
    let cardID1 = clickList[0];
    let cardID2 = clickList[1];
    let card1 = cards[cardID1];
    let card2 = cards[cardID2];

    // Check if id of card are different and type of cards are the same
    if (cardID1 != cardID2 && card1 === card2) {
      // Open clicked cards
      toggleMatch(cardID1);
      toggleMatch(cardID2);

      matchedCards++;

    } else {
      // Close cards
      toggleOpen('li.open');
    }

    clickList = [];

    // Increment moves
    calcScore();

    // Check for end game event
    if (matchedCards === 8) {
      stopTimer();
      gameEndPanel();
    }

    twoClicks = false;
  };

  // Add score
  let calcScore = () => {
    $('.moves').text(moves++);
    starsCounter++;

    // Condition for star removing
    if (starsCounter > 10 && playerStars > 1) {
      $('.fa-star').last().toggleClass('fa-star fa-star-o');
      starsCounter = 1;
      playerStars--;
    }
  };

  // Reset stars
  let resetStars = () => {
    $('.stars li').children().each(function (id) {
      let star = $(this).hasClass('fa-star-o');
      if (star) {
        $(this).toggleClass('fa-star-o');
        $(this).toggleClass('fa-star');
      }
    });
  };

  // Reset moves
  let resetMovesText = () => {
    $('.moves').text('0');
  };

  // Mobile style
  let setMobileContainer = () => {
    let bodyWidth = $('body').width();
    let deckWidth = $('.deck').outerWidth();
    let deckPadding = parseInt($('.deck').css('padding'));
    let cardDim = (bodyWidth - (deckPadding * 2) - 8) / 4;
    if (bodyWidth <= deckWidth) {
      // Create score panel style
      let scorePanelStyle = { width: '80%' };

      // Create deck
      let deckStyle = { width: bodyWidth,
                        'min-height': bodyWidth };
      let cardStyle = { width: cardDim,
                        height: cardDim };
      // Change styles
      $('.score-panel').css(scorePanelStyle);
      $('.deck').css(deckStyle);
      $('li.card').css(cardStyle);
    }
  };

  // Game end panel
  let gameEndPanel = () => {

    let endText = 'Winner Winner Chicken Dinner!';
    $('.deck').empty();
    $('<div/>').attr('class', 'endGame').appendTo('.deck');
    $('<h2/>').text(endText).appendTo('.endGame');
    $('.stars').clone().appendTo('.endGame')
    $('<p/>').text('You have made: ' + (moves - 1) + ' moves').appendTo('.endGame');
    $('<p/>').text('Game ended in: ' + $('.timer').text()).appendTo('.endGame');
    $('<p/>').text('Please enter you name for leaderboard:').appendTo('.endGame');
    $('<input/>').attr({
      type: 'text',
      id: 'nameInput'
    }).appendTo('.endGame');
    $('<div/>').attr({
      'id': 'recordScoreBtn',
      'role': 'button'
    }).text('submit').appendTo('.endGame');
    $('#recordScoreBtn').on('click', function () {
      playerPoints();
      laderPanel();
    });
  };

  // Calculcate players points
  let playerPoints = () => {
    // Create local name registration
    // Use a prefix to separate from other local storage data
    currentPlayer = $('#nameInput').val();
    let getName = 'name:' + currentPlayer;
    let time = $('.timer').text();
    time = time.replace(" ", "").replace(/d|h|m|s/g, "");
    time = 1 / (parseInt(time) / playerStars);
    moves = 1 / (moves - 1);
    let getScore = Math.floor((moves + time) * 1000;);
    localStorage.setItem(getName, getScore);
  };

  // Leaderboard panel
  let laderPanel = () => {
    $('.endGame').empty();
    $('<h2/>').text('Top 5 players:').appendTo('.endGame');

    // Add the top five list
    topFiveList();

    // Add restart button a the end
    $('.restart').clone().appendTo('.endGame');
  };

  let topFiveList = () => {
    // Populate new array with data from local storage
    let localScoreArray = [];
    for (let i in localStorage) {
      let playerName = i.split(':');
      let playerData = { name: playerName[1], score: localStorage[i] };
      localScoreArray.push(playerData);
    }

    // Sort localScoreArray from smaller to bigger
    localScoreArray.sort(function (a,b) { return b.score - a.score });

    // Check if the player is in top five
    let playerNotInTop = true;
    let length;
    localScoreArray.length < 5 ? length = localScoreArray.length : length = 5;

    for (i = 0; i < localScoreArray.length; i++) {
      let newScore = $('<p/>').text((i + 1) + '. ' + localScoreArray[i].name + ' : ' + localScoreArray[i].score);
      // Create the top five list
      if (i < 5) {
        if (localScoreArray[i].name === currentPlayer) {
          newScore.css('font-weight', 'bold').appendTo('.endGame');
        }
        else {
          newScore.appendTo('.endGame');
        }
      } else {
        // Add player to the bottom of the list if not in top five
        if (localScoreArray[i].name === currentPlayer) {
          $('<br>').appendTo('.endGame');
          newScore.css('font-weight', 'bold').appendTo('.endGame');
        }
      }
    }
  };

  // Start timer function
  // source: https://www.w3schools.com/howto/howto_js_countdown.asp
  let startTimer = () => {
    // Get todays date and time
    let now = new Date().getTime();

    // Find the distance between now an the count down date
    let distance = now - timerDate;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id='demo'
    if (days > 0)
      $('.timer').text(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ');
    else if (hours > 0)
      $('.timer').text(hours + 'h ' + minutes + 'm ' + seconds + 's ');
    else if (minutes > 0)
      $('.timer').text(minutes + 'm ' + seconds + 's ');
    else
      $('.timer').text(seconds + 's ');
  };

  // Stop timer function
  let stopTimer = () => {
    clearInterval(timer);
  };

  // Restart game function
  $('.container').on('click', '.restart', function () {
    // Reset variables
    cards = [];
    clickList = [];
    moves = 1;
    starsCounter = 1;
    matchedCards = 0;

    // Start main functions
    resetStars();
    resetMovesText();
    startNewGame();
    setMobileContainer();
  });

  // Cards click function
  $('.deck').on('click', '.card', function () {
    // Open the card
    let match = $(this).hasClass('match');
    let open = $(this).hasClass('open');

    if (!open && !match && !twoClicks) {
      toggleOpen(this);
    }

    // Check if ther is another card in click list
    if (clickList.length > 1) {
      // Check if the two cards match
      twoClicks = true;
      window.setTimeout(function () {
        matchCard();
      }, 700);
    }
  });

  // Start game function
  let startNewGame = () => {
    // Set starting values
    timerDate = new Date().getTime();
    timer = setInterval(function () { startTimer(); }, 1000);

    // Start main functions
    fillArrayTwoTimes(cards, cardsIcons);
    shuffle(cards);
    createCardHTML(cards);
    setMobileContainer();
  };

  startNewGame();
});
