let pCards = [];
let pSum = 0;
let dCards = [];
let dSum = 0;
let wager = 0;

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
const playerNameEl = document.getElementById("enterPname-el");

let pAces = 0;
let dAces = 0;

let player = {
  name: "Suk",
  chips: 500,
};

let playerEl = document.getElementById("player-el");
playerEl.textContent = playerName();
//playerEl.textContent = player.name + ": $" + player.chips;

function getRandomCard() {
  return Math.floor(Math.random() * 10) + 2;
}

function startGame() {
  pAces = 0;
  dAces = 0;
  isAlive = true;
  dealerAlive = true;
  hasBlackJack = false;
  liveBet = false;
  doubleBet = true;
  payOutPlayer = true;

  if (wager > player.chips) {
    wager = player.chips;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  }

  // player first 2 cards
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  pCards = [firstCard, secondCard];
  pSum = firstCard + secondCard;

  // dealer first 2 cards
  let dealerFirstCard = getRandomCard();
  let dealerSecondCard = getRandomCard();
  dCards = [dealerFirstCard, dealerSecondCard];
  dSum = dealerSecondCard;

  for (let i = 0; i < 2; i++) {
    if (pCards[i] === 11) {
      pAces++;
    }
  }

  renderGame();
}

function renderGame() {
  printCards(pCardsEl, "Player", pCards);
  /*pCardsEl.textContent = "Player Cards: ";
  for (let i = 0; i < pCards.length; i++) {
    pCardsEl.textContent += pCards[i] + " ";
  }*/
  pSumEl.textContent = "Player Sum: " + pSum;
  if (pSum === 21 && pCards.length === 2) {
    message = "You've got blackjack!!!";
    hasBlackJack = true;
    payOut();
  } else if (pSum < 22) {
    message = "Do you want to draw another card?";
  } else if (pAces === 2) {
    message = "Do you want to draw another card?";
  } else {
    message = "You've busted!!!";
    payOut();
    //player.chips -= wager;
    //playerEl.textContent = player.name + ": $" + player.chips;
    //wager = 0;
    //ttlWagerEl.textContent = `Total Wager: ${wager}`;
    //isAlive = false;
    //dealerAlive = false;
  }
  dealerHand();
  messageEl.textContent = message;
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let drawCard = getRandomCard();
    if (drawCard === 11) {
      pAces++;
    }

    pSum += drawCard;

    if (pSum > 21 && pAces > 0) {
      pAces--;
      pSum -= 10;
      let flipped = true;

      /*  for (let i = 0; i < pCards.length; i++) {
        if (pCards[i] === 11 && flipped === true) {
          pCards[i] = 1;
          flipped = false;
        }
      }*/
      let index = pCards.indexOf(11);
      pCards[index] = 1;
    }

    pSumEl.textContent = "Player Sum: " + pSum;
    pCards.push(drawCard);
    renderGame();
  }
  doubleBet = false;
}

function dealerHand() {
  dCardsEl.textContent = "Dealer Cards: ";
  dCardsEl.textContent += `? ${dCards[1]}`;
  dSum = dCards[1];
  dSumEl.textContent = `Dealer Sum: ${dSum}`;
}

function countAces(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 11) {
      count++;
    }
  }
  return count;
}

function displayCards(container, newCard) {
  container.textContent += ` ${newCard}`;
}

function displaySum(container, sum) {
  container.textContent = `Dealer Sum: ${sum}`;
}

function stand() {
  if (dealerAlive) {
    let index = 0;
    dAces = countAces(dCards);
    dSum = dCards[0] + dCards[1];
    dCardsEl.textContent = `Dealer Cards: ${dCards[0]} ${dCards[1]} `;
    dSumEl.textContent = `Dealer Sum: ${dSum}`;

    while ((dSum < 17 && dAces === 0) || (dSum < 18 && dAces > 0)) {
      let dealerCard = getRandomCard();
      dSum += dealerCard;
      dCards.push(dealerCard);
      if (dealerCard === 11) {
        dAces++;
      }
      if (dAces > 0 && dSum > 21) {
        index = dCards.indexOf(11);
        dCards[index] = 1;
        dSum -= 10;
        printCards(dCardsEl, "Dealer", dCards);
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
        dAces--;
      } else if (dAces > 0 && dSum < 18) {
        index = dCards.indexOf(11);
        dCards[index] = 1;
        dSum -= 10;
        printCards(dCardsEl, "Dealer", dCards);
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
        dAces--;
      }
      printCards(dCardsEl, "Dealer", dCards);
      dSumEl.textContent = `Dealer Sum: ${dSum}`;
    }
    dealerAlive = false;
    isAlive = false;
    payOut();
  }
}
/* if (dSum < 18 && count > 0) {
      while (dSum < 18) {
        let index = dCards.indexOf(11);
        dCards[index] = 1;
        count--;
        dSum -= 10;

        let newCard = getRandomCard();
        if (newCard === 11) {
          dAces++;
          dSum += newCard;
        }
        dCards.push(newCard);
        if (dSum > 21 && count > 0) {
          index = dCards.indexOf[11];
          dCards[index] = 1;
          dAces--;
          dSum += 1;
        }

        // dCardsEl.textContent += ` ${newCard}`;
        dCardsEl.textContent = "Dealer Cards: ";
        for (let i = 0; i < dCards.length; i++) {
          dCardsEl.textContent += dCards[i] + " ";
        }
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
      }
    } else if (dSum < 17) {
      while (dSum < 17) {
        let newCard = getRandomCard();
        if (newCard === 11) {
          dAces++;
        }
        dCards.push(newCard);
        dSum += newCard;

        dCardsEl.textContent += ` ${newCard}`;
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
      }
    }*/

/* if (pSum < dSum && dSum > 21) {
    player.chips += wager;
    playerEl.textContent = player.name + ": $" + player.chips;
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: ${wager}`;
  } else if (pSum > dSum && pSum < 22) {
    player.chips += wager;
    playerEl.textContent = player.name + ": $" + player.chips;
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: ${wager}`;
  } else if (pSum === dSum) {
    playerEl.textContent = player.name + ": $" + player.chips;
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: ${wager}`;
  } else {
    player.chips -= wager;
    playerEl.textContent = player.name + ": $" + player.chips;
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: ${wager}`;
  } */

oneBtn.addEventListener("click", function () {
  if (liveBet && player.chips - wager >= 1) {
    wager += 1;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

fiveBtn.addEventListener("click", function () {
  if (liveBet && player.chips - wager >= 5) {
    wager += 5;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

twentyFiveBtn.addEventListener("click", function () {
  if (liveBet && player.chips - wager >= 25) {
    wager += 25;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

fiftyBtn.addEventListener("click", function () {
  if (liveBet && player.chips - wager >= 50) {
    wager += 50;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  } else if (liveBet) {
    wager = wager;
  }
});

clearBtn.addEventListener("click", function () {
  if (liveBet) {
    wager = 0;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
  }
});

function payOut() {
  if (payOutPlayer) {
    if (hasBlackJack) {
      player.chips += wager * 1.5;
      playerEl.textContent = player.name + ": $" + player.chips;
      //wager = 0;
      ttlWagerEl.textContent = `Total Wager: $${wager}`;
      message = "You've got blackjack!!!";
    } else if (pSum > dSum && pSum < 22) {
      player.chips += wager;
      playerEl.textContent = player.name + ": $" + player.chips;
      // wager = 0;
      ttlWagerEl.textContent = `Total Wager: $${wager}`;
      message = "You've got a winning hand!";
    } else if (pSum === dSum) {
      playerEl.textContent = player.name + ": $" + player.chips;
      // wager = 0;
      ttlWagerEl.textContent = `Total Wager: $${wager}`;
      message = "It's a draw";
    } else if (pSum < dSum && dSum > 21) {
      player.chips += wager;
      playerEl.textContent = player.name + ": $" + player.chips;
      ttlWagerEl.textContent = `Total Wager: $${wager}`;
      message = "You've got a winning hand!";
    } else {
      player.chips -= wager;
      playerEl.textContent = player.name + ": $" + player.chips;
      //  wager = 0;
      ttlWagerEl.textContent = `Total Wager: $${wager}`;
      message = "You have a losing hand, try again";
    }
  }
  dealerAlive = false;
  payOutPlayer = false;
  isAlive = false;
  liveBet = true;
  messageEl.textContent = message;
  //wager = 0;
}

function doubleDown() {
  if (doubleBet === true && player.chips > wager * 2) {
    wager += wager;
    ttlWagerEl.textContent = `Total Wager: $${wager}`;
    newCard();
    stand();
  }
}

doubleBtn.addEventListener("click", doubleDown);

submitNameBtn.addEventListener("click", playerName);

function printCards(element, name, array) {
  element.textContent = `${name} Cards: `;
  for (let i = 0; i < array.length; i++) {
    element.textContent += array[i] + " ";
  }
}

function playerName() {
  playerEl.textContent = `${playerNameEl.value}: $${player.chips}`;
  playerNameEl.value = "";
  //setVisibility("playerName-el", "none");
}

function setVisibility(id, visibility) {
  document.getElementById(id).style.display = visibility;
}

/*
function stand() {
  if ((dealerAlive = true)) {
    dSum = dCards[0] + dCards[1];
    dCardsEl.textContent = `Dealer Cards: ${dCards[0]} ${dCards[1]}`;
    dSumEl.textContent = `Dealer Sum: ${dSum}`;
    let count = countAces(dCards);
    while (dSum < 18 && dealerAlive === true) {
      if (dSum < 17) {
        let flipped = true;
        for (let i = 0; i < dCards.length; i++) {
          if (dCards[i] === 11) {
            dCards[i] = 1;
            flipped = false;
            count--;
          }
        }
        dSum += dCards[dCards.length - 1] - 10;
        dCards.textContent = "Dealer Cards:";
        for (let i = 0; i < dCards.length; i++) {
          dCards += ` ${dCards[i]}`;
        }
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
      } else if (dSum < 18 && count > 0) {
        let flipped = true;
        for (let i = 0; i < dCards.length; i++) {
          if (dCards[i] === 11) {
            dCards[i] = 1;
            flipped = false;
            count--;
          }
        }
        dSum += dCards[dCards.length - 1] - 10;
        dCards.textContent = "Dealer Cards:";
        for (let i = 0; i < dCards.length; i++) {
          dCards += ` ${dCards[i]}`;
        }
        dSumEl.textContent = `Dealer Sum: ${dSum}`;
      }
    }
  }
  isAlive = false;
  dealerAlive = false;
}
*/

// function stand() {
//   if (dSum < 17 && dealerAlive === true) {
//     dSum = dCards[0] + dCards[1];
//     dSumEl.textContent = `Dealer Sum: ${dSum}`;
//     for (let i = 0; i < dCards.length; i++) {
//       if (dCards === 11) {
//         dAces++;
//       }
//     }
//     dCardsEl.textContent = `Dealer Cards: ${dCards[0]} ${dCards[1]}`;
//     let i = 2;
//     while (dSum < 17 && dealerAlive === true /*&& dAces > 0*/) {
//       let newCard = getRandomCard();
//       dCards.push(newCard);
//       dSum += newCard;
//       dCardsEl.textContent += ` ${dCards[i]}`;
//       dSumEl.textContent = `Dealer Sum: ${dSum}`;
//       i++;
//     }
//     dealerAlive = false;
//   }
// }
