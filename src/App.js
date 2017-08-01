import React, { Component } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import "./App.css";
import TriangleBackground from "./TriangleBackground";

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 15px;
  align-items: center;
  justify-content: center;
`;

const MainHeader = styled.h1`
  color: white;
  font-size: 72px;
  text-shadow: 0 0 8px rgba(0,0,0,0.8);
  margin-bottom: 100px;
  line-height: 80px;
  background: rgba(0,0,0,0.4);
  padding: 20px 30px;
  padding-top: 10px;
  border: 1px solid white;
  font-weight: 300;
`;

const HeaderSmall = styled.small`
  font-size: 18px;
  line-height: 14px;
  display: block;
  text-align: right;
  font-weight: 600;
`;

class App extends Component {
  state = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  };

  onResize = () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    });
  };

  componentDidMount() {
    window.addEventListener("resize", debounce(this.onResize, 200));
  }

  render() {
    const { screenHeight, screenWidth } = this.state;
    return (
      <div>
        <TriangleBackground width={screenWidth} height={screenHeight} />
        <AppContainer>
          <MainHeader>
            Steve Poulton<br /><HeaderSmall>Web Developer</HeaderSmall>
          </MainHeader>
        </AppContainer>
      </div>
    );
  }
}

export default App;
