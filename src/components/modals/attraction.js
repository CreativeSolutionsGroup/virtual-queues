import React from "react";
import { Button, Header, Image, Modal, Transition, Icon } from "semantic-ui-react";
import { displayDate, displayDateRange } from "../../utils/strings";
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
      startTime: props.startTime,
      endTime: props.endTime,
      location: props.location
    };
  }

  render() {
    let hasVisibleSlots = false;
    const now = Date.now();
    let hasSlots = this.state.slots.length > 0;
    this.state.slots.forEach(slot => {
      const hideTime = new Date(Date.parse(slot.hide_time));

      if (hideTime >= now) {
        hasVisibleSlots = true;
      }
    });
    return (
      <Transition visible={this.state.open} animation='scale' duration={200}>
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

              <div>
                <Icon name="clock" />
                {/*Events without slots should display length of event and events with slots just need to show when it ends*/}
                {hasSlots ? "End Time: "+displayDate(this.state.endTime) : displayDateRange(this.state.startTime, this.state.endTime)}
              </div>
              {(this.state.location !== "" && this.state.location !== undefined && this.state.location !== "N/A") ?
                <div>
                  <Icon name="map marker alternate" />
                  {this.state.location}
                </div>
              : ""}
              {hasVisibleSlots ? (
                <AttractionsSegment
                  disabled={!this.props.isStudentSignedIn()}
                  onReserve={this.props.onReserve}
                  slots={this.state.slots}
                  studentTickets={this.props.studentTickets}
                  hasTicket={this.props.hasTicket}
                  slotTicketsTaken={this.props.slotTicketsTaken}
                />
              ) : hasSlots ? <div>No Ticket Slots Avaible Right Now</div> : ""}
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
      </Transition>
    );
  }
}

export default AttractionModal;
