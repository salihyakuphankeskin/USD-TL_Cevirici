document.addEventListener('DOMContentLoaded', function () {
    // Add a click event listener to the button only if the extension is on the Steam store site
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].url.startsWith("https://store.steampowered.com/")) {
            document.getElementById('reloadButton').addEventListener('click', function () {
                // Reload the content script logic by sending a message to the content script
                chrome.tabs.sendMessage(tabs[0].id, { action: 'reloadContentScript' });
            });
        }
    });
});
