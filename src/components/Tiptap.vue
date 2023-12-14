<template>
  <Alert ref="alert"></Alert>
  <AddImage ref="addImage"></AddImage>
  <div
    class="editor"
    :class="{ 'active-editor': isActiveEditor }"
    v-click-outside="onClickOutside"
  >
    <div v-if="editor" class="menu-editor">
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        <i class="fas fa-heading"></i>
      </button>
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <i class="fas fa-bold"></i>
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <i class="fas fa-italic"></i>
      </button>
      <button
        @click="editor.chain().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <i class="fas fa-list"></i>
      </button>
      <button
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
      >
        <i class="fas fa-link"></i>
      </button>
      <button
        @click="editor.chain().focus().unsetLink().run()"
        :class="{ 'is-active': editor.isActive('link') }"
        v-show="editor.isActive('link')"
      >
        <i class="fas fa-unlink"></i>
      </button>
      <button @click="addImage"><i class="fas fa-image"></i></button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import Alert from "@/components/Alert";
import AddImage from "@/components/AddImage";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

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

  components: {
    EditorContent,
    Alert,
    AddImage,
  },

  data() {
    return {
      editor: null,
      isActiveEditor: false,
      showAlert: false,
    };
  },

  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  methods: {
    async addImage() {
      const dataImage = await this.$refs.addImage.show();

      console.log(dataImage);
      if (dataImage.image) {
        if (!dataImage.URL && !dataImage.title) {
          this.editor
            .chain()
            .focus()
            .insertContent(
              `<p></p><figure><img src="http://localhost:3000/${dataImage.image}" /><figcaption></figcaption></figure><p></p>`
            )
            .run();
          return;
        }
        if (!dataImage.URL) {
          this.editor
            .chain()
            .focus()
            .insertContent(
              `<p></p><figure><img src="http://localhost:3000/${dataImage.image}" /><figcaption>${dataImage.title}</figcaption></figure><p></p>`
            )
            .run();
          return;
        }
        this.editor
          .chain()
          .focus()
          .insertContent(
            `<p></p><figure><img src="http://localhost:3000/${dataImage.image}" /><figcaption><a href="${dataImage.URL}">${dataImage.title}</a></figcaption></figure><p></p>`
          )
          .run();
      }
      // this.editor
      //   .chain()
      //   .focus()
      //   .insertContent({
      //     type: "paragraph",
      //   })
      //   .insertContent({
      //     type: "figure",
      //     content: [
      //       {
      //         type: "image",
      //         attrs: {
      //           src: `http://localhost:3000/${dataImage.image}`,
      //         },
      //       },
      //       {
      //         type: "figcaption",
      //         content: [
      //           {
      //             type: "text",
      //             text: dataImage.title,
      //           },
      //         ],
      //       },
      //     ],
      //   })
      //   .insertContent({
      //     type: "paragraph",
      //   })
      //   .run();
    },
    async setLink() {
      const url = await this.$refs.alert.alert();

      console.log(url);

      // const previousUrl = this.editor.getAttributes("link").href;
      // const url = window.prompt("URL", previousUrl);

      //cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    },
    onClickOutside() {
      this.isActiveEditor = false;
    },
  },

  mounted() {
    const Figcaption = Node.create({
      name: "figcaption",
      content: "inline*",
      draggable: false,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },
      parseHTML() {
        return [
          {
            tag: "figcaption",
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          "figcaption",
          mergeAttributes(HTMLAttributes, {
            contenteditable: false,
            editable: false,
          }),
          0,
        ];
      },
    });

    const Figure = Node.create({
      name: "figure",
      group: "block",
      content: "image figcaption?",
      draggable: true,
      selectable: false,
      inclusive: false,
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },
      parseHTML() {
        return [
          {
            tag: "figure",
          },
        ];
      },

      renderHTML({ HTMLAttributes }) {
        return [
          "figure",
          mergeAttributes(HTMLAttributes, {
            contenteditable: false,
            editable: false,
          }),
          0,
        ];
      },

      addProseMirrorPlugins() {
        return [
          new Plugin({
            props: {
              handleDOMEvents: {
                // prevent dragging nodes out of the figure
                dragstart: (view, event) => {
                  if (!event.target) {
                    return false;
                  }

                  const pos = view.posAtDOM(event.target, 0);
                  const $pos = view.state.doc.resolve(pos);

                  if ($pos.parent.type === this.type) {
                    event.preventDefault();
                  }

                  return false;
                },
              },
            },
          }),
        ];
      },

      // addNodeView() {
      //   return () => {
      //     const container = document.createElement("div");

      //     container.addEventListener("click", () => {
      //       alert("clicked on the container");
      //     });

      //     const content = document.createElement("div");
      //     container.append(content);

      //     return {
      //       dom: container,
      //       contentDOM: content,
      //     };
      //   };
      // },
    });

    this.editor = new Editor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: "Напишите что-нибудь …",
        }),
        Image.configure({
          editable: false,
        }),
        Figcaption,
        Figure,
      ],
      content: this.modelValue,
      onUpdate: () => {
        let content = null;
        if (
          this.editor.getHTML() == "<p></p>" ||
          this.editor.getHTML() == "<h3></h3>"
        ) {
          content = "";
        } else {
          content = this.editor.getHTML();
        }

        // HTML
        this.$emit("update:modelValue", content);

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    });

    this.editor.on("focus", () => {
      this.isActiveEditor = true;
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style scoped>
.editor {
  margin-top: 0.4rem;
  border-radius: 10px;
  background: white;
  margin-bottom: 25px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-editor {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  background: rgba(21, 0, 255, 0.1);
  position: relative;
  /* box-shadow: 0px 10px 50px #abb7e9; */
}

button {
  font-size: 0.8em;
  font-weight: 600;
  color: #0d0d0d;
  margin: 0.2rem;
  border: none;
  /* border: 1px solid black; */
  border-radius: 0.3rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  cursor: pointer;
}

.headline {
  font-size: 1.2em;
  font-weight: 600;
}

.is-active {
  color: #0000c5;
}

a,
a:visited {
  color: #01b5e6;
}

/* .ProseMirror > * + * {
  margin-top: 0.75em;
} */

/* .ProseMirror:focus {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
} */

.active-editor {
  border: 2px solid #1400ff;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}
</style>
