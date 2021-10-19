<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">OVERLINE</div>
              <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
              <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">OVERLINE</div>
              <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
              <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">OVERLINE</div>
              <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
              <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" max-width="344" raised>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">OVERLINE</div>
              <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
              <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-sparkline
          :value="arrvalue"
          :gradient="gradient"
          :smooth="radius || false"
          :padding="padding"
          :line-width="lineWidth"
          :stroke-linecap="lineCap"
          :gradient-direction="gradientDirection"
          :fill="fill"
          :type="type"
          :auto-line-width="autoLineWidth"
          auto-draw
          :show-labels="showLabels"
          :label-size="labelSize"
          :labels="labels"
        ></v-sparkline>
        <v-divider></v-divider>
        <v-col cols="12">
        <v-row class="fill-height" align="center">
          <v-subheader class="pl-0">Type</v-subheader>
          <v-btn-toggle v-model="type" mandatory>
            <v-btn small text value="bar">bar</v-btn>
            <v-btn small text value="trend">trend</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row class="fill-height" align="center">
          <v-subheader class="pl-0">Gradient</v-subheader>
          <v-item-group v-model="gradient" mandatory>
            <v-row>
              <v-item
                v-for="(gradient, i) in gradients"
                :key="i"
                v-slot:default="{ active, toggle }"
                :value="gradient"
              >
                <v-card
                  :style="{
                    background: gradient.length > 1
                      ? `linear-gradient(0deg, ${gradient})`
                      : gradient[0],
                    border: '2px solid',
                    borderColor: active ? '#222' : 'white'
                  }"
                  width="30"
                  height="30"
                  class="mr-2"
                  @click.native="toggle"
                ></v-card>
              </v-item>
            </v-row>
          </v-item-group>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row class="fill-height" align="center">
          <v-subheader class="pl-0">Gradient direction</v-subheader>
          <v-btn-toggle v-model="gradientDirection" mandatory>
            <v-btn small text value="top">top</v-btn>
            <v-btn small text value="right">right</v-btn>
            <v-btn small text value="left">left</v-btn>
            <v-btn small text value="bottom">bottom</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-slider
          v-model="lineWidth"
          label="Line width"
          min="0.1"
          max="10"
          step="0.1"
          thumb-label
          :disabled="autoLineWidth"
        ></v-slider>
      </v-col>

      <v-col cols="12">
        <v-slider
          v-model="radius"
          label="Radius"
          min="0"
          max="16"
          thumb-label
        ></v-slider>
      </v-col>

      <v-col cols="12">
        <v-slider
          v-model="padding"
          label="Padding"
          min="0"
          max="16"
          thumb-label
        ></v-slider>
      </v-col>

      <v-col cols="6">
        <v-row class="fill-height" align="center">
          <v-subheader class="pl-0">Linecap</v-subheader>
          <v-btn-toggle v-model="lineCap" mandatory :disabled="type !== 'trend'">
            <v-btn small text value="butt">butt</v-btn>
            <v-btn small text value="round">round</v-btn>
            <v-btn small text value="square">square</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-col>

      <v-col cols="6">
        <v-row justify="space-around">
          <v-switch v-model="showLabels" label="Show labels"></v-switch>
          <v-switch v-model="fill" label="Fill" :disabled="type !== 'trend'"></v-switch>
          <v-switch v-model="autoLineWidth" label="Auto-line-width" :disabled="type !== 'bar'"></v-switch>
        </v-row>
      </v-col>

      <v-col v-if="showLabels" cols="12">
        <v-slider
          v-model="labelSize"
          label="Label size"
          min="1"
          max="20"
          thumb-label
        ></v-slider>
      </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
export default {
    data: () => ({
      showLabels: true,
      lineWidth: 10,
      labelSize: 3,
      radius: 0,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      arrvalue: [0, 0, 0, 3, 5, 14, 10, 11],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'bar',
      autoLineWidth: false,
      labels: [
        'Регистрация',
        'Регистрация',
        'Регистрация',
        'Регистрация',
        'Регистрация',
        'Регистрация',
        'Регистрация',
        'Регистрация',
      ],
      glossary_status: {
        id: 1
      },
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
      responsepost: '',
      errorpost: '',

    }),

    created(){
      //this.labels[0] = "Регистрация " + this.arrvalue[0];
      this.get_glossary_status(this.glossary_status);

    },

    methods: {
      get_glossary_status(itemPost){
        
        axios.post('https://prowork.by/api_client/get_glossary.php', itemPost, this.config)
            .then(responsepost => { (this.order_status = responsepost.data);
            })
            .catch(err =>  (this.errorpost = err))
            .finally(() => (null));  


        //alert(this.order_status[0].name)
        for (var i = 0; i < this.labels.length; i++) {
          this.labels[i] = this.order_status[i].name.toString() + ": " + this.arrvalue[i].toString();
        }  

        //this.labels[3] = this.order_status[3].name + ": " + this.arrvalue[3];
      }
    }
  }
</script>
