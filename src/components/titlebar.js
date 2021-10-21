import React from "react";
import { Button, Header, Icon, Image } from "semantic-ui-react";
import header_logo from "./../images/logo_header.png";

export default class TitleBar extends React.Component {
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
  }

  render() {
    return (
      <header style={this.style}>
        <Image src={header_logo} size="small"/>
        <div id="nav-buttons" style={{marginTop: 'auto', marginBottom: 'auto'}}>
          <Button inverted icon size="big" onClick={this.handleProfileClick}>
            <Button.Content visible>
              <Icon name="user outline" />
              Profile
            </Button.Content>
          </Button>
          <Button icon inverted size="big" onClick={this.handleHelpClick} aria-label='help'>
            <Button.Content visible>
              <Icon fitted name="question circle outline" />
            </Button.Content>
          </Button>
        </div>
      </header>
    );
  }
}
