import React from "react";
import { Modal, Header, Icon, Transition } from "semantic-ui-react";

class HelpModal extends React.Component {
  state = { open: false };

  render() {
    return (
      <Transition visible={this.state.open} animation='scale' duration={200}>
        <Modal
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
              pass.
            </p>
            <p>
              Return during your selected time, open your ticket wallet, and present your pass to a team
              member to be scanned.
            </p>
            <p> 
              You'll be able to access all your tickets (scanned and unscanned) from the profile menu!
            </p>
          </Modal.Content>
        </Modal>
      </Transition>
    );
  }
}

export default HelpModal;
