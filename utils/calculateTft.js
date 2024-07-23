const discountCode = require('./discount.js');
const boostPrices = {
  'Iron IV': 0,
  'Iron III': 3.99,
  'Iron II': 3.99,
  'Iron I': 3.99,
  'Bronze IV': 3.99,
  'Bronze III': 3.99,
  'Bronze II': 3.99,
  'Bronze I': 3.99,
  'Silver IV': 3.99,
  'Silver III': 4.99,
  'Silver II': 4.99,
  'Silver I': 4.99,
  'Gold IV': 5.99,
  'Gold III': 6.99,
  'Gold II': 7.99,
  'Gold I': 7.99,
  'Platinum IV': 9.99,
  'Platinum III': 9.99,
  'Platinum II': 11.99,
  'Platinum I': 12.99,
  'Emerald IV': 14.99,
  'Emerald III': 16.99,
  'Emerald II': 18.99,
  'Emerald I': 20.99,
  'Diamond IV': 22.99,
  'Diamond III': 28.99,
  'Diamond II': 37.99,
  'Diamond I': 47.99,
  'Master I': 66.99,
};
const boostPerGamePrice = {
  'Iron IV': 1,
  'Iron III': 1,
  'Iron II': 1,
  'Iron I': 1,
  'Bronze IV': 1,
  'Bronze III': 1,
  'Bronze II': 1,
  'Bronze I': 1,
  'Silver IV': 1,
  'Silver III': 2,
  'Silver II': 2,
  'Silver I': 2,
  'Gold IV': 3,
  'Gold III': 3,
  'Gold II': 3.5,
  'Gold I': 3.5,
  'Platinum IV': 4,
  'Platinum III': 4,
  'Platinum II': 4.5,
  'Platinum I': 5,
  'Emerald IV': 5.5,
  'Emerald III': 6,
  'Emerald II': 6.5,
  'Emerald I': 7,
  'Diamond IV': 8,
  'Diamond III': 12,
  'Diamond II': 15,
  'Diamond I': 17,
  'Master I': 19,
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
  let lpsCurrent;
  let lpsDesired;

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
  if (
    indexCurrent !== Object.values(boostPerGamePrice).length - 1 &&
    rankCurrent.lp.slice(0, 1) !== '0'
  ) {
    lpsCurrent = parseInt(rankCurrent.lp.slice(0, 2));
    totalPrice -= (boostPrices[currentToKey] * lpsCurrent) / 100;
  }
  if (
    indexDesired !== Object.values(boostPerGamePrice).length - 1 &&
    rankDesired.lp.slice(0, 1) !== '0'
  ) {
    lpsDesired = parseInt(rankDesired.lp.slice(0, 2)) + 10;
    totalPrice += (boostPrices[desiredToKey] * lpsDesired) / 100;
  }

  if (additionalWin) {
    totalPrice += 7;
  }
  if (streamed) {
    totalPrice *= 1.2;
  }
  if (chat) {
    totalPrice *= 1.1;
  }
  if (priority) {
    totalPrice *= 1.25;
    if (indexDesired - indexCurrent >= 3) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent - 3];
    } else if (indexDesired - indexCurrent >= 1) {
      estimatedTime =
        estimatedTimesForRankDifferences[indexDesired - indexCurrent - 1];
    }
  }

  switch (mmrsFinal) {
    case 10:
      totalPrice *= 1.6;
      break;
    case 15:
      totalPrice *= 1.4;
      break;
    case 20:
      totalPrice *= 1;
      break;
    case 25:
      totalPrice *= 0.8;
      break;
    case 30:
      totalPrice *= 0.65;
      break;
    default:
      totalPrice *= 1.2;
  }

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
