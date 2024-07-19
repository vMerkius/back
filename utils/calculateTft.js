const discountCode = require('./discount.js');
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

const estimatedTimesForRankDifferences = [
  '0-1 days',
  '1-2 days',
  '1-2 days',
  '1-2 days',
  '2-3 days',
  '3-5 days',
  '3-5 days',
  '4-6 days',
  '5-8 days',
  '5-8 days',
  '6-9 days',
  '7-11 days',
  '7-11 days',
  '8-12 days',
  '8-12 days',
  '9-14 days',
  '10-15 days',
  '10-15 days',
  '11-17 days',
  '12-18 days',
  '12-18 days',
  '14-21 days',
  '16-24 days',
  '17-26 days',
  '19-29 days',
  '21-32 days',
  '22-33 days',
  '24-36 days',
  '29-44 days',
];

const calculateTftPrice = (data) => {
  const {
    rankCurrent,
    rankDesired,
    mmrs,
    additionalWin,
    streamed,
    chat,
    priority,
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
  let estimatedTime =
    estimatedTimesForRankDifferences[indexDesired - indexCurrent];

  if (mmrs.length > 0) {
    mmrsFinal = parseInt(mmrs.slice(0, 2));
  } else {
    mmrsFinal = 17;
  }

  if (
    indexDesired === Object.keys(boostPerGamePrice).length - 1 &&
    indexCurrent === Object.keys(boostPerGamePrice).length - 1 &&
    rankDesired.lp > 0
  ) {
    mmrsGame = mmrsFinal + 2;
    games = Math.ceil((rankDesired.lp - rankCurrent.lp) / mmrsGame);
    totalPrice += games * boostPerGamePrice[currentToKey];
    if (games > 15) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent + 6];
    } else if (games > 10) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent + 4];
    } else if (games > 6) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent + 2];
    }
  } else if (
    indexCurrent >= 0 &&
    indexDesired >= 0 &&
    indexCurrent <= indexDesired
  ) {
    for (let i = indexCurrent + 1; i <= indexDesired; i++) {
      totalPrice += boostPrices[Object.keys(boostPrices)[i]];
    }
    if (rankDesired.rank === 'Master') {
      mmrsGame = mmrsFinal + 2;
      games = Math.ceil(rankDesired.lp / mmrsGame);
      totalPrice += games * boostPerGamePrice[desiredToKey];
    }
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
    if (indexDesired - indexCurrent >= 3) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent - 3];
    } else if (indexDesired - indexCurrent >= 1) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent - 1];
    }
  }

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
    const discountCodeFound = discountCode.find(
      (el) => el.code === discount.toUpperCase()
    );
    if (discountCodeFound) {
      discountFinal = totalPrice * (discountCodeFound.discount / 100);
      totalPrice -= discountFinal;
    }
  }
  const price = totalPrice;
  totalPrice = totalPrice * 1.2;

  return {
    time: estimatedTime,
    price: price.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    discountFinal: (totalPrice - price).toFixed(2),
  };
};

module.exports = calculateTftPrice;
