// import { TabChanged } from "./Models/TabChanged";
// import {doTheThing} from "./main";
// import { url } from "inspector";
// import {MastodonInfo} from "./getMastadonInfo";
import {MastodonUser} from "./Models/MastodonUser";

chrome.tabs.onUpdated.addListener(handleUrlChanged);

export async function handleUrlChanged(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) : Promise<void>{    
    const t = await chrome.tabs.get(tabId);

    if(t && t.url && changeInfo.status && changeInfo.status === 'complete' && t.url.includes('following')){                
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["main.js"]
        }, (results: chrome.scripting.InjectionResult<void>[]): void => {            
        });        
    }
}