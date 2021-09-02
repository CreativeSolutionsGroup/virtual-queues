import React, { createRef } from "react";
import SaveToGooglePayButton from '@google-pay/save-button-react';
import { Button } from "semantic-ui-react";
import JWT from 'jwt-encode';

class GooglePayWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        jwt: ''
    };
  }

  encodeJWT(){
      /*let secret = process.env.REACT_APP_GOOGLE_PASS_SECRET;
      console.log(secret);
      const jwt = JWT(this.buildPassJSON(), secret);*/
      let jwt = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwOi8vbG9jYWxob3N0OjEzMzciLCJodHRwczovL3NhdmUtdG8tZ29vZ2xlLXBheS5zdGFja2JsaXR6LmlvIiwiaHR0cHM6Ly9ncGF5LWxpdmUtZGVtby1zdGFnaW5nLndlYi5hcHAiXSwiaXNzIjoic29jLWxveWFsdHlhcGktZGVtb0BhcHBzcG90LmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImxveWFsdHlPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMTAwNDg2NjguYWxleF9hdF9leGFtcGxlLmNvbS1ncGF5LXJld2FyZHMifV19LCJpYXQiOjE2MTU1OTQ2NTF9.ZbEvdvkRh5nCuBq85bBEjR6216L7j6W10nyVWpPSAZlaSe8O6hJ_Ig-TrrvFtn7aHucMZr4cTmttONrlaFU-gFKMYHMEJFiZ-qv58sE9dNUdgUwTJWWzH8aukltM0pCBLHcpvLXTCpGk4PoXWM4q5H6WIjP1Jem8v1_YGdV6J_UBNyAGqJUE5XJnDgHl2qGFilTmF0el6EBFQLnF2PuIvyZcWXgbXgJLZfx-opepVAgODW5BQjQ7li8QoDl3ffdESO2-7qWVm-VoxLb8eDh3z3gRktPb8APh_VsaAb8mjvNCLk_SOPrQhpuph4b0Rg4xnt59u5c87_eD2kT3_IuHxw'
      console.log(jwt);
      this.setState({jwt: jwt});
  }

  buildPassJSON(){
      console.log(Date.now())
      return {
        "aud": "google",
        "origins": [
          "http://localhost:3000"
        ],
        "iss": "107436103293177568900@smart-events-api-dashboard.iam.gserviceaccount.com",
        "iat": Date.now(),
        "typ": "savetoandroidpay",
        "payload": {
          "eventTicketObjects": [
            {
              "barcode": {
                "type": "QR_CODE",
                "value": "28343E3"
              },
              "id": "3388000000016510518.EventTicketObject1",
              "classId": "3388000000016510518.3388000000016510518.TicketEventClass1",
              'state': 'active'
            }
          ]
        }
      }
  }

  render() {
    return (
        <div>
            <Button onClick={()=> this.encodeJWT()}>EncodeJWT</Button>
            
            <SaveToGooglePayButton jwt={this.state.jwt}/>
        </div>
    );
  }
}

export default GooglePayWallet;
