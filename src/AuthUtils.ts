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
    redirectUri = redirectUri.substring(0, redirectUri.length - 1);
    let client_name = 'Better Following';
    let scopes = 'read follow';
    let website = 'https://github.com/dillonrsmith/BetterFollowing';

    let body = new FormData();   

    body.append('client_name', client_name);
    body.append('redirect_uris', redirectUri);
    body.append('scopes', scopes);
    body.append('website', website);

    let resp = await fetch(`${url}/api/v1/apps`, {
        method: 'POST',
        body: body
    });
    console.log(resp);

    reg = await resp.json();

    chrome.storage.local.set({mstdnapp: reg}); 
    chrome.storage.local.set({mstdnuri: url});

    return reg;
}

export async function Login(url: string){    
    let retPromise: Promise<void> | any;    
    let reg = await RegisterApp(url);
    
    chrome.identity.launchWebAuthFlow({
        url: `${url}/oauth/authorize?response_type=code&client_id=${encodeURIComponent(reg.client_id)}&redirect_uri=${encodeURIComponent(reg.redirect_uri)}&scope=read+follow`,     
        interactive: true   
    }, (url) => retPromise = HandleCallback(url));

    while(!retPromise){
        await new Promise(f => setTimeout(f, 250));
    }
    await retPromise;
}

async function HandleCallback(url?: string){
    let authCode = decodeURIComponent(url?.split('?')[1].split('=')[1] ?? '');

    let reg: RegisterResponse = (await chrome.storage.local.get(['mstdnapp'])).mstdnapp;
    let mstdnUrl: string = (await chrome.storage.local.get(['mstdnuri'])).mstdnuri;

    let body = new FormData();

    body.append('redirect_uri', reg.redirect_uri);
    body.append('client_id', reg.client_id);
    body.append('client_secret', reg.client_secret);
    body.append('scope', 'read follow');
    body.append('grant_type','authorization_code');
    body.append('code', authCode);

    let resp = await fetch(`${mstdnUrl}/oauth/token`, {
        method: 'POST',
        body: body
    });

    let r : AuthResponse = await resp.json();
    chrome.storage.local.set({mstdn_auth: r});    
}

