import { createAction, props } from '@ngrx/store';
import { chatResponse } from '../DTO/chatResponse';

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
