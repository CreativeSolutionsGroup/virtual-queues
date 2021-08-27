import React from "react";
import { Message, Transition } from "semantic-ui-react";

export default class Toast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      success: props.success,
      header: props.header,
      message: props.message,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDismiss = (e) => {
    // Don't allow parent card to receive the onClick
    e.stopPropagation();

    this.setState({ open: false });
  };

  render() {
    return (
      <Transition visible={this.state.open} animation='fade up' duration={800}>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            top: '90%',
            zIndex: 2000,
          }}
        >
          <Message
            compact
            floating
            onDismiss={this.handleDismiss}
            positive={this.state.success}
            negative={!this.state.success}
            icon={this.state.success ? "ticket" : "frown outline"}
            header={this.state.header}
            content={this.state.message}
            hidden={!this.state.open}
          />
        </div>
      </Transition>
    );
  }
}
