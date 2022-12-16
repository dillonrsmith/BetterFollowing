class ReactThing extends React.Component {
    constructor(props) {
      super(props);
      this.state = { loggedIn: false };
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    
    logout() {
      this.setState({loggedIn: false, loggedInUrl: null});
      chrome.runtime.sendMessage({
        type: 'LogoutRequest'
      });
    }

    login(){
      chrome.runtime.sendMessage({
        type: 'LoginRequest',
        url: this.state.loggedInUrl
      }).then(message => {
        if(message.loggedIn == true){
          this.setState({
            loggedIn: true
          })
        }
      });
    }

    render() {
      if (this.state.loggedIn) {
        return e(<div>
          <span>Logged in to {this.state.loggedInUrl}</span>
          <button type="button" onClick={() => logout()}>Logout</button>
          </div>);
      }

      return e(
        <div>
          <label>Mastodon Instance URL</label>
          <input type="text" name="loggedInUrl" value={this.state.loggedInUrl} onChange={this.handleChange} />
          <button type="button" disabled={this.state.loggedInUrl.length > 0} onClick={() => login}>Login</button>
          </div>
          )
          ;
    }
  }