import { MastodonUser } from "./Models/MastodonUser";

export class MastodonInfo {

    private _nextLink: string = '';

    public GetNextLink(): string {
        return this._nextLink;
    }

    public MastodonInfo() {

    }

    public async getFollowing(webfinger?: string) : Promise<MastodonUser[]> {
        if(webfinger === null || webfinger === undefined) {
            return [];
        }
        
        let userId = this.getUserId(webfinger);
        let mstdnInstance = this.getMastodonInstance(webfinger);
        let baseUrl = 'https://' + mstdnInstance + '/';
        console.log(`userId: ${userId}`);
        console.log(`mstdnInstance: ${mstdnInstance}`);
        console.log(`baseUrl: ${baseUrl}`);

        let resp = await fetch(baseUrl + 'api/v1/accounts/lookup?acct=' + userId);
        let respBody : MastodonUser = await resp.json();

        return await this.getFollowingFromLink(baseUrl + 'api/v1/accounts/' + respBody.id + '/following');
    }

    public async getFollowingFromLink(link: string) : Promise<MastodonUser[]> {
        let resp = await fetch(link);
        let users : MastodonUser[] = await resp.json();
        
        if(resp.headers.has('Link')){
            let linkHeader = resp.headers.get('Link');
            if(linkHeader?.includes('rel="next"') === true){
                let nextLink = linkHeader?.split(';')[0];
                nextLink = nextLink?.substring(1);
                this._nextLink = nextLink?.substring(0, nextLink.length - 1) ?? '';            }
            else {
                this._nextLink = '';
            }
        } else{
            this._nextLink = '';
        }
        return users;
    }

    public getMastodonInstance(webfinger: string | undefined) : string {
        if(webfinger){
            return webfinger.substring(webfinger.lastIndexOf('@') + 1);
        } else{
            return '';
        }
    }

    private getUserId(webfinger: string): string{
        return webfinger.substring(0, webfinger.lastIndexOf('@'));
    }
}

