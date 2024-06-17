import { validateRequest } from "@/lib/auth";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET!,
});

export async function POST(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const groupIds = user.role === "guest" ? [] : ["user"];

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds,
    },
    {
      userInfo: {
        role: user.role,
      },
    },
  );

  const room = await liveblocks.updateRoom("shopping-list", {
    defaultAccesses: ["room:read", "room:presence:write"],
    groupsAccesses: {
      user: ["room:write"],
    },
  });

  return new Response(body, { status });
}
