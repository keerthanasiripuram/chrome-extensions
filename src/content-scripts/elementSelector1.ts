let highlightBox = document.createElement("div");

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

const mouseMoveHandler = (event: MouseEvent) => {
    const target = event.composedPath()[0] || event.target;
    if (target instanceof HTMLElement) {
        if (highlightBox && highlightBox !== target) {
            console.log("mousemove display none");

            highlightBox.style.display = "none";
        }
        let rect = target.getBoundingClientRect();
        highlightBox.style.width = `${rect.width}px`;
        highlightBox.style.height = `${rect.height}px`;
        highlightBox.style.top = `${window.scrollY + rect.top}px`;
        highlightBox.style.left = `${window.scrollX + rect.left}px`;
        highlightBox.style.display = "block";
    }
};

const messageHandler = (event: MessageEvent) => {
    if (event.data.action === "mouseEnteredIframe") {
        console.log("mouseentrdifrme");

        highlightBox.style.display = "none";
    }
    // if (event.data.action === "disableHighlight") {
    //     console.log("disablehighlight");
    //     document.removeEventListener("click",clickEvent)
    //     document.removeEventListener("mousemove", mouseMoveHandler);
    //     highlightBox.style.display = "none";
    //     //Forward message to nested iframes (grandchildren)
    //     document.querySelectorAll("iframe").forEach((iframe) => {
    //         console.log("disabling grand child");

    //         iframe.contentWindow?.postMessage({ action: "disableHighlight" }, "*");
    //     });

    // }
    // if (event.data.action === "iframeClicked") {
    //     console.log("Iframe clicked — disabling highlight on parent too.");
    //     document.removeEventListener("mousemove", mouseMoveHandler);
    //     document.removeEventListener("click",clickEvent)
    //     // highlightBox.remove();
    //     highlightBox.style.display = "none";
    //     // Forward to other child iframes if needed
    //     Array.from(document.querySelectorAll("iframe")).forEach((iframe) => {
    //         iframe.contentWindow?.postMessage({ action: "disableHighlight" }, "*");
    //     });
    // }

};

// const clickEvent = async (event: MouseEvent) => {
//     console.log("clickeddd")
//     // Notify parent to disable itself too
//     window.top?.postMessage({ action: "iframeClicked" }, "*");
//     const target = event.target as HTMLElement;
//     if (target) {
//         addToolTip(target);
//     }
//     // setTimeout(() => {
//     //     document.removeEventListener("click", clickEvent);
//     // }, 1);
//     document.removeEventListener("click",clickEvent)
// }

const clickEvent = async (event: MouseEvent) => {
    console.log("clickeddd");

    // ✅ Send message to background to disable script in all frames
    chrome.runtime.sendMessage({ type: "disable-script" });


    const target = event.target as HTMLElement;
    if (target) {
        addToolTip(target);
    }

    // // 🔁 Remove this click listener after execution
    document.removeEventListener("click", clickEvent);
}

chrome.runtime.onMessage.addListener((message) => {

    if (message.type === "disable-script") {
        console.log(message)
        console.log("disabling")
        document.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("message", messageHandler);
        highlightBox.remove();
        document.removeEventListener("click", clickEvent)
    }

    if (message.type === "script-injected") {
        console.log("injected")
        console.log(highlightBox)
        document.body.appendChild(highlightBox);
        document.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("message", messageHandler);//solves ifrme issue
        document.addEventListener("click", clickEvent);
    }
});

import { finder } from "@medv/finder";

type TooltipMap = Record<string, string>;

const tooltipStorage = {
   getAll():TooltipMap {
    const raw = localStorage.getItem("tooltips");
    return raw ? JSON.parse(raw) : {};
  },
   save(selector: string, text: string): void {
    const tooltips =  this.getAll();
    tooltips[selector] = text;
    localStorage.setItem("tooltips", JSON.stringify(tooltips));
    console.log("strng",tooltips)
  },
};

const tooltipMap = new Map<HTMLElement, HTMLDivElement>();//why ds is crtd, wat it holds ex:, wat not drctly use type TooltipMap = Record<string, string>;
//are we strng data in MAP<HTMLELE,ELE> in strge or <strng,strng> like mntd abve

const positionToolTip = (target: HTMLElement, tooltip: HTMLDivElement) => {
  const position = target.getBoundingClientRect();
  const toolTipWidth = tooltip.offsetWidth;
  let leftPosition = window.scrollX + position.left - toolTipWidth / 2;

  if (leftPosition < 0) {
    leftPosition = window.scrollX + position.right - toolTipWidth;
  }

  tooltip.style.top = `${window.scrollY + position.top}px`;
  tooltip.style.left = `${leftPosition}px`;
};

function getScrollableParents(el: HTMLElement): HTMLElement[] {//why ds, explain the types also used
  const scrollParents: HTMLElement[] = [];
  let parent = el.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      scrollParents.push(parent);
    }
    parent = parent.parentElement;
  }
  return scrollParents;
}

function attachScrollListeners(target: HTMLElement, tooltip: HTMLDivElement) {//why ds mthd again
  const scrollParents = getScrollableParents(target);
  const reposition = () => positionToolTip(target, tooltip);//explain ds syntax

  for (const parent of scrollParents) {
    parent.addEventListener("scroll", reposition);//diff b/w ds and windw.addevntlstr scroll
  }
  window.addEventListener("scroll", reposition);
}

const visibilityObserver = new IntersectionObserver(
  (entries) => {
    console.log(entries)
    entries.forEach((entry) => {
      console.log(entry,"entryyyyy")
      console.log(entry.target,"targg")
      console.log(tooltipMap,"mapppp")
      const target = entry.target as HTMLElement;
      const tooltip = tooltipMap.get(target);
      if (tooltip) {
        if (entry.intersectionRatio === 0) {
          tooltip.style.display = "none";
        } else {
          tooltip.style.display = "block";
          positionToolTip(target, tooltip);
        }
      }
    });
  },
  { threshold: 0.1 }
);

const addToolTip = async (target: HTMLElement) => {
  const tooltip = document.createElement("div");
  const uniqueSelector = finder(target);
  target.setAttribute("data-tooltip-id", uniqueSelector);

  Object.assign(tooltip.style, {
    position: "absolute",
    fontSize: "14px",
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    zIndex: "9999",
  });

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter text...";
  Object.assign(input.style, {
    padding: "5px",
    position: "relative",
    color: "red",
    borderRadius: "3px",
    border: "1px solid white",
    backgroundColor: "black",
    marginRight: "5px",
  });

  const displayText = document.createElement("span");
  displayText.textContent = "!";
  Object.assign(displayText.style, {
    position: "absolute",
    display: "none",
    color: "green",
    borderRadius: "50%",
    backgroundColor: "red",
    padding: "5px 10px",
    transition: "opacity 0.3s ease",
    cursor: "pointer",
  });

  const tooltipId = target.getAttribute("data-tooltip-id");
  if (!tooltipId) return;

  const savedTooltips =  tooltipStorage.getAll();
  let storedText = savedTooltips[tooltipId] || "";

  if (storedText) {
    displayText.textContent = "!";
    displayText.style.display = "inline-block";
    input.style.display = "none";
  }

  input.value = storedText;

  input.addEventListener("keypress", async (event) => {
    if (event.key === "Enter" && input.value.trim() !== "") {
      storedText = input.value;
      displayText.textContent = "!";
      displayText.style.display = "inline-block";
      input.style.setProperty("display", "none", "important");

       tooltipStorage.save(tooltipId, storedText);
      positionToolTip(target, tooltip);
    }
  });

  displayText.addEventListener("mouseenter", () => {
    displayText.textContent = storedText;
  });
  displayText.addEventListener("mouseleave", () => {
    displayText.textContent = "!";
  });

  tooltip.appendChild(input);
  tooltip.appendChild(displayText);
  document.body.appendChild(tooltip);

  tooltipMap.set(target, tooltip);//wat is ds and why it is reqrd
  console.log("map",tooltipMap)
  positionToolTip(target, tooltip);

  visibilityObserver.observe(target);//
  attachScrollListeners(target, tooltip);//why abve obsrve used drctly and why it is wrpd
};

const restoreAllTooltips = async () => {
  const tooltips = await tooltipStorage.getAll();
  for (const selector in tooltips) {
    const target = document.querySelector(selector) as HTMLElement;
    if (target) {
      addToolTip(target);
    }
  }
};

setTimeout(() => {
  restoreAllTooltips();
}, 1000);
