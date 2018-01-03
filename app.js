var app = angular.module('myApp', ['ngRoute']);

app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);

app.controller("creaMedicoController",
    function($scope, $http , getSpecialita,getPrestazione,getPossibiliDurate,getPossibiliGiorni,getPossibiliOrari, creazioneMedico ) {


        $scope.medico = {nome:"mario", cognome:"rossi",codiceFiscale:"331aa11"};
        getSpecialita.getAllSpecialita($scope,$http);

        $scope.metodoGetPrestazioni= function(){
            console.log("il valore in get Prestazioni e' "+$scope.specialitaSelezionata.codice);
//                $scope.CodicePrestazioneSelezionata=undefined;
            getPrestazione.getPrestazioneWithSpecialita($scope,$http,$scope.specialitaSelezionata.codice);
            getPossibiliDurate.getDurate($scope);
            getPossibiliGiorni.getGiorni($scope);
            getPossibiliOrari.getOrariInizio($scope);
        };

        $scope.orarioFinePossibile= function(orarioInizio){
            getPossibiliOrari.getOrariFine($scope, orarioInizio);
        };

        $scope.creaUtente = function(){
            creazioneMedico.creaMedico($scope,$http);
        }

    }
);

app.controller("ricercaMedicoController",
    function($scope, $http , getSpecialita,getPrestazione,ricercaMedico, getSetArrayMedici) {

        $scope.medico ={
            nome:null,
            cognome:null,
            codiceFiscale:null
        };
        $scope.specialitaSelezionata ={
            nome:null,
            codice:null
        };
        $scope.prestazione ={
            nome:null,
            codice:null
        };

        getSetArrayMedici.muoviamoci("ciao");

        getSpecialita.getAllSpecialita($scope,$http);

        $scope.metodoGetPrestazioni= function(){
            console.log($scope.specialitaSelezionata);
            getPrestazione.getPrestazioneWithSpecialita($scope,$http,$scope.specialitaSelezionata);
        };

        $scope.ricercaUtente = function(){
            ricercaMedico.ricerca($scope,$http);
        }

    }
);


app.controller("mostraMediciController", ['$location','$scope','$http','ricercaMedico',
    function($location,$scope,$http,ricercaMedico) {
        var params = $location.search();
        console.log('nome: ' + params.inputNome + ' cognome is: ' + params.inputCognome + ' cf is: ' + params.inputCF + ' Specialita is: ' + params.selectSpecialita + ' Prestazione is: ' + params.selectPrestazione);

        ricercaMedico.ricerca($scope,$http,params);

    }]
);



app.service("getSetArrayMedici",
    function() {
        var prova;

        this.muoviamoci = function (data) {
            prova=data;
        };

        this.getData= function (){

            return prova;
        }
    }
);


app.service("creazioneMedico",
    function() {
        var same=this;

        this.creaMedico = function ($scope,$http) {

            var validazione = same.validazioneForm($scope);
            //   if (validazione) {
            console.log("Validazione riuscita")

            var medicoCreato = {
                nome: $scope.medico.nome,
                cognome: $scope.medico.cognome,
                codiceFiscale: $scope.medico.codiceFiscale,
                codiceSpecialita: $scope.specialitaSelezionata.codice,
                nomeSpecialita: $scope.specialitaSelezionata.nome,
                giorno: $scope.disponibilita.giorno,
                orarioInizio: $scope.disponibilita.orarioInizio,
                orarioFine: $scope.disponibilita.orarioFine,

                codicePrestazione: $scope.prestazione.codice,
                durata: $scope.prestazione.durataSelezionata,
                costo: $scope.prestazione.costo
            };

            //  var prestazione = { codice:$scope.prestazione.CodicePrestazioneSelezionata, durata:$scope.prestazione.durataSelezionata , costo:$scope.prestazione.costo};


            var response = $http.post('http://localhost:8080/ProgettoClinicaAngular/creaMedico', medicoCreato);

            response.success(
                function (data, status, headers, config) {
                    alert("Creazione avvenuta con successo ");
                }
            );
            response.error(
                function (data, status, headers, config) {
                    alert("ERRORE ");
                }
            );
            /*      } else {
                      alert("Validazione Dati fallita , controlla i dati inseriti");
                  }
  */
        };

        this.validazioneForm = function($scope){
            /*  if(!$scope.formMedico.inputNome.$valid){
                  return false;
              }

              if(!$scope.formMedico.inputCognome.$valid){
                  return false;
              }
              if(!$scope.formMedico.inputCF.$valid){
                  return false;
              }
              if(!$scope.formMedico.selectSpecialita){
                  return false;
              }
              if(!$scope.formMedico.selectPrestazione){
                  return false;
              }
              if(!$scope.formMedico.selectDurata){
                  return false;
              }
              if(!$scope.formMedico.inputCosto.$valid){
                  return false;
              }
              if(!$scope.formMedico.selectGiorno){
                  return false;
              }
              if(!$scope.formMedico.selectOrarioInizio){
                  return false;
              }
              if(!$scope.formMedico.selectOrarioFine){
                  return false;
              }
              */
            return true;
        };



    }

);


app.service("getSpecialita",
    function() {
        var same=this;

        this.getAllSpecialita = function ($scope,$http) {

            $http.get("http://localhost:8080/ProgettoClinicaAngular/getAllSpecialita")
                .success(function(data) {
                    arraySpecialita=[];
                    $scope.arraySpecialita= same.mapJson(data);

                })
                .error(function() {
                    alert( "ERRORE elenco Specialita ");
                });
        };

        this.mapJson= function (data){
            myArray = [];

            for(i=0;i<data.length;i++){
                var specialita = {nome:data[i].nome, codice:data[i].codice};
                myArray.push(specialita);
            }

            return myArray;
        }
    }
);


app.service("getPrestazione",
    function() {
        var same=this;

        this.getPrestazioneWithSpecialita = function ($scope,$http,CodiceSpecialitaSelezionata) {
            $http({
                method : 'GET',
                url : 'http://localhost:8080/ProgettoClinicaAngular/getPrestazione/' + CodiceSpecialitaSelezionata

            }).then(function successCallback(response) {

                arrayPrestazioni=[];
                $scope.arrayPrestazioni= same.mapJson(response.data);

            }, function errorCallback(response) {
                console.log(response.statusText);
            });


        };

        this.mapJson= function (data){
            myArray = [];

            for(i=0;i<data.length;i++){
                var prestazione = {nome:data[i].nome, codice:data[i].codice};
                myArray.push(prestazione);
            }

            return myArray;
        }
    }
);

app.service("getPossibiliDurate",
    function() {

        this.getDurate = function ($scope) {
            $scope.myArrayDurate = [];
            var durata1 = {nome:"mezz'ora", valore:0.5};
            var durata2 = {nome:"1 ora", valore:1};
            var durata3 = {nome:"1 ora e mezza", valore:1.5};
            var durata4 = {nome:"2 ore", valore:2};
            var durata5 = {nome:"2 ore e mezza", valore:2.5};
            var durata6 = {nome:"3 ore", valore:3};

            $scope.myArrayDurate.push(durata1);
            $scope.myArrayDurate.push(durata2);
            $scope.myArrayDurate.push(durata3);
            $scope.myArrayDurate.push(durata4);
            $scope.myArrayDurate.push(durata5);
            $scope.myArrayDurate.push(durata6);

        };
    }
);

app.service("getPossibiliGiorni",
    function() {

        this.getGiorni = function ($scope) {
            $scope.myArrayGiorni = [];

            $scope.myArrayGiorni.push("Lunedi");
            $scope.myArrayGiorni.push("Martedi");
            $scope.myArrayGiorni.push("Mercoledi");
            $scope.myArrayGiorni.push("Giovedi");
            $scope.myArrayGiorni.push("Venerdi");
            $scope.myArrayGiorni.push("Sabato");

        };
    }
);


app.service("getPossibiliOrari",
    function() {

        this.getOrariInizio = function ($scope) {
            $scope.myArrayOrari = [];

            $scope.myArrayOrari.push(10);
            $scope.myArrayOrari.push(11);
            $scope.myArrayOrari.push(12);
            $scope.myArrayOrari.push(13);
            $scope.myArrayOrari.push(14);
            $scope.myArrayOrari.push(15);
            $scope.myArrayOrari.push(16);
            $scope.myArrayOrari.push(17);
            $scope.myArrayOrari.push(18);
        };

        this.getOrariFine = function ($scope, orarioInizio){
            $scope.myArrayOrariFine = [];
            orarioInizio++;
            for(var ora=orarioInizio; ora<=18;ora++){
                $scope.myArrayOrariFine.push(ora);
            }
        }
    }
);

app.service("ricercaMedico",
    function() {
        var same=this;

        this.ricerca = function ($scope,$http,params) {
            var medicoRicercato = {
                nome: params.inputNome,
                cognome: params.inputCognome,
                codiceFiscale: params.inputCF,
                codiceSpecialita: params.selectSpecialita,
                codicePrestazione: params.selectPrestazione
            };

            console.log(medicoRicercato);
            $http.get('http://localhost:8080/ProgettoClinicaAngular/getMedici/', {params: medicoRicercato}).then(
                function successCallback(response) {
                    console.log(response.data);
                    arrayMedici=[];
                    $scope.arrayMedici= same.mapJson(response.data);


                },
                function errorCallback(response) {
                    console.log(response.statusText);
                }
            );

        };

        this.mapJson= function (data){
            myArray = [];

            for(i=0;i<data.length;i++){
                var medico = {codice:data[i].codice, nome:data[i].nome, cognome:data[i].cognome, codiceFiscale:data[i].codiceFiscale, nomeSpecialita:data[i].nomeSpecialita, codiceSpecialita:data[i].codiceSpecialita,};
                console.log("il valore di medico e' "+medico.nome)
                myArray.push(medico);
            }

            for(i=0;i<myArray.length;i++){
                console.log("il valore di myArray e' "+myArray[i].nome)
            }
            return myArray;
        }

    }

);


app.service("getSpecialita",
    function() {
        var same=this;

        this.getAllSpecialita = function ($scope,$http) {

            $http.get("http://localhost:8080/ProgettoClinicaAngular/getAllSpecialita")
                .success(function(data) {
                    arraySpecialita=[];
                    $scope.arraySpecialita= same.mapJson(data);

                })
                .error(function() {
                    alert( "ERRORE elenco Specialita ");
                });
        };

        this.mapJson= function (data){
            myArray = [];

            for(i=0;i<data.length;i++){
                var specialita = {nome:data[i].nome, codice:data[i].codice};
                myArray.push(specialita);
            }

            return myArray;
        }
    }
);


app.service("getPrestazione",
    function() {
        var same=this;

        this.getPrestazioneWithSpecialita = function ($scope,$http,CodiceSpecialitaSelezionata) {
            $http({
                method : 'GET',
                url : 'http://localhost:8080/ProgettoClinicaAngular/getPrestazione/' + CodiceSpecialitaSelezionata

            }).then(function successCallback(response) {

                arrayPrestazioni=[];
                $scope.arrayPrestazioni= same.mapJson(response.data);

            }, function errorCallback(response) {
                console.log(response.statusText);
            });


        };

        this.mapJson= function (data){
            myArray = [];

            for(i=0;i<data.length;i++){
                var prestazione = {nome:data[i].nome, codice:data[i].codice};
                myArray.push(prestazione);
            }

            return myArray;
        }
    }
);