import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonImg, IonIcon, IonText } from '@ionic/react';
import { playCircleOutline, stopCircleOutline, musicalNoteOutline } from 'ionicons/icons';
import { searchTracks, Track } from '../service/DeezerMusic';
import './Home.css';

const NuevaCancion: React.FC = () => {
  const [results, setResults] = useState<Track[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Music </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className='fondoPrincipal2'>
            <IonSearchbar
            placeholder="Buscar canción..."
            debounce={800}
            onIonInput={handleSearch}
            animated
            />

            {results.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
                <IonIcon icon={musicalNoteOutline} style={{ fontSize: '48px' }} />
                <p>Busca una canción para comenzar</p>
            </div>
            )}

            <IonList>
            {results.map((track) => {
                const isPlaying = playingId === track.id;
                
                return (
                    <IonItem
                    key={track.id}
                    button
                    onClick={() => togglePlay(track)}
                    color={isPlaying ? 'light' : undefined}
                    >
                    <IonThumbnail slot="start">
                    <IonImg src={track.album.cover_medium} alt={track.album.title} />
                    </IonThumbnail>

                    <IonLabel>
                    <h2 style={{
                        fontWeight: isPlaying ? 'bold' : 'normal',
                        color: isPlaying ? 'var(--ion-color-success)' : undefined
                        }}>
                        {track.title}
                    </h2>
                    <p>{track.artist.name}</p>
                    <IonText color="medium">
                        <small>{formatDuration(track.duration)}</small>
                    </IonText>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NuevaCancion;

