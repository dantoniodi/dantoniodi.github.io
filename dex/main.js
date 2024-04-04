//global selectors
const pokeContainer = document.querySelector('.container');
const optGen = document.querySelector('#optGen');
const optType = document.querySelector('#optType');
const optForm = document.querySelector('#optForm');
const optView = document.querySelector('#optView');
const orderBy = document.querySelector('#orderBy');
const totalPkm = document.querySelector('.total');

//global variables
var chosenGen = 1;
var chosenType = 0;
var chosenView = optView.checked ? 'animated' : 'static';
var chosenForm = optForm.checked ? 'shiny' : 'default';

//listeners
optGen.addEventListener('change', (event) => {
    if(event.target.value != chosenGen) {
        chosenGen = event.target.value
        pokeContainer.replaceChildren()
        chosenType = optType.selectedIndex = 0
        getByGen(chosenGen)
    }
});
optType.addEventListener('change', (event) => {
    if(event.target.value != chosenType) {
        chosenType = event.target.value
        pokeContainer.replaceChildren()
        chosenGen = optGen.selectedIndex = 0
        getByType(chosenType)
    }
});
optForm.addEventListener("change", function(event) {
    pokeContainer.replaceChildren()
    chosenForm = event.target.checked ? event.target.value : 'default'
    chosenType != 0 ? getByType(chosenType) : getByGen(chosenGen)
});
optView.addEventListener("change", function(event) {
    pokeContainer.replaceChildren()
    chosenView = event.target.checked ? event.target.value : 'png'
    chosenType != 0 ? getByType(chosenType) : getByGen(chosenGen)
});
orderBy.addEventListener("change", function(event) {
    pokeContainer.replaceChildren()
    chosenType != 0 ? getByType(chosenType) : getByGen(chosenGen)
});

//unused just for info
const pokeGen = {
    1: [1,151],
    2: [152,251],
    3: [252,386],
    4: [387,493],
    5: [494,649],
    6: [650,721],
    7: [722,809],
    8: [810,905],
    9: [906,1010]
}

const pokeColors = {
    fire: 'firebrick',
    grass: 'springgreen',
    electric: 'gold',
    water: 'royalblue',
    ground: 'sandybrown',
    rock: 'saddlebrown',
    fairy: 'pink',
    ghost: 'slateblue',
    poison: 'darkorchid',
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

const getByGen = async(id) => {
    let url = 'https://pokeapi.co/api/v2/generation/'+id
    let resp = await fetch(url)
    let data = await resp.json()
    fetchPokemons(data.pokemon_species)
}

const getByType = async(id) => {
    let url = 'https://pokeapi.co/api/v2/type/'+id
    let resp = await fetch(url)
    let data = await resp.json()
    fetchPokemons(data.pokemon.map(pkm => pkm.pokemon))
}

const fetchPokemons = (list) => {
    if (Array.isArray(list)) {
        if(orderBy.value == 'name') {
            list.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        }
        list.forEach(pkm => {
            let pid = pkm.url.includes('pokemon-species') ? pkm.url.split('/')[6] : pkm.name;
            fetch(getUrl(pid))
            .then(totalPkm.innerHTML = "Loading...")
            .then(resp => resp.json())
            .then(json => createCard(json))      
        });
        totalPkm.innerHTML = "Total: "+list.length;
    } else {
        totalPkm.innerHTML = "Total: 0";
    }
}

const getUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const createCard = (poke) => {
    const card = document.createElement('div')
    card.classList.add('flip-card')

    let img = chosenView == 'animated' ? poke.sprites.versions['generation-v']['black-white'].animated['front_'+chosenForm] || poke.sprites.other.showdown['front_'+chosenForm] || poke.sprites.other.home['front_'+chosenForm] : poke.sprites['front_'+chosenForm] || poke.sprites.other.home['front_'+chosenForm]
    let name = poke.species['name']
    let number = poke.id.toString().padStart(4,'0')
    let pokeTypes = poke.types.map(typeInfo => typeInfo.type.name)
    let abilities = poke.abilities.map(pokeAbs => pokeAbs.ability.name)
    let stats = poke.stats.map(pokeStats => pokeStats.base_stat)
    let total = stats.reduce((a, b) => a + b, 0)
    let color = pokeColors[pokeTypes[0]]
    var txtAbs = '';

    card.style.order = orderBy.value == 'number' ? poke.id : orderBy.value == 'power' ? -total : null
    
    if(pokeTypes.length > 1) {
        let secondColor = pokeColors[pokeTypes[1]]
        card.style.background = 'linear-gradient('+color+' 20%, '+secondColor+' 100%)'
    } else {
        card.style.background = 'linear-gradient('+color+' 80%, white 150%'
    }
    
    for(let i=0; i<abilities.length; i++){
        txtAbs += '<span class="number">'+abilities[i]+'</span><br>';
    }
    
    card.innerHTML = `
    <div class="inner-card">
        <div class="front-card">
            <small class="number" style="float:left">#${number}</small>
            <small style="float:right">✨ <b>${total}</b></small>
            <div class="image">
                <span class="middle"></span>
                <img src="${img}" alt="img-not-found">
            </div>
            <div class="info">
                <h3 class="name">${name}</h3>
                <small class="type">${pokeTypes.join(' • ')}</small>
            </div>
        </div>
        <div class="back-card">
            <h3>Abilities:</h3>${txtAbs}
            <h3>Base Stats:</h3>
            <ul>
                <li><small>HP </small>${stats[0]} 💗</li>
                <li><small>Attack </small>${stats[1]} 🔱</li>
                <li><small>Defense </small>${stats[2]} 💠</li>
                <li>⚡ ${stats[5]}<small> Speed</small></li>
                <li>🔮 ${stats[3]}<small> Sp. Atk</small></li>
                <li>🌀 ${stats[4]}<small> Sp. Def</small></li>
            </ul>
        </div>
    </div>`
    
    if(poke.is_default) pokeContainer.append(card)
}

getByGen(chosenGen)