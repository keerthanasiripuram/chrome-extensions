import { finder } from "@medv/finder";
import { TooltipMap, tooltipMap } from "../../../content-scripts/elementSelector1";
import { attachScrollListeners, visibilityObserver } from "./elementSelector.listeners";

//Methods to manage the tooltips in local storage
export const tooltipStorage = {
    getKey(selector: string): string {
        return `${location.pathname}::${selector}`;
    },

    getAll(): TooltipMap {
        const raw = localStorage.getItem("tooltips");
        return raw ? JSON.parse(raw) : {};
    },

    save(selector: string, text: string): void {
        const tooltips = this.getAll();
        const key = this.getKey(selector);
        tooltips[key] = text;
        localStorage.setItem("tooltips", JSON.stringify(tooltips));
    },

    get(selector: string): string | undefined {
        console.log("selctr", selector)
        const tooltips = this.getAll();
        const key = this.getKey(selector);
        return tooltips[key];
    },
};

//Function to position the tooltip
export const positionToolTip = (target: HTMLElement, tooltip: HTMLDivElement) => {
    const position = target.getBoundingClientRect();
    const toolTipWidth = tooltip.offsetWidth;

    let leftPosition = window.scrollX + position.left - toolTipWidth / 2;

    if (leftPosition < 0) {
        leftPosition = window.scrollX + position.right - toolTipWidth;
    }

    tooltip.style.top = `${window.scrollY + position.top}px`;
    tooltip.style.left = `${leftPosition}px`;
};

//Function to add Tooltip on screen
export const addToolTip = async (target: HTMLElement) => {

    //creation of tooltip
    const tooltip = document.createElement("div");
    const uniqueSelector = finder(target);
    const tooltipId = tooltipStorage.getKey(uniqueSelector);
    
    target.setAttribute("data-tooltip-id", tooltipId);

    Object.assign(tooltip.style, {
        position: "absolute",
        fontSize: "14px",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: "10",
    });

    //creation of input element
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

    //creation of span
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

    const storedText = tooltipStorage.get(uniqueSelector);
    if (storedText) {
        displayText.textContent = "!";
        displayText.style.display = "inline-block";
        input.style.display = "none";
        input.value = storedText;
    }

    //get the input text
    input.addEventListener("keypress", async (event) => {
        if (event.key === "Enter" && input.value.trim() !== "") {
            const newText = input.value;
            displayText.textContent = "!";
            displayText.style.display = "inline-block";
            input.style.setProperty("display", "none", "important");
            tooltipStorage.save(uniqueSelector, newText);
            positionToolTip(target, tooltip);
        }
    });

    //add the text to span on mouseenter
    displayText.addEventListener("mouseenter", () => {
        displayText.textContent = input.value;
    });
    displayText.addEventListener("mouseleave", () => {
        displayText.textContent = "!";
    });

    //add tooltip to body
    tooltip.appendChild(input);
    tooltip.appendChild(displayText);
    document.body.appendChild(tooltip);

    tooltipMap.set(target, tooltip);
    positionToolTip(target, tooltip);

    //register scroll and intersection observers to target
    visibilityObserver.observe(target);
    attachScrollListeners(target, tooltip);
};

//Function to restore tooltips which are saved in local storage
export const restoreAllTooltips = async () => {
    const tooltips = tooltipStorage.getAll();
    for (const fullSelector in tooltips) {
        const [path, selector] = fullSelector.split("::");
        if (path === location.pathname) {
            const target = document.querySelector(selector) as HTMLElement;
            if (target) {
                addToolTip(target);
            }
        }
    }
};






