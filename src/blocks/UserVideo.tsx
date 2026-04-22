import { Video } from 'remotion';

interface UserVideoProps {
  url: string;
}

export const UserVideo = ({ url }: UserVideoProps) => {
  return (
    <Video
      src={url}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover', // This ensures the video fills the screen without weird black bars
        zIndex: 0 // ⚡ THE FIX: Bring it out from behind the black wall!
      }}
    />
  );
};
