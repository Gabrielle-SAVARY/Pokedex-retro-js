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
    const typeInfo = app.pokemonsTypes.find(
      (typePokemon) => typePokemon.typeName === type
    );
    return typeInfo ? typeInfo.typeColor : "";
  },

  // FONCTIONS DE SCROLL
  scrollToTopEffect: function () {
    const filtersContainer = document.getElementById("filters-container");
    window.scrollTo({
      top: filtersContainer.offsetTop - 20, // laisse un espace de 20px en haut
      left: 0,
      behavior: "smooth"
    });
  },

  // scroll to top au container des filtres
  scrollToTopFiltersContainer: function () {
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    // Gestion de l'affichage du bouton scroll to top
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = "inline-block";
    } else {
      scrollToTopBtn.style.display = "none";
    }

    // Ajout d'un écouteur d'événement sur le clic du bouton
    scrollToTopBtn.addEventListener("click", app.scrollToTopEffect);
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
      const pokemonIdentification = document.createElement("h3");
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
          typeSpan.classList.add("pokemon-type", `${type}`);

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
    // Vérifie si le type est actif
    const isTypeActive = app.activeTypes.includes(type);
    console.log(type, "isTypeActive", isTypeActive);

    if (!isTypeActive) {
      // Si le type n'est pas dans le tableau, l'ajoute
      app.activeTypes.push(type);
      console.log("FALSE", app.activeTypes);
    } else {
      // Sinon, supprime le type du tableau
      const typeIndex = app.activeTypes.indexOf(type);
      app.activeTypes.splice(typeIndex, 1);
      console.log("TRUE", app.activeTypes);
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
      button.classList.add("type-filter-button", "btn-retro");
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

    // Si aucun type n'est sélectionné, affiche tous les Pokémon
    if (types.length === 0) {
      app.showAllPokemon();
      return;
    }

    // Filtre des Pokémons (comportement "ET" / la carte doit avoir tous les types actifs)
    pokemonCards.forEach((pokemonCard) => {
      // Récupère le type du Pokémon
      const pokemonAllTypes = pokemonCard.querySelectorAll(".pokemon-type");

      // Vérifie si la carte Pokémon a tous les types actifs
      const hasAllActiveTypes = app.activeTypes.every((activeType) => {
        return Array.from(pokemonAllTypes).some((typeElement) => {
          const pokemonType = typeElement.textContent;
          return pokemonType.includes(activeType);
        });
      });

      if (hasAllActiveTypes) {
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
      pokemonCards.forEach((pokemonCard) => {
        // Récupère l'identification et le type du Pokémon en miniscule et sans accent
        const pokemonIdentity = pokemonCard
          .querySelector(".pokemon-identification")
          .textContent.toLowerCase();
        const normalizedPokemonIdentity = app.removeAccents(pokemonIdentity);

        const pokemonAllTypes = pokemonCard.querySelectorAll(".pokemon-type");
        const normalizedPokemonTypes = Array.from(pokemonAllTypes).map(
          (typeElement) => {
            // Récupère la 2ème classe avec le nom du type
            const typeNames = typeElement.classList[1].toLowerCase();
            return app.removeAccents(typeNames);
          }
        );

        let found = false;

        // Parcourt chaque terme de recherche et vérifie si les infos ou types du Pokémon correspondent à un terme
        searchTerms.forEach((term) => {
          if (
            normalizedPokemonIdentity.includes(term) ||
            normalizedPokemonTypes.some((type) => type.includes(term))
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

  // Scroll sur pokedex et animation du bouton de la hero page
  handleClickScrollShowPokedex: function () {
    const showPokedexBtn = document.getElementById("btn-scroll-to-pokedex");
    showPokedexBtn.classList.add("btn-scroll-to-pokedex-active");
    
    setTimeout(() => {
      app.scrollToTopEffect();
    showPokedexBtn.classList.remove("btn-scroll-to-pokedex-active");
  }, 800);
  
  setTimeout(() => {
    showPokedexBtn.classList.remove("btn-scroll-to-pokedex-active");
  }, 900);
},

  // Ecouteur d'événement sur le bouton "voir le pokedex" de la hero page
  handleClickListenerHeroBtn: function () {
    const showPokedexButton = document.getElementById("btn-scroll-to-pokedex");
    showPokedexButton.addEventListener("click", app.handleClickScrollShowPokedex);
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
    app.handleClickListenerHeroBtn();
  },
  // Initialisation de l'application
  init: function () {
    // Chargement du pokedex sur la page d'accueil
    app.loadPokedex();
    // Initialisation des gestionnaires d'événements
    app.initHandlers();
    // Initialisation de l'écouteur d'événement pour le bouton scroll-to-top
    window.onscroll = function () {
      app.scrollToTopFiltersContainer();
    };
  },
};

// LANCEMENT DE L'APPLICATION
app.init();
