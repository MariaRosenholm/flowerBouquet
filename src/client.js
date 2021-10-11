"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", init);
  let jsonData;
  let selectedOption;
  let colorValue;
  let id;
  let ul;
  let price;
  let totalPerFlower;
  let barPos = 60;
  let textPos = 51;
  let numberPos = 74;
  let total = 0;
  const namesAndIds = {};
  let flowersSelect = [];
  let amount = document.querySelector("#amount");
  let amountValue;
  const button = document.querySelector("#click");
  const flowerList = document.querySelector("#flowerList");
  const colorList = document.querySelector("#color");
  const list = document.querySelector("article");
  const p = document.querySelector("#totalPriceE");
  const drawingArea = document.querySelector("canvas");
  const context = drawingArea.getContext("2d");

  async function init() {
    const flowersData = await fetch("http://localhost:3007/", { mode: "cors" });
    jsonData = await flowersData.json();
    flowerNames(jsonData);

    context.translate(10, drawingArea.height * 0.9);

    context.scale(1.2, 1.2); // tällä tehty koko canvas sisältö isommaksi

    context.save();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(30, 1);
    context.lineTo(30, -drawingArea.height + 160); // y-axis
    context.moveTo(30, 1);
    context.lineTo(drawingArea.width - 150, 1); //x-axis
    context.stroke();
    // drawing the grid
    context.beginPath();
    context.strokeStyle = "maroon";
    for (let y = 25; y <= drawingArea.height - 160; y += 25) {
      context.moveTo(30, 1 - y);
      context.lineTo(drawingArea.width - 150, 1 - y); //x-axis
      context.stroke();
    }
    context.restore();
    context.save();
    context.scale(1.8, 1.8);
    context.rotate(-Math.PI / 2);
    context.fillText("The amount of flowers in the bouquet", 35, 5);
    context.restore();
  }

  const flowerNames = (flowerData) => {
    for (let flowerObject of flowerData) {
      namesAndIds[flowerObject.name] = flowerObject.flowerId;
    }
    flowersSelect = Object.keys(namesAndIds);
    selectOptions(flowersSelect);
  };

  const selectOptions = (names) => {
    let option;
    let listItem = "";

    for (let flower of names) {
      option = document.createElement("option");
      flowerList.appendChild(option);

      if (flower.includes("-")) {
        let split = flower.split("-");

        for (let i of split) {
          listItem = listItem + i + " ";
        }
        flower = listItem;
      }
      option.textContent =
        flower.substring(0, 1).toUpperCase() +
        flower.substring(1, flower.lenght);
    }
  };

  const prices = (id, jsonData) => {
    for (let iD of jsonData) {
      if (id === iD.flowerId) {
        return iD.unitPrice;
      }
    }
  };

  const createLi = (label, value) => {
    let li = document.createElement("li");
    li.textContent = label + value;
    ul.appendChild(li);
  };

  function drawBar(ctx, amount, selected, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(barPos, 0, 60, -amount * 25);
    ctx.restore();
    ctx.save();
    ctx.scale(1.2, 1.5);
    if (color === "Black" || color === "Blue" || color === "Purple") {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.fillText(amount, numberPos, -5);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillText(amount, numberPos, -5);
      ctx.restore();
    }
    ctx.fillText(selected, textPos, 20);
    ctx.restore();
    barPos += 100;
    textPos += 83;
    numberPos += 83;
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();

    colorValue = colorList.value;
    amountValue = amount.value;
    amountValue = +amountValue;

    if (isNaN(amountValue) || amountValue == "") {
      alert("Please give number to the field Amount");
    } else {
      selectedOption = flowerList.value.substring(0, 3).toLowerCase();

      let i = -1;
      for (let iD of Object.keys(namesAndIds)) {
        i++;
        if (selectedOption === Object.keys(namesAndIds)[i].substring(0, 3)) {
          id = Object.entries(namesAndIds)[i][1];
        }
      }

      price = prices(id, jsonData);
      totalPerFlower = price * amountValue;
      total = total + totalPerFlower;
      p.textContent = ` ${total} €`;

      ul = document.createElement("ul");
      list.appendChild(ul);

      if (flowerList.value.substring(0, 3) == "Lil") {
        createLi("Name: ", "Lily");
      } else {
        createLi("Name: ", flowerList.value);
      }
      createLi("Color: ", colorValue);
      createLi("Unit price: ", price);
      createLi("Amount: ", amountValue);
      createLi("Total: ", totalPerFlower);

      drawBar(context, amountValue, flowerList.value, colorValue);
    }
    amount.value = "";
    color.value = "";
  });
})();
