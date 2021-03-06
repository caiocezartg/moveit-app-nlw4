import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext'
import styles from '../styles/components/Countdown.module.css'

let countdownTimeout: NodeJS.Timeout;

export function Countdown(){
    const { hasFinished, isActive, minutes, resetCountdown, seconds, startCountdown } = useContext(CountdownContext);

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');


    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            { hasFinished ? ( //Quando ciclo se encerra
                <button
                disabled 
                className={styles.countdownButton}
                >
                Ciclo encerrado
                </button>
            ) : (
                <>
                    { isActive ? ( //Caso ciclo ainda esteja ativo, vai mostrar o botão para abandonar o ciclo
                    <button 
                    type="button"
                    className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                    onClick={resetCountdown}>
                    Abandonar ciclo
                    </button>
                    ) : ( //Caso o ciclo ainda não está ativo, vai mostrar o botão para iniciar o ciclo
                    <button 
                    type="button"
                    className={styles.countdownButton}
                    onClick={startCountdown}>
                    Iniciar um ciclo
                    </button>
                    ) }
                </>
            )}

        </div>

    );
}