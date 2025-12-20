import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';
const GAME_STATE_KEY = 'gamemode_state';

interface GameState {
    gameId: string | null;
    status: 'idle' | 'waiting' | 'playing';
    players: string[];
    opponentScore?: number;
    opponentCorrectCount?: number;
    quizId?: number;
    isOpponentFinished?: boolean;
}


const loadGameState = (): GameState => {
    if (typeof window === 'undefined') {
        return {
            gameId: null,
            status: 'idle',
            players: [],
            opponentScore: 0,
            isOpponentFinished: false,
        };
    }

    try {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('[useGamemode] Restored game state from localStorage:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('[useGamemode] Failed to load game state:', error);
    }

    return {
        gameId: null,
        status: 'idle',
        players: [],
        opponentScore: 0,
        isOpponentFinished: false,
    };
};


const saveGameState = (state: GameState) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
        console.log('[useGamemode] Saved game state to localStorage:', state);
    } catch (error) {
        console.error('[useGamemode] Failed to save game state:', error);
    }
};

export const useGamemode = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameState, setGameState] = useState<GameState>(loadGameState);



    useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    useEffect(() => {
        const newSocket = io(BACKEND_URL);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);


            if (gameState.gameId && gameState.status !== 'idle') {
                console.log('[useGamemode] Detected saved game state, attempting to rejoin...');


                newSocket.emit('rejoinGame', { gameId: gameState.gameId });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        newSocket.on('createdGame', (data: any) => {
            console.log('Game created:', data);
            setGameState((prev) => ({
                ...prev,
                gameId: data.gameId,
                status: data.status,
            }));
        });

        newSocket.on('joinedGame', (data: any) => {
            console.log('Joined game:', data);
            if (data) {
                setGameState((prev) => ({
                    ...prev,
                    gameId: data.gameId || prev.gameId,
                    status: data.status || 'waiting',
                    players: data.players || []
                }));
            }
        });

        newSocket.on('gameStarted', (data: any) => {
            console.log('Game started:', data);
            setGameState((prev) => ({
                ...prev,
                status: 'playing',
                quizId: data.quizId
            }));
        });

        newSocket.on('opponentScoreUpdate', (data: any) => {
            console.log('Opponent score update:', data);
            setGameState((prev) => ({
                ...prev,
                opponentScore: data.score,
                opponentCorrectCount: data.correctCount
            }));
        });

        newSocket.on('opponentFinished', (data: any) => {
            console.log('[useGamemode] Opponent finished event received:', data);



            setGameState((prev) => ({ ...prev, isOpponentFinished: true }));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);


    const createGame = useCallback(() => {
        if (socket) {
            const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
            socket.emit('createGame', { gameId });
        }
    }, [socket]);

    const joinGame = useCallback((gameId: string, playerId: string) => {
        if (socket) {
            socket.emit('joinGame', { gameId, playerId });
        }
    }, [socket]);

    const submitScore = useCallback((gameId: string, playerId: string, score: number, correctCount: number) => {
        if (socket) {
            socket.emit('updateScore', { gameId, playerId, score, correctCount });
        }
    }, [socket]);

    const finishGame = useCallback((gameId: string, playerId: string) => {
        console.log('[useGamemode] Emitting playerFinished:', { gameId, playerId });
        if (socket) {
            socket.emit('playerFinished', { gameId, playerId });
        }
    }, [socket]);

    const resetGame = useCallback(() => {
        const newState = {
            gameId: null,
            status: 'idle' as const,
            players: [],
            opponentScore: 0,
            isOpponentFinished: false,
        };
        setGameState(newState);

        if (typeof window !== 'undefined') {
            localStorage.removeItem(GAME_STATE_KEY);
            console.log('[useGamemode] Cleared game state from localStorage');
        }
    }, []);

    return {
        socket,
        isConnected,
        gameState,
        createGame,
        joinGame,
        submitScore,
        finishGame,
        resetGame,
    };
};
