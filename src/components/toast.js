import React from "react";
import { Message } from "semantic-ui-react";

export default class Toast extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

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
      <Message
        compact
        onDismiss={this.handleDismiss}
        positive={this.state.success}
        negative={!this.state.success}
        icon={this.state.success ? "ticket" : "frown outline"}
        header={this.state.header}
        content={this.state.message}
        hidden={!this.state.open}
      />
    );
  }
}
