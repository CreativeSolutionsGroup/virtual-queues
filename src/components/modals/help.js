import React from "react";
import { Modal, Header, Icon } from "semantic-ui-react";

class HelpModal extends React.Component {
  state = { open: false };

  render() {
    return (
      <Modal
        basic
        closeIcon
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        size="small"
      >
        <Header icon>
          <Icon name="ticket" />
          Virtual Queues Help!
        </Header>
        <Modal.Content>
          <h3>Reserve your place in line with CU Events - Virtual Queues</h3>
          <p>
            Click on an attraction to see available time slots and reserve a
            pass
          </p>
          <p>
            Return during your selected time and present your pass to a team
            member. You'll be able to access all your tickets from the user
            profile on this page!
          </p>
        </Modal.Content>
      </Modal>
    );
  }
}

export default HelpModal;
