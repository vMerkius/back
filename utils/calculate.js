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
  'Master I': 110.99,
};
const boostPerGamePrice = {
  'Iron IV': 1,
  'Iron III': 1,
  'Iron II': 1,
  'Iron I': 1,
  'Bronze IV': 1.5,
  'Bronze III': 1.5,
  'Bronze II': 1.5,
  'Bronze I': 1.5,
  'Silver IV': 2,
  'Silver III': 2.5,
  'Silver II': 2.5,
  'Silver I': 3,
  'Gold IV': 3.5,
  'Gold III': 3.5,
  'Gold II': 4,
  'Gold I': 4,
  'Platinum IV': 5,
  'Platinum III': 5,
  'Platinum II': 5.5,
  'Platinum I': 6,
  'Emerald IV': 7,
  'Emerald III': 7.5,
  'Emerald II': 8,
  'Emerald I': 9,
  'Diamond IV': 12,
  'Diamond III': 14,
  'Diamond II': 18,
  'Diamond I': 22,
  'Master I': 29,
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
  let mmrsGame;
  let games;
  let lpsCurrent;
  let lpsDesired;
  let gamesCurrent;
  let gamesDesired;

  const currentToKey = rankCurrent.rank + ' ' + rankCurrent.division;
  const desiredToKey = rankDesired.rank + ' ' + rankDesired.division;
  const indexCurrent = Object.keys(boostPrices).indexOf(currentToKey);
  const indexDesired = Object.keys(boostPrices).indexOf(desiredToKey);
  let estimatedTime =
    estimatedTimesForRankDifferences[indexDesired - indexCurrent];

  if (mmrs.length > 0) {
    mmrsFinal = parseInt(mmrs.slice(0, 2));
    mmrsGame = mmrsFinal + 2;
  } else {
    mmrsFinal = 17;
  }

  switch (boostType) {
    case 'divisions':
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

        break;
      }
      if (
        indexCurrent !== Object.values(boostPerGamePrice).length - 1 &&
        rankCurrent.lp.slice(0, 1) !== '0'
      ) {
        lpsCurrent = parseInt(rankCurrent.lp.slice(0, 2));
        gamesCurrent = Math.ceil(lpsCurrent / mmrsGame);
        console.log(lpsCurrent, gamesCurrent);
        totalPrice -= gamesCurrent * boostPerGamePrice[currentToKey] * 0.6;
        console.log(totalPrice);
      }
      if (
        indexDesired !== Object.values(boostPerGamePrice).length - 1 &&
        rankDesired.lp.slice(0, 1) !== '0'
      ) {
        lpsDesired = parseInt(rankDesired.lp.slice(0, 2)) + 10;
        gamesDesired = Math.ceil(lpsDesired / mmrsGame);
        totalPrice += gamesDesired * boostPerGamePrice[desiredToKey];
        console.log(lpsDesired, gamesDesired, totalPrice);
      }

      if (
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
    totalPrice *= 0.5;
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

  if (lane && lane.primary !== '') {
    totalPrice *= 1.1;
  }
  if (champions && champions.length > 0) {
    totalPrice *= 1.1;
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

module.exports = calculatePrice;
