import { getCurrentTabId, sendTabsMessage } from "../../utils/helpers";


const ElementSelector = () => {

    const handleEnable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            await sendTabsMessage(currentTabId, "script-injected");
        }
        catch (error) {
            console.log("error in enabling", error);
        }
    };

    const handleDisable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            await sendTabsMessage(currentTabId, "disable-script");
        }
        catch (error) {
            console.log("error in disabling", error);
        }
    };

    return (
        <>
            <p>Element selector</p>
            <button onClick={handleEnable}>Enable</button>
            <button onClick={handleDisable}>Disable</button>
        </>
    );
};

export default ElementSelector;


