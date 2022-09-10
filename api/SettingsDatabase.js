import { Component } from "react";

import configData from "../config.json";

export class SettingsDatabaseService extends Component {
  static myInstance = null;

  static getInstance() {
    return new SettingsDatabaseService();
  }

  async getCurrencyFromDatabase(id) {
    try {
      let url = `${configData.BASE_URL}/${id}/settings/currency.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async saveCurrencyToDatabase(id, currency) {
    let url = `${configData.BASE_URL}/${id}/settings/currency.json`;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(currency),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async editCurrencySettings(currency, userId, id) {
    let url = `${configData.BASE_URL}/${userId}/settings/currency/${id}.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(currency),
    });
  }

  async getThemeFromDatabase(id) {
    try {
      let url = `${configData.BASE_URL}/${id}/settings/theme.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async saveThemeToDatabase(id, theme) {
    let url = `${configData.BASE_URL}/${id}/settings/theme.json`;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(theme),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async editThemeSettings(theme, userId, id) {
    let url = `${configData.BASE_URL}/${userId}/settings/theme/${id}.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(theme),
    });
  }

  async deleteUserAccount(userId) {
    let url = `${configData.BASE_URL}/${userId}.json`;

    return await fetch(url, {
      method: "DELETE",
    });
  }
}

export default SettingsDatabaseService;
