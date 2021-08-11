import { Card, Segment, Icon, Button, Popup } from "semantic-ui-react";

const AttractionsSegment = (props) => {
  return (
    <Segment>
      <Card.Group>
        {props.slots.map((slot) => {
          const now = Date.now();
          const hideTime = new Date(Date.parse(slot.hide_time));

          if (hideTime <= now) {
            return null;
          }

          const hoverMsg = props.disabled
            ? "Please sign in with your student ID first!"
            : "Reserve a new ticket";

          return (
            <Card key={slot._id}>
              <Card.Content>
                <Card.Header>
                  <Icon name="clock outline" />
                  {hideTime.toLocaleString("en-US")}
                </Card.Header>
                <div>
                  <Icon name="user" />
                  {slot.ticket_capacity - slot.taken}/{slot.ticket_capacity}{" "}
                  slots available!
                </div>
              </Card.Content>
              <Card.Content extra>
                {/* Make this conditional based on whether we have a ticket or not */}
                <Popup
                  trigger={
                    <div>
                      <Button
                        disabled={props.disabled}
                        content="Reserve a ticket"
                        labelPosition="right"
                        icon="ticket"
                        onClick={() => props.onReserve(slot._id)}
                        positive
                      />
                    </div>
                  }
                  content={hoverMsg}
                />
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </Segment>
  );
};

export default AttractionsSegment;
