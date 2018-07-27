// Añadir variable para referenciar todos los metodos de la base de datos
const db = firebase.database();
const getID = (id) => {
	return document.getElementById(id).value;
};
let btnProfile = document.getElementById('btnProfile');
// Funciones complementarias
const cleanForm = (item, space) => {
	return document.getElementById(item).value = space;
};
// Funcion dataFormat da forma de objeto JSON a la info del usuario
const dataFormat = (userName, userAge, userWeight, userSize, blodSugar, medicine, nss, fatherSick, grandPsick, childrenSick) => {
	let dataU = {
		userName: userName,
		userAge: userAge,
		userWeight: userWeight,
		userSize: userSize,
		blodSugar: blodSugar,
		medicine: medicine,
		nss: nss,
		medicineHistory: {
			fatherSick: fatherSick,
			grandPsick: grandPsick,
			childrenSick: childrenSick
		}
	};
	console.log('JSON');
	console.log(dataU);
	return dataU;
};
// Insertar informacion en firebase
const insertUserProfile = () =>{
	// Traer elementos del DOM
	let userName = getID('nameUser');
	let userAge = getID('ageUser');
	let userWeight = getID('weightUser');
	let userSize = getID('sizeUser');
	let blodSugar = getID('blodSugar');
	let medicine = getID('medicine');
	let nss = getID('nss');
	let fatherSick = document.getElementById('fatherSick').checked;
	let grandPsick = document.getElementById('grandPsick').checked;
	let childrenSick = document.getElementById('childrenSick').checked;
	if (userName.length === 0 || userAge.length === 0 || userWeight.length === 0 || userSize.length === 0) {
		alert('Campos requeridos vacios. Favor de llenar y continuar');
	} else {
		// Convierte estado checked /no checked a un Stringa para imprimir
		if (fatherSick === true) fatherSick = 'Si';
		else fatherSick = 'No';
		if (grandPsick === true) grandPsick = 'Si';
		else grandPsick = 'No';
		if (childrenSick === true) childrenSick = 'Si';
		else childrenSick = 'No';
		// Pasa los datos del usuario a un formatoJSOM
		let dataJSON = dataFormat(userName, userAge, userWeight, userSize, blodSugar, medicine, nss, fatherSick, grandPsick, childrenSick);
		let profiles = db.ref('userProfile'); // Crea una rama en la base de datos para la información del usuario
		profiles.push(dataJSON); // Mete los datos a la base de datos
		alert('Tu perfil esta completo :D');
		// Limpiar los espacios del formulario para un nuevo registro
		cleanForm('nameUser', '');
		cleanForm('ageUser', '');
		cleanForm('weightUser', '');
		cleanForm('sizeUser', '');
		cleanForm('blodSugar', '');
		cleanForm('medicine', '');
		cleanForm('nss', '');
		// Cambia el estado de los botoenes checkbox para que queden limpios al nuevo registro
		if (fatherSick === 'Si') {
			fatherSick = true;
			fatherSick = $('#fatherSick');
			fatherSick.prop('checked', !fatherSick.prop('checked')); // Invierte estado en DOM
			fatherSick = false; // Invierte estado logico
		}
		if (grandPsick === 'Si') {
			grandPsick = true;
			grandPsick = $('#grandPsick');
			grandPsick.prop('checked', !grandPsick.prop('checked'));
			grandPsick = false;
		}
		if (childrenSick === 'Si') {
			childrenSick = true;
			childrenSick = $('#childrenSick');
			childrenSick.prop('checked', !childrenSick.prop('checked'));
			childrenSick = false;
		}
	}
};
// profile da un formato de tabla para mostrar la información de los usuarios que han llenado si perfil
const profile = (isUser, userName, userAge, userWeight, userSize, blodSugar, medicine, nss, fatherSick, grandPsick, childrenSick) =>{
	return `<table class="table table-hover"><thead><tr><th>Nombre</th><th>Edad</th><th>Peso</th><th>Altura</th><th>Glucosa</th>
        <th>Medicamentos</th><th>NSS</th><th>Padres enfermos</th><th>Abuelos enfermos</th><th>Hijos enfermos</th><th>Editar</th>
				<th>Borrar</th></tr></thead><tbody><tr><td>${userName}</td><td>${userAge}</td><td>${userWeight}</td><td>${userSize}</td>
        <td>${blodSugar}</td><td>${medicine}</td><td>${nss}</td><td>${fatherSick}</td><td>${grandPsick}</td><td>${childrenSick}</td>
        <td><i class="material-icons" onclick = "editFun()">create</i></td><td><i class="material-icons" onclick = "deleteFun()">delete</i></td>
        </tr></tbody></table>`;
};
// Funcion para imprimir en el DOM
const printDOM = (it, place) =>{
	return document.getElementById(it).innerHTML += place;
};
// Imprime los usuarios en el DOM
const printUsersDom = printUsers = () =>{
	let consult = db.ref('userProfile'); // Consuta la base de datos
	consult.on('child_added', (data) =>{ // Por cada elemento de la base de datos devulve el objeto de usuario
		let indice = Object.values(data)[1].path.pieces_.length;
		let idUser = Object.values(data)[1].path.pieces_[indice - 1]; // Guarda el id del usuario presente
		console.log(idUser);
		let userConsults = data.val(); // Toma los valores del obteto y los manda para su proceso
		let profileU = profile(userConsults.userName, userConsults.userAge, userConsults.userWeight, userConsults.userSize, userConsults.blodSugar, userConsults.medicine, userConsults.nss, userConsults.medicineHistory.fatherSick, userConsults.medicineHistory.grandPsick, userConsults.medicineHistory.childrenSick);
		printDOM('profileConteniner', profileU); // Imprime en un espacio en el DOM los datos del usuario
	});
};
// Editar infro de formulario
const editFun = (id)=>{
	console.log('Editando');
};
// Borrar formulario 
const deleteFun = () =>{
	let user = db.ref('userProfile/' + idUser);
	user.remove();
	location.reload();
};
// Eventos de botones
btnProfile.addEventListener('click', (event) =>{
	insertUserProfile();
});
