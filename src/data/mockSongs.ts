import { Song } from '../types';

export const mockSongs: Record<string, Song[]> = {
  joy: [
    {
      id: 'joy-1',
      title: 'Happy',
      artist: 'Pharrell Williams',
      album: 'G I R L',
      coverUrl: 'https://images.pexels.com/photos/1616470/pexels-photo-1616470.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'joy-2',
      title: 'Good Feeling',
      artist: 'Flo Rida',
      album: 'Wild Ones',
      coverUrl: 'https://images.pexels.com/photos/1051077/pexels-photo-1051077.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'joy-3',
      title: 'Can\'t Stop the Feeling',
      artist: 'Justin Timberlake',
      album: 'Trolls (Original Motion Picture Soundtrack)',
      coverUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ],
  sadness: [
    {
      id: 'sad-1',
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      coverUrl: 'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
    {
      id: 'sad-2',
      title: 'Fix You',
      artist: 'Coldplay',
      album: 'X&Y',
      coverUrl: 'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    },
    {
      id: 'sad-3',
      title: 'Hello',
      artist: 'Adele',
      album: '25',
      coverUrl: 'https://images.pexels.com/photos/2249063/pexels-photo-2249063.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    },
  ],
  anger: [
    {
      id: 'anger-1',
      title: 'Break Stuff',
      artist: 'Limp Bizkit',
      album: 'Significant Other',
      coverUrl: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    },
    {
      id: 'anger-2',
      title: 'Killing In The Name',
      artist: 'Rage Against The Machine',
      album: 'Rage Against The Machine',
      coverUrl: 'https://images.pexels.com/photos/2444859/pexels-photo-2444859.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    },
    {
      id: 'anger-3',
      title: 'Given Up',
      artist: 'Linkin Park',
      album: 'Minutes to Midnight',
      coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    },
  ],
  neutral: [
    {
      id: 'neutral-1',
      title: 'Weightless',
      artist: 'Marconi Union',
      album: 'Ambient',
      coverUrl: 'https://images.pexels.com/photos/1826388/pexels-photo-1826388.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    },
    {
      id: 'neutral-2',
      title: 'Pure Shores',
      artist: 'All Saints',
      album: 'Saints & Sinners',
      coverUrl: 'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    },
    {
      id: 'neutral-3',
      title: 'Watermark',
      artist: 'Enya',
      album: 'Watermark',
      coverUrl: 'https://images.pexels.com/photos/355863/pexels-photo-355863.jpeg?auto=compress&cs=tinysrgb&w=600',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    },
  ],
};

export const getRandomSongsForEmotion = (emotion: string, count: number = 3): Song[] => {
  const emotionSongs = mockSongs[emotion] || mockSongs.neutral;
  // For demo purposes, we'll just return all songs for that emotion, but in a real
  // application we would implement a proper selection algorithm
  return emotionSongs.slice(0, count);
};