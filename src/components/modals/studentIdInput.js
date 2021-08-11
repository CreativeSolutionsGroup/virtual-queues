import React, { createRef } from "react";
import { Input } from "semantic-ui-react";

class StudentIdInput extends React.Component {
  inputRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };

    this.validateId = this.validateId.bind(this);
    this.getId = this.getId.bind(this);

    this.handleSubmit = props.onSubmit;
  }

  getId() {
    return this.inputRef.current.inputRef.current.value;
  }

  /**
   * Validates the ID value passed, returning validity of that ID
   *
   * @returns Validity of ID string passed in
   */
  validateId(val) {
    // Validate that this is a long enough string
    if (val.length !== 7) {
      return false;
    }

    // Validate that this is a valid number within the expected range
    if (isNaN(val) || val < 1000000) {
      return false;
    }

    // Made it to the end, no errors!
    return true;
  }

  render() {
    const defaultVal =
      this.props.studentId === "000000" ? "" : this.props.studentId;
    return (
      <Input
        autoFocus
        defaultValue={defaultVal}
        placeholder="0000000"
        onChange={(_, val) =>
          this.setState({ error: !this.validateId(val.value) })
        }
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            this.handleSubmit();
          }
        }}
        error={this.state.error}
        ref={this.inputRef}
        action={{
          color: "green",
          content: "Save",
          onClick: this.handleSubmit,
        }}
      />
    );
  }
}

export default StudentIdInput;
