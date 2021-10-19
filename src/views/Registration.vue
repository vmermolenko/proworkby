<template>
  <v-container>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Общие данные</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">Правовой статус</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Реквизиты</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field v-model="newItem.name_company" label="Имя компании"
                  prepend-icon="mdi-domain"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field v-model="newItem.middlename" label="Фамилия"
                  prepend-icon="mdi-pencil"
                  :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field v-model="newItem.firstname" label="Имя"
                  prepend-icon="mdi-pencil"
                  :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field v-model="newItem.lastname" label="Отчество"
                  prepend-icon="mdi-pencil"
                  :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field v-model="newItem.phone" 
                  label="Телефон"
                  prepend-icon="mdi-phone"
                  v-mask="`+375(##) ###-##-##`"
                  :rules="phoneRules"
                  type="tel"
                  placeholder="+375(##) ###-##-##"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field 
                  v-model="newItem.email" 
                  type="email"
                  prepend-icon="mdi-email"
                  label="Почта" 
                  :rules="emailRules">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field 
                  v-model="newItem.password" 
                  label="Пароль"
                  type="password"
                  prepend-icon="mdi-lock"
                  :rules="passwordRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-spacer />
                <v-btn text to="/login">Вернуться</v-btn>
                <v-btn color="primary" @click="validateStep()">Далее</v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-container>
            <v-row>
              <v-col cols="12" sm="4" md="4" >
                <v-card  :color="colors.fiz" class="mb-12" height="200" align="center" @click="changeworker_type(1)">
                  <v-icon dark size="200"  >mdi-account</v-icon>
                  <p class="text-center">Физическое лицо</p>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-card :color="colors.ip" class="mb-12" height="200" align="center"  @click="changeworker_type(2)">
                  <v-icon dark size="200" >mdi-account-tie</v-icon>
                  <p class="text-center">Индивидуальный предприниматель</p>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4" md="4" >
                <v-card :color="colors.org" class="mb-12" height="200" align="center" @click="changeworker_type(3)">
                  <v-icon dark size="200" >mdi-account-group</v-icon>
                  <p class="text-center">Организация</p>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer />
              <v-btn text  @click="e1 = 1">Назад</v-btn>
              <v-btn color="primary" @click="e1 = 3">Далее</v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-container>
            <v-row v-if="newItem.worker_type === 1">
              <v-col cols="12" sm="12" md="12">
                <h3 class="text-center" style="font-weight: bold;">Физическое лицо</h3>
                <b>Получите статус самозанятого</b> <br />
                <p>Направьте письменное уведомление в налоговую инспекцию по месту регистрации. В нем укажите:<br />
                Вид деятельности: погрузка и разгрузка грузов.
                Период, в течение которого вы собираетесь эту деятельность осуществлять: 1 месяц, несколько месяцев, 1 год.
                Место осуществления деятельности: город Минск.
                Уплатите Единый налог.Единый налог через ЕРИП в размере 6 руб/месяц.
                Прикрепите ксерокопию, скриншот либо фото квитанции об оплате налога.
                Заполнить форму ниже.
                Подождать 20 минут проверки.
                </p>
                <ol>
                    <li>Вид деятельности: погрузка и разгрузка грузов.</li>
                    <li>Период, в течение которого вы собираетесь эту деятельность осуществлять: 1 месяц, несколько месяцев, 1 год.</li>
                    <li>Место осуществления деятельности: город Минск.</li>
                    <li>Уплатите Единый налог.Единый налог через ЕРИП в размере 6 руб/месяц.</li>
                    <li>Прикрепите ксерокопию, скриншот либо фото квитанции об оплате налога.</li>
                    <li>Заполнить форму ниже.</li>
                    <li>Подождать 20 минут проверки.</li>
                  </ol>
                <b>Для регистрации нужно ввести номер карты, приложить паспорт, и чек оплаты самозанятого</b>
                <br />
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.creditcard" 
                label="Номер банковской карты"
                prepend-icon="mdi-credit-card"
                v-mask="'#### #### #### ####'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Выберите паспорт"
                  prepend-icon="mdi-camera"
                  label="Паспорт"
                  v-model="newItem.filepassport"
                  >
                </v-file-input>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Выберите чек оплаты"
                  prepend-icon="mdi-camera"
                  label="Чек оплаты"
                  v-model="newItem.filebill"
                  >
                </v-file-input>
              </v-col>
            </v-row>
            <v-row v-if="newItem.worker_type === 2">
              <v-col cols="12" sm="12" md="12">
                <h3 class="text-center" style="font-weight: bold;">Индивидуальный предприниматель</h3>
                <b>Приложите свои документы для модерации</b> <br />
                <p>Укажите данные и файлы картинки</p>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.unp_ip" 
                label="УНП"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.bankpa_ip" 
                label="Расчетный счёт"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.bankbik_ip" 
                label="БИК банка"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Выберите паспорт"
                  prepend-icon="mdi-camera"
                  label="Паспорт"
                  v-model="newItem.filepassport"
                  >
                </v-file-input>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Выберите Свидетельство ИП"
                  prepend-icon="mdi-camera"
                  label="Свидетельство ИП"
                  v-model="newItem.filecertificate_ip"
                  >
                </v-file-input>
              </v-col>
            </v-row>
            <v-row v-if="newItem.worker_type === 3">
              <v-col cols="12" sm="12" md="12">
                <h3 class="text-center" style="font-weight: bold;">Организация</h3>
                <b>Приложите свои документы для модерации</b> <br />
                <p>Укажите данные и файлы картинки</p>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.unp_org" 
                label="УНП"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.bankpa_org" 
                label="Расчетный счёт"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="newItem.bankbik_org" 
                label="БИК банка"
                prepend-icon="mdi-pencil"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Выберите Свидетельтво организации"
                  prepend-icon="mdi-camera"
                  label="Свидетельтво организации"
                  v-model="newItem.filecertificate_org"
                  >
                </v-file-input>
              </v-col>            
            </v-row>
            <v-row >
              <v-spacer />
              <div class="justify-center" style="display: inline-block;">
              <v-checkbox
                v-model="checkbox"
                :label="`Я согласен с договором`"
                :rules="[v => !!v || 'Вы должны согласится с договором!']"
              ></v-checkbox>
              <a href="https://prowork.by/dogovor_prowork.docx">Публичные договоры</a>
              </div>
            </v-row>
            <v-row>
              <v-spacer />
              <v-btn text  @click="e1 = 2">Назад</v-btn>
              <v-btn color="primary"  @click="uploadAvatar();">Завершить</v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
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
      lazy: false,
      checkbox: false,
      valid: true,
      e1: 1,
      newItem: {
        name_company:'',
        middlename:'',
        firstname:'',
        lastname:'',
        phone:'',
        email:'',
        password:'',

        worker_type: 1,
        
        creditcard:'',
        filepassport:[],
        filebill:[],

        unp_ip:'',
        bankpa_ip:'',
        bankbik_ip:'',
        filecertificate_ip:[],

        unp_org:'',
        bankpa_org:'',
        bankbik_org:'',
        filecertificate_org:[],
        uid: "",
      },
      colors:{
        fiz:'primary lighten-1',
        ip: 'grey lighten-1',
        org: 'grey lighten-1',
      },
      emailRules: [
        v => !!v || 'Введите E-mail ',
        v => /.+@.+/.test(v) || 'E-mail не корректно введен',
      ],
      nameRules: [
        v => !!v || 'Обязательное поле для заполнения',
        v => (v && v.length >= 2) || 'Не менее 2 символов',
        v => (v && v.length <= 100) || 'Не более 100 символов',
      ],
      phoneRules: [
        v => !!v || 'Обязательное поле для заполнения',
        v => (v && v.length >= 18) || 'Укажите номер'
      ],
      passwordRules: [
        v => !!v || 'Обязательное поле для заполнения',
        v => (v && v.length >= 6) || 'Не менее 6 символов',
        v => (v && v.length <= 100) || 'Не более 100 символов',
      ],
    }),
    methods: {
        validateStep(){
          this.$refs.form.validate()

          if (this.valid === true){
            this.e1 = 2
          } else {
            alert('Заполните обязательные поля')
          }
        },
        changeworker_type(num){
          this.newItem.worker_type = num
          this.colors.fiz = 'grey lighten-1'
          this.colors.ip =  'grey lighten-1'
          this.colors.org = 'grey lighten-1'
          this.e1 = 3

          switch (num) {
            case 1:
              this.colors.fiz = 'primary lighten-1'
              break;
            case 2:
               this.colors.ip = 'primary lighten-1'
              break;
            case 3:
              this.colors.org = 'primary lighten-1'
              break;
          }
        },
        async uploadAvatar(){

          if (this.checkbox === false){
            alert("Вы не подтвердили согласие с условиями договора");
            return;
          } 

          const formData2 = {
            email: this.newItem.email,
            password: this.newItem.password,
            name: this.newItem.middlename            
          };

          try {
            await this.$store.dispatch('register', formData2)
            
          } catch (e) {
            alert(e)
            return;
          }

          this.newItem.uid = localStorage.uid

          let formData = new FormData();

          formData.append("name_company", this.newItem.name_company);
          formData.append("middlename", this.newItem.middlename);
          formData.append("firstname", this.newItem.firstname);
          formData.append("lastname", this.newItem.lastname);
          formData.append("phone", this.newItem.phone);
          formData.append("email", this.newItem.email);
          formData.append("password", this.newItem.password);
          
          formData.append("worker_type", this.newItem.worker_type);

          formData.append("creditcard", this.newItem.creditcard);
          formData.append("filepassport", this.newItem.filepassport);
          formData.append("filebill", this.newItem.filebill);

          formData.append("unp_ip", this.newItem.unp_ip);
          formData.append("bankpa_ip", this.newItem.bankpa_ip);
          formData.append("bankbik_ip", this.newItem.bankbik_ip);
          //formData.append("filepassport_ip", this.newItem.filepassport_ip);
          formData.append("filecertificate_ip", this.newItem.filecertificate_ip);

          formData.append("unp_org", this.newItem.unp_org);
          formData.append("bankpa_org", this.newItem.bankpa_org);
          formData.append("bankbik_org", this.newItem.bankbik_org);
          formData.append("filecertificate_org", this.newItem.filecertificate_org); 
          formData.append("uid", this.newItem.uid);   

          /*
            Make the request to the POST /single-file URL
          */
          axios.post("https://prowork.by/api_client/api_file_registration.php", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(function() {
            //this.get_item_all();
              alert("Регистрация завершена!");
              
          })
          .catch(function() {
            alert("Ошибка регистрации");
            //this.get_item_all();
          });

          this.$router.push({ path: '/login' })
        },
    }
  }
</script>

