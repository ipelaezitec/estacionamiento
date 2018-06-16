// EJEMPLO  EVAL const modelsByBrand = eval(`models${brands[f]}`);
// DUDA //** la lista de elementos tiene que ser solo de los vehiculos que estan en el momento?  eso implicaria quitar el vehiculo de la lista, el registro en cambio seria siempre igual*/
// DUDA  buscar 'xjfw2' : puedo llamar una función sin recibir lo que retorna?

// TODO : mascara de patentes;
  
const dashboard = document.querySelector(".dashboard");
const checkin = document.querySelector(".checkin");
const checkout = document.querySelector(".checkout");

let motoPrice = 80;
let autoPrice = 100;
let camionetaPrice = 120;

let motoLimit = 6;
let autoLimit = 10;
let camionetaLimit = 4;

let alertLimit = 2;


let vehiclesArray=localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) :{"vehicles":[],"register-in":[],"register-out":[]};

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


/** Incrementa el contador y decide si hay espacio para otro vehiculo más  */
let renderCount = (elementNum) =>{
  
  let number =  document.querySelector(`.num-${elementNum.type}`);
  let radio =  document.querySelector(`.radio-${elementNum.type}`);
  let numberParsed = parseInt(number.innerHTML)+1;
  let limite = eval(`${elementNum.type}Limit`);

  let pushItemFlag = false; 

  
  if (numberParsed <= limite ) {
    number.innerHTML = numberParsed;
    pushItemFlag = true;
    
    let remainingSpace = Math.abs(numberParsed - limite);
    if ( remainingSpace <= alertLimit) {
      number.classList.add("color-alert");
    }else{
      number.classList.remove("color-alert");
    }
  }

  /** Cambia el color está en el limite */
  if (numberParsed +1 > limite) {
    // number.classList.remove("color-alert"); // cuando libere espacios capaz que haga falta
    number.classList.add("color-limit");
    radio.classList.add("hidden");
  }else{
    radio.classList.remove("hidden"); // esto o :  radio.disabled = false; deberia probar radio.checked = false (ni idea si funciona)
  }
  
  
  return pushItemFlag;
}


//** input del Check-in */
let saveVehicle = (event) =>{
  event.preventDefault();
  // Tuve que modularizar en dos , because preventDefault
  

  // Formato del {json} */
  let plateInput = document.getElementById("patente");
  // TODO : BAJA PRIORIDAD -> consultar que la patente no este en la base de datos
  let radioInput = document.querySelector('input[name=tipo]:checked').value
  let timeIn = moment().format("H:mm");
  dataFormat= {"patente":plateInput.value ,"type":radioInput, "timeIn": timeIn};
  
  // modifica los contadores y decide si sumar,crear y agregar los datos. */
  let pushItemflag = renderCount(dataFormat);
  if (pushItemflag) {
    makeItem(dataFormat);
    vehiclesArray.vehicles.push(dataFormat);
    saveJson();
  }

  plateInput.value="";
  plateInput.focus();
}

//** crea el elento <li> que será dinamicamente agregado a <ul> */
const makeItem = (element) =>{

  // Ordenados por jerarquia */
  const listUl   = document.getElementById(`ul-${element.type}`);
  const flex      = document.createElement('div');
  const vehicleLi= document.createElement('li');
  const plateP  = document.createElement('p');
  const hourP     = document.createElement('p');

  vehicleLi.className = "li-reg";
  flex.className = "flex-reg";

  plateP.appendChild(document.createTextNode(element.patente));
  hourP.appendChild(document.createTextNode(element.timeIn));  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return
}

// const registerVehicle = (event) =>{
//   event.preventDefault();

//   let plateInput = document.getElementById("patente-reg").value;
//   vehiclesArray.vehicles.forEach(plateItem => {
//     if (plateItem.patente == plateInput) {
//       // can add let tipo= plateItem.type ;  // can add monto total
//       let timeOut = moment().format("H:mm");
//       dataFormat= {"patente":plateInput, "timeOut": timeOut};
      
//     }

//     break;
//   });

// }

let initializeJsonData = () =>{
  vehiclesArray.vehicles.forEach(itemJson => {
    renderCount(itemJson); // xjfw2
    makeItem(itemJson);
  });
}

initializeJsonData();