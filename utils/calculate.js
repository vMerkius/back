const boostPrices = {
  'Iron IV': 0,
  'Iron III': 3.99,
  'Iron II': 3.99,
  'Iron I': 3.99,
  'Bronze IV': 4.39,
  'Bronze III': 4.99,
  'Bronze II': 4.99,
  'Bronze I': 4.99,
  'Silver IV': 5.99,
  'Silver III': 6.29,
  'Silver II': 6.69,
  'Silver I': 6.99,
  'Gold IV': 9.69,
  'Gold III': 10.49,
  'Gold II': 11.29,
  'Gold I': 13.49,
  'Platinum IV': 14.49,
  'Platinum III': 15.49,
  'Platinum II': 17.79,
  'Platinum I': 19.99,
  'Emerald IV': 25.49,
  'Emerald III': 26.79,
  'Emerald II': 28.29,
  'Emerald I': 30.99,
  'Diamond IV': 32.29,
  'Diamond III': 43.29,
  'Diamond II': 56.49,
  'Diamond I': 77.99,
  'Master I': 93.49,
};
const boostPerGamePrice = {
  'Iron IV': 0,
  'Iron III': 3.99,
  'Iron II': 3.99,
  'Iron I': 3.99,
  'Bronze IV': 4.39,
  'Bronze III': 4.99,
  'Bronze II': 4.99,
  'Bronze I': 4.99,
  'Silver IV': 5.99,
  'Silver III': 6.29,
  'Silver II': 6.69,
  'Silver I': 6.99,
  'Gold IV': 9.69,
  'Gold III': 10.49,
  'Gold II': 11.29,
  'Gold I': 13.49,
  'Platinum IV': 14.49,
  'Platinum III': 15.49,
  'Platinum II': 17.79,
  'Platinum I': 19.99,
  'Emerald IV': 25.49,
  'Emerald III': 26.79,
  'Emerald II': 28.29,
  'Emerald I': 30.99,
  'Diamond IV': 32.29,
  'Diamond III': 43.29,
  'Diamond II': 56.49,
  'Diamond I': 77.99,
  'Master I': 10,
};
const discountCode = [
  'DISCOUNT10',
  'DISCOUNT20',
  'DISCOUNT30',
  'DISCOUNT40',
  'DISCOUNT50',
];

const calculatePrice = (data) => {
  const {
    boostType,
    netWins,
    placements,
    rankCurrent,
    rankDesired,
    mmrs,
    solo,
    lane,
    champions,
    additionalWin,
    streamed,
    chat,
    flash,
    priority,
    queue,
    discount,
  } = data;
  let totalPrice = 0;
  let mmrsFinal;
  let discountFinal;
  let mmrsGame;
  let games;

  const currentToKey = rankCurrent.rank + ' ' + rankCurrent.division;
  const desiredToKey = rankDesired.rank + ' ' + rankDesired.division;
  const indexCurrent = Object.keys(boostPrices).indexOf(currentToKey);
  const indexDesired = Object.keys(boostPrices).indexOf(desiredToKey);
  console.log('mmrs', mmrs);

  if (mmrs.length > 0) {
    mmrsFinal = parseInt(mmrs.slice(0, 2));
  } else {
    mmrsFinal = 17;
  }

  switch (boostType) {
    case 'divisions':
      let last = Object.keys(boostPerGamePrice).length - 1;

      if (
        indexDesired === Object.keys(boostPerGamePrice).length - 1 &&
        indexCurrent === Object.keys(boostPerGamePrice).length - 1 &&
        rankDesired.lp > 0
      ) {
        mmrsGame = mmrsFinal + 2;
        games = Math.ceil((rankDesired.lp - rankCurrent.lp) / mmrsGame);
        totalPrice += games * boostPerGamePrice[currentToKey];
        console.log('totaslPrice1', totalPrice);
        console.log('games', games);
        console.log('mmrsGame', mmrsGame);
        console.log('totalPrice', totalPrice);
      }
      if (rankCurrent.rank === 'Master' && rankDesired.rank === 'Master') {
        mmrsGame = mmrsFinal + 2;
        games = Math.ceil((rankDesired.lp - rankCurrent.lp) / mmrsGame);
        totalPrice += games * boostPerGamePrice[desiredToKey];
        console.log('totaslPrice3', totalPrice);

        break;
      }

      if (
        indexCurrent >= 0 &&
        indexDesired >= 0 &&
        indexCurrent <= indexDesired
      ) {
        for (let i = indexCurrent; i <= indexDesired; i++) {
          totalPrice += boostPrices[Object.keys(boostPrices)[i]];
          console.log('totaslPrice2', totalPrice);
        }
      }
      break;
    case 'netWins':
      totalPrice += netWins * boostPerGamePrice[currentToKey];
      break;
    case 'placements':
      totalPrice += placements * 4.99;
      break;
    default:
      break;
  }

  if (!solo) {
    totalPrice *= 1.2;
  }
  if (additionalWin) {
    totalPrice += 10;
  }
  if (streamed) {
    totalPrice *= 1.1;
  }
  if (chat) {
    totalPrice *= 1.1;
  }
  if (priority) {
    totalPrice *= 1.2;
  }
  if (lane && lane.primary !== '') {
    totalPrice *= 1.2;
  }
  if (champions && champions.length > 0) {
    totalPrice *= 1.1;
  }
  console.log('total', totalPrice);

  // switch (mmrsFinal) {
  //   case 10:
  //     totalPrice *= 1.3;
  //     break;
  //   case 15:
  //     totalPrice *= 1.15;
  //     break;
  //   case 20:
  //     totalPrice *= 1.1;
  //     break;
  //   case 25:
  //     totalPrice *= 0.9;
  //     break;
  //   default:
  //     totalPrice *= 0.8;
  // }

  if (discount) {
    if (discountCode.includes(discount)) {
      totalPrice *= 0.9;
    }
  }
  const price = 0.8 * totalPrice;

  return {
    price: price.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    discountFinal: (totalPrice - price).toFixed(2),
  };
};

module.exports = calculatePrice;
