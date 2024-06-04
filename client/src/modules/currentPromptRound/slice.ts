import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    gameId: -1, 
    playerId: -1
}

const slice = createSlice({
    name: "currentPromptRound",
    initialState, 
    reducers: {
    }
});

export const currentDrawRound = slice.reducer;

export const currentDrawRoundSelector = () => currentDrawRound;