// main.js (ou script.js, mas com type="module")
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const profileContainer = document.getElementById("profile-container");
const profileImage = document.getElementById("profile-image");
const profileName = document.getElementById("profile-name");
const profileBio = document.getElementById("profile-bio");

async function searchUser() {
  const username = searchInput.value.trim();

  if (!username) {
    error.textContent = "Por favor, digite um nome de usuário.";
    error.classList.remove("hidden");
    profileContainer.classList.add("hidden");
    searchInput.focus();
    return;
  }

  loading.classList.remove("hidden");
  error.classList.add("hidden");
  profileContainer.classList.add("hidden");

  searchButton.disabled = true;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(
        "Nenhum perfil foi encontrado com esse nome de usuário. Tente novamente."
      );
    }

    const data = await response.json();
    profileImage.src = data.avatar_url;
    profileName.textContent = data.name || "Usuário sem nome";
    profileBio.textContent = data.bio || "Sem bio disponível";
    profileContainer.classList.remove("hidden");
  } catch (err) {
    error.textContent = err.message || "Erro ao buscar o perfil.";
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
    searchButton.disabled = false;
  }
}

searchButton.addEventListener("click", searchUser);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchUser();
  }
});
