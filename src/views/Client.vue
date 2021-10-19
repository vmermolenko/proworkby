<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="clients"
        sort-by="id desc"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Клиенты</v-btn></v-toolbar-title>
            <v-divider class="mx-4" inset vertical ></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical ></v-divider>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Создать клиента</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }} {{ editedItem.id }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.name_company" label="Название компании"></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.bankpa" label="Расчетный счет в банке"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.bankbik" label="Бик банка"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.unp" label="УНП"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field 
                        v-model="editedItem.phone" 
                        label="Телефон"
                        v-mask="'+375(##) ###-##-##'"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.mail" label="Почта"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.password" label="Пароль"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.date_from" label="Дата регистрации">
                          <v-date-picker v-model="date1" :show-current="true"></v-date-picker>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.phone_cod_activation" label="Код активации"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items='client_status_phone'
                          v-model='editedItem.status_phone'
                          item-text='name'
                          item-value='id'
                          label='Статус'
                          item-color
                          autocomplete
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items='client_status_mail'
                          v-model='editedItem.status_mail'
                          item-text='name'
                          item-value='id'
                          label='Статус'
                          item-color
                          autocomplete
                        ></v-select>
                      </v-col>
                     
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="save()">Сохранить</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        
        <template v-slot:item.status_phone="{ item }">
          <v-subheader v-model="item.status_phone" label="Статус телефона">{{ getSelectedText(client_status_phone, item.status_phone) }}</v-subheader>
        </template>
        <template v-slot:item.status_mail="{ item }">
          <v-subheader v-model="item.status_mail" label="Статус почты">{{ getSelectedText(client_status_mail, item.status_mail) }}</v-subheader>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Обновить</v-btn>
        </template>
      </v-data-table>

      <div class="text-center">
        <v-dialog
          v-model="dialoginfo"
          width="500"
        >
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              Ответ сервера
            </v-card-title>

            <v-card-text>
              {{ info }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialoginfo = false"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({
    config: {
        headers: {
          'Content-Type': 'application/json'
        }
      },
    itemsave: null,
    dialoginfo: false,
    info: null,
    responsepost: '',
    errorpost: '',
    search: '',
    loading: true,
    dialog: false,
    date1: new Date().toISOString().substr(0, 10),
    client_status_phone:[
      { name: 'Не_задано', id: '0' },
      { name: 'Зарегистрирован', id: '1' },
      { name: 'Активирован', id: '2' },
      { name: 'Забанен', id: '3' },
    ],
    client_status_mail:[
      { name: 'Не_задано', id: '0' },
      { name: 'Зарегистрирован', id: '1' },
      { name: 'Активирован', id: '2' },
      { name: 'Забанен', id: '3' },
    ],
    headers: [
      {
        text: 'id',
        align: 'left',
        sortable: true,
        value: 'id',
      },
      { text: 'Название компании', value: 'name_company' },
      { text: 'Имя', value: 'name' },
      { text: 'Телефон', value: 'phone' },
      { text: 'Почта', value: 'mail' },
      { text: 'Статус телефона', value: 'status_phone_text' },
      { text: 'Статус почты', value: 'status_mail_text' },

      { text: 'Действие', value: 'action', sortable: false },
    ],
    clients: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '', 
      phone: '',
      mail: '', 
      password: '', 
      status_phone: 0, 
      status_mail: 0, 
      date_from: '', 
      date_to: '', 
      hash: '', 
      ip: '', 
      phone_cod_activation: '',
      name_company: '',
      unp: '0',
      bankpa: '',
      bankbik: ''
    },
    defaultItem: {
      id: 0,
      name: '', 
      phone: '',
      mail: '', 
      password: '', 
      status_phone: 0, 
      status_mail: 0, 
      date_from: '', 
      date_to: '', 
      hash: '', 
      ip: '', 
      phone_cod_activation: '',
      name_company: '',
      unp: 0,
      bankpa: '',
      bankbik: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Создать' : 'Редактировать'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    //this.initialize()
    this.get_item_all()
  },

  methods: {
    async get_item_all(){
      axios
           .get('https://prowork.by/api_client/get_all_client.php')
           .then(response => (this.clients = response.data))
           .finally(() => (this.loading = false));
    },

    async set_item_insert (itemPost) {
      axios.post('https://prowork.by/api_client/post_client_create.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.dialoginfo = true;})
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.dialoginfo = true));
      this.get_item_all();
      this.dialoginfo = true;

    },

    set_item_update (itemPost) {
      axios.post('https://prowork.by/api_client/post_client_update.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.dialoginfo = true;})
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.dialoginfo = true));
    },

    set_item_delete (itemPost) {
      axios.post('https://prowork.by/api_client/post_client_delete.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.dialoginfo = true;})
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.dialoginfo = true));
    },

    initialize () {
      this.get_item_all()
    },

    editItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      if (confirm('Are you sure you want to delete this item?') )
      {
        //this.clients.splice(index, 1)
        this.set_item_delete(item);
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {

      if (this.editedIndex > -1) {
        //alert('1save');
        //Object.assign(this.clients[this.editedIndex], this.editedItem)

        this.set_item_update(this.editedItem);

      } else {
        //alert('2save');
        //this.clients.push(this.editedItem)
        this.set_item_insert(this.editedItem);
        
      }
      this.close()
    },

    getSelectedText(arr, arrvalue){
      var elText = null;
      arr.forEach(element => {
        if (element.id == arrvalue) {
          //alert( element.id + ": " + element.name);
          elText = element.name;
        }
      })
      return elText
    },    
  },
}
</script>