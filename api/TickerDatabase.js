import { Component } from "react";

import configData from "../config.json";

export class TickerDatabaseService extends Component {
  static myInstance = null;

  static getInstance() {
    return new TickerDatabaseService();
  }

  async getTickersFromDatabase(id) {
    try {
      let url = `${configData.BASE_URL}/${id}/tickers.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async saveTickerToDatabase(id, ticker) {
    let url = `${configData.BASE_URL}/${id}/tickers.json`;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(ticker),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseJson = await response.json();
    return responseJson;
  }

  async deleteTickerFromDatabase(id, key) {
    let url = `${configData.BASE_URL}/${id}/tickers/${key}.json`;

    return await fetch(url, {
      method: "DELETE",
    });
  }
}

export default TickerDatabaseService;
