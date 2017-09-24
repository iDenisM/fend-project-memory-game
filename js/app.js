
$(function() {
  /*
  * Create a list that holds all of your cards
  */
  let cardsIcons = ['heart-o', 'hashtag', 'gift', 'legal', 'navicon', 'futbol-o', 'life-ring', 'folder'];
  let cards = [];

  // Copy two times the same value of an array into another array
  let fillArrayTwoTimes = (target, source) => {
    for (index of source) {
      target.push(index);
      target.push(index);
    }
  };

  // Fill the cards array with cards two per type
  fillArrayTwoTimes(cards, cardsIcons);

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
  /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
  shuffle(cards);

  // Create the HTML block for the card
  let createCardHTML = (card) => {
    let content = '';
    // Loop each card to create the HTML block
    for (card of cards) {
      content += '<li class="card"><i class="fa fa-' + card + '"></i></li>';
    };
    $('.deck').append(content);
  };

  createCardHTML(cards);

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
  // List of clicked cards
  let clickList = [];

  // Display or close the card
  let toggleCard = (card) => {
    // Get the index of the clikced card
    let index = $('.deck').children().index(this);
    // Get the card name
    let cardName = cards[index];
    // Add to the card to click list
    clickList.push(cardName);
    // Toggle the card
    $(card).toggleClass('open show');
  };

  // Open and lock the card in position
  let openCard = (card) => {
    // Remove the display
    toggleCard(card);
    // Add open class
    $(card).toggleClass('match');
  };

  // Check match cards
  let matchCard = () => {
    if (clickList[0] === clickList[1]) {
      // Open clicked cards
    }
  };


  $('li.card').click(function() {
    // Open the card
    toggleCard(this);
    // Check if ther is another card in click list
    if (clickList.length > 0) {
      // Check if the two cards match
      if (clickList[0] === clickList[1])
        openCard();
    }
    else {

      // - if no then check if the cards in the list matches
      // -- if yes then change status to matches
      // -- if no then close the cards and clear the click list
    }

  });
});
