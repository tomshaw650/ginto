import type { LiveList, LiveObject } from "@liveblocks/client";

type Item = {
  text: string;
  checked?: boolean;
};

declare global {
  interface Liveblocks {
    Storage: {
      items: LiveList<LiveObject<Item>>;
    };
  }
}
