import { errorMSG } from "../stores"

export default (response) => {
    if (!response.succeeded) {
        if (response.data) {
            errorMSG.set(preproccess(response.data));
        }
        else if (response.messages?.length > 0) {
            errorMSG.set(response.messages);
        }
        else if (response.Exception) {
            errorMSG.set([response.Exception]);
        }
    }
}

function preproccess(data){
    return "TODO";
}
