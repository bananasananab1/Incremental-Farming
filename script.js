let plots = [];
let currentSeed = { name: 'Wheat', cost: 1, gain: 1.5, time: 10000 };
let money = 10;
let plotCount = 5;
let timefert = 10;
let ownedseeds= ["Wheat"]
const seedDB = { 
    Wheat:     {name: 'Wheat',      cost: 1, gain: 1.5,   time: 10000, shopbuy: 0  },
    Carrot:    {name: 'Carrot',     cost: 2, gain: 3,     time: 20000, shopbuy: 25 },
    Corn:      {name: 'Corn',       cost: 5, gain: 9,     time: 30000, shopbuy: 50},
    Tomato:    {name: 'Tomato',     cost: 10, gain: 17,   time: 40000, shopbuy: 100},
    Potato:    {name: 'Potato',     cost: 15, gain: 28,   time: 50000, shopbuy: 200},
    Lettuce:   {name: 'Lettuce',    cost: 20, gain: 35,   time: 60000, shopbuy: 250},
    Cucumber:  {name: 'Cucumber',   cost: 25, gain: 45,   time: 70000, shopbuy: 300},
    
};

function setseed(name) {
    if (ownedseeds.includes(name)) {
        currentSeed = seedDB[name];
        document.getElementById("CURRENTSEED").innerText = name;
    } else if (money >= seedDB[name].shopbuy) {
        currentSeed = seedDB[name];
        money -= seedDB[name].shopbuy;
        ownedseeds.push(name);
        document.getElementById("CURRENTSEED").innerText = name;
        document.getElementById(name).innerText = name;
    }
}

function fertilizer(type){
    if(type=="time" && timefert < 1){
        timefert -= 1
    }
}
function initPlots() {
    const plotsContainer = document.getElementById('plots');
    for (let i = 0; i < plotCount; i++) {
        const plot = document.createElement('div');
        plot.classList.add('plot');
        plot.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                          <div class="progress-bar"><div class="progress"></div></div>`;
        plot.onclick = () => plantSeed(i);
        plots.push({ element: plot, planted: false, harvestTime: 0 , PlantedWith: "empty"});
        plotsContainer.appendChild(plot);
    }
}

function plantSeed(index) {
    if (money >= currentSeed.cost && !plots[index].planted) {
        money -= currentSeed.cost;
        console.log("planted"+index)
        document.getElementById("CASH").innerText = `Money: ${money}`
        plots[index].planted = true;
        plots[index].PlantedWith = currentSeed.name
        plots[index].harvestTime = Date.now() + (currentSeed.time/10)*timefert;
        plots[index].element.innerHTML = `<div>${currentSeed.name}</div>
                                          <img src="images/${currentSeed.name}.jpg" alt="${currentSeed.name}">
                                          <div class="progress-bar"><div class="progress"></div></div>`;
        updateProgress(index);
    } else {
        console.log("did not planted"+index)}
}

function updateProgress(index) {
    const plot = plots[index];
    const now = Date.now();
    if (plot.planted) {
        const progress = Math.min((now - (plot.harvestTime - seedDB[plots[index].PlantedWith].time)) / seedDB[plots[index].PlantedWith].time, 1);
        plot.element.querySelector('.progress').style.width = `${progress * 100}%`;
        if (now >= plot.harvestTime) {
            plot.element.onclick = () => harvest(index);
            plot.element.innerHTML += `<div>Click to Harvest</div>`;
        } else {
            requestAnimationFrame(() => updateProgress(index));
        }
    }
}

function buyplot() {
    document.getElementById("buyplotbtn").innerText = `buy plot: ${(plotCount-1)**2}`
    if(money>(plotCount-1)**2){
        money -= (plotCount-1)**2;
        plotCount +=1;
        plotsContainer = document.getElementById('plots');
        const plot = document.createElement('div');
        plot.classList.add('plot');
        plot.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                          <div class="progress-bar"><div class="progress"></div></div>`;
        plot.onclick = () => plantSeed(plotCount-1);
        plots.push({ element: plot, planted: false, harvestTime: 0, PlantedWith: "empty"});
        plotsContainer.appendChild(plot);
    }
}

function harvest(index) {
    if (plots[index].planted) {
        
        money+= seedDB[plots[index].PlantedWith].gain;
        document.getElementById("CASH").innerText = `Money: ${money}`
        plots[index].planted = false;
        plots[index].PlantedWith = "empty"
        plots[index].element.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                                          <div class="progress-bar"><div class="progress"></div></div>`;
        plots[index].element.onclick = () => plantSeed(index);
    }
}

function toggleShop() {
    const shopMenu = document.getElementById('shopMenu');
    shopMenu.style.display = shopMenu.style.display === 'none' ? 'block' : 'none';
}

function toggleseedmenu() {
    const seedmenu = document.getElementById('seedmenu');
    seedmenu.style.display = seedmenu.style.display === 'none' ? 'block' : 'none';
}

function buySeed() {
    // Example function for buying seeds
    alert('Seed bought!');
}

document.addEventListener('DOMContentLoaded', () => {
    initPlots();
});
