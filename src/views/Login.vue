<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Вход</v-toolbar-title>
                
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                  />

                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="submitHandler()">Войти</v-btn>
              </v-card-actions>
              <v-card-actions class="justify-center">
                <p>Нет аккаунта? <router-link color="primary" to="/registration">Зарегистрироваться</router-link></p>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      email: '', 
      password: '',
      emailRules: [
        v => !!v || 'Введите email ',
        v => /.+@.+/.test(v) || 'email не корректно введен',
      ],
    }),
    props: {
      source: String,
    },
    
    methods: {
      async submitHandler(){
        const formData = {
          email: this.email,
          password: this.password
        }

        try {
          await this.$store.dispatch('login', formData)
          //alert('push')
          //this.$route.push('/')
          this.$router.push({ path: '/workerdashboard' })
        }catch(e){
          this.$router.push({ path: '/login' })
          await this.$store.dispatch('loguot')
          //alert('loguot')
          throw e
        }
      }
    }
  }
</script>