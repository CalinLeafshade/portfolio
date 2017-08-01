import React from "react";
import { Motion, spring } from "react-motion";
import styled from "styled-components";

const MainHeader = styled.h1`
  color: transparent;
  font-size: 72px;
  text-shadow: 0 0 100px #333;
  font-weight: 600;
`;

const SubtitleContainer = styled.div`
  text-align: right;
  color: white;
  font-size: 22px;
`;

const SubtitleText = styled.span`
  position: relative;
`;

const SubtitleBlock = styled.span`
  position: absolute;
  top: 0;
  height: 100%;
  background: white;
`;

const SubtitleDummy = styled.span`
  position: absolute;
  left: 0;
  top:0;
  overflow: hidden;
  white-space: nowrap;
`;

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

const Subtitle = ({ progress }) => {
  const blockStyle = {
    left: lerp(-5, 105, Math.max(0, progress - 0.5) * 2) + "%",
    right: lerp(105, -5, Math.min(1, progress * 2)) + "%"
  };

  const dummyStyle = {
    width: progress * 100 + "%"
  };

  return (
    <SubtitleContainer>
      <SubtitleText>
        <SubtitleDummy style={dummyStyle}>Web Developer</SubtitleDummy>
        <SubtitleBlock style={blockStyle} />
        <span style={{ color: "transparent" }}>Web Developer</span>
      </SubtitleText>

    </SubtitleContainer>
  );
};

const Identity = ({ shown }) =>
  <div>
    <Motion
      style={{
        shadow: spring(shown ? 0 : 100),
        opacity: spring(shown ? 1 : 0)
      }}
    >
      {value =>
        <div>
          <MainHeader
            style={{
              textShadow: `0 0 ${value.shadow}px #fff`,
              opacity: value.opacity,
              transform: `translate3d(0, ${value.shadow}px, 0)`
            }}
          >
            Steve Poulton
          </MainHeader>
          <Subtitle progress={value.opacity} />
        </div>}
    </Motion>

  </div>;

export default Identity;
