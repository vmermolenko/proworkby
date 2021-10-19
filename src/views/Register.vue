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
                <v-toolbar-title>Регистрация</v-toolbar-title>
                
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Name"
                    name="text"
                    prepend-icon="mdi-account-edit"
                    type="text"
                    v-model="name"
                  />
                  <v-text-field
                    label="Email"
                    name="Email"
                    prepend-icon="mdi-email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="submitHandler()">Зарегистрироваться</v-btn>                
              </v-card-actions>
               <v-card-actions class="justify-center">
                <p>Есть аккаунт? <router-link color="primary" to="/login">Войти</router-link> </p>
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
    props: {
      source: String,
    },
    name: 'register',
    data: () => ({
      email: '',
      password: '',
      name: '',
      emailRules: [
        v => !!v || 'Введите E-mail ',
        v => /.+@.+/.test(v) || 'E-mail не корректно введен',
      ],
    }),
    methods: {
      async submitHandler() {
        const formData = {
          email: this.email,
          password: this.password,
          name: this.name
        }

        try {
          await this.$store.dispatch('register', formData)
          //this.$router.push('/')
          this.$router.push({ path: '/' })
        } catch (e) {
          alert(e)
        }
      }
    }
  }

</script>