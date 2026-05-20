import { IonMenuButton, IonButton, IonModal } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import './NuevaCancion.css';
import Menu from '../components/Menu';
import MainLayout from '../components/MainLayout';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { Geolocation } from '@capacitor/geolocation';  // Sensor GPS
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Importamos la conexión
import { collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const RecenterMap: React.FC<{ latlng: [number, number] | null }> = ({ latlng }) => {
    const map = useMap();

    useEffect(() => {
        if (latlng) {
            map.setView(latlng, 13);
        }
    }, [latlng, map]);

    return null;
};

const Map: React.FC = () => {
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [canciones, setCanciones] = useState<any[]>([]);

    // 1. OBTENER CANCIONES EN TIEMPO REAL
    useEffect(() => {
        const q = query(collection(db, "Canciones")); //// Define qué se busca 

        const unsubscribe = onSnapshot(q, (snapshot) => {  //se va a ejecutar cada vez que haya cambios en la colección mensajes, y snapshot es el resultado de la consulta
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //transformamos el snapshot en un array de objetos con id y datos
            setCanciones(docs); //actualiza los mensajes con los datos obtenidos
        });

        return () => unsubscribe(); // Limpiamos la conexión al salir
    }, []);

    useEffect(() => {
        const getCurrentPosition = async () => {
            try {
                const position = await Geolocation.getCurrentPosition();
                const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
                setCoords(newCoords);
            } catch (error) {
                console.error("Error getting current position:", error);
            }
        };

        getCurrentPosition();
    }, []);



    return (
        <MainLayout title='Mapa'>
            <div style={{ width: "100vw", height: "100vh", position: 'relative' }}>
                <MapContainer center={coords ? [coords.lat, coords.lng] : [0, 0]} zoom={7} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
                    {/* Capa de OpenStreetMap */}
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {coords && <RecenterMap latlng={[coords.lat, coords.lng]} />}

                    {canciones.map((c) => {
                        console.log("Canción:", c);
                        return (
                            <Marker key={c.id} position={c.Ubicacion ? [c.Ubicacion.lat, c.Ubicacion.lng] : [0, 0]} eventHandlers={{
                                click: () => {
                                    setShowModal(true);        // Abrir Modal
                                    console.log("Lol, canciones:", canciones)
                                },
                            }}>
                                <Popup>{c.Titulo}</Popup>
                            </Marker>
                        );
                    })}
                    {/* <Marker position={coords ? [coords.lat, coords.lng] : [0, 0]} eventHandlers={{
                        click: () => {
                            setShowModal(true);        // Abrir Modal
                            console.log("Lol, canciones:", canciones)
                        },
                    }}>
                    </Marker> */}
                </MapContainer>
                <IonModal className={`modal3`} isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>

                </IonModal>
                <IonMenuButton style={{ position: 'absolute', top: 5, left: 50, zIndex: 1000, padding: 0, border: 'none', background: 'transparent', height: '100px', width: '100px' }}>
                    <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[80px] h-[80px] rounded-full ' />
                </IonMenuButton>
                <IonButton style={{ position: 'absolute', top: 820, left: 350, zIndex: 1000, padding: 0, border: 'none', '--background': 'radial-gradient(circle at bottom right, #1B1E3F, #7C3AED)', '--border-radius': '200px', width: '60px', height: '60px' }}>
                    <p className='text-white font-bold text-6xl'>+</p>
                </IonButton>

            </div>
        </MainLayout >
    );
};

export default Map;
