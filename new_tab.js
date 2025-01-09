import { populateCharitySelect, applyCharityStyles, setCharityLogo, restoreStoredCharity } from './js/services/charityService.js';
import { showTopSites } from './js/showTopSites.js';

document.addEventListener('DOMContentLoaded', () => {
    // Populate charity select
    populateCharitySelect();
    
    // Initially hide containers
    document.querySelector('.shortcode-container').style.display = 'none';
    document.querySelector('.search-section').style.display = 'none';
    
    // Handle charity selection
    document.getElementById('charity-submit').addEventListener('click', async function() {
        const charitySelect = document.getElementById('charity-select');
        const selectedOption = charitySelect.options[charitySelect.selectedIndex];
        if (!selectedOption.value) return;
        
        const selectedData = {
            url: selectedOption.dataset.url,
            logo: selectedOption.dataset.logo,
            inputName: selectedOption.dataset.inputName,
            hiddenInputs: JSON.parse(selectedOption.dataset.hiddenInputs)
        };
        
        // Show search section and update form
        document.querySelector('.search-section').style.display = 'flex';
        const searchForm = document.getElementById('searchForm');
        searchForm.setAttribute('action', selectedData.url);
        document.getElementById('myInput').setAttribute('name', selectedData.inputName);
        
        // Apply styles and update UI
        applyCharityStyles(selectedOption.value);
        setCharityLogo(selectedOption.value);
        document.querySelector('.logo-section').style.background = 'rgba(255, 255, 255, 0.95)';
        
        // Handle hidden inputs
        document.querySelectorAll('#searchForm .hidden-input').forEach(input => input.remove());
        for (const [name, value] of Object.entries(selectedData.hiddenInputs)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            input.classList.add('hidden-input');
            searchForm.appendChild(input);
        }
        
        // Store selections
        localStorage.setItem('selectedCharityUrl', selectedData.url);
        localStorage.setItem('selectedCharity', selectedOption.value);
        localStorage.setItem('selectedInputName', selectedData.inputName);
        localStorage.setItem('selectedHiddenInputs', JSON.stringify(selectedData.hiddenInputs));
        
        // Update UI
        document.querySelector('.charities-section').style.display = 'none';
        showTopSites();
        document.querySelector('.shortcode-container').style.display = 'block';
    });

    // Restore previous charity selection if it exists
    restoreStoredCharity();

    // Handle uninstall
    document.getElementById('uninstall').addEventListener('click', function() {
        chrome.management.uninstallSelf({showConfirmDialog: true});
    });
});
