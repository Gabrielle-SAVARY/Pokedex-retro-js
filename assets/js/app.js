const pokedexUrl = './data/pokedex.json';
let pokedex = [];
let currentPage = 1;
const pokedexEnd = 151;
const pokemonPerPage = 20;

// Chargement du fichier JSON du pokedex
async function getPokedex() {
	try {
		const response = await fetch(pokedexUrl);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Erreur lors du chargement des données:', error);
	}
}

// Fonction pour afficher les Pokémons dans le DOM
function displayPokemon(pokemonList,pokemonStart, pokemonMax) {
	console.log('pokemonList', pokemonList);
	// Récupérez le conteneur principal où vous voulez afficher les cartes Pokémon
	const pokemonsList = document.getElementById('pokemon-list');

	// Boucle à travers les 20 premiers Pokémon 
	for (let i = pokemonStart; i < pokemonMax; i++) {
		// Obtenez le Pokémon actuel depuis l'objet pokedex.
		const pokemon = pokedex[i]; 

		// Créez une div pour la carte Pokémon
		const pokemonCard = document.createElement('div');
		pokemonCard.classList.add('pokemon-card'); 

		// Créez une div pour les informations du Pokémon
		const pokemonInfos = document.createElement('div');
		pokemonInfos.classList.add('pokemon-infos'); 
		// Créez un élément pour afficher l'identification du Pokémon
		const pokemonIdentification = document.createElement('h2');
		pokemonIdentification.textContent =  `# ${pokemon.index} ${pokemon.name}`;
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

// Fonction asynchrone pour afficher les 20 premiers Pokémon au chargerment de la page
async function loadPokedex() {
	pokedex = await getPokedex();
	console.log('pokedex', pokedex);
	displayPokemon(pokedex,0, pokemonPerPage);
}
// Fonction pour charger plus de Pokémon
function loadMorePokemon() {
	let filteredPokemon = [...pokedex];
	const startIndex = (currentPage) * pokemonPerPage;
	const endIndex = startIndex + pokemonPerPage;
	currentPage++;
	console.log('startIndex',startIndex);
	console.log('endIndex',endIndex);
	let pokemonMax = currentPage * 20;
	if (pokemonMax >= pokedexEnd) {
		const nextPokemon = filteredPokemon.slice(startIndex, pokedexEnd);
		displayPokemon(nextPokemon, startIndex, pokedexEnd);
		const loadMoreButton = document.getElementById("load-more-button");
		loadMoreButton.style.display = "none";
	} else {
		const nextPokemon = filteredPokemon.slice(startIndex, endIndex);
		displayPokemon(nextPokemon, startIndex, pokemonMax);
	}
}

loadPokedex();

// Gérez le clic sur le bouton "Charger plus"
const loadMoreButton = document.getElementById("load-more-button");
loadMoreButton.addEventListener("click", loadMorePokemon);


