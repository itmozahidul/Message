import { createAction, props } from '@ngrx/store';
import { chatResponse } from '../DTO/chatResponse';
import { Gifformat } from '../DTO/Gifformat';

export const updateImgList = createAction(
  '[puzzle] updateImgList',
  props<{ imgList: any[] }>()
);
export const updateCrntImgList = createAction(
  '[puzzle] updateCrntImgList',
  props<{ crntImgList: any[] }>()
);
export const updateSelectedImage = createAction(
  '[puzzle] updateSelecteImage',
  props<{ selectedImg: string }>()
);
export const updateLevel = createAction(
  '[puzzle] updateLevel',
  props<{ level: string }>()
);
export const updateTimerMode = createAction(
  '[puzzle] updateTimerMode',
  props<{ timer: boolean }>()
);
export const updatePlayTime = createAction(
  '[puzzle] updatePlayTimer',
  props<{ timeToPlay: number }>()
);
export const updatewait = createAction(
  '[puzzle] updatewait',
  props<{ wait: boolean }>()
);
//export const updatePuzzleUser = createAction('[puzzle] updatePuzzleUser', props<{puzzleUser:any[]}>());
export const updateurrentUser = createAction(
  '[app] updateurrentUser',
  props<{ currentUser: string }>()
);
export const updateViewdMessage = createAction(
  '[app] updateViewdMessage',
  props<{ msgs: chatResponse[] }>()
);

export const updateCurrentReciever = createAction(
  '[app] updateCurrentReciever',
  props<{ currentReciever: string }>()
);

export const updateCurrentChatHeads = createAction(
  //to load for first time data from back when chat page is opened
  '[app] updateCurrentChatHeads',
  props<{ currentChatHeads: chatResponse[] }>()
);

export const updateRecentSentText = createAction(
  '[app] updateRecentSentText',
  props<{ sentText: chatResponse }>()
);
export const updateRecentSentTextChat = createAction(
  '[app] updateRecentSentTextChat',
  props<{ sentTextChat: chatResponse }>()
);

export const updateUnreadMessagesNo = createAction(
  '[app] updateUnreadMessagesNo',
  props<{ unreadMessagesNo: Map<string, number> }>()
);

export const updateUserImage = createAction(
  '[app] updateUserImage',
  props<{ image: string }>()
);

export const updateRecieverImage = createAction(
  '[app] updateRecieverImage',
  props<{ rimage: string }>()
);

export const updatFriendsNames = createAction(
  '[app] updatFriendsNames',
  props<{ friends: string[] }>()
);

export const updateOthersLocation = createAction(
  '[app] updateOthersLocation',
  props<{ others_locations: string[] }>()
);

export const updateDisplayPic = createAction(
  '[app] updateDisplayPic',
  props<{ displayPic: string }>()
);

export const updateMsgidupdate = createAction(
  '[app] updateMsgidupdate',
  props<{ msgidupdate: string }>()
);

export const updateCurrrentchatid = createAction(
  '[app] updateCurrrentchatid',
  props<{ currentchatid: string }>()
);

export const updateDeletedchatid = createAction(
  '[app] updateDeletedchatid',
  props<{ deletedchatid: string }>()
);

export const updateDeletedmessageidid = createAction(
  '[app] updateDeletedmessageidid',
  props<{ deletedmessageidid: string }>()
);

export const updateDeletedmessageidse = createAction(
  '[app] updateDeletedchatidse',
  props<{ deletedmessageidse: string }>()
);

export const updateGifs = createAction(
  '[app] updateGifs',
  props<{ gifs: Gifformat[] }>()
);

export const updateOffer = createAction(
  '[app] updateOffer',
  props<{ offer: string }>()
);

export const updateAns = createAction(
  '[app] updateAns',
  props<{ ans: string }>()
);

export const updateCand = createAction(
  '[app] updateCand',
  props<{ cand: string }>()
);
export const updateOffer2 = createAction(
  '[app] updateOffer2',
  props<{ offer2: string }>()
);

export const updateAns2 = createAction(
  '[app] updateAns2',
  props<{ ans2: string }>()
);

export const updateCand2 = createAction(
  '[app] updateCand2',
  props<{ cand2: string }>()
);

export const updateCallend = createAction(
  '[app] updateCallend',
  props<{ callend: number }>()
);

export const updateCall = createAction(
  '[app] updateCall',
  props<{ call: string }>()
);

export const updateansr = createAction(
  '[app] updateansr',
  props<{ ansr: string }>()
);

export const updatetalkingpartner = createAction(
  '[app] updatetalkingpartner',
  props<{ talkingpartner: string }>()
);

export const updatetalkingpartnero = createAction(
  '[app] updatetalkingpartnero',
  props<{ talkingpartnero: string }>()
);

export const updategotocallwith = createAction(
  '[app] updategotocallwith',
  props<{ gotocallwith: string }>()
);

export const updatePc = createAction(
  '[app] updatePc',
  props<{ pc: RTCPeerConnection }>()
);

export const updaterequesttomute = createAction(
  '[app] updaterequesttomute',
  props<{ requesttomute: string }>()
);

export const updatepausevideo = createAction(
  '[app] updatepausevideo',
  props<{ pausevideo: string }>()
);
