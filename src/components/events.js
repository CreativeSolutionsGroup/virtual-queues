import { Grid, Placeholder } from "semantic-ui-react";

import Attraction from "./attraction";

const Events = (props) => {
  const numEventColumns = 4;
  const {
    loadedAttractions,
    loadedSlots,
    attractions,
    slots,
    onAttractionClick,
  } = props;

  if (!loadedAttractions) {
    return (
      <Grid stackable columns={numEventColumns}>
        <Grid.Column>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="short" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Grid.Column>
      </Grid>
    );
  } else if (loadedAttractions && !loadedSlots) {
    return (
      <Grid stackable columns={numEventColumns}>
        {Array.from(attractions, ([key, val]) => (
          <Grid.Column key={key}>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Grid.Column>
        ))}
      </Grid>
    );
  }

  return (
    <Grid stackable columns={numEventColumns}>
      {Object.entries(attractions).map(([key, val]) => {
        const now = Date.now();
        const start = new Date(Date.parse(val.start_time));
        const end = new Date(Date.parse(val.end_time));
        const isActive = now >= start && end >= now;

        return (
          <Grid.Column key={key}>
            <Attraction
              id={key}
              name={val.name}
              about={val.about}
              description={val.description}
              isActive={isActive}
              imageURL={val.image_url}
              endTime={end}
              slots={slots[key]}
              onClick={onAttractionClick}
            />
          </Grid.Column>
        );
      })}
    </Grid>
  );
};

export default Events;
