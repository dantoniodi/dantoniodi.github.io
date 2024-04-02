var chosenGen = 1;
var chosenType = 0;
var chosenForm = 'default';
const pokeContainer = document.querySelector('.pokedex');
const totalPkm = document.querySelector('.total');
const optGen = document.querySelector('#optGen');
const optType = document.querySelector('#optType');
const optForm = document.querySelectorAll('input[name="form"]');

optGen.addEventListener('change', (event) => {
    if(event.target.value != chosenGen) {
        while (pokeContainer.firstChild) pokeContainer.removeChild(pokeContainer.firstChild)
        chosenGen = event.target.value
        getByGen(chosenGen)
    }
})
optType.addEventListener('change', (event) => {
    if(event.target.value != chosenType) {
        while (pokeContainer.firstChild) pokeContainer.removeChild(pokeContainer.firstChild)
        chosenType = event.target.value
        getByType(chosenType)
    }
})
optForm.forEach((elem) => {
    elem.addEventListener("click", function(event){
        chosenForm = event.target.value;
    });
})

const pokeColors = {
    fire: 'firebrick',
    grass: 'springgreen',
    electric: 'gold',
    water: 'royalblue',
    ground: 'sandybrown',
    rock: 'saddlebrown',
    fairy: 'pink',
    ghost: 'slateblue',
    poison: 'purple',
    bug: 'olive',
    dragon: 'teal',
    psychic: 'plum',
    flying: 'skyblue',
    fighting: 'salmon',
    normal: 'wheat',
    ice: 'aqua',
    steel: 'silver',
    dark: 'dimgrey'
}
const mainTypes = Object.keys(pokeColors);

const getByGen = async(id = 1) => {
    let url = 'https://pokeapi.co/api/v2/generation/'+id
    let resp = await fetch(url)
    let data = await resp.json()
    generatePokes(data.pokemon_species.length)
}

const getByType = async(id) => {
    let url = 'https://pokeapi.co/api/v2/type/'+id
    let resp = await fetch(url)
    let data = await resp.json()
    fetchPokemons(data.pokemon)
}

const getUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokes = (c) => Array(151).fill().map((_, index) => 
    fetch(getUrl(index + 1)).then(resp => resp.json())
)

const generateHTML = pokemons => pokemons.reduce((el, {id,name,types,sprites}) => {
    let mainTypes = types.map(typeInfo => typeInfo.type.name)
    let number = id.toString().padStart(5,'0')
    let img = sprites.versions['generation-v']['black-white'].animated['front_'+chosenForm] || sprites['front_'+chosenForm]
    let color = pokeColors[mainTypes[0]]
    if(mainTypes.length > 1) {
        color = 'linear-gradient('+pokeColors[mainTypes[0]]+' 20%, '+pokeColors[mainTypes[1]]+' 100%)'
    }

    el += 
    `<li class="card" style="background:${color}">
        <div class="image">
            <span class="middle"></span>
            <img src="${img}" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${number}</span>
            <h3 class="name">${name}</h3>
            <small class="type">${mainTypes.join(' - ')}</small>
        </div>
    </li>`
    return el
}, '')

const insertPokes = pokemons => {
    document.querySelector('.pokedex').innerHTML = pokemons
}

const pokeRequest = generatePokes()

Promise.all(pokeRequest).then(generateHTML).then(insertPokes)