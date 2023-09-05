const app = {
	pokedex: [],
	pokemonsTypes: [],
	pokedexEnd: 151,

	init: function () {
		// Chargement du pokedex sur la page d'accueil
		app.loadPokedex();
		// Initialisation des gestionnaires d'événements
		app.initHandlers();

	},

	getPokedex: async function () {
		// Chargement du fichier JSON du pokedex
		try {
			const response = await fetch('./data/pokedex.json');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
		}
	},

	getPokemonsTypes: async function () {
		// Chargement du fichier JSON du pokedex
		try {
			const response = await fetch('./data/pokemonsTypes.json');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
		}
	},

	displayPokemon: function (pokemonList) {
		// Affiche les Pokémons dans le DOM

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
			pokemonIdentification.textContent = `# ${pokemon.index} ${pokemon.name}`;
			pokemonIdentification.classList.add('pokemon-identification');
			// Créez un élément pour afficher le type du Pokémon
			const pokemonType = document.createElement('h3');
			pokemonType.textContent = pokemon.type;
			pokemonType.classList.add('pokemon-type');
			// Ajoute le nom et le type du Pokémon à la carte Pokémon
			pokemonInfos.appendChild(pokemonIdentification);
			pokemonInfos.appendChild(pokemonType);
			// Créez un élément image pour afficher l'image du Pokémon
			const pokemonImage = document.createElement('img');
			pokemonImage.src = pokemon.image;
			pokemonImage.alt = pokemon.name;
			pokemonImage.classList.add('pokemon-img');
			// Ajoute les informations à la carte Pokémon
			pokemonCard.appendChild(pokemonImage);
			pokemonCard.appendChild(pokemonInfos);
			// Ajoute la carte Pokémon au conteneur principal
			pokemonsList.appendChild(pokemonCard);
		}
	},

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

	createTypeFilterButtons: function (types) {
		// Créer les boutons de filtre de type de Pokémon
		const filtersContainer = document.querySelector('.types-list__filters-container');

		// Crée un bouton pour chaque type de Pokémon
		types.forEach(type => {
			const button = document.createElement('button');
			button.textContent = type.typeName;
			// Ajoute une classe et un style au bouton 
			button.classList.add('type-filter-button');
			button.style.backgroundColor = type.typeColor;
			// Ajoute un écouteur d'événement pour le clic sur le bouton
			button.addEventListener('click', function () {
				// Supprimez la classe active de tous les boutons
				document.querySelectorAll('.type-filter-button').forEach(btn => {
					btn.classList.remove('active');
				});
				// Ajoute la classe active au bouton actuellement sélectionné
				button.classList.add('active');
				app.filterPokemonByType(type.typeName);
			});
			// Ajoute le bouton au conteneur des boutons de filtre
			filtersContainer.appendChild(button);
		});
	},

	handleSearch: function () {
		// Barre de recherche - effectue la recherche et affiche les cartes Pokémon correspondantes	
		// Barre de recherche
		const searchInput = document.getElementById('search-input');
		// Texte recherché par l'utilisateur
		const searchTerm = searchInput.value.toLowerCase();
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
	},

	showAllPokemon: function () {
		// Affiche tous les Pokémon
		const pokemonCards = document.querySelectorAll('.pokemon-card');
		pokemonCards.forEach(pokemonCard => {
			pokemonCard.style.display = 'flex';
		});
	},

	resetFilter: function () {
		// Supprime la classe active de tous les boutons
		document.querySelectorAll('.type-filter-button').forEach(btn => {
			btn.classList.remove('active');
		});
		// Affiche tous les Pokémon
		app.showAllPokemon();
	},

	resetSearchBar: function () {
		// Barre de recherche
		const searchInput = document.getElementById('search-input');
		// Réinitialise la barre de recherche
		searchInput.value = '';
		// Affiche tous les Pokémon
		app.showAllPokemon();
	},

	loadPokedex: async function () {
		// Récupération des données
		app.pokedex = await app.getPokedex();
		app.pokemonsTypes = await app.getPokemonsTypes();
		// Affichage du pokedex avec les cartes des Pokemons
		app.displayPokemon(app.pokedex);
		// Création des boutons de filtre de type de Pokemon
		app.createTypeFilterButtons(app.pokemonsTypes);
	},

	initHandlers: function () {
		app.handleSearchBar();
		app.handleClickResetFilterBtn();
		app.handleClickResetSearchBtn();
	},

	handleSearchBar: function () {
		// Barre de recherche
		const searchInput = document.getElementById('search-input');
		// Ecouteur d'évenement sur l'input de la barre de recherche
		searchInput.addEventListener('input', app.handleSearch);
	},

	handleClickResetFilterBtn: function () {
		// Sélection du bouton de réinitialisation des filtres de type
		const resetFilterButton = document.getElementById('reset-filter-button');

		// Ajoutez un gestionnaire d'événement pour le clic sur le bouton de réinitialisation
		resetFilterButton.addEventListener('click', function () {
			// Appelez une fonction pour réinitialiser le filtre
			app.resetFilter();
		});
	},

	handleClickResetSearchBtn: function () {
		// Sélection du bouton de réinitialisation des filtres de type
		const resetSearchButton = document.getElementById('reset-search-button');

		// Ajoutez un gestionnaire d'événement pour le clic sur le bouton de réinitialisation
		resetSearchButton.addEventListener('click', function () {
			// Appelez une fonction pour réinitialiser le filtre
			app.resetSearchBar();
		});
	},

};

// Lancement de l'application
app.init();








