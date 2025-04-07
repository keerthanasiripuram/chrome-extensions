import { highlightBox, tooltipMap } from "../../../content-scripts/elementSelector1";
import { addToolTip, positionToolTip } from "./elementSelector.helpers";

//Add highlighter on mousemove event
export const mouseMoveHandler = (event: MouseEvent) => {
    const target = event.composedPath()[0] || event.target;
    if (target instanceof HTMLElement) {
        if (highlightBox && highlightBox !== target) {
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

//click handler to add the tooltip and disable all the event listeners
export const clickEvent = async (event: MouseEvent) => {
    chrome.runtime.sendMessage({ type: "disable-script" });
    const target = event.target as HTMLElement;
    if (target) {
        addToolTip(target);
    }
    document.removeEventListener("click", clickEvent);
}

export const getScrollableParents = (el: HTMLElement): HTMLElement[] => {
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

//add scroll event to every parent ancestor
export const attachScrollListeners = (target: HTMLElement, tooltip: HTMLDivElement) => {
    const scrollParents = getScrollableParents(target);
    const reposition = () => positionToolTip(target, tooltip);
    for (const parent of scrollParents) {
        parent.addEventListener("scroll", reposition);
    }
    window.addEventListener("scroll", reposition);
}

//hide or unhide tooltip based on visbility
export const visibilityObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
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
    { threshold: 0.9 }
);




