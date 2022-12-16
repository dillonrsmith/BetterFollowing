import { Follow, GetFollowing } from "./FollowUtils";
import { FollowMessage, GetFollowingResponse, IsFollowMessage, IsGetFollowingMessage } from "./Messages/FollowMessage";
import { IsLoggedInRequest, IsLoggedInRequestMessage, IsLoggedInResponse } from "./Messages/IsLoggedIn";
import { IsLoggedIn, Login } from "./AuthUtils";
import { AuthResponse } from "./Models/AuthResponse";
import { parse as URLParse } from "url";
import { IsLoginRequest, IsLogoutRequest, LoginRequest, LoginResponse } from "./Messages/Login";

export async function HandleMessages(message: any, sender: chrome.runtime.MessageSender): Promise<any> {
  if (IsFollowMessage(message) === true) {    
    let isLoggedIn = await IsLoggedIn();
    if (isLoggedIn.loggedIn === false) {
      return;
    }
    await Follow(message);
  } else if (IsLoggedInRequestMessage(message) === true) {
    return await IsLoggedIn();
  } else if (IsLoginRequest(message) === true) {
    await Login(message.url);
    let res = await chrome.storage.local.get(["mstdn_auth"]);
    let token: AuthResponse = res.mstdn_auth;
    let response: LoginResponse = {
      loggedIn: false,
      type: 'LoginResponse'
    };
    if (!token || !token.access_token) {
      return response;
    } else {
      response.loggedIn = true;
      return response;
    }
  } else if (IsLogoutRequest(message) === true) {
    chrome.storage.local.clear();
  } else if (IsGetFollowingMessage(message) === true) {
    let isLoggedIn = await IsLoggedIn();
    var followingResp : GetFollowingResponse = {
      type: 'GetFollowingResponse',
      following: []
    }
    if (isLoggedIn.loggedIn === false) {
      return followingResp;
    } else{
      return await GetFollowing();
    }

  }
}


