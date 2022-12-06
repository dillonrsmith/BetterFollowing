import { MastodonUser } from "./Models/MastodonUser";

export class MastodonInfo {

    public MastodonInfo() {

    }

    public async getFollowing(webfinger?: string) : Promise<MastodonUser[]> {
        if(webfinger === null || webfinger === undefined) {
            return [];
        }
        let userId = this.getUserId(webfinger);
        let mstdnInstance = this.getMastodonInstance(webfinger);
        let baseUrl = 'https://' + mstdnInstance + '/';

        let resp = await fetch(baseUrl + 'api/v1/accounts/lookup?acct=' + userId);
        let respBody : MastodonUser = await resp.json();

        resp = await fetch(baseUrl + 'api/v1/accounts/' + respBody.id + '/following');
        let users : MastodonUser[] = await resp.json();
        return users;
    }

    private getMastodonInstance(webfinger: string) : string {
        return webfinger.substring(webfinger.lastIndexOf('@') + 1);
    }

    private getUserId(webfinger: string): string{
        return webfinger.substring(0, webfinger.lastIndexOf('@'));
    }
}

