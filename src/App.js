import "./App.css";
import MusicDiscovery from "./components/MusicDiscovery";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141922] text-[#E2E8F0] p-6">
      <div className="w-full max-w-3xl p-6 bg-[#242c3a] rounded-lg shadow-lg border-2 border-[#4C51BF]">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-[#4C51BF]">
          🎵 Track Discov
        </h1>
        <MusicDiscovery />
      </div>
    </div>
  );
}

export default App;
