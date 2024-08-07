let plots = [];
let currentSeed = { name: 'Wheat', cost: 1, gain: 1.5, time: 10000 };
let money = 10000;
let plotCount = 5;
let timefert = 10;
let aharvplots = -1
let aharvtime = 10
let ownedseeds = ["Wheat"];
const seedDB = { 
    Wheat:     {name: 'Wheat',      cost: 1,  gain: 1.5,time: 10000, shopbuy: 0   },
    Carrot:    {name: 'Carrot',     cost: 2,  gain: 3,  time: 20000, shopbuy: 25  },
    Corn:      {name: 'Corn',       cost: 5,  gain: 9,  time: 30000, shopbuy: 50  },
    Tomato:    {name: 'Tomato',     cost: 10, gain: 17, time: 40000, shopbuy: 100 },
    Potato:    {name: 'Potato',     cost: 15, gain: 28, time: 50000, shopbuy: 200 },
    Lettuce:   {name: 'Lettuce',    cost: 20, gain: 35, time: 60000, shopbuy: 250 },
    Cucumber:  {name: 'Cucumber',   cost: 25, gain: 45, time: 70000, shopbuy: 300 },
    undefined: {name: 'undefined',  cost:null,gain: 1,  time: 1000,  shopbuy: null}// debug
};

function setseed(name) {
    if (ownedseeds.includes(name)) {
        currentSeed = seedDB[name];
        document.getElementById(name).innerText = name;
    } else if (money >= seedDB[name].shopbuy) {
        currentSeed = seedDB[name];
        document.getElementById(name).innerText = name;
        money -= seedDB[name].shopbuy;
        ownedseeds.push(name);
    }
    document.getElementById("CURRENTSEED").innerText = currentSeed.name;
    document.getElementById("SEEDINFO").innerText = `Cost: ${currentSeed.cost}, Gain: ${currentSeed.gain}, Time: ${currentSeed.time / 1000}s`;
}


function fertilizer(type){
    if(type === "time" && timefert > 1 && money > (1 / (timefert / 1000))){
        money -= (1 / (timefert / 1000));
        timefert -= 1;
        document.getElementById("fertime").innerText = `Decrease growth time by 10% for $${(1 / (timefert / 1000)).toFixed(2)}`;
        document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
    } else if (timefert === 1) {
        document.getElementById("fertime").innerText = `MAXED AT 90% REDUCTION`;
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
        plots.push({ element: plot, planted: false, harvestTime: 0, PlantedWith: "empty" , harvestAble: false });
        plotsContainer.appendChild(plot);
    }
}

function plantSeed(index) {
    if (money >= currentSeed.cost && !plots[index].planted) {
        money -= currentSeed.cost;
        document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
        plots[index].planted = true;
        plots[index].PlantedWith = currentSeed.name;
        plots[index].harvestTime = Date.now() + (currentSeed.time / 10) * timefert;
        plots[index].element.innerHTML = `<div>${currentSeed.name}</div>
                                          <img src="images/${currentSeed.name}.jpg" alt="${currentSeed.name}">
                                          <div class="progress-bar"><div class="progress"></div></div>`;
        updateProgress(index);
    }
}

function updateProgress(index) {
    const plot = plots[index];
    const now = Date.now();
    if (plot.planted) {
        const totalGrowthTime = (seedDB[plot.PlantedWith].time / 10) * timefert;
        const elapsedTime = now - (plot.harvestTime - totalGrowthTime);
        const progress = Math.min(elapsedTime / totalGrowthTime, 1);
        plot.element.querySelector('.progress').style.width = `${progress * 100}%`;

        if (now >= plot.harvestTime) {
            plot.element.onclick = () => harvest(index);
            if (!plot.element.querySelector('.harvest-message')) {
                const harvestMessage = document.createElement('div');
                plot.harvestAble = true;
                harvestMessage.className = 'harvest-message';
                harvestMessage.innerText = 'Click to Harvest';
                plot.element.appendChild(harvestMessage);
            }
        } else {
            requestAnimationFrame(() => updateProgress(index));
        }
    }
}

function buyplot() {
    if (money >= (plotCount - 1) ** 2) {
        money -= (plotCount - 1) ** 2;
        const plotsContainer = document.getElementById('plots');
        
        const plotIndex = plotCount;
        const plot = document.createElement('div');
        plot.classList.add('plot');
        plot.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                          <div class="progress-bar"><div class="progress"></div></div>`;
        plot.onclick = () => plantSeed(plotIndex);
        plots.push({ element: plot, planted: false, harvestTime: 0, PlantedWith: "empty", harvestAble: false});
        plotsContainer.appendChild(plot);
        
        plotCount += 1;

        document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
        document.getElementById("buyplotbtn").innerText = `Buy plot ${plotCount + 1} for ${(plotCount - 1) ** 2}`;
    }
}


function harvest(index) {
    if (plots[index].planted === true && plots[index].harvestAble === true) {
        money += seedDB[plots[index].PlantedWith].gain;
        document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
        plots[index].planted = false;
        plots[index].PlantedWith = "empty";
        plots[index].harvestAble = false;
        plots[index].element.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                                          <div class="progress-bar"><div class="progress"></div></div>`;
        plots[index].element.onclick = () => plantSeed(index);
    }
}

function AutoHarvest(){
    if (aharvplots === -1) {console.log("failed")}//if not auto harvest
    for (let i = -1; i < aharvplots; i++) {
        harvest(i+1);
    }
    setTimeout(() => {AutoHarvest()}, aharvtime*1000);
}

function saveGame() {
    const gameState = {
        money: money,
        currentSeed: currentSeed.name,
        ownedseeds: ownedseeds,
        plotCount: plotCount,
        timefert: timefert,
        AutoPlots: aharvplots,
        AutoTime: aharvtime,
        plots: plots.map(plot => ({
            planted: plot.planted,
            PlantedWith: plot.PlantedWith,
            harvestTime: plot.harvestTime,
            harvestAble: plot.harvestAble
        }))
    };
    localStorage.setItem('farmingGameState', JSON.stringify(gameState));
    console.log(gameState)
}
function loadGame() {
    const savedGame = localStorage.getItem('farmingGameState');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        
        money = gameState.money;
        currentSeed = seedDB[gameState.currentSeed] || currentSeed;
        ownedseeds = gameState.ownedseeds;
        plotCount = gameState.plotCount;
        timefert = gameState.timefert;
        aharvplots = gameState.AutoPlots;
        aharvtime = gameState.AutoTime;
        plots = [];
        const plotsContainer = document.getElementById('plots');
        plotsContainer.innerHTML = '';
        gameState.plots.forEach((plotData, index) => {
            const plot = document.createElement('div');
            plot.classList.add('plot');
            if (plotData.planted) {
                console.log(plotData.PlantedWith);
                plot.innerHTML = `<div>${plotData.PlantedWith}</div>
                                  <img src="images/${plotData.PlantedWith}.jpg" alt="${plotData.PlantedWith}">
                                  <div class="progress-bar"><div class="progress"></div></div>`;
                plot.onclick = () => harvest(index);
            } else {
                plot.innerHTML = `<img src="images/question-mark.jpg" alt="Empty">
                                  <div class="progress-bar"><div class="progress"></div></div>`;
                plot.onclick = () => plantSeed(index);
            }
            plotsContainer.appendChild(plot);
            plots.push({ element: plot, ...plotData });
            updateProgress(index);
        });
        document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
        document.getElementById("CURRENTSEED").innerText = currentSeed.name;
        document.getElementById("fertime").innerText = `Decrease growth time by 10% for $${(1 / (timefert / 1000)).toFixed(2)}`;
        document.getElementById("buyplotbtn").innerText = `Buy plot ${plotCount + 1} for ${(plotCount - 1) ** 2}`;
        
        alert('Game loaded successfully!');
    } else {
        alert('No saved game found.');
        initPlots();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadGame()
    document.getElementById("fertime").innerText = `Decrease growth time by 10% for $${(1 / (timefert / 1000)).toFixed(2)}`;
    document.getElementById("buyplotbtn").innerText = `Buy plot ${plotCount + 1} for ${(plotCount - 1) ** 2}`;
    document.getElementById("CASH").innerText = `Money: ${money.toFixed(1)}`;
    document.getElementById('autohartime').innertext = `Decrease Auto Harvest Time by 10 Percent: ${1000/aharvtime} Money`;
    document.getElementById('autohar').innerText = `Auto Harvest Plot ${aharvplots+2} for $${(aharvplots+2)*100}`;
    AutoHarvest()
});

setInterval(saveGame,60000);