import { useState } from "react";
import { getCurrentTabId, sendTabsMessage } from "../../utils/helpers";

const ElementSelector = () => {

    const [isEnable, setIsEnable] = useState(true)

    const handleEnable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            const response = await sendTabsMessage(currentTabId, "script-injected");
            if (response.success) {
                setIsEnable(false)
            }
            else {
                console.warn("Script enable message failed or returned unsuccessful status.");
            }
        }
        catch (error) {
            console.log("error in enabling", error);
        }
    };

    const handleDisable = async () => {
        try {
            const currentTabId = await getCurrentTabId();
            const response = await sendTabsMessage(currentTabId, "disable-script");
            if (response.success) {
                setIsEnable(true)
            }
            else {
                console.warn("Script disable message failed or returned unsuccessful status.");
            }
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


