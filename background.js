chrome.webRequest.onBeforeRequest.addListener(details =>{
    // console.log(details.url);
    chrome.tabs.query({ active: true, currentWindow: true },  () =>{
        chrome.tabs.sendMessage(details.tabId, {actionName: "checkInjection", actionReqUrl: details.url}, async (response)=>{
            if (chrome.runtime.lastError) await sleep(250);
            if (!chrome.runtime.lastError) {
                if (!response) {
                    chrome.tabs.executeScript(
                        null, { file: "content.js" },
                        ()=>chrome.tabs.sendMessage(details.tabId, {actionName: "bindDate", actionReqUrl: details.url})
                    );
                    // console.log(">>Injectedd!!")
                } else {
                    // console.log(">>Already injected!");
                    chrome.tabs.sendMessage(details.tabId, {actionName: "bindDate", actionReqUrl: details.url});
                }
            }
        });
    });

}, {urls: [
    "https://teams.microsoft.com/api/nss/amer/v1/me/notificationSettings/team/*",
        "https://teams.microsoft.com/api/mt/amer/beta/users/fetch\?*",
    ]});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
