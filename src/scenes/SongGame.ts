import { Assets, Container, Sprite } from "pixi.js";
import { sound } from '@pixi/sound';
import { SongButton } from "../UI/SongButton";
import { songs } from "./songs";
import { Manager } from "../utils/Manager";
import '@pixi/gif';
import { IScene } from "../utils/IScene";

export class SongGame extends Container implements IScene{

    constructor() {
        super();

        const blackPaper = Sprite.from("BlackPaper");
        this.addChild(blackPaper);


        const NUMERO_OPCIONES = 4; // Número total de opciones por pregunta

        const generarPregunta = (): void => {
            const opciones = [];
            const opcionesIndices = [];

            // Obtén una canción aleatoria como la opción correcta
            const indiceCorrecto = getRandomInteger(0, songs.length - 1);
            const cancionCorrecta = songs[indiceCorrecto];
            opciones.push(cancionCorrecta);
            opcionesIndices.push(indiceCorrecto);

            // Genera opciones incorrectas hasta alcanzar el número total de opciones
            while (opciones.length < NUMERO_OPCIONES) {
                const indiceIncorrecto = getRandomInteger(0, songs.length - 1);
                // Verifica que el índice no esté repetido y no sea el índice de la opción correcta
                if (!opcionesIndices.includes(indiceIncorrecto) && indiceIncorrecto !== indiceCorrecto) {
                    opciones.push(songs[indiceIncorrecto]);
                    opcionesIndices.push(indiceIncorrecto);
                }
            }

            
            const soundWave = Assets.get('SoundWave');
            sound.play(cancionCorrecta.audio);
            soundWave.height = 500;
            soundWave.anchor.set(0.5);
            soundWave.position.set(Manager.width / 2, 430)
            soundWave.eventMode = 'static';
            soundWave.cursor = 'pointer';
            let isPlaying = true;
            soundWave.onpointerup = () => {
                if (isPlaying) {
                    soundWave.height = 100
                    sound.stopAll();
                    isPlaying = false;
                } else {
                    soundWave.height = 500
                    sound.play(cancionCorrecta.audio)
                    isPlaying = true;
                }
            }
            this.addChild(soundWave);

            const buttonPositions = [650, 800, 950, 1100]; // Posiciones verticales de los botones

            opciones.sort(() => Math.random() - 0.5); // Reordena aleatoriamente las opciones

            const buttonsContainer = new Container();
            this.addChild(buttonsContainer);

            opciones.forEach((opcion, i) => {
                const button: SongButton = new SongButton(opcion.band);
                button.position.set(Manager.width / 2, buttonPositions[i]);

                button.onpointerup = () => {
                    if (opcion === cancionCorrecta) {
                        console.log("CORRECTO!")
                        button.setButtonColor(0x00C18C);
                        sound.play("Correct");
                    } else {
                        console.log("Incorrecto!")
                        button.setButtonColor(0xF33302);
                        sound.play("Wrong");
                    }
                    setTimeout(() => {
                        this.removeChild(buttonsContainer);
                        sound.stopAll();
                        generarPregunta();
                    }, 1000);

                }
                buttonsContainer.addChild(button);
                button.name = `button${i}`;
            });

            console.log(cancionCorrecta);

        }

        // Función para generar números enteros aleatorios
        function getRandomInteger(min: number, max: number): number {
            return Math.round(Math.random() * (max - min) + min);
        }

        // Genera una pregunta
        generarPregunta();


    }
    update(_framesPassed: number): void {
        //throw new Error("Method not implemented.");
    }

}