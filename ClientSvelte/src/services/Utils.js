import { infoMSG } from "../stores";
import { mccDataEN, mccDataUK } from "./Data"

export const ShowInfo = (message, duration = 2000) => {
    infoMSG.set([message])
    setTimeout(() => infoMSG.set([]), duration);
}




export const GetDescriptionMCC = (code, short = true, lg = "en") => {

    var desc = [];

    if (lg == "en")
        desc = mccDataEN.find(el => el.mcc == code);
    if (lg == "uk")
        desc = mccDataUK.find(el => el.mcc == code);


    if (desc == null || desc == undefined || desc.length == 0) desc = code;
    else {
        desc = short ? desc.shortDescription : desc.fullDescription
    }
    return desc;
}
