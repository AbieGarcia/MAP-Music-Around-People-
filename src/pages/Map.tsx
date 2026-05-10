import { IonMenuButton, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import Menu from '../components/Menu';
import MainLayout from '../components/MainLayout';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const Map: React.FC = () => {
    const position: [number, number] = [51.505, -0.09];

    return (
        <MainLayout title='Mapa'>
            <div style={{ width: "100vw", height: "100vh", position: 'relative' }}>
                <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
                    {/* Capa de OpenStreetMap */}
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            Un marcador de ejemplo en Ionic.
                        </Popup>
                    </Marker>
                </MapContainer>
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
