const waitFor = (parentElement=null,...selectors) => new Promise(resolve => {
    const delay = 500
    const f = () => {
        const elements = selectors.map(selector => (parentElement || document).querySelector(selector))
        if (elements.some(element => element != null)) {
            resolve(elements)
        } else {
            setTimeout(f, delay)
        }
    }
    f()
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const bindDate = async(reqUrl) => {
    await waitFor(null, ".download-expiration");
    const dayCounterStart = 20;
    const recordingElements = [...document.querySelectorAll(".recording-content")];
    recordingElements.forEach((recEle, idx)=>{
        if (recEle.querySelector("#recordingDate") ||
            recEle.querySelector(".error-message").textContent.trim()==="Download Expired" ||
            recEle.querySelector(".recorder")) {
            return;
        }
        const daysToGo = parseInt(recEle.querySelector('.download-expiration').textContent.match(/\d+/)[0]);
        const newDateSpan = document.createElement('span');
        const d = new Date();
        d.setDate(d.getDate()-(dayCounterStart-daysToGo));
        const tempDateArray = d.toString().split(" ");
        newDateSpan.textContent = `${tempDateArray[0]}, ${tempDateArray[1]} ${tempDateArray[2]}`;
        newDateSpan.style = "font-size:1.2rem;"
        newDateSpan.setAttribute("id", "recordingDate");
        recEle.append(newDateSpan);
    });
    const viewMoreOrCollapseElements = [...document.querySelectorAll("thread-collapsed>div>div")];
    viewMoreOrCollapseElements.forEach(ele=>ele.addEventListener("click", () =>{
        sleep(500).then(bindDate);
    }));

};


chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    switch (request.actionName) {
        case "checkInjection":
            sendResponse({actionResponse: {injected: true}})
            break;
        case "bindDate":
            bindDate(request.actionReqUrl);
            break;
        default:
            break;
    }
});


// const viewMoreOrCollapseElements = [...document.querySelectorAll("thread-collapsed>div>div")];
// viewMoreOrCollapseElements.forEach(ele=>ele.addEventListener("click", ()=>domReady().then(bindDate)))


