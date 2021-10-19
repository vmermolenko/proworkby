<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="orders"
        sort-by="id desc"
        class="elevation-1"
        :search="search"
        show-expand
        :single-expand="true"
        :dense="dense"
       
        @item-expanded="loadDetails"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Заказы</v-btn></v-toolbar-title>
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
                <v-btn color="primary" dark class="mb-2" v-on="on">Создать заказ</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Создать заказ</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                         <v-textarea v-model="newItem.description" label="Описание"></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="newItem.address" label="Адрес заказа"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-menu
                          v-model="menudate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="newItem.date_start"
                              label="Дата заказа"
                              prepend-icon="mdi-calendar-range"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="newItem.date_start" @input="menudate = false"></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-menu
                          ref="menutime"
                          v-model="menutime"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="newItem.time_start"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="newItem.time_start"
                              label="Время заказа"
                              prepend-icon="mdi-clock-outline"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            format='24hr'
                            min='00:00'
                            max='24:00'
                            :allowed-minutes='allowedStep'
                            v-model="newItem.time_start"
                            full-width
                            @click:minute="$refs.menutime.save(newItem.time_start)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col> 
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="newItem.count_worker" label="Число рабочих"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                        :items='order_topic'
                        v-model='newItem.topic'
                        item-text='name'
                        item-value='id'
                        label='Тип заказа'
                        item-color
                        autocomplete
                      ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="newItem.name" label="Имя заказчика"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field 
                        v-model="newItem.phone" 
                        v-mask="'+375(##) ###-##-##'"
                        label="Телефон заказчика"
                        ></v-text-field>
                      </v-col>                
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeCreateOrder()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="createOrder()">Создать</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogorder" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Редактировать заказ {{editedItem.id}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.tariff_order" label="Тариф заказа руб/час"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.tariff_worker" label="Тариф рабочего руб/час"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.address" label="Адрес"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.date_start" label="Дата начала заказа"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.date_finish" label="Дата окончания заказа"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.count_worker" label="Число рабочих"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="editedItem.description" label="Описание"></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                        :items='order_status'
                        v-model='editedItem.status'
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
                  <v-btn color="blue darken-1" text @click="closeEditOrder()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="editOrder(editedItem)">Сохранить</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

             <v-dialog v-model="dialogAddWorkerToOrder" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Добавить рабочего на заказ {{itemAddWorkerToOrder.order_id}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="itemAddWorkerToOrder.worker_phone" label="Номер телефона" 
                        prefix="+375"  
                        type="number" 
                        :rules="rules">
                        </v-text-field>
                      </v-col>
                       <v-col cols="6" sm="6" md="6">
                        <v-btn depressed color="primary" @click="get_worker_by_phone(itemAddWorkerToOrder)">Поиск</v-btn>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="itemAddWorkerToOrder.worker_id" label="id рабочего" type="number" ></v-text-field>
                      </v-col>
                       <v-col cols="6" sm="6" md="6">
                        <v-btn depressed color="primary" @click="get_worker_by_id(itemAddWorkerToOrder)">Поиск</v-btn>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="itemAddWorkerToOrder.id_worker" label="id рабочего"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="itemAddWorkerToOrder.name_company" label="Имя рабочего"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="itemAddWorkerToOrder.email" label="Почта рабочего"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="itemAddWorkerToOrder.phone" label="Телефон рабочего"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="itemAddWorkerToOrder.number_worker" label="Число рабочих"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDialogAddWorkerToOrder()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="saveDialogAddWorkerToOrder(itemAddWorkerToOrder)">Добавить</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="addWorkerToOrderItem(item)"
          >
            mdi-account-plus
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
             class="mr-2"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            small
             class="mr-2"
            @click="bellItem(item)"
          >
            mdi-bell
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Обновить</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <!-- <v-btn small color="primary" @click="worker_by_orders_id(item)">Обновить {{item.id}}</v-btn> -->
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">id</th>
                      <th class="text-left">id Рабочего</th>
                      <th class="text-left">Имя</th>
                      <th class="text-left">Телефон</th>
                      <th class="text-left">Число рабочих</th>
                      <th class="text-left">Дата регистрации</th>
                      <th class="text-left">Дата окончания</th>
                      <th class="text-left">Дата отмены</th>
                      <th class="text-left">Время работы</th>
                      <th class="text-left">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="worker in workers" :key="worker.id">
                      <td>{{ worker.id }}</td>
                      <td>{{ worker.id_worker }}</td>
                      <td>{{ worker.name }}</td>
                      <td>{{ worker.phone }}</td>
                      <td>{{ worker.number_worker }}</td>
                      <td>{{ worker.date_from }}</td>
                      <td>{{ worker.date_to }}</td>
                      <td>{{ worker.date_cancel }}</td>
                      <td><v-text-field v-model="worker.work_time" type="number"></v-text-field></td>
                      <td>
                        <v-icon small class="mr-2" @click="editItemWorker(worker)">mdi-arrow-down-thick</v-icon>
                        <v-icon small class="mr-2" @click="deleteItemWorker(worker)">mdi-delete</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
          </td>
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
            value => (value || '').length > 8 || 'Количество цифр меньше 9',
            value => (value).length < 10 || 'Количество цифр больше 9',
          ],
    dialogAddWorkerToOrder: false,
    dialog: false,
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

    dialogorder: false,
    date1: new Date().toISOString().substr(0, 10),
    editedIndex: -1,
    glossary_status: {
      id: 1
    },
    glossary_topic: {
      id: 2
    },

    itemAddWorkerToOrder:{
      order_id:'',
      worker_id:'',
      worker_phone:'',
      id_worker: '',
      name_company: '',
      email: '',
      phone: '',
      number_worker: '',
    },
    emptyitemAddWorkerToOrder:{
      order_id:'',
      worker_id:'',
      worker_phone:'',
      id_worker: '',
      name_company: '',
      email: '',
      phone: '',
      number_worker: '',
    },

    emptyItem: {
      topic: 0,
      description: '', 
      address: '', 
      date_start: '',  
      time_start: '',  
      count_worker: '', 
      name: '', 
      phone: ''
    },
    newItem: {
      topic: 0,
      description: '', 
      address: '', 
      date_start: '',  
      time_start: '',  
      count_worker: '', 
      name: '', 
      phone: ''
    },
    editedItem: {
      id: 1,
      date_from: '2018-11-29 10:00:40', 
      topic: 'Услуги грузчиков',
      description: 'Погрузка', 
      address: 'Минск ', 
      date_start: '2018-11-29 10:00:40',  
      date_finish: '2018-11-29 10:00:40', 
      status: 1,  
      status_text: 'В работе', 
      count_worker: 2, 
      count_number_worker: 1, 
      name: 'Александр', 
      phone: '375292502550',
      tariff_order: '375292502550',
      tariff_worker: '375292502550',

    },
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
    order_status:[
      { name: 'Не_задано', id: '0' },
      { name: 'Регистрация', id: '1' },
      { name: 'Поиск рабочих', id: '2' },
      { name: 'Бригада собрана', id: '3' },
      { name: 'Окончание работ', id: '4' },
      { name: 'Расчет суммы за заказ', id: '5' },
      { name: 'Выставление счета заказчику', id: '6' },
      { name: 'Начисление на баланс рабочим', id: '7' },
      { name: 'Обработан', id: '8' },
      { name: 'Отмена заказчиком', id: '9' },
      { name: 'Отмена рабочими', id: '10' },
      { name: 'Отмена администратором', id: '11' }

    ],
    order_topic: [],
    headers: [
      {
        text: 'id',
        align: 'left',
        sortable: true,
        value: 'id',
      },
      { text: 'Дата начала заказа', value: 'date_from' },
      { text: 'Тип заказа', value: 'topic' },
      { text: 'Описание заказа', value: 'description' },
      { text: 'Адрес заказа', value: 'address' },
      { text: 'Дата начала заказа', value: 'date_start' },
      { text: 'Дата окончания заказа', value: 'date_finish' },
      { text: 'Статус заказа', value: 'status_text' },
      { text: 'Число рабочих', value: 'count_worker' },
      { text: 'Найдено рабочих', value: 'count_number_worker' },
      { text: 'Время работ', value: 'work_time' },
      { text: 'Имя клиента', value: 'name' },
      { text: 'Телефон клиента', value: 'phone' },

      { text: 'Действие', value: 'action', sortable: false }
    ],
    orders: [],
    workers: [],
    workers2: [{
        id: 1,
        id_order: 1,
        id_worker: 1,
        name: 'Иван',
        phone: '375292502550',
        number_worker: 1,
        date_from: '2018-11-29 10:00:40',
        date_to: '2018-11-29 10:00:40',
        date_cancel: '2018-11-29 10:00:40',
        work_time: 0.5
      },
      {
        id: 2,
        id_order: 2,
        id_worker: 2,
        name: 'Иван',
        phone: '375292502550',
        number_worker: 2,
        date_from: '2018-11-29 10:00:40',
        date_to: '2018-11-29 10:00:40',
        date_cancel: '2018-11-29 10:00:40',
        work_time: 1.5
      }
    ],
   }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Создать' : 'Редактировать'
    },
  },

  created () {
    //this.initialize()
    this.get_glossary_status(this.glossary_status)
    this.get_glossary_topic(this.glossary_topic)
    this.get_item_all()
    
  },

  methods: {

    get_worker_by_phone(itemPost){
      this.itemAddWorkerToOrder.id_worker = '';
      this.itemAddWorkerToOrder.name_company = '';
      this.itemAddWorkerToOrder.email = '';
      this.itemAddWorkerToOrder.phone = '';
      axios.post('https://prowork.by/api_client/get_worker_by_phone.php', itemPost, this.config)
           .then(responsepost => { 
              this.itemAddWorkerToOrder.id_worker = responsepost.data[0].id_worker;
              this.itemAddWorkerToOrder.name_company = responsepost.data[0].name_company;
              this.itemAddWorkerToOrder.email = responsepost.data[0].email;
              this.itemAddWorkerToOrder.phone = responsepost.data[0].phone;           
           })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));                
    },

    get_worker_by_id(itemPost){
      this.itemAddWorkerToOrder.id_worker = '';
      this.itemAddWorkerToOrder.name_company = '';
      this.itemAddWorkerToOrder.email = '';
      this.itemAddWorkerToOrder.phone = '';
      axios.post('https://prowork.by/api_client/get_worker_by_id.php', itemPost, this.config)
           .then(responsepost => { 
              this.itemAddWorkerToOrder.id_worker = responsepost.data[0].id_worker;
              this.itemAddWorkerToOrder.name_company = responsepost.data[0].name_company;
              this.itemAddWorkerToOrder.email = responsepost.data[0].email;
              this.itemAddWorkerToOrder.phone = responsepost.data[0].phone;   
            })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));           
    },

    get_worker_add(itemPost){
      
      axios.post('https://prowork.by/api_client/get_worker_add.php', itemPost, this.config)
           .then(responsepost => { 
              this.info = responsepost.data; 
              this.get_item_all();
              this.dialoginfo = true;
            })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));           
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
    async get_item_all(){
      axios
           .get('https://prowork.by/api_client/get_all_orders.php')
           .then(response => (this.orders = response.data))
           .finally(() => (this.loading = false));
           
    },
    async worker_by_orders_id (itemPost) {
      this.workers = null;
      axios.post('https://prowork.by/api_client/post_worker_by_orders_id.php', itemPost, this.config)
           .then(responsepost => { (this.workers = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
      //alert('worker_by_orders_id')
      //this.get_item_all();
      //this.dialoginfo = true;

    },

    async set_item_insert (itemPost) {
      //alert(itemPost.topic  + itemPost.description + itemPost.address + itemPost.date_start + itemPost.time_start + itemPost.count_worker + itemPost.name +  itemPost.phone)
      axios.post('https://prowork.by/api_client/post_orders_create.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.newItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));

    },

    async set_item_update (itemPost) {
      axios.post('https://prowork.by/api_client/post_orders_update.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.newItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    set_item_delete (itemPost) {
      axios.post('https://prowork.by/api_client/post_orders_delete.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    initialize () {
      this.get_item_all()
    },
    addWorkerToOrderItem (item) {
      //this.editedIndex = this.orders.indexOf(item)
      //this.editedItem = Object.assign({}, item)
      
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.itemAddWorkerToOrder.order_id = this.editedItem.id
      this.dialogAddWorkerToOrder = true
    },

    closeDialogAddWorkerToOrder () {
      this.dialogAddWorkerToOrder = false
    },

    saveDialogAddWorkerToOrder (item) {
      this.get_worker_add(item)
      this.dialogAddWorkerToOrder = false
    },

    editItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogorder = true
    },

    closeEditOrder () {
      this.dialogorder = false
    },

    editOrder(itemUpdate) {
      this.set_item_update(itemUpdate);
      this.dialogorder = false
    },

    deleteItem (itemPost) {
      if (confirm('Удалить заказ ' + itemPost.id + '?') )
      {
        this.set_item_delete(itemPost)
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
            .then(responsepost => { (this.workers = responsepost.data); this.get_item_all()})
            .catch(err =>  (this.errorpost = err))
            .finally(() => (null));
      }
    },
    closeCreateOrder () {
      this.dialog = false
    },

    createOrder () {
      this.set_item_insert(this.newItem)
      this.dialog = false
      
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
    doSomething () {
      window.alert('test')
    },

    bellItem (itemPost) {
      if (confirm('Оповестить заказ ' + itemPost.id + '?') )
      {
        this.set_item_bell(itemPost)
      }
    },

    set_item_bell (itemPost) {
      axios.post('https://prowork.by/api_client/post_orders_bell.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    expandRow (item) {
      //-@click:row="expandRow" 
      // would be
      // this.expanded = [item]
      // but if you click an expanded row, you want it to collapse
      //alert(item.id)
      this.worker_by_orders_id(item)
      //this.expanded = item === this.expanded[0] ? [] : [item]
    },
    loadDetails({item}) {
      //alert('loadDetails' + item.id)
      this.worker_by_orders_id(item)
    }
  },
}
</script>