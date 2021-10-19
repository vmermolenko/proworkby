<template>
  <div>
    <v-container>
      <v-btn  @click="get_item_all()">История заявок</v-btn>
      <v-row>
      <v-col cols="12" sm="6" md="4" v-for="item in orders" :key="item.id">
        <v-card class="mx-auto" raised>
          <v-list-item three-line>
            <div class="card-icon" style="background: #3F51B5;box-shadow: 0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(30, 68, 233, 0.4);
                border-radius: 3px;
                background-color: #3F51B5;
                color:white;
                padding: 15px;
                margin-top: -20px;
                margin-right: 15px;
                float: left;">
            <h3 style="text-align: center; margin: 0px;">{{ item.date_start.substr(8, 2) }}</h3>
            <h4 style="text-align: center; margin: 0px;">{{ item.date_start.substr(5, 2) + "/" + item.date_start.substr(0, 4) }}</h4>
            <h3 style="text-align: center; margin: 0px;">{{ item.date_start.substr(11, 5) }}</h3>
            </div>
            <v-list-item-content>
              <div class="caption mb-4">Заказ №{{ item.id }}</div>
              <v-list-item-title class="headline mb-1" style="color:#FF7311;">Услуги грузчиков</v-list-item-title>
              <v-list-item-subtitle>Тариф рабочего {{ item.tariff_worker }} руб/час</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <div>Описание заказа</div>
            <p class="body-1 text--primary">
             {{ item.description }} 
            </p>
            
            <div>Адрес заказа</div>
            <p class="body-1 text--primary">
              {{ item.address }} 
            </p>

            <div>Количество рабочих требуется</div>
            <p class="body-1 text--primary">
              {{ item.count_worker }} 
            </p>

            <div>Количество рабочих найдено</div>
            <p class="body-1 text--primary">
              {{ item.count_number_worker }} 
            </p>
            <div>Статус заявки</div>
            <p class="body-1 text--primary">
              {{ item.status_text }} 
            </p>  
          </v-card-text>
        </v-card>
        
      </v-col>
      
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
      
    </v-row>
    </v-container>
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
      count_number_worker_edit: "1",
      email: "1"
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
      { text: 'Дата регистрации', value: 'date_from' },
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

    optionsCountWorkers: [
      { text: '1 Рабочий', value: '1', disabled : false }
    ],
    optionsCountWorkersEmpty: [
      { text: '1 Рабочий', value: '1', disabled : false },
      { text: '2 Рабочего', value: '2', disabled : false },
      { text: '3 Рабочего', value: '3', disabled : false },
      { text: '4 Рабочего', value: '4', disabled : false },
      { text: '5 Рабочего', value: '5', disabled : false },
      { text: '6 Рабочих', value: '6', disabled : false },
      { text: '7 Рабочих', value: '7', disabled : false },
      { text: '8 Рабочих', value: '8', disabled : false },
      { text: '9 Рабочих', value: '9', disabled : false },
      { text: '10 Рабочих', value: '10', disabled : false }
    ],
    postItem: {
      email: '', 
    },
    orders: [],
    workers: [],
    workers2: [],
   }),

  created () {
    //this.initialize()
    this.get_glossary_status(this.glossary_status)
    this.get_glossary_topic(this.glossary_topic)
    this.get_item_all()
    
    //this.auth_email = 'isupergeneral@gmail.com'
    this.auth_email = localStorage.email
    this.postItem.email = this.auth_email
  },

  methods: {

    get_workerorder_add(itemPost){
      
      axios.post('https://prowork.by/api_client/get_workerorder_add.php', itemPost, this.config)
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
           .post('https://prowork.by/api_client/get_all_workerordershistory.php', this.postItem, this.config)
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

   
    addWorkerToOrderItem (item) {
      //this.editedIndex = this.orders.indexOf(item)
      //this.editedItem = Object.assign({}, item)
      
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.itemAddWorkerToOrder.order_id = this.editedItem.id
      this.dialogAddWorkerToOrder = true
    },

    editItem (item) {
      
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.count_number_worker_edit = "1"
      //this.editedItem.count_number_worker_edit = "1"
      this.optionsCountWorkers = [
      { text: '1 Рабочий', value: '1' },
      { text: '2 Рабочего', value: '2' },
      { text: '3 Рабочего', value: '3' },
      { text: '4 Рабочего', value: '4' },
      { text: '5 Рабочего', value: '5' },
      { text: '6 Рабочих', value: '6' },
      { text: '7 Рабочих', value: '7' },
      { text: '8 Рабочих', value: '8' },
      { text: '9 Рабочих', value: '9' },
      { text: '10 Рабочих', value: '10' }
    ]
      this.optionsCountWorkers.splice((this.editedItem.count_worker - this.editedItem.count_number_worker), 10)

      this.dialogorder = true
    },

    editOrder(itemUpdate) {
      itemUpdate.email = this.auth_email
      this.get_workerorder_add(itemUpdate);
      this.dialogorder = false
    },

  },
}
</script>