import { useIonRouter, IonInput, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenuButton } from '@ionic/react';
import { useHistory } from "react-router";
import { auth, db } from '../firebaseConfig'; // Importamos la conexión
import { where, getDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import './Home.css';
import './Generos.css';
import MainLayout from '../components/MainLayout';

const Profile: React.FC = () => {

    const [usuario, setUsuario] = useState<any>(null);
    const [canciones, setCanciones] = useState<any[]>([]);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuario logueado
                const uid = user.uid;

                //  Obtener info de Firestore
                const docRef = doc(db, "Usuarios", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUsuario(docSnap.data());
                } else {
                    console.log("No existe el usuario");
                }
            } else {
                // Usuario no logueado
            }
        });
    }, []);

    useEffect(() => { //traer las canciones más recientes
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setCanciones([]);
                return;
            }

            const uid = user.uid;

            const q = query(collection(db, "Canciones"), where("UserId", "==", uid), orderBy("Fecha", "desc"), limit(3));

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

    return (

        <MainLayout title='perfil'>
            <div className='fondoPrincipal'>
                <div className='flex flex-col items-center mt-[5vh] gap-4'>
                    <img src='src/imgs/default_profile.png' alt='Profile Image' className='w-[175px] h-[175px] rounded-full ' />
                    <h1 className='text-3xl font-bold text-white italic'>@{usuario?.Nombre}</h1>
                    <p className='text-xl underline '>{usuario?.Correo}</p>
                    <div className='bg-white/30 rounded-3xl h-[10vh] w-[70vw] flex flex-col  p-4 gap-1 blurtext backdrop-blur-[100px] shadow-lg '>
                        <h2 className='text-[#002D37] font-bold text-lg'>Sobre mi:</h2>
                        <p className='text-white text-sm font-light'>{usuario?.Descripcion}</p>
                    </div>
                    <div className='bg-[#42A4BA]/70 rounded-3xl h-[50vh] w-[70vw] flex flex-col items-center p-5 gap-2'>
                        <h2 className='text-[#002D37] font-bold text-2xl'>Mis canciones 🎧</h2>
                        <hr className='w-[90%]'></hr>
                        <div>
                            {canciones.length != 0 ? (
                                canciones.map((cancion) => (
                                    <div key={cancion.id} className={cancion.Genero} style={{ padding: 0, border: 'none', height: '120px', width: '260px', marginTop: '5px', borderRadius: '15px', display: 'flex', flexDirection: 'row', gap: '15px' }}>
                                        <img src={cancion.Img} alt={cancion.Titulo} className='w-[90px] h-[90px] m-1 mt-4 object-cover rounded-lg'></img>
                                        <div>
                                            <h3 className='text-white font-bold text-lg'>{cancion.Titulo}</h3>
                                            <p className='text-white text-sm font-light'>{cancion.Artista}</p>
                                            <p className='text-white text-sm'>{cancion.Album}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-white text-lg'>No tienes canciones aún.</p>
                            )}
                        </div>
                    </div>
                </div>
                <IonMenuButton style={{ position: 'absolute', top: 5, left: 10, zIndex: 1000, padding: 0, border: 'none', background: 'transparent', height: '100px', width: '100px' }}>
                    <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[80px] h-[80px] rounded-full ' />
                </IonMenuButton>
                <IonButton routerLink={'/nuevacancion'} style={{ position: 'absolute', top: 860, left: 330, zIndex: 1000, padding: 0, border: 'none', '--background': 'radial-gradient(circle at top left, #1B1E3F, #35B6D3)', '--border-radius': '200px', width: '60px', height: '60px' }}>
                    <p className='text-white font-bold text-6xl'>+</p>
                </IonButton>
            </div>
        </MainLayout>

    );
};

export default Profile;
