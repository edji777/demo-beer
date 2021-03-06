import axios from "axios";
import beerParser from "@/parsers/beerParser";
import oneBeerParser from "@/parsers/oneBeerParser";

export default {
  state: () => ({
    allBeers: [],
    namedBeer: [],
    foodBeers: [],
    randomBeer: {},
    oneBeer: {},
    isLoading: false,
    oneBeerError: false,
    allBeerError: false,
    page: 1,
    perPage: 10,
  }),

  getters: {},

  mutations: {
    setAllBeers(state, { beers, isNewReq }) {
      state.allBeers = !isNewReq ? beers : [...state.allBeers, ...beers];
    },

    setNamedBeer(state, { beer }) {
      state.namedBeer = [...beer];
    },

    setFoodsBeers(state, { beer }) {
      state.foodBeers = [...beer];
    },

    setRandomBeer(state, beer) {
      state.randomBeer = beer;
    },

    setOneBeer(state, beer) {
      state.oneBeer = beer;
    },

    increasePage(state) {
      state.page = state.page + 1;
    },

    resetPage(state) {
      state.page = 1;
    },

    resetError(state) {
      state.oneBeerError = false;
      state.allBeerError = false;
    },
  },

  actions: {
    async getSearchBeer({ commit, state }, { beerParams, isNewReq }) {
      const customParams = Object.keys(beerParams).reduce((acc, param) => {
        if (beerParams[param]) {
          acc[param] = beerParams[param];
        }
        return acc;
      }, {});

      try {
        const response = await axios.get("https://api.punkapi.com/v2/beers", {
          params: {
            ...customParams,
            ...{ page: state.page, per_page: state.perPage },
          },
        });

        commit("setAllBeers", { beers: beerParser(response.data), isNewReq });
      } catch (error) {
        state.allBeerError = true;
      }
    },

    async getNamedBeer({ commit, state }, { beerParams }) {
      try {
        state.namedBeer = [];
        const response = await axios.get("https://api.punkapi.com/v2/beers", {
          params: {
            ...beerParams,
          },
        });

        commit("setNamedBeer", { beer: beerParser(response.data) });
      } catch (error) {
        state.allBeerError = true;
      }
    },

    async getFoodsBeers({ commit, state }, { beerParams }) {
      try {
        state.foodBeers = [];
        const response = await axios.get("https://api.punkapi.com/v2/beers", {
          params: {
            ...beerParams,
          },
        });

        commit("setFoodsBeers", { beer: beerParser(response.data) });
      } catch (error) {
        state.allBeerError = true;
      }
    },

    async getRandomBeer({ commit, state }) {
      try {
        const response = await axios.get(
          "https://api.punkapi.com/v2/beers/random"
        );

        commit("setRandomBeer", oneBeerParser(response.data));
      } catch (error) {
        state.allBeerError = true;
      }
    },

    async getOneBeer({ commit, state }, { beerId }) {
      state.isLoading = true;
      try {
        const response = await axios.get(
          `https://api.punkapi.com/v2/beers/${beerId}`
        );

        commit("setOneBeer", oneBeerParser(response.data));
      } catch (error) {
        state.oneBeerError = true;
      }
      state.isLoading = false;
    },
  },

  namespaced: true,
};
