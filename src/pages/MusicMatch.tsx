import { IonContent, IonIcon, IonLabel, IonModal, IonMenuButton } from "@ionic/react";
import { playCircleOutline, stopCircleOutline, peopleOutline, heartOutline, closeOutline, pauseOutline, playOutline } from 'ionicons/icons';
import MainLayout from "../components/MainLayout";
import './MusicMatch.css';
import './NuevaCancion.css';
import './Home.css';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { where, getDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const MusicMatch: React.FC = () => {
    const [canciones, setCanciones] = useState<any[]>([]);
    const [cancionesParaMatch, setCancionesParaMatch] = useState<any[]>([]);
    const [cancionesDeezer, setCancionesDeezer] = useState<any[]>([]);
    const [usuarioActual, setUsuarioActual] = useState<any>(null);
    const [cancionActual, setCancionActual] = useState(0);
    const [usuarioMatch, setUsuarioMatch] = useState('');
    const [likes, setLikes] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuario logueado
                const uid = user.uid;

                //  Obtener info de Firestore
                const docRef = doc(db, "Usuarios", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUsuarioActual(docSnap.data());
                } else {
                    console.log("No existe el usuario");
                }
            } else {
                // Usuario no logueado
            }
        });
    }, []);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setCanciones([]);
                return;
            }

            const uid = user.uid;

            const q = query(collection(db, "Canciones"), where("UserId", "!=", uid), orderBy("UserId", "desc"));

            const unsubscribeSnapshot = onSnapshot(
                q,
                (snapshot) => {
                    const docs = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setCanciones(docs);
                },
                (error) => {
                    console.error("Error", error);
                }
            );

            return () => unsubscribeSnapshot();
        });
        return () => unsubscribeAuth(); // Limpiamos la conexión al salir
    }, []);

    useEffect(() => {
        if (canciones.length === 0) return;
        filtrar3canciones();
    }, [canciones]);

    useEffect(() => {
        console.log(cancionesParaMatch)
    }, [cancionesParaMatch]);

    const fetchTrack = async (trackId: any) => {
        if (!trackId) return;

        try {
            const response = await fetch(`/deezer/track/${trackId}`);
            if (!response.ok) {
                throw new Error(`Fetch Deezer failed: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching track:", error);
        }
    };

    const filtrar3canciones = () => {
        const agrupado: Record<string, any[]> = {};//Crea un tipo que permite guardar y agrupar las canciones

        canciones.forEach((song) => {
            const uid = song.UserId;
            if (!agrupado[uid]) {
                agrupado[uid] = [];
            }

            if (agrupado[uid].length < 3) {
                agrupado[uid].push(song);
            }

        });

        const resultado = Object.values(agrupado).flat();
        setCancionesParaMatch(resultado);

    };

    const like = (song: any) => { // Aquí se maneja la lógica de dar like a una canción
        const uid = song.UserId
        let currentlikes = 0;
        if (uid === usuarioMatch) {
            currentlikes = likes + 1;
            console.log(currentlikes);
        }
        else {
            currentlikes = 1;
            console.log(currentlikes);
        }
        setLikes(currentlikes);
        setUsuarioMatch(uid);

        if (currentlikes >= 3) {
            console.log('hiciste match');
            setSuccessMessage(`¡Haz hecho match con ${song.Usuario}!`);
            setShowSuccessModal(true);
        }

        if (cancionActual < cancionesParaMatch.length - 1) {
            setCancionActual((prev) => prev + 1);
        } else if (currentlikes < 3) {
            setSuccessMessage(`No hay ningún match por ahora`);
            setShowSuccessModal(true);
        }
    }

    const dislike = () => { //si dislike, solo avanzamos a siguiente canción
        if (cancionActual < cancionesParaMatch.length - 1) {
            setCancionActual((prev) => prev + 1);
        } else {
            setSuccessMessage(`No hay ningún match por ahora`);
            setShowSuccessModal(true);
        }
    }

    const togglePlay = async (song: any) => {
        const track = await fetchTrack(song.Id)


        if (!track || !track.preview) {
          console.warn('No se puede reproducir: preview no disponible', track);
          return;
        }

        if (playingId === track.id && currentAudio) {
          currentAudio.pause();
          setCurrentAudio(null);
          setPlayingId(null);
          return;
        }
    
        // Pausar cualquier otra canción
        if (currentAudio) {
          currentAudio.pause();
        }
    
        // Reproducir — en Deezer track.preview SIEMPRE tiene URL
        const audio = new Audio(track.preview);
        audio.play();
        setCurrentAudio(audio);
        setPlayingId(track.id);
    
        audio.onended = () => {
          setPlayingId(null);
          setCurrentAudio(null);
        };
    };

    return (
        <MainLayout title="MusicMatch">
            <IonContent fullscreen>
                <div className="fondoPrincipal4">
                    <div className="mt-[10vh] self-center flex flex-col">

                        <IonLabel class="self-center font-bold text-4xl bg-[#461599] px-7 py-4 rounded-xl">
                            <IonIcon icon={peopleOutline} className="mr-5 self-center" style={{ color: '#35B6D3' }} />
                            MusicMatch
                        </IonLabel>

                        <div className={cancionesParaMatch[cancionActual]?.Genero} style={{ height: '70vh', width: '80vw', display: 'flex', flexDirection: 'column', alignSelf: 'center', marginTop: '5vh', borderRadius: '20px' }}>
                            <img src={cancionesParaMatch[cancionActual]?.Img} className='h-[50%] w-[90%] self-center mt-4 rounded-xl'></img>
                            <h1 className='text-white font-bold text-3xl italic self-center mt-[7%]'>{cancionesParaMatch[cancionActual]?.Titulo}</h1>
                            <p className='text-white font-thin self-center text-lg mt-[4%]'>{cancionesParaMatch[cancionActual]?.Artista}</p>
                            <p className='text-white font-thin self-center text-lg'>{cancionesParaMatch[cancionActual]?.Album}</p>
                            <hr className=" w-[90%] self-center mt-[5%]"></hr>
                            <div className="flex flex-row self-center mt-5 gap-7">
                                <button onClick={dislike} className="h-[90px] w-[90px] rounded-full p-2" style={{ background: 'linear-gradient( #FFCDCD, #FFFF)' }}>
                                    <IonIcon icon={closeOutline} style={{ color: '#FF7373' }} className="text-7xl self-center" />
                                </button>
                                <button onClick={() => {
                                    if (cancionesParaMatch[cancionActual]) {
                                        togglePlay(cancionesParaMatch[cancionActual]);
                                    } else {
                                        console.warn('Track aún no cargado');
                                    }
                                }}>
                                    <IonIcon icon={playOutline} style={{ color: '#FFFFFF' }} className="text-7xl self-center" />
                                </button>
                                <button onClick={(e) => like(cancionesParaMatch[cancionActual])} className="h-[90px] w-[90px] rounded-full pt-3" style={{ background: 'linear-gradient( #A3FFC9, #FFFF)' }}>
                                    <IonIcon icon={heartOutline} style={{ color: '#49DA69' }} className="text-6xl self-center" />
                                </button>
                            </div>
                        </div>

                        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)} className='modal2'>
                            <div className='flex flex-col gap-5 p-5'>
                                <div className='self-center text-center text-white bg-[#1B1E3F] mt-5 py-5 px-2 rounded-[20px] w-[300px] font-bold text-2xl'>
                                    <p className='text-center text-white text-lg'>{successMessage}</p>
                                </div>
                                <button className='btn text-2xl italic self-center mt-4 text-white' onClick={() => setShowSuccessModal(false)}>Cerrar</button>
                            </div>
                        </IonModal>
                    </div>

                </div>
                <IonMenuButton style={{ position: 'absolute', top: 5, left: 10, zIndex: 1000, padding: 0, border: 'none', background: 'transparent', height: '100px', width: '100px' }}>
                    <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[80px] h-[80px] rounded-full ' />
                </IonMenuButton>
            </IonContent>
        </MainLayout>
    );
};
export default MusicMatch;