import { Component } from "react";

export class TickerDataService extends Component {
  static myInstance = null;

  static getInstance() {
    return new TickerDataService();
  }

  async getTickerData(enteredText) {
    try {
      let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${enteredText
          .toString()
          .toLowerCase()}`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async getTop250Tickers() {
    try {
      let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=250&page=1&sparkline=false`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }
}

export default TickerDataService;
