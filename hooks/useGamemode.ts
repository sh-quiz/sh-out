import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface GameState {
    gameId: string | null;
    status: 'idle' | 'waiting' | 'playing';
    players: string[];
    opponentScore?: number;
    opponentCorrectCount?: number;
    quizId?: number;
    isOpponentFinished?: boolean;
}

export const useGamemode = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameState, setGameState] = useState<GameState>({
        gameId: null,
        status: 'idle',
        players: [],
        opponentScore: 0,
        isOpponentFinished: false,
    });

    useEffect(() => {
        const newSocket = io(BACKEND_URL);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
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
                    gameId: data.gameId || prev.gameId, // maintain if already set
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
            console.log('Opponent finished:', data);
            // If the message is from someone else (which it should be based on gateway logic, or we check ID)
            // Ideally gateway shouldn't echo to sender, but we can double check logic or just set state
            // Depending on architecture, we might verify ID. safely just setting true for demo.
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
        if (socket) {
            socket.emit('playerFinished', { gameId, playerId });
        }
    }, [socket]);

    const resetGame = useCallback(() => {
        setGameState({
            gameId: null,
            status: 'idle',
            players: [],
            opponentScore: 0,
            isOpponentFinished: false,
        });
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
