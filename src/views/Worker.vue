<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="workers"
        sort-by="id desc"
        class="elevation-1"
        :search="search"
        :dense="dense"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Рабочие</v-btn></v-toolbar-title>
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
            <v-dialog v-model="dialogcreate" max-width="100%">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Добавить рабочего</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Добавить рабочего</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="newItem.name_company" label="Имя компании"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field v-model="newItem.middlename" label="Фамилия"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field v-model="newItem.firstname" label="Имя"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field v-model="newItem.lastname" label="Отчество"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field 
                        v-model="newItem.phone" 
                        label="Телефон"
                        v-mask="'+375(##) ###-##-##'"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field v-model="newItem.email" label="Почта"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeCreateItem()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="createItem()">Создать</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogedit" max-width="90%">
              <v-card>
                <v-card-title>
                  <span class="headline">Редактировать данные рабочего {{editedItem.id}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.name_company" label="Имя компании"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.middlename" label="Фамилия"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.firstname" label="Имя"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.lastname" label="Отчество"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.age" label="Возраст"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.sex" label="Пол"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.avatar" label="Аватар"></v-text-field>
                        <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <!--
                        <expandable-image :src="editedItem.avatar_ifnull" ></expandable-image>
                        <v-file-input 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pick an avatar"
                          prepend-icon="mdi-camera"
                          label="Avatar"
                          v-model="fileAvatar"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar()">Обновить</v-btn>
                        -->
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.phone" label="Телефон"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.email" label="Почта"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.password" label="Пароль"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.phone_cod_activation" label="Код активации"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.token_mobile" label="Токен мобильный"></v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field v-model="editedItem.token_web" label="Токен web"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-select
                          :items='status_phone'
                          v-model='editedItem.status_phone'
                          item-text='name'
                          item-value='id'
                          label='Статус телефона'
                          item-color
                          autocomplete
                        ></v-select>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-select
                          :items='status_mail'
                          v-model='editedItem.status_mail'
                          item-text='name'
                          item-value='id'
                          label='Статус почты'
                          item-color
                          autocomplete
                        ></v-select>
                      </v-col>


                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.creditcard" label="Номер карты"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.filepassport" label="Скриншот паспорта"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.filebill_s" label="Чек оплаты"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.passportseries" label="Серия паспорта"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.passportnum" label="Номер паспорта"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.passport_identification_number" label="Идентификационный номер"></v-text-field>
                      </v-col>

                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.unp_ip" label="УНП ИП"></v-text-field>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-text-field v-model="editedItem.bankpa_ip" label="Р/C ИП"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.bankbik_ip" label="Бик банка ИП"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.filecertificate_ip" label="Сертификат ИП"></v-text-field>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        
                      </v-col>

                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.unp_org" label="УНП Организации"></v-text-field>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-text-field v-model="editedItem.bankpa_org" label="Р/C Организации"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.bankbik_org" label="Бик банка Организации"></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-model="editedItem.filecertificate_org" label="Сертификат Организации"></v-text-field>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        
                      </v-col>

                     
                       <v-col cols="3" sm="3" md="3">
                        <v-select
                        :items='worker_type'
                        v-model='editedItem.worker_type'
                        item-text='name'
                        item-value='id'
                        label='Тип рабочего'
                        item-color
                        autocomplete
                      ></v-select>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-select
                        :items='status_worker'
                        v-model='editedItem.status_worker'
                        item-text='name'
                        item-value='id'
                        label='Статус рабочего'
                        item-color
                        autocomplete
                      ></v-select>
                      </v-col>

                       <v-col cols="2" sm="2" md="2">
                        <v-textarea v-model="editedItem.description" label="Описание" rows="1"></v-textarea>
                      </v-col>
                      
                    </v-row>
                    <v-row>
                      <v-col cols="2" sm="2" md="2">
                         <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <expandable-image :src="editedItem.avatar_ifnull" ></expandable-image>
                        <v-file-input
                          :rules="rules" 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Выберите аватар"
                          prepend-icon="mdi-camera"
                          label="Аватар"
                          v-model="fileAvatar"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar(1)">Обновить</v-btn>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                         <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <expandable-image :src="editedItem.filepassport_ifnull" ></expandable-image>
                        <v-file-input 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Выберите паспорт"
                          prepend-icon="mdi-camera"
                          label="Паспорт"
                          v-model="filePassport"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar(2)">Обновить</v-btn>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                         <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <expandable-image :src="editedItem.filebill_s_ifnull" ></expandable-image>
                        <v-file-input 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Выберите чек оплаты"
                          prepend-icon="mdi-camera"
                          label="Чек оплаты"
                          v-model="fileBill"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar(3)">Обновить</v-btn>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                         <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <expandable-image :src="editedItem.filecertificate_ip_ifnull" ></expandable-image>
                        <v-file-input 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Выберите ИП сертификат"
                          prepend-icon="mdi-camera"
                          label="ИП сертификат"
                          v-model="fileCertificateIP"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar(4)">Обновить</v-btn>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                         <!--v-img :src="editedItem.avatar_ifnull" aspect-ratio="1.7"></v-img-->
                        <expandable-image :src="editedItem.filecertificate_org_ifnull" ></expandable-image>
                        <v-file-input 
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Выберите ОРГ сертификат"
                          prepend-icon="mdi-camera"
                          label="Организация сертификат"
                          v-model="fileCertificateORG"
                          >
                        </v-file-input>
                        <v-btn small @click="uploadAvatar(5)">Обновить</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDialogEdit()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="saveDialogEdit(editedItem)">Сохранить</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
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
        <v-dialog v-model="dialoginfo" width="500">
          <v-card>
            <v-card-title  class="headline grey lighten-2" primary-title>
              Ответ сервера
            </v-card-title>

            <v-card-text>
              {{ info }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialoginfo = false">
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
    rules: [
      value => !value || value.size < 200000000 || 'Размер должен быть менее 20 МБ!',
    ],
    fileAvatar: [],
    filePassport: [],
    fileBill: [],
    fileCertificateIP: [],
    fileCertificateORG: [],
    dialogcreate: false,
    allowedStep: m => m % 10 === 0,
    editdate: new Date().toISOString().substr(0, 10),
    edittime: null,
    menudate: false,
    menutime: false,

    dense: false,
    itemsave: null,
    dialoginfo: false,
    info: null,
    responsepost: '',
    errorpost: '',
    search: '',
    loading: true,

    dialogedit: false,
    date1: new Date().toISOString().substr(0, 10),
    editedIndex: -1,
    glossary_status: {
      id: 1
    },
    glossary_topic: {
      id: 2
    },
    glossary_status_worker: {
      id: 3
    },
    emptyItem: {
      name_company: '', 
      middlename: '', 
      firstname: '', 
      lastname: '',
      phone: '',
      email: '' 
    },
    newItem: {
      name_company: '', 
      middlename: '', 
      firstname: '', 
      lastname: '',
      phone: '',
      email: ''
    },
    editedItem: {
      id: '', 
      worker_type:'', 
      name_company: '', 
      email: '', 
      avatar: '', 
      age: '', 
      sex: '', 
      phone: '', 
      passportseries: '', 
      passportnum: '', 
      passport_identification_number: '', 
      date_from: '', 
      date_to: '', 
      status_phone: '', 
      status_mail: '', 
      hash: '', 
      password: '', 
      phone_cod_activation: '', 
      token_mobile: '', 
      token_web: '', 
      middlename: '', 
      firstname: '', 
      lastname: '', 
      creditcard: '', 
      filepassport: '', 
      filebill_s: '', 
      unp_ip: '', 
      bankpa_ip: '', 
      bankbik_ip: '', 
      filecertificate_ip: '', 
      unp_org: '', 
      bankpa_org: '', 
      bankbik_org: '', 
      filecertificate_org: '', 
      description: '', 
      status_worker: '',
      avatar_ifnull: '',
      uid: ''
    },
    worker_type:[
      { name: 'Не_задано', id: '0' },
      { name: 'Самозанятый', id: '1' },
      { name: 'ИП', id: '2' },
      { name: 'Организация', id: '3' },
    ],
    status_phone:[
      { name: 'Не_задано', id: '0' },
      { name: 'Зарегистрирован', id: '1' },
      { name: 'Активирован', id: '2' },
      { name: 'Забанен', id: '3' },
    ],
    status_mail:[
      { name: 'Не_задано', id: '0' },
      { name: 'Зарегистрирован', id: '1' },
      { name: 'Активирован', id: '2' },
      { name: 'Забанен', id: '3' },
    ],
    status_worker:[
      { name: 'Не_задано', id: '0' },
      { name: 'Зарегистрирован', id: '1' },
      { name: 'Забанен', id: '2' }
    ],
    order_topic: [],
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
      { text: 'Почта', value: 'email' },
      { text: 'Статус телефона', value: 'status_phone_text' },
      { text: 'Статус почты', value: 'status_mail_text' },

      { text: 'Действие', value: 'action', sortable: false },
    ],

    workers: [],

    }),

  created () {
    this.get_glossary_status(this.glossary_status)
    this.get_glossary_topic(this.glossary_topic)
    this.get_glossary_status_worker(this.glossary_status_worker)
    
    this.get_item_all()
  },

  methods: {
      
      uploadAvatar(filetype){

        let formData = new FormData();

        if (filetype == '1') {
          //this.fileUpload = this.fileAvatar
          formData.append("file", this.fileAvatar);
        }else if(filetype == '2') {
          //this.fileUpload = this.filePassport
          formData.append("file", this.filePassport);
        }else if(filetype == '3') {
          //this.fileUpload = this.fileBill
          formData.append("file", this.fileBill);
        }else if(filetype == '4') {
          //this.fileUpload = this.fileCertificateIP
          formData.append("file", this.fileCertificateIP);
        }else if(filetype == '5') {
          //this.fileUpload = this.fileCertificateORG
          formData.append("file", this.fileCertificateORG);
        }

        formData.append("idworker", this.editedItem.id);
        formData.append("filetype", filetype);
        /*
          Make the request to the POST /single-file URL
        */
        axios.post("https://prowork.by/api_client/api_file.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function() {
          //this.get_item_all();
          alert("SUCCESS UPLOAD!!");
        })
        .catch(function() {
          alert("FAILURE UPLOAD!!");
          //this.get_item_all();
        });
    },
    
    get_glossary_status(itemPost){
      axios.post('https://prowork.by/api_client/get_glossary.php', itemPost, this.config)
           .then(responsepost => { ( this.order_status = responsepost.data  );  })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));           
    },
    get_glossary_topic(itemPost){
      axios.post('https://prowork.by/api_client/get_glossary.php', itemPost, this.config)
           .then(responsepost => { ( this.order_topic = responsepost.data  );  })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));           
    },
    get_glossary_status_worker(itemPost){
      axios.post('https://prowork.by/api_client/get_glossary.php', itemPost, this.config)
           .then(responsepost => { ( this.status_worker = responsepost.data  );  })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));           
    },
    async get_item_all(){
      axios
           .get('https://prowork.by/api_client/get_all_worker.php')
           .then(response => (this.workers = response.data))
           .finally(() => (this.loading = false));
           
    },
    async set_item_insert (itemPost) {
      //alert(itemPost.topic  + itemPost.description + itemPost.address + itemPost.date_start + itemPost.time_start + itemPost.count_worker + itemPost.name +  itemPost.phone)
      axios.post('https://prowork.by/api_client/post_worker_create.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.newItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));

    },

    async set_item_update (itemPost) {
      axios.post('https://prowork.by/api_client/post_worker_update.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.newItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    set_item_delete (itemPost) {
      axios.post('https://prowork.by/api_client/post_worker_delete.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    initialize () {
      this.get_item_all()
    },
    readItem (item) {
      alert('readItem' + item);
    },

    editItem (item) {
      this.editedIndex = this.workers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogedit = true
    },

    closeDialogEdit () {
      this.dialogedit = false
    },

    saveDialogEdit(itemUpdate) {
      this.set_item_update(itemUpdate);
      this.dialogedit = false
    },

    async deleteItem (itemPost) {
      if (confirm('Удалить рабочего ' + itemPost.id + '?') )
      {
        this.set_item_delete(itemPost)
        /*
        try {

            await this.$store.dispatch('deleteUserUid', itemPost.uid)
          } catch (e) {
            alert(e)
        }
        */
      }
    },

    editItemWorker(itemPost) {
      this.workers = null;
      axios.post('https://prowork.by/api_client/post_worker_time_orders_id.php', itemPost, this.config)
           .then(responsepost => { (this.workers = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.get_item_all()));
      
    },
    deleteItemWorker(itemPost) {
      if (confirm('Удалить рабочего с заказа?') )
      {
        this.workers = null;
        axios.post('https://prowork.by/api_client/post_worker_time_orders_delete.php', itemPost, this.config)
            .then(responsepost => { (this.workers = responsepost.data); })
            .catch(err =>  (this.errorpost = err))
            .finally(() => (null));
      }
    },
    closeCreateItem () {
      this.dialogcreate = false
    },

    createItem () {
      this.set_item_insert(this.newItem)
      this.dialogcreate = false
      
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