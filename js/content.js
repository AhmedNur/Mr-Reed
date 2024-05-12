let scanTextRef = function(e){scanText(e)};
let lastScanned = "";
const weblio = "https://corsproxy.io/?https://ejje.weblio.jp/content/";
const directWeblioURL = "https://ejje.weblio.jp/content/";

document.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
        document.addEventListener("mousemove", scanTextRef);
    }
});

document.addEventListener("keyup", (event) => {
        document.removeEventListener("mousemove", scanTextRef);
});

document.addEventListener("click", event => {
    if(document.getElementById('mr-reed-popup') && !(document.getElementById('mr-reed-popup').contains(event.target))) {
        document.getElementById('mr-reed-popup').remove();
    }
})

function scanText(e) {
    let range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if(range.startContainer.nodeType == Node.TEXT_NODE && range.startContainer.parentElement.id != 'mr-reed-definition') {
        range.expand("word");
        let word = range?.toString().trim();
        if(!(word === lastScanned) && word !== "") {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", res => {
                let doc = new DOMParser().parseFromString(String(xhr.response), "text/html");
                let elements = doc.getElementsByClassName('content-explanation');
                if(elements.length > 0) {
                    injectPopup(word, elements[0].textContent.trim(), e.clientX, e.clientY);
                }
            });
            xhr.open("GET", weblio + word);
            xhr.send();

        }
        lastScanned = word;
    }
}

function injectPopup(word, definition, x, y) {
    if(definition === undefined || definition.length === 0){
        return;
    } else if (document.getElementById('mr-reed-popup')) {
        document.getElementById('mr-reed-popup').remove();
    }
    let popup = document.createElement("div");
    popup.id = 'mr-reed-popup';
    popup.style.backgroundColor = "#ffffff";
    popup.style.color = "#292d34";
    popup.style.position = "fixed";
    popup.style.top = (y+15) + "px";
    popup.style.left = x + "px";
    popup.style.width = "400px";
    popup.style.height = "fit-content";
    popup.style.padding = "10px";
    popup.style.boxShadow = "0 1px 9px rgba(0,0,0,0.08)";
    popup.style.border = "1px solid #e8eaed";
    popup.innerHTML = `<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; height: 30px;">
                        <h1 style="font-size: 20px;">${word}</h1>
                        <a id="weblio-link" href="${directWeblioURL + word}" target="_blank" style="margin: 0; text-decoration: none;
                        background-color: #564c46; color: #f9f1e9; height: 30px; text-align: center; line-height: 30px;
                        width: 85px; border-radius: 5px; box-shadow: 0 10px 25px rgba(16,30,54,0.1); position: relative;">詳しく見る</a>
                       </div>
                       <p id="mr-reed-definition">${definition}</p>`;
    document.body.appendChild(popup);
    document.getElementById('weblio-link').addEventListener('mouseout', (event) => {
        event.target.style.boxShadow = '0 10px 25px rgba(16,30,54,0.1)';
        event.target.style.margin = '0px';
    });
    document.getElementById('weblio-link').addEventListener('mouseover', (event) => {
        event.target.style.boxShadow = 'none';
        event.target.style.marginTop = '1px';
    });
}
