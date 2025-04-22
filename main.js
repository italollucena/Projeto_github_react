const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const profileContainer = document.getElementById("profile-container");
const profileImage = document.getElementById("profile-image");
const profileName = document.getElementById("profile-name");
const profileBio = document.getElementById("profile-bio");
const profileLink = document.getElementById("profile-link");

async function searchUser() {
  const username = searchInput.value.trim();

  if (!username) {
    showError("Por favor, digite um nome de usuário.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      throw new Error("Nenhum perfil foi encontrado com esse nome de usuário. Tente novamente.");
    }

    if (response.status === 403) {
      throw new Error("Limite de requisições excedido. Tente novamente mais tarde.");
    }

    if (!response.ok) {
      throw new Error("Erro ao buscar o perfil.");
    }

    const data = await response.json();

    // Preenche os dados no card
    profileImage.src = data.avatar_url;
    profileName.textContent = data.name || "Usuário sem nome";
    profileBio.textContent = data.bio || "Sem bio disponível";
    profileLink.href = data.html_url;
    profileLink.textContent = "Ver perfil no GitHub";

    showProfile();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  searchButton.disabled = isLoading;
}

function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
  profileContainer.classList.add("hidden");
  searchInput.focus();
}

function showProfile() {
  error.classList.add("hidden");
  profileContainer.classList.remove("hidden");
}

// Eventos
searchButton.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchUser();
  }
});
