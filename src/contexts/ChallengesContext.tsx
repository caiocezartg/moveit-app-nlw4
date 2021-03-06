import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json'
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: string;
    description: string;
    amount: number;  
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData); //Criando o contexto

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps){ //Funções e constantes que o Contexto providencia
    const [level, setLevel] = useState(rest.level);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);


    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) //XP necessário para upar

    useEffect(() => {
        Notification.requestPermission();
    }, []) //Ativa-se uma vez quando o componente é exibido em tela

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp(){
        setLevel(level + 1); //Sobe o level
        setIsLevelUpModalOpen(true);
    }

    function closeModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length); //Pega um desafio aleatório através do número arredondado pra baixo
        const challenge = challenges[randomChallengeIndex]; //pegando a index aleatória do JSON

        setActiveChallenge(challenge); //Novo desafio

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio 🎉🥳', {
                body: `Valendo ${challenge.amount} xp!`
            })

        };
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if (!activeChallenge){
            return;
        }

        const { amount } = activeChallenge; //XP ganho

        let finalExperience = currentExperience + amount; //XP ganho + exp atual

        if (finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel; 
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }


    return (
        <ChallengesContext.Provider value={{level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel, completeChallenge, closeModal}}>
            {children}

            { isLevelUpModalOpen && <LevelUpModal />}
        </ ChallengesContext.Provider>
    );
}