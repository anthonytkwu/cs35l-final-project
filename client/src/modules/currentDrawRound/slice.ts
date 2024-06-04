import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    gameId: -1, 
    playerId: -1, 
    round: -1,
    totalRounds: 6, 
    prompt: ""
}

const slice = createSlice({
    name: "currentDrawRound",
    initialState, 
    reducers: {
        setRound: (state, action: PayloadAction<number>) => {
            if (state.totalRounds <= action.payload){
                state.round = action.payload;
            }
        },
        setPrompt: (state, action: PayloadAction<string>) => {
            state.prompt = action.payload;
        }
    }
});

export const currentDrawRound = slice.reducer;

export const {setRound, setPrompt} = slice.actions;

export const currentDrawRoundSelector = () => currentDrawRound;