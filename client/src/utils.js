export const handleGameDataAndNavigate = (data, navigate) => {
    console.log(data);
    localStorage.setItem('game_code', data.game_code);
    localStorage.setItem('game_data', JSON.stringify(data)); // Stringify the data before storing it
    const storedGameData = JSON.parse(localStorage.getItem('game_data')); // Parse the stored data back to an object
    console.log(storedGameData.game_code + " lolololol");
    navigate(`/game-lobby`);
};