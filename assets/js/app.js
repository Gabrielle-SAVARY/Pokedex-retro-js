const app = {
  pokedex: [],
  pokemonsTypes: [],
  activeTypes: [],
  pokedexEnd: 151,

  // FONCTIONS DE RECUPERATION DE DONNÉES
  // Chargement du fichier JSON du pokedex
  getPokedex: async function () {
    try {
      const response = await fetch("./data/pokedex.json");
      const data = await response.json();
      console.log(data, "data");
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      return [];
    }
  },

  // Chargement du fichier JSON des types de Pokémons
  getPokemonsTypes: async function () {
    try {
      const response = await fetch("./data/pokemonsTypes.json");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      return [];
    }
  },

  
  // FONCTIONS DE CREATION D'ELEMENTS DANS LE DOM
  // Récupère la couleur associée à un type
  getTypeColor: function (type) {
    const typeInfo = app.pokemonsTypes.find((typePokemon) => typePokemon.typeName === type);
    return typeInfo ? typeInfo.typeColor : "";
  },

  // Créer et affiche les cartes Pokémons dans le DOM
  displayPokemon: function (pokemonList) {
    // Récupère le conteneur où sont affichés les cartes Pokémon
    const pokemonsList = document.getElementById("pokemons-list");

    // Boucle sur les pokemons du pokedex
    for (let i = 0; i < app.pokedexEnd; i++) {
      // Pokémon actuel
      const pokemon = app.pokedex[i];
      // Créez une div pour la carte Pokémon
      const pokemonCard = document.createElement("article");
      pokemonCard.classList.add("pokemon-card");
      // Créez une div pour les informations du Pokémon
      const pokemonInfos = document.createElement("div");
      pokemonInfos.classList.add("pokemon-infos");

      // Créez un élément pour afficher l'identification du Pokémon
      const pokemonIdentification = document.createElement("h2");
      pokemonIdentification.textContent = `#${pokemon.index} ${pokemon.name}`;
      pokemonIdentification.classList.add("pokemon-identification");

      // Créez une div pour les types du Pokémon
      const pokemonTypesContainer = document.createElement("div");
      pokemonTypesContainer.classList.add("pokemon-types-container");

      if (pokemon.type) {
        // Boucle à travers les types du Pokémon
        pokemon.type.forEach((type) => {
          // Créez un span pour chaque type
          const typeSpan = document.createElement("span");
          typeSpan.textContent = type;
          typeSpan.classList.add("pokemon-type", `type-${type}`);

          // Récupère la couleur associée au type
          const typeColor = app.getTypeColor(type);
          // Applique la couleur de fond
          typeSpan.style.backgroundColor = typeColor;

          // Ajoutez le type au conteneur des types
          pokemonTypesContainer.appendChild(typeSpan);
        });
      }

      // Créez un élément image pour afficher l'image du Pokémon
      const pokemonImage = document.createElement("img");
      pokemonImage.src = pokemon.image;
      pokemonImage.alt = pokemon.name;
      pokemonImage.classList.add("pokemon-img");

      // Ajoute le nom et le type du Pokémon à la carte Pokémon
      pokemonInfos.appendChild(pokemonIdentification);
      pokemonInfos.appendChild(pokemonTypesContainer);
      //   pokemonInfos.appendChild(pokemonType);
      // Ajoute les informations à la carte Pokémon
      pokemonCard.appendChild(pokemonImage);
      pokemonCard.appendChild(pokemonInfos);
      // Ajoute la carte Pokémon au conteneur principal
      pokemonsList.appendChild(pokemonCard);
    }
  },

  // Ajoute ou supprime le type dans le tableau des types actifs
  toggleActiveType: function (type) {
    // Vérifie si le type est dans le tableau
    const index = app.activeTypes.indexOf(type);
    // Si le type n'est pas dans le tableau, l'ajoute
    if (index === -1) {
      app.activeTypes.push(type);
    } else {
      // Sinon, supprime le type du tableau
      app.activeTypes.splice(index, 1);
    }
  },

  // Créer les boutons de filtre de type de Pokémon
  createTypeFilterButtons: function (types) {
    const filtersContainer = document.querySelector(
      ".types-list__filters-container"
    );
    // Crée un bouton pour chaque type de Pokémon
    types.forEach((type) => {
      // Création du bouton
      const button = document.createElement("button");
      button.textContent = type.typeName;
      button.classList.add("type-filter-button");
      button.style.backgroundColor = type.typeColor;

      // Ajoute un écouteur d'événement pour le clic sur le bouton
      button.addEventListener("click", function () {
        // Réinitialise la barre de recherche
        app.clearSearchBar();

        // Ajoute ou supprime le type actif du tableau
        app.toggleActiveType(type.typeName);
        // Met à jour la classe CSS active du bouton
        if (app.activeTypes.includes(type.typeName)) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }

        // Filtre les Pokémon en fonction du tableau des types actifs
        app.filterPokemonByType(app.activeTypes);
      });

      // Ajoute le bouton au conteneur des boutons de filtre
      filtersContainer.appendChild(button);
    });
  },

  // FONCTIONS DE FILTRAGE DES DONNÉES
  // Filtre les Pokémon en fonction des types sélectionnés
  filterPokemonByType: function (types) {
    // Sélectionne tous les éléments Pokémon
    const pokemonCards = document.querySelectorAll(".pokemon-card");

    // Filtre des Pokémons
    pokemonCards.forEach((pokemonCard) => {
		// Récupère le type du Pokémon
		const pokemonAllTypes = pokemonCard.querySelectorAll(".pokemon-type");
    
	    // Vérifie si au moins un des types du Pokémon correspond à l'un des types sélectionnés
		const isMatch = Array.from(pokemonAllTypes).some((typeElement) => {
			const pokemonType = typeElement.textContent;
			return types.some((type) => pokemonType.includes(type));
		  });

      if (isMatch) {
        // Si le type correspond, affiche le Pokémon
        pokemonCard.style.display = "flex";
      } else {
        // Sinon, masque le Pokémon
        pokemonCard.style.display = "none";
      }
    });
  },

  // Fonction pour retirer les accents d'une chaîne
  removeAccents: function (string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },

  // Filtre les Pokemons selon du texte saisi dans la barre de recherche
  handleSearch: function () {
    // Texte recherché par l'utilisateur
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm, "searchTerm");
    // Si la barre de recherche est vide affiche tous les Pokemons
    if (searchTerm.length === 0) {
      app.showAllPokemon();
    }
    // Normalise le texte recherché
    const normalizeSearchTerm = app.removeAccents(searchTerm);
    console.log(normalizeSearchTerm, "normalizeSearchTerm");

    if (normalizeSearchTerm) {
      // Sépare le texte recherché en termes de recherche en ignorant les espaces
      const searchTerms = normalizeSearchTerm
        .split(" ")
        .filter((term) => term !== "");
      console.log("searchTerms", searchTerms);
      // Sélection de tous les Pokémon
      const pokemonCards = document.querySelectorAll(".pokemon-card");
      // Recherche
      pokemonCards.forEach((pokemonCard) => {
        // Récupère l'identification et le type du Pokémon
        const pokemonIdentity = pokemonCard
          .querySelector(".pokemon-identification")
          .textContent.toLowerCase();
        const normalizedPokemonIdentity = app.removeAccents(pokemonIdentity);
        const pokemonType = pokemonCard
          .querySelector(".pokemon-type")
          .textContent.toLowerCase();
        const normalizedPokemonType = app.removeAccents(pokemonType);

        // Initialise une variable pour vérifier si au moins un des termes est inclus
        let found = false;

        // Parcourt chaque terme de recherche
        searchTerms.forEach((term) => {
          if (
            normalizedPokemonIdentity.includes(term) ||
            normalizedPokemonType.includes(term)
          ) {
            found = true;
          }
        });
        // Affiche ou masque le Pokémon
        if (found) {
          pokemonCard.style.display = "flex";
        } else {
          pokemonCard.style.display = "none";
        }
      });
    }
    // Supprime la classe active de tous les boutons filtres de type
    app.clearActiveTypeFilter();
  },

  // AUTRES FONCTIONS POUR LA RENITIALISATION DES DONNÉES
  // Affiche tous les Pokémon
  showAllPokemon: function () {
    const pokemonCards = document.querySelectorAll(".pokemon-card");
    pokemonCards.forEach((pokemonCard) => {
      pokemonCard.style.display = "flex";
    });
  },

  // Vide la barre de recherche
  clearSearchBar: function () {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "";
  },
  // Supprime le filtre de type actif
  clearActiveTypeFilter: function () {
    // Supprime la classe active de tous les boutons filtres de type
    document.querySelectorAll(".type-filter-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    // Vide le tableau des types actifs
    app.activeTypes = [];
  },

  handleReset: function (buttonId) {
    // Réinitialise des recherches par la barre de recherche et les filtres de type
    const resetButton = document.getElementById(buttonId);
    resetButton.addEventListener("click", function () {
      // Reset les filtres et la recherche
      app.clearSearchBar();
      app.clearActiveTypeFilter();
      // Affiche tous les Pokémon
      app.showAllPokemon();
    });
  },

  // ECOUTEURS D'EVENEMENTS POUR L'INITIALISATION DE L'APPLICATION
  // Ecouteur d'événement sur la barre de recherche
  handleTypeSearchBar: function () {
    // Ajoute un écouteur d'évenement sur l'input pour faire la recherche
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", app.handleSearch);
  },

  // Ecouteur d'événement sur les bouton de réinitialisation
  handleClickResetBtn: function () {
    app.handleReset("reset-filter-button");
    app.handleReset("reset-search-button");
  },

  // INITIALISATION DE L'APPLICATION
  // Récupération des données
  loadPokedex: async function () {
    app.pokedex = await app.getPokedex();
    app.pokemonsTypes = await app.getPokemonsTypes();
    // Affichage du pokedex avec les cartes des Pokemons
    app.displayPokemon(app.pokedex);
    // Création des boutons de filtre de type de Pokemon
    app.createTypeFilterButtons(app.pokemonsTypes);
  },

  // Initialisation des gestionnaires d'événements
  initHandlers: function () {
    app.handleTypeSearchBar();
    app.handleClickResetBtn();
  },
  // Initialisation de l'application
  init: function () {
    // Chargement du pokedex sur la page d'accueil
    app.loadPokedex();
    // Initialisation des gestionnaires d'événements
    app.initHandlers();
  },
};

// LANCEMENT DE L'APPLICATION
app.init();
