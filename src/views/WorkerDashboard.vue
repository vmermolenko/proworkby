<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Статус</div>
             
               <v-list-item-title class="headline mb-1">{{payment_workers.status_worker}}</v-list-item-title>
              <v-list-item-subtitle>Ваша активность</v-list-item-subtitle>
            </v-list-item-content>

           
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Заработок</div>
              <v-list-item-title class="headline mb-1">{{payment_workers.sum_income}} руб.</v-list-item-title>
              <v-list-item-subtitle>Всего заработано на сервисе</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            >  
            <v-icon size="70" color="white">mdi-account-cash</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Выплачено</div>
              <v-list-item-title class="headline mb-1">{{payment_workers.sum_payoff}} руб.</v-list-item-title>
              <v-list-item-subtitle>Всего выплачено рабочему</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
              
            >
            <v-icon size="70" color="white">mdi-currency-usd</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Остаток</div>
              <v-list-item-title class="headline mb-1">{{payment_workers.sum_total_income}} руб.</v-list-item-title>
              <v-list-item-subtitle>Остаток выплаты рабочему</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            >
            <v-icon size="70" color="white">mdi-cash-plus</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Телеграмм канал Prowork.by</div>
                <v-btn
                  depressed
                  color="primary"
                  href="https://t.me/joinchat/GM6MnVFuoz0xYw2OYjNtjg" target="_blank"
                >
                  Подключиться к группе
                </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12" style="visibility: hidden;">
        <v-card class="mx-auto" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Токен</div>
              <h6>{{postItem.usertoken}}</h6>
            </v-list-item-content>

          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import firebase from '../main'
import '@firebase/messaging';

export default {
  data: () => ({
    config: {
      headers: {
        'Content-Type': 'text/json'
      }
    },
    payment_workers: {
      status_worker: "", 
      res: "0", 
      msg: "0", 
      sum_income: "0", 
      sum_payoff: "0", 
      sum_total_income: "0"
    },
    auth_email: '',
    postItem: {
      email: '',
      usertoken: '', 
    },
    errorpost: '',
    currentToken: '',
    err: '',
    
  }),

  created () {
    this.auth_email = localStorage.email
    this.postItem.email = this.auth_email
    this.get_worker_dashboard()
    this.set_firebare_messaging()
    
  },

  methods: {
    async get_worker_dashboard(){
       await axios
           .post('https://prowork.by/api_client/get_workerdashboard.php', this.postItem, this.config)
           .then(response => {(this.payment_workers = response.data);} )
           .catch(err =>  (this.errorpost = err))           
    },

    async post_worker_token(){
       await axios
           .post('https://prowork.by/api_client/post_worker_token.php', this.postItem, this.config)
           .then(response => {
             //(alert(response.data));
              (localStorage.token = response.data)
             } )
           .catch(err =>  (this.errorpost = err))           
    },

    set_firebare_messaging (){
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey("BMeafcxAsFReF-EVLKTM2a255bTTbhSP5NK9hlTVcagz3rfsXwheXKiuBqmW7KNYMcxz7jhm0F0RdhKoMjlBBhU");
      
      messaging
        .requestPermission()
        .then(function () {
          //MsgElem.innerHTML = "Notification permission granted." 
          //console.log("Notification permission granted.");
        })
        .catch(function (err) {
          alert(err)
        //ErrElem.innerHTML = ErrElem.innerHTML + "; " + err
        //console.log("Unable to get permission to notify.", err);
      })

      messaging.getToken().then((currentToken) => {
        if (currentToken) {
          //sendTokenToServer(currentToken);
          //updateUIForPushEnabled(currentToken);
          //alert(currentToken)
          this.postItem.usertoken = currentToken
          this.post_worker_token()
        } else {
          //alert(currentToken)
          this.postItem.usertoken = currentToken
          // Show permission request.
          //console.log('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
          //updateUIForPushPermissionRequired();
          //setTokenSentToServer(false);
        }
      }).catch((err) => {
        alert(err)
        //console.log('An error occurred while retrieving token. ', err);
        //showToken('Error retrieving Instance ID token. ', err);
        //setTokenSentToServer(false);
      });
      


      messaging.onTokenRefresh(() => {
      messaging.getToken().then((refreshedToken) => {
        //alert('Token refreshed.' + refreshedToken)
        this.postItem.usertoken = refreshedToken
          this.post_worker_token()
        //console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        //setTokenSentToServer(false);
        // Send Instance ID token to app server.
        //sendTokenToServer(refreshedToken);
        // ...
      }).catch((err) => {
        alert('Unable to retrieve refreshed token ' + err)
      });


    });

    //Add callback for receiving FCM
    messaging.onMessage(function(payload) {
      let notification = payload.notification;
      alert(notification.body);
    });
    }
  },
}
</script>