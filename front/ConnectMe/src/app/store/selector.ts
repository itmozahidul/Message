import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as appStore from "../store/reducer"

export const selectAppState = createFeatureSelector<appStore.State>(
    'app'
  );
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
 export const selectCurrentUser = createSelector(selectAppState,(state)=>{
     return state.currentUser;
 });
 export const selectMessags = createSelector(selectAppState,(state)=>{
    return state.messages;
});
export const selectMessagesCurrent = createSelector(selectAppState,(state)=>{
    return state.messagesCurrent;
});