import { MastodonInfo } from "./getMastadonInfo";
import { MastodonUser } from "./Models/MastodonUser";


export function doTheThing() {


    const thisUrl: string = document.location.origin;    
    if (document.location.href !== undefined && document.location.href.includes('following') && document.location.href.split('@').length === 3) {        
        let mi = new MastodonInfo();
        mi.getFollowing(getWebfinger(document.location.href)).then((value: MastodonUser[]) => {
            if (value.length > 0) {
                let feed = document.querySelector('[role="feed"]');

                value.forEach(user => {
                    let article = document.createElement('article');

                    let account = document.createElement('div');
                    account.setAttribute('class', 'account');

                    let accountWrapper = document.createElement('div');
                    accountWrapper.setAttribute('class', 'account__wrapper');

                    let account__displayname = document.createElement('a');
                    account__displayname.setAttribute('class', 'account__display-name');
                    account__displayname.setAttribute('href', thisUrl + '/@' + user.acct);
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
                    display_name__account.innerText = '@' + user.acct;

                    display_name.appendChild(display_name__account);

                    account__displayname.appendChild(display_name);

                    accountWrapper.appendChild(account__avatarwrapper);
                    accountWrapper.appendChild(account__displayname);

                    account.appendChild(accountWrapper);

                    article.appendChild(account);

                    feed?.appendChild(article);
                });
            }
        }, (reason: any) => {

        });
    }
    else{

    }
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