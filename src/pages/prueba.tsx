import React, { useState } from 'react';
import { IonContent, IonPage, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// // Corregir íconos por defecto de Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

const MapPage: React.FC = () => {
    // Estado para el modal y datos del marcador
    const [showModal, setShowModal] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

    const markersData = [
        { id: 1, position: [51.505, -0.09], title: 'Marcador 1' },
        { id: 2, position: [51.51, -0.1], title: 'Marcador 2' },
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Mapa con Modal</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Contenedor del Mapa */}
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {markersData.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position as [number, number]}
                            // --- AQUI ESTA LA MAGIA ---
                            eventHandlers={{
                                click: () => {
                                    setSelectedMarker(marker); // Guardar datos del marcador
                                    setShowModal(true);        // Abrir Modal
                                },
                            }}
                        // --------------------------
                        >
                            <Popup>{marker.title}</Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Modal de Ionic */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{selectedMarker?.title}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <p>Detalles del {selectedMarker?.title}</p>
                        <p>Coordenadas: {selectedMarker?.position[0]}, {selectedMarker?.position[1]}</p>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default MapPage;
