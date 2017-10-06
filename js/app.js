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
  let twoClicks = false;

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

  /*
  * set up the event listener for a card. If a card is clicked:
  *  - display the card's symbol (put this functionality in another function that you call from this one)
  *  - if the list already has another card, check to see if the two cards match
  *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
  *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  */

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
    $('.deck').children().eq(cardID).attr('class', 'card match');
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
    if (matchedCards === 8)
      gameEndPanel();

    twoClicks = false;
  };

  // Add score
  let calcScore = () => {
    $('.moves').text(moves++);
    starsCounter++;

    // Condition for star removing
    if (starsCounter > 10) {
      $('.fa-star').last().toggleClass('fa-star fa-star-o');
      starsCounter = 1;
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
      let scorePanelStyle = { 'width': '80%' };

      // Create deck
      let deckStyle = { 'width': bodyWidth,
                        'min-height': bodyWidth };
      let cardStyle = { 'width': cardDim,
                        'height': cardDim };
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
    $('<p/>').text('You have made: ' + (moves - 1) + ' moves').appendTo('.endGame');
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
      // Create local name registration
      // Use a prefix to separate from other local storage data
      currentPlayer = $('#nameInput').val();
      let getName = 'name:' + currentPlayer;
      let getScore = moves - 1;
      let setPlayerScore = getName + ' ' + getScore;
      localStorage.setItem(getName, getScore);
      laderPanel();
    });
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
      let playerData = {name: playerName[1], score: localStorage[i]};
      localScoreArray.push(playerData);
    }

    // Sort localScoreArray from smaller to bigger
    localScoreArray.sort(function (a,b) { return a.score - b.score });

    // Check if the player is in top five
    let playerNotInTop = true;
    let length;
    localScoreArray.length < 5 ? length = localScoreArray.length : length = 5;

    for (i = 0; i < localScoreArray.length; i++) {
      let newScore = $('<p/>').text(i + '. ' + localScoreArray[i].name + ' : ' + localScoreArray[i].score);
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

  /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
  let startNewGame = () => {
    fillArrayTwoTimes(cards, cardsIcons);
    shuffle(cards);
    createCardHTML(cards);
    setMobileContainer();
  };

  startNewGame();
  // gameEndPanel();
});
