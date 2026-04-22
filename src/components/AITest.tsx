// Make sure this import path points correctly to where you saved ChromaKeyVideo.tsx!
// You might need to change it to something like "../ChromaKeyVideo"
import { ChromaKeyVideo } from "./ChromaKeyVideo"; 

export const AITest = ({ aiData }: { aiData?: any }) => {
  // We completely removed the "if (!aiData) return red screen" safety net!
  // Now it will forcefully render our test no matter what.

  return (
    <div style={{ flex: 1, backgroundColor: "black", position: "relative" }}>
      
      {/* LAYER 1: The Background */}
      <div style={{ position: "absolute", width: "100%", height: "100%" }}>
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1080" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          alt="background"
        />
      </div>

      {/* LAYER 2: The Transparent Speaker (The Cat!) */}
      <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10 }}>
         {/* Using your local renders folder */}
         <ChromaKeyVideo src="/renders/green.mp4" /> 
      </div>

    </div>
  )
}
