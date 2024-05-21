import './App.css';
import React, { useState } from 'react';

function App() {
  const apiUrl = 'http://204.236.181.165:8000/api/images/';
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [showForm, setShowForm] = useState(true);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleIDChange(event) {
    setGameID(event.target.value);
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);  // Set the file object directly
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowForm(false);
    setOutput('Name: ' + name + ' Game ID: ' + gameID);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('gameID', gameID);
    formData.append('image', file);  // Append the file object directly

    fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log(data);
        alert('File uploaded successfully');
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  return (
    <>
      <div>
        {showForm && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label>Name/Id:</label>
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
          </form>
        )}
      </div>
      {!showForm && (
        <div>
          <div>
            <h2>{output}</h2>
          </div>
          <div>
            {file && (
              <svg style={{ width: '50vw', height: '50vh' }} viewBox="0 0 100 100">
                <image href={URL.createObjectURL(file)} width="100%" height="100%" />
              </svg>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
