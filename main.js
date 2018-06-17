
// DUDA  buscar 'xjfw2' : puedo llamar una función sin recibir lo que retorna? (EJEMPLO : renderCount)
// DUDA variables const y let

// LOG: el required en las etiquetas radio no funcionó, solucionar la experiencia usuario

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

let vehiclesArray=localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) :{"vehicles":[],"registerOut":[]};

let openBoard = (event,boardItem) =>{
  event.preventDefault();
  checkin.classList.add('hidden'); 
  dashboard.classList.add('hidden');
  checkout.classList.add('hidden');  
  eval(`${boardItem}`).classList.remove('hidden');
}

const saveJson = () => {
  localStorage.setItem('vehicles', JSON.stringify(vehiclesArray)); 
}

//** Controla el número renderizado ( el contador y color ) */
let renderCount = (elementNum,counter=1,) =>{
  let number =  document.querySelector(`.num-${elementNum.type}`);
  let radio =  document.querySelector(`.radio-${elementNum.type}`);
  let numberParsed = parseInt(number.innerHTML)+counter;
  let limite = eval(`${elementNum.type}Limit`);

  let pushItemFlag = false; // addvehicle necesita este flag para saber si debe agregar value al Json 

  /** Cambia color si esta cerca del limite especificado. */
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
  /** Cambia el color si está en el limite */
  if (numberParsed + counter > limite) {
    number.classList.add("color-limit");
    radio.classList.add("hidden");
  }else{
    radio.classList.remove("hidden"); // esto o :  radio.disabled = false; deberia probar radio.checked = false (ni idea si funciona)
    number.classList.remove("color-limit");
  }
  return pushItemFlag;
}

//** Solo crea el <li> y lo agrega al <ul> */
const makeItem = (element, register=false) =>{
  // Ordenados por jerarquia */
  const listUl   =  register ? document.getElementById('ul-registro') : document.getElementById(`ul-${element.type}`);
  const flex      = document.createElement('div');
  const vehicleLi= document.createElement('li');
  const plateP  = document.createElement('p');
  const hourP     = document.createElement('p');

  vehicleLi.className = "li-reg";
  flex.className = register ?  "flex-reg" : `flex-reg ${element.patente}`; 

  plateP.appendChild(document.createTextNode(element.patente));

  getTimeTypeNode = register ? document.createTextNode(element.timeOut) : document.createTextNode(element.timeIn);
  hourP.appendChild(getTimeTypeNode);  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return
}

const alertMsj = (patente) =>{
  let msj = document.querySelector(".notification-registro");
  msj.classList.remove("hidden");
  msj.innerHTML=`${patente} no está registrado en el ingreso`;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  6000);
}


let saveVehicle = (event) =>{
  event.preventDefault();

  let plateInput = document.getElementById("patente"); // TODO : BAJA PRIORIDAD -> consultar que la patente no este en la base de datos
  let radioInput = document.querySelector('input[name=tipo]:checked').value;
  let timeIn     = moment().format("H:mm");

  let dataFormat = {"patente":plateInput.value ,"type":radioInput, "timeIn": timeIn};
  
  let pushItemflag = renderCount(dataFormat);
  if (pushItemflag) {
    makeItem(dataFormat);
    vehiclesArray.vehicles.push(dataFormat);
    saveJson();
  }

  plateInput.value="";
  plateInput.focus();
}


const registerVehicle = (event) => {
  event.preventDefault();

  let plateInput = document.getElementById("patente-reg");
  let allVehicles = vehiclesArray.vehicles;
  let flag = false;

  if  (allVehicles.length == 0){
    alertMsj(plateInput.value);
  }else{ 
    for (let index = 0; index < allVehicles.length; index++) {
      const vehicle = allVehicles[index];
      if (vehicle.patente == plateInput.value){ 
        flag = true;
        let tipo       = vehicle.type ;  // necesito el tipo para saber que tarifa cobrar
        let timeOut    = moment().format("H:mm");
        let dataFormat = {"patente" : plateInput.value,"type" : tipo, "timeOut" : timeOut};

        // aca va el modal, si el modal es confirmado , hace lo de abajo, de lo contrario NO
        // el modal debe : 
        //                Traer el precio segun el tiempo y el tipo de vehiclo


        renderCount(dataFormat,-1);
        makeItem(dataFormat,true); 
        vehiclesArray.registerOut.push(dataFormat);
        allVehicles.splice(index,1);
    
        let liToDelete = document.querySelector(`.${vehicle.patente}`);
        liToDelete.parentElement.remove();
        saveJson();
        plateInput.value="";
        plateInput.focus();
        break;
      } 
    }
  }
  
  if (!flag){ alertMsj(plateInput.value); }

}

let initializeJsonData = () =>{
  vehiclesArray.vehicles.forEach(itemJson => {
    renderCount(itemJson); // xjfw2
    makeItem(itemJson);
  });
  vehiclesArray.registerOut.forEach(regJson =>{
    makeItem(regJson,true);
  });
}

initializeJsonData();