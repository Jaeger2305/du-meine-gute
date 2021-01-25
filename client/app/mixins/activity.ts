export const activity = {
  props: {
    isAnimated: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      isActionHappening: false,
    };
  },
  watch: {
    // This is relying on external props, which could either be internalised, or an array of props to watch could be passed in here instead.
    // Not very robust, but still better than duplicating the same code lots of times.
    displayNumber() {
      if (!this.isAnimated) return;
      this.isActionHappening = false;
      this.$nextTick(() => (this.isActionHappening = true));
    },
  },
};
