import {infoMSG} from "../stores"

export const ShowInfo = (message,duration=2000)=>{
    infoMSG.set([message])
    setTimeout(() => infoMSG.set([]), duration);
}