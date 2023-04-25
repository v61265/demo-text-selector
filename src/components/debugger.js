import React, { useEffect } from 'react';
import styled from 'styled-components';

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {string[]} [jsonUrls]
 *  @param {string} [backgroundColor]
 *  @param {string} [circleUrl]
 *  @param {string} [buttonBackground]
 *  @param {string} [buttonWording]
 */
export default function Debugger({
  jsonLength = 0,
  jsonFileIndex = 0,
  dataLength = 0,
  emphasizedIndex = 0,
  setJsonFileIndex = () => {},
}) {
  useEffect(() => {
    console.log(jsonFileIndex);
  }, [jsonFileIndex]);
  return (
    <Wrapper>
      <InfoItem>
        JSON: {jsonFileIndex + 1} / {jsonLength}
      </InfoItem>
      <InfoItem>
        DATA: {emphasizedIndex + 1} / {dataLength}
      </InfoItem>
      <InfoItem>Select JSON File:</InfoItem>
      {jsonFileIndex > 0 && (
        <ControllerBtn onClick={() => setJsonFileIndex((prev) => prev - 1)}>
          prev
        </ControllerBtn>
      )}
      {jsonFileIndex < jsonLength - 1 && (
        <ControllerBtn onClick={() => setJsonFileIndex((prev) => prev + 1)}>
          next
        </ControllerBtn>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  z-index: 150;
  color: #ffffff;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
`;

const ControllerBtn = styled.button`
  padding: 8px;
  background: rgba(0, 0, 0, 0);
  outline: none;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 4px;
  & + & {
    margin-left: 4px;
  }
  &:hover {
    background: rgba(225, 225, 225, 0.3);
    cursor: pointer;
  }
`;
