import { RootState, Game } from "../../utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: RootState["currentGame"] = {
    gameId: -1,
    playerId: -1,
    round: -1, 
    totalRounds: 6,
    prompt: "an anaconda"
}

const slice = createSlice({
    name: "currentGame",
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

export const currentGame = slice.reducer;

export const {setRound, setPrompt} = slice.actions;

export const currentGameSelector = (state: RootState) => state.currentGame;