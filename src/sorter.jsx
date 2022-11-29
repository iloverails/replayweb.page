import { LitElement, html, css } from "lit";
import { wrapCss } from "./misc";

import fasSortDown from "@fortawesome/fontawesome-free/svgs/solid/sort-down.svg";
import fasSortUp from "@fortawesome/fontawesome-free/svgs/solid/sort-up.svg";
import { RangepickerComponent } from "./react-components/Rangepicker.component.jsx";
import * as ReactDOMClient from "react-dom/client";

import React from "react";

// ===========================================================================
class Sorter extends LitElement
{

  constructor() {
    super();
    this.sortedData = [];
    this.data = [];

    this.pageResults = 0;
    this.numResults = 0;

    this.sortKey = null;
    this.sortDesc = null;

    this.filtersObj = {};
  }

  static get properties() {
    return {
      id: { type: String },

      pageResults: {type: Number},

      data: { type: Array },
      sortedData: { type: Array },

      sortKey: { type: String },
      sortDesc: { type: Boolean },
    };
  }

  firstUpdated() {
    if (this.id) {
      const sortKey = localStorage.getItem(`${this.id}:sortKey`);
      if (sortKey !== null) {
        this.sortKey = sortKey;
      }
      const sortDesc = localStorage.getItem(`${this.id}:sortDesc`);
      if (sortDesc !== null) {
        this.sortDesc = sortDesc === "1";
      }
    }

    const root = ReactDOMClient.createRoot(this.shadowRoot.getElementById("rangepicker"));

    let self = this;

    const datesChanged = function (dates) {

      let datesObj = {};
      if (dates && dates[0]) {
        datesObj.startDate = dates[0].unix()*1000;
      }
      if (dates && dates[1]) {
        datesObj.endDate = dates[1].unix()*1000;
      }

      self.filterData(datesObj);

    };

    root.render(<RangepickerComponent datesChanged={datesChanged} />);
  }

  updated(changedProperties) {
    const keyChanged = changedProperties.has("sortKey");
    const descChanged = changedProperties.has("sortDesc");
    const dataChanged = changedProperties.has("data");

    if (keyChanged && this.sortKey !== null) {
      localStorage.setItem(`${this.id}:sortKey`, this.sortKey);
    }

    if (descChanged && this.sortDesc !== null) {
      localStorage.setItem(`${this.id}:sortDesc`, this.sortDesc ? "1" : "0");
    }

    if (keyChanged || descChanged || dataChanged) {
      this.sortData();
    }
    // console.log()
  }

  filterData(filterObj){
    this.sortedData = [...this.data];
    this.numResults = this.pageResults;

    if (filterObj.startDate && filterObj.endDate) {
      this.sortedData = this.sortedData.filter(data => data.ts >= filterObj.startDate && data.ts <= filterObj.endDate);
    } else if (filterObj.startDate) {
      this.sortedData = this.sortedData.filter(data => data.ts >= filterObj.startDate);
    } else if (filterObj.endDate) {
      this.sortedData = this.sortedData.filter(data => data.ts <= filterObj.endDate);
    }

    this.sendSortChanged();
  }

  sortData() {
    this.sortedData = [...this.data];
    this.numResults = this.pageResults;

    if (this.sortKey === "") {
      if (this.sortDesc) {
        this.sortedData.reverse();
      }
    } else {
      this.sortedData.sort((first, second) => {
        if (first[this.sortKey] === second[this.sortKey]) {
          return 0;
        }

        return (this.sortDesc == (first[this.sortKey] < second[this.sortKey])) ? 1 : -1;
      });
    }

    this.sendSortChanged();
  }

  sendSortChanged() {
    const detail = {
      sortKey: this.sortKey,
      sortDesc: this.sortDesc,
      sortedData: this.numResults ? this.sortedData.slice(0, this.numResults) : this.sortedData
    };

    this.dispatchEvent(new CustomEvent("sort-changed", {detail}));
  }

  getMore(more = 100) {
    if (this.pageResults && this.numResults >= this.sortedData.length) {
      return;
    }

    this.numResults += more;
    this.sendSortChanged();
  }

  static get styles() {
    return wrapCss(css`
      :host {
        min-width: 100px;
        box-sizing: border-box !important;
      }
      button.button.is-small {
        border-radius: 4px;
      }
    `);
  }

  render() {
    return html`
        <div id="rangepicker"></div>
        <div style="margin-top: 10px">
            <div class="select is-small">
                <select id="sort-select" @change=${(e) => this.sortKey = e.currentTarget.value}>
                    ${this.sortKeys.map((sort) => html`
                        <option value="${sort.key}" ?selected="${sort.key === this.sortKey}">Sort By: ${sort.name}
                        </option>
                    `)}
                </select>
            </div>
            <button @click=${() => this.sortDesc = !this.sortDesc} class="button is-small">
                <span>Order:</span>
                <span class="is-sr-only">${this.sortDesc ? "Ascending" : "Descending"}</span>
                <span class="icon"><fa-icon aria-hidden="true" .svg=${this.sortDesc ? fasSortUp : fasSortDown}></span>
            </button>
        </div>`;
  }
}

customElements.define("wr-sorter", Sorter);

export { Sorter };
