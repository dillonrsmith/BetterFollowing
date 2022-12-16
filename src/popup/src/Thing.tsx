import React, { Component } from "react";

type ReactThingState = {
    loggedInUrl?: string;
    loggedIn?: boolean;
}

export class ReactThing extends Component<{}, ReactThingState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loggedIn: false,
            loggedInUrl: ''
        };
        this.onChange = this.onChange.bind(this);
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        chrome.runtime.sendMessage({
            type: 'IsLoggedInRequest'
        }).then(s => {
            console.log(s);
            this.setState({
                loggedIn: s.loggedIn,
                loggedInUrl: s.url
            })
        });
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ loggedInUrl: e.target.value });
    }

    logout() {
        this.setState({ loggedIn: false, loggedInUrl: undefined });
        chrome.runtime.sendMessage({
            type: 'LogoutRequest'
        });
    }

    async login() {
        let response = await chrome.runtime.sendMessage({
            type: 'LoginRequest',
            url: this.state.loggedInUrl
        });
        this.setState({ loggedIn: response.loggedIn });
    }

    render() {        
        if (this.state.loggedIn) {
            return (<div>
                <span>Logged in to {this.state.loggedInUrl}</span><br />
                <button type="button" onClick={() => this.logout()}>Logout</button>
            </div>);
        }

        return (
            <div>
                <label>Mastodon Instance URL</label><br />
                <input type="text" name="loggedInUrl" value={this.state.loggedInUrl} onChange={this.onChange} /><br />
                <button type="button" disabled={(this.state.loggedInUrl?.length ?? 0) == 0} onClick={() => this.login()}>Login</button>
            </div>
        )
            ;
    }
}