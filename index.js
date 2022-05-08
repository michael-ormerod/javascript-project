
console.log('You have connected...')

document.addEventListener("DOMContentLoaded", function() {

    const generatePokemonButton = document.getElementById(`generatePokemon`);
     
    function renderPokemon(event){
        event.preventDefault()
        let allPokemon = document.getElementById(`results`)
        allPokemon.innerHTML = "";
        fetchAllPokemon();
    }
    
    generatePokemonButton.addEventListener('click', renderPokemon)

    function fetchAllPokemon(){
        const gameVersionSelect = document.getElementById(`gameVersion`)
        const pokemonTypeSelect = document.getElementById(`type`)
        fetch('https://pokeapi.co/api/v2/pokemon?limit=649')
        .then(response => response.json())
        .then((allpokemon) => {
            allpokemon.results.forEach((pokemon) => {
                fetchPokemonData(pokemon, gameVersionSelect.value, pokemonTypeSelect.value);
            })
        })
    }

    function fetchPokemonData(pokemon, gameVersion, type){
        let url = pokemon.url
        fetch(url)
        .then(response => response.json())
        .then((pokeData) => {
            console.log(pokeData)
            if ((gameVersion === "all" || pokeData.game_indices.find((pokeVersion) => pokeVersion.version.name === gameVersion)) && 
                (type === "all" || pokeData.types.find((pokeType) => pokeType.type.name === type))){
                    generatePokemon(pokeData)
                    
            }
        })
    }

    function generatePokemon(pokeData){
        const pokemonContainer = document.getElementById('results');
        
        const pokemonList = document.createElement('h4')
        pokemonList.innerHTML = pokeData.name.toUpperCase()

        const pokemonId = document.createElement('p')
        pokemonId.innerHTML = `#${pokeData.id}`

        const pokemonTypes = document.createElement('ul')
        createPokemonTypes(pokeData.types, pokemonList)

        createPokemonImage(pokeData.id, pokemonContainer);

        pokemonContainer.append(pokemonList, pokemonId, pokemonTypes, createFavouriteButton(pokeData))

    }

    function createPokemonTypes(types, ul){
        types.forEach((type) => {
            let pokemonTyping = document.createElement('li');
            pokemonTyping.innerHTML = type['type']['name'];
            ul.append(pokemonTyping)
        })
    }

    function createPokemonImage(pokemonId, container){
        let pokemonImageContainer = document.createElement('div')
        pokemonImageContainer.classList.add('image')

        let pokemonImage = document.createElement('img')
        pokemonImage.srcset = `sprites/sprites/pokemon/other/official-artwork/${pokemonId}.png`

        pokemonImageContainer.append(pokemonImage);
        container.append(pokemonImageContainer);
    }

    function createFavouriteButton(pokeData2){
        let favouriteBtn = document.createElement("button")
        favouriteBtn.innerText = "I like this Pokemon!"
        favouriteBtn.addEventListener('click', (event) => {
            event.preventDefault()
            addFavouritePokemon(pokeData2)
        });
        return favouriteBtn
    }

    function addFavouritePokemon(favouritePokemon){
        return fetch('http://localhost:3000/favouritePokemon', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: favouritePokemon.id,
                name: favouritePokemon.name
            })
        })
    }
}) 