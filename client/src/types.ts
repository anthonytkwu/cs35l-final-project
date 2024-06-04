export type DrawRound = {
    gameId: number;
    playerId: number;
    round: number;
    totalRounds: number;
    prompt: string;
}

export type PromptRound = {
    gameId: number;
    playerId: number;
}

export type InitPromptRound = {
    gameId: number;
    playerId: number;
}