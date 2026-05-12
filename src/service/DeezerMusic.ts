import axios from 'axios';

// En vez de llamar a Deezer directo, usamos el proxy local de Vite
const deezerClient = axios.create({
  baseURL: '/deezer',  
});

export interface Track {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: { name: string };
  album: { title: string; cover_medium: string };
}

export const searchTracks = async (query: string): Promise<Track[]> => {
  try {
    const response = await deezerClient.get('/search', {
      params: { q: query, limit: 20 }
    });
    console.log("Datos recibidos de Deezer:", response.data); 
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error buscando en Deezer:", error);
    return [];
  }
};