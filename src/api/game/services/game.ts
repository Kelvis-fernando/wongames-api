import { factories } from "@strapi/strapi";
import slugify from "slugify";
import { JSDOM } from "jsdom";
import axios from "axios";

const getGameInfo = async (slug) => {
  const gogSlug = slug.replaceAll("-", "_").toLowerCase();

  const body = await axios.get(`https://www.gog.com/game/${gogSlug}`);
  const dom = new JSDOM(body.data);
  const rawDescription = dom.window.document.querySelector(".description");
  const description = rawDescription.innerHTML;
  const shortDescription = rawDescription.textContent.slice(0, 160);
  const ratingElement = dom.window.document.querySelector(
    ".age-restrictions__icon use"
  );

  return {
    description,
    shortDescription,
    rating: ratingElement
      ? ratingElement
          .getAttribute("xlink:href")
          .replace(/_/g, "")
          .replace("#", "")
      : "BR0",
  };
};

export default factories.createCoreService("api::game.game", () => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending`;

    const {
      data: { products },
    } = await axios.get(gogApiUrl);

    products[2].developers.map(async (developer) => {
      await strapi.service("api::developer.developer").create({
        data: {
          name: developer,
          slug: slugify(developer, { lower: true, strict: true }),
        },
      });
    });

    products[2].publishers.map(async (publisher) => {
      await strapi.service("api::publisher.publisher").create({
        data: {
          name: publisher,
          slug: slugify(publisher, { lower: true, strict: true }),
        },
      });
    });
  },
}));
