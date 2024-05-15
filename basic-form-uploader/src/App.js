import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [ name, setName ] = useState('');
  const [ gameID, setGameID ] = useState('');
  const [ file, setFile ] = useState(null);
  const [ showForm, setShowForm ] = useState(true);
  
  let output = "output";
  function handleSubmit(event) {
    setName(event.target.elements.name.value);
    setGameID(event.target.elements,gameID.value);
    setShowForm(false);
    output = 'Name: ' + name + 'Game ID: ' + gameID;
  }

  function handleFileChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <div>
      {showForm && (
        <form onSubmit={handleSubmit}>
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
         <div>
          <label>
            Add Image:
            <input type="file" onChange={handleFileChange}/>
            <img src={file}/>
          </label>
         </div>
         <button type="submit" value="Submit">Submit</button>
        </form>
     )}
     </div>
     <div className="output">{output}</div>
    </>
  );
}

export default App;
