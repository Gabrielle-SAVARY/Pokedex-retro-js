let pokedex = [];
let pokemonsTypes = [];
const pokedexEnd = 151;



// Chargement du fichier JSON du pokedex
async function getPokedex() {
	try {
		const response = await fetch('./data/pokedex.json');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Erreur lors du chargement des données:', error);
	}
}
// Chargement du fichier JSON du pokedex
async function getPokemonsTypes() {
	try {
		const response = await fetch('./data/pokemonsTypes.json');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Erreur lors du chargement des données:', error);
	}
}

// Affiche les Pokémons dans le DOM
function displayPokemon(pokemonList) {
	console.log('pokemonList', pokemonList);
	// Récupérez le conteneur principal où vous voulez afficher les cartes Pokémon
	const pokemonsList = document.getElementById('pokemons-list');

	// Boucle sur les pokemons du pokedex
	for (let i = 0; i < pokedexEnd; i++) {
		// Pokémon actuel 
		const pokemon = pokedex[i];

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
}


function filterPokemonByType(type) {
	// Sélectionne tous les éléments Pokémon
	const pokemonCards = document.querySelectorAll('.pokemon-card');

	// Parcoure tous les éléments Pokémon pour les afficher ou les masquer en fonction du type
	pokemonCards.forEach(pokemonCard => {
		// Récupère le type du Pokémon 
		const pokemonType = pokemonCard.querySelector('.pokemon-type').textContent;
		// Vérifie si le type du Pokémon est inclus dans le type sélectionné
		if (pokemonType.includes(type)) {
			// Si le type correspond, affiche le Pokémon
			pokemonCard.style.display = 'flex';
		} else {
			// Sinon, masquez le Pokémon 
			pokemonCard.style.display = 'none';
		}
	});
}


// Créer les boutons de filtre de type de Pokémon
function createTypeFilterButtons(types) {
	const filtersContainer = document.querySelector('.types-list__filters-container');

	types.forEach(type => {
		const button = document.createElement('button');
		button.textContent = type.typeName;
		button.classList.add('type-filter-button');
		// Ajoute un style de couleur au bouton 
		button.style.backgroundColor = type.typeColor;
		// Ajoute un écouteur d'événement pour le clic sur le bouton
		button.addEventListener('click', function () {
			// Supprimez la classe active de tous les boutons
			document.querySelectorAll('.type-filter-button').forEach(btn => {
				btn.classList.remove('active');
			});

			// Ajoutez la classe active au bouton actuellement sélectionné
			button.classList.add('active');
			filterPokemonByType(type.typeName);
		});
		// Ajoute le bouton au conteneur des boutons de filtre
		filtersContainer.appendChild(button);
	});
}

// Affiche les données au chargerment de la page
async function loadPokedex() {
	pokedex = await getPokedex();
	pokemonsTypes = await getPokemonsTypes();
	console.log('pokedex', pokedex);
	console.log('pokemonsTypes', pokemonsTypes);
	displayPokemon(pokedex);
	createTypeFilterButtons(pokemonsTypes);
}

// Barre de recherche - effectue la recherche et affiche les cartes Pokémon correspondantes
function handleSearch() {
	// Recherche de l'utilisateur
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
}

// Affiche tous les Pokémon
function showAllPokemon() {
	const pokemonCards = document.querySelectorAll('.pokemon-card');
	pokemonCards.forEach(pokemonCard => {
		pokemonCard.style.display = 'flex';
	});
}

function resetFilter() {
	// Affiche tous les Pokémon
	showAllPokemon();
	// Supprime la classe active de tous les boutons
	document.querySelectorAll('.type-filter-button').forEach(btn => {
		btn.classList.remove('active');
	});

}

function resetSearchBar() {
	// Réinitialise la barre de recherche
	searchInput.value = '';
	// Affiche tous les Pokémon
	showAllPokemon();
}

// Chargement du pokedex sur la page d'accueil
loadPokedex();

// Barre de recherche
const searchInput = document.getElementById('search-input');
// Ecouteur d'évenement sur l'input de la barre de recherche
searchInput.addEventListener('input', handleSearch);


// Sélection du bouton de réinitialisation des filtres de type
const resetFilterButton = document.getElementById('reset-filter-button');

// Ajoutez un gestionnaire d'événement pour le clic sur le bouton de réinitialisation
resetFilterButton.addEventListener('click', function () {
	// Appelez une fonction pour réinitialiser le filtre
	resetFilter();
});




// Sélection du bouton de réinitialisation des filtres de type
const resetSearchButton = document.getElementById('reset-search-button');

// Ajoutez un gestionnaire d'événement pour le clic sur le bouton de réinitialisation
resetSearchButton.addEventListener('click', function () {
	// Appelez une fonction pour réinitialiser le filtre
	resetSearchBar();
});






