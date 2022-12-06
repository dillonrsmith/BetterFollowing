import { json } from "stream/consumers";
import { FollowMessage } from "./Messages/FollowMessage";
import { AuthResponse } from "./Models/AuthResponse";
import { MastodonUser } from "./Models/MastodonUser";

export async function Follow(message: FollowMessage) : Promise<void> {
    let token: AuthResponse = (await chrome.storage.local.get(["mstdn_auth"])).mstdn_auth;

    let url: string = (await chrome.storage.local.get(["mstdnuri"])).mstdnuri;

    let resp = await fetch(url + '/api/v1/accounts/lookup?acct=' + message.id);
    let user : MastodonUser = await resp.json();

    let followUrl: string = `${url}/api/v1/accounts/${user.id}/`;
    if(message.follow === true){
        followUrl += 'follow';
        await fetch(followUrl, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`
            },
            body: JSON.stringify({reblogs: true}),
            method: 'POST'
        });
    } else {
        followUrl += 'unfollow';
        await fetch(followUrl, {
            headers:{
                'Authorization': `Bearer ${token.access_token}`
            },
            method: 'POST'
        });
    }
}