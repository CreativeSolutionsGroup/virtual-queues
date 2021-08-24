import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";

export default class Attraction extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.id;
    this.name = props.name;
    this.about = props.about;
    this.description = props.description;
    this.active = props.isActive;
    this.img = props.imageURL;
    this.endTime = props.endTime;

    let slots = [];
    if (props.slots !== undefined) {
      slots = props.slots.map((slot) => {
        slot.taken = 0;
        return slot;
      });
    }
    this.state = {
      slots: slots,
    };

    this.getTicketsAvailable = this.getTicketsAvailable.bind(this);
  }

  componentDidMount() {
    this.getTicketsAvailable();
  }

  getTicketsAvailable() {
    this.state.slots.forEach(({ _id }, idx) => {
      fetch(`https://api.cusmartevents.com/api/slots/${_id}/tickets/`)
        .then((res) => res.json())
        .then(
          (res) => {
            if (res.status !== "success") {
              console.log("Failed to retrieve available tickets");
              console.log(res.message);
            }

            console.debug("Taken:", this.state.slotsTaken);
            console.debug("Slot ID:", this.id);
            console.debug("Retrieved:", res.data);

            // Get copy of slots array
            const newSlots = this.state.slots.slice();
            newSlots[idx].taken = res.data.length;

            this.setState({ slots: newSlots });
          },
          (err) => {
            console.error("Failed to retrieve available tickets");
            console.error(err);
          }
        );
    });
  }

  render() {
    const now = Date.now();

    let [maxCapacity, takenSlots, numSlots] = this.state.slots.reduce(
      (acc, slot) => {
        const hideTime = new Date(Date.parse(slot.hide_time));
        return hideTime <= now
          ? [acc[0], acc[1], acc[2]]
          : [acc[0] + slot.ticket_capacity, acc[1] + slot.taken, acc[2] + 1];
      },
      [0, 0, 0]
    );

    return (
      <Card fluid onClick={() => this.props.onClick(this.id)}>
        <Image src={this.img} wrapped disabled={!this.active} />
        <Card.Content>
          <Card.Header>{this.name}</Card.Header>
          <Card.Description>{this.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Icon name="ticket" />
            {maxCapacity - takenSlots}/{maxCapacity} available in {numSlots}{" "}
            slots
          </div>
          <div>
            <Icon name="clock" />
            End Time: {this.endTime.toLocaleString("en-US")}
          </div>
        </Card.Content>
      </Card>
    );
  }
}
