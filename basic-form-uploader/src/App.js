import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [ name, setName ] = useState('');
  const [ gameID, setGameID ] = useState('');

  return (
    <form>
      <div>
        <label>
          Name/Id:
          <input type="text" name="name" />
        </label>
      </div>
      <div>
       <label>
         Game ID:
         <input type="text" name="gameID" />
        </label>
      </div>
      <button type="submit" value="Submit">Submit</button>
    </form>
  );
}

export default App;
