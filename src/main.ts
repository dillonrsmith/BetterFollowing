import { MastodonInfo } from "./getMastadonInfo";
import { FollowMessage, GetFollowingResponse } from "./Messages/FollowMessage";
import { IsLoggedInResponse } from "./Messages/IsLoggedIn";
import { MastodonUser } from "./Models/MastodonUser";



export async function doTheThing() {
    const thisUrl: string = document.location.origin;    
    
    let isLoggedIn: IsLoggedInResponse = await chrome.runtime.sendMessage({
        type: 'IsLoggedInRequest'
    });

    let followers: GetFollowingResponse = await chrome.runtime.sendMessage({
        type: 'GetFollowingMessage'
    });

    window.Following = followers.following

    if (document.location.href !== undefined && document.location.href.includes('following') && document.location.href.split('@').length === 3) {        
        let mi = new MastodonInfo();
        let wf = getWebfinger(document.location.href);
        mi.getFollowing(wf).then((value: MastodonUser[]) => {
            addUsersToScreen(value, thisUrl, mi, wf, isLoggedIn);
        }, (reason: any) => {

        });
    }
    else {

    }
}
function addUsersToScreen(value: MastodonUser[], thisUrl: string, mi: MastodonInfo, wf: string | undefined, isLoggedIn: IsLoggedInResponse): void{
    let feed = document.querySelector('[role="feed"]');
    if(!feed){
        feed = document.querySelector('.empty-column-indicator');
        feed?.setAttribute('class', 'item-list');
        feed?.setAttribute('role', 'feed');
    }

    

    let nextLoaderOld = document.getElementById('nextLoader');
    if(nextLoaderOld){
        feed?.removeChild(nextLoaderOld);
    }

    value.forEach(user => {
        let userId: string = user.acct;
        
        if(user.acct.split('@').length === 1){
            userId = userId + '@' + mi.getMastodonInstance(wf);
        } else if(user.acct.includes(document.location.host)){
            return;
        }

        let article = document.createElement('article');

        let account = document.createElement('div');
        account.setAttribute('class', 'account');

        let accountWrapper = document.createElement('div');
        accountWrapper.setAttribute('class', 'account__wrapper');

        let account__displayname = document.createElement('a');
        account__displayname.setAttribute('class', 'account__display-name');
        account__displayname.setAttribute('href', thisUrl + '/@' + userId);
        account__displayname.setAttribute('title', user.display_name);
        account__displayname.setAttribute('target', '_blank');

        let account__avatarwrapper = document.createElement('div');
        account__avatarwrapper.setAttribute('class', 'account__avatar-wrapper');

        let account__avatar = document.createElement('div');
        account__avatar.setAttribute('class', 'account__avatar');
        account__avatar.setAttribute('style', 'width:46px; height: 46px;');

        let avatarimg = document.createElement('img');
        avatarimg.setAttribute('src', user.avatar_static);
        avatarimg.setAttribute('alt', user.display_name);

        account__avatar.appendChild(avatarimg);
        account__avatarwrapper.appendChild(account__avatar);

        let display_name = document.createElement('span');
        display_name.setAttribute('class', 'display-name');

        let display_name_bdi = document.createElement('bdi');
        let display_name_bdi_strong = document.createElement('strong');
        display_name_bdi_strong.innerText = user.display_name;
        display_name_bdi.appendChild(display_name_bdi_strong);

        display_name.appendChild(display_name_bdi);

        let display_name__account = document.createElement('span');
        display_name__account.setAttribute('class', 'display-name__account');
        display_name__account.innerText = '@' + userId;

        display_name.appendChild(display_name__account);

        account__displayname.appendChild(account__avatarwrapper);
        account__displayname.appendChild(display_name);

        accountWrapper.appendChild(account__displayname);


        if(isLoggedIn.loggedIn){
            let account__relationship = document.createElement('div');
        
            const followMessage : FollowMessage = {
                follow: true,
                id: user.acct,
                type: "FollowMessage"
            };
            let style = 'font-size: 18px; width: 23.1429px; height: 23.1429px; line-height: 18px;';
            let hiddenStyle = `${style} display: none;`;            

            let followButton = document.createElement('button');
            followButton.type = 'button';
            followButton.setAttribute('class', 'icon-button');
            if (window.Following.find(s => s.acct == userId)){
                followButton.setAttribute('style', hiddenStyle);
            } else{
                followButton.setAttribute('style', style);
            }
            
            followButton.addEventListener('click', (ev: MouseEvent) => {
                chrome.runtime.sendMessage(followMessage);
                unfollowButton.setAttribute('style', style);
                followButton.setAttribute('style', hiddenStyle);
                window.Following.push(user);
            });
            
            
            let followButtonIcon = document.createElement('i');
            followButtonIcon.setAttribute('class', 'fa fa-user-plus fa-fw');
            followButton.appendChild(followButtonIcon);
            
    
            account__relationship.appendChild(followButton);
    
            const unfollowMessage : FollowMessage = {
                follow: false,
                id: user.acct,
                type: "FollowMessage"
            };
            let unfollowButton = document.createElement('button');
            unfollowButton.type = 'button';
            unfollowButton.setAttribute('class', 'icon-button active');
            if (window.Following.find(s => s.acct == userId)){
                unfollowButton.setAttribute('style', style);
            } else{
                unfollowButton.setAttribute('style', hiddenStyle);
            }                  
            unfollowButton.addEventListener('click', (ev: MouseEvent) => {
                chrome.runtime.sendMessage(unfollowMessage);
                unfollowButton.setAttribute('style', hiddenStyle);
                followButton.setAttribute('style', style);
                window.Following = window.Following.filter(s => s.acct !== userId);
            });
            
            let unfollowButtonIcon = document.createElement('i');
            unfollowButtonIcon.setAttribute('class', 'fa fa-user-times fa-fw');    
    
            unfollowButton.appendChild(unfollowButtonIcon);
            
            account__relationship.appendChild(unfollowButton);
    
            accountWrapper.appendChild(account__relationship);
        }        

        account.appendChild(accountWrapper);

        article.appendChild(account);

        feed?.appendChild(article);
    });

    const nextLink: string = mi.GetNextLink();
    if(nextLink !== ''){
        window.NextLink = nextLink;
        window.IsRunning = false;
        window.WebFinger = wf ?? '';
        let nextDiv = document.createElement('div');
        nextDiv.setAttribute('id', 'nextLoader');

        feed?.appendChild(nextDiv);

        document.onscroll = windowScrolled;
    }
    else{
        document.onscroll = null;
        window.NextLink = undefined;
    }
}

async function windowScrolled(ev: Event) : Promise<void> {
    if(window.NextLink && window.IsRunning === false && isInViewport(document.getElementById('nextLoader')!)){
        let isLoggedIn: IsLoggedInResponse = await chrome.runtime.sendMessage({
            type: 'IsLoggedInRequest'
        });
        window.IsRunning = true;
        let mi = new MastodonInfo();
        let followers = await mi.getFollowingFromLink(window.NextLink!);
        addUsersToScreen(followers, window.location.origin, mi, window.WebFinger, isLoggedIn);
    }
}
declare global {
    interface Window {
         NextLink: string | undefined;
         IsRunning: boolean;
         WebFinger: string | undefined;
         Following: MastodonUser[]
        }
}

function isInViewport(element: HTMLElement) {
    if(!element){
        return false;
    }
    var rect = element?.getBoundingClientRect();
    var html = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }

function getWebfinger(url: string): string | undefined {
    let parts = url.split('/');
    for (let i: number = 0; i < parts.length; i++) {
        if (parts[i].split('@').length === 3) {
            return parts[i];
        }
    }    
    return undefined;
}

doTheThing();