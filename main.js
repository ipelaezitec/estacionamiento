
// DUDA  buscar 'xjfw2' : puedo llamar una función sin recibir lo que retorna? (EJEMPLO : renderCount)
// DUDA variables const y let
// DUDA la plata total no se guarda porque no lo puse, deberia?
// DUDA tratar el asunto de los radios
// posibles mejoras : mascara de caracteres


// TODO : ESTABLECER PRECIOS;
// no patentes repetidas + mensaje error

const dashboard = document.querySelector(".dashboard");
const checkin = document.querySelector(".checkin");
const checkout = document.querySelector(".checkout");
const modalDOM = document.querySelector('.modal');

let motoPrice = 80;
let autoPrice = 100;
let camionetaPrice = 120;
let TotalMoney = 0 ;

let motoLimit = 6;
let autoLimit = 10;
let camionetaLimit = 4;

let alertLimit = 2;

/// WIP
let totalMoney;
let dataFormatOutJson;
let auxIndex;
let plateInputReg = document.getElementById("patente-reg");
/// END WIP 


let vehiclesArray=localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) :{"vehicles":[],"registerOut":[]};

let openBoard = (event,boardItem) =>{
  event.preventDefault();
  checkin.classList.add('hidden'); 
  dashboard.classList.add('hidden');
  checkout.classList.add('hidden');  
  eval(`${boardItem}`).classList.remove('hidden');
}

const hideModal = () =>{ modalDOM.classList.remove("is-active");}

const showModal = () =>{ modalDOM.classList.add("is-active");}

const saveJson = () => { localStorage.setItem('vehicles', JSON.stringify(vehiclesArray));}

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


const alertMsj = (patente,text) =>{
  console.log("check,borrame");

  let msj = document.querySelector(".notification-registro");
  msj.classList.remove("hidden");
  msj.innerHTML=`${patente} ${text}`;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  6000);
}


let checkPlate = (plateInput) => {
  let plateExistFlag = true;
  for (let i = 0; i < vehiclesArray.vehicles.length; i++) {
    
    const plateDB = vehiclesArray.vehicles[i].patente;
    if (plateInput == plateDB) {
      plateExistFlag = false;
      break;
    }
  }

  console.log("plateflag : "+plateExistFlag);
  return plateExistFlag;
}

let saveVehicle = (event) =>{
  event.preventDefault();


  let plateInput = document.getElementById("patente"); // TODO : BAJA PRIORIDAD -> consultar que la patente no este en la base de datos


  if (checkPlate(plateInput.value)){
    let radioInput = document.querySelector('input[name=tipo]:checked').value;
    let timeIn     = moment().format("H:mm");
  
    let dataFormatIn = {"patente":plateInput.value ,"type":radioInput, "timeIn": timeIn};
    
    let pushItemflag = renderCount(dataFormatIn);
    if (pushItemflag) {
      makeItem(dataFormatIn);
      vehiclesArray.vehicles.push(dataFormatIn);
      saveJson();
    }
  }else{
    alertMsj(plateInput.value,"Ya está en la lista.");
  }

  plateInput.value="";
  plateInput.focus();
}

//////////////////// WIP 
const getTotalMoney = (timeIn,timeOut,type) =>{
  /* moment.js */
  let start = moment.duration(timeIn, "HH:mm");
  let end = moment.duration(timeOut, "HH:mm");
  let diff = end.subtract(start);

  let hours = diff.hours();
  if (diff.minutes() < 31){
    hours = hours+0.5;
  }else{
    hours = hours+1;
  }
  
  totalMoney = hours * eval(`${type}Price`);
  console.log("en testing  hours :"+hours);
  console.log("en testing  totalMoney :"+totalMoney);

  return totalMoney;
}

const chargeAndShowModal = (dataJson) =>{
  showModal();
  textPlate = document.querySelector('.text-plate-modal');
  textMoney = document.querySelector('.text-money-modal');
  
  textPlate.innerHTML = dataJson.patente;
  totalMoney= getTotalMoney(dataJson.timeIn,dataJson.timeOut,dataJson.type);
  textMoney.innerHTML = "$ "+totalMoney;
}

const registerVehicle = (event) => {
  event.preventDefault();

  let allVehiclesJson = vehiclesArray.vehicles;
  let flag = false;

  if  (allVehiclesJson.length == 0){
    alertMsj(plateInputReg.value,"no está registrado en el ingreso");
  }else{ 
    for (let index = 0; index < allVehiclesJson.length; index++) {
      const vehicle = allVehiclesJson[index];
      if (vehicle.patente == plateInputReg.value){ 
        flag = true;
        let tipo = vehicle.type ;  
        let timeIn = vehicle.timeIn ; 
        let timeOut = moment().format("H:mm");

        dataFormatOutJson ={"patente" : plateInputReg.value,
                            "type" : tipo,
                            "timeOut" : timeOut ,
                            "timeIn":timeIn};
        auxIndex= index;
        
        chargeAndShowModal(dataFormatOutJson);
        // chargeModal = 
        // aca estaba el  deleteAndRegisterItem();
        break;
      } 
    }
  }
  if (!flag){ alertMsj(plateInputReg.value,"no está registrado en el ingreso"); }
}


let confirmButtonModalRegister= () =>{
  deleteAndRegisterItem(dataFormatOutJson);
  let totalDOM = document.querySelector('.number-total');
  console.log(totalDOM);
  numParsed = parseInt(totalDOM.innerHTML)+totalMoney;
  console.log(numParsed);
  totalDOM.innerHTML = numParsed;
  hideModal();
}

// guarde el cobro
// guarde en el json el plate y el time out , el in y el type

let deleteAndRegisterItem = () =>{
  renderCount(dataFormatOutJson,-1);
  makeItem(dataFormatOutJson,true); 
  
  let liToDelete = document.querySelector(`.${dataFormatOutJson.patente}`);
  liToDelete.parentElement.remove();
  
  vehiclesArray.registerOut.push(dataFormatOutJson);
  vehiclesArray.vehicles.splice(auxIndex,1);
  saveJson();
  
  plateInputReg.value="";
  plateInputReg.focus();
}

let initializeJsonData = () =>{
  vehiclesArray.vehicles.forEach(itemJson => {
    renderCount(itemJson); // xjfw2
    makeItem(itemJson);
  });
  vehiclesArray.registerOut.forEach(regJson =>{ makeItem(regJson,true); });
}

initializeJsonData();