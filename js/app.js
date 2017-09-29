
$(function() {
  /*
  * Create a list that holds all of your cards
  */
  let cardsIcons = ['heart-o', 'hashtag', 'gift', 'legal', 'navicon', 'futbol-o', 'life-ring', 'folder'];
  // Cards deck
  let cards = [];
  // List of clicked cards
  let clickList = [];
  let moves = 1;

  // Copy two times the same value of an array into another array
  let fillArrayTwoTimes = (target, source) => {
    for (index of source) {
      target.push(index);
      target.push(index);
    }
  };


  // Shuffle function from http://stackoverflow.com/a/2450976
  let shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
  let startNewGame = () => {
    fillArrayTwoTimes(cards, cardsIcons);
    shuffle(cards);
    createCardHTML(cards);
  };

  startNewGame();


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

  // Check if card has match class
  let hasMatch = (card) => {
    $(card).hasClass('match');
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
    $('.deck').children().eq(cardID).attr('class', 'card match');
  };

  // Check match cards
  let matchCard = () => {
    // Set local vars
    let cardID1 = clickList[0],
        cardID2 = clickList[1],
        card1 = cards[cardID1],
        card2 = cards[cardID2];
    // Check if id of card are different and cards are the same
    if (cardID1 != cardID2 && card1 === card2) {
      // Open clicked cards
      toggleMatch(cardID1);
      toggleMatch(cardID2);
    } else {
      // Close cards
      toggleOpen('li.open');
    }
    clickList = [];
    // Increment moves
    calcScore();
  };

  // Add score
  let calcScore = () => {
    return $('.moves').text(moves++);
  }

  // Reset moves to 0
  let resetMoves = () => {
    $('.moves').text('0');
  };

  $('.deck').on('click', '.card', function() {
    // Open the card
    let match = $(this).hasClass('match');
    if (!match)
      toggleOpen(this);
    // Check if ther is another card in click list
    if (clickList.length > 1) {
      // Check if the two cards match
      window.setTimeout(function() {
        matchCard();
        // toggleOpen('.open');
      }, 700);
    }
  });

  // Mobile style
  let setContainer = () => {
    let bodyWidth = $('body').width(),
        deckWidth = $('.deck').outerWidth(),
        deckPadding = parseInt($('.deck').css('padding')),
        cardDim = (bodyWidth - (deckPadding * 2) - 8) / 4;
    if (bodyWidth <= deckWidth) {
      // Create score panel style
      let scorePanelStyle = {'width': '80%'};
      // Create deck style
      let deckStyle = {'width': bodyWidth,
                       'min-height': bodyWidth};
      let cardStyle = {'width': cardDim,
                       'height': cardDim};
      // Change styles
      $('.score-panel').css(scorePanelStyle);
      $('.deck').css(deckStyle);
      $('li.card').css(cardStyle);
    }
  };
  setContainer();

  // Restart game function
  $('.restart').click(function() {
    cards = [];
    clickList = [];
    moves = 1;
    startNewGame();
    setContainer();
  });

});
