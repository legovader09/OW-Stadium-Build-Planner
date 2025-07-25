export const MVP_BONUS = 1000;
const CASH_PER_ROUND = [
  3500,
  5000,
  4000,
  3500,
  3500,
  3500,
  3500,
];

export const calculateMinimumCashPerRound = (round) => {
  if (round < 0 || round > CASH_PER_ROUND.length) return 0;
  return CASH_PER_ROUND.slice(0, round + 1).reduce((sum, cash) => sum + cash, 0);
};
