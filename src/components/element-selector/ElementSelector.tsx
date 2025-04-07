import { useState } from "react";
import { getCurrentTabId, sendTabsMessage } from "../../utils/helpers";

const ElementSelector = () => {

    const [isEnable, setIsEnable] = useState(true)

    const handleEnable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            sendTabsMessage(currentTabId, "script-injected");
            setIsEnable(false)
        }
        catch (error) {
            console.log("error in enabling", error);
        }
    };

    const handleDisable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            sendTabsMessage(currentTabId, "disable-script");
            setIsEnable(true)
        }
        catch (error) {
            console.log("error in disabling", error);
        }
    };

    return (
        <>
            <p>Element selector</p>
            {isEnable ? <button onClick={handleEnable}>Enable</button> :
                <button onClick={handleDisable}>Disable</button>}
        </>
    );
};

export default ElementSelector;


