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
export async function showTopSites() {
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