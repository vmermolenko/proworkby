<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="payment_workers"
        sort-by="id asc"
        class="elevation-1"
        :search="search"
        show-expand
        :single-expand="true"
        :dense="dense"

        @item-expanded="loadDetails"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Выплата рабочим</v-btn></v-toolbar-title>
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
            <v-dialog v-model="dialogEdit" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Установить выплату {{editedItem.id}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.out_sum_payoff" label="Сумма выплаты" type="number"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.out_num_document" label="Номер документа"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEditItem()">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="editItemInsert(editedItem)">Сохранить</v-btn>
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
            mdi-arrow-down-thick
          </v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Обновить</v-btn>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
              <!--
              <v-btn small color="primary" @click="payment_worker_id(item)">Обновить {{item.id}}</v-btn>
              -->
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">id</th>
                      <th class="text-left">Дата</th>
                      <th class="text-left">id Рабочего</th>
                      <th class="text-left">id Заказа</th>
                      <th class="text-left">Заработок</th>
                      <th class="text-left">Выплата</th>
                      <th class="text-left">Номер документа выплаты</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="worker_history in payment_worker_history" :key="worker_history.id">
                      <td>{{ worker_history.id }}</td>
                      <td>{{ worker_history.date_from }}</td>
                      <td>{{ worker_history.id_worker }}</td>
                      <td>{{ worker_history.id_order }}</td>
                      <td>{{ worker_history.income }}</td>
                      <td>{{ worker_history.payoff }}</td>
                      <td>{{ worker_history.num_document }}</td>
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

    dense: false,
    itemsave: null,
    dialoginfo: false,
    info: null,
    responsepost: '',
    errorpost: '',
    search: '',
    loading: true,

    dialogEdit: false,
    date1: new Date().toISOString().substr(0, 10),
    editedIndex: -1,

    emptyItem: {
      id: 0,
      out_sum_payoff: '',
      out_num_document:''
    },
    newItem: {
      id: 0,
      out_sum_payoff: '',
      out_num_document:''
    },
    editedItem: {
      id: 0,
      out_sum_payoff: '',
      out_num_document:''
    },
    headers: [
      {
        text: 'id ',
        align: 'left',
        sortable: true,
        value: 'id',
      },
      { text: 'Заработок', value: 'sum_income' },
      { text: 'Выплата', value: 'sum_payoff' },
      { text: 'Остаток выплаты', value: 'sum_total_income' },

      { text: 'Действие', value: 'action', sortable: false }
    ],
    payment_workers: [],
    payment_worker_history: [],
   }),

  computed: {

  },

  created () {
    this.get_item_all()
  },

  methods: {
    
    async get_item_all(){
      axios
           .get('https://prowork.by/api_client/get_all_payment_worker.php')
           .then(response => (this.payment_workers = response.data))
           .finally(() => (this.loading = false));
           
    },
    async payment_worker_id (itemPost) {
      this.payment_worker_history = null;
      axios.post('https://prowork.by/api_client/post_payment_worker_id.php', itemPost, this.config)
           .then(responsepost => { (this.payment_worker_history = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    async set_item_insert (itemPost) {
      axios.post('https://prowork.by/api_client/post_payment_worker_insert.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.editedItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    initialize () {
      this.get_item_all()
    },

    editItem (item) {
      this.editedItem.id = item.id;
      //this.editedIndex = this.payment_workers.indexOf(item)
      //this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },

    closeEditItem () {
      this.dialogEdit = false
    },

    editItemInsert(itemUpdate) {
      this.set_item_insert(itemUpdate);
      this.dialogEdit = false
    },

    loadDetails({item}) {
      //alert('loadDetails' + item.id)
      this.payment_worker_id(item)
    }

  },
}
</script>