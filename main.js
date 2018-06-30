
// DUDA JavaScript no se queja si no guardar el return de una función, es mala práctica?
// DUDA variables const y let
// DUDA la plata total no se guarda porque no lo puse, deberia?
// DUDA tratar el asunto de los radios
// posible mejora : mascara de caracteres
// posible mejora : Pestañas en vez de botones. 


// TODO : ESTABLECER PRECIOS;

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

// wip
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

/** Controla el número renderizado ( el contador y color ) */
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

  getTimeTypeNode = register ? document.createTextNode(element.timeOut) : document.createTextNode(element.timeIn);
  hourP.appendChild(getTimeTypeNode);  
  flex.appendChild(plateP); 
  flex.appendChild(hourP); 
  vehicleLi.appendChild(flex); 
  listUl.appendChild(vehicleLi); 
  
  return
}

/** Simplemente una alerta de error  */

const alertMsjOut = (patente,text) =>{
  let msj = document.querySelector(".notification-regout");
  msj.classList.remove("hidden");
  msj.innerHTML=`${patente} ${text}`;
  let timeDisappear = 3000;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  timeDisappear);
}

const alertMsj = (patente,text) =>{
  let msj = document.querySelector(".notification-regin");
  msj.classList.remove("hidden");
  msj.innerHTML=`${patente} ${text}`;
  let timeDisappear = 4000;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  timeDisappear);
}

const alertErrorMsj = (text) => {

  let msj = document.querySelector(".notificacion-error");
  msj.classList.remove("hidden");
  msj.innerHTML=`${text}`;
  let timeDisappear = 4000;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  timeDisappear);
}

const alertSucessMsj = (text) => {
  console.log("checkeo de sucess");
  let msj = document.querySelector(".notificacion-ok");
  msj.classList.remove("hidden");
  msj.innerHTML=`${text}`;
  let timeDisappear = 4000;
  setTimeout(function(){
  msj.classList.add("hidden");
  },
  timeDisappear);
}



/** Verifica si la placa ya existe */
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

/** Function activada por el boton de "Guardar" en el Ingreso de vehiculo */
let saveVehicle = (event) =>{
  event.preventDefault();

  let plateInput = document.getElementById("patente"); 

  if (checkPlate(plateInput.value)){
    let radioInput = document.querySelector('input[name=tipo]:checked').value;
    let timeIn     = moment().format("H:mm");
  
    let dataFormatIn = {"patente":plateInput.value ,"type":radioInput, "timeIn": timeIn};
    
    let pushItemflag = renderCount(dataFormatIn);
    if (pushItemflag) {
      makeItem(dataFormatIn);
      vehiclesArray.vehicles.push(dataFormatIn);
      saveJson();

      plateInput.value="";
      plateInput.focus();
    }else{
      alertMsj(" ","Debe seleccionar tipo de vehículo.")
    }
  }else{
    alertMsj(plateInput.value,"Ya está en la lista.");
  }


}

/** Calcula la cantidad de dinero según el tiempo*/
const getTotalMoney = (timeIn,timeOut,type) =>{
  /* moment.js  Revisar <- */
  let start = moment.duration(timeIn, "HH:mm");
  let end = moment.duration(timeOut, "HH:mm");
  let diff = end.subtract(start);

  // supuestamente pretende redondear para cobrar
  let hours = diff.hours();
  if (diff.minutes() < 31){
    hours = hours+0.5;
  }else{
    hours = hours+1;
  }
  
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

/** Evento al apretar para la salida de vehiculo.  */
const registerVehicle = (event) => {
  event.preventDefault();

  let allVehiclesJson = vehiclesArray.vehicles;
  let flag = false;


  if  (allVehiclesJson.length == 0){
    alertMsjOut(plateInputReg.value," no está registrado en el ingreso");
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
        
        // despues de encontrar y guardar datos de salida del vehiculo,cargará el modal.
        // luego el "Confirmar" decidirá si la información es registrada o no.
        chargeAndShowModal(dataFormatOutJson);
        break;
      } 
    }
  }
  if (!flag){ alertMsjOut(plateInputReg.value,"no está registrado en el ingreso"); }
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


const numberControl = () =>{
  flagError = true;
  for (let i = 0; i < configFormArray.length; i++) {
    const elementInput = (configFormArray[i].value);
    if (elementInput < 0){
      flagError = false;
    }
    if (isNaN(elementInput)){
      flagError = false;
    }
    console.log(Number.isInteger(Number(elementInput)));
    if (!Number.isInteger(Number(elementInput))){
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
    // location.reload();
    reloadAll();
  }else{
    alertErrorMsj(" Error,las entradas deben ser números y mayores a cero. ") ;
  }
  // todavia a mejorar numberControl(configFormArray);

}

/** Recarga la web. debe ser así para que configure los limites y precios de forma correcta. */
const reloadAll = () =>{
  // location.reload();
  // alertSucessMsj(" Cambios guardados y establecidos.");
}

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
    renderCount(itemJson); // xjfw2
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


