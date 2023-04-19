import './App.css';
import TextSelector from './components/text-selector';
import React from 'react'; // eslint-disable-line
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';

const reactRootId = 'root';
const container = document.getElementById(reactRootId);
const root = createRoot(container);

const MockContentBlock = styled.div`
  height: 100vh;
  background-color: pink;
`;

const TestWrapper = styled.div`
  margin: 20px auto;
  max-width: 1200px;
`;

root.render();

function App() {
  return (
    <TestWrapper>
      <MockContentBlock />
      <TextSelector />
      <MockContentBlock />
    </TestWrapper>
  );
}

export default App;
