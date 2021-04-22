import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";

class CardModal extends React.Component {
  state = {
    open: false,
    name: "",
    description: "",
    active: false,
    available: 0,
    maxAvailable: 0,
    img: "",
  };

  constructor(props) {
    super(props);

    this.state.name = props.name;
    this.state.description = props.description;
    this.state.active = props.isActive;
    this.state.available = props.available;
    this.state.maxAvailable = props.maxAvailable;
    this.state.img = props.image;
  }

  render() {
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
      >
        <Modal.Header>Attraction Details</Modal.Header>
        <Modal.Content image>
          <Image size="medium" src={this.state.img} wrapped />
          <Modal.Description>
            <Header>{this.state.name}</Header>
            <p>{this.state.description}</p>
            <p>There are {this.state.available} tickets available.</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => this.setState({ open: false })}>
            Exit
          </Button>
          <Button
            content="Reserve a ticket"
            labelPosition="right"
            icon="checkmark"
            onClick={() => this.setState({ open: false })}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardModal;
