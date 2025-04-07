const TOOLTIP_CLASS = "custom-tooltip";
const TOOLTIP_STORAGE_KEY = "tooltipData";

// Interface for tooltip data
interface TooltipData {
    selector: string;
    text: string;
}

// Function to create a tooltip
function createTooltip(target: HTMLElement, text: string): HTMLDivElement {
    const tooltip = document.createElement("div");
    tooltip.className = TOOLTIP_CLASS;
    tooltip.textContent = text;
    tooltip.dataset.selector = getUniqueSelector(target);

    Object.assign(tooltip.style, {
        position: "absolute",
        background: "black",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: "1000",
        pointerEvents: "none"
    });

    document.body.appendChild(tooltip);
    positionTooltip(target, tooltip);

    return tooltip;
}

// Function to position the tooltip correctly
function positionTooltip(target: HTMLElement, tooltip: HTMLDivElement): void {
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.top - tooltip.offsetHeight - 5}px`;
    tooltip.style.left = `${window.scrollX + rect.left}px`;
}

// Store tooltip data in localStorage
function saveTooltipData(selector: string, text: string): void {
    let tooltipData: TooltipData[] = JSON.parse(localStorage.getItem(TOOLTIP_STORAGE_KEY) || "[]");
    
    if (!tooltipData.find(item => item.selector === selector)) {
        tooltipData.push({ selector, text });
        localStorage.setItem(TOOLTIP_STORAGE_KEY, JSON.stringify(tooltipData));
    }
}

// Restore tooltips when the page loads
function restoreTooltips(): void {
    const tooltipData: TooltipData[] = JSON.parse(localStorage.getItem(TOOLTIP_STORAGE_KEY) || "[]");

    tooltipData.forEach(({ selector, text }) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) createTooltip(element, text);
    });
}

// Handle click event to add a tooltip
document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const selector = getUniqueSelector(target);
    const text = prompt("Enter tooltip text:", "Tooltip");

    if (text) {
        createTooltip(target, text);
        saveTooltipData(selector, text);
    }
});

// Adjust tooltip position on scroll
document.addEventListener("scroll", () => {
    document.querySelectorAll(`.${TOOLTIP_CLASS}`).forEach((tooltip) => {
        const tooltipElement = tooltip as HTMLDivElement;
        const selector = tooltipElement.dataset.selector;
        if (selector) {
            const target = document.querySelector(selector) as HTMLElement;
            if (target) positionTooltip(target, tooltipElement);
        }
    });
});

// Observe DOM changes and re-add tooltips
new MutationObserver(() => restoreTooltips()).observe(document.body, { childList: true, subtree: true });

// Generate a unique CSS selector for an element
function getUniqueSelector(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;
    if (el.className) return `.${el.className.trim().replace(/\s+/g, ".")}`;
    return el.tagName.toLowerCase();
}

// Restore tooltips when the script loads
restoreTooltips();
