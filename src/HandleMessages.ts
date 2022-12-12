import { Follow } from "./FollowUtils";
import { FollowMessage, IsFollowMessage } from "./Messages/FollowMessage";
import { IsLoggedInRequest, IsLoggedInRequestMessage, IsLoggedInResponse } from "./Messages/IsLoggedIn";
import { IsLoggedIn, Login } from "./AuthUtils";
import { AuthResponse } from "./Models/AuthResponse";
import { parse as URLParse } from "url";
import { IsLoginRequest, IsLogoutRequest, LoginRequest, LoginResponse } from "./Messages/Login";

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
      let token: AuthResponse = (await chrome.storage.local.get('auth_token')).auth_token;
      let response: IsLoggedInResponse = {
        loggedIn: false,
        type: 'IsLoggedInResponse'
      };
      if(!token || !token.access_token){
          sendResponse(response);
      } else{
        response.loggedIn = true;
        sendResponse(response);
      }
      sendResponse('');
    } else if(IsLoginRequest(message) === true){
        await Login(message.url);
        let token: AuthResponse = (await chrome.storage.local.get('auth_token')).auth_token;
        let response: LoginResponse = {
          loggedIn: false,
          type: 'LoginResponse'
        };
        if(!token || !token.access_token){
            sendResponse(response);
        } else{
          response.loggedIn = true;
          sendResponse(response);
        }
    } else if (IsLogoutRequest(message) === true){
      chrome.storage.local.clear();
    } else {        
      sendResponse('');
    }
}


