<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link v-for="link in links " :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Prowork</v-toolbar-title>

      <v-spacer />

      <!--
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>

      <div class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-badge
                    color="red"
                    content="6"
                    offset-x="10"
                    offset-y="10"
                    >
                    <v-icon>mdi-bell</v-icon>
                  </v-badge>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
      </div>

      <v-btn icon large @click="testDB()">
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify"
          /></v-avatar>
      </v-btn>

      -->
      <v-btn icon to="/login">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>

    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  config: {
      headers: {
        'Content-Type': 'text/json'
      }
    },
  name: 'App',
  props: {
      source: String,
    },
  data: () => ({
    drawer: null,
    links : [
              { icon : 'mdi-view-dashboard', title : 'Главная', route : '/workerdashboard' },
              { icon : 'mdi-format-list-bulleted-square', title : 'Все заявки', route : '/workerorderall' },
              { icon : 'mdi-briefcase-outline', title : 'Заявки в работе', route : '/workerorderdoing' },
              { icon : 'mdi-history', title : 'История', route : '/workerorderhistory' },
              { icon : 'mdi-exit-to-app', title : 'Выйти', route : '/login' }

    ],
    items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    postItem: {
      email: ''
    },
    admindata:{
      access: '0'
    },
    errorpost: '',
  }),

  created () {
    this.postItem.email = localStorage.email
    this.post_admin_access()     
  },
  methods: {
      set_links(){
        //alert('set_links ' + localStorage.email)
       
        if (this.admindata.access == '1') {
          this.links = [
                        // { icon : 'mdi-view-dashboard', title : 'Главная', route : '/dashboard' },
                        { icon : 'mdi-format-list-bulleted-square', title : 'Заказы', route : '/order' },
                        { icon : 'mdi-account-group', title : 'Рабочие', route : '/worker' },
                        { icon : 'mdi-account-tie', title : 'Клиенты', route : '/client' },
                        { icon : 'mdi-calculator', title : 'Рассчет сумм', route : '/calculation' },
                        { icon : 'mdi-credit-card-outline', title : 'Выплаты', route : '/payoff' },
                        { icon : 'mdi-currency-usd', title : 'Платежи', route : '/payment' },
                        { icon : 'mdi-view-dashboard', title : 'Главная', route : '/workerdashboard' },
                        { icon : 'mdi-format-list-bulleted-square', title : 'Все заявки', route : '/workerorderall' },
                        { icon : 'mdi-briefcase-outline', title : 'Заявки в работе', route : '/workerorderdoing' },
                        { icon : 'mdi-history', title : 'История', route : '/workerorderhistory' },
                        //{ icon : 'mdi-exit-to-app', title : 'Cайт', route : '/default' },
                        //{ icon : 'mdi-exit-to-app', title : 'Регистрация', route : '/registration' },
                        { icon : 'mdi-exit-to-app', title : 'Выйти', route : '/login' },
                        
                      ]
        }
      },
      async post_admin_access(){
        //alert('post_admin_access')
        await axios
          .post('https://prowork.by/api_client/post_admin_access.php', this.postItem, this.config)
          .then(response => {(this.admindata.access = response.data[0].access); this.set_links() } )
          .catch(err =>  (this.errorpost = err))           
      },
    }
    
};
</script>
