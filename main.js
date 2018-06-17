// DUDA //** la lista de elementos tiene que ser solo de los vehiculos que estan en el momento?  eso implicaria quitar el vehiculo de la lista, el registro en cambio seria siempre igual*/
// DUDA  buscar 'xjfw2' : puedo llamar una función sin recibir lo que retorna?

// LOG: el required en las etiquetas radio no funcionó, solucionar la experiencia usuario
// duda , variables const y let

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

  /** Cambia el color si está en el limite */
  if (numberParsed +1 > limite) {
    number.classList.add("color-limit");
    radio.classList.add("hidden");
  }else{
    radio.classList.remove("hidden"); // esto o :  radio.disabled = false; deberia probar radio.checked = false (ni idea si funciona)
  }
  
  return pushItemFlag;
}

let substractCount = (elementNum) =>{
    
  let number =  document.querySelector(`.num-${elementNum.type}`);
  // let radio =  document.querySelector(`.radio-${elementNum.type}`);
  let numberParsed = parseInt(number.innerHTML)-1; // to -1
  let limite = eval(`${elementNum.type}Limit`);

  // let pushItemFlag = false; 

  
  if (numberParsed <= limite ) {
    number.innerHTML = numberParsed;
    // pushItemFlag = true;
    
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
    // radio.classList.remove("hidden"); // esto o :  radio.disabled = false; deberia probar radio.checked = false (ni idea si funciona)
    number.classList.remove("color-limit");
  }
  
  
  // return pushItemFlag;
  return ;

}

const makeItem = (element) =>{
  // Ordenados por jerarquia */
  const listUl   = document.getElementById(`ul-${element.type}`);
  const flex      = document.createElement('div');
  const vehicleLi= document.createElement('li');
  const plateP  = document.createElement('p');
  const hourP     = document.createElement('p');

  vehicleLi.className = "li-reg";
  flex.className = `flex-reg ${element.patente}`; 

  plateP.appendChild(document.createTextNode(element.patente));
  hourP.appendChild(document.createTextNode(element.timeIn));  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return
}

const makeItemReg = (element) =>{

  // Ordenados por jerarquia */
  const listUl   = document.getElementById('ul-registro'); // esto cambió
  const flex      = document.createElement('div');
  const vehicleLi= document.createElement('li');
  const plateP  = document.createElement('p');
  const hourP     = document.createElement('p');

  vehicleLi.className = "li-reg";
  flex.className = "flex-reg";

  plateP.appendChild(document.createTextNode(element.patente));
  hourP.appendChild(document.createTextNode(element.timeOut)); // esto cambió  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return
}

const alertMsj = (patente) =>{
  let msj = document.querySelector(".notification-registro");
  msj.classList.remove("hidden");
  msj.innerHTML=`${patente} no está registrado`;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  5000);
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

  let plateInput = document.getElementById("patente-reg").value;
  let allVehicles = vehiclesArray.vehicles;
  let flag = false;

  if  (allVehicles.length == 0){
    alertMsj(plateInput);
  }else{ 
    for (let index = 0; index < allVehicles.length; index++) {
      const vehicle = allVehicles[index];
      if (vehicle.patente == plateInput){ 
        flag = true;
        let tipo       = vehicle.type ;  // necesito el tipo para saber que tarifa cobrar
        let timeOut    = moment().format("H:mm");
        let dataFormat = {"patente" : plateInput,"type" : tipo, "timeOut" : timeOut};
        substractCount(dataFormat);
        makeItemReg(dataFormat); 
        vehiclesArray.registerOut.push(dataFormat);
        allVehicles.splice(index,1);
    
        let liToDelete = document.querySelector(`.${vehicle.patente}`);
        liToDelete.parentElement.remove();
        saveJson();
        // plateInput="";
        // console.log(plateInput);
        // plateInput.focus();
        break;
      } 
    }
  }
  
  if (!flag){ alertMsj(plateInput); }

}

let initializeJsonData = () =>{
  vehiclesArray.vehicles.forEach(itemJson => {
    renderCount(itemJson); // xjfw2
    makeItem(itemJson);
  });
  vehiclesArray.registerOut.forEach(regJson =>{
    makeItemReg(regJson);
  });
}

initializeJsonData();