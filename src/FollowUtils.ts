import { json } from "stream/consumers";
import { FollowMessage, GetFollowingResponse } from "./Messages/FollowMessage";
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

export async function GetFollowing() : Promise<GetFollowingResponse> {
    let token: AuthResponse = (await chrome.storage.local.get(["mstdn_auth"])).mstdn_auth;
    let url: string = (await chrome.storage.local.get(["mstdnuri"])).mstdnuri;
    let resp = await fetch(url + '/api/v1/accounts/verify_credentials', 
    {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        }
    });
    let account = await resp.json();
    let acctId = account.id;

    return {
        type: 'GetFollowingResponse',
        following: await get(url, token.access_token, acctId)
    };
}

async function get(url:string, token: string, acctId: string) : Promise<MastodonUser[]> {
    let resp = await fetch(url + '/api/v1/accounts/' + acctId + '/following', {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    let users : MastodonUser[] = await resp.json();
    
    while(resp.headers.has('Link')){
        let linkHeader = resp.headers.get('Link');
        if(linkHeader?.includes('rel="next"') === true){
            let nextLink = linkHeader?.split(';')[0];
            nextLink = nextLink?.substring(1);
            resp = await fetch(nextLink?.substring(0, nextLink.length - 1) ?? '', {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });  
            users.push(await resp.json());
        }
        else {
            break;
        }

    }
    return users;
}