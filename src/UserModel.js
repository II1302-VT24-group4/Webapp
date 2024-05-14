import React, { useEffect } from "react";
import {
  dbRemoveFromMeetingsField,
  dbUpdateMeetingsField,
  googleSignInOut,
  dbRooms,
  db,
  dbInsert,
  dbRead,
  dbDelete,
  dbGetFiles,
} from "./firebaseModel.js";

const defaultLimit = 400;
const rooms = await dbRooms;

export default {
  roomListDone: { done: false },
  queryBeforeLogin: "",
  searchParams: { q: "" },
  userState: { user: null, isLoggedIn: false }, //logged in user
  searchDone: { done: false },
  rooms: rooms,

  firebaseInsert(
    collection,
    entity,
    subCollection,
    subEntity,
    attribute,
    data,
    merge
  ) {
    dbInsert(
      collection,
      entity,
      subCollection,
      subEntity,
      attribute,
      data,
      merge
    );
  },

  firebaseRead(collection, entity, subCollection, subEntity) {
    return dbRead(collection, entity, subCollection, subEntity);
  },

  firebaseDelete(collection, entity, subCollection, subEntity) {
    dbDelete(collection, entity, subCollection, subEntity);
  },

  firebaseUpdateMeetingsField(collection, entity, value) {
    dbUpdateMeetingsField(collection, entity, value);
  },

  firebaseRemoveFromMeetingsField(collection, entity, value) {
    dbRemoveFromMeetingsField(collection, entity, value);
  },

  async getMeetingDates(collection, entity) {
    try {
      const result = await dbRead(collection, entity);
      return result.meetings;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  },

  firebaseGetFiles(room, date, time) {
    return dbGetFiles(room, date, time);
  },

  logInOrOutWithGoogle() {
    //logs in or out using google
    this.queryBeforeLogin = this.searchParams.q;

    googleSignInOut(this.userState);
  },

  currentQuery: "",
  searchResultsPromiseState: {},
  mediaFavourites: {},
  ready: true, //the state of the model compared to firebase
  office: [], //an array of all offices to choose from. Populated automatically
  isNavOpen: { open: false },
  isAlertMessage: { message: "" },
  isShowAlert: { alert: false },
  officeList: {},
  imageHolder: {},
  favHistReady: { ready: false },
  favHistOfficeList: {},
  favHistImageHolder: {},
  queryBeforeLogin: "",

  setSearchQuery(textForQuery) {
    //Sets the query for the search as the text inputted
    this.searchParams.q = textForQuery;
  },
  setSearchOffice(office) {
    //Search for specific building
    this.searchParams.office = office;
  },
  firstSearch: true,

  //Searches for the query in searchParams and saves it to searchResultsPromiseState.data
  doSearch() {
    let shouldSearch = this.currentQuery !== this.searchParams?.q; // Kontrollera om sökparametrarna har ändrats
    if (this.firstSearch) {
      shouldSearch = true;
      this.firstSearch = false;
    }
    for (const key in this.officeList) {
      if (
        this.officeList.hasOwnProperty(key) &&
        Array.isArray(this.officeList[key]) &&
        this.officeList[key].length === 0
      ) {
        shouldSearch = true;
      }
    }

    if (shouldSearch) {
      //this.searchDone.done = false;
      //console.log("Gör sökning");
      this.officeList = []; // Rensa tidigare sökresultat
      this.searchResultsPromiseState.data = { items: [] }; // Rensa tidigare sökresultat
      this.currentQuery = this.searchParams.q;

      if (!this.currentQuery && !this.searchParams.office) {
        this.searchResultsPromiseState.data = { items: this.rooms }; // Om inga sökparametrar är angivna, returnera alla rum
      } else {
        const queryLower = this.currentQuery
          ? this.currentQuery.toLowerCase()
          : "";
        const filteredRooms = this.rooms.filter((room) => {
          const nameMatch =
            room.name && room.name.toLowerCase().includes(queryLower);
          const officeMatch =
            room.office &&
            String(room.office).toLowerCase().includes(queryLower);
          const match = nameMatch || officeMatch; // Matchning kontrollerar både namn och kontor
          return (
            (!this.currentQuery || match) &&
            (!this.searchParams.office || officeMatch)
          );
        });

        this.searchResultsPromiseState.data = { items: filteredRooms }; // Spara filtrerade resultat
      }
    }
  },

  /*
    this.currentQuery = this.searchParams.q;
    let filteredRooms = rooms.filter((room) =>
      room.name.includes(this.currentQuery)
    );

    if (this.searchParams.office) {
      filteredRooms = filteredRooms.filter(
        (room) => room.office === this.searchParams.office
      );
    }

    this.searchResultsPromiseState.data = { items: filteredRooms };
    this.searchDone.done = true;
    */

  sortIntoOffice(item) {
    // Anta att 'office' är ett nummer och vi behöver mappa det till en strängbaserad nyckel
    const officeKey = `Office ${item.office}`;

    // Kontrollera att en lista existerar för detta kontor i officeList
    if (!this.officeList[officeKey]) {
      this.officeList[officeKey] = []; // Initiera listan om den inte finns
    }

    const mappedRoom = this.mapOfficeRooms(item);
    this.officeList[officeKey].push(mappedRoom);
    //console.log(`Added room to ${officeKey}:`, this.officeList[officeKey]);
  },
  getInfoOfArray(favHistArray) {
    this.favHistReady.ready = false;
    this.favHistImageHolder = {};
    this.favHistOfficeList = this.initializeOffices();

    if (!Array.isArray(favHistArray) || favHistArray.length === 0) {
      this.favHistReady.ready = true;
      return;
    }

    let completeItems = 0;
    favHistArray.forEach((id) => {
      const room = this.rooms.find((room) => room.id === id);
      if (room) {
        this.sortIntoOffice(room);
        this.favHistImageHolder[room.id] =
          "https://i.ibb.co/NyzjMQh/room-placeholder.webp";
        completeItems++;
      }
      if (completeItems === favHistArray.length) {
        this.favHistReady.ready = true;
      }
    });
  },

  modifyFavourites(room, add) {
    const officeKey = `Office ${room.office}`;
    if (!this.mediaFavourites[officeKey]) {
      this.mediaFavourites[officeKey] = [];
    }

    const roomIndex = this.mediaFavourites[officeKey].findIndex(
      (fav) => fav.id === room.id
    );

    if (add && roomIndex === -1) {
      this.mediaFavourites[officeKey].push(room);
    } else if (!add && roomIndex !== -1) {
      this.mediaFavourites[officeKey].splice(roomIndex, 1);
      if (this.mediaFavourites[officeKey].length === 0) {
        delete this.mediaFavourites[officeKey];
      }
    }
    console.log("Updated favourites list:", this.mediaFavourites);
  },
  /*
  removeFromFavourites(room) {
    const index = this.mediaFavourites.indexOf(room.id);
    if (index !== -1) {
      this.mediaFavourites.splice(index, 1);
      this.favHistOfficeList[room.office] = this.favHistOfficeList[
        room.office
      ].filter((r) => r.id !== room.id);
      this.favArrayChanged = !this.favArrayChanged; // Toggle favArrayChanged state
    }
  },
  */
  initializeOffices() {
    const uniqueOffices = new Set(
      this.rooms.map((room) => `office${room.office}`)
    );
    this.officeList = Array.from(uniqueOffices).reduce((acc, office) => {
      acc[office] = [];
      return acc;
    }, {});
  },

  getRooms() {
    this.searchDone.done = false;
    this.searchResultsPromiseState.data.items.forEach((item) => {
      const officeKey = `Office ${item.office}`;
      if (!this.officeList[officeKey]) {
        this.officeList[officeKey] = [];
      }
      if (!this.officeList[officeKey].some((room) => room.id === item.id)) {
        this.sortIntoOffice(item);
      }
    });
    this.searchDone.done = true;
  },

  mapOfficeRooms(item, imageHolder) {
    const itemInfo = {
      id: item.id,
      name: item.name,
      seats: item.seats,
      available: item.available,
      office: item.office,
    };
    //console.log(item.available);
    let counter = 1;

    this.imageHolder = {};
    this.rooms.forEach((room) => {
      this.imageHolder[room.id] = `src/images/room-images/room-${counter}.webp`; //= `src/images/room-images/room-${room.id}.webp`;
      counter++;
      counter = counter % 36;
    });
    return itemInfo;
  },
};
