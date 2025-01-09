// Function to check if an image exists
function checkImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Function to get top sites
function getTopSites() {
    return new Promise((resolve) => {
        chrome.topSites.get((sites) => resolve(sites));
    });
}

// Function to get favicon URL
async function getFaviconUrl(url) {
    const domain = new URL(url).hostname;
    const pngUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}&format=png`;
    const jpgUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}&format=jpg`;
    
    if (await checkImage(pngUrl)) return pngUrl;
    if (await checkImage(jpgUrl)) return jpgUrl;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}

// Function to show top sites
async function showTopSites() {
    if (!localStorage.getItem('selectedCharityUrl')) {
        document.querySelector('.shortcode').style.display = 'none';
        return;
    }
    
    document.querySelector('.shortcode').style.display = 'grid';
    
    try {
        const historyList = await getTopSites();
        const historyListItems = historyList.slice(0, 10);
        
        const historyUi = await Promise.all(historyListItems.map(async function(data) {
            const faviconUrl = await getFaviconUrl(data.url);
            return `
            <a href="${data.url}" class="top-site-link">
                <div class="item">
                    <img src="${faviconUrl}" alt="" onerror="this.src='img/default-favicon.png'">
                    <span>${data.title.length > 25 ? data.title.substring(0, 25) + '...' : data.title}</span>
                </div>
            </a>
            `;
        }));
        
        document.querySelector('.shortcode').innerHTML = historyUi.join('');
    } catch (error) {
        console.error('Error loading top sites:', error);
    }
}

// Attach event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initially hide both the shortcode container and search section
    document.querySelector('.shortcode-container').style.display = 'none';
    document.querySelector('.search-section').style.display = 'none';
    
    const charitySelect = document.getElementById('charity-select');
    const charitySubmit = document.getElementById('charity-submit');

    // Handle charity selection
    charitySubmit.addEventListener('click', async function() {
        const selectedOption = charitySelect.options[charitySelect.selectedIndex];
        if (!selectedOption.value) return;
        
        console.log('Selected charity:', selectedOption.value); // Debug log
        
        const selectedData = {
            url: selectedOption.getAttribute('data-url'),
            logo: selectedOption.getAttribute('data-logo'),
            inputName: selectedOption.getAttribute('data-input-name'),
            hiddenInputs: JSON.parse(selectedOption.getAttribute('data-hidden-inputs'))
        };
        
        console.log('Selected data:', selectedData); // Debug log
        
        // Show search section when charity is selected
        document.querySelector('.search-section').style.display = 'flex';
        
        const searchForm = document.getElementById('searchForm');
        const siteLogo = document.getElementById('site-logo');
        
        // Update form with selected charity data
        searchForm.setAttribute('action', selectedData.url);
        document.getElementById('myInput').setAttribute('name', selectedData.inputName);
        
        // Set logo path based on selection
        if (selectedOption.value === 'ashreinu') {
            siteLogo.src = 'Charity/Ashreinu/logo/logo.png';
        } else if (selectedOption.value === 'lev-hatorah') {
            siteLogo.src = 'Charity/Lev_Hatorah/logo/logo.png';
        } else if (selectedOption.value === 'tifferet') {
            siteLogo.src = 'Charity/Tifferet/logo/logo.png';
        }
        
        siteLogo.style.height = '15vh';
        siteLogo.style.width = 'auto';
        siteLogo.style.display = 'block';
        siteLogo.style.margin = '25px 0px';

        // Update logo section background
        document.querySelector('.logo-section').style.background = 'rgba(255, 255, 255, 0.95)';

        // Add error handling for logo loading
        siteLogo.onerror = function() {
            console.error('Error loading logo:', this.src);
            this.src = 'img/default-logo.png';
        };

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

        // Store selections in localStorage
        localStorage.setItem('selectedCharityUrl', selectedData.url);
        localStorage.setItem('selectedCharity', selectedOption.value);
        localStorage.setItem('selectedInputName', selectedData.inputName);
        localStorage.setItem('selectedHiddenInputs', JSON.stringify(selectedData.hiddenInputs));

        // Hide charities section and show top sites
        document.querySelector('.charities-section').style.display = 'none';
        showTopSites();

        // Add class to body when charity is selected
        document.body.classList.add('charity-selected');
        document.body.classList.add(`charity-${selectedOption.value}`);

        // Remove any existing charity classes
        document.body.classList.remove('charity-ashreinu', 'charity-lev-hatorah', 'charity-tifferet');

        // Add the selected charity class to body
        document.body.classList.add(`charity-${selectedOption.value}`);

        // Store the selected charity class
        localStorage.setItem('selectedCharityClass', `charity-${selectedOption.value}`);

        // Show the shortcode container
        document.querySelector('.shortcode-container').style.display = 'block';
    });

    // Restore stored charity selection
    const storedUrl = localStorage.getItem('selectedCharityUrl');
    const storedCharity = localStorage.getItem('selectedCharity');
    const storedInputName = localStorage.getItem('selectedInputName');
    const storedHiddenInputs = localStorage.getItem('selectedHiddenInputs');

    if (storedUrl && storedCharity && storedInputName) {
        const searchForm = document.getElementById('searchForm');
        const siteLogo = document.getElementById('site-logo');
        
        searchForm.setAttribute('action', storedUrl);
        document.getElementById('myInput').setAttribute('name', storedInputName);
        
        // Show search section
        document.querySelector('.search-section').style.display = 'flex';

        // Set logo based on stored charity
        if (storedCharity === 'ashreinu') {
            siteLogo.src = 'Charity/Ashreinu/logo/logo.png';
        } else if (storedCharity === 'lev-hatorah') {
            siteLogo.src = 'Charity/Lev_Hatorah/logo/logo.png';
        } else if (storedCharity === 'tifferet') {
            siteLogo.src = 'Charity/Tifferet/logo/logo.png';
        } else if (storedCharity === 'make-it') {
            siteLogo.src = 'Charity/MakeIt/logo/Make_It.png';
        }

        siteLogo.style.height = '15vh';
        siteLogo.style.width = 'auto';
        siteLogo.style.display = 'block';
        siteLogo.style.margin = '25px 0px';

        // Update logo section background
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

        document.querySelector('.charities-section').style.display = 'none';
        showTopSites();
        document.body.classList.add('charity-selected');
        document.body.classList.add(`charity-${storedCharity}`);

        const storedCharityClass = localStorage.getItem('selectedCharityClass');
        if (storedCharityClass) {
            // Remove any existing charity classes
            document.body.classList.remove('charity-ashreinu', 'charity-lev-hatorah', 'charity-tifferet');
            // Add the stored charity class
            document.body.classList.add(storedCharityClass);
        }
    }

    // Handle uninstall
    document.getElementById('uninstall').addEventListener('click', function() {
        chrome.management.uninstallSelf({showConfirmDialog: true});
    });

    // In the restoration code, show the container if a charity was previously selected
    if (storedUrl) {
        document.querySelector('.shortcode-container').style.display = 'block';
    } else {
        document.querySelector('.shortcode-container').style.display = 'none';
    }
});
