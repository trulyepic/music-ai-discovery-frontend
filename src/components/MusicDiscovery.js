import React, { useState } from "react";
import { getRecommendations } from "./apis/api";
import { formatRecommendations } from "./utils/formatRecommendations";

const MusicDiscovery = () => {
  const [genre, setGenre] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(3);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Function to process and extract the correct keys dynamically
  const processData = (apiData, genre) => {
    if (!apiData) return null;

    // Find the correct keys dynamically
    const topSongsKey = Object.keys(apiData).find((key) =>
      key.startsWith("Top 10 Songs Based on")
    );

    const recommendationsKey = Object.keys(apiData).find((key) =>
      key.startsWith("Song Recommendations Based on")
    );

    return {
      topSongs: apiData[topSongsKey] || [],
      recommendations: recommendationsKey ? apiData[recommendationsKey] : "",
    };
  };

  const handleFetch = async () => {
    setError("");
    setData(null);
    setLoading(true);

    if (!genre.trim()) {
      setError("⚠️ Please enter a genre.");
      setLoading(false);
      return;
    }

    const result = await getRecommendations(genre, numRecommendations);
    console.log("API Response:", result);
    if (result.error) {
      setError(result.error);
    } else {
      //   setData(processData(result, genre));

      const processedData = processData(result);
      // 🔥 Extract recommendations safely
      const recommendationsKey = Object.keys(result).find((key) =>
        key.startsWith(`Song Recommendations Based on`)
      );
      const rawRecommendations = recommendationsKey
        ? result[recommendationsKey]
        : "";

      console.log("Extracted Recommendations:", rawRecommendations);
      setData({
        ...processedData,
        recommendations: rawRecommendations,
        formattedRecommendations: formatRecommendations(rawRecommendations),
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex-grow">
        {/* User Inputs */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-[#A3BFFA]">
            Genre:
          </label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Enter genre (e.g., rock, pop)"
            className="w-full p-3 bg-[#4A5568] text-[#E2E8F0] rounded-md focus:ring-2 focus:ring-[#4C51BF] outline-none"
          />

          <label className="block text-lg font-semibold text-[#A3BFFA]">
            Number of tracks:
          </label>
          <input
            type="number"
            value={numRecommendations}
            onChange={(e) =>
              setNumRecommendations(
                Math.max(1, Math.min(30, Number(e.target.value)))
              )
            }
            min="1"
            max="30"
            className="w-full p-3 bg-[#4A5568] text-[#E2E8F0] rounded-md focus:ring-2 focus:ring-[#4C51BF] outline-none"
          />

          <p className="text-[#a3befaa0] text-sm">
            🔹 Select between <strong>1</strong> and <strong>30</strong> tracks.
          </p>

          {/* ✅ Button with Spinner */}
          <button
            onClick={handleFetch}
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-md transition duration-300 flex justify-center items-center mt-6 ${
              loading
                ? "bg-[#4C51BF] opacity-70 cursor-not-allowed"
                : "bg-[#4C51BF] hover:bg-[#3C40A0] text-white"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0H4z"
                  ></path>
                </svg>
                Fetching...
              </>
            ) : (
              "🎶 Discov It!"
            )}
          </button>

          {error && (
            <p className="text-[#F56565] text-sm font-medium">{error}</p>
          )}
        </div>

        {/* Display Results */}
        {data && (
          <div className="space-y-6 mt-6">
            {/* 🎼 Top 10 Songs */}
            <div className="bg-[#2D3748] border-l-8 border-[#A3BFFA] p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold text-[#4C51BF]">
                Top 10 Songs Based on {genre}
              </h3>
              <ul className="mt-2 space-y-2">
                {data.topSongs.map((song, index) => (
                  <li key={index} className="text-[#E2E8F0]">
                    🎵 {song}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1E293B] border-l-8 border-[#4C51BF] p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold text-[#A3BFFA]">
                Song Recommendations Based on {genre}
              </h3>
              <div className="mt-4 space-y-4">
                {data.formattedRecommendations.length > 0 ? (
                  data.formattedRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-[#2D3748] p-4 rounded-md shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-[#A3BFFA]">
                        {rec.song}
                      </h4>
                      <p className="text-sm text-[#E2E8F0] font-medium">
                        🎤 {rec.artist}
                      </p>
                      <p className="text-[#E2E8F0]">{rec.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#E2E8F0]">
                    No structured recommendations available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center py-4 mt-10 bg-[#2D3748] rounded-lg shadow-md border-t border-[#4C51BF]">
        <p className="text-[#A3BFFA] text-sm font-medium">
          Powered by <span className="text-[#c0c3f3] font-bold">OpenAI</span> &{" "}
          <span className="text-[#c0c3f3] font-bold">Last.fm</span>
        </p>
      </footer>
    </div>
  );
};

export default MusicDiscovery;
