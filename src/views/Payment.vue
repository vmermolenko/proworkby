<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="payment_clients"
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
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Расчет с клиентами</v-btn></v-toolbar-title>
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
                  <span class="headline">Установить оплату {{editedItem.id}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="editedItem.out_payin" label="Сумма оплаты" type="number"></v-text-field>
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
             <v-btn small color="primary" @click="payment_client_id(item)">Обновить {{item.id}}</v-btn>
             -->
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">id</th>
                      <th class="text-left">Дата</th>
                      <th class="text-left">id Клиента</th>
                      <th class="text-left">id Заказа</th>
                      <th class="text-left">Долг</th>
                      <th class="text-left">Оплата</th>
                      <th class="text-left">Номер документа оплаты</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="client_history in payment_client_history" :key="client_history.id">
                      <td>{{ client_history.id }}</td>
                      <td>{{ client_history.date_from }}</td>
                      <td>{{ client_history.id_client }}</td>
                      <td>{{ client_history.id_order }}</td>
                      <td>{{ client_history.debt }}</td>
                      <td>{{ client_history.payin }}</td>
                      <td>{{ client_history.num_document }}</td>
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
      out_payin: '',
      out_num_document:''
    },
    newItem: {
      id: 0,
      out_payin: '',
      out_num_document:''
    },
    editedItem: {
      id: 0,
      out_payin: '',
      out_num_document:''
    },
    headers: [
      {
        text: 'id ',
        align: 'left',
        sortable: true,
        value: 'id',
      },
      { text: 'Долг', value: 'sum_debt' },
      { text: 'Оплата', value: 'sum_payin' },
      { text: 'Остаток долга', value: 'sum_total_debt' },

      { text: 'Действие', value: 'action', sortable: false }
    ],
    payment_clients: [],
    payment_client_history: [],
   }),

  computed: {

  },

  created () {
    this.get_item_all()
  },

  methods: {
    
    async get_item_all(){
      axios
           .get('https://prowork.by/api_client/get_all_payment_client.php')
           .then(response => (this.payment_clients = response.data))
           .finally(() => (this.loading = false));
           
    },
    async payment_client_id (itemPost) {
      this.payment_client_history = null;
      axios.post('https://prowork.by/api_client/post_payment_client_id.php', itemPost, this.config)
           .then(responsepost => { (this.payment_client_history = responsepost.data); })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    async set_item_insert (itemPost) {
      axios.post('https://prowork.by/api_client/post_payment_client_insert.php', itemPost, this.config)
           .then(responsepost => { (this.info = responsepost.data); this.get_item_all(); this.editedItem = this.emptyItem; })
           .catch(err =>  (this.errorpost = err))
           .finally(() => (null));
    },

    initialize () {
      this.get_item_all()
    },

    editItem (item) {
      this.editedItem.id = item.id;
      //this.editedIndex = this.payment_clients.indexOf(item)
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
      this.payment_client_id(item)
    }

  },
}
</script>