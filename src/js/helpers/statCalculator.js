/* eslint-disable */
import { statShorthands } from './statDescriptions';

const HEALTH_CONVERT_ITEMS = ['VISHKAR CONDENSOR', 'VITAL-E-TEE', 'TRANSFERENCE DELTA'];
const PERCENTAGE_STAT_ITEMS = ['MEKA Z-SERIES', 'RÜSTUNG VON WILHELM'];
const FLAT_STATS = ['Health', 'Armor', 'Shields'];

const createStatsCollection = (heroData) => {
  const stats = {};
  heroData.base_stats.forEach(stat => {
    const value = stat.value.toString();
    if (!FLAT_STATS.includes(stat.type) && value.endsWith('%')) {
      stats[stat.type] = parseInt(value.replace('%', ''), 10);
    } else {
      stats[stat.type] = parseInt(value, 10);
    }
  });

  heroData.attributes.forEach(attr => {
    const transformedKey = statShorthands[attr.type] || attr.type;
    const value = attr.value.toString();
    if (!FLAT_STATS.includes(transformedKey) && value.endsWith('%')) {
      stats[transformedKey] = parseInt(value.replace('%', ''), 10);
    } else {
      stats[transformedKey] = parseInt(value, 10);
    }
  });

  return stats;
};


const processItemStats = (items) => {
  const stats = {};

  items.forEach(item => {
    if (PERCENTAGE_STAT_ITEMS.includes(item.name)) {
      return;
    }

    item.attributes.forEach(attr => {
      if (attr.type === 'description') {
        return;
      }

      if (stats[attr.type]) {
        const currentValue = parseFloat(stats[attr.type]);
        const newValue = parseFloat(attr.value);
        stats[attr.type] = currentValue + newValue;
      } else {
        stats[attr.type] = parseFloat(attr.value);
      }
    });
  });

  return stats;
};

const applyHealthConversions = (stats, items) => {
  const finalStats = { ...stats };

  items.forEach(item => {
    if (!HEALTH_CONVERT_ITEMS.includes(item.name)) {
      return;
    }

    const conversionType = item.name === 'VISHKAR CONDENSOR' ? 'Shields' : 'Armor';
    const healthToConvert = 100;

    const availableHealth = Math.max(0, finalStats.Health);
    const actualConversion = Math.min(availableHealth, healthToConvert);

    if (actualConversion > 0) {
      finalStats.Health -= actualConversion;
      finalStats[conversionType] += actualConversion;
    }
  });

  return finalStats;
};

const applyPercentageItems = (currentStats, baseStats, items) => {
  let finalStats = { ...currentStats };

  items.forEach(item => {
    if (!PERCENTAGE_STAT_ITEMS.includes(item.name)) {
      return;
    }

    const percentage = item.name === 'MEKA Z-SERIES' ? 0.08 : 0.15;
    const protectedBonus = Math.round(baseStats.Health * percentage);
    const totalStats = FLAT_STATS.reduce((sum, statType) =>
      sum + (finalStats[statType] || 0), 0);

    const increasedTotal = Math.floor(totalStats * (1 + percentage));
    const ratio = increasedTotal / totalStats;

    FLAT_STATS.forEach(statType => {
      if (finalStats[statType] !== undefined) {
        finalStats[statType] = Math.floor(finalStats[statType] * ratio);
      }
    });

    finalStats.Health += protectedBonus;
    
    const largestStat = FLAT_STATS.reduce((max, stat) =>
      (finalStats[stat] || 0) > (finalStats[max] || 0) ? stat : max, FLAT_STATS[0]);
    finalStats[largestStat]--;
  });

  return finalStats;
};

const formatStats = (stats) => {
  const formattedStats = {};
  Object.entries(stats).forEach(([stat, value]) => {
    if (FLAT_STATS.includes(stat)) {
      formattedStats[stat] = Math.floor(value);
    } else {
      if (stat === 'Max Ammo') {
        formattedStats[stat] = `${Math.floor(value)}`;
      } else {
        formattedStats[stat] = `${Math.floor(value)}%`;
      }
    }
  });
  return formattedStats;
};

export const calculateStats = (items, hero) => {
  const baseStats = createStatsCollection(hero);
  const itemStats = processItemStats(items);

  const combinedStats = { ...baseStats };
  Object.entries(itemStats).forEach(([stat, value]) => {
    if (combinedStats[stat]) {
      combinedStats[stat] += value;
    } else {
      combinedStats[stat] = value;
    }
  });

  const afterPercentage = applyPercentageItems(combinedStats, baseStats, items);
  const afterConversions = applyHealthConversions(afterPercentage, items);

  return formatStats(afterConversions); 
};

//   For MEKA Z-SERIES:
// 1. Calculate protected bonus = 8% of base health (before any modifications)
// 2. Apply 8% increase to current Health/Armor/Shields
// 3. Add the protected bonus to final Health
//
// For Rüstung von Wilhelm:
//   1. Calculate protected bonus = 15% of base health (before any modifications)
// 2. Apply 15% increase to current Health/Armor/Shields
// 3. Add the protected bonus to final Health
//
// So if we had base health of 150, and it was increased to 200 through items, the calculation would be:
//   MEKA Z-SERIES:
// - Protected bonus = 150 * 0.08 = 12
//   - Current stats get multiplied by 1.08 (200 * 1.08 = 216)
// - Final health = 216 + 12 = 228
//
// Rüstung von Wilhelm:
//   - Protected bonus = 150 * 0.15 = 23
//   - Current stats get multiplied by 1.15 (200 * 1.15 = 230)
// - Final health = 230 + 23 = 253
//
// The key point was that the protected bonus needs to be calculated from the original base health, not the modified health value

// powers that modify stat values
// 
// sleep regimen: 50 health
// permafrost: max health by 50% of AP
//
// powers that add regular extra stats
//
// shield stampede: +50 [Charge] Knockback Power
// lifelift: +50% [Particle Barrier] Size
// graviton anomaly: 25% Ultimate Cost Reduction
// megaphone: +20% [Amp It Up] Duration
// beat drop: 20% Ultimate Cost Reduction