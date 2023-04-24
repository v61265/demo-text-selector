import './App.css';
import TextSelector from './components/text-selector';
import React, { useEffect, useState } from 'react'; // eslint-disable-line
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
  const [debuggedFile, setDebuggedFile] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebuggedFile(parseInt(params.get('debuggedFile')));
  }, []);
  return (
    <TestWrapper>
      <MockContentBlock />
      <TextSelector debuggedFile={debuggedFile} />
      <MockContentBlock />
    </TestWrapper>
  );
}

export default App;
