import {resolvePromise} from "/src/resolvePromise.js";
import React, {useEffect} from "react";
import { googleSignInOut } from "./firebaseModel.js";

export default {
   queryBeforeLogin: "",
   searchParams: { q: "", _limit: 400, _offset: 0 },
   userState: { user: null, isLoggedIn: false }, //logged in user
   searchResultsPromiseState: {},
   searchDone: { done: false },

   logInOrOutWithGoogle() {
      //logs in or out using google
      this.queryBeforeLogin = this.searchParams.q;
      googleSignInOut(this.userState);
    },

      //returns the max amount more results can be gotten from the more results method
   getMaxResults() {
      if (this.searchResultsPromiseState.data) {
      const urlParams = new URLSearchParams(
         this.searchResultsPromiseState.data.last["@id"]
      );
      let currOffset = urlParams.get("_offset");
      if (!currOffset) currOffset = 0;
      this.prevMaxResults =
         (currOffset - this.searchParams._offset) / defaultLimit;
      return this.prevMaxResults;
      } else {
      return this.prevMaxResults;
      }
   }
}








