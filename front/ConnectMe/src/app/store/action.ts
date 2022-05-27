import { createAction, props } from '@ngrx/store';

export const updateImgList = createAction('[puzzle] updateImgList', props<{imgList:any[]}>());
export const updateCrntImgList = createAction('[puzzle] updateCrntImgList', props<{crntImgList:any[]}>());
export const updateSelectedImage = createAction('[puzzle] updateSelecteImage', props<{selectedImg:string}>());
export const updateLevel = createAction('[puzzle] updateLevel', props<{level:string}>());
export const updateTimerMode = createAction('[puzzle] updateTimerMode', props<{timer:boolean}>());
export const updatePlayTime = createAction('[puzzle] updatePlayTimer', props<{timeToPlay:number}>());
export const updatewait = createAction('[puzzle] updatewait', props<{wait:boolean}>());
//export const updatePuzzleUser = createAction('[puzzle] updatePuzzleUser', props<{puzzleUser:any[]}>());
export const updateurrentUser = createAction('[app] updateurrentUser', props<{currentUser:string}>());