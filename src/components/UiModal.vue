<script>
export default {
  name: 'UiModal',
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    disabledClose: {
      type: Boolean,
      default: false,
    },
    // 기본 버튼 사용 여부
    disabledButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showing: false,
      animate: false,
    };
  },
  watch: {
    showing(newValue) {
      setTimeout(() => {
        this.animate = newValue;
      }, 300);
    },
  },
  created() {
    this.$on('show', this.showModal);
    this.$on('hide', this.hideModal);
  },
  mounted() {},
  methods: {
    removeElement() {
      document.body.removeChild(this.$el);
    },
    showModal() {
      document.body.appendChild(this.$el);
      this.showing = true;
    },
    hideModal() {
      this.animate = false;
      setTimeout(() => {
        this.showing = false;
        this.removeElement();
      }, 300);
    },
  },
  render(h) {
    const title =
      this.title &&
      h(
        'h1',
        {
          staticClass: 'ui-modal__title',
        },
        this.title,
      );

    const message =
      this.message &&
      h(
        'p',
        {
          staticClass: 'ui-modal__message',
        },
        this.message,
      );

    const modalHeader = h(
      'header',
      {
        staticClass: 'ui-modal__header',
      },
      [title, message],
    );

    const slots = this.$slots.default.filter((slot) => {
      return slot.tag && slot.tag !== 'UiModalAction';
    });

    const modalContent = h(
      'section',
      {
        staticClass: 'ui-modal__content',
      },
      slots,
    );

    const actions = this.$slots.default.filter((slot) => {
      return slot.tag === 'UiModalAction' && !slots.includes(slot);
    });

    const modalActions =
      !actions.length && this.disabledButton
        ? null
        : h(
            'section',
            {
              staticClass: 'ui-modal__actions',
              class: [actions.length > 2 ? 'horizontal' : ''],
            },
            actions.length
              ? actions.map((action) =>
                  h(
                    'button',
                    {
                      staticClass: action.data.staticClass,
                      on: { ...action.data.on },
                    },
                    [...action.children],
                  ),
                )
              : [
                  h(
                    'button',
                    {
                      on: {
                        click: this.hideModal,
                      },
                    },
                    '확인',
                  ),
                ],
          );

    const modal = h(
      'div',
      {
        staticClass: 'ui-modal__wrap',
      },
      [modalHeader, modalContent, modalActions],
    );

    return h(
      'div',
      {
        staticClass: 'ui-modal',
        on: {
          click: (e) => {
            e.stopPropagation();

            // dim 영역 외 클릭 이벤트는 무시
            if (!e.target.classList.contains('ui-modal')) return;

            if (!this.disabledClose) {
              this.hideModal();
            }
          },
        },
        class: { showing: this.showing, animate: this.animate },
      },
      [modal],
    );
  },
};
</script>
<style lang="scss">
.ui-modal {
  display: none;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: -1;
  opacity: 0;
  background: rgba(0, 0, 0, 0.6);
  @include transition(0.3s opacity ease-in-out);

  &.showing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  &.animate {
    opacity: 1;

    & > .ui-modal__wrap {
      @include transform(translate3d(0px, 0px, 0px));
    }
  }

  &__wrap {
    // @include themed() {
    //   background: t('card-bg');
    // }
    min-width: 320px;
    max-width: 90vw;
    padding: 15px;
    border-radius: 8px;
    background: #fff;
    @include transition(0.3s transform ease-in-out);
    @include transform(translate3d(0px, -100px, 0px));
  }

  &__title {
    // @include title(2);
  }

  &__message {
    // @include description(3);
  }

  &__content {
    margin: 10px 0px 0px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    margin: 10px 0px 0px;
    column-gap: 5px;

    &.horizontal {
      flex-direction: column;
    }

    & > button {
      // @include button;
      width: 100%;
      margin: 5px 0px 0px;
    }
  }
}
</style>
