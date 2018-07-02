let vehiclesArray=localStorage.getItem('vehicles') ? JSON.parse(localStorage.getItem('vehicles')) :{"vehicles":[],"registerOut":[],"money": "0",
"config" : {'motoPrice' : '80' ,
            'autoPrice' : '100' ,
            'camionetaPrice' : '120' ,
            'motoLimit' : '6' ,
            'autoLimit' : '8' ,
            'camionetaLimit' : '4' ,
            'alertLimit' : '2'}};


const dashboard = document.querySelector(".dashboard");
const checkin = document.querySelector(".checkin");
const checkout = document.querySelector(".checkout");
const config = document.querySelector(".config");
const modalDOM = document.querySelector('.modal');

let configFormArray = document.querySelectorAll('.config-inputs');

let cfg = vehiclesArray.config;
let autoPrice = cfg.autoPrice;
let motoPrice = cfg.motoPrice;
let camionetaPrice = cfg.camionetaPrice;

let autoLimit = cfg.autoLimit;
let motoLimit = cfg.motoLimit;
let camionetaLimit = cfg.autoLimit;

let alertLimit = cfg.alertLimit;

/// Variables modal, deben ser globales si o si.
let totalMoney;
let dataFormatOutJson;
let auxIndex;
let plateInputReg = document.getElementById("patente-reg");

let totalDOM = document.querySelector('.number-total'); // added

/** Switcher entre boards */
let openBoard = (event,boardItem) =>{
  event.preventDefault();
  checkin.classList.add('hidden'); 
  dashboard.classList.add('hidden');
  checkout.classList.add('hidden');  
  config.classList.add('hidden');
  
  eval(`${boardItem}`).classList.remove('hidden');
}

const hideModal = () =>{ modalDOM.classList.remove("is-active");}

const showModal = () =>{ modalDOM.classList.add("is-active");}

const saveJson = () => { localStorage.setItem('vehicles', JSON.stringify(vehiclesArray));}

/** Se encarga de renderizar y controlar los contadores. */
const setCount = (elementNum , counter = 1) =>{
  let numberDOM =  document.querySelector(`.num-${elementNum.type}`);
  let radioDOM =  document.querySelector(`.radio-${elementNum.type}`);
  let limite = eval(`${elementNum.type}Limit`);

  let number= parseInt(numberDOM.innerHTML) + counter;
  let pushItemFlag = false;
  
  pushItemFlag = setColorLimit(numberDOM,number,limite);
  let isFull = checkFullLimit(number,limite);

  if (isFull){
    setColorFull(numberDOM);
    disableRadio(radioDOM);
  }else{
    unsetColorFull(numberDOM);
    enableRadio(radioDOM);
  }
  return pushItemFlag;
}

/** Le da color al número si esta cerca del límite. */
const setColorLimit = (numberDOM,number,limite) =>{
  let flag = false;
  let numberClass = numberDOM.classList;
  if (number <= limite ) {
    numberDOM.innerHTML = number;
    let remainingSpace = Math.abs(number - limite);
    (remainingSpace <= alertLimit) ?  numberClass.add("color-alert") : numberClass.remove("color-alert");
    
    flag = true;
  }
  return flag;
}

/** Comprueba si esta a full los espacios. */
const checkFullLimit = (number,limite) =>{
  let isFull;
  isFull = (number + 1 > limite) ? true:false;
  return isFull;
}

/// Funciones relacionadas al momento de llegar al limite de espacio.
const disableRadio = (radioDOM) => { radioDOM.classList.add("hidden"); }
const enableRadio  = (radioDOM) => { radioDOM.classList.remove("hidden");}
const setColorFull = (numberDOM)=> { numberDOM.classList.add("color-limit");}
const unsetColorFull=(numberDOM)=> { numberDOM.classList.remove("color-limit");}

/** Solo crea el <li> y lo agrega al <ul> */
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

  let getTimeTypeNode = register ? document.createTextNode(element.timeOut) : document.createTextNode(element.timeIn);
  hourP.appendChild(getTimeTypeNode);  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return;
}

/** Simplemente una alerta de error  */

const alertRegOut = (text) =>{
  let itemDOM = document.querySelector(".notification-regout");
  showAlert(text,itemDOM);
}

const alertRegIn = (text) =>{
  let itemDOM = document.querySelector(".notification-regin");
  showAlert(text,itemDOM);
}

const alertConfig = (text) =>{
  let itemDOM = document.querySelector(".notificacion-error");
  showAlert(text,itemDOM);
}

const showAlert = (text,itemDOM) =>{
  let itemDOMclass = itemDOM.classList; 
  itemDOMclass.remove("hidden");
  itemDOM.innerHTML=`${text}`;
  let timeDisappear = 3000;
  setTimeout(function(){ itemDOMclass.add("hidden"); },timeDisappear);
}
// let msj = document.querySelector(".notificacion-ok");

/** Verifica si la placa ya existe */
let checkPlate = (plateInput) => {
  let exists = true;
  for (let i = 0; i < vehiclesArray.vehicles.length; i++) {
    const plateDB = vehiclesArray.vehicles[i].patente;
    if (plateInput == plateDB) {
      exists = false;
      break;
    }
  }
  return exists;
}

/** Establece todos los datos que corresponden. */
const setData = (vehicleObject) =>{
  makeItem(vehicleObject);
  vehiclesArray.vehicles.push(vehicleObject);
  saveJson();
  return;
}

const clearInput = (inputDOM) =>{
  inputDOM.value ="";
  inputDOM.focus();
  return;
}

/** En su ruta óptima toma los datos y los guarda. */
const setInputValues = (plateInputDOM) => {
  let radioInput = document.querySelector('input[name=tipo]:checked').value;
  let timeIn     = moment().format("H:mm");
  let vehicleDataObject = {"patente":plateInputDOM.value ,"type":radioInput, "timeIn": timeIn};
  
  let isNotFull = setCount(vehicleDataObject);
  if (isNotFull) {
    setData(vehicleDataObject);
    clearInput(plateInputDOM);
  }else{
    alertRegIn("Debe seleccionar tipo de vehículo.")
  }
  return;
}

/** Function activada por el boton de "Guardar" en el Ingreso de vehiculo */
let saveVehicle = (event) =>{
  event.preventDefault();
  let plateInputDOM = document.getElementById("patente"); 

  if (checkPlate(plateInputDOM.value)){
    setInputValues(plateInputDOM);
  }else{
    alertRegIn(plateInputDOM.value +" Ya está en la lista.");
  }
}

/** Calcula la cantidad de dinero según el tiempo*/
const getTotalMoney = (timeIn,timeOut,type) =>{
  /* moment.js  totalmente mejorable <- */
  let start = moment.duration(timeIn, "HH:mm");
  let end = moment.duration(timeOut, "HH:mm");
  let diff = end.subtract(start);

  let hours = diff.hours();
  hours = (diff.minutes() < 31) ? hours+0.5 :  hours+1;
  
  totalMoney = hours * eval(`${type}Price`);

  return totalMoney;
}

/** Carga la información que se registará en caso de Confirmar, <<Incluye>> mostrar datos en el modal */
const chargeAndShowModal = (dataJson) =>{
  showModal();
  textPlate = document.querySelector('.text-plate-modal');
  textMoney = document.querySelector('.text-money-modal');
  
  textPlate.innerHTML = dataJson.patente;
  totalMoney= getTotalMoney(dataJson.timeIn,dataJson.timeOut,dataJson.type);
  textMoney.innerHTML = "$ "+totalMoney;
}

const setRegister = (vehicle,index) =>{
  let tipo = vehicle.type ;  
  let timeIn = vehicle.timeIn ; 
  let timeOut = moment().format("H:mm");

  dataFormatOutJson ={"patente" : plateInputReg.value,
                      "type" : tipo,
                      "timeOut" : timeOut ,
                      "timeIn":timeIn};
  auxIndex= index;
  
  // despues de encontrar y guardar datos de salida del vehiculo,cargará el modal.
  // luego el "Confirmar" decidirá si la información es registrada o no.
  chargeAndShowModal(dataFormatOutJson);
}

/** Evento al apretar para la salida de vehiculo.  */
const registerVehicle = (event) => {
  event.preventDefault();

  let allVehiclesJson = vehiclesArray.vehicles;
  let flag = false;

  if  (allVehiclesJson.length == 0){
    alertRegOut(plateInputReg.value+" no está registrado en el ingreso");
  }else{ 
    for (let index = 0; index < allVehiclesJson.length; index++) {
      const vehicle = allVehiclesJson[index];
      if (vehicle.patente == plateInputReg.value){ 
        flag = true;
        setRegister(vehicle,index);
        break;
      } 
    }
  }
  if (!flag){ alertRegOut(plateInputReg.value + " no está registrado en el ingreso"); }
}

/** Botón confirmar */
let confirmButtonModalRegister= () =>{
  deleteAndRegisterItem(dataFormatOutJson);
  // let totalDOM = document.querySelector('.number-total');
  numParsed = parseInt(totalDOM.innerHTML)+totalMoney;
  totalDOM.innerHTML = numParsed;
  vehiclesArray.money= numParsed;
  saveJson();

  hideModal();
}

/** Borra y Actualiza los datos de renderizado y del localStorage */
let deleteAndRegisterItem = () =>{
  setCount(dataFormatOutJson,-1);
  makeItem(dataFormatOutJson,true); 
  
  let liToDelete = document.querySelector(`.${dataFormatOutJson.patente}`);
  liToDelete.parentElement.remove();
  
  vehiclesArray.registerOut.push(dataFormatOutJson);
  vehiclesArray.vehicles.splice(auxIndex,1);
  saveJson();
  
  plateInputReg.value="";
  plateInputReg.focus();
}


const numberControl = () =>{
  flagError = true;
  for (let i = 0; i < configFormArray.length; i++) {
    const elementInput = (configFormArray[i].value);
    if (elementInput < 0 || isNaN(elementInput) || !Number.isInteger(Number(elementInput)) || elementInput.length<1 ){
      flagError = false;
    } 
  }

  return flagError;
}


const saveConfig = () =>{
  event.preventDefault();
  if (numberControl()){
    cfg.autoPrice = configFormArray[0].value;
    cfg.motoPrice = configFormArray[1].value;
    cfg.camionetaPrice = configFormArray[2].value;
    cfg.autoLimit = configFormArray[3].value;
    cfg.motoLimit = configFormArray[4].value;
    cfg.camionetaLimit = configFormArray[5].value;
    saveJson();
    reloadAll();
  }else{
    alertConfig(" Error,las entradas deben ser números y mayores a cero. ") ;
  }
}

/** Recarga la web. debe ser así para que configure los limites y precios de forma correcta. */
const reloadAll = () =>{
  location.reload();
}

/** Renderiza valores actuales en la configuración */
const setConfigInputsPlaceholder = () =>{
  input = configFormArray;
  input[0].value = cfg.autoPrice;
  input[1].value = cfg.motoPrice;
  input[2].value = cfg.camionetaPrice;
  input[3].value = cfg.autoLimit;
  input[4].value = cfg.motoLimit;
  input[5].value = cfg.camionetaLimit;
}

/** Se ejecuta al principio para re crear los datos en la local storage */
let initializeJsonData = () =>{
  vehiclesArray.vehicles.forEach(itemJson => {
    setCount(itemJson); // xjfw2
    makeItem(itemJson);
  });
  vehiclesArray.registerOut.forEach(regJson =>{ makeItem(regJson,true); });
  if(vehiclesArray.money != null){
    totalDOM.innerHTML = vehiclesArray.money;
  }
  setConfigInputsPlaceholder();
}

/** esta función viene de clickear el icono de config, y activará las dos necesarias */
const configBoard  = (e) =>{
  e.preventDefault();
  openBoard(e,'dashboard');
  setConfigInputsPlaceholder();
}

initializeJsonData();
saveJson();