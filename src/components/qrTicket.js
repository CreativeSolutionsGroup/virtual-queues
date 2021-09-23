import React from "react";
import { Card, Image } from "semantic-ui-react";
import QRCode from "react-qr-code";

class QRTicket extends React.Component {
    constructor(props) {
        super(props);
        this.ticketID = props.ticketID;
        this.img = props.imageURL;
        this.startTime = props.startTime;
        this.name = props.name;
        this.description = props.description;
    }
    render() {
        return (
            <Card>
            <Card.Content>
            <Card.Header>{this.name}</Card.Header>
            
            <Card.Meta>
                <span className='description'>{this.description}</span>
            </Card.Meta>
            
            
            </Card.Content>
            <Image src={this.img} size="large" wrapped alt={this.name}/>
            <Card.Content>
            <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: "center"
                }}>
                <QRCode value={this.ticketID}/>
            </div>
            
            </Card.Content>
            <Card.Content extra>
            <Card.Description style={{
                display: 'flex', alignItems: 'center', justifyContent: "center"
              }}>
                <h3 style={{
                display: 'flex', alignItems: 'center', justifyContent: "center"
              }}>
                Start Time: {this.startTime}
                </h3>
            </Card.Description>
            </Card.Content>

        </Card>
        )
    }
}

export default QRTicket;