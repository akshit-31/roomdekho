import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.store";
import userReducer from "./user/user.store";
import propertyReducer from "./property/property.store";
import searchReducer from "./search/search.store";
import matchReducer from "./match/match.store";
import chatReducer from "./chat/chat.store";
import notificationReducer from "./notification/notification.store";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    property: propertyReducer,
    search: searchReducer,
    match: matchReducer,
    chat: chatReducer,
    notification: notificationReducer,
  },
});
