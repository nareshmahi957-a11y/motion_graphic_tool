import { loadFont } from "@remotion/google-fonts/Montserrat";
// Load Montserrat with default optimized settings (Latin subset, standard weights)
loadFont();
import React from "react";
import { Composition, registerRoot } from "remotion"; 
import { MasterSequence } from "../templates/Animations";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={MasterSequence}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        scenes: [],
        captions: [], // ⚡ CRITICAL: Whitelist the captions array!
        color: "#a855f7",
        activeLayers: {}, 
        backgroundMode: 'black',
        layoutMode: 'full',
        reactionVideoUrl: ''
      }}
    />
  );
};

// 🟢 This tells the server bundler where the video starts
registerRoot(RemotionRoot);