document.addEventListener("mouseover", (event) => {
    // event.preventDefault(); // Prevent default actions (like links)
    event.stopPropagation(); // Stop event from bubbling up
    
    let clickedElement = event.target;
    if (!(clickedElement instanceof HTMLElement)) return; // Ensure clicked element is an HTMLElement
    
    clickedElement.style.border="1px solid red"
  });
 
  document.addEventListener("mouseout",(event)=>{
    event.stopPropagation(); // Stop event from bubbling up
    
    let clickedElement = event.target;
    if (!(clickedElement instanceof HTMLElement)) return;
    clickedElement.style.border="none"
  })

 

 


//fr disblng 

// function handleClick(event:MouseEvent) {
//     event.stopPropagation();
//     let clickedElement = event.target;
//     if (!(clickedElement instanceof HTMLElement)) return;
//     clickedElement.style.border = "1px solid red";
// }

// function handleMouseOver(event:MouseEvent) {
//     event.stopPropagation();
//     let hoveredElement = event.target;
//     if (!(hoveredElement instanceof HTMLElement)) return;
//     hoveredElement.style.border = "1px solid red";
// }

// function handleMouseOut(event:MouseEvent) {
//     event.stopPropagation();
//     let hoveredElement = event.target;
//     if (!(hoveredElement instanceof HTMLElement)) return;
//     hoveredElement.style.border = "none";
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "script-injected") {
//         chrome.storage.local.set({ isScriptInjected: true });
//         document.addEventListener("click", handleClick);
//         document.addEventListener("mouseover", handleMouseOver);
//         document.addEventListener("mouseout", handleMouseOut);
//         console.log("Script enabled.");
//     }

//     if (message.type === "disable-script") {
//         cleanUp();
//     }
// });

// function cleanUp() {
//     console.log("Cleaning up content script...");
//     document.removeEventListener("click", handleClick);
//     document.removeEventListener("mouseover", handleMouseOver);
//     document.removeEventListener("mouseout", handleMouseOut);

//     chrome.storage.local.remove("isScriptInjected");
// }
