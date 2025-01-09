const THANKYOU_URL = "https://searchingforahighercause.com/thanks";
const UNINSTALL_URL = "https://searchingforahighercause.com/sorry";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["isThankYouPageWasOpened"], function ({ isThankYouPageWasOpened }) {
    if (!isThankYouPageWasOpened) {
      chrome.runtime.setUninstallURL(UNINSTALL_URL);

      // Optionally open a thank-you page
      chrome.tabs.create({ url: THANKYOU_URL });

      chrome.storage.sync.set({ isThankYouPageWasOpened: true });
    }
  });
});

