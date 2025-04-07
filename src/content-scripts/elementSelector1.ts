import { positionToolTip, restoreAllTooltips } from "../utils/content-script-helpers/element-selector/elementSelector.helpers";
import { clickEvent, mouseMoveHandler } from "../utils/content-script-helpers/element-selector/elementSelector.listeners";

export type TooltipMap = Record<string, string>;
export const tooltipMap = new Map<HTMLElement, HTMLDivElement>();

//highlighter creation
export const highlightBox = document.createElement("div");

Object.assign(highlightBox.style, {
  position: "absolute",
  border: "2px solid cyan",
  pointerEvents: "none",
  display: "none",
  zIndex: 999,
});

// Handle iframes
if (window.top !== window.self) {
  console.log("Inside iframe")
  window.document.addEventListener("mouseenter", () => {
    console.log("Inside ifrme mouseentered")
    window.parent.postMessage({ action: "mouseEnteredIframe" }, "*");
  });
  window.document.addEventListener("mouseleave", () => {
    console.log("inside iframe mouseleave");

    highlightBox.style.display = "none";
  });
}

const messageHandler = (event: MessageEvent) => {
  if (event.data.action === "mouseEnteredIframe") {
    console.log("mouseentrdifrme");

    highlightBox.style.display = "none";
  }
};

chrome.runtime.onMessage.addListener((message) => {
  //disable listeners
  if (message.type === "disable-script") {
    console.log(message)
    console.log("disabling")
    document.removeEventListener("mousemove", mouseMoveHandler);
    window.removeEventListener("message", messageHandler);
    highlightBox.remove();
    document.removeEventListener("click", clickEvent)
  }

  //enable listeners
  if (message.type === "script-injected") {
    console.log("injected")
    console.log(highlightBox)
    document.body.appendChild(highlightBox);
    document.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("message", messageHandler);
    document.addEventListener("click", clickEvent);
  }
});

//postion tooltip on resize
window.addEventListener("resize", () => {
  for (const [target, tooltip] of tooltipMap.entries()) {
    positionToolTip(target, tooltip);
  }
});

//Function to load all tooltips on reload using Mutation Observer

const observer = new MutationObserver(() => {
  observer.disconnect();
  restoreAllTooltips()
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
})


observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});



