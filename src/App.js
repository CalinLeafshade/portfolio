import React, { Component } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { Motion, spring } from "react-motion";
import "./App.css";
import TriangleBackground from "./TriangleBackground";
import Identity from "./Identity";

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 15px;
  align-items: center;
  justify-content: center;
`;

const LowerTheLights = styled.p`
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 3px #000;
  transition: all 0.8s ease;
  font-size: 20px;
  background: rgba(0,0,0,0.5);
  padding: 12px 20px;
  user-select: none;
`;

class App extends Component {
  state = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    lights: true,
    focus: false
  };

  onResize = () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    });
  };

  onFocus = () => {
    setTimeout(
      () =>
        this.setState({
          focus: true
        }),
      1000
    );
  };

  componentDidMount() {
    window.addEventListener("resize", debounce(this.onResize, 200));
    if (!document.hidden) {
      this.onFocus();
    } else {
      document.addEventListener("visibilitychange", this.onFocus);
    }
  }

  render() {
    const { screenHeight, screenWidth, lights, focus } = this.state;
    return (
      <div onClick={() => this.setState({ lights: !this.state.lights })}>
        <Motion
          defaultStyle={{ light: 0, mouse: 0 }}
          style={{
            light: spring(lights ? 1.3 : 0.1),
            mouse: spring(lights ? 1 : 0)
          }}
        >
          {value =>
            <TriangleBackground
              width={screenWidth}
              height={screenHeight}
              light={value.light}
              mouseEffectStrength={value.mouse}
            />}
        </Motion>
        <AppContainer>
          <Identity shown={!lights} />
          <div style={{ position: "absolute", bottom: "10%" }}>
            <LowerTheLights style={{ opacity: focus && lights ? 1 : 0 }}>
              Click to lower the lights
            </LowerTheLights>
          </div>
        </AppContainer>
      </div>
    );
  }
}

export default App;
