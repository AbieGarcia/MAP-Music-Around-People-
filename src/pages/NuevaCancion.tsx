import React, { useState, useRef } from 'react';
import { IonContent, IonMenuButton, IonHeader, IonButton, IonPage, IonTitle, IonToolbar, IonModal, IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonImg, IonIcon, IonText } from '@ionic/react';
import { playCircleOutline, stopCircleOutline, musicalNoteOutline } from 'ionicons/icons';
import { searchTracks, Track } from '../service/DeezerMusic';
import './NuevaCancion.css';
import { Geolocation } from '@capacitor/geolocation';      // Sensor GPS
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Importamos la conexión

import './Generos.css';
import './Home.css';
import MainLayout from '../components/MainLayout';

const NuevaCancion: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [results, setResults] = useState<Track[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [cancion, setCancion] = useState<Track | null>(null);
  const [genero, setGenero] = useState("");

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

  const handleSearch = async (ev: any) => {
    const query = ev.detail.value;
    if (query && query.length > 2) {
      const tracks = await searchTracks(query);
      setResults(tracks);
    } else {
      setResults([]);
    }
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = (track: Track) => {
    // Si ya está sonando esta canción, la pausamos
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

  const agregarCancion = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });

      await setDoc(doc(db, "Canciones"), {
        Id: cancion?.id,
        Album: cancion?.album.title,
        Artista: cancion?.artist.name,
        Duracion: formatDuration(cancion?.duration || 0),
        Genero: genero,
        Img: cancion?.album.cover_medium,
        Titulo: cancion?.title,
        Ubicacion: coords,
        Usuario: usuario.Nombre,
      });
      alert("canción agregada con éxito");

    }
    catch (e) {
      console.error("error añadiendo el documento:", e);

    }
  }

  return (
    <MainLayout title='nuevaCancion'>

      <IonContent fullscreen>
        <div className='fondoPrincipal2'>
          <div className='fondoPrincipal3'>
            <div className='text-center text-white bg-[#1B1E3F] mt-10 py-5 px-2 rounded-[20px] w-[290px] font-bold text-4xl '>
              <h1>NUEVA CANCIÓN</h1>
            </div>

            <IonSearchbar
              className='Bar'
              placeholder="Buscar canción..."
              onIonInput={handleSearch}
              debounce={800}
              animated
            />


            {results.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '60px', color: '#e4e4e4' }}>
                <IonIcon icon={musicalNoteOutline} style={{ fontSize: '48px' }} />
                <p>Busca una canción para comenzar</p>
              </div>
            )}

            <IonList className='lista_cont'>
              {results.map((track) => {
                const isPlaying = playingId === track.id;

                return (


                  <IonItem
                    className='lista'
                    key={track.id}
                    button
                    onClick={() => {
                      togglePlay(track);
                      setCancion(track);
                    }}
                    color={isPlaying ? 'light' : undefined}
                  >
                    <IonThumbnail slot="start">
                      <IonImg src={track.album.cover_medium} alt={track.album.title} />
                    </IonThumbnail>

                    <IonLabel>
                      <h2 style={{
                        fontSize: '19px',
                        fontWeight: isPlaying ? 'bold' : 'normal',
                        color: isPlaying ? '#2a1474' : undefined
                      }}>
                        {track.title}
                      </h2>
                      <p style={{ color: isPlaying ? '#2a1474' : '#ffff' }}>{track.artist.name}</p>
                      <small>{formatDuration(track.duration)}</small>

                    </IonLabel>

                    <IonIcon
                      slot="end"
                      icon={isPlaying ? stopCircleOutline : playCircleOutline}
                      color={isPlaying ? 'danger' : 'success'}
                      style={{ fontSize: '28px' }}
                    />
                  </IonItem>

                );
              })}
            </IonList>
            {cancion!=null && 
          <>
            <IonButton className='btn2' id='open-modal' expand="block">Agregar Canción</IonButton>

            <IonModal className='modal' ref={modal} trigger="open-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
              <div className='flex flex-col gap-5'>
                <div className='self-center text-center text-white bg-[#1B1E3F] mt-5 py-5 px-2 rounded-[20px] w-[350px] font-bold text-2xl '>
                  <h1>ELIGE EL GÉNERO MUSICAL</h1>
                </div>
                <div className='flex flex-col self-center gap-4'>
                  <div className='flex flex-row self-center gap-2'>
                    <button className='pop w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("pop")}>POP</button>
                    <button className='rock w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("rock")}>ROCK</button>
                    <button className='EDM w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("EDM")}>EDM</button>
                    <button className='rap w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("rap")}>RAP</button>
                  </div>
                  <div className='flex flex-row self-center gap-2'>
                    <button className='indie w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("indie")}>INDIE</button>
                    <button className='country w-[100px] h-[70px] rounded-lg font-bold text-white text-xl' onClick={e => setGenero("country")}>COUNTRY</button>
                    <button className='jazz w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("jazz")}>JAZZ</button>
                    <button className='mx w-[100px] h-[70px] rounded-lg font-bold text-white text-lg' onClick={e => setGenero("mx")}>REGIONAL MX</button>
                  </div>
                  <div className='flex flex-row self-center gap-2'>
                      <button className='kpopo w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("kpop")}>K-POP</button>
                      <button className='otro w-[100px] h-[70px] rounded-lg font-bold text-white text-2xl' onClick={e => setGenero("otro")}>OTRO</button>
                  </div>
                </div>
                <button className='btn text-2xl italic self-center mt-4 text-white' onClick={e => agregarCancion()}>CONFIRMAR</button>
              </div>
              console.log("Holi")

            </IonModal>
          </>
            }
          </div>
        </div>
      </IonContent>
      <IonMenuButton style={{ position: 'absolute', top: 5, left: 10, zIndex: 1000, padding: 0, border: 'none', background: 'transparent', height: '100px', width: '100px' }}>
        <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[80px] h-[80px] rounded-full ' />
      </IonMenuButton>
    </MainLayout >
  );
};

export default NuevaCancion;

