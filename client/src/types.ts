export interface User{
    username: String;
    password: String;
    firstName?: String;
    lastName?: String;
    email?: String;
    gamesPlayed?: Number;
}

export interface DrawRound {
    gameId: Number;
    playerId: Number;
    round: Number;
    totalRounds: Number;
    prompt: string;
}

export interface StartPromptRound {
    gameId: Number;
    playerId: Number;
    imageId: Number;
}

export interface InitPromptRound {
    gameId: Number;
    playerId: Number;
}