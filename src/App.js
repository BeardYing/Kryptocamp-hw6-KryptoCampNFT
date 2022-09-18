import { useState } from 'react'
import './App.css';
import MainMint from './MainMint';
import Navbar from './Navbar';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState([]);

  return (
    <ChakraProvider>
      <div className="overlay">
        <div className="App">
          <Navbar accounts={accounts} setAccounts={setAccounts} provider={provider} setProvider={setProvider} />
          <MainMint accounts={accounts} setAccounts={setAccounts} provider={provider} setProvider={setProvider} />
        </div>

        <div className="moving-background"></div>
      </div>
    </ChakraProvider>
  );
}

export default App;