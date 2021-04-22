import React from "react";
import { Message } from "semantic-ui-react";

export default class Toast extends React.Component {
  state = { visible: false, header: "", success: true, message: "" };

  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      visible: props.visible,
      success: props.success,
      header: props.header,
      message: props.message,
    };
  }

  showToast = (e) => {
    this.setState({
      visible: true,
    });
  };

  handleDismiss = (e) => {
    // Don't allow parent card to receive the onClick
    e.stopPropagation();

    this.setState({ visible: false });
  };

  render() {
    return (
      <Message
        onDismiss={this.handleDismiss}
        positive={this.state.success}
        negative={!this.state.success}
        icon={this.state.success ? "ticket" : "frown outline"}
        header={this.state.header}
        content={this.state.message}
        hidden={!this.state.visible}
      />
    );
  }
}
