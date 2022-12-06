import { IsLoggedInResponse, IsLoggedInResponseMessage } from "./Messages/IsLoggedIn";
import { AuthResponse } from "./Models/AuthResponse";
import { RegisterResponse } from "./Models/RegisterResponse";

export async function IsLoggedIn() : Promise<IsLoggedInResponse> {
    let token = await chrome.storage.local.get('auth_token');
    if(token){
        return {
            loggedIn: true,
            type: "IsLoggedInResponse"
        };
    }
    return {
        loggedIn: false,
        type: 'IsLoggedInResponse'
    };
}



export async function RegisterApp(url: string): Promise<RegisterResponse>{
    let reg: RegisterResponse = (await chrome.storage.local.get(['mstdnapp'])).mstdnapp;
    if (reg){
        return reg;
    }

    let redirectUri = chrome.identity.getRedirectURL();
    let client_name = 'Better Following';
    let scopes = 'read follow';
    let website = 'https://github.com/dillonrsmith/BetterFollowing';

    let body = [];

    body.push(`${encodeURIComponent('redirect_uris')}=${encodeURIComponent(redirectUri)}`);
    body.push(`${encodeURIComponent('client_name')}=${encodeURIComponent(client_name)}`);
    body.push(`${encodeURIComponent('scopes')}=${scopes}`);
    body.push(`${encodeURIComponent('website')}=${encodeURIComponent(website)}`);

    let resp = await fetch(`${url}/api/v1/apps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: body.join('&')
    });

    reg = await resp.json();

    chrome.storage.local.set({mstdnapp: reg}); 
    chrome.storage.local.set({mstdnuri: url});

    return reg;
}

export async function Login(url: string){
    let reg = await RegisterApp(url);
    chrome.identity.launchWebAuthFlow({
        url: `${url}/oauth/authorize?response_type=code&client_id=${reg.client_id}&redirect_uri=${encodeURIComponent(reg.redirect_uri)}&scope=read+follow`,     
        interactive: true   
    }, HandleCallback);
}

async function HandleCallback(url?: string){
    let authCode = url?.split('?')[1].split('=')[1] ?? '';

    let reg: RegisterResponse = (await chrome.storage.local.get(['mstdnapp'])).mstdnapp;
    let mstdnUrl: string = (await chrome.storage.local.get(['mstdnuri'])).mstdnuri;

    let body = [];

    body.push(`${encodeURIComponent('redirect_uri')}=${encodeURIComponent(reg.redirect_uri)}`);
    body.push(`${encodeURIComponent('client_id')}=${encodeURIComponent(reg.client_id)}`);
    body.push(`${encodeURIComponent('scope')}=read follow`);
    body.push(`${encodeURIComponent('grant_type')}=${encodeURIComponent('authorization_code')}`);
    body.push(`${encodeURIComponent('code')}=${encodeURIComponent(authCode)}`);

    let resp = await fetch(`${mstdnUrl}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: body.join('&')
    });

    let r : AuthResponse = await resp.json();
    chrome.storage.local.set({mstdn_auth: r});
}