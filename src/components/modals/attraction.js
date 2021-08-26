import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import AttractionsSegment from "./attractionSegment";

class AttractionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      name: props.name,
      description: props.description,
      active: props.isActive,
      slots: props.slots === undefined ? [] : props.slots,
      maxAvailable: props.maxAvailable,
      img: props.image,
    };
  }

  render() {
    return (
      <Modal
        closeIcon
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
      >
        <Modal.Header>Attraction Details</Modal.Header>
        <Modal.Content image scrolling>
          <Image size="medium" src={this.state.img} wrapped />
          <Modal.Description>
            <Header>{this.state.name}</Header>
            <p style={{ whiteSpace: 'pre-line'}}>{this.state.description}</p>
            {this.state.slots.length > 0 ? (
              <AttractionsSegment
                disabled={!this.props.isStudentSignedIn()}
                onReserve={this.props.onReserve}
                slots={this.state.slots}
                studentTickets={this.props.studentTickets}
                hasTicket={this.props.hasTicket}
                slotTicketsTaken={this.props.slotTicketsTaken}
              />
            ) : null}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Okay"
            labelPosition="right"
            icon="checkmark"
            onClick={() => this.setState({ open: false })}
            color="blue"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AttractionModal;
