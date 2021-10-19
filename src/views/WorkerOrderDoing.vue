<template>
  <div>
    <v-container>
      <v-btn @click="get_item_all()">Заявки в работе</v-btn>
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
            <div>Имя клиента</div>
            <p class="body-1 text--primary">
              {{ item.name }} 
            </p>
            <div>Телефон клиента</div>
            <p class="body-1 text--primary">
              {{ item.phone }} 
            </p>
            <div>Статус заявки</div>
            <p class="body-1 text--primary">
              {{ item.status_text }} 
            </p>  
            <v-btn block color="secondary" @click="openlistWorkerItem(item)" >Список работников</v-btn>
          </v-card-text>

          <v-card-actions>
            <v-btn color="warning" @click="openRefuseWorkerItem(item)" >
              <v-icon dark>mdi-alert-outline</v-icon>
              Отказаться
              </v-btn>
            <v-spacer />
            <v-btn color="success" @click="openCompleteWorkerItem(item)" >
              <v-icon dark>mdi-check</v-icon>
              Выполнить
              </v-btn>
          </v-card-actions>
        </v-card>
        
      </v-col>
      
      <v-dialog v-model="dialogList" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Заказ №{{ this.postItem.id }}</span>
            <v-list-item-title class="subtitle-1" >Список работников</v-list-item-title>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <!-- th class="text-left">id Рабочего</th -->
                        <th class="text-left">Имя</th>
                        <th class="text-left">Телефон</th>
                        <th class="text-left">Число рабочих</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="worker in workers" :key="worker.id_worker">
                        <!-- td>{{ worker.id_worker }}</td -->
                        <td>{{ worker.name_company }}</td>
                        <td>{{ worker.phone }}</td>
                        <td>{{ worker.number_worker }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogList = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogRefuse" max-width="500px">
        <v-card >
          <v-card-title>
            <span class="headline">Заказа №{{ this.postItem.id }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <span class="headline">Отказаться от выполнения заказа №{{ this.postItem.id }}</span>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogRefuse = false">Отмена</v-btn>
            <v-btn color="warning" @click="refuseWorkerItem()">
              <v-icon dark>mdi-alert-outline</v-icon>
              Отказаться
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogComplete" max-width="500px">
        <v-card >
          <v-card-title>
            <span class="headline">Завершение заказа №{{ this.postItem.id }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <span class="headline">Выполнить заказ №{{ this.postItem.id }}?</span>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogComplete = false">Отмена</v-btn>
            <v-btn color="success" @click="completeWorkerItem()">
              <v-icon dark>mdi-check</v-icon>
              Выполнить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialoginfo" max-width="500px">
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

    dialogList: false,
    dialogRefuse: false,
    dialogComplete: false,
    dialoginfo: false,
    info: null,
    auth_email: '',

    responsepost: '',
    errorpost: '',
        
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

    orders: [],
    workers:[],
    postItem: {
      id: 1,
      email: '', 
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
   }),

  created () {
    
    //this.auth_email = 'isupergeneral@gmail.com'
    this.auth_email = localStorage.email
    this.postItem.email = this.auth_email
    this.get_item_all()
  },

  methods: {

    async get_item_all(){
      axios.post('https://prowork.by/api_client/get_all_workerordersdoing.php', this.postItem, this.config)
           .then(response => (this.orders = response.data))
           .finally(() => (null));
           
    },

    async listWorkerItem(itemPost) {
      this.workers = null;
      
      axios.post('https://prowork.by/api_client/post_worker_time_orders_id.php', itemPost, this.config)
           .then(responsepost => { (this.listworkers = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.get_item_all()));
      
    },

    async refuseWorkerItem() {
      this.workers = null;
      this.dialogRefuse = false
      axios.post('https://prowork.by/api_client/post_workerordersdoing_refuse.php', this.postItem , this.config)
           .then(responsepost => { 
              this.info = responsepost.data; 
              //this.get_item_all();
              this.dialoginfo = true;
              })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.get_item_all()));
    },

    async completeWorkerItem() {
      this.workers = null;
      this.dialogComplete = false
      axios.post('https://prowork.by/api_client/post_workerordersdoing_complete.php',  this.postItem, this.config)
           .then(responsepost => { 
              this.info = responsepost.data; 
              //this.get_item_all();
              this.dialoginfo = true;
           })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (this.get_item_all()));
      
    },

    async listworker_by_orders_id (itemPost) {
      this.workers = null;
      axios.post('https://prowork.by/api_client/post_workerordersdoing_by_orders_id.php', itemPost, this.config)
           .then(responsepost => { (this.workers = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));

    },

    openlistWorkerItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogList = true
      
      this.postItem.id = this.editedItem.id
      this.listworker_by_orders_id(this.postItem)
    },

    openRefuseWorkerItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogRefuse = true

      this.postItem.id = this.editedItem.id
    },

    openCompleteWorkerItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogComplete = true
      
      this.postItem.id = this.editedItem.id
    },
  },
}
</script>