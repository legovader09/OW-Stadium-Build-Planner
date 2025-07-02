import React, { useState } from 'react';

const Changelog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
    document.querySelector('body').classList.toggle('overlay-open');
  };

  return (
    <>
      <button
        onClick={toggleOverlay}
        className="changelog-trigger"
        type="button"
      >
        CHANGELOG
      </button>

      {isOpen && (
        <div className="changelog overlay">
          <div className="changelog-content">
            <button
              type="button"
              onClick={toggleOverlay}
              className="overlay-close"
            >
              ×
            </button>
            <h3 className="changelog-title">Changelog</h3>
            <p className="changelog-date">2nd July 2025</p>
            <ul className="changelog-list">
              <li>Added missing assets for items and powers in previous patch note</li>
            </ul>
            <p className="changelog-date">28th June 2025</p>
            <ul className="changelog-list">
              <li>Added Sigma, Junkrat, and Zenyatta items and powers (still need to add item and hero images)</li>
              <li>Updated power and item stat changes for existing heroes to match the Patch Notes for Season 17 (pending icons) + 27th June Hotfix</li>
              <li><b>PLEASE NOTE: A lot of Reaper/Juno/Reinhardt builds may break due to items and/or powers being shifted to different categories.</b></li>
            </ul>
            <p className="changelog-date">1st June 2025</p>
            <ul className="changelog-list">
              <li>Updated item stats and prices to match Stadium Patch notes from 29th of May</li>
            </ul>
            <p className="changelog-date">22nd May 2025</p>
            <ul className="changelog-list">
              <li>Updated item stats and prices to match Stadium Patch notes from 20th of May</li>
              <li>Added Freja&apos;s items and powers</li>
              <li>Added Genji&apos;s missing Deflect-O-Bot Power</li>
            </ul>
            <p className="changelog-date">18th May 2025</p>
            <ul className="changelog-list">
              <li>Updated item stats to match Stadium Patch notes from 15th of May</li>
            </ul>
            <p className="changelog-date">9th May 2025</p>
            <ul className="changelog-list">
              <li>Updated item stats to match Stadium Patch notes from 8th of May</li>
            </ul>
            <p className="changelog-date">2nd May 2025</p>
            <ul className="changelog-list">
              <li>Added minimum cash indicator and information for general guidelines</li>
              <li>Updated item stats to match Stadium Patch notes from 1st of May</li>
            </ul>
            <p className="changelog-date">1st May 2025</p>
            <ul className="changelog-list">
              <li>Fixed Orisa&apos;s Spynstem Update and Restortify power icons being swapped around</li>
              <li>Added a share modal instead of directly copying the link for a more honest user experience.</li>
              <li>Added Orisa&apos;s missing Refraction Tiles item</li>
              <li>Fixed auto copy build copying to last round when skipping to it</li>
              <li>Visual feedback when changing rounds</li>
              <li>Improved visual feedback for when an item in the shop has been bought</li>
              <li>Added cost underneath each item to easily gauge prices</li>
              <li>Option to hide page title and description for less visual clutter</li>
            </ul>
            <p className="changelog-date">30th April 2025</p>
            <ul className="changelog-list">
              <li>Hotfix: Made search result highlight more apparent</li>
              <li>Fixed item Gloomgaunlet not applying 15% to Melee Damage stat bar</li>
              <li>Added search bar for item and power searching on your current hero</li>
              <li>Added remaining hero items and power assets</li>
              <li>Improved tooltip styling to allow for slightly more content per line</li>
              <li>Fix special stat not rendering icon in stat bar</li>
            </ul>
            <p className="changelog-date">29th April 2025</p>
            <ul className="changelog-list">
              <li>Added Ashe, Cassidy, Genji, and remaining Mei and Reaper item icons</li>
              <li>Added &apos;Extremely Random Build&apos; button</li>
              <li>Added round system, show items per round</li>
              <li>Added reset build button</li>
              <li>Fixed build cost not updating when changing hero, and a hero item is removed</li>
              <li>Added icons for Mei, Reaper, Ana, Mercy, and Moira</li>
              <li>Added tooltip for character stat bars</li>
              <li>Made item icons bigger on desktop</li>
              <li>Added a changelog</li>
              <li>Added build name text box</li>
              <li>Added button to toggle hiding characters (hides by default if viewing a shared build)</li>
              <li>Restructured share URL to be shorter and more concise. Old builds are still supported!</li>
              <li>Removed borders from hero icons unless active hero</li>
              <li>Minified hero data to save space on network requests</li>
              <li>Added IDs to heros for url builder</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Changelog;
