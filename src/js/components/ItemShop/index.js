import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Item from './components/Item';
import RenderAttributeString from './components/RenderAttributeString';
import { PowerCard } from './components/PowerCard';

import formatCurrency from '../../helpers/formatCurrency';
import SearchBar from './components/SearchBar';

const ItemShop = ({
  data, getIcon, context, contextCallback,
}) => {
  const [activeTab, setActiveTab] = useState('weapon');
  const [highlightedItem, setHighlightedItem] = useState(null);
  const isSearchResultTab = useRef(false);

  useEffect(() => {
    if (!isSearchResultTab.current) {
      setHighlightedItem(null);
    }
    isSearchResultTab.current = false;
  }, [activeTab]);

  const handleSearchTabChange = (newTab) => {
    isSearchResultTab.current = true;
    setActiveTab(newTab);
  };

  const renderRaritySection = (items, rarity) => {
    const sortedItems = items.sort((a, b) => {
      if (a.character && !b.character) return 1;
      if (!a.character && b.character) return -1;
      return 0;
    });

    return (
      <div key={rarity} className="col-12 col-md-4 rarity-section px-1">
        <h5 className="rarity-section--title ps-2">
          {rarity.toUpperCase()}
        </h5>
        <div className="container">
          <div className="row">
            {sortedItems.map((item) => {
              const { character, items, round } = context;
              if (item.character && item.character !== character) return null;
              const currentRoundItems = items[round] || [];

              return (
                <div key={item.name} className={`col-4 buyable-item item-${rarity}`}>
                  <Item
                    item={item}
                    src={getIcon(item.name) || ''}
                    onClick={() => contextCallback(item, 'items', rarity)}
                    selected={currentRoundItems.find((i) => i.name === item.name)}
                    isHeroItem={item.character !== undefined}
                    isHighlighted={highlightedItem === item.name}
                  />
                  <p className="buyable-item--cost"><img
                    className="currency currency--small"
                    src={getIcon('currency')}
                    alt="Currency"
                  /><span>{formatCurrency(item.cost)}</span>
                  </p>
                  <div className="tooltip-container bordered bordered-side">
                    <div className="tooltip-content">
                      <p className="tooltip-content--title">{item.name}</p>
                      {item.character && <p className="tooltip-content--subtitle">HERO ITEM</p>}
                      <hr />
                      <ul>
                        {item.attributes.map((attr, index) => (
                          <li
                            key={`${attr.type}_${index.toString()}`}
                            className={`${attr.type !== 'description' ? 'tooltip-content--attribute' : ''}`}
                          >
                            <RenderAttributeString getIcon={getIcon} attr={attr} />
                          </li>
                        ))}
                      </ul>
                      <hr />
                      <p><img
                        className="currency currency--small"
                        src={getIcon('currency')}
                        alt="Currency"
                      /><span>{formatCurrency(item.cost)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPowerSection = (powers, char) => (
    <div key={char} className="col-12 power-section px-1">
      <div className="container">
        <div className="row">
          {powers.map((power) => {
            const { character, powers } = context;
            if (char && char !== character) return null;
            return (
              <div key={power.name} className="col-12 col-md-4 buyable-item buyable-item--power">
                <PowerCard
                  name={power.name}
                  description={power.description}
                  src={getIcon(power.name) || ''}
                  onClick={() => contextCallback(power, 'powers')}
                  selected={powers.find((p) => p.name === power.name)}
                  isHighlighted={highlightedItem === power.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="item-shop">
      <div className="row px-0 mx-0 tabs">
        <section className="col-auto px-0 mx-0 tabs-headers">
          {Object.keys(data.tabs).map((tabName) => (
            <button
              key={tabName}
              type="button"
              className={`col col-md-auto tab-button ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName.toUpperCase()}
            </button>
          ))}
        </section>
        <SearchBar
          data={data}
          getIcon={getIcon}
          onTabChange={handleSearchTabChange}
          onHighlight={setHighlightedItem}
          character={context.character}
        />
      </div>

      <div className="container tab-content">
        <div className="row justify-content-center">
          {Object.entries(data.tabs[activeTab]).map(([rarity, items]) => (
            activeTab === 'powers' ? renderPowerSection(items, rarity) : renderRaritySection(items, rarity)))}
        </div>
      </div>
    </div>
  );
};

ItemShop.propTypes = {
  data: PropTypes.shape({
    tabs: PropTypes.objectOf(
      PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        cost: PropTypes.number,
        attributes: PropTypes.arrayOf(PropTypes.shape({
          type: PropTypes.string.isRequired,
        })),
        character: PropTypes.string,
      }))),
    ).isRequired,
  }).isRequired,
  getIcon: PropTypes.func.isRequired,
  context: PropTypes.shape({
    character: PropTypes.string,
    items: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      cost: PropTypes.number,
      attributes: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
      })),
    }))),
    powers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    })),
    round: PropTypes.number.isRequired,
  }).isRequired,
  contextCallback: PropTypes.func.isRequired,
};

export default ItemShop;
