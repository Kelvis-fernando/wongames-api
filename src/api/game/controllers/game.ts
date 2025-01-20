import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::game.game",
  ({ strapi }) => ({
    async populate(ctx) {
      console.log("Starting to populate...");

      console.log(ctx.query);

      ctx.send("Finishing populating...");
    },
  })
);
