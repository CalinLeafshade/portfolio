import React from "react";
import memoize from "lodash/memoize";
import sampleSize from "lodash/sampleSize";
import range from "lodash/range";
import styled from "styled-components";

const possible =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const lookup = memoize(len => sampleSize(range(0, len), len));
const randomChar = memoize(r =>
  possible.charAt(Math.floor(Math.random() * possible.length))
);

const scramble = (text, amount) => {
  const lut = lookup(text.length);
  const saneChars = lut.slice(0, Math.ceil(text.length * amount));
  return text
    .split("")
    .map(
      (c, i) =>
        c === " " || saneChars.indexOf(i) > -1
          ? c
          : randomChar(amount.toFixed(2) + i)
    );
};

const ScramblerLetter = styled.span`
  text-align: center;
  width: 26px;
  font-size: 26px;
  display: inline-block;
  text-transform: uppercase;
  text-shadow: 0 0 4px #000;
  color: white;
`;

const Scrambler = ({ text, amount, scatter = 0 }) =>
  <p style={{ opacity: 1 - scatter }}>
    {scramble(text, amount).map((c, i) =>
      <ScramblerLetter key={i}>{c}</ScramblerLetter>
    )}
  </p>;

export default Scrambler;
