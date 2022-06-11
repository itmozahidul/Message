import { Action, createReducer, on } from '@ngrx/store';
import { chatResponse } from '../DTO/chatResponse';
import * as action from '../Store/action';

export interface State {
//   imgList: any[];
//   crntImgList:any[];
//   pSelectedImage:string;
//   level:string;
//   timer:boolean,
//   playTime:number,
//   wait:boolean,
//   puzzleUser:any[];
currentUser:string;
messagesCurrent:Map<string, chatResponse[]>;
messages:Map<string, chatResponse[]>;
}

export const initialState: State = {
    // imgList: [],
    // crntImgList: [],
    // pSelectedImage:"assets/images/puzzle/pic_1.jpg",
    // level:"Easy",
    // timer:false ,
    // playTime:1,
    // wait:true,
    // puzzleUser:[]
    currentUser:localStorage.getItem("currentUser"),
    messagesCurrent: new Map<string, chatResponse[]>(),
    messages: new Map<string, chatResponse[]>()
  };

  export const appReducer = createReducer(
    initialState,
   /*  on(action.updateImgList, (state,{imgList}) => {
        var newImgList = imgList;
        console.log("in dispatch img lst");
        return {
            ...state,
            imgList: newImgList,
        };
    }),
    on(action.updateCrntImgList, (state,{crntImgList}) => {
        var newCrntImgList = crntImgList;
        console.log("in dispatch crnt img lst ");
        return {
            ...state,
            crntImgList: newCrntImgList,
        };
    }),
    on(action.updateSelectedImage, (state,{selectedImg}) => {
      var newSelectedImg = selectedImg;
      console.log("in dispatch  selected Image ");
      return {
          ...state,
          pSelectedImage: newSelectedImg,
      };
    }),
    on(action.updateLevel, (state,{level})=>{
      var newLevel = level;
      return {
        ...state,
        level:newLevel,
      };
    }),
    on(action.updateTimerMode, (state,{timer})=>{
      var newTimer = timer;
      console.log("in dispatch Timer ");
      return {
        ...state,
        timer:newTimer,
      }
    }),
    on(action.updatePlayTime, (state,{timeToPlay})=>{
      var newTimeToPlay = timeToPlay;
      console.log("in dispatch play time ");
      console.log(timeToPlay);
    
    return {
      ...state,
      playTime:newTimeToPlay,
    }
  }),
  on(action.updatewait, (state,{wait})=>{
    var newwait = wait;
    console.log("in dispatch wait ");
  
  return {
    ...state,
    wait:newwait,
  }
}), */
/* on(action.updatePuzzleUser, (state,{puzzleUser})=>{
  var newPuzzleUser = puzzleUser;
  console.log("in dispatch PuzzleUser ");
  console.log(newPuzzleUser);
return {
  ...state,
  puzzleUser:newPuzzleUser,
}
}), */

  on(action.updateurrentUser, (state,{currentUser})=>{
    var newCurrentUser = currentUser;
    console.log("in dispatch currentUser ");
    console.log(newCurrentUser);
  
  return {
    ...state,
    currentUser:newCurrentUser,
  }
}),
on(action.updateMessages, (state,{msgs})=>{
  var newMsgs = msgs;
  console.log("in dispatch updtae msgs ");
  console.log(msgs);

return {
  ...state,
  messages:newMsgs,
}
}),
on(action.updateCurrentMessages, (state,{msgs})=>{
  var newMsgs = msgs;
  console.log("in dispatch updtae current msgs ");
  console.log(msgs);

return {
  ...state,
  messagesCurrent:newMsgs,
}
}),
  );
  