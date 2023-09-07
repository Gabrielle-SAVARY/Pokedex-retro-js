const app = {
	pokedex: [],
	pokemonsTypes: [],
	pokedexEnd: 151,

	// FONCTIONS DE RECUPERATION DE DONNÉES
	// Chargement du fichier JSON du pokedex
	getPokedex: async function () {
		try {
			const response = await fetch('./data/pokedex.json');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
			return [];
		}
	},

	// Chargement du fichier JSON des types de Pokémons
	getPokemonsTypes: async function () {
		try {
			const response = await fetch('./data/pokemonsTypes.json');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
			return [];
		}
	},

	// FONCTIONS DE CREATION D'ELEMENTS DANS LE DOM
	// Créer et affiche les cartes Pokémons dans le DOM
	displayPokemon: function (pokemonList) {
		// Récupère le conteneur où sont affichés les cartes Pokémon
		const pokemonsList = document.getElementById('pokemons-list');

		// Boucle sur les pokemons du pokedex
		for (let i = 0; i < app.pokedexEnd; i++) {
			// Pokémon actuel 
			const pokemon = app.pokedex[i];
			// Créez une div pour la carte Pokémon
			const pokemonCard = document.createElement('article');
			pokemonCard.classList.add('pokemon-card');
			// Créez une div pour les informations du Pokémon
			const pokemonInfos = document.createElement('div');
			pokemonInfos.classList.add('pokemon-infos');

			// Créez un élément pour afficher l'identification du Pokémon
			const pokemonIdentification = document.createElement('h2');
			pokemonIdentification.textContent = `#${pokemon.index} ${pokemon.name}`;
			pokemonIdentification.classList.add('pokemon-identification');
			// Créez un élément pour afficher le type du Pokémon
			const pokemonType = document.createElement('h3');
			pokemonType.textContent = pokemon.type;
			pokemonType.classList.add('pokemon-type');
			// Créez un élément image pour afficher l'image du Pokémon
			const pokemonImage = document.createElement('img');
			pokemonImage.src = pokemon.image;
			pokemonImage.alt = pokemon.name;
			pokemonImage.classList.add('pokemon-img');

			// Ajoute le nom et le type du Pokémon à la carte Pokémon
			pokemonInfos.appendChild(pokemonIdentification);
			pokemonInfos.appendChild(pokemonType);
			// Ajoute les informations à la carte Pokémon
			pokemonCard.appendChild(pokemonImage);
			pokemonCard.appendChild(pokemonInfos);
			// Ajoute la carte Pokémon au conteneur principal
			pokemonsList.appendChild(pokemonCard);
		}
	},

	// Créer les boutons de filtre de type de Pokémon
	createTypeFilterButtons: function (types) {
		const filtersContainer = document.querySelector('.types-list__filters-container');
		// Crée un bouton pour chaque type de Pokémon
		types.forEach(type => {
			// Création du bouton 
			const button = document.createElement('button');
			button.textContent = type.typeName;
			button.classList.add('type-filter-button');
			button.style.backgroundColor = type.typeColor;

			// Ajoute un écouteur d'événement pour le clic sur le bouton
			button.addEventListener('click', function () {
				// Reset les filtres et la recherche
				app.clearSearchBar();
				app.clearActiveTypeFilter();
				// Ajoute la classe active au bouton de filtre sélectionné
				button.classList.add('active');
				// Filtre les Pokémon en fonction du type sélectionné
				app.filterPokemonByType(type.typeName);
			});

			// Ajoute le bouton au conteneur des boutons de filtre
			filtersContainer.appendChild(button);
		});
	},

	// FONCTIONS DE FILTRAGE DES DONNÉES
	// Filtre les Pokémon en fonction du type sélectionné
	filterPokemonByType: function (type) {
		// Sélectionne tous les éléments Pokémon
		const pokemonCards = document.querySelectorAll('.pokemon-card');

		// Filtre les Pokémon en fonction du type sélectionné
		pokemonCards.forEach(pokemonCard => {
			// Récupère le type du Pokémon 
			const pokemonType = pokemonCard.querySelector('.pokemon-type').textContent;
			// Vérifie si le type du Pokémon est inclus dans le type sélectionné
			if (pokemonType.includes(type)) {
				// Si le type correspond, affiche le Pokémon
				pokemonCard.style.display = 'flex';
			} else {
				// Sinon, masque le Pokémon 
				pokemonCard.style.display = 'none';
			}
		});
	},

	// Filtre les Pokemons selon du texte saisi dans la barre de recherche 
	handleSearch: function () {
		const searchInput = document.getElementById('search-input');
		// Texte recherché par l'utilisateur
		const searchTerm = searchInput.value.toLowerCase();
		// Vérifie si le texte recherché est valide (lettres, chiffres et espaces)
		const validSearchTerm = searchTerm.match(/^[a-zA-Z0-9\s]*$/);
		// Si le texte recherché est valide
		if (validSearchTerm) {
			const searchTerms = searchTerm.split(' ')
			// Sélection de tous les Pokémon
			const pokemonCards = document.querySelectorAll('.pokemon-card');			
			// Recherche
			pokemonCards.forEach(pokemonCard => {
				const pokemonIdentity = pokemonCard.querySelector('.pokemon-identification').textContent.toLowerCase();
				const pokemonType = pokemonCard.querySelector('.pokemon-type').textContent.toLowerCase();
				if (pokemonIdentity.includes(searchTerm) || pokemonType.includes(searchTerm)) {
					pokemonCard.style.display = 'flex';
				} else {
					pokemonCard.style.display = 'none';
				}
			});			
		}
		// Supprime la classe active de tous les boutons filtres de type
		app.clearActiveTypeFilter();
	},

	// AUTRES FONCTIONS POUR LA RENITIALISATION DES DONNÉES
	// Affiche tous les Pokémon
	showAllPokemon: function () {
		const pokemonCards = document.querySelectorAll('.pokemon-card');
		pokemonCards.forEach(pokemonCard => {
			pokemonCard.style.display = 'flex';
		});
	},

	// Vide la barre de recherche
	clearSearchBar: function () {
		const searchInput = document.getElementById('search-input');
		searchInput.value = '';
	},
	// Supprime le filtre de type actif
	clearActiveTypeFilter: function () {
		// Supprime la classe active de tous les boutons filtres de type
		document.querySelectorAll('.type-filter-button').forEach(btn => {
			btn.classList.remove('active');
		});
	},

	handleReset: function (buttonId) {
		// Réinitialise des recherches par la barre de recherche et les filtres de type
		const resetButton = document.getElementById(buttonId);
		resetButton.addEventListener('click', function () {
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
		const searchInput = document.getElementById('search-input');
		searchInput.addEventListener('input', app.handleSearch);
	},

	// Ecouteur d'événement sur les bouton de réinitialisation
	handleClickResetBtn: function () {
		app.handleReset('reset-filter-button');
		app.handleReset('reset-search-button');
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








