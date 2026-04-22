
import { Composition } from 'remotion';
import { DarkWealthTemplate } from './templates/Animations';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DarkWealthScene"
        component={DarkWealthTemplate}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};