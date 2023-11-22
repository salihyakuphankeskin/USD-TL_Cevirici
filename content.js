var exchangeRate = 29;

function replaceDollarAmountsInText(textContent) {
    var dollarAmounts = textContent.match(/\$\d+(\.\d{1,2})?/g);

    if (dollarAmounts) {
        dollarAmounts.forEach(function (dollarAmount) {
            var numericValue = parseFloat(dollarAmount.replace(/\$/g, ''));
            var tlValue = (numericValue * exchangeRate).toFixed(2);
            textContent = textContent.replace(dollarAmount, tlValue + ' TL').replace('USD', '');
        });
    }

    return textContent;
}

function replaceDollarAmountsInNode(node) {
    if (node.nodeType === 3) { // Text node
        node.nodeValue = replaceDollarAmountsInText(node.nodeValue);
    } else if (node.childNodes && node.childNodes.length > 0) {
        for (var i = 0; i < node.childNodes.length; i++) {
            replaceDollarAmountsInNode(node.childNodes[i]);
        }
    }
}

function handleMutation(mutationsList) {
    mutationsList.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function (node) {
                replaceDollarAmountsInNode(node);
            });
        }
    });
}

function observeDOMChanges() {
    var targetNode = document.body;

    var observer = new MutationObserver(handleMutation);

    var config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
}

// Call the function on page load
replaceDollarAmountsInNode(document.body);

// Observe DOM changes to handle dynamically added content
observeDOMChanges();

// Add a listener to reload the script when a message is received
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'reloadContentScript') {
            replaceDollarAmountsInNode(document.body);
        }
    }
);
