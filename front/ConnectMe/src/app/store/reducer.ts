import { Action, createReducer, on } from '@ngrx/store';
import { chatResponse } from '../DTO/chatResponse';
import * as action from './action';

export interface State {
  //   imgList: any[];
  //   crntImgList:any[];
  //   pSelectedImage:string;
  //   level:string;
  //   timer:boolean,
  //   playTime:number,
  //   wait:boolean,
  //   puzzleUser:any[];
  currentUser: string;
  currentReciever: string;
  msgs: chatResponse[];
  currentChatHeads: chatResponse[];
  sentText: chatResponse;
  sentTextChat: chatResponse;
  unreadMessagesNo: Map<string, number>;
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
  currentReciever: '',
  currentUser: '',
  msgs: [],
  currentChatHeads: [],
  sentText: null,
  sentTextChat: null,
  unreadMessagesNo: new Map(),
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
  on(action.updateViewdMessage, (state, { msgs }) => {
    var newMsgs = [];
    msgs.forEach((m) => {
      newMsgs.push(m);
    });
    console.log('in reducer view msg');
    return {
      ...state,
      msgs: newMsgs,
    };
  }),
  on(action.updateurrentUser, (state, { currentUser }) => {
    var newCurrentUser = currentUser;
    console.log('in dispatch currentUser ');
    console.log(newCurrentUser);

    return {
      ...state,
      currentUser: newCurrentUser,
    };
  }),
  on(action.updateCurrentReciever, (state, { currentReciever }) => {
    var newCurentReciever = currentReciever;

    return {
      ...state,
      currentReciever: newCurentReciever,
    };
  }),
  on(action.updateCurrentChatHeads, (state, { currentChatHeads }) => {
    var newCurentChatHeads = [];
    newCurentChatHeads.forEach((m) => {
      currentChatHeads.push(m);
    });

    return {
      ...state,
      currentChatHeads: newCurentChatHeads,
    };
  }),
  on(action.updateRecentSentText, (state, { sentText }) => {
    var newSentText: chatResponse = sentText;
    console.log('in reducer updateRecentSentText');
    return {
      ...state,
      sentText: newSentText,
    };
  }),
  on(action.updateRecentSentTextChat, (state, { sentTextChat }) => {
    var newSentTextChat: chatResponse = sentTextChat;
    console.log('in reducer updateRecentSentTextchat');
    return {
      ...state,
      sentTextChat: sentTextChat,
    };
  })
);
