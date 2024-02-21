import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as appStore from './reducer';

export const selectAppState = createFeatureSelector<appStore.State>('app');
// export const selectImgList = createSelector(selectgameState,(state)=>{
//     return state.imgList;
// });
// export const selectCrntImgList = createSelector(selectgameState,(state)=>{
//     return state.crntImgList;
// });
// export const selectSelectedImg = createSelector(selectgameState,(state)=>{
//     return state.pSelectedImage;
// });
// export const selectLevel = createSelector(selectgameState,(state)=>{
//     return state.level;
// });
// export const selectTimer = createSelector(selectgameState,(state)=>{
//     return state.timer;
// });
// export const selectTimeToPlay = createSelector(selectgameState,(state)=>{
//     return state.playTime;
// });
// export const selectwait = createSelector(selectgameState,(state)=>{
//     return state.wait;
// });
/* export const selectPuzzleUser = createSelector(selectgameState,(state)=>{
    return state.puzzleUser;
}); */
export const selectCurrentUser = createSelector(selectAppState, (state) => {
  return state.currentUser;
});
export const selectViewMessage = createSelector(selectAppState, (state) => {
  return state.msgs;
});
export const selectCurrentReciever = createSelector(selectAppState, (state) => {
  return state.currentReciever;
});
export const selectCurrentChatHeads = createSelector(
  selectAppState,
  (state) => {
    return state.currentChatHeads;
  }
);
export const selectRecentSentText = createSelector(selectAppState, (state) => {
  return state.sentText;
});

export const selectRecentSentTextChat = createSelector(
  selectAppState,
  (state) => {
    return state.sentTextChat;
  }
);

export const selectUnreadMessagesNo = createSelector(
  selectAppState,
  (state) => {
    return state.unreadMessagesNo;
  }
);

export const selectUserImage = createSelector(selectAppState, (state) => {
  return state.image;
});

export const selectRecieverImage = createSelector(selectAppState, (state) => {
  return state.rimage;
});

export const selectFriendsNames = createSelector(selectAppState, (state) => {
  return state.friends;
});

export const selectOthersLocation = createSelector(selectAppState, (state) => {
  return state.others_locations;
});

export const selectDisplayPic = createSelector(selectAppState, (state) => {
  return state.displayPic;
});

export const selectMsgidupdate = createSelector(selectAppState, (state) => {
  return state.msgidupdate;
});

export const selectCurrentchatid = createSelector(selectAppState, (state) => {
  return state.currentchatid;
});

export const selectDeletedchatid = createSelector(selectAppState, (state) => {
  return state.deletedchatid;
});
export const selectDeletedmessageidid = createSelector(
  selectAppState,
  (state) => {
    return state.deletedmessageidid;
  }
);
export const selectDeletedmessageidse = createSelector(
  selectAppState,
  (state) => {
    return state.deletedmessageidse;
  }
);
