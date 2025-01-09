import CHARITIES from '../config/charities.js';

export const populateCharitySelect = () => {
    const select = document.getElementById('charity-select');
    
    Object.values(CHARITIES).forEach(charity => {
        const option = document.createElement('option');
        option.value = charity.value;
        option.textContent = charity.name;
        option.dataset.url = charity.url;
        option.dataset.logo = charity.logo;
        option.dataset.inputName = charity.inputName;
        option.dataset.hiddenInputs = JSON.stringify(charity.hiddenInputs);
        select.appendChild(option);
    });
};

export const applyCharityStyles = (charityValue) => {
    const charity = Object.values(CHARITIES).find(c => c.value === charityValue);
    if (!charity) return;

    document.body.classList.remove(...Object.values(CHARITIES).map(c => `charity-${c.value}`));
    document.body.classList.add(`charity-${charity.value}`, 'charity-selected');
};

export const setCharityLogo = (charityValue) => {
    const charity = Object.values(CHARITIES).find(c => c.value === charityValue);
    if (!charity) return;

    const siteLogo = document.getElementById('site-logo');
    siteLogo.src = charity.logo;
    siteLogo.style.height = '15vh';
    siteLogo.style.width = 'auto';
    siteLogo.style.display = 'block';
    siteLogo.style.margin = '25px 0px';
};

export const restoreStoredCharity = async () => {
    const storedCharity = localStorage.getItem('selectedCharity');
    const storedUrl = localStorage.getItem('selectedCharityUrl');
    const storedInputName = localStorage.getItem('selectedInputName');
    const storedHiddenInputs = localStorage.getItem('selectedHiddenInputs');

    if (!(storedCharity && storedUrl && storedInputName)) return false;

    const searchForm = document.getElementById('searchForm');
    searchForm.setAttribute('action', storedUrl);
    document.getElementById('myInput').setAttribute('name', storedInputName);

    // Show search section and update styles
    document.querySelector('.search-section').style.display = 'flex';
    applyCharityStyles(storedCharity);
    setCharityLogo(storedCharity);
    document.querySelector('.logo-section').style.background = 'rgba(255, 255, 255, 0.95)';

    // Restore hidden inputs
    if (storedHiddenInputs) {
        const hiddenInputs = JSON.parse(storedHiddenInputs);
        for (const [name, value] of Object.entries(hiddenInputs)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            input.classList.add('hidden-input');
            searchForm.appendChild(input);
        }
    }

    // Update UI
    document.querySelector('.charities-section').style.display = 'none';
    document.querySelector('.shortcode-container').style.display = 'block';
    
    // Import and call showTopSites
    const { showTopSites } = await import('../showTopSites.js');
    await showTopSites();

    return true;
}; 