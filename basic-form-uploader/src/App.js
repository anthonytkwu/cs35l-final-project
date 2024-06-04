import './App.css';
import React, { useState } from 'react';

function App() {
  //const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [file, setFile] = useState(null);
  const [output, setOuput] = useState('');
  const [showForm, setShowForm] = useState(true);

  /*function handleIDChange(event) {
    setID(event.target.value);
  }*/

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleGameIDChange(event) {
    setGameID(event.target.value);
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    setFile(URL.createObjectURL(selectedFile));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    //formData.append('id', id);
    formData.append('name', name);
    formData.append('gameID', gameID);
    formData.append('file', file);

    try {
      console.log('Sending fetch requests.');
      const response = await fetch('http://54.215.33.178:8000/api/images/', {
        method: 'POST',
        body: formData,
      });
      console.log('Converting to JSON');
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        alert('File uploaded successfully');
      } else {
        console.error('Error:', data);
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
      
      setShowForm(false);
      setOuput(' Name: ' + name + ' Game ID: ' + gameID)
    }

  return (
      <>
        <div>
          {showForm && (<form onSubmit={handleSubmit}>
            {/* <div>
              <label> ID:</label>
              <input type="text" id="id" value={id} onChange={handleIDChange} />
            </div> */}
            <div>
              <label> Name:</label>
              <input type="text" id="name" value={name} onChange={handleNameChange} />
            </div>
            <div>
              <label>Game ID:</label>
              <input type="text" id="gameID" value={gameID} onChange={handleGameIDChange} />
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
