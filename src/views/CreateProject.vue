<template>
  <div class="middle">
    <div class="not-auth" v-if="!$store.state.authorization.userAuth">
      Для создания проекта необходимо
      <span class="btn-login" @click="$router.push('/login')">
        Авторизироваться
      </span>
    </div>
    <form v-else @submit.prevent="onCreateProject" class="first-form">
      <h2>Создание проекта</h2>
      <div v-if="errors.length" class="error">
        <span v-for="error in errors" :key="error.key">{{ error }}</span>
      </div>
      <Select
        title="Категория"
        v-model="category"
        :options-value="Categories"
      ></Select>
      <Select
        title="Место расположения"
        v-model="location"
        :options-value="Locations"
      ></Select>
      <input class="button" type="submit" value="Продолжить создание" />
    </form>
  </div>
</template>

<script>
import Select from "@/components/Select";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      errors: [],
      category: "",
      location: "",
      Categories: ["Дизайн", "Фильмы", "Технологии", "Игры", "Музыка"],
      Locations: [
        "Аргентина",
        "Австралия",
        "Бахрейн",
        "Беларусь",
        "Бельгия",
        "Бразилия",
        "Болгария",
        "Канада",
        "Чили",
        "Китай",
        "Колумбия",
        "Чешская Республика",
        "Дания",
        "Испания",
        "Франция",
        "Германия",
        "Греция",
        "Индия",
        "Индонезия",
        "Ирак",
        "Ирландия",
        "Италия",
        "Япония",
        "Кения",
        "Корея",
        "Малайзия",
        "Мексика",
        "Марокко",
        "Нидерланды",
        "Новая Зеландия",
        "Нигерия",
        "Норвегия",
        "Пакистан",
        "Перу",
        "Филиппины",
        "Польша",
        "Португалия",
        "Россия",
        "Саудовская Аравия",
        "Сингапур",
        "Словакия",
        "Южная Африка",
        "Шри-Ланка",
        "Швеция",
        "Швейцария",
        "Танзания",
        "Таиланд",
        "Турция",
        "Объединенные Арабские Эмираты",
        "Объединенное Королевство",
        "Соединенные Штаты",
        "Вьетнам",
      ],
    };
  },
  methods: {
    ...mapActions({
      createProject: "createProject",
    }),
    onCreateProject() {
      this.errors = [];
      console.log(this.category + " " + this.location);
      if (this.category == "") this.errors.push("Выбрать категорию");
      if (this.location == "") this.errors.push("Выбрать место расположения");
      if (this.location != "" && this.category != "") {
        const formData = {
          category: this.category,
          location: this.location,
          ownerId: this.$store.state.authorization.userAuth._id,
        };
        this.createProject(formData);
      }
    },
  },
  computed: {
    ...mapState({
      project: (state) => state.project,
    }),
    ...mapGetters({}),
  },
  components: {
    Select,
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

.first-form {
  display: flex;
  align-items: center;
}

/* -------------------------------------- */

form {
  display: flex;
  flex-direction: column;
}

.error {
  font-size: 0.9em;
  width: 325px;
  color: #ffffff;
  border-radius: 15px;
  background-color: #f01446;
  margin-bottom: 25px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
}

.error > span {
  text-align: left;
  width: 100%;
}

.not-auth {
  margin-top: 25px;
  font-size: 0.9em;
}

.btn-login {
  cursor: pointer;
  color: #01b5e6;
}
</style>
