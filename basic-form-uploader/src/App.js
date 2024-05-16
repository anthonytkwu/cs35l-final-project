import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [file, setFile] = useState(null);
  const [output, setOuput] = useState('');
  const [showForm, setShowForm] = useState(true);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleIDChange(event) {
    setGameID(event.target.value);
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    setFile(URL.createObjectURL(selectedFile));
  }

  function handleSubmit(event) {
    setShowForm(false);
    setOuput('Name: ' + name + ' Game ID: ' + gameID)
  }

  return (
    <>
      <div>
        {showForm && (<form onSubmit={handleSubmit}>
          <div>
            <label> Name/Id:</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} />
          </div>
          <div>
            <label>Game ID:</label>
            <input type="text" id="gameID" value={gameID} onChange={handleIDChange} />
          </div>
          <div>
            <label>Add Image:</label>
            <input type="file" id="file" accept=".svg" onChange={handleFileChange} />
          </div>

          <button type="submit" value="Submit">Submit</button>
        </form>)
        }
      </div>
      {!showForm && (
        <div>
          <div>
            <h2>{output}</h2>
          </div>
          <div>
            <svg
              style={{ width: '50vw', height: '50vh' }}
              viewBox="0 0 100 100"
            >
              <image href={file} width="100%" height="100%" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
