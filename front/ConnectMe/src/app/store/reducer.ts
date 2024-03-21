import { Action, createReducer, on } from '@ngrx/store';
import { chatResponse } from '../DTO/chatResponse';
import * as action from './action';
import { Gifformat } from '../DTO/Gifformat';

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
  msgidupdate: string;
  currentchatid: string;
  deletedchatid: string;
  deletedmessageidid: string;
  deletedmessageidse: string;
  gifs: Gifformat[];
  offer: string;
  ans: string;
  cand: string;
  offer2: string;
  ans2: string;
  cand2: string;
  callend: number;
  pc: RTCPeerConnection;
  call: string;
  ansr: string;
  talkingpartner: string;
  talkingpartnero: string;
  gotocallwith: string;
  requesttomute: string;
  pausevideo: string;
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
  msgidupdate: '',
  currentchatid: '',
  deletedchatid: '',
  deletedmessageidid: '',
  deletedmessageidse: '',
  gifs: [],
  offer: '',
  ans: '',
  cand: '',
  offer2: '',
  ans2: '',
  cand2: '',
  callend: 0,
  pc: null,
  call: '',
  ansr: '',
  talkingpartner: '',
  talkingpartnero: '',
  gotocallwith: '',
  requesttomute: '',
  pausevideo: '',
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
    return {
      ...state,
      image: newImage,
    };
  }),
  on(action.updateRecieverImage, (state, { rimage }) => {
    var newrImage: string = rimage;
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
    var newMsgidupdate: string = msgidupdate;

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
  }),
  on(action.updateGifs, (state, { gifs }) => {
    var newGifs: Gifformat[] = gifs;
    return {
      ...state,
      gifs: newGifs,
    };
  }),
  on(action.updateOffer, (state, { offer }) => {
    var newOffer: string = offer;
    return {
      ...state,
      offer: newOffer,
    };
  }),
  on(action.updateAns, (state, { ans }) => {
    var newAns: string = ans;
    return {
      ...state,
      ans: newAns,
    };
  }),
  on(action.updateCand, (state, { cand }) => {
    var newCand: string = cand;
    return {
      ...state,
      cand: newCand,
    };
  }),
  on(action.updateOffer2, (state, { offer2 }) => {
    var newOffer2: string = offer2;
    return {
      ...state,
      offer2: newOffer2,
    };
  }),
  on(action.updateAns2, (state, { ans2 }) => {
    var newAns2: string = ans2;
    return {
      ...state,
      ans2: newAns2,
    };
  }),
  on(action.updateCand2, (state, { cand2 }) => {
    var newCand2: string = cand2;
    return {
      ...state,
      cand2: newCand2,
    };
  }),
  on(action.updateCallend, (state, { callend }) => {
    var newCallend: number = callend;
    console.log('call ended');
    console.log(newCallend);
    return {
      ...state,
      callend: newCallend,
    };
  }),
  on(action.updateCall, (state, { call }) => {
    var newCall: string = call;
    console.log('call requested');
    console.log(newCall);
    return {
      ...state,
      call: newCall,
    };
  }),
  on(action.updateansr, (state, { ansr }) => {
    var newansr: string = ansr;
    console.log('call recieved');
    console.log(ansr);
    return {
      ...state,
      ansr: newansr,
    };
  }),
  on(action.updatetalkingpartner, (state, { talkingpartner }) => {
    var newtalkingpartner: string = talkingpartner;
    return {
      ...state,
      talkingpartner: newtalkingpartner,
    };
  }),
  on(action.updatetalkingpartnero, (state, { talkingpartnero }) => {
    var newtalkingpartnero: string = talkingpartnero;
    return {
      ...state,
      talkingpartnero: newtalkingpartnero,
    };
  }),

  on(action.updategotocallwith, (state, { gotocallwith }) => {
    var newgotocallwith: string = gotocallwith;
    return {
      ...state,
      gotocallwith: newgotocallwith,
    };
  }),

  on(action.updatePc, (state, { pc }) => {
    var newpc: RTCPeerConnection = pc;
    return {
      ...state,
      pc: newpc,
    };
  }),
  on(action.updaterequesttomute, (state, { requesttomute }) => {
    var newrequesttomute: string = requesttomute;
    return {
      ...state,
      requesttomute: newrequesttomute,
    };
  }),
  on(action.updatepausevideo, (state, { pausevideo }) => {
    var newpausevideo: string = pausevideo;
    return {
      ...state,
      pausevideo: newpausevideo,
    };
  })
);
