import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      data1: [],
      data2: [],
      time: 0
      };
  }

  tick() {
            this.setState(prevState => ({
              time: prevState.time + 1
            }));
  }

  componentDidMount() {
    axios.get('https://status.datadoghq.com/')
        .then(response => {
          this.setState({
              status1: response.status
            });
          //console.log(response);
          if (response.status === 200 && response != null) {
              this.setState({
                data1: response.data
              });
          } else {
            console.log('Problem');
          }
        })
        .catch(error => {
          console.log(error);
      });

    axios.get('https://cors-anywhere.herokuapp.com/https://status.azure.com/en-us/status/')
        .then(response => {
          this.setState({
              status2: response.status
            });
          //console.log(response);
          if (response.status === 200 && response != null) {
              this.setState({
                data2: response.data
              });
          } else {
            console.log('Problem');
          }
        })
        .catch(error => {
          console.log(error);
      });        
    this.interval = setInterval(() => this.tick(), 600000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render(){
    const data1 = this.state.data1;
    //const data2 = this.state.data2;
    var data1Match = data1.toString().match(/<div\s+class="component-container border-color">[\S\s]*?<\/div>/gi);
    var data1Status = ReactHtmlParser(data1Match);

    //console.log(data1Status);

    return(
      <div id="parent">
        <div className="time"> 
          Time updates every 10 minutes: { this.state.time }
        </div>
        <div className="website">
          <div className="header1">Datadog Status Website</div>
          <br></br>
         <div className="header1"> Status: {this.state.status1}</div>
          <br></br>
          {data1Status}

        </div>
        <div className="website">
          <div className="header1">Azure Status Website</div>
          <br></br>
          <div className="header1">Status: {this.state.status2} </div>
          <br></br>
        </div>
      </div>
    );

  }
}

export default App;
