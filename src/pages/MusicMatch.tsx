import { IonContent, IonIcon, IonLabel } from "@ionic/react";
import { playCircleOutline, stopCircleOutline, peopleOutline } from 'ionicons/icons';
import MainLayout from "../components/MainLayout";
import './MusicMatch.css';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { where, getDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const MusicMatch: React.FC = () => {
    const [canciones, setCanciones] = useState<any[]>([]);
    const [cancionesParaMatch, setCancionesParaMatch] = useState<any[]>([]);
    const [usuarioActual, setUsuarioActual] = useState<any>(null);

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

        useEffect(() =>{
            console.log(cancionesParaMatch)
        },[cancionesParaMatch]);

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

    return(
        <MainLayout title="MusicMatch">
            <IonContent fullscreen>
                <div className="fondoPrincipal4">
                    <IonLabel class="self-center font-bold text-4xl mt-[30px] bg-[#461599] px-10 py-4 rounded-xl">
                        <IonIcon icon={peopleOutline} className="mr-5 self-center"/>
                        MusicMatch
                    </IonLabel>
                </div>
            </IonContent>
        </MainLayout>
    );
};
export default MusicMatch;