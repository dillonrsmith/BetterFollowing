import { Follow } from "./FollowUtils";
import { FollowMessage, IsFollowMessage } from "./Messages/FollowMessage";
import { IsLoggedInRequest, IsLoggedInRequestMessage } from "./Messages/IsLoggedIn";
import { IsLoggedIn, Login } from "./AuthUtils";
import { AuthResponse } from "./Models/AuthResponse";
import { parse as URLParse } from "url";

export async function HandleMessages(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) : Promise<void> {
    if(IsFollowMessage(message) === true){
        let token: AuthResponse = (await chrome.storage.local.get('auth_token')).auth_token;
        if(!token || !token.access_token){
            var tab = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            let url = URLParse(tab[0].url ?? '');
            await Login(url.protocol + '//' + url.host ?? '');
        }
      await Follow(message);
      sendResponse('');
    } else if (IsLoggedInRequestMessage(message) === true){        
      sendResponse('');
    } else {        
      sendResponse('');
    }
}


