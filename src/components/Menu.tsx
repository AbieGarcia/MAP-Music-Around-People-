import {
    IonContent, IonIcon, IonItem, IonMenu, IonMenuToggle, IonHeader, IonToolbar
} from '@ionic/react';
import {
    gridOutline, listOutline, addCircleOutline, settingsOutline,
    logOutOutline, chevronForwardOutline, cubeOutline, personCircleOutline, closeOutline, personOutline, musicalNote, peopleOutline, globeOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Importamos la conexión
import { where, getDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Menu: React.FC = () => {
    const [Reciente, setReciente] = useState<{ Album: string, Artista: string, Duracion: string, Genero: string, Id: number, Img: string, Titulo: string, Usuario: string } | null>(null);
    const [canciones, setCanciones] = useState<any[]>([]);
    const [usuarioActual, setUsuarioActual] = useState<any>(null);

    const location = useLocation(); // sirve para ver cual pestaña esta activa y cual item del menú está activo
    const menuOpc = [
        { title: 'Perfil', url: '/profile', icon: personOutline },
        { title: 'Canciones', url: '/nuevacancion', icon: musicalNote },
        { title: 'MusicMatch', url: '/', icon: peopleOutline },
        { title: 'Mapa', url: '/map', icon: globeOutline },
    ]

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
    
        // 
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
              setCanciones([]);
              return;
            }
        
            const uid = user.uid;
        
            const q = query(collection(db, "Canciones"), where("UserId", "==", uid), orderBy("Fecha", "desc"), limit(1));
        
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
        



        // const q = query(collection(db, "Canciones" ), where("UserId", "==", uid), orderBy("Fecha", "desc"),limit(1)); //// Define qué se busca 

        // const unsubscribe = onSnapshot(q, (snapshot) => {  //se va a ejecutar cada vez que haya cambios en la colección mensajes, y snapshot es el resultado de la consulta
        //     const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //transformamos el snapshot en un array de objetos con id y datos
            
        //     setCanciones(docs);
        // });
        
        return () => unsubscribeAuth(); // Limpiamos la conexión al salir
    }, []);

    return (
        <IonMenu contentId='main-content' type='overlay' style={{ '--width': '200px', '--height': '72vh', '--background': 'transparent' }} >
            <IonContent style={{ '--background': 'transparent' }}>
                <div className='flex flex-col h-full text-black' style={{ backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', borderRadius: '10px' }}>
                    <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[90px] h-[90px] rounded-full shadow-xl self-center mt-5' />

                    {/*MENU*/}
                    <div className='flex-1 px-3 py-4'>
                        {menuOpc.map((item, index) => (
                            <IonMenuToggle>
                                <IonItem
                                    routerLink={item.url} //ruta de navegacion a diferentes pags
                                    lines='none'
                                    detail={false} //oculta detalles automaticos de ionic
                                    className='p-0 m-0 bg-transparent text-inherit'
                                    style={{ '--background': 'transparent', '--color': 'inherit' }}
                                >
                                    <div className={`flex items-center justify-between w-full p-3 mb-4 rounded-2xl font-bold transition-all
                                        ${location.pathname === item.url
                                            ? 'bg-[#359FB7] text-white'
                                            : 'text-white bg-[#461599]'
                                        }`}>

                                        <div className='flex items-center gap-2'>
                                            <IonIcon icon={item.icon} className={`text-xl
                                        ${location.pathname === item.url
                                                    ? 'text-[#461599]'
                                                    : 'text-[#359FB7]'
                                                }`} />
                                            <span className='font-medium text-md'>{item.title}</span>
                                        </div>
                                    </div>


                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <div className='flex flex-col items-center ml-3 w-[150px] h-[250px] p-3 mb-4 rounded-2xl transition-all bg-[#359FB7]'>
                            <p className='font-bold text-white justify-center'>Última canción</p>
                            {canciones[0] ? (
                                <>
                                <img
                                    src={canciones[0].Img}
                                    alt={canciones[0].Titulo}
                                    className='w-[100px] h-[100px] rounded-lg mt-4'
                                />
                                <p className='text-center text-white mt-2 '>{canciones[0].Titulo} - {canciones[0].Artista}</p>
                                </>
                            ) : (
                                <p className='text-white mt-2'>¡Agrega una canción!</p>
                            )}
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonMenu >
    )
};
export default Menu;