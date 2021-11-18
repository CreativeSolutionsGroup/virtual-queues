import React from "react";
import { Button, Header, Icon, Popup } from "semantic-ui-react";

export default class TitleBar extends React.Component {
  handleIdPopupClose() {
    //this.setState({idPopupIsOpen: false});
  }
  constructor(props) {
    super(props);

    this.handleProfileClick = props.onProfileClick;
    this.handleHelpClick = props.onHelpClick;

    this.style = {
      display: "flex",
      justifyContent: "space-between",
      background: "#00356f",
      padding: "20px",
      color: "white",
      overflow: "hidden",
    };
    if (localStorage.getItem('StudentID') === null) {
      this.state = {
        idPopupIsOpen: true,
        modalOpen: this.props.modalOpen
      };
    }
    else {
      this.state = {
        idPopupIsOpen: false,
        modalOpen: this.props.modalOpen
      };
    }
    
  }

  render() {
    return (
      <header style={this.style}>
        <div id="nav-buttons">
          <Popup trigger=
            {
              <Button inverted icon size="big" onClick={() => {this.handleProfileClick(); this.handleIdPopupClose();}}>
                <Button.Content visible>
                  <Icon name="user outline" />
                  Profile
                </Button.Content>
              </Button>
            }
            content="Please sign in here"
            open={this.state.idPopupIsOpen && !this.state.modalOpen}
            position='bottom left'
          />
          <Button icon inverted size="big" onClick={this.handleHelpClick}>
            <Button.Content visible>
              <Icon fitted name="question circle outline" />
            </Button.Content>
          </Button>
        </div>
        <Header as="h2" content="CU Events" subheader="Virtual Queues" className="user notranslate skiptranslate" />
      </header>
    );
  }
}
