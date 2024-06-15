"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_rMDG4vxRCvq6jUZVHKO0mjM4WM6WqP8KWHAum-M1VJ2Vk2-v8TnhRU_AsS52_BRh"
      }
    >
      <RoomProvider id="my-room" initialPresence={{}}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
