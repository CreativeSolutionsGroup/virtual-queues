import React from "react";
import { Button, Icon } from "semantic-ui-react";

class TicketWalletButton extends React.Component {
    constructor(props) {
        super(props);

        this.getTicketCount = props.getTicketCount
        this.showTicketModal = props.showTicketModal;
    };

  render() {
    const ticketCount = this.getTicketCount();
    //Hide Button if wallet is empty
    if(ticketCount <= 0){
        return "";
    }
    return (
        <div>
            {
                ticketCount > 0 ? 
                    <div
                        style={{
                            right: 30,
                            position: 'fixed',
                            bottom: 70,
                            zIndex: 1000,
                            backgroundColor: 'red',
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            display: 'flex'
                        }}
                    >
                        <div style={{padding: 5, margin: 'auto', color: 'white'}}>{ticketCount}</div>
                    </div>
                : ""
            }
            <Button 
                circular 
                icon
                style={{
                    right: 30,
                    position: 'fixed',
                    bottom: 30,
                    zIndex: 500,
                    backgroundColor: '#F3A00F' //Cedarville Yellow
                }}
                size='massive'
                onClick={()=> this.showTicketModal()}
            >
                <div style={{display: 'flex'}}>
                    {/*Center Icon*/}
                    <Icon name='ticket' style={{margin: 2, marginTop: 4, marginBottom: 4}}/> 
                </div>
            </Button>
        </div>
    );
  }
}

export default TicketWalletButton;
