import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";

import CardModal from "./cardModal";
import Toast from "./toast";

export default class Attraction extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name;
    this.description = props.description;
    this.active = props.isActive;
    this.available = props.available;
    this.maxAvailable = props.maxAvailable;
    this.img = props.image;
  }

  render() {
    return (
      <Card onClick={this.props.onClick} fluid>
        <Image src={this.img} wrapped disabled={!this.active} />
        <Card.Content>
          <Card.Header>{this.name}</Card.Header>
          <Card.Description>{this.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Icon name="user" />
            {this.available}/{this.maxAvailable} available
          </div>
          <div>
            <Icon name="clock outline" />
          </div>
        </Card.Content>
      </Card>
    );
  }
}
