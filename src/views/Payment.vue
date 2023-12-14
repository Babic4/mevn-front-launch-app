<template lang="">
  <div class="middle">
    <h2>Оплата</h2>
    <div
      class="box-top"
      :class="{ success: status == 'success', error: status == 'error' }"
      v-if="status"
    >
      <span v-for="error in errors" :key="error.key">{{ error }}</span>
    </div>
    <div class="payment-box">
      <div class="info-box">
        <div class="info-payment">
          В настоящее время мы не будем взимать с Вас плату. Если проект
          достигнет своей цели по финансированию, Ваш способ оплаты будет списан
          после завершения кампании. Когда Ваше обещание будет успешно
          обработано, Вы получите электронное письмо с подтверждением на адрес
          <b>{{ this.$store.state.authorization.userAuth.email }}</b
          >.
        </div>
        <div class="project-info">
          <div class="box-image-project">
            <img
              class="image-project"
              :src="'http://localhost:3000/' + project.image"
            />
          </div>
          <div class="box-info-project">
            <div class="title">{{ project.title }}</div>
            <div class="description">{{ project.description }}</div>
            <div class="creator">{{ project.ownerid }}</div>
          </div>
        </div>
        <div class="price">
          <label>Ваше обещание</label>
          <div class="amount-box" :class="{ focusAmount: isFocusAmount }">
            <div>
              <span>$</span>
            </div>
            <input
              class="input-amount"
              v-model="amount"
              type="number"
              min="1"
              max="100000000"
              placeholder="500"
              @input="validAmount"
              @focus="isFocusAmount = true"
              @blur="isFocusAmount = false"
            />
          </div>
        </div>
      </div>
      <div class="card-box">
        <form @submit.prevent="pay">
          <label>Информация о карте</label>
          <div class="inputs-card">
            <div
              class="card-number-box"
              :class="{ focusCardNumber: isFocusCardNumber }"
            >
              <input
                type="text"
                class="card-number"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                v-model.trim="viewCardNumber"
                @input="validCardNumber"
                @focus="isFocusCardNumber = true"
                @blur="isFocusCardNumber = false"
              />
              <div class="type-cards">
                <img
                  v-if="viewCardNumber == '' || viewCardNumber[0] == 4"
                  class="visa"
                  src="/img/visa.svg"
                />
                <img
                  v-if="viewCardNumber == '' || viewCardNumber[0] == 5"
                  class="mastercard"
                  src="/img/mastercard.svg"
                />
              </div>
            </div>
            <div class="row">
              <input
                type="text"
                class="input-card expiration"
                maxlength="5"
                placeholder="мм/гг"
                v-model.trim="expiration"
                @input="validExpiration"
              />
              <input
                type="text"
                class="input-card security-code"
                maxlength="3"
                placeholder="CVC"
                v-model.trim="securityCode"
                @input="validSecurityCode"
              />
            </div>
          </div>
          <label class="container">
            <input v-model="checkbox" type="checkbox" />
            <span class="checkmark"></span>
            <span class="text-checkbox">
              Я согласен использовать платежную информацию
            </span>
          </label>
          <input
            :disabled="!checkbox"
            class="button"
            type="submit"
            value="Оплатить"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      errors: [],
      id: this.$route.params.projectId || null,
      status: null,
      isFocusCardNumber: false,
      isFocusAmount: false,
      amount: "",
      cardNumber: "",
      viewCardNumber: "",
      expiration: "",
      securityCode: "",
      checkbox: false,
    };
  },
  methods: {
    ...mapActions({
      fetchProject: "fetchProject",
      fetchInvestment: "fetchInvestment",
      createInvestment: "createInvestment",
      updateInvestment: "updateInvestment",
    }),
    validAmount(event) {
      if (event.currentTarget.validity.rangeUnderflow) {
        this.amount = 1;
      }
      if (event.currentTarget.validity.rangeOverflow) {
        this.amount = 100000000;
      }
      if (event.currentTarget.validity.badInput) {
        this.amount = this.oldAmount;
      }
      if (this.amount == "") {
        this.oldAmount = 1;
      } else {
        this.oldAmount = this.amount;
      }
    },
    validCardNumber(event) {
      // str = str.replace(/\s/g, ''); удаление пробелов
      if (event.inputType == "insertText") {
        this.viewCardNumber = this.viewCardNumber
          .replace(/[^\d]/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim();
      }
    },
    validExpiration(event) {
      if (event.inputType == "insertText") {
        // месяц /^(0[1-9])|(1[012])/g
        this.expiration = this.expiration
          .replace(/[^\d]/g, "")
          .replace(/^(.{2})/g, "$1/")
          .trim();
      }
    },
    validSecurityCode() {
      this.securityCode = this.securityCode.replace(/[^\d]/g, "");
    },
    pay() {
      const errors = [];
      if (this.viewCardNumber.length != 19)
        errors.push("Некорректный номер карты");
      if (this.expiration.length != 5 || !this.checkDate())
        errors.push("Некорректная дата");
      if (this.securityCode.length != 3) errors.push("Некоректный CVC");
      console.log(errors);
      if (errors.length) {
        this.errors = errors;
        this.status = "error";
      } else {
        const formData = {
          userId: this.$store.state.authorization.userAuth._id,
          projectId: this.id,
          amount: this.amount,
        };
        console.log(this.securityCode);
        console.log(this.expiration);
        console.log(this.viewCardNumber);
        if (this.investment) {
          this.updateInvestment({
            id: this.investment._id,
            data: { amount: this.amount },
          })
            .then(() => {
              this.status = "success";
              this.errors = ["Оплата прошла успешно"];
              this.clearNotification();
            })
            .catch(() => {
              this.status = "error";
              this.errors = ["Произошла ошибка при платеже"];
            });
        } else {
          this.createInvestment(formData)
            .then(() => {
              this.status = "success";
              this.errors = ["Оплата прошла успешно"];
              this.clearNotification();
            })
            .catch(() => {
              this.status = "error";
              this.errors = ["Произошла ошибка при платеже"];
            });
        }
      }
    },
    checkDate() {
      let nowMonth = Number(new Date().getMonth().toString()) + 1;
      let nowYear = Number(new Date().getFullYear().toString().slice(-2));

      let month = Number(this.expiration.slice(0, 2));
      let year = Number(this.expiration.slice(-2));

      if (year == nowYear) {
        if (month > nowMonth && month <= 12) return true;
        else return false;
      } else if (year > nowYear) {
        if (month <= 12) return true;
        else return false;
      } else return false;
    },
    clearNotification() {
      setTimeout(() => {
        this.status = null;
        this.errors = [];
      }, 2000);
    },
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      investment: (state) => state.investment.investment,
    }),
    ...mapGetters({}),
  },
  mounted() {
    console.log(this.id);
    console.log(this.$store.state.authorization.userAuth._id);
    this.fetchProject(this.id);
    this.fetchInvestment({
      projectId: this.id,
      userId: this.$store.state.authorization.userAuth._id,
    }).then((response) => {
      this.amount = response.amount;
    });
  },
};
</script>

<style scoped>
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

/* -------------------------------------- */

.middle > h2 {
  width: 750px;
}

.payment-box {
  width: 750px;
  display: flex;
}

.info-box {
  background-color: #fff;
  border-radius: 10px;
  padding: 12px;
  width: 60%;
  margin-right: 12px;
}

.info-payment {
  font-size: 0.8em;
}

.project-info {
  margin: 24px 0;
  display: flex;
}

.box-image-project {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.image-project {
  height: 95px;
}

.title {
  color: #0000c5;
  font-weight: 600;
  font-size: 0.9em;
}

.description {
  font-size: 0.8em;
}

.price > label {
  font-weight: 600;
  font-size: 0.9em;
}

.card-box {
  width: 40%;
}

form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.row {
  display: flex;
}

.amount-box {
  display: flex;
  background-color: white;
  margin-top: 0.4em;
  font-weight: 400;
  /* padding: 0vh 1.2vw 0 1.2vw; */
  border: 2px solid hsla(0, 0%, 0%, 0.3);
  height: 38px;
  width: 100%;
  text-decoration: none;
  cursor: auto;
  font-size: 0.9em;
  color: #0d0d0d;
  border-radius: 10px;
  margin-bottom: 25px;
  overflow: hidden;
}

.input-amount {
  height: 100%;
  width: 100%;
  border: none;
  margin: 0 1.2vw 0 0;
}

.input-amount:focus {
  outline: none;
}

.amount-box > div {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.amount-box > div > span {
  margin-bottom: 2px;
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 12px;
}

.focusAmount {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.inputs-card {
  margin-top: 0.4em;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.input-card {
  font-weight: 400;
  padding: 0vh 12px;
  border: 2px solid hsla(0, 0%, 0%, 0.3);
  height: 38px;
  color: #0d0d0d;
  width: 100%;
  text-decoration: none;
  cursor: auto;
}

.card-number-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  font-weight: 400;
  padding: 0vh 12px;
  border: 2px solid hsla(0, 0%, 0%, 0.3);
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.3);
  height: 38px;
  color: #0d0d0d;
  width: 100%;
  text-decoration: none;
  cursor: auto;
}

.focusCardNumber {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
  z-index: 2;
}

.card-number {
  border: none;
  height: 100%;
  padding: 0;
}

.type-cards {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 62px;
}

.visa {
  height: 32px;
}

.mastercard {
  height: 18px;
  margin-left: 6px;
}

.expiration {
  border-radius: 0 0 0 10px;
  border-top: 1px solid hsla(0, 0%, 0%, 0.3);
  border-right: 1px solid hsla(0, 0%, 0%, 0.3);
}

.security-code {
  border-radius: 0 0 10px 0;
  border-top: 1px solid hsla(0, 0%, 0%, 0.3);
  border-left: 1px solid hsla(0, 0%, 0%, 0.3);
}

.input-card:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
  z-index: 2;
}

.card-number:focus {
  outline: none;
}

label {
  width: 100%;
  font-weight: 600;
  font-size: 0.8em;
}

.button {
  width: 100%;
}

.box-top {
  font-size: 0.9em;
  width: 750px;
  color: #ffffff;
  margin-bottom: 25px;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.error {
  background-color: #f01446;
}

.success {
  background-color: #0000c5;
}

/* The container */
.container {
  display: flex;
  /* align-items: center; */
  position: relative;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 0.8em;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-checkbox {
  margin-left: 12px;
  width: 80%;
  flex-grow: 1;
  text-align: justify;
}

/* On mouse-over, add a grey background color */
/* .container:hover input ~ .radiomark {
    background-color: white;
  } */

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: white;
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: flex;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0000c5;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .middle > h2 {
    padding: 0 24px;
    width: 100%;
  }

  .info-box {
    width: 100%;
  }

  .image-project {
    height: 135px;
  }

  .card-box {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .payment-box {
    padding: 0 24px;
    width: 100%;
    flex-direction: column;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 375px;
    margin: 25px 0 50px 0;
    align-items: flex-start;
  }

  .project-info {
    flex-direction: column;
  }

  .box-image-project {
    margin-right: 0;
    margin-bottom: 12px;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .middle > h2 {
    padding: 0 12px;
  }

  .payment-box {
    padding: 0 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
