<template>
  <div class="select-box">
    <label for="category-new">{{ title }}</label>
    <div>
      <div id="select-button">
        <input
          v-model="focus"
          type="checkbox"
          class="check"
          @blur="hiddenOption"
          @keyup="searchOption"
        />
        <div class="selected-value">
          <div>{{ value }}</div>
        </div>
        <div class="chevrons">
          <i
            :class="[{ 'active-chevrons': focus }, 'default']"
            class="fas fa-chevron-up"
          ></i>
          <i
            :class="[{ 'active-chevrons': focus }, 'default']"
            class="fas fa-chevron-down"
          ></i>
        </div>
      </div>
      <div class="options" v-show="focus" v-click-outside="onClickOutside">
        <div
          v-for="i in optionsValue"
          :key="i.key"
          @click="clickOption($event, i)"
          class="option"
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  directives: {
    "click-outside": {
      mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  data() {
    return {
      focus: false,
      value: "Выбрать",
      wordSearch: "",
      firstI: null,
    };
  },
  methods: {
    clickOption(event, nameOption) {
      let i, options;

      this.value = nameOption;

      // ???
      this.$emit("update:modelValue", nameOption); // v-model

      options =
        event.currentTarget.parentElement.getElementsByClassName("option");
      for (i = 0; i < options.length; i++) {
        options[i].className = options[i].className.replace(" active", "");
      }

      event.currentTarget.className += " active";

      this.focus = false;
    },
    onClickOutside() {
      this.focus = false;
    },
    searchOption(event) {
      let length = this.wordSearch.length;
      let firstIndex = null;
      let count = 0;
      setTimeout(this.clear, 1500, length);
      this.wordSearch += event.key;
      // console.log(this.wordSearch);
      if (this.wordSearch.match(/^(.)\1*$/)) {
        for (let [index, element] of this.optionsValue.entries()) {
          if (element.toLowerCase().startsWith(this.wordSearch[0])) {
            firstIndex = firstIndex === null ? index : firstIndex;
            count++;
          }
        }
        if (count) {
          let i, options;
          options =
            event.currentTarget.parentElement.parentElement.getElementsByClassName(
              "option"
            );
          for (i = 0; i < options.length; i++) {
            options[i].className = options[i].className.replace(" active", "");
          }
          options[
            firstIndex + ((this.wordSearch.length - 1) % count)
          ].className += " active";
          this.value =
            this.optionsValue[
              firstIndex + ((this.wordSearch.length - 1) % count)
            ];

          // ???
          this.$emit("update:modelValue", this.value);

          options[
            firstIndex + ((this.wordSearch.length - 1) % count)
          ].scrollIntoView();
          options[
            firstIndex + ((this.wordSearch.length - 1) % count)
          ].parentElement.scrollBy({
            top: -36,
          });
        }
      } else {
        for (let [index, element] of this.optionsValue.entries()) {
          if (element.toLowerCase().startsWith(this.wordSearch)) {
            let i, options;
            options =
              event.currentTarget.parentElement.parentElement.getElementsByClassName(
                "option"
              );
            for (i = 0; i < options.length; i++) {
              options[i].className = options[i].className.replace(
                " active",
                ""
              );
            }
            options[index].className += " active";
            this.value = element;

            // ???
            this.$emit("update:modelValue", this.value);

            options[index].scrollIntoView();
            options[index].parentElement.scrollBy({
              top: -36,
            });
            break;
          }
        }
      }
    },
    clear(length) {
      if (this.wordSearch.length == length + 1) {
        this.wordSearch = "";
        this.count = 0;
      }
    },
  },
  props: ["title", "optionsValue", "modelValue"],
  update() {
    console.log(this.wordSearch);
  },
};
</script>

<style scoped>
.select-box {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 25px;
}

.brd {
  border: 1px solid #e2eded;
  border-color: #eaf1f1 #e4eded #dbe7e7 #e4eded;
}

#select-button {
  position: relative;
  padding: 0 16px;
  /* border: 1px solid #1400ff; */
  height: 38px;
  width: 100%;
  font-size: 0.9em;
  color: #000000;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 2px;
}

.check {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.selected-value {
  overflow: hidden;
  width: 90%;
}

.selected-value > div {
  font-weight: 500;
  white-space: nowrap;
}

.chevrons {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 12px;
  padding: 9px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chevrons i {
  height: 50%;
  /* color: #2d3667; */
  font-size: 0.8em;
  text-align: right;
}

.default {
  color: #d1dede;
}

.options {
  position: absolute;
  right: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  z-index: 3;
  max-height: 216px;
  overflow: auto;
}

.options::-webkit-scrollbar {
  width: 12px;
}

.options::-webkit-scrollbar-track {
  border-radius: 10px;
}

.options::-webkit-scrollbar-thumb {
  background-color: #cbcbcb;
  border-radius: 10px;
}

.option {
  font-size: 0.8em;
  display: flex;
  align-items: center;
  height: 36px;
  transition: 0.3s ease all;
  padding: 0 16px;
  font-weight: 500;
  cursor: pointer;
}

.option:hover {
  background-color: #1400ff;
  color: white;
}

.active {
  background-color: #1400ff;
  color: white;
}

.active-chevrons {
  color: #000000;
}

label {
  margin-bottom: 0.4em;
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
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  #select-button {
    padding: 0 12px;
  }

  .option {
    padding: 0 12px;
  }
}
</style>
