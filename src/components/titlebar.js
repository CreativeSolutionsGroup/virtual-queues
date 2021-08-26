import React from "react";
import { Button, Header, Icon } from "semantic-ui-react";

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
        <div id="nav-buttons">
          <Button inverted icon size="big" onClick={this.handleProfileClick}>
            <Button.Content visible>
              <Icon name="user outline" />
              Profile
            </Button.Content>
          </Button>
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
