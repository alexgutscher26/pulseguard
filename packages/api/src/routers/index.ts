import { protectedProcedure, publicProcedure, router } from "../index";
import { teamRouter } from "./team";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  team: teamRouter,
});
export type AppRouter = typeof appRouter;
