import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  const handleSearch = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Por favor, digite um nome de usuário.");
      setProfile(null);
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${trimmedUsername}`
      );
      if (!response.ok)
        throw new Error(
          "Nenhum perfil foi encontrado com esse nome de usuário. Tente novamente."
        );

      const data = await response.json();
      setProfile({
        avatar_url: data.avatar_url,
        name: data.name || "Usuário sem nome",
        bio: data.bio || "Sem bio disponível",
      });
    } catch (err) {
      setError(err.message || "Erro ao buscar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Buscar Perfil do GitHub</h1>

      <div className="flex gap-2 mb-4">
        <input
          id="search-input"
          type="text"
          placeholder="Digite o nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          id="search-button"
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && (
        <p id="loading" className="mb-4">
          Carregando...
        </p>
      )}

      {error && (
        <p id="error" className="text-red-400 mb-4">
          {error}
        </p>
      )}

      {profile && (
        <div
          id="profile-container"
          className="bg-gray-800 p-4 rounded text-center max-w-sm"
        >
          <img
            id="profile-image"
            src={profile.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 id="profile-name" className="text-xl font-bold">
            {profile.name}
          </h2>
          <p id="profile-bio" className="text-sm text-gray-300">
            {profile.bio}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
