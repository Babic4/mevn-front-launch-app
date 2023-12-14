<template>
  <Confirm
    v-if="showConfirm"
    @close="showConfirm = false"
    @proceed="(showConfirm = false), $router.push(nexTab)"
  ></Confirm>
  <div class="middle">
    <div class="box-banner" v-if="!project.publishDate">
      <div class="text-banner">Удалить</div>
      <button class="button-banner" @click="removeProject">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="width">
      <div
        class="up-notification"
        v-if="project.notification"
        :class="{
          'ntf-success': project.notification.type == 'success',
          'ntf-error': project.notification.type == 'error',
        }"
      >
        <div
          class="up-notification-message"
          v-if="project.notification.type == 'success'"
        >
          Проект опубликован
        </div>
        <div
          class="up-notification-message"
          v-if="project.notification.type == 'error'"
        >
          Проект не опубликова. Примечание: {{ project.notification.message }}
        </div>
        <div
          class="up-notification-btn-close"
          @click="closeNotifaction"
          :class="{
            'ntf-btn-success': project.notification.type == 'success',
            'ntf-btn-error': project.notification.type == 'error',
          }"
        >
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div
        class="box-top"
        :class="{ success: status == 'success', error: status == 'error' }"
        v-if="status"
      >
        <span v-for="error in errors" :key="error.id">{{ error }}</span>
      </div>
      <h2 class="title" v-if="project.title == null">Название проекта</h2>
      <h2 class="title" v-else>{{ project.title }}</h2>
      <div class="name-creator" v-if="project.ownerId">
        Создатель {{ project.ownerId.name }}
      </div>
      <div class="introductory-info">Вводная информация</div>
    </div>
    <div class="tab">
      <div
        class="tablinks"
        :class="{ active: tab == 'basics' }"
        @click="checkUpdateProject"
        id="btnBasics"
      >
        Основы
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'story' }"
        @click="checkUpdateProject"
        id="btnStory"
      >
        История
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'payment' }"
        @click="checkUpdateProject"
        id="btnPayment"
      >
        Оплата
      </div>
    </div>

    <div class="width">
      <!-- Tab content -->
      <div id="Basics" class="tabcontent" v-if="tab == 'basics'">
        <div class="header-tab">
          <strong>Начните с основ</strong>
          <span
            >Сделайте так, чтобы людям было легко узнать о Вашем проекте.</span
          >
        </div>
        <div>
          <div>
            <div class="collumn-1"></div>
            <div class="collumn-2">
              <div class="input-count">
                <label for="">Заголовок</label>
                <input
                  class="input not-margin"
                  v-model="title"
                  maxlength="60"
                  type="text"
                  @focus="showCountT = true"
                  @blur="showCountT = false"
                />
                <div class="count" :class="{ focusInput: showCountT }">
                  {{ title.length }}/60
                </div>
              </div>
              <div class="input-count">
                <label for="">Описание (подзаголовок)</label>
                <input
                  class="input not-margin"
                  v-model="description"
                  maxlength="135"
                  type="text"
                  @focus="showCountD = true"
                  @blur="showCountD = false"
                />
                <div class="count" :class="{ focusInput: showCountD }">
                  {{ description.length }}/135
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="collumn-1"></div>
            <div class="collumn-2">
              <div class="upload-box">
                <label for="preview-image-input"
                  >Изображение (желательно 16:9)</label
                >
                <div class="preview-box" v-show="ifPreviewImage">
                  <div class="preview">
                    <img id="preview-image" :src="urlMainImage" />
                  </div>
                  <div class="preview-btns">
                    <button @click="uploadPreviewImage">
                      <i class="fas fa-sync-alt"></i>
                    </button>
                    <button @click="removePreviewImage">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="upload-button" v-show="!ifPreviewImage">
                  <div class="input-box">
                    <input
                      type="file"
                      id="preview-image-input"
                      accept=".jpg, .jpeg, .png"
                      @change="previewImage"
                    />
                    <span class="text-upload">
                      Выберите изображения для загрузки (PNG, JPG)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="false">
            <div class="collumn-1"></div>
            <div class="collumn-2">
              <div class="upload-box">
                <label for="preview-video-input">Видео (Необязательно)</label>
                <div class="preview-box" v-show="ifPreviewVideo">
                  <div class="preview">
                    <video class="video" controls>
                      <source id="preview-video" :src="urlMainVideo" />
                    </video>
                  </div>
                  <div class="preview-btns">
                    <button @click="uploadPreviewVideo">
                      <i class="fas fa-sync-alt"></i>
                    </button>
                    <button @click="removePreviewVideo">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="upload-button" v-show="!ifPreviewVideo">
                  <div class="input-box">
                    <input
                      type="file"
                      id="preview-video-input"
                      accept=".mov, .mp4, .avi"
                      @change="previewVideo"
                    />
                    <span class="text-upload">
                      Выберите видео для загрузки (MOV, MP4, AVI)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="collumn-1"></div>
            <div class="collumn-2">
              <label for="">Сумма</label>
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
          <div>
            <div class="collumn-1"></div>
            <div class="collumn-2">
              <!-- <label for="">End of the project</label> -->
              <div class="boxs-radio">
                <div class="box-radio">
                  <label class="container">
                    <input
                      v-model="radio"
                      type="radio"
                      name="end-project"
                      value="1"
                    />
                    <span class="radiomark"></span>
                    <span class="text-radio">Количество дней</span>
                  </label>
                  <div v-show="radio == 1">
                    <label for="">Введите количество дней</label>
                    <input
                      class="input"
                      v-model="numberOfDays"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="60"
                      @input="validNumerOfDay"
                    />
                  </div>
                </div>
                <div class="box-radio">
                  <label class="container">
                    <input
                      v-model="radio"
                      type="radio"
                      name="end-project"
                      value="2"
                    />
                    <span class="radiomark"></span>
                    <span class="text-radio">Конечная дата</span>
                  </label>
                  <div v-show="radio == 2">
                    <input
                      class="datapicker"
                      v-model="datapicker"
                      type="date"
                      :min="setMinDate()"
                      :max="setMaxDate()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="Story" class="tabcontent" v-if="tab == 'story'">
        <div class="header-tab">
          <strong>Представьте свой проект</strong>
          <span>
            Расскажите людям, почему они должны быть в восторге от Вашего
            проекта. Будьте конкретны, но ясны и кратки.
          </span>
        </div>
        <div>
          <div>
            <div class="row-1">
              <span class="heading">Описание проекта</span>
            </div>
            <div class="row-2">
              <!-- <Tiptap
                @change-show-overlay="$emit('changeShowOverlay')"
                v-model="story"
              /> -->
              <Tiptap v-model="story" />
            </div>
          </div>
        </div>
        <div>
          <div>
            <div class="collumn-1"><span class="heading">Риски</span></div>
            <div class="collumn-2">
              <textarea
                ref="risks"
                id="risks"
                v-model="risks"
                cols="30"
                rows="4"
                @input="autoGrow"
                @focus="autoGrow"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div id="Payment" class="tabcontent" v-if="tab == 'payment'">
        <div class="header-tab">
          <strong>Привяжите банковский счет</strong>
          <span>Дважды проверьте свою информацию.</span>
        </div>
        <div>
          <div>
            <div class="collumn-1">
              <span class="heading">Банковский счет (IBAN)</span>
              <input
                type="text"
                class="input"
                placeholder="BY00XXXX00000000000000000000"
                maxlength="28"
                @input="validIBAN"
                v-model.trim="bankAccount"
                :class="{ invalid: invalidIBAN }"
              />
              <span class="heading">БИК банка</span>
              <input
                type="text"
                class="input"
                maxlength="9"
                @input="validBIC"
                v-model.trim="BIC"
                :class="{ invalid: invalidBIC }"
              />
              <span class="heading">УНП Получателя</span>
              <input
                type="text"
                class="input"
                placeholder="000000000"
                maxlength="9"
                @input="validPAN"
                v-model.trim="PAN"
                :class="{ invalid: invalidPAN }"
              />
              <label class="container">
                <input v-model="checkbox" type="checkbox" />
                <span class="checkmark"></span>
                <span class="text-checkbox">
                  Я согласен на обработку моих персональных данных и ознакомлен
                  с политикой конфидинциальности
                </span>
              </label>
            </div>
            <div class="collumn-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="downs-btns">
      <button
        class="button"
        @click="callUpdateProject"
        :disabled="checkDisSavePayment"
      >
        Сохранить
      </button>
      <button class="button" @click="publishProject" :disabled="checkPublish">
        Опубликовать проект
      </button>
    </div>
  </div>
</template>

<script>
import Tiptap from "@/components/Tiptap";
import Confirm from "@/components/Confirm";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      errors: [],
      status: null,
      id: null,
      tab: null,
      nextTab: null,
      showConfirm: false,
      title: "",
      description: "",
      isFocusAmount: false,
      amount: "",
      oldAmount: 1,
      urlMainImage: "",
      urlMainVideo: "",
      mainImage: "",
      mainVideo: "",
      ifPreviewImage: false,
      ifPreviewVideo: false,
      radio: 0,
      numberOfDays: "",
      oldNumberOfDays: 1,
      datapicker: "",
      story: "",
      risks: "",
      bankAccount: "",
      BIC: "",
      PAN: "",
      showCountD: false,
      showCountT: false,
      invalidIBAN: false,
      invalidBIC: false,
      invalidPAN: false,
      checkbox: false,
    };
  },
  validations: {
    title: {},
    description: {},
    amount: {},
    radio: {},
    story: {},
    risks: {},
  },
  methods: {
    ...mapActions({
      fetchProject: "fetchProject",
      updateProject: "updateProject",
      delProject: "delProject",
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
    validNumerOfDay(event) {
      if (event.currentTarget.validity.rangeUnderflow) {
        this.numberOfDays = 1;
      }
      if (event.currentTarget.validity.rangeOverflow) {
        this.numberOfDays = 120;
      }
      if (event.currentTarget.validity.badInput) {
        this.numberOfDays = this.oldNumberOfDays;
      }
      if (this.numberOfDays == "") {
        this.oldNumberOfDays = 1;
      } else {
        this.oldNumberOfDays = this.numberOfDays;
      }
    },
    validIBAN() {
      let regexIBAN = /^BY\d{2}[A-Z]{4}\d{20}$/g;
      if (this.bankAccount.match(regexIBAN)) {
        this.invalidIBAN = false;
      } else this.invalidIBAN = true;
    },
    validBIC() {
      this.BIC = this.BIC.replace(/[^\dA-Z]/g, "");
      if (this.BIC.length < 7) this.invalidBIC = true;
      else this.invalidBIC = false;
    },
    validPAN() {
      this.PAN = this.PAN.replace(/[^\d]/g, "");
      if (this.PAN.length < 9) this.invalidPAN = true;
      else this.invalidPAN = false;
    },
    setMinDate() {
      const date = new Date();
      return [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, "0"),
        date.getDate().toString().padStart(2, "0"),
      ].join("-");
    },
    setMaxDate() {
      const date = new Date();
      date.setDate(date.getDate() + 120);
      return [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, "0"),
        date.getDate().toString().padStart(2, "0"),
      ].join("-");
    },
    checkUpdateProject(event) {
      let prevTab = document.getElementsByClassName("tablinks active")[0].id;
      switch (event.target.id) {
        case "btnBasics":
          // console.log(this.checkUpdates(prevTab));
          if (this.checkUpdates(prevTab)) {
            this.nexTab = `/update-project/${this.id}/basics`;
            this.showConfirm = true;
          } else {
            this.$router.push(`/update-project/${this.id}/basics`);
          }
          break;
        case "btnStory":
          if (this.checkUpdates(prevTab)) {
            this.nexTab = `/update-project/${this.id}/story`;
            this.showConfirm = true;
          } else {
            this.$router.push(`/update-project/${this.id}/story`);
          }
          break;
        case "btnPayment":
          if (this.checkUpdates(prevTab)) {
            this.nexTab = `/update-project/${this.id}/payment`;
            this.showConfirm = true;
          } else {
            this.$router.push(`/update-project/${this.id}/payment`);
          }
          break;
      }
    },
    callUpdateProject() {
      let formData = new FormData();
      switch (this.tab) {
        case "basics":
          // if (this.radio == 1) {
          //   countDays = this.numberOfDay;
          // } else if (this.radio == 2) {
          //   let targetDate = new Date(this.datapicker).getTime();
          //   let curDate = new Date().getTime();
          //   countDays = Math.round((targetDate - curDate) / 86400000);
          // }
          formData.append("title", this.title);
          formData.append("description", this.description);
          formData.append("collectingAmount", this.amount);
          formData.append("radioButton", this.radio);
          if (this.mainImage) formData.append("image", this.mainImage);
          // if (this.mainVideo) formData.append("video", this.mainVideo);
          if (this.radio == 1) {
            formData.append("numberOfDays", this.numberOfDays);
            formData.append("targetDate", "");
          } else if (this.radio == 2) {
            formData.append("numberOfDays", "");
            formData.append("targetDate", this.datapicker);
          }
          break;
        case "story":
          formData.append("story", this.story);
          formData.append("risks", this.risks);
          break;
        case "payment":
          formData.append("checkingAccount", this.bankAccount);
          formData.append("BIC", this.BIC);
          formData.append("PAN", this.PAN);
          break;
        default:
          console.log("error");
      }
      formData.append("published", false);
      console.log(formData);
      this.updateProject({ id: this.id, data: formData }).then(() => {
        this.status = "success";
        this.errors = ["Проект сохранен"];
        this.clearNotification();
        this.shapeForm();
      });
    },
    publishProject() {
      this.updateProject({
        id: this.id,
        data: { checkPublish: true },
      }).then(() => {
        this.status = "success";
        this.errors = ["Проект отправлен на публикацию"];
        this.clearNotification();
      });
    },
    autoGrow(event) {
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + 4 + "px";
    },
    previewImage(event) {
      if (event.target.files.length > 0) {
        if (event.target.files[0].size / 1024 / 1024 <= 200) {
          // ЗАГЛУШКА 200 MB (UP!)
          this.mainImage = event.target.files[0];
          let src = URL.createObjectURL(event.target.files[0]);
          // let preview = document.getElementById("preview-image");
          this.urlMainImage = src;
          this.ifPreviewImage = true;
        }
      }
    },
    uploadPreviewImage() {
      document.getElementById("preview-image-input").click();
    },
    removePreviewImage() {
      this.updateProject({ id: this.id, data: { image: null } });
      this.mainImage = "";
      // let preview = document.getElementById("preview-image");
      // preview.src = null;
      this.urlMainImage = "";
      this.ifPreviewImage = false;
    },
    previewVideo(event) {
      if (event.target.files.length > 0) {
        this.mainVideo = event.target.files[0];
        let src = URL.createObjectURL(event.target.files[0]);
        // let preview = document.getElementById("preview-video");
        this.urlMainVideo = src;
        // preview.src = src;
        this.ifPreviewVideo = true;
      }
    },
    uploadPreviewVideo() {
      document.getElementById("preview-video-input").click();
    },
    removePreviewVideo() {
      this.mainVideo = "";
      // let preview = document.getElementById("preview-video");
      // preview.src = null;
      this.urlMainVideo = "";
      this.ifPreviewVideo = false;
    },
    shapeForm() {
      switch (this.tab) {
        case "basics":
          if (this.project.title) this.title = this.project.title;
          else this.title = "";
          if (this.project.description)
            this.description = this.project.description;
          else this.description = "";
          if (this.project.collectingAmount)
            this.amount = this.project.collectingAmount;
          else this.amount = "";
          if (this.project.radioButton) this.radio = this.project.radioButton;
          else this.radio = 0;
          if (this.project.image) {
            // let preview = document.getElementById("preview-image");
            // preview.src = "http://localhost:3000/" + this.project.image;
            this.mainImage = this.project.image;
            this.urlMainImage = "http://localhost:3000/" + this.project.image;
            this.ifPreviewImage = true;
          } else {
            this.mainImage = "";
            this.urlMainImage = "";
            this.ifPreviewImage = false;
          }
          if (this.project.radioButton == 1) {
            this.numberOfDays = this.project.numberOfDays;
            this.datapicker = "";
          } else if (this.project.radioButton == 2) {
            this.numberOfDays = "";
            this.datapicker = this.project.targetDate;
          }
          break;
        case "story":
          if (this.project.story) this.story = this.project.story;
          else this.story = "";
          if (this.project.risks) this.risks = this.project.risks;
          else this.risks = "";
          break;
        case "payment":
          if (this.project.checkingAccount)
            this.bankAccount = this.project.checkingAccount;
          else this.bankAccount = "";
          if (this.project.BIC) this.BIC = this.project.BIC;
          else this.BIC = "";
          if (this.project.PAN) this.PAN = this.project.PAN;
          else this.PAN = "";
          break;
      }
    },
    checkUpdates(btnId) {
      switch (btnId) {
        case "btnBasics":
          // console.log(this.mainImage);
          // console.log(this.project.image);
          if (
            (this.title != "" && this.project.title == null) ||
            (this.description != "" && this.project.description == null) ||
            (this.amount != "" && this.project.collectingAmount == null) ||
            (this.radio != 0 && this.project.radioButton == null) ||
            (this.mainImage != "" && this.project.image == null) ||
            (this.title != this.project.title && this.project.title != null) ||
            (this.description != this.project.description &&
              this.project.description != null) ||
            (this.amount != this.project.collectingAmount &&
              this.project.collectingAmount != null) ||
            (this.mainImage != this.project.image &&
              this.project.image != null) ||
            (this.radio != this.project.radioButton &&
              this.project.radioButton != null)
          ) {
            return true;
          } else {
            if (this.project.radioButton == 1) {
              if (
                (this.numberOfDays != this.project.numberOfDays &&
                  this.project.numberOfDays != null) ||
                (this.numberOfDays != "" && this.project.numberOfDays == null)
              ) {
                return true;
              } else {
                return false;
              }
            } else if (this.project.radioButton == 2) {
              if (
                (this.datapicker != this.project.targetDate &&
                  this.project.targetDate != null) ||
                (this.datapicker != "" && this.project.targetDate == null)
              ) {
                return true;
              } else {
                return false;
              }
            }
            return false;
          }
        case "btnStory":
          // console.log(this.story + " : " + this.risks);
          if (
            (this.story != this.project.story && this.project.story != null) ||
            (this.risks != this.project.risks && this.project.risks != null) ||
            (this.story != "" && this.project.story == null) ||
            (this.risks != "" && this.project.risks == null)
          ) {
            return true;
          } else {
            return false;
          }
        case "btnPayment":
          if (
            (this.bankAccount != this.project.checkingAccount &&
              this.project.checkingAccount != null) ||
            (this.bankAccount != "" && this.project.checkingAccount == null) ||
            (this.BIC != this.project.BIC && this.project.BIC != null) ||
            (this.BIC != "" && this.project.BIC == null) ||
            (this.PAN != this.project.PAN && this.project.PAN != null) ||
            (this.PAN != "" && this.project.PAN == null)
          ) {
            return true;
          } else {
            return false;
          }
      }
    },
    callConfirm() {
      console.log("Confirm");
      this.showAlert = true;
    },
    addURL(URL) {
      console.log(URL);
    },
    clearNotification() {
      setTimeout(() => {
        this.status = null;
        this.errors = [];
      }, 2000);
    },
    closeNotifaction() {
      this.updateProject({ id: this.id, data: { notification: null } }).then(
        () => {
          this.$store.dispatch(
            "checkNotification",
            this.$store.state.authorization.userAuth._id
          );
        }
      );
    },
    removeProject() {
      console.log("remove");
      this.delProject(this.project._id).then(() => {
        this.$router.push("/projects");
      });
    },
  },
  mounted() {
    if (!this.$route.params.tab) {
      this.$router.push(`/update-project/${this.id}/basics`);
    }
    this.id = this.$route.params.id;
    this.tab = this.$route.params.tab;
    this.fetchProject(this.$route.params.id).then((response) => {
      if (response.ownerId._id == this.$store.state.authorization.userAuth._id)
        this.shapeForm();
      else this.$router.go(-1);
    });
    // Права доступа
  },
  updated() {
    if (!this.$route.params.tab) {
      this.$router.push(`/update-project/${this.id}/basics`);
    }
    if (this.tab != this.$route.params.tab) {
      this.tab = this.$route.params.tab;
      this.shapeForm();
    }
    if (this.id != this.$route.params.id) {
      this.id = this.$route.params.id;
      this.fetchProject(this.id).then(() => {
        this.shapeForm();
      });
      this.shapeForm();
    }
    this.checkRisks;
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
    }),
    ...mapGetters({}),
    checkPublish() {
      if (
        this.project.title &&
        this.project.description &&
        this.project.image &&
        this.project.collectingAmount &&
        this.project.story &&
        this.project.risks &&
        this.project.checkingAccount &&
        this.project.BIC &&
        this.project.PAN &&
        !this.project.published
      ) {
        if (this.project.radioButton == 1 && this.project.numberOfDays) {
          return false;
        } else if (this.project.radioButton == 2 && this.project.targetDate) {
          return false;
        } else return true;
      } else {
        return true;
      }
    },
    checkDisSavePayment() {
      if (this.tab == "payment") {
        if (
          this.checkbox &&
          !this.invalidIBAN &&
          !this.invalidBIC &&
          !this.invalidPAN &&
          !this.bankAccount.length == 0 &&
          !this.BIC.length == 0 &&
          !this.PAN.length == 0
        )
          return false;
        return true;
      } else return false;
    },
  },
  components: {
    Tiptap,
    Confirm,
  },
};
</script>

<style scoped>
.middle {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

.box-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 24px;
  top: 12px;
  background: #ffffff;
  border-radius: 10px;
  height: 38px;
  overflow: hidden;
}

.text-banner {
  font-size: 0.8em;
  font-weight: 500;
  padding: 0 12px;
}

.button-banner {
  border: none;
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ed0028;
  color: #ffffff;
  cursor: pointer;
}

.button-banner:hover {
  background: #fd003b;
}

/* -------------------------------------- */

/* Style the tab */
.tab {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.tablinks {
  font-size: 0.8em;
  font-weight: 600;
  background-color: inherit;
  color: #000000;
  text-decoration: none;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

.active {
  color: #0000c5;
}

/* Style the tab content */
.tabcontent {
  border-top: none;
  height: 100%;
  width: 100%;
}

.width {
  margin: 30px 0;
  width: 750px;
}

.second-step {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.introductory-info {
  width: 100%;
  padding: 25px 0;
  text-align: center;
}

.downs-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 750px;
}

label {
  font-weight: 600;
  font-size: 0.8em;
}

.title {
  font-size: 1.6em;
  font-weight: 600;
  margin: 0;
}

.name-creator {
  font-size: 0.8em;
  font-weight: 300;
  color: #7c878b;
}

.header-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 50px;
}

.header-tab > strong {
  font-size: 1.1em;
}
.header-tab > span {
  font-size: 0.9em;
}

.column-1 {
}

.column-2 {
}

.row-1 {
}

.row-2 {
}

.upload-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.upload-button {
  margin-top: 0.4rem;
  display: flex;
  width: 100%;
  background-color: #ffffff;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 75px;
  position: relative;
}

.upload-button:hover {
  border: 2px dashed #0000c5;
  background-color: rgba(21, 0, 255, 0.1);
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.preview-box {
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.3);
  margin-top: 0.4em;
  width: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 12px;
  border-radius: 10px;
  /* border: 2px solid #0000c5;
    outline: 3px solid rgba(21, 0, 255, 0.1); */
}

.preview {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-btns {
  display: flex;
  width: 100%;
}

.preview-btns > button {
  font-size: 0.8em;
  font-weight: 600;
  color: #0d0d0d;
  margin: 0.2rem;
  border: none;
  border-radius: 0.3rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-btns > button:hover {
  color: #0000c5;
}

#preview-image,
#preview-video {
  height: 100%;
  border-radius: 10px;
}

.input-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#preview-video-input,
#preview-image-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  cursor: pointer;
}

.text-upload {
  font-size: 0.8em;
}

textarea {
  margin-top: 0.4rem;
  color: #0d0d0d;
  width: 100%;
  padding: 10px 6px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 0.8em;
  font-family: "Open Sans", sans-serif;
  min-height: 90px;
  resize: none;
  overflow: hidden;
}

textarea:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.heading {
  font-size: 0.9em;
  font-weight: 600;
  margin: 5px 0;
}

.boxs-radio {
  display: flex;
  flex-direction: column;
}

/* The container */
.container {
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 12px;
  margin-bottom: 12px;
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
.radiomark {
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

.text-radio {
  margin-left: 12px;
}

/* On mouse-over, add a grey background color */
/* .container:hover input ~ .radiomark {
    background-color: white;
  } */

/* When the radio button is checked, add a blue background */
.container input:checked ~ .radiomark {
  background-color: white;
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.radiomark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .radiomark:after {
  display: flex;
}

/* Style the indicator (dot/circle) */
.container .radiomark:after {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0000c5;
}

.datapicker {
  height: 38px;
  display: flex;
  width: 100%;
  border-radius: 10px;
  padding: 0 12px;
  font-family: "Open Sans", sans-serif;
  font-size: 0.9em;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.datapicker:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
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

.box-top {
  z-index: 10;
  position: fixed;
  transform: translate(-50%, 0);
  left: 50%;
  top: 24px;
  width: 50%;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.error {
  background-color: #f01446;
}

.success {
  background-color: #0000c5;
}

.count {
  margin-top: 0.4em;
  text-align: end;
  font-size: 0.8em;
  color: #7c878b;
  visibility: hidden;
}

.not-margin {
  margin-bottom: 0;
}

.input-count {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.focusInput {
  visibility: visible;
}

.up-notification {
  padding: 12px 12px 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  border-radius: 12px;
  margin: 24px 0;
}

.up-notification-message {
  color: white;
}

.up-notification-btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 12px;
}

.up-notification-btn-close > i {
  padding: 10px 12px;
}

.up-notification-btn-close:hover {
  color: white;
}

.ntf-success {
  background-color: #0000c5;
}

.ntf-error {
  background: #ed0028;
}

.ntf-btn-success:hover {
  background-color: #0040ff;
}

.ntf-btn-error:hover {
  background: #fd003b;
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
  .title {
    margin-top: 24px;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .width {
    width: 100%;
    padding: 0 24px;
  }

  .downs-btns {
    width: 100%;
    padding: 0 24px;
  }

  .preview-box {
    width: 100%;
  }

  .preview {
    width: 100%;
    height: auto;
  }

  #preview-image {
    width: 100%;
    height: 100%;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-banner {
    width: 94%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .text-upload {
    padding: 0 12px;
  }

  .button {
    width: auto;
    padding: 0 12px;
  }

  .width {
    padding: 0 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
