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
  image: string;
  displayPic: string;
  rimage: string;
  friends: string[];
  others_locations: string[];
  msgidupdate: number;
  currentchatid: string;
  deletedchatid: string;
  deletedmessageidid: string;
  deletedmessageidse: string;
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
  image: '',
  displayPic: '',
  rimage: '',
  friends: [],
  others_locations: [],
  msgidupdate: -1,
  currentchatid: '',
  deletedchatid: '',
  deletedmessageidid: '',
  deletedmessageidse: '',
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
    console.log(
      ':::::::::::::::::::::::::::::s::::::::::::::::::::::::::::::::'
    );
    console.log(
      '::::::::::::::::: viewed mesg updted::::::::::::::::::::::::::'
    );
    console.log('from ');
    console.log(state.msgs);
    console.log(' to ');
    console.log(msgs);
    console.log(
      ':::::::::::::::::::::::::::::e::::::::::::::::::::::::::::::::'
    );
    if (msgs != null && msgs != undefined) {
      msgs.forEach((m) => {
        newMsgs.push(m);
      });
    }
    return {
      ...state,
      msgs: newMsgs,
    };
  }),
  on(action.updateurrentUser, (state, { currentUser }) => {
    var newCurrentUser = currentUser;

    return {
      ...state,
      currentUser: newCurrentUser,
    };
  }),
  on(action.updateCurrentReciever, (state, { currentReciever }) => {
    var newCurentReciever = currentReciever;
    console.log(
      '###########################s##################################'
    );
    console.log(
      '################### reciever changed ########################'
    );
    console.log('from ' + state.currentReciever + ' to ' + currentReciever);
    console.log(
      '############################e#################################'
    );
    return {
      ...state,
      currentReciever: newCurentReciever,
    };
  }),
  on(action.updateCurrentChatHeads, (state, { currentChatHeads }) => {
    console.log(
      '***************************s*********************************'
    );
    console.log('****************** chatheads updated ***********************');
    console.log('from ');
    console.log(state.currentChatHeads);
    console.log(' to ');
    console.log(currentChatHeads);
    console.log(
      '****************************e*********************************'
    );
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
    return {
      ...state,
      sentText: newSentText,
    };
  }),
  on(action.updateRecentSentTextChat, (state, { sentTextChat }) => {
    var newSentTextChat: chatResponse = sentTextChat;
    return {
      ...state,
      sentTextChat: sentTextChat,
    };
  }),
  on(action.updateUserImage, (state, { image }) => {
    var newImage: string = image;
    console.log('sender img');
    return {
      ...state,
      image: newImage,
    };
  }),
  on(action.updateRecieverImage, (state, { rimage }) => {
    var newrImage: string = rimage;
    console.log('reciever img');
    return {
      ...state,
      rimage: newrImage,
    };
  }),
  on(action.updatFriendsNames, (state, { friends }) => {
    var newFriends: string[] = friends;
    return {
      ...state,
      friends: newFriends,
    };
  }),
  on(action.updateOthersLocation, (state, { others_locations }) => {
    var newOthers_locations: string[] = others_locations;

    return {
      ...state,
      others_locations: newOthers_locations,
    };
  }),
  on(action.updateDisplayPic, (state, { displayPic }) => {
    var newDisplayPic: string = displayPic;

    return {
      ...state,
      displayPic: newDisplayPic,
    };
  }),
  on(action.updateMsgidupdate, (state, { msgidupdate }) => {
    var newMsgidupdate: number = msgidupdate;

    return {
      ...state,
      msgidupdate: newMsgidupdate,
    };
  }),
  on(action.updateCurrrentchatid, (state, { currentchatid }) => {
    var newCurrentchatid: string = currentchatid;
    return {
      ...state,
      currentchatid: newCurrentchatid,
    };
  }),
  on(action.updateDeletedchatid, (state, { deletedchatid }) => {
    var newDeletedchatid: string = deletedchatid;
    return {
      ...state,
      deletedchatid: newDeletedchatid,
    };
  }),
  on(action.updateDeletedmessageidid, (state, { deletedmessageidid }) => {
    var newDeletedmessageidid: string = deletedmessageidid;
    return {
      ...state,
      deletedmessageidid: newDeletedmessageidid,
    };
  }),
  on(action.updateDeletedmessageidse, (state, { deletedmessageidse }) => {
    var newDeletedmessageidse: string = deletedmessageidse;
    return {
      ...state,
      deletedmessageidse: newDeletedmessageidse,
    };
  })
);
