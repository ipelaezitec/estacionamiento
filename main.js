
const dashboard = document.querySelector(".dashboard");
const checkin = document.querySelector(".checkin");
const checkout = document.querySelector(".checkout");

const tarifaMoto = 80;
const tarifaAuto = 100;
const tarifaCamioneta = 120;

const limitMoto = 6;
const limitAuto = 10;
const limitCamioneta = 4;

/** parametrizar */
let openDashboard = (event) =>{
  event.preventDefault();
  
  checkin.classList.add('hidden');
  checkout.classList.add('hidden');
  dashboard.classList.remove('hidden');

}

let openCheckin = (event) =>{
  event.preventDefault();

  checkin.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

let openCheckout = (event) =>{
  event.preventDefault();

  checkout.classList.remove('hidden');
  dashboard.classList.add('hidden');
}


const saveJson = () => {
  localStorage.setItem('vehicles', JSON.stringify(vehiclesArray)); 
}



//** input del Check-in , trae los datos del html al js */
const addVehicle = (event) =>{
  event.preventDefault();
  let input = document.getElementById("patente");
  let radioInput = document.querySelector('input[name=tipo]:checked').value

  
  console.log(radioInput);
  console.log(input.value);
}

let vehiclesArray = localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) : [];
