<template>
  <div class="ma-4">
     <v-card class="mx-auto" raised>
      <v-data-table 
        :loading="loading" 
        :headers="headers"
        :items="calculations"
        sort-by="id desc"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title ><v-btn  text @click="get_item_all()">Расчет сумм</v-btn></v-toolbar-title>
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
              <v-card>
                <v-card-title>
                  <span class="headline">Утвердить расчет сумм заказа №{{ editedItem.id_order }}</span>
                </v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
                  <v-btn color="blue darken-1" text @click="save()">Утвердить</v-btn>
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

    headers: [
      {
        text: 'id',
        align: 'left',
        sortable: true,
        value: 'id_order',
      },
      { text: 'Id рабочего', value: 'id_worker' },
      { text: 'Число рабочих', value: 'number_worker' },
      { text: 'Время работы, час', value: 'work_time' },
      
      { text: 'Тариф рабочего, руб/час', value: 'tariff_worker' },
      { text: 'Заработок, руб.', value: 'income' },
      { text: 'Налог, %', value: 'incometax' },
      { text: 'Налог, руб.', value: 'incometaxmoney' },
      { text: 'Выплата + налог, руб.', value: 'payoff' },
      { text: 'Тариф заказа, руб/час', value: 'tariff_order' },

      { text: 'Время работы общее', value: 'sum_work_time' },
      { text: 'К оплате Заказчику общее, руб', value: 'to_pay' },
      { text: 'Итого себестоимость общее, руб.', value: 'total_cost' },
      { text: 'Суммарная прибыль общее, руб.', value: 'total_profit' },
      { text: 'Действие', value: 'action', sortable: false },
    ],
    calculations: [],
    editedIndex: -1,
    editedItem: {
      id_order: 0,
      id_worker: 0,
      number_worker: 0,
      work_time: 0,
      tariff_worker: 0,
      income: 0,
      incometax: "13%",
      incometaxmoney: 0,
      payoff: 0,
      tariff_order: 0,
      sum_work_time: 0,
      total_cost: 0,
      to_pay: 0,
      total_profit: 0
    },
    defaultItem: {
      id_order: 0,
      id_worker: 0,
      number_worker: 0,
      work_time: 0,
      tariff_worker: 0,
      income: 0,
      incometax: "13%",
      incometaxmoney: 0,
      payoff: 0,
      tariff_order: 0,
      sum_work_time: 0,
      total_cost: 0,
      to_pay: 0,
      total_profit: 0
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
           .get('https://prowork.by/api_client/get_all_calculation.php')
           .then(response => (this.calculations = response.data))
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
      axios.post('https://prowork.by/api_client/post_calculation_update.php', itemPost, this.config)
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
      this.calculations = []
    },

    editItem (item) {
      this.editedIndex = this.calculations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      if (confirm('Are you sure you want to delete this item?') )
      {
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
      //alert(this.editedItem.id_order);
      this.set_item_update(this.editedItem);
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