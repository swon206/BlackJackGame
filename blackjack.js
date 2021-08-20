let playerHands = [];
let pCards = [];
let pSumArr = [];
let pSum = 0;
let dCards = [];
let dSum = 0;
let wager = 0;
let currentHand = 0;

let canSplit = false;
let hasBlackJack = false;
let isAlive = false;
let dealerAlive = false;
let liveBet = true;
let doubleBet = false;
let payOutPlayer = false;
let message = "";

const messageEl = document.getElementById("message-el");
const pSumEl = document.getElementById("pSum-el");
const pCardsEl = document.getElementById("pCards-el");
const dSumEl = document.getElementById("dSum-el");
const dCardsEl = document.getElementById("dCards-el");
const ttlWagerEl = document.getElementById("totalWager");
const oneBtn = document.getElementById("one-btn");
const fiveBtn = document.getElementById("five-btn");
const twentyFiveBtn = document.getElementById("twentyFive-btn");
const fiftyBtn = document.getElementById("fifty-btn");
const clearBtn = document.getElementById("clear-btn");
const doubleBtn = document.getElementById("double-btn");
const submitNameBtn = document.getElementById("submit-btn");
const inputEl = document.getElementById("input-el");
const playerEl = document.getElementById("player-el");
const splitBtn = document.getElementById("split-btn");

let pAces = 0;
let dAces = 0;
let bJackCount = 0;

class Player {
  constructor(name, chips) {
    this.name = name;
    this.chips = chips;
  }
}

// get a new card from range 2-11
function getRandomCard() {
  return Math.floor(Math.random() * 10) + 2;
}

function startGame() {
  pAces = 0;
  dAces = 0;
  let bJackCount = 0;
  isAlive = true;
  dealerAlive = true;
  hasBlackJack = false;
  liveBet = false;
  doubleBet = true;
  payOutPlayer = true;
  canSplit = false;
  pSumArr = [];
  playerHands = [];
  currentHand = 0;

  if (wager > player1.chips) {
    wager = player1.chips;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  }

  // player first 2 cards
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  //test split
  //let firstCard = 11;
  //let secondCard = 11;

  pCards = [firstCard, secondCard];
  playerHands.push(pCards);
  pSum = sumCards(playerHands, currentHand);
  pSumArr.push(pSum);
  let aces = countCards(playerHands[currentHand], 11);

  // dealer first 2 cards
  let dealerFirstCard = getRandomCard();
  let dealerSecondCard = getRandomCard();
  dCards = [dealerFirstCard, dealerSecondCard];
  dSum = dealerSecondCard;

  renderGame();
}

function renderGame() {
  displayHtml(pSumArr, playerHands, "Player Cards", "Player Sum", pCardsEl);

  printMessage(messageEl);

  dealerHand();

  if (isAlive && pSumArr.length === currentHand) {
    // player has a live hand and completed all the hands
    payOut();

    if (bJackCount != currentHand - 1) {
      // there is at least one hand that is not a blackjack
      stand();
    }

    payOut();
  }
}

// hit button function for the player
function newCard() {
  if (currentHand < pSumArr.length) {
    pAces = countCards(playerHands[currentHand], 11);
    console.log(pAces);
    let drawCard = getRandomCard();
    // test split
    //let drawCard = 11;
    if (drawCard === 11) {
      pAces++;
    }

    pSumArr[currentHand] += drawCard;
    playerHands[currentHand].push(drawCard);
    if (pSumArr[currentHand] === 22 && playerHands[currentHand].length === 2) {
      // allowing for a split
      renderGame();
    } else {
      while (pSumArr[currentHand] > 21 && pAces > 0) {
        // changes an ace 11 to a 1
        pAces--;
        let index = playerHands[currentHand].indexOf(11);
        playerHands[currentHand][index] = 1;
        pSumArr[currentHand] -= 10;
      }

      displayHtml(pSumArr, playerHands, "Player Cards", "Player Sum", pCardsEl);

      renderGame();
    }
  }
  doubleBet = false;
}

// prints the initial dealer hand with one hidden card
function dealerHand() {
  dCardsEl.innerHTML = `<p>Dealer Cards: ? ${dCards[1]} <br>
  Dealer Sum: ${dSum}</p>`;
}

/*
pre: arr takes in the array of cards, cardNo is the card number in the hand that needs to be counted
post: returns the number of the same card in each hand
*/
function countCards(arr, cardNo) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === cardNo) {
      count++;
    }
  }
  return count;
}

/*
pre: arr1 is the sum array, arr2 is the hand array, message1 is the first line to display, message2 is the second line to display, element is the html element to display the messages
post: overrides the html display with given cards and card sum
*/
function displayHtml(arr1, arr2, message1, message2, element) {
  let handSum = "";
  let listItems = "";
  let playerCards = "";

  for (let i = 0; i < arr1.length; i++) {
    handSum = arr1[i];
    for (let j = 0; j < arr2[i].length; j++) {
      playerCards += " " + arr2[i][j];
    }

    listItems += `
      <li>
        ${message1} #${i + 1}:  ${playerCards}
      </li>
      <li>
        ${message2} #${i + 1}:  ${handSum}
      </li>
      <br>
      `;
    handSum = "";
    playerCards = "";
  }
  element.innerHTML = listItems;
}

function stand() {
  if (pSumArr[currentHand] === 22 && playerHands[currentHand].length === 2) {
    // changes an ace to a 1 on a two ace hand
    let index = playerHands[currentHand].indexOf(11);
    playerHands[currentHand][index] = 1;
    pSumArr[currentHand] -= 10;
    displayHtml(pSumArr, playerHands, "Player Cards", "Player Sum", pCardsEl);
  }
  if (pSumArr.length > currentHand) {
    currentHand++;
  }
  printMessage(messageEl);
  let liveHand = checkLiveHand(pSumArr, playerHands);

  if (pSumArr.length === currentHand && liveHand && dealerAlive) {
    // start dealer hits
    let index = 0;
    dAces = countCards(dCards, 11);
    if (dAces === 2) {
      dCards[0] = 1;
      dAces--;
    }
    dSum = dCards[0] + dCards[1];
    printDealerInfo(dCardsEl, "Dealer", dealerHand);

    while ((dSum < 17 && dAces === 0) || (dSum < 18 && dAces > 0)) {
      // dealer continues on soft 17 or under 17
      let dealerCard = getRandomCard();
      dSum += dealerCard;
      dCards.push(dealerCard);
      if (dealerCard === 11) {
        dAces++;
      }
      if (dAces > 0 && dSum > 21) {
        // dealer bust with an aces, ace changes to a 1
        index = dCards.indexOf(11);
        dCards[index] = 1;
        dSum -= 10;
        printDealerInfo(dCardsEl, "Dealer", dCards);
        dAces--;
      }
    }
    console.log(dCards);
    printDealerInfo(dCardsEl, "Dealer", dCards);
    payOut();
    dealerAlive = false;
  }
}

// $1 wager button
oneBtn.addEventListener("click", function () {
  if (liveBet && player1.chips - wager >= 1) {
    wager += 1;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

// $5 wager button
fiveBtn.addEventListener("click", function () {
  if (liveBet && player1.chips - wager >= 5) {
    wager += 5;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

// $25 wager button
twentyFiveBtn.addEventListener("click", function () {
  if (liveBet && player1.chips - wager >= 25) {
    wager += 25;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

// $50 wager button
fiftyBtn.addEventListener("click", function () {
  if (liveBet && player1.chips - wager >= 50) {
    wager += 50;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

// clear wager button
clearBtn.addEventListener("click", function () {
  if (liveBet) {
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  }
});

// pays out the hands once the game is complete
function payOut() {
  for (let i = 0; i < pSumArr.length; i++) {
    if (payOutPlayer) {
      if (pSumArr[i] === 21 && playerHands[i].length === 2) {
        // payout on blackjack
        player1.chips += wager * 1.5;
        playerEl.textContent = player1.name + ": $" + player1.chips;
        ttlWagerEl.textContent = `Total Wager: $${wager}`;
        message = "You've got blackjack!!!";
        hasBlackJack = false;
      } else if (pSumArr[i] > dSum && pSumArr[i] < 22) {
        // payout on player higher than dealer but not busted
        player1.chips += wager;
        playerEl.textContent = player1.name + ": $" + player1.chips;
        ttlWagerEl.textContent = `Total Wager: $${wager}`;
        message = "You've got a winning hand!";
      } else if (pSumArr[i] === dSum) {
        // no payout on a draw
        playerEl.textContent = player1.name + ": $" + player1.chips;
        ttlWagerEl.textContent = `Total Wager: $${wager}`;
        message = "It's a draw";
      } else if (pSumArr[i] < dSum && dSum > 21) {
        // payout on a player non bust hand and dealer bust
        player1.chips += wager;
        playerEl.textContent = player1.name + ": $" + player1.chips;
        ttlWagerEl.textContent = `Total Wager: $${wager}`;
        message = "You've got a winning hand!";
      } else {
        // payout on player bust
        player1.chips -= wager;
        playerEl.textContent = player1.name + ": $" + player1.chips;
        ttlWagerEl.textContent = `Total Wager: $${wager}`;
        message = "You have a losing hand, try again";
      }
    }
  }
  dealerAlive = false;
  payOutPlayer = false;
  isAlive = false;
  liveBet = true;
  messageEl.textContent = message;
  //wager = 0;
}

// double down allowed only on initial hand or a split
function doubleDown() {
  if (playerHands[currentHand].length < 3) {
    doubleBet = true;
  }
  if (doubleBet === true && player1.chips > wager * 2) {
    // allows player to double if player has enough chips
    wager += wager;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
    newCard();
    if (pSumArr[currentHand] === 22) {
      let index = playerHands[currentHand].indexOf(11);
      playerHands[currentHand][index] = 1;
      pSumArr[currentHand] -= 10;
      console.log("test double");
      displayHtml(pSumArr, playerHands, "Player Cards", "Player Sum", pCardsEl);
    }
    stand();
  }
}

// double down button, only on initial hand or on a split
doubleBtn.addEventListener("click", doubleDown);

// player name submit button to create a new player
submitNameBtn.addEventListener("click", function () {
  let pName = inputEl.value;
  player1 = new Player(pName, 500);
  playerEl.textContent = `${player1.name}: $${player1.chips}`;
  document.getElementById("playerName-el").style.visibility = "hidden";
});

/*
pre: element is the html element to be displayed, name is to define whose hand and sum, arr is the hand arr
post: displays dealer card and sum info
*/
function printDealerInfo(element, name, arr) {
  let listItems = "";
  let cardsStr = printCards(arr);
  let sum = sumArrOneD(arr);
  listItems += `
      <li>
        ${name} Hand:  ${cardsStr}
      </li>
      <li>
        ${name} Sum:  ${sum}
      </li>
      <br>
      `;

  element.innerHTML = listItems;
}

/*
pre: arr takes in cards arr
post: returns a string with the given cards in a hand
*/
function printCards(arr) {
  let cardsStr = "";
  cardsStr = arr[0];
  for (let i = 1; i < arr.length; i++) {
    cardsStr += " " + arr[i];
  }
  return cardsStr;
}

/*
function getPlayerName() {
  const pName = inputEl.value;

  let player1 = new Player(pName, 500);
  playerEl.textContent = `${player1.name}: $${player1.chips}`;
  startGame();
}

function setVisibility(id, visibility) {
  document.getElementById(id).style.display = visibility;
}
*/

/*
pre: arr for cards to be summed (one D array)
post: returns the sum of cards in a hand
*/
function sumArrOneD(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

/*
pre: arr for cards to be summed, position is which 2D array to be summed
post: returns the sum of cards in a hand
*/
function sumCards(arr, position) {
  let sum = 0;
  for (let i = 0; i < arr[position].length; i++) {
    sum += arr[position][i];
  }
  return sum;
}

// split button only when first 2 cards and only 2 cards in a hand
splitBtn.addEventListener("click", split);

// split to allow player to split any hand that have the same 2 cards in the initial hand
function split() {
  let newHand = [];
  let localSum = 0;
  // player can split if enough chips and first 2 cards and only 2 cards in hand are the same
  if (
    playerHands[currentHand][0] === playerHands[currentHand][1] &&
    playerHands[currentHand].length === 2 &&
    player1.chips >= wager * (pSumArr.length + 1)
  ) {
    newHand.push(playerHands[currentHand][1]);
    playerHands.push(newHand);
    playerHands[currentHand].pop();

    let singleHand = "";
    let listItems = "";
    let singleSum = "";
    pSumArr = [];

    for (let i = 0; i < playerHands.length; i++) {
      localSum = sumCards(playerHands, i);
      pSumArr.push(localSum);
      singleSum = pSumArr[i];
      for (let j = 0; j < playerHands[i].length; j++) {
        singleHand += playerHands[i][j] + " ";
      }
      listItems += `
      <li>
        Player Hand ${i + 1}:  ${singleHand}
      </li>
      <li>
        Player Sum ${i + 1}:  ${singleSum}
      </li>
      <br>
      `;
      singleSum = "";
      singleHand = "";
    }
    pCardsEl.innerHTML = listItems;
  }
}

/*
pre: arr1 is the sum array, arr2 is the hand array
post: returns boolean if there is any live hand for the player
*/
function checkLiveHand(arr1, arr2) {
  let liveHand = false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] < 22 || (arr1[i] != 21 && arr2[i].length < 3)) {
      liveHand = true;
      break;
    }
  }
  return liveHand;
}

/*
pre: takes in the element in html where the message is to be displayed
post: prints the message for the action to be taken by the player
*/
function printMessage(element) {
  if (currentHand < pSumArr.length) {
    if (pSumArr[currentHand] === 21 && playerHands[currentHand].length === 2) {
      message = `Hand ${currentHand + 1}: You've got blackjack!!!`;
      bJackCount++;
      currentHand++;
    } else if (
      playerHands[currentHand][0] === playerHands[currentHand][1] &&
      playerHands[currentHand].length === 2
    ) {
      message = `Hand ${
        currentHand + 1
      }: Do you want to split your hand, draw another card, or stay?`;
    } else if (pSumArr[currentHand] < 22) {
      message = `Hand ${currentHand + 1}: Do you want to draw another card?`;
    } else {
      message = `Hand ${currentHand + 1}: You've busted!!!`;
      currentHand++;
    }
  }
  element.textContent = message;
}
