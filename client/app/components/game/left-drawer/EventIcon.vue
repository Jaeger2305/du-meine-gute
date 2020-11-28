<template>
  <GridLayout
    columns="*"
    rows="*"
    :class="[
      'event-icon-container',
      `lowlight-outline-${eventSource}`,
      `highlight-bg-${eventSource}`,
    ]"
  >
    <StackLayout style="vertical-align: center">
      <Label v-if="iconConfig.text" :text="iconConfig.text" class="fa-icon" />
      <Image v-if="iconConfig.src" :imageSource="iconConfig.src" />
    </StackLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { EventSource, EventType } from "../../../game/types";

type ImageIcon = {
  src: string;
};
type TextIcon = {
  text: string;
};

const iconImageLookup: Record<EventType, ImageIcon | TextIcon> = {
  [EventType.Draw]: {
    text: "\uf7c2",
  },
  [EventType.Discard]: {
    text: "\uf7c2",
  },
  [EventType.MarketOpened]: {
    text: "\uf6c4",
  },
  [EventType.MarketClosed]: {
    text: "\uf6c4",
  },
  [EventType.FactoryOpened]: {
    text: "\uf54f",
  },
  [EventType.Production]: {
    text: "\uf6e3",
  },
  [EventType.PointsUpdate]: {
    text: "\uf3ed",
  },
  [EventType.HiredEmployee]: {
    text: "\uf500",
  },
  [EventType.Construction]: {
    text: "\uf54f",
  },
};

export default {
  props: {
    eventSource: {
      type: String as PropType<EventSource>,
      required: true,
    },
    eventType: {
      type: String as PropType<EventType>,
      required: true,
    },
  },
  computed: {
    iconConfig() {
      return iconImageLookup[this.eventType];
    },
  },
};
</script>

<style scoped>
.event-icon-container {
  width: 100%;
  height: 100%;
  border-radius: 5%;
  border-width: 10px;
}

.fa-icon {
  font-size: 45px;
  font-family: "Font Awesome 5 Free Solid", "fa-solid-900";
  text-align: center;
}

.event-message {
  padding-left: 90px;
  margin: 20px;
  font-size: 16px;
  font-family: "Grandstander", "Grandstander-Regular";
  text-align: center;
}

.lowlight-outline-self {
  border-color: var(--self-color-lowlight);
}
.lowlight-bg-self {
  background-color: var(--self-color-lowlight);
}
.highlight-bg-self {
  background-color: var(--self-color-highlight);
}
.base-bg-self {
  background-color: var(--self-color-base);
}

.lowlight-outline-server {
  border-color: var(--server-color-lowlight);
}
.lowlight-bg-server {
  background-color: var(--server-color-lowlight);
}
.highlight-bg-server {
  background-color: var(--server-color-highlight);
}
.base-bg-server {
  background-color: var(--server-color-base);
}

.lowlight-outline-opponent {
  border-color: var(--opponent-color-lowlight);
}
.lowlight-bg-opponent {
  background-color: var(--opponent-color-lowlight);
}
.highlight-bg-opponent {
  background-color: var(--opponent-color-highlight);
}
.base-bg-opponent {
  background-color: var(--opponent-color-base);
}
</style>
